export class SmoothScrollBuilder {
    
    #axisNumber; //Axis number for the smooth scrolling

    #pointersDownIds = [];
    #onPointerUpCallback = false;
    
    #touchScrollExtender;
    #momentumScrolling;

    //Parameters already sanitized.
    constructor(container, options) {
        this.container = container; 
        this.options = options;
    }

    build() {
        //Save the original callback so that even if it's modified by other builders,
        //we still have a reference to it.
        this.callback = this.options.callback;

        //Execute the this.callback only if the user is not holding
        //the pointer down, wait for the pointerup event otherwise.
        const _callback = () => {
            if(this.#pointersDownIds.length > 0) {
                this.#onPointerUpCallback = true;
                return;
            } 
            this.callback();
        }

        if(this.options.onXAxis && !this.options.onYAxis) {
            this.#touchScrollExtender = () => {
                const __currentPos = uss.getScrollXCalculator(this.container)();
                const __finalPos = uss.getFinalXPosition(this.container);

                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSION
                const __delta = __finalPos - __currentPos; 
                
                _scrollContainer(__delta, 0);
            }

            this.#momentumScrolling = (deltaX, deltaY) => { 
                uss.setXStepLengthCalculator(this.options.momentumEasingX, this.container, true, this.options);
                uss.scrollXBy(this.options.speedModifierX(deltaX, deltaY), this.container, _callback, false, this.options);
            }

            this.#axisNumber = 0;
        } else if(!this.options.onXAxis && this.options.onYAxis) {
            this.#touchScrollExtender = () => {
                const __currentPos = uss.getScrollYCalculator(this.container)();
                const __finalPos = uss.getFinalYPosition(this.container);
                
                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSION
                const __delta = __finalPos - __currentPos;

                _scrollContainer(0, __delta);
            }

            this.#momentumScrolling = (deltaX, deltaY) => {
                uss.setYStepLengthCalculator(this.options.momentumEasingY, this.container, true, this.options);
                uss.scrollYBy(this.options.speedModifierY(deltaX, deltaY), this.container, _callback, false, this.options);                                                            
            } 

            this.#axisNumber = 1;
        } else {
            this.#touchScrollExtender = () => {
                const __currentPosX = uss.getScrollXCalculator(this.container)();
                const __currentPosY = uss.getScrollYCalculator(this.container)();
                const __finalPosX = uss.getFinalXPosition(this.container);
                const __finalPosY = uss.getFinalYPosition(this.container);
                
                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSIONS
                const __deltaX = __finalPosX - __currentPosX;
                const __deltaY = __finalPosY - __currentPosY;

                _scrollContainer(__deltaX, __deltaY);
            }

            this.#momentumScrolling = (deltaX, deltaY) => {
                uss.setXStepLengthCalculator(this.options.momentumEasingX, this.container, true, this.options);
                uss.setYStepLengthCalculator(this.options.momentumEasingY, this.container, true, this.options);
                uss.scrollBy(
                    this.options.speedModifierX(deltaX, deltaY), 
                    this.options.speedModifierY(deltaX, deltaY), 
                    this.container, 
                    _callback, 
                    false, 
                    this.options
                );
            }
            
            this.#axisNumber = 2;
        }

        //Inform other components that the this.container should be scrolled.
        //If needed, this function scrolls the this.originalContainer.
        const _scrollContainer = (deltaX, deltaY, event) => {
            if(event) {
                event.preventDefault();
                event.stopPropagation();
            }

            const __scrollRequest = new CustomEvent(
                "ussmoverequest", 
                { 
                    cancelable: true,
                    detail: {
                        axis: this.#axisNumber,
                        scroller: () => this.#momentumScrolling(deltaX, deltaY),
                    }
                }
            );
            this.originalContainer.dispatchEvent(__scrollRequest);

            //If no one has handled the scroll request yet.
            if(!__scrollRequest.defaultPrevented) {
                this.#momentumScrolling(deltaX, deltaY);
            }
        } 

        const _handlePointerMoveEvent = (event) => {
            this.#onPointerUpCallback = false;

            const __deltaY = Math.abs(event.movementY);
            const __deltaX = Math.abs(event.movementX);
            const __delta = __deltaX + __deltaY;
            const __directionX = -event.movementX > 0 ? 1 : -1;
            const __directionY = -event.movementY > 0 ? 1 : -1;
            
            if(__deltaX > __deltaY) {
                _scrollContainer(__directionX * __delta, 0, event);
                return;
            } 
            
            if(__deltaY > __deltaX) {
                _scrollContainer(0, __directionY * __delta, event);
                return;
            }
            
            _scrollContainer(__directionX * __delta, __directionY * __delta, event);
        }

        const _handlePointerUpEvent = (event) => {
            //The pointerup event was triggered by a pointer not related with this this.originalContainer.
            const _pointerIdIndex = this.#pointersDownIds.indexOf(event.pointerId);
            if(_pointerIdIndex < 0) return;

            this.#pointersDownIds.splice(_pointerIdIndex, 1);
            if(this.#pointersDownIds.length === 0) {
                this.originalContainer.removeEventListener("pointermove", _handlePointerMoveEvent, {passive:false});
                window.removeEventListener("pointerup", _handlePointerUpEvent, {passive:true});

                if(this.#onPointerUpCallback) {
                    this.callback();
                    this.#onPointerUpCallback = false;
                    return;
                }

                this.#touchScrollExtender();
            }
        } 
        
        //Needed for the pointerevents to work as expected. 
        this.originalContainer.style.touchAction = "none";
        
        this.originalContainer.addEventListener("pointerdown", (event) => {
            //The pointerdown event is not relevant for scrolling if the pointer is a mouse.
            if(event.pointerType === "mouse") return;

            event.preventDefault();
            event.stopPropagation();

            if(this.#pointersDownIds.length === 0) {
                window.addEventListener("pointerup", _handlePointerUpEvent, {passive:true});
                this.originalContainer.addEventListener("pointermove", _handlePointerMoveEvent, {passive:false});
            }
            this.#pointersDownIds.push(event.pointerId);
        }, {passive:false});

        this.originalContainer.addEventListener("wheel", (event) => _scrollContainer(event.deltaX, event.deltaY, event), {passive:false});
    }

    get originalContainer() {
        return this.container;
    }

    get originalBuilder() {
        return this;
    }
}