export class SmoothScrollBuilder {
    
    #pointersDownIds = [];
    #onPointerUpCallback = false;
    
    #touchScrollExtender;
    #smoothScroller;

    //Parameters already sanitized.
    constructor(container, options) {
        this.container = container; 
        this.options = options;
    }

    build() {
        this.onXAxis = this.options.onXAxis;
        this.onYAxis = this.options.onYAxis;

        //Save the original callback so that even if it's modified by other builders,
        //we still have a reference to it.
        this.callback = this.options.callback;

        //Default scrollbars objects.
        this.scrollbarX = { updatePosition: () => {} };
        this.scrollbarY = { updatePosition: () => {} };

        //Execute this.callback only if the user is not holding any scrollbar
        //or the pointer down, wait for the pointerup event otherwise.
        const _callback = () => {
            if(this.#pointersDownIds.length === 0) this.callback();
            else this.#onPointerUpCallback = true;
        }

        if(this.onXAxis && !this.onYAxis) {
            this.#touchScrollExtender = () => {
                const __currentPos = uss.getScrollXCalculator(this.originalContainer)();
                const __finalPos = uss.getFinalXPosition(this.originalContainer);

                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSION
                const __delta = __finalPos - __currentPos; 
                
                _scrollContainer(__delta, 0);
            }

            this.#smoothScroller = (deltaX, deltaY) => { 
                uss.setXStepLengthCalculator(this.options.easingX, this.originalContainer, true, this.options);
                uss.scrollXBy(this.options.speedModifierX(deltaX, deltaY), this.originalContainer, _callback, false, this.options);
            }
        } else if(!this.onXAxis && this.onYAxis) {
            this.#touchScrollExtender = () => {
                const __currentPos = uss.getScrollYCalculator(this.originalContainer)();
                const __finalPos = uss.getFinalYPosition(this.originalContainer);
                
                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSION
                const __delta = __finalPos - __currentPos;

                _scrollContainer(0, __delta);
            }

            this.#smoothScroller = (deltaX, deltaY) => {
                uss.setYStepLengthCalculator(this.options.easingY, this.originalContainer, true, this.options);
                uss.scrollYBy(this.options.speedModifierY(deltaX, deltaY), this.originalContainer, _callback, false, this.options);                                                            
            } 
        } else {
            this.#touchScrollExtender = () => {
                const __currentPosX = uss.getScrollXCalculator(this.originalContainer)();
                const __currentPosY = uss.getScrollYCalculator(this.originalContainer)();
                const __finalPosX = uss.getFinalXPosition(this.originalContainer);
                const __finalPosY = uss.getFinalYPosition(this.originalContainer);
                
                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSIONS
                const __deltaX = __finalPosX - __currentPosX;
                const __deltaY = __finalPosY - __currentPosY;

                _scrollContainer(__deltaX, __deltaY);
            }

            this.#smoothScroller = (deltaX, deltaY) => {
                uss.setXStepLengthCalculator(this.options.easingX, this.originalContainer, true, this.options);
                uss.setYStepLengthCalculator(this.options.easingY, this.originalContainer, true, this.options);
                uss.scrollBy(
                    this.options.speedModifierX(deltaX, deltaY), 
                    this.options.speedModifierY(deltaX, deltaY), 
                    this.originalContainer, 
                    _callback, 
                    false, 
                    this.options
                );
            }
        }

        //This function scrolls this.originalContainer and updates the scrollbars position accordingly.
        const _scrollContainer = (deltaX, deltaY, event) => {
            if(event) {
                event.preventDefault();
                event.stopPropagation();
            }

            if(deltaX === 0 && deltaY === 0) return;

            this.#smoothScroller(deltaX, deltaY);
            if(uss.isXScrolling(this.originalContainer)) this.scrollbarX.updatePosition();
            if(uss.isYScrolling(this.originalContainer)) this.scrollbarY.updatePosition();
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
            const __pointerIdIndex = this.#pointersDownIds.indexOf(event.pointerId);
            if(__pointerIdIndex < 0) return;

            this.#pointersDownIds.splice(__pointerIdIndex, 1);
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
            event.preventDefault();
            event.stopPropagation();        

            this.#pointersDownIds.push(event.pointerId);
            
            if(this.#pointersDownIds.length > 1) return;

            //Attach the listeners only on the first pointerdown event.
            window.addEventListener("pointerup", _handlePointerUpEvent, {passive:true});

            //The pointerdown event is not relevant for scrolling if the pointer is a mouse.
            if(event.pointerType === "mouse") return;
            
            //Attach the listeners only on the first pointerdown event.
            this.originalContainer.addEventListener("pointermove", _handlePointerMoveEvent, {passive:false});
        }, {passive:false});

        this.originalContainer.addEventListener("wheel", (event) => _scrollContainer(event.deltaX, event.deltaY, event), {passive:false});
    }

    /**
     * The passed callback will be added to the callback queue.
     * The passed callback will be the last to be invoked.
     * @param {Function} callback A function that will be invoked after all the current callback's queue functions.
     */
    addCallback(callback) {
        const _originalCallback = this.originalBuilder.callback;
        this.originalBuilder.callback = () => {
            _originalCallback();
            callback();
        }
    }

    get originalContainer() {
        return this.container;
    }

    get originalBuilder() {
        return this;
    }
}