import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";

export class ElasticScrollBuilder extends SmoothScrollBuilder {

    //Parameters already sanitized.
    constructor(container, options) {
        super(container, options);
    }

    build() {
        this.onXAxis = this.options.onXAxis;
        this.onYAxis = this.options.onYAxis;

        this.elasticAmount = this.options.elasticAmount;
        this.elasticResistance = this.options.elasticResistance;
        this.elasticChildren = this.options.children;

        //The first children is always aligned to the start of the container.
        this.elasticChildren[0].align = "start";

        //The second children is always aligned to the end of the container.
        if(this.elasticChildren[1]) this.elasticChildren[1].align = "end";
        
        this.elasticSpeedModifier = (delta, finalPos, getMaxScroll) => {
            const __nextFinalPos = finalPos + delta;
            if(__nextFinalPos <= this.elasticAmount) {
                /**
                 * If the user scrolls in the same direction as the elastic part of
                 * this scroll-animation, it will be helped to reach the beginning of the 
                 * "elastic" part of the container. 
                 */
                if(delta > 0) return this.elasticAmount - finalPos;

                //Make the __progress between 0 and 1.
                let __progress = finalPos / this.elasticAmount;
                if(__progress < 0) __progress = 0;
                else if(__progress > 1) __progress = 1;

                /**
                 * An ease-out pattern (inverted wrt y = this.elasticAmount / 2) is applied to the original delta.
                 * Since the ease-out pattern returns a negative number, Math.floor (and not Math.ceil) is used to round it. 
                 * The __finalDelta goes from the original delta to 0.    
                 */
                const __finalDelta = Math.floor(delta * Math.pow(__progress, this.elasticResistance));
  
                /**
                 * The current scroll-position is at the left/top of the passed container, the snap scrolling
                 * will be triggered on this.elasticChildren[0] (if it was passed) with align = "start".
                 */
                if(finalPos + __finalDelta <= this.elasticAmount && 
                   this.elasticChildren[0]
                ) {
                    this.elasticChildren[0].align = "start";
                    this.options.children = [this.elasticChildren[0]];
                }

                return __finalDelta;
            }
        
            const __maxScroll = getMaxScroll(this.originalContainer, false, this.options);
            const __bottomElasticBoundary = __maxScroll - this.elasticAmount; 
            if(__nextFinalPos >= __bottomElasticBoundary) {
                /**
                 * If the user scrolls in the same direction as the elastic part of
                 * this scroll-animation, it will be helped to reach the beginning of the 
                 * "elastic" part of the container. 
                 */
                if(delta < 0) return __bottomElasticBoundary - finalPos;

                //Make the __progress between 0 and 1.
                let __progress = (__maxScroll - finalPos) / this.elasticAmount;
                if(__progress < 0) __progress = 0;
                else if(__progress > 1) __progress = 1;

                /**
                 * An ease-out pattern (inverted wrt y = this.elasticAmount / 2) is applied to the original delta.
                 * Since the ease-out pattern returns a positive number, Math.ceil (and not Math.floor) is used to round it. 
                 * The __finalDelta goes from the original delta to 0.    
                 */
                const __finalDelta = Math.ceil(delta * Math.pow(__progress, this.elasticResistance));

                /**
                 * The current scroll-position is at the right/bottom of the passed container, the snap scrolling
                 * will be triggered on this.elasticChildren[1] (if it was passed) with align = "end".
                 */
                if(finalPos + __finalDelta >= __bottomElasticBoundary && 
                   this.elasticChildren[1]
                ) {
                    this.elasticChildren[1].align = "end";
                    this.options.children = [this.elasticChildren[1]];
                }

                return __finalDelta;
            }
        
            //The snap scrolling won't be triggered because we're not 
            //at any end of the passed container.
            this.options.children = [];
            return delta;
        }

        if(this.onXAxis) {
            this.originalBuilder.options.speedModifierX = (deltaX, deltaY) => {
                return this.elasticSpeedModifier(deltaX, uss.getFinalXPosition(this.originalContainer, this.options), uss.getMaxScrollX);
            }
        }
        
        if(this.onYAxis) {
            this.originalBuilder.options.speedModifierY = (deltaX, deltaY) => {
                return this.elasticSpeedModifier(deltaY, uss.getFinalYPosition(this.originalContainer, this.options), uss.getMaxScrollY);
            }
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