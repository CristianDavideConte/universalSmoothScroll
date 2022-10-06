import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";

export class SmoothScrollbarBuilder extends SmoothScrollBuilder {

    #_scrollbarSetup;
    
    //Parameters already sanitized.
    constructor(container, options) {
        super(container, options);

        this.#_scrollbarSetup = (scrollbar, handleContainerScrolling, handlePointerDownOnTrack) => {
            //Disengage the scrollbar and execute any callback.
            let __pointerIsHoveringTrack = false;
            const __disengageScrollbar = (event) => {    
                //Wait for the initial pointer to leave the touch-surface.
                if(event.pointerId !== scrollbar.pointerId) return;

                scrollbar.pointerId = null;
                window.removeEventListener("pointermove", handleContainerScrolling, {passive:false});     
                window.removeEventListener("pointerup", __disengageScrollbar, {passive:false});   

                //Check if the scrollbar status should be set to idle.
                if(!__pointerIsHoveringTrack) {
                    scrollbar.thumb.style.transitionDuration = "";
                    scrollbar.track.dataset.ussScrollbarIdle = true; 
                }
            }
            
            //Engage the scrollbar.
            scrollbar.thumb.addEventListener("pointerdown", (event) => {
                //Only one pointer at a time can control the scrollbar.
                if(scrollbar.isEngaged()) return;

                event.preventDefault();
                event.stopPropagation();

                scrollbar.pointerId = event.pointerId;
                window.addEventListener("pointerup", __disengageScrollbar, {passive:false});
                window.addEventListener("pointermove", handleContainerScrolling, {passive:false});   
                
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
            scrollbar.track.addEventListener("pointerdown", handlePointerDownOnTrack, {passive:false});

            //The scrollbar's status is never set to idle if the pointer is on it.
            scrollbar.track.addEventListener("pointerenter", () => {
                __pointerIsHoveringTrack = true;
                if(scrollbar.isEngaged()) return;
                scrollbar.track.dataset.ussScrollbarIdle = false; 
            }, {passive:true});
            
            //The scrollbar's status is set to idle if the pointer  
            //is not hovering it and the scrollbar thumb isn't being used.
            scrollbar.track.addEventListener("pointerleave", () => {
                __pointerIsHoveringTrack = false;
                if(scrollbar.isEngaged()) return;
                scrollbar.thumb.style.transitionDuration = "";
                scrollbar.track.dataset.ussScrollbarIdle = true; 
            }, {passive:true});

            //The scrollbar is initially in idle.
            scrollbar.track.dataset.ussScrollbarIdle = true; 

            uss.addOnResizeEndCallback(scrollbar.updateThumbLength, this.options);
            uss.addOnResizeEndCallback(scrollbar.updatePosition, this.options);

            //If new children are added/removed from the originalContainer (and its children) update the maxScrollX/Y
            //cached values and the scrollbar position (useful for lazy loading).
            const __mutationObserver = new MutationObserver(() => {
                scrollbar.updateCache(); 
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
                track: document.createElement("div"),
                thumb: document.createElement("div"),
                pointerId: null,
                isEngaged: () => _scrollbar.pointerId !== null,
                updateThumbLength: () => _scrollbar.thumb.style.width = _scrollbar.track.clientWidth * _scrollbar.track.clientWidth / this.originalContainer.scrollWidth,
                updateCache: () => uss.getMaxScrollX(this.originalContainer, true, this.options)
            }

            //Default dataset.
            _scrollbar.track.dataset.uss = "scrollbar-track-x";
            _scrollbar.thumb.dataset.uss = "scrollbar-thumb-x";

            //Scrollbar track visibility styles.
            _scrollbar.track.style = `
                contain: style paint;
                touch-action: none;
                position: absolute;
                z-index: 9999;
                bottom: 0px;
                left: 0px;
                width: calc(100% - ${_offset}px);
                height: ${this.options.thumbSize}px;
            ` 

            //Scrollbar thumb visibility styles.
            _scrollbar.thumb.style = `
                position: absolute;
                touch-action: none;
                height: 100%;
            `

            //Accessibility styles.
            _scrollbar.track.tabIndex = -1;
            _scrollbar.thumb.tabIndex = -1;
            
            //Updates the scrollbar position and manages 
            //the underlying SmoothScrollBuilder callback execution.
            _scrollbar.updatePosition = () => {
                const __thumbSize = Number.parseInt(_scrollbar.thumb.style.width);
                const __trackSize = _scrollbar.track.clientWidth;

                let __scrolledPercentage = uss.getFinalXPosition(this.originalContainer, this.options) / uss.getMaxScrollX(this.originalContainer, false, this.options);
                __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                       __scrolledPercentage < 0 || !__scrolledPercentage ? 0 : 
                                       __scrolledPercentage;

                const __translateAmount = __scrolledPercentage * (__trackSize - __thumbSize);

                _scrollbar.thumb.style.transitionDuration = _scrollbar.isEngaged() ? "0s" : this.options.transitionDurationX;
                _scrollbar.thumb.style.transform = "translateX(" + __translateAmount + "px)";
            }

            //Scroll the container on a pointermove event by the correspoing amount.
            const _handleContainerScrolling = (event) => { 
                event.preventDefault();
                event.stopPropagation();

                //Only one pointer at a time can control the scrollbar.
                if(_scrollbar.pointerId !== event.pointerId) return;

                const __delta = event.movementX; 
                if(__delta === 0) return; 

                const __containerScrollSize = this.originalContainer.scrollWidth;
                const __containerClientSize = this.originalContainer.clientWidth;
                if(__containerScrollSize === __containerClientSize) return;

                //const __finalDelta = __delta * __containerScrollSize / __containerClientSize;

                let __finalDelta = __delta * __containerScrollSize / __containerClientSize;
                const __finalPos = uss.getFinalXPosition(this.originalContainer, this.options); 
                const __maxScroll = uss.getMaxScrollX(this.originalContainer, false, this.options);

                //console.log(__finalPos, __finalDelta);

                if(__finalPos + __finalDelta < 0) {
                    __finalDelta = -__finalPos;
                } else if(__finalPos + __finalDelta > __maxScroll) {
                    __finalDelta = __maxScroll - __finalPos;
                }

                //console.log("updated", __finalPos, __finalDelta);

                if(__finalDelta === 0) return;

                //console.log("passed")

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

            const _handlePointerDownOnTrack = (event) => {
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
                const __trackSize = _scrollbar.track.clientWidth;
                const __finalPos = event.offsetX / __trackSize * __containerScrollSize; 

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

            this.scrollbarXObserver = this.#_scrollbarSetup(_scrollbar, _handleContainerScrolling, _handlePointerDownOnTrack);

            //Add the scrollbar to the container.
            _scrollbar.track.appendChild(_scrollbar.thumb);
            this.originalContainer.insertBefore(_scrollbar.track, this.originalContainer.firstChild);
            
            this.originalBuilder.scrollbarX = _scrollbar;
        }

        if(this.onYAxis) {
            const _scrollbar = {
                track: document.createElement("div"),
                thumb: document.createElement("div"),
                pointerId: null,
                isEngaged: () => _scrollbar.pointerId !== null,
                updateThumbLength: () => _scrollbar.thumb.style.height = _scrollbar.track.clientHeight * _scrollbar.track.clientHeight / this.originalContainer.scrollHeight,
                updateCache: () => uss.getMaxScrollY(this.originalContainer, true, this.options)
            }
        
            //Default dataset.
            _scrollbar.track.dataset.uss = "scrollbar-track-y";
            _scrollbar.thumb.dataset.uss = "scrollbar-thumb-y";

            //Scrollbar track visibility styles.
            _scrollbar.track.style = `
                contain: style paint;
                touch-action: none;
                position: absolute;
                z-index: 9999;
                top: 0px;
                right: 0px;
                width: ${this.options.thumbSize}px;
                height: 100%;
            `

            //Scrollbar thumb visibility styles.
            _scrollbar.thumb.style = `
                position: absolute;
                touch-action: none;
                width: 100%;
            `

            //Accessibility styles.
            _scrollbar.track.tabIndex = -1;
            _scrollbar.thumb.tabIndex = -1;
    
            //Updates the scrollbar position and manages 
            //the underlying SmoothScrollBuilder callback execution. 
            _scrollbar.updatePosition = () => {
                const __thumbSize = Number.parseInt(_scrollbar.thumb.style.height);
                const __trackSize = _scrollbar.track.clientHeight;

                let __scrolledPercentage = uss.getFinalYPosition(this.originalContainer, this.options) / uss.getMaxScrollY(this.originalContainer, false, this.options);
                __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                       __scrolledPercentage < 0 || !__scrolledPercentage ? 0 : 
                                       __scrolledPercentage;

                const __translateAmount = __scrolledPercentage * (__trackSize - __thumbSize);
                
                _scrollbar.thumb.style.transitionDuration = _scrollbar.isEngaged() ? "0s" : this.options.transitionDurationY;
                _scrollbar.thumb.style.transform = "translateY(" + __translateAmount + "px)";
            }

            //Scroll the container on a pointermove event by the correspoing amount.
            const _handleContainerScrolling = (event) => {  
                event.preventDefault();
                event.stopPropagation();    

                //Only one pointer at a time can control the scrollbar.
                if(_scrollbar.pointerId !== event.pointerId) return;
        
                const __delta = event.movementY; 
                if(__delta === 0) return; 

                const __containerScrollSize = this.originalContainer.scrollHeight;
                const __containerClientSize = this.originalContainer.clientHeight;
                if(__containerScrollSize === __containerClientSize) return;

                let __finalDelta = __delta * __containerScrollSize / __containerClientSize;
                const __finalPos = uss.getFinalYPosition(this.originalContainer, this.options); 
                const __maxScroll = uss.getMaxScrollY(this.originalContainer, false, this.options);

                //console.log(__finalPos, __finalDelta);

                if(__finalPos + __finalDelta < 0) {
                    __finalDelta = -__finalPos;
                } else if(__finalPos + __finalDelta > __maxScroll) {
                    __finalDelta = __maxScroll - __finalPos;
                }

                //console.log("updated", __finalPos, __finalDelta);

                if(__finalDelta === 0) return;

                //console.log("passed")

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

            const _handlePointerDownOnTrack = (event) => {
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
                const __trackSize = _scrollbar.track.clientHeight;
                const __finalPos = event.offsetY / __trackSize * __containerScrollSize; 

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

            this.scrollbarYObserver = this.#_scrollbarSetup(_scrollbar, _handleContainerScrolling, _handlePointerDownOnTrack);

            //Add the scrollbar to the container.
            _scrollbar.track.appendChild(_scrollbar.thumb);
            this.originalContainer.insertBefore(_scrollbar.track, this.originalContainer.firstChild);
            
            this.originalBuilder.scrollbarY = _scrollbar;
        }
    }

    addCallback(callback) {
        this.originalBuilder.addCallback(callback);
    }

    executeCallback() {
        this.originalBuilder.executeCallback();
    }

    get originalContainer() {
        return this.container.originalContainer;
    }

    get originalBuilder() {
        return this.container.originalBuilder;
    }

    get scrollbarX() {
        return this.originalBuilder.scrollbarX;
    }

    get scrollbarY() {
        return this.originalBuilder.scrollbarY;
    }
}