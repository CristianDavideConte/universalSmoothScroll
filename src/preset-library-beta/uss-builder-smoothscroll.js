export class SmoothScrollBuilder {
    
    #pointersDownIds = [];
    
    #touchScrollExtender;
    #smoothScroller;

    //Parameters already sanitized.
    constructor(container, options) {
        this.container = container; 
        this.options = options;
        
        //"bind" is used so "this" can be used inside these functions.
        this.addCallback = this.addCallback.bind(this); 
        this.executeCallback = this.executeCallback.bind(this);
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

        if(this.onXAxis && !this.onYAxis) {
            this.#touchScrollExtender = (event) => {
                const __currentPos = uss.getScrollXCalculator(this.originalContainer, this.options)();
                const __finalPos = uss.getFinalXPosition(this.originalContainer, this.options);

                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSION
                const __delta = __finalPos - __currentPos; 
                
                _handleContainerScrolling(__delta, 0, event);
            }

            this.#smoothScroller = (deltaX, deltaY) => { 
                uss.setXStepLengthCalculator(this.options.easingX, this.originalContainer, true, this.options);
                uss.scrollXBy(this.options.speedModifierX(deltaX, deltaY), this.originalContainer, this.executeCallback, false, this.options);
            }
        } else if(!this.onXAxis && this.onYAxis) {
            this.#touchScrollExtender = (event) => {
                const __currentPos = uss.getScrollYCalculator(this.originalContainer, this.options)();
                const __finalPos = uss.getFinalYPosition(this.originalContainer, this.options);
                
                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSION
                const __delta = __finalPos - __currentPos;

                _handleContainerScrolling(0, __delta, event);
            }

            this.#smoothScroller = (deltaX, deltaY) => {
                uss.setYStepLengthCalculator(this.options.easingY, this.originalContainer, true, this.options);
                uss.scrollYBy(this.options.speedModifierY(deltaX, deltaY), this.originalContainer, this.executeCallback, false, this.options);                                                            
            } 
        } else {
            this.#touchScrollExtender = (event) => {
                const __currentPosX = uss.getScrollXCalculator(this.originalContainer, this.options)();
                const __currentPosY = uss.getScrollYCalculator(this.originalContainer, this.options)();
                const __finalPosX = uss.getFinalXPosition(this.originalContainer, this.options);
                const __finalPosY = uss.getFinalYPosition(this.originalContainer, this.options);
                
                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSIONS
                const __deltaX = __finalPosX - __currentPosX;
                const __deltaY = __finalPosY - __currentPosY;

                _handleContainerScrolling(__deltaX, __deltaY, event);
            }

            this.#smoothScroller = (deltaX, deltaY) => {
                uss.setXStepLengthCalculator(this.options.easingX, this.originalContainer, true, this.options);
                uss.setYStepLengthCalculator(this.options.easingY, this.originalContainer, true, this.options);
                uss.scrollBy(
                    this.options.speedModifierX(deltaX, deltaY), 
                    this.options.speedModifierY(deltaX, deltaY), 
                    this.originalContainer, 
                    this.executeCallback, 
                    false, 
                    this.options
                );
            }
        }

        //This function scrolls this.originalContainer and updates the scrollbars position accordingly.
        const _handleContainerScrolling = (deltaX, deltaY, event) => {
            event.preventDefault();
            event.stopPropagation();

            if(deltaX === 0 && deltaY === 0) {
                this.executeCallback();
                return;
            }

            this.#smoothScroller(deltaX, deltaY);
            if(uss.isXScrolling(this.originalContainer, this.options)) this.scrollbarX.updatePosition();
            if(uss.isYScrolling(this.originalContainer, this.options)) this.scrollbarY.updatePosition();
        } 

        const _handlePointerMoveEvent = (event) => {
            const __deltaY = Math.abs(event.movementY);
            const __deltaX = Math.abs(event.movementX);
            const __delta = __deltaX + __deltaY;
            const __directionX = -event.movementX > 0 ? 1 : -1;
            const __directionY = -event.movementY > 0 ? 1 : -1;
            
            if(__deltaX > __deltaY) {
                _handleContainerScrolling(__directionX * __delta, 0, event);
                return;
            } 
            
            if(__deltaY > __deltaX) {
                _handleContainerScrolling(0, __directionY * __delta, event);
                return;
            }
            
            _handleContainerScrolling(__directionX * __delta, __directionY * __delta, event);
        }

        const _handlePointerUpEvent = (event) => {
            const __pointerIdIndex = this.#pointersDownIds.indexOf(event.pointerId);

            //The pointerup event was triggered by a pointer not related with this this.originalContainer.
            if(__pointerIdIndex < 0) return;

            this.#pointersDownIds.splice(__pointerIdIndex, 1);
        
            if(this.#pointersDownIds.length !== 0) return;

            window.removeEventListener("pointerup", _handlePointerUpEvent, {passive:false});
            
            if(event.pointerType === "mouse") {
                this.executeCallback();
            } else {
                this.originalContainer.removeEventListener("pointermove", _handlePointerMoveEvent, {passive:false});
                this.#touchScrollExtender(event);
            }
        } 
        
        //Needed for the pointerevents to work as expected. 
        this.originalContainer.style.touchAction = "none";
        
        this.originalContainer.addEventListener("pointerdown", (event) => {    
            //The pointerdown event is not relevant if the pointer is a mouse.
            if(event.pointerType === "mouse") return;

            event.preventDefault();
            event.stopPropagation();        

            this.#pointersDownIds.push(event.pointerId);

            //Attach the listeners only on the first pointerdown event.
            if(this.#pointersDownIds.length > 1) return;
                      
            window.addEventListener("pointerup", _handlePointerUpEvent, {passive:false});

            //The pointermove event is not relevant if the pointer is a scrollbar.
            if(event.pointerType === "scrollbar") return;

            this.originalContainer.addEventListener("pointermove", _handlePointerMoveEvent, {passive:false});
        }, {passive:false});

        this.originalContainer.addEventListener("wheel", (event) => _handleContainerScrolling(event.deltaX, event.deltaY, event), {passive:false});
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

    /**
     * Execute this.callback only if the user is not holding any scrollbar
     * or the touch-related-pointer down, wait for the pointerup event otherwise.
     */
    executeCallback() {
        if(this.#pointersDownIds.length === 0) this.callback();
    }

    get originalContainer() {
        return this.container;
    }

    get originalBuilder() {
        return this;
    }
}