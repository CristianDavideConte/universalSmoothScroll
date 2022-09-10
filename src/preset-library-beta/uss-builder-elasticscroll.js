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
        this.elasticChildren = this.options.children;

        //The first children is always aligned to the start of the container.
        this.options.children[0].align = "start";

        //The second children is always aligned to the end of the container.
        if(this.options.children.length > 1) this.options.children[1].align = "end";
        
        this.elasticSpeedModifier = (delta, finalPos, getMaxScroll) => {
            const __nextFinalPos = finalPos + delta;
            if(__nextFinalPos <= this.elasticAmount) {
                //We're at the left of the passed container, the snap scrolling
                //will be triggered on this.elasticChildren[0] with align = "start".
                if(this.elasticChildren[0]) this.options.children = [this.elasticChildren[0]];

                //If the user scrolls in the same direction as the elastic part of
                //this scroll-animation, it won't encounter resistance. 
                if(delta > 0) return delta; 

                //Mathematical explanation of the below delta's easing: 
                //finalPos => f1 = -x + k   //f1 in [0.._elasticAmount]
                //_progress => f2 = f1 / k  //f2 in [1..0]
                //easing    => f3 = f2^(3)  //f3 in [0..1]
                //Since the result will be a negative number, Math.floor is used to round its |value|.
                const __progress = finalPos / this.elasticAmount;
                if(__progress > 1) return this.elasticAmount - finalPos;
                if(__progress < 0) return 0; 
                return Math.floor(delta * Math.pow(__progress, 3)); //delta * f3
            }
        
            const __maxScroll = getMaxScroll(this.originalContainer, false, this.options);
            if(__nextFinalPos >= __maxScroll - this.elasticAmount) {
                //We're at the bottom of the passed container, the snap scrolling
                //will be triggered on this.elasticChildren[1] with align = "end".
                if(this.elasticChildren[1]) this.options.children = [this.elasticChildren[1]];

                //If the user scrolls in the same direction as the elastic part of
                //this scroll-animation, it won't encounter resistance. 
                if(delta < 0) return delta; 
                
                //Mathematical explanation of the below delta's easing: 
                //finalPos => f1 = -x + k   //f1 in [_maxScroll - _elasticAmount.._maxScroll]
                //_progress => f2 = f1 / k  //f2 in [1..0]
                //easing    => f3 = f2^(3)  //f3 in [0..1]
                //Since the result will be a positive number, Math.ceil is used to round its |value|.
                const __progress = (__maxScroll - finalPos) / this.elasticAmount;
                if(__progress > 1) return __maxScroll - this.elasticAmount - finalPos;
                if(__progress < 0) return 0; 
                return Math.ceil(delta * Math.pow(__progress, 3)); //delta * f3
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
        this.originalBuilder.addCallback(callback);
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