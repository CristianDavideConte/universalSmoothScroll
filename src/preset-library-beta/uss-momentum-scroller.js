class UssMomentumScroller {
    #pointersDownIds = [];
    #onPointerUpCallback = false;
    #touchScrollExtender;
    #momentumScrolling;
    #axisNumber;

    constructor(container, options) {
        this.container = container;

        this.onXAxis = options.onXAxis;
        this.onYAxis = options.onYAxis;

        this.callback = options.callback;
        
        this.speedModifierX = options.speedModifierX;
        this.speedModifierY = options.speedModifierY;
        
        this.momentumEasingX = options.momentumEasingX;
        this.momentumEasingY = options.momentumEasingY;
        
        this.debugString = options.debugString;

        //Execute the options.callback only if it's a function and the user  
        //is not holding the pointer down. Wait for the pointerup event otherwise.
        const _callback = typeof options.callback === "function" ? () => {
            if(this.#pointersDownIds.length > 0) {
                this.#onPointerUpCallback = true;
                return;
            } 
            options.callback();
        } : null;

        if(this.onXAxis && !this.onYAxis) {
            this.#touchScrollExtender = () => {
                const __currentPos = uss.getScrollXCalculator(container)();
                const __finalPos = uss.getFinalXPosition(container);
                const __delta = __finalPos - __currentPos; //TODO FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSION
                
                _scrollContainer(__delta, 0);
            }
            this.#momentumScrolling = (deltaX, deltaY) => { 
                uss.setXStepLengthCalculator(this.momentumEasingX, container, true, options);
                uss.scrollXBy(this.speedModifierX(deltaX, deltaY), container, _callback, false, options);
            }
            this.#axisNumber = 0;
        } else if(!this.onXAxis && this.onYAxis) {
            this.#touchScrollExtender = () => {
                const __currentPos = uss.getScrollYCalculator(container)();
                const __finalPos = uss.getFinalYPosition(container);
                const __delta = __finalPos - __currentPos;

                _scrollContainer(0, __delta);
            }
            this.#momentumScrolling = (deltaX, deltaY) => {
                uss.setYStepLengthCalculator(this.momentumEasingY, container, true, options);
                uss.scrollYBy(this.speedModifierY(deltaX, deltaY), container, _callback, false, options);                                                            
            } 
            this.#axisNumber = 1;
        } else {
            this.#touchScrollExtender = () => {
                const __currentPosX = uss.getScrollXCalculator(container)();
                const __currentPosY = uss.getScrollYCalculator(container)();
                const __finalPosX = uss.getFinalXPosition(container);
                const __finalPosY = uss.getFinalYPosition(container);
                const __deltaX = __finalPosX - __currentPosX;
                const __deltaY = __finalPosY - __currentPosY;

                _scrollContainer(__deltaX, __deltaY);
            }
            this.#momentumScrolling = (deltaX, deltaY) => {
                uss.setXStepLengthCalculator(this.momentumEasingX, container, true, options);
                uss.setYStepLengthCalculator(this.momentumEasingY, container, true, options);
                uss.scrollBy(
                    this.speedModifierX(deltaX, deltaY), 
                    this.speedModifierY(deltaX, deltaY), 
                    container, 
                    _callback, 
                    false, 
                    options
                );
            }
            this.#axisNumber = 2;
        }

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
            container.dispatchEvent(__scrollRequest);

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
            //The pointerup event was triggered by a pointer not related with this container.
            const _pointerIdIndex = this.#pointersDownIds.indexOf(event.pointerId);
            if(_pointerIdIndex < 0) return;

            this.#pointersDownIds.splice(_pointerIdIndex, 1);
            if(this.#pointersDownIds.length === 0) {
                container.removeEventListener("pointermove", _handlePointerMoveEvent, {passive:false});
                window.removeEventListener("pointerup", _handlePointerUpEvent, {passive:true});

                if(this.#onPointerUpCallback) {
                    options.callback();
                    this.#onPointerUpCallback = false;
                    return;
                }

                this.#touchScrollExtender();
                console.log("current->", uss.getScrollYCalculator(container)(), "final->", uss.getFinalYPosition(container))
            }
        } 
        
        container.style.touchAction = "none";
        
        container.addEventListener("pointerdown", (event) => {
            //The pointerdown event is not relevant for scrolling if the pointer is a mouse.
            if(event.pointerType === "mouse") return;

            event.preventDefault();
            event.stopPropagation();

            if(this.#pointersDownIds.length === 0) {
                window.addEventListener("pointerup", _handlePointerUpEvent, {passive:true});
                container.addEventListener("pointermove", _handlePointerMoveEvent, {passive:false});
            }
            this.#pointersDownIds.push(event.pointerId);
        }, {passive:false});

        container.addEventListener("wheel", (event) => _scrollContainer(event.deltaX, event.deltaY, event), {passive:false});
    }
}