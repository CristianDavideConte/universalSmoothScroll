export class SmoothScrollBuilder {
    
    #pointersDownIds = [];
    
    #overscrollConditionsX;
    #overscrollConditionsY;
    #overscrollConditionsXFilter;
    #overscrollConditionsYFilter;

    #smoothScroller;
    #touchScrollExtender;

    #style;
    #getCurrentXPosition;
    #getCurrentYPosition;


    //Parameters already sanitized.
    constructor(container, options) {
        this.container = container; 
        this.options = options;
        
        this.callbackQueue = [];
        this.speedModifierXQueue = [];
        this.speedModifierYQueue = [];

        //"bind" is used so "this" can be used inside these functions.
        this.addCallback = this.addCallback.bind(this); 
        this.addSpeedModifierX = this.addSpeedModifierX.bind(this); 
        this.addSpeedModifierY = this.addSpeedModifierY.bind(this); 
        this.executeCallback = this.executeCallback.bind(this);
        this.executeSpeedModifierX = this.executeSpeedModifierX.bind(this);
        this.executeSpeedModifierY = this.executeSpeedModifierY.bind(this);

        //Getters for the current positions on the x and y axes of this.originalContainer.
        this.#getCurrentXPosition = uss.getScrollXCalculator(this.originalContainer, this.options);
        this.#getCurrentYPosition = uss.getScrollYCalculator(this.originalContainer, this.options);
    }

    build() {
        //Needed for the touch-related pointerevents to work as expected. 
        this.originalContainer.style.touchAction = "none";

        this.onXAxis = this.options.onXAxis;
        this.onYAxis = this.options.onYAxis;
        
        //The only callback initially available is the options.callback one.
        //Other builders can add other callbacks with the addCallback method. 
        this.addCallback(this.options.callback);

        //The only speedModifiers initially available are the options.speedModifierX/Y ones.
        //Other builders can add more speedModifiers with the addSpeedModifierX/Y methods.
        this.addSpeedModifierX(this.options.speedModifierX);
        this.addSpeedModifierY(this.options.speedModifierY);

        //Default scrollbars objects.
        this.scrollbarX = { previousPointerId: null, isEngaged: () => false, updatePosition: () => {} };
        this.scrollbarY = { previousPointerId: null, isEngaged: () => false, updatePosition: () => {} };
        
        //Cache the live pointer to the computed style of this.originalContainer.
        this.#style = window.getComputedStyle(this.originalContainer);

        this.#overscrollConditionsX = this.options.overscrollX ? (deltaX, deltaY, event) => {
            //With no movement, the overscroll conditions can never be satisfied.
            if(deltaX === 0) return false;

            //Only the scrollbarX is checked because any scrollbarY movement will produce a 
            //wheel event with deltaX = 0, so the conditions below will fail.
            if(this.scrollbarX.isEngaged()) return false;

            //If the x-axis is non-scrollable, filter out micro-movements
            //before considering the overscroll conditions.
            if(this.#overscrollConditionsXFilter(deltaX, deltaY)) return false;

            const __nextPos = this.currentXPosition + this.executeSpeedModifierX(deltaX, deltaY, event);
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

            const __nextPos = this.currentYPosition + this.executeSpeedModifierY(deltaX, deltaY, event);
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
                uss.scrollXBy(
                    this.executeSpeedModifierX(deltaX, deltaY, event), 
                    this.originalContainer, 
                    this.executeCallback, 
                    false, 
                    true, 
                    this.options
                );
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
                uss.scrollYBy(
                    this.executeSpeedModifierY(deltaX, deltaY, event), 
                    this.originalContainer, 
                    this.executeCallback, 
                    false, 
                    true, 
                    this.options
                );                                                            
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
                    this.executeSpeedModifierX(deltaX, deltaY, event), 
                    this.executeSpeedModifierY(deltaX, deltaY, event), 
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
                
                //Apply the overscroll only if a scrollable parent exists.
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
            
            /**
             * Whenever a pointer the first pointer is held down, stop the current scrolling.
             * The new scroll-animation will start from the current position.
             */
            uss.stopScrolling(this.originalContainer);
            this.scrollbarX.updatePosition();
            this.scrollbarY.updatePosition();
            
            //The pointermove event is not relevant if the pointer is a scrollbar.
            if(event.pointerType === "scrollbar") return;

            //Makes this.originalContainer's scroll-animations instantly follow the pointer movements.
            uss.setStepLengthCalculator(
                remaning => remaning / 2 + 1, 
                this.originalContainer, 
                false, 
                this.options
            );

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
                this.executeCallback();
                return;
            } 
            
            //Extend the scroll only if it was not caused by a scrollbar.
            if(event.pointerType !== "mouse" && 
               __eventId !== this.scrollbarX.previousPointerId && 
               __eventId !== this.scrollbarY.previousPointerId
            ){
                uss.setXStepLengthCalculator(this.options.easingX, this.originalContainer, true, this.options);
                uss.setYStepLengthCalculator(this.options.easingY, this.originalContainer, true, this.options);
                this.#touchScrollExtender(event);
            }
        } 
        
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
        this.callbackQueue.push(callback);
    }

    /**
     * The passed speedModifier will be added to the x-axis speedModifiers' queue.
     * The passed speedModifier will be the last one to modify the deltaX value and its deltaX
     * will be the returned value of all the other speedModifiers in the queue.
     * @param {Function} speedModifier A function that will modify the deltaX value to add to the current scroll-animation,
     *                                 it will be invoked after all the current x-axis speedModifiers' queue.
     */
    addSpeedModifierX(speedModifier) {
        this.speedModifierXQueue.push(speedModifier);
    }

    /**
     * The passed speedModifier will be added to the y-axis speedModifiers' queue.
     * The passed speedModifier will be the last one to modify the deltaY value and its deltaY
     * will be the returned value of all the other speedModifiers in the queue.
     * @param {Function} speedModifier A function that will modify the deltaY value to add to the current scroll-animation,
     *                                 it will be invoked after all the current y-axis speedModifiers' queue.
     */
    addSpeedModifierY(speedModifier) {
        this.speedModifierYQueue.push(speedModifier);
    }

    /**
     * If the user is not holding down any scrollbar or touch-related-pointer,
     * executes every callback inside this.callbackQueue. 
     * Wait for the pointerup event otherwise.
     * Each callback of this.callbackQueue is considered async and executeCallback waits until
     * the current callback completes and tells this method to proceed to the next callback.
     * Callbacks that are not actually async will immediately resolve. 
     */
    async executeCallback() {
        if(this.#pointersDownIds.length === 0) {
            for(const callback of this.callbackQueue) {
                await callback();
            }
        }
    }

    /**
     * @param {*} deltaX The original deltaX that should be added to the current scroll-animation on the x-axis of this.orginalContainer. 
     * @param {*} deltaY The original deltaY that should be added to the current scroll-animation on the y-axis of this.orginalContainer.
     * @param {*} event The original event that triggered this method.
     * @returns The final deltaX modified accordingly to all the speedModifiers inside this.speedModifierXQueue.
     */
    executeSpeedModifierX(deltaX, deltaY, event) {
        for(const speedModifier of this.speedModifierXQueue) {
            deltaX = speedModifier(deltaX, deltaY, event);
        }
        return deltaX;
    }

    /**
     * @param {*} deltaX The original deltaX that should be added to the current scroll-animation on the x-axis of this.orginalContainer. 
     * @param {*} deltaY The original deltaY that should be added to the current scroll-animation on the y-axis of this.orginalContainer.
     * @param {*} event The original event that triggered this method.
     * @returns The final deltaY modified accordingly to all the speedModifiers inside this.speedModifierYQueue.
     */
    executeSpeedModifierY(deltaX, deltaY, event) {
        for(const speedModifier of this.speedModifierYQueue) {
            deltaY = speedModifier(deltaX, deltaY, event);
        }
        return deltaY;
    }

    get originalContainer() {
        return this.container;
    }

    get originalBuilder() {
        return this;
    }

    get isPointerDown() {
        return this.#pointersDownIds.length !== 0;
    }

    get style() {
        return this.#style;
    }

    get currentXPosition() {
        return this.#getCurrentXPosition();
    }

    get currentYPosition() {
        return this.#getCurrentYPosition();
    }
}