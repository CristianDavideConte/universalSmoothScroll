import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";

export class SmoothScrollbarBuilder extends SmoothScrollBuilder {

    #scrollbarSetup;
    
    //Parameters already sanitized.
    constructor(container, options) {
        super(container, options);

        this.#scrollbarSetup = (scrollbar, setCalculatorFun, handleOriginalContainerScrolling, handlePointerDownOnScrollbarContainer) => {
            //Disengage the scrollbar and execute any callback.
            let __pointerIsHoveringTrack = false;
            const __disengageScrollbar = (event) => {    
                //Wait for the initial pointer to leave the touch-surface.
                if(event.pointerId !== scrollbar.pointerId) return;

                //Update the ids of the pointer device that was controlling the scrollbar. 
                //Since the pointerId must be null on pointer up, the only way to retrieve its value
                //from outside is to save it into a another variable (i.e. previousPointerId). 
                scrollbar.previousPointerId = scrollbar.pointerId;
                scrollbar.pointerId = null;

                //Remove the unecessary listeners.
                window.removeEventListener("pointermove", handleOriginalContainerScrolling, {passive:false});     
                window.removeEventListener("pointerup", __disengageScrollbar, {passive:false});   

                //Check if the scrollbar status should be set to idle.
                if(!__pointerIsHoveringTrack) {
                    scrollbar.container.dataset.ussScrollbarIdle = true; 
                }
            }
            
            //Engage the scrollbar.
            scrollbar.thumb.addEventListener("pointerdown", (event) => {
                //Only one pointer at a time can control the scrollbar.
                if(scrollbar.isEngaged()) return;

                event.preventDefault();
                event.stopPropagation();

                scrollbar.pointerId = event.pointerId;
                
                setCalculatorFun(remaning => remaning, scrollbar.container, false, this.options); //Makes the scrollbar's movement instantaneous
                window.addEventListener("pointerup", __disengageScrollbar, {passive:false});
                window.addEventListener("pointermove", handleOriginalContainerScrolling, {passive:false});   
                
                this.originalContainer.dispatchEvent(
                    new PointerEvent(
                        "pointerdown", 
                        {
                            pointerId: scrollbar.pointerId,
                            pointerType: "scrollbar"
                        }
                    )
                )
            }, {passive:false});
            
            //If the user clicks the scrollbar track, the container should be scrolled to
            //the corresponding position and the scrollbar thumb should be moved accordingly.
            scrollbar.container.addEventListener("pointerdown", handlePointerDownOnScrollbarContainer, {passive:false});

            //The scrollbar's status is never set to idle if the pointer is on it.
            scrollbar.container.addEventListener("pointerenter", () => {
                __pointerIsHoveringTrack = true;
                if(scrollbar.isEngaged()) return;
                scrollbar.container.dataset.ussScrollbarIdle = false; 
            }, {passive:true});
            
            //The scrollbar's status is set to idle if the pointer  
            //is not hovering it and the scrollbar thumb isn't being used.
            scrollbar.container.addEventListener("pointerleave", () => {
                __pointerIsHoveringTrack = false;
                if(scrollbar.isEngaged()) return;
                scrollbar.container.dataset.ussScrollbarIdle = true; 
            }, {passive:true});

            //The scrollbar is initially in idle.
            scrollbar.container.dataset.ussScrollbarIdle = true; 

            uss.addOnResizeEndCallback(scrollbar.updateThumbLength, this.options);
            uss.addOnResizeEndCallback(scrollbar.updatePosition, this.options);

            //If new children are added/removed from the originalContainer (and its children) update the maxScrollX/Y
            //cached values and the scrollbar position (useful for lazy loading).
            const __mutationObserver = new MutationObserver(() => {
                scrollbar.updateCache(); //Perhaps introduce a "flushCache" method in the uss object
                scrollbar.updateThumbLength();
                scrollbar.updatePosition();
            });
            __mutationObserver.observe(this.originalContainer, {childList: true});

            return __mutationObserver;
        }
    }

    build() {
        this.onXAxis = this.options.onXAxis;
        this.onYAxis = this.options.onYAxis;

        //Modify the container overflow's styles before caching the maxScrollX/Y values.
        if(this.onXAxis) this.originalContainer.style.overflowX = "hidden";
        if(this.onYAxis) this.originalContainer.style.overflowY = "hidden";

        if(this.onXAxis) {
            const _offset = this.onYAxis ? this.options.thumbSize : 0;
            const _scrollbar = {
                container: document.createElement("div"),
                track: document.createElement("div"),
                thumb: document.createElement("div"),
                previousPointerId: null,
                pointerId: null,
                isEngaged: () => _scrollbar.pointerId !== null,
                updateThumbLength: () => {
                    const __size = _scrollbar.container.clientWidth * _scrollbar.container.clientWidth / this.originalContainer.scrollWidth;
                    _scrollbar.thumb.style.width = __size;
                    _scrollbar.thumb.style.marginLeft = `-${__size}px`;
                },
                updateCache: () => uss.getMaxScrollX(this.originalContainer, true, this.options)
            }

            //Default dataset.
            _scrollbar.container.dataset.uss = "scrollbar-container-x";
            _scrollbar.track.dataset.uss = "scrollbar-track-x";
            _scrollbar.thumb.dataset.uss = "scrollbar-thumb-x";

            //Scrollbar container visibility styles.
            _scrollbar.container.style = `
                contain: style paint;
                touch-action: none;
                position: absolute;
                z-index: 100;
                bottom: 0px;
                left: 0px;
                width: calc(100% - ${_offset}px);
                height: ${this.options.thumbSize}px;
                overflow: hidden;
            `

            //Scrollbar track visibility styles.
            _scrollbar.track.style = `
                height: 100%;
                width: 200%;
            ` 

            //Scrollbar thumb visibility styles.
            _scrollbar.thumb.style = `
                position: absolute;
                touch-action: none;
                left: 100%;
                height: 100%;
            `

            //Accessibility styles.
            _scrollbar.container.tabIndex = -1;
            _scrollbar.track.tabIndex = -1;
            _scrollbar.thumb.tabIndex = -1;
            
            //Updates the scrollbar position and manages 
            //the underlying SmoothScrollBuilder callback execution.
            _scrollbar.updatePosition = () => {
                //The _scrollbar.thumb.clientWidth may be not updated when resizing the window,
                //it's better to use the _scrollbar.thumb.style.width.
                const __thumbSize = Number.parseInt(_scrollbar.thumb.style.width);
                const __containerSize = _scrollbar.container.clientWidth;
                
                let __scrolledPercentage = 1 - uss.getFinalXPosition(this.originalContainer, this.options) / uss.getMaxScrollX(this.originalContainer, false, this.options);
                __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                       __scrolledPercentage < 0 || !__scrolledPercentage ? 0 : 
                                       __scrolledPercentage;
                                       
                //The scrollbar.container has the same easing pattern as the originalContainer.
                //TODO: if the deltaX is small EASE_OUT_BOUNCE (perhaps other stepLenCal too) only works if deltaX is < 0 
                if(!_scrollbar.isEngaged()) {
                    const __easing = uss.getXStepLengthCalculator(this.originalContainer, true)  || 
                                     uss.getXStepLengthCalculator(this.originalContainer, false) || 
                                     (r => r / 25 + 1);
                    uss.setXStepLengthCalculator(__easing, _scrollbar.container, false, this.options);
                }
                uss.scrollXTo(__scrolledPercentage * (__containerSize - __thumbSize), _scrollbar.container);
            }

            //Scroll the container on a pointermove event by the correspoing amount.
            const _handleOriginalContainerScrolling = (event) => { 
                event.preventDefault();
                event.stopPropagation();

                //Only one pointer at a time can control the scrollbar.
                if(_scrollbar.pointerId !== event.pointerId) return;

                const __delta = event.movementX; 
                if(__delta === 0) return; 

                const __containerScrollSize = this.originalContainer.scrollWidth;
                const __containerClientSize = this.originalContainer.clientWidth;
                if(__containerScrollSize === __containerClientSize) return;

                const __finalDelta = __delta * __containerScrollSize / __containerClientSize;

                //Synchronous call that will execute updatePosition after it.
                this.originalContainer.dispatchEvent(
                    new WheelEvent(
                        "wheel", 
                        {
                            deltaX: __finalDelta,
                            deltaY: 0,
                        }
                    )
                );
            }

            const _handlePointerDownOnScrollbarContainer = (event) => {
                event.preventDefault();
                event.stopPropagation();

                //Trigger this move-to-position behavior only if the user
                //is not controlling the scrollbar with a pointer.
                if(_scrollbar.isEngaged()) return;

                const __containerScrollSize = uss.getMaxScrollX(this.originalContainer, false, this.options);
                if(__containerScrollSize === 0) return;

                //The final scroll-position of container is proportional to  
                //where the user has clicked inside the scrollbar track.
                const __currentFinalPos = uss.getFinalXPosition(this.originalContainer, this.options);
                const __scrollbarSize = _scrollbar.container.clientWidth;
                const __finalPos = (event.offsetX - _scrollbar.container.scrollLeft) / __scrollbarSize * __containerScrollSize; 

                //The scrollbar will already be in the right position, no action needed.
                if(__currentFinalPos === __finalPos) return;

                //Synchronous call that will execute updatePosition after it.
                this.originalContainer.dispatchEvent(
                    new WheelEvent(
                        "wheel", 
                        {
                            deltaX: __finalPos - __currentFinalPos,
                            deltaY: 0,
                        }
                    )
                );
            }

            this.scrollbarXObserver = this.#scrollbarSetup(_scrollbar, uss.setXStepLengthCalculator, _handleOriginalContainerScrolling, _handlePointerDownOnScrollbarContainer);

            //Add the scrollbar to the container.
            _scrollbar.track.appendChild(_scrollbar.thumb);
            _scrollbar.container.appendChild(_scrollbar.track);
            this.originalContainer.insertBefore(_scrollbar.container, this.originalContainer.firstChild);
            
            this.originalBuilder.scrollbarX = _scrollbar;
        }

        if(this.onYAxis) {
            const _scrollbar = {
                container: document.createElement("div"),
                track: document.createElement("div"),
                thumb: document.createElement("div"),
                previousPointerId: null,
                pointerId: null,
                isEngaged: () => _scrollbar.pointerId !== null,
                updateThumbLength: () => {
                    const __size = _scrollbar.container.clientHeight * _scrollbar.container.clientHeight / this.originalContainer.scrollHeight;
                    _scrollbar.thumb.style.height = __size;
                    _scrollbar.thumb.style.marginTop = `-${__size}px`;
                },
                updateCache: () => uss.getMaxScrollY(this.originalContainer, true, this.options)
            }
        
            //Default dataset.
            _scrollbar.container.dataset.uss = "scrollbar-container-y";
            _scrollbar.track.dataset.uss = "scrollbar-track-y";
            _scrollbar.thumb.dataset.uss = "scrollbar-thumb-y";

            //Scrollbar container visibility styles.
            _scrollbar.container.style = `
                contain: style paint;
                touch-action: none;
                position: absolute;
                z-index: 100;
                top: 0px;
                right: 0px;
                width: ${this.options.thumbSize}px;
                height: 100%;
                overflow: hidden;
            `

            //Scrollbar track visibility styles.
            _scrollbar.track.style = `
                height: 200%;
                width: 100%;
            `

            //Scrollbar thumb visibility styles.
            _scrollbar.thumb.style = `
                position: absolute;
                touch-action: none;
                top: 100%;
                width: 100%;
            `

            //Accessibility styles.
            _scrollbar.container.tabIndex = -1;
            _scrollbar.track.tabIndex = -1;
            _scrollbar.thumb.tabIndex = -1;
    
            //Updates the scrollbar position and manages 
            //the underlying SmoothScrollBuilder callback execution. 
            _scrollbar.updatePosition = () => {
                //The _scrollbar.thumb.clientHeight may be not updated when resizing the window,
                //it's better to use the _scrollbar.thumb.style.height.
                const __thumbSize = Number.parseInt(_scrollbar.thumb.style.height);
                const __containerSize = _scrollbar.container.clientHeight;
                
                let __scrolledPercentage = 1 - uss.getFinalYPosition(this.originalContainer, this.options) / uss.getMaxScrollY(this.originalContainer, false, this.options);
                __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                       __scrolledPercentage < 0 || !__scrolledPercentage ? 0 : 
                                       __scrolledPercentage;
                
                //The scrollbar.container has the same easing pattern as the originalContainer.
                //TODO: if the deltaY is small EASE_OUT_BOUNCE (perhaps other stepLenCal too) only works if deltaY is < 0 
                if(!_scrollbar.isEngaged()) {
                    const __easing = uss.getYStepLengthCalculator(this.originalContainer, true)  || 
                                     uss.getYStepLengthCalculator(this.originalContainer, false) || 
                                     (r => r / 25 + 1);
                    uss.setYStepLengthCalculator(__easing, _scrollbar.container, false, this.options);
                }
                uss.scrollYTo(__scrolledPercentage * (__containerSize - __thumbSize), _scrollbar.container);
            }

            //Scroll the container on a pointermove event by the correspoing amount.
            const _handleOriginalContainerScrolling = (event) => {  
                event.preventDefault();
                event.stopPropagation();    

                //Only one pointer at a time can control the scrollbar.
                if(_scrollbar.pointerId !== event.pointerId) return;
        
                const __delta = event.movementY; 
                if(__delta === 0) return; 

                const __containerScrollSize = this.originalContainer.scrollHeight;
                const __containerClientSize = this.originalContainer.clientHeight;
                if(__containerScrollSize === __containerClientSize) return;

                const __finalDelta = __delta * __containerScrollSize / __containerClientSize;

                //Synchronous call that will execute updatePosition after it.
                this.originalContainer.dispatchEvent(
                    new WheelEvent(
                        "wheel", 
                        {
                            deltaX: 0,
                            deltaY: __finalDelta,
                        }
                    )
                );
            }

            const _handlePointerDownOnScrollbarContainer = (event) => {
                event.preventDefault();
                event.stopPropagation();

                //Trigger this move-to-position behavior only if the user
                //is not controlling the scrollbar with a pointer.
                if(_scrollbar.isEngaged()) return;

                const __containerScrollSize = uss.getMaxScrollY(this.originalContainer, false, this.options);
                if(__containerScrollSize === 0) return;

                //The final scroll-position of container is proportional to  
                //where the user has clicked inside the scrollbar track.
                const __currentFinalPos = uss.getFinalYPosition(this.originalContainer, this.options);
                const __scrollbarSize = _scrollbar.container.clientHeight;
                const __finalPos = (event.offsetY - _scrollbar.container.scrollTop) / __scrollbarSize * __containerScrollSize; 

                //The scrollbar will already be in the right position, no action needed.
                if(__currentFinalPos === __finalPos) return;
                
                //Synchronous call that will execute updatePosition after it.
                this.originalContainer.dispatchEvent(
                    new WheelEvent(
                        "wheel", 
                        {
                            deltaX: 0,
                            deltaY: __finalPos - __currentFinalPos,
                        }
                    )
                );
            }

            this.scrollbarYObserver = this.#scrollbarSetup(_scrollbar, uss.setYStepLengthCalculator, _handleOriginalContainerScrolling, _handlePointerDownOnScrollbarContainer);

            //Add the scrollbar to the container.
            _scrollbar.track.appendChild(_scrollbar.thumb);
            _scrollbar.container.appendChild(_scrollbar.track);
            this.originalContainer.insertBefore(_scrollbar.container, this.originalContainer.firstChild);
            
            this.originalBuilder.scrollbarY = _scrollbar;
        }
    }

    addCallback(callback) {
        this.container.addCallback(callback);
    }

    executeCallback() {
        this.container.executeCallback();
    }

    get originalContainer() {
        return this.container.originalContainer;
    }

    get originalBuilder() {
        return this.container.originalBuilder;
    }

    get currentXPosition() {
        return this.originalBuilder.currentXPosition;
    }

    get currentYPosition() {
        return this.originalBuilder.currentYPosition;
    }
    
    get scrollbarX() {
        return this.originalBuilder.scrollbarX;
    }

    get scrollbarY() {
        return this.originalBuilder.scrollbarY;
    }
}