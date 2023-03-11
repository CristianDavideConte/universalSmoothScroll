import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";

export class ElasticScrollBuilder extends SmoothScrollBuilder {

    #topLeftSpeedModifier;
    #bottomRightSpeedModifier;

    #elasticParamsX;
    #elasticParamsY;

    //Parameters already sanitized.
    constructor(container, options) {
        super(container, options);

        this.#topLeftSpeedModifier = (
            event,
            delta, 
            finalPos, 
            elasticAmount, 
            elasticResistance, 
            setElasticParams
        ) => {
            //Make the __progress between 0 and 1.
            let _progress = finalPos / elasticAmount;
            if(_progress < 0) _progress = 0;
            else if(_progress > 1) _progress = 1;

            /**
             * If the user scrolls in the same direction as the elastic part of this scroll-animation, the container: 
             *  - will scroll according to the movement of any pointer event 
             *  - will scroll to the start of the "elastic" part of the container otherwise
             */
            if(delta >= 0 || elasticAmount <= 0) {
                const _isPointerEvent = this.isPointerDown || event.type === "pointermove"; 
                return _isPointerEvent || _progress >= 1 ? delta : elasticAmount - finalPos;
            }

            /**
             * An ease-out pattern (inverted wrt y = elasticAmount / 2) is applied to the original delta.
             * Since the ease-out pattern returns a negative number, Math.floor (and not Math.ceil) is used to round it. 
             * The __finalDelta goes from the original delta to 0.    
             */
            const _finalDelta = Math.floor(delta * Math.pow(_progress, elasticResistance));

            //console.log(_progress, _finalDelta)
            /**
             * The current scroll-position is at the top (or left) of the passed container,
             * trigger the elastic scroll.
             */
            if(finalPos + _finalDelta <= elasticAmount) {
                setElasticParams(elasticAmount);
            } else {
                setElasticParams(null);
            }

            return _finalDelta;
        } 

        this.#bottomRightSpeedModifier = (
            event,
            delta, 
            finalPos, 
            elasticAmount, 
            elasticResistance, 
            maxScroll, 
            setElasticParams
        ) => {
            //Make the __progress between 0 and 1.
            let _progress = (maxScroll - finalPos) / elasticAmount;
            if(_progress < 0) _progress = 0;
            else if(_progress > 1) _progress = 1;

            const _boundary = maxScroll - elasticAmount;
            
            /**
             * If the user scrolls in the same direction as the elastic part of this scroll-animation, the container: 
             *  - will scroll according to the movement of any pointer event 
             *  - will scroll to the start of the "elastic" part of the container otherwise
             */
            if(delta < 0 || elasticAmount <= 0) {
                const _isPointerEvent = this.isPointerDown || event.type === "pointermove"; 
                return _isPointerEvent || _progress >= 1 ? delta : _boundary - finalPos;
            }

            /**
             * An ease-out pattern (inverted wrt y = elasticAmount / 2) is applied to the original delta.
             * Since the ease-out pattern returns a positive number, Math.ceil (and not Math.floor) is used to round it. 
             * The __finalDelta goes from the original delta to 0.    
             */
            const _finalDelta = Math.ceil(delta * Math.pow(_progress, elasticResistance));
            //console.log(elasticResistance)

            /**
             * The current scroll-position is at the bottom (or right) of the passed container,
             * trigger the elastic scroll.
             */
            if(finalPos + _finalDelta >= _boundary) {
                setElasticParams(maxScroll - elasticAmount);
            } else {
                setElasticParams(null);
            }

            return _finalDelta;
        } 
    }

    build() {
        this.onXAxis = this.options.onXAxis;
        this.onYAxis = this.options.onYAxis;

        //Save the original callback so that even if it's modified by other builders,
        //we still have a reference to it.
        this.callback = this.options.callback;

        if(this.onXAxis) {
            this.#elasticParamsX = {
                pos: this.options.left.getElasticAmount(this),
                easing: this.options.left.easing,
            }

            this.addSpeedModifierX(
                (deltaX, deltaY, event) => {
                    const __currentFinalPos = uss.getFinalXPosition(this.originalContainer, this.options); 
                    const __nextFinalPos = __currentFinalPos + deltaX;
                   
                    //The final position is in the left elastic zone.
                    let __elasticAmount = this.options.left.getElasticAmount(this);
                    if(__nextFinalPos <= __elasticAmount) {
                        return this.#topLeftSpeedModifier(
                            event,
                            deltaX, 
                            __currentFinalPos, 
                            __elasticAmount, 
                            this.options.left.elasticResistance, 
                            (pos) => {
                                this.#elasticParamsX = pos === null ? null : {
                                    pos: pos,
                                    easing: this.options.left.easing
                                }
                            },
                        );
                    } 

                    //The final position is in the right elastic zone.
                    const __maxScroll = uss.getMaxScrollX(this.originalContainer, false, this.options);
                    __elasticAmount = this.options.right.getElasticAmount(this);
                    if(__nextFinalPos >= __maxScroll - __elasticAmount) {
                        return this.#bottomRightSpeedModifier(
                            event,
                            deltaX, 
                            __currentFinalPos, 
                            __elasticAmount, 
                            this.options.right.elasticResistance, 
                            __maxScroll,
                            (pos) => {
                                this.#elasticParamsX = pos === null ? null : {
                                    pos: pos,
                                    easing: this.options.right.easing
                                }
                            }, 
                        );
                    }

                    //The final position is not in any elastic zone.
                    this.#elasticParamsX = null;
                    return deltaX;
                }
            );
        } else {
            this.#elasticParamsX = null;
        }
        
        if(this.onYAxis) {
            this.#elasticParamsY = {
                pos: this.options.top.getElasticAmount(this),
                easing: this.options.top.easing,
            }

            this.addSpeedModifierY(
                (deltaX, deltaY, event) => {
                    const __currentFinalPos = uss.getFinalYPosition(this.originalContainer, this.options); 
                    const __nextFinalPos = __currentFinalPos + deltaY;
                    
                    //The final position is in the top elastic zone.
                    let __elasticAmount = this.options.top.getElasticAmount(this);
                    if(__nextFinalPos <= __elasticAmount) {
                        return this.#topLeftSpeedModifier(
                            event,
                            deltaY, 
                            __currentFinalPos, 
                            __elasticAmount, 
                            this.options.top.elasticResistance, 
                            (pos) => {
                                this.#elasticParamsY = pos === null ? null : {
                                    pos: pos,
                                    easing: this.options.top.easing
                                }
                            },
                        );
                    } 

                    //The final position is in the bottom elastic zone.
                    const __maxScroll = uss.getMaxScrollY(this.originalContainer, false, this.options);
                    __elasticAmount = this.options.bottom.getElasticAmount(this);
                    if(__nextFinalPos >= __maxScroll - __elasticAmount) {
                        return this.#bottomRightSpeedModifier(
                            event,
                            deltaY, 
                            __currentFinalPos, 
                            __elasticAmount, 
                            this.options.bottom.elasticResistance, 
                            __maxScroll,
                            (pos) => {
                                this.#elasticParamsY = pos === null ? null : {
                                    pos: pos,
                                    easing: this.options.bottom.easing
                                }
                            }, 
                        );
                    }

                    //The final position is not in any elastic zone.
                    this.#elasticParamsY = null;
                    return deltaY;
                }
            );
        } else {
            this.#elasticParamsY = null;
        }
        
        /**
         * If this.#elasticParamsX or this.#elasticParamsY are not null:
         * - wait for the options.activationDelay timeout
         * - scroll back to the position specified by this.#elasticParamsX/Y.pos with
         *   the easings specified by this.#elasticParamsX/Y.easing
         * - tell the underlying SmoothScrollBuilder to proceed in the callbacks chain
         */
        this.elasticScrolling = async () => {
            return new Promise((resolve) => {
                this.resolve = resolve;

                window.clearTimeout(this.elasticScrollingTimeout);
                this.elasticScrollingTimeout = window.setTimeout(() => {
                    if(this.#elasticParamsX && !this.#elasticParamsY) {
                        uss.setXStepLengthCalculator(this.#elasticParamsX.easing, this.originalContainer, true, this.options);
                        uss.scrollXTo(
                            this.#elasticParamsX.pos,
                            this.originalContainer,
                            this.executeCallback,
                            false, 
                            this.options
                        );

                        this.scrollbarX.updatePosition();
                    } else if(!this.#elasticParamsX && this.#elasticParamsY) {
                        uss.setYStepLengthCalculator(this.#elasticParamsY.easing, this.originalContainer, true, this.options);
                        uss.scrollYTo(
                            this.#elasticParamsY.pos,
                            this.originalContainer,
                            this.executeCallback,
                            false, 
                            this.options
                        );

                        this.scrollbarY.updatePosition();
                    } else if(this.#elasticParamsX && this.#elasticParamsY) {
                        uss.setXStepLengthCalculator(this.#elasticParamsX.easing, this.originalContainer, true, this.options);
                        uss.setYStepLengthCalculator(this.#elasticParamsY.easing, this.originalContainer, true, this.options);
                        uss.scrollTo(
                            this.#elasticParamsX.pos,
                            this.#elasticParamsY.pos,
                            this.originalContainer,
                            this.executeCallback,
                            false,
                            this.options
                        );

                        this.scrollbarX.updatePosition();
                        this.scrollbarY.updatePosition();
                    } else {
                        this.executeCallback();
                    }
                }, this.options.activationDelay);
            });
        }

        //Allow this.elasticScrolling to work onresize.
        uss.addResizeCallback(() => {
            let __elasticAmount = this.options.left.getElasticAmount(this);
            if(this.currentXPosition < __elasticAmount) {
                this.#elasticParamsX = {
                    pos: __elasticAmount,
                    easing: this.options.left.easing,
                }
            } else {
                const __maxScroll = uss.getMaxScrollX(this.originalContainer, false, this.options);
                __elasticAmount = this.options.right.getElasticAmount(this);
                if(this.currentXPosition > __maxScroll - __elasticAmount) {
                    this.#elasticParamsX = {
                        pos: __maxScroll - __elasticAmount,
                        easing: this.options.right.easing
                    }
                }
            }

            __elasticAmount = this.options.top.getElasticAmount(this);
            if(this.currentYPosition < __elasticAmount) {
                this.#elasticParamsY = {
                    pos: __elasticAmount,
                    easing: this.options.top.easing,
                }
            } else {
                const __maxScroll = uss.getMaxScrollY(this.originalContainer, false, this.options);
                __elasticAmount = this.options.bottom.getElasticAmount(this);
                if(this.currentYPosition > __maxScroll - __elasticAmount) {
                    this.#elasticParamsY = {
                        pos: __maxScroll - __elasticAmount,
                        easing: this.options.bottom.easing
                    }
                }
            }

            this.elasticScrolling();
        }, this.originalContainer, this.options); 
        this.addCallback(this.elasticScrolling);

        //Temporarily set the activationDelay to 0, so that elasticScrolling can be immediately applied.
        const _activationDelay = this.options.activationDelay;
        this.options.activationDelay = 0;
        this.elasticScrolling();
        this.options.activationDelay = _activationDelay;
    }

    addCallback(callback) {
        this.container.addCallback(callback);
    }

    addSpeedModifierX(speedModifier) {
        this.container.addSpeedModifierX(speedModifier);
    }
    
    addSpeedModifierY(speedModifier) {
        this.container.addSpeedModifierY(speedModifier);
    }

    async executeCallback() {
        await this.callback(); //Executes the callback passed to the SnapScrollBuilder
        this.resolve(); //Tells this.originalBuilder to proceed to the next effect/callback
    }

    get originalContainer() {
        return this.container.originalContainer;
    }

    get originalBuilder() {
        return this.container.originalBuilder;
    }
    
    get isPointerDown() {
        return this.container.isPointerDown;
    }

    get style() {
        return this.container.style;
    }

    get currentXPosition() {
        return this.container.currentXPosition;
    }

    get currentYPosition() {
        return this.container.currentYPosition;
    }
    
    get scrollbarX() {
        return this.container.scrollbarX;
    }

    get scrollbarY() {
        return this.container.scrollbarY;
    }
}