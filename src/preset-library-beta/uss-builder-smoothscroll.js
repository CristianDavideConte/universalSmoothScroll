export class SmoothScrollBuilder {
    
    #pointersDownIds = [];
    
    #overscrollConditionsX;
    #overscrollConditionsY;
    #overscrollConditionsXFilter;
    #overscrollConditionsYFilter;
    #smoothScroller;
    #touchScrollExtender;

    #getCurrentXPosition;
    #getCurrentYPosition;

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
        this.scrollbarX = { previousPointerId: null, isEngaged: () => false, updatePosition: () => {} };
        this.scrollbarY = { previousPointerId: null, isEngaged: () => false, updatePosition: () => {} };

        //Getters for the current positions on the x and y axes of this.originalContainer.
        this.#getCurrentXPosition = uss.getScrollXCalculator(this.originalContainer, this.options);
        this.#getCurrentYPosition = uss.getScrollYCalculator(this.originalContainer, this.options);
        
        this.#overscrollConditionsX = this.options.overscrollX ? (deltaX, deltaY, event) => {
            //With no movement, the overscroll conditions can never be satisfied.
            if(deltaX === 0) return false;

            //Only the scrollbarX is checked because any scrollbarY movement will produce a 
            //wheel event with deltaX = 0, so the conditions below will fail.
            if(this.scrollbarX.isEngaged()) return false;

            //If the x-axis is non-scrollable, filter out micro-movements
            //before considering the overscroll conditions.
            if(this.#overscrollConditionsXFilter(deltaX, deltaY)) return false;

            const __nextPos = this.currentXPosition + this.options.speedModifierX(deltaX, deltaY, event);
            const __maxScroll = uss.getMaxScrollX(this.originalContainer, false, this.options);
            return (__nextPos <= 0 && deltaX < 0) || (__nextPos >= __maxScroll && deltaX > 0);
        } : () => false;
        
        this.#overscrollConditionsXFilter = !this.onXAxis ? (deltaX, deltaY) => {
            const __deltaX = Math.abs(deltaX);
            const __deltaY = Math.abs(deltaY);
            return __deltaX < 2 || __deltaX < 2 * __deltaY;            
        } : () => false;

        this.#overscrollConditionsY = this.options.overscrollY ? (deltaX, deltaY, event) => {
            //With no movement, the overscroll conditions can never be satisfied.
            if(deltaY === 0) return false;

            //Only the scrollbarY is checked because any scrollbarX movement will produce a 
            //wheel event with deltaY = 0, so the conditions below will fail.
            if(this.scrollbarY.isEngaged()) return false;

            //If the y-axis is non-scrollable, filter out micro-movements
            //before considering the overscroll conditions.
            if(this.#overscrollConditionsYFilter(deltaX, deltaY)) return false;

            const __nextPos = this.currentYPosition + this.options.speedModifierY(deltaX, deltaY, event);
            const __maxScroll = uss.getMaxScrollY(this.originalContainer, false, this.options);
            return (__nextPos <= 0 && deltaY < 0) || (__nextPos >= __maxScroll && deltaY > 0);
        } : () => false;

        this.#overscrollConditionsYFilter = !this.onYAxis ? (deltaX, deltaY) => {
            const __deltaX = Math.abs(deltaX);
            const __deltaY = Math.abs(deltaY);
            return __deltaY < 2 || __deltaY < 2 * __deltaX;            
        } : () => false;

        if(this.onXAxis && !this.onYAxis) {
            this.#smoothScroller = (deltaX, deltaY, event) => { 
                uss.scrollXBy(this.options.speedModifierX(deltaX, deltaY, event), this.originalContainer, this.executeCallback, false, true, this.options);
            }

            this.#touchScrollExtender = (event) => {
                const __currentPos = this.currentXPosition;
                const __finalPos = uss.getFinalXPosition(this.originalContainer, this.options);

                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSION
                const __delta = __finalPos - __currentPos; 
                const __direction =  __delta > 0 ? 1 : -1;
                
                console.log(
                    "touch extended by", 
                    Math.pow(Math.abs(__delta), 1.5) * __direction
                )

                _handleContainerScrolling(
                    Math.pow(Math.abs(__delta), 1.5) * __direction, 
                    0,
                    event
                );
            }
        } else if(!this.onXAxis && this.onYAxis) {
            this.#smoothScroller = (deltaX, deltaY, event) => {
                uss.scrollYBy(this.options.speedModifierY(deltaX, deltaY, event), this.originalContainer, this.executeCallback, false, true, this.options);                                                            
            } 

            this.#touchScrollExtender = (event) => {
                const __currentPos = this.currentYPosition;
                const __finalPos = uss.getFinalYPosition(this.originalContainer, this.options);
                
                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSION
                const __delta = __finalPos - __currentPos; 
                const __direction =  __delta > 0 ? 1 : -1;
                
                console.log(
                    "touch extended by", 
                    Math.pow(Math.abs(__delta), 1.5) * __direction
                )

                _handleContainerScrolling(
                    0,
                    Math.pow(Math.abs(__delta), 1.5) * __direction, 
                    event
                );
            }
        } else {
            this.#smoothScroller = (deltaX, deltaY, event) => {
                uss.scrollBy(
                    this.options.speedModifierX(deltaX, deltaY, event), 
                    this.options.speedModifierY(deltaX, deltaY, event), 
                    this.originalContainer, 
                    this.executeCallback, 
                    false, 
                    true,
                    this.options
                );
            }
            
            this.#touchScrollExtender = (event) => {
                const __currentPosX = this.currentXPosition;
                const __currentPosY = this.currentYPosition;
                const __finalPosX = uss.getFinalXPosition(this.originalContainer, this.options);
                const __finalPosY = uss.getFinalYPosition(this.originalContainer, this.options);
                
                //TODO 
                //FIND WHAT EASING/PATTERN IS THE BEST FOR THIS SCROLL-EXTENSIONS
                const __deltaX = __finalPosX - __currentPosX;
                const __deltaY = __finalPosY - __currentPosY;
                const __directionX =  __deltaX > 0 ? 1 : -1;
                const __directionY =  __deltaY > 0 ? 1 : -1;

                console.log(
                    "touch extended by", 
                    Math.pow(Math.abs(__deltaX), 1.5) * __directionX, 
                    Math.pow(Math.abs(__deltaY), 1.5) * __directionY
                )

                _handleContainerScrolling(
                    Math.pow(Math.abs(__deltaX), 1.5) * __directionX, 
                    Math.pow(Math.abs(__deltaY), 1.5) * __directionY, 
                    event
                );
            }
        }

        //This function scrolls this.originalContainer and updates the scrollbars position accordingly.
        const _handleContainerScrolling = (deltaX, deltaY, event) => {
            event.preventDefault();
            event.stopPropagation();

            //Manage the overscroll behavior.
            //Interactions with scrollbars prevent overscroll.
            if(this.#overscrollConditionsX(deltaX, deltaY, event) || 
               this.#overscrollConditionsY(deltaX, deltaY, event)
            ) {
                const __scrollableParent = uss.getScrollableParent(this.originalContainer, true, this.options);
                
                //If there's no scrollable parent, the overscrol cannot be applied.
                if(__scrollableParent) {
                    if(event.type === "pointermove") {
                        //Remove the pointer from the list of ones that are 
                        //controlling the scroll of this.originalContainer.
                        this.#pointersDownIds = [];
                        window.removeEventListener("pointerup", _handlePointerUpEvent, {passive:false});
                        this.originalContainer.removeEventListener("pointermove", _handlePointerMoveEvent, {passive:false});

                        //Add the pointer from the list of ones that are 
                        //controlling the scroll of the scrollable parent of this.originalContainer.
                        __scrollableParent.dispatchEvent(
                            new PointerEvent(
                                "pointerdown", 
                                {
                                    pointerId: event.pointerId,
                                    pointerType: "touch",
                                }
                            )
                        );
                    }
                    
                    //Re-dispatch the original scrolling event to the scrollable parent.
                    __scrollableParent.dispatchEvent(new event.constructor(event.type, event));
                }
            }
            
            //Scroll this.originalContainer and updates the scrollbars position accordingly.
            this.#smoothScroller(deltaX, deltaY, event);
            if(uss.isXScrolling(this.originalContainer, this.options)) this.scrollbarX.updatePosition();
            if(uss.isYScrolling(this.originalContainer, this.options)) this.scrollbarY.updatePosition();
        }




        
        const _handlePointerDownEvent = (event) => {
            //Pointes should be unique.
            const __eventId = event.pointerId;
            if(this.#pointersDownIds.indexOf(__eventId) >= 0) return;

            //The pointerdown event is not relevant if the pointer is a mouse.
            if(event.pointerType === "mouse") return;

            event.preventDefault();
            event.stopPropagation();

            this.#pointersDownIds.push(__eventId);

            //Attach the listeners only on the first pointerdown event.
            if(this.#pointersDownIds.length > 1) return;
                      
            window.addEventListener("pointerup", _handlePointerUpEvent, {passive:false});        

            uss.stopScrolling(this.originalContainer);
            this.scrollbarX.updatePosition();
            this.scrollbarY.updatePosition();

            uss.setStepLengthCalculator(remaning => {
                console.log("r => r", remaning)
                return remaning < 2 ? remaning : Math.ceil(remaning / 3);
            }, this.originalContainer, false, this.options);

            //The pointermove event is not relevant if the pointer is a scrollbar.
            if(event.pointerType === "scrollbar") return;

            this.originalContainer.addEventListener("pointermove", _handlePointerMoveEvent, {passive:false});
        } 
        



 
        /**
         * This function makes the scrolling stick more to the main
         * scrolling axis.
         * @param {*} event a pointermove event
         */
        const _handlePointerMoveEvent = (event) => {
            const __deltaX = Math.abs(event.movementX);
            const __deltaY = Math.abs(event.movementY);
            const __directionX = -event.movementX > 0 ? 1 : -1;
            const __directionY = -event.movementY > 0 ? 1 : -1;
            
            /**
             * If the movement on the x-axis is more then the one on the y-axis, 
             * stick to the x-axis.
             */
            if(__deltaX > __deltaY) {
                _handleContainerScrolling(__directionX * (__deltaX + __deltaY), 0, event);
                return;
            } 
            
            /**
             * If the movement on the y-axis is more then the one on the x-axis, 
             * stick to the y-axis.
             */
            if(__deltaX < __deltaY) {
                _handleContainerScrolling(0, __directionY * (__deltaX + __deltaY), event);
                return;
            }
            
            /**
             * If the movements on the x-axis and the y-axis are equal, 
             * don't apply any effect.
             */
            _handleContainerScrolling(__directionX * __deltaX, __directionY * __deltaY, event);
        }





        const _handlePointerUpEvent = (event) => {
            const __eventId = event.pointerId;
            const __pointerIdIndex = this.#pointersDownIds.indexOf(__eventId);

            //The pointerup event was triggered by a pointer not related with this this.originalContainer.
            if(__pointerIdIndex < 0) return;

            this.#pointersDownIds.splice(__pointerIdIndex, 1);
        
            if(this.#pointersDownIds.length !== 0) return;

            window.removeEventListener("pointerup", _handlePointerUpEvent, {passive:false});
            
            this.originalContainer.removeEventListener("pointermove", _handlePointerMoveEvent, {passive:false});
            
            if(!uss.isScrolling(this.originalContainer)) {
                console.log("was not scrolling", this.originalContainer);
                this.executeCallback();
                return;
            } 
            
            //Extend the scroll only if it was not caused by a scrollbar.
            if(event.pointerType !== "mouse" && 
               __eventId !== this.scrollbarX.previousPointerId && 
               __eventId !== this.scrollbarY.previousPointerId) 
            {
                console.log("was scrolling, touch extended")
                uss.setXStepLengthCalculator(this.options.easingX, this.originalContainer, true, this.options);
                uss.setYStepLengthCalculator(this.options.easingY, this.originalContainer, true, this.options);
                this.#touchScrollExtender(event);
            }
        } 
        
        //Needed for the pointerevents to work as expected. 
        this.originalContainer.style.touchAction = "none";
        
        this.originalContainer.addEventListener("pointerdown", _handlePointerDownEvent, {passive:false});
        this.originalContainer.addEventListener("wheel", (event) => {
            uss.setXStepLengthCalculator(this.options.easingX, this.originalContainer, true, this.options);
            uss.setYStepLengthCalculator(this.options.easingY, this.originalContainer, true, this.options);
            _handleContainerScrolling(event.deltaX, event.deltaY, event);
        }, {passive:false});
    }

    /**
     * The passed callback will be added to the callback queue.
     * The passed callback will be the last to be invoked.
     * @param {Function} callback A function that will be invoked after all the current callback's queue functions.
     */
    addCallback(callback) {
        const _originalCallback = this.callback;
        this.callback = () => {
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

    get currentXPosition() {
        return this.#getCurrentXPosition();
    }

    get currentYPosition() {
        return this.#getCurrentYPosition();
    }
}