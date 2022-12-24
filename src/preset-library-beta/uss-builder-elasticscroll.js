/**
 * TODO: THIS WILL BE THE NEXT EXTERNAL INTERFACE FOR THE ELASTIC SCROLL BUILDER.
 * 
 * addElasticScrolling{
 *     container,
 *     {   
 *         onXAxis: true,
 *         onYAxis: true,
 *         ...
 *         children: [ //OPTIONAL
 *            {
 *                 element: document.getElementById("easeFunctionSelectorList").children[0], //COMPULSORY
 *                 position: "top",                                                          //COMPULSORY 
 *                 elasticResistance: 3,                                                     //OPTIONAL
 *                 elasticEasingX: () => 25                                                  //OPTIONAL
 *                 elasticEasingY: () => 12                                                  //OPTIONAL
 *                 getElasticAmount: (options) => {                                          //OPTIONAL
 *                    return 100; 
 *                 }
 *            }, 
 *            {
 *                 element: document.getElementById("easeFunctionSelectorList").children[1],
 *                 position: "right",                                                          
 *                 elasticResistance: 10,
 *                 elasticEasingX: () => 25                                                  
 *                 getElasticAmount: (options) => {                                            
 *                    return options.container.originalContainer.clientHeight / 10; 
 *                 }
 *            },
 *            {
 *                 element: document.body.children[1],
 *                 position: "bottom",                                                          
 *                 elasticEasingY: () => 25                                                  
 *                 getElasticAmount: (options) => 25
 *             },
 *             {
 *                 element: document.body.children[0],
 *                 position: "left",                                                          
 *             }
 *          ]
 *     }
 * }
 * 
 * 
 *  Defaults:
 * - children: []
 * 
 * - element: undefined
 * - position: undefined
 * - elasticEasingX: //see preset.js
 * - elasticEasingY: //see preset.js
 * - elasticResistance: 3
 * - getElasticAmount: (options) => { 
 *      return this.style.padding\\Top/Left/Bottom/Right\\ || 0;
 *   }
 */

import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";

const elasticPositionsRegex = /top|right|bottom|left/i;
const defaultParameters = {
    "top" : {
        align: "start",
        getElasticAmount: (style) => Number.parseFloat(style.paddingTop), 
    },
    "right" : {
        align: "end",
        getElasticAmount: (style) => Number.parseFloat(style.paddingRight), 
    },
    "bottom" : {
        align: "end",
        getElasticAmount: (style) => Number.parseFloat(style.paddingBottom), 
    },
    "left" : {
        align: "start",
        getElasticAmount: (style) => Number.parseFloat(style.paddingLeft), 
    },
}

export class ElasticScrollBuilder extends SmoothScrollBuilder {

    #childrenMap;
    #remapElasticChildren;

    //Parameters already sanitized.
    constructor(container, options) {
        super(container, options);

        this.#remapElasticChildren = () => {
            this.#childrenMap = new Map();

            for(const childObject of this.options.children) {
                if(elasticPositionsRegex.test(childObject.position)) {
                    const _childObjectPosition = childObject.position.toLowerCase();
                    const _childObjectDefaultParameters = defaultParameters[_childObjectPosition];
                    
                    //If needed, define the elasticResistance of the childObject.
                    if(!Number.isFinite(childObject.elasticResistance)) childObject.elasticResistance = 3;
                    
                    //If needed, define the getElasticAmount function of the childObject.
                    if(typeof childObject.getElasticAmount !== "function")  {
                        childObject.getElasticAmount = () => _childObjectDefaultParameters.getElasticAmount(this.style);
                    }

                    childObject.snapEasingX = childObject.elasticEasingX || this.options.elasticEasingX;
                    childObject.snapEasingY = childObject.elasticEasingY || this.options.elasticEasingY;

                    childObject.alignX = _childObjectDefaultParameters.align;
                    childObject.alignY = _childObjectDefaultParameters.align;

                    this.#childrenMap.set(_childObjectPosition, childObject);
                }
            }

            //For the missing children, assign null so that no effect will be applied.
            if(!this.#childrenMap.get("top"))    this.#childrenMap.set("top", null);
            if(!this.#childrenMap.get("right"))  this.#childrenMap.set("right", null);
            if(!this.#childrenMap.get("bottom")) this.#childrenMap.set("bottom", null);
            if(!this.#childrenMap.get("left"))   this.#childrenMap.set("left", null);
        }
    }

    build() {
        this.onXAxis = this.options.onXAxis;
        this.onYAxis = this.options.onYAxis;

        this.elasticChildren = this.options.children;

        this.#remapElasticChildren();

        this.elasticSpeedModifier = (delta, finalPos, getMaxScroll, firstChildObject, lastChildObject) => {
            const _nextFinalPos = finalPos + delta; 

            if(firstChildObject) {
                const _firstChildElasticAmount = firstChildObject.getElasticAmount(this.options); 

                if(_nextFinalPos <= _firstChildElasticAmount) {
                    /**
                     * If the user scrolls in the same direction as the elastic part of
                     * this scroll-animation, it will be helped to reach the beginning of the 
                     * "elastic" part of the container. 
                     */
                    if(delta > 0) return _firstChildElasticAmount - finalPos;

                    //Make the __progress between 0 and 1.
                    let __progress = finalPos / _firstChildElasticAmount;
                    if(__progress < 0) __progress = 0;
                    else if(__progress > 1) __progress = 1;

                    /**
                     * An ease-out pattern (inverted wrt y = __firstChildElasticAmount / 2) is applied to the original delta.
                     * Since the ease-out pattern returns a negative number, Math.floor (and not Math.ceil) is used to round it. 
                     * The __finalDelta goes from the original delta to 0.    
                     */
                    const _finalDelta = Math.floor(delta * Math.pow(__progress, firstChildObject.elasticResistance));
    
                    /**
                     * The current scroll-position is at the left/top of the passed container, the snap scrolling
                     * will be triggered on firstChild (if it was passed) with align = "start".
                     */
                    if(finalPos + _finalDelta <= _firstChildElasticAmount) {
                        firstChildObject.alignX = "start";
                        firstChildObject.alignY = "start";
                        firstChildObject.snapEasingX = firstChildObject.elasticEasingX || this.options.elasticEasingX;
                        firstChildObject.snapEasingY = firstChildObject.elasticEasingY || this.options.elasticEasingY;
                        this.options.children = [firstChildObject];
                    }

                    return _finalDelta;
                }
            }
        
            if(lastChildObject) {
                const _maxScroll = getMaxScroll(this.originalContainer, false, this.options);
                const _lastChildElasticAmount = lastChildObject.getElasticAmount(this.options); 
                const _bottomElasticBoundary = _maxScroll - _lastChildElasticAmount; 

                if(_nextFinalPos >= _bottomElasticBoundary) {
                    /**
                     * If the user scrolls in the same direction as the elastic part of
                     * this scroll-animation, it will be helped to reach the beginning of the 
                     * "elastic" part of the container. 
                     */
                    if(delta < 0) return _bottomElasticBoundary - finalPos;

                    //Make the __progress between 0 and 1.
                    let __progress = (_maxScroll - finalPos) / _lastChildElasticAmount;
                    if(__progress < 0) __progress = 0;
                    else if(__progress > 1) __progress = 1;

                    /**
                     * An ease-out pattern (inverted wrt y = __lastChildElasticAmount / 2) is applied to the original delta.
                     * Since the ease-out pattern returns a positive number, Math.ceil (and not Math.floor) is used to round it. 
                     * The __finalDelta goes from the original delta to 0.    
                     */
                    const _finalDelta = Math.ceil(delta * Math.pow(__progress, lastChildObject.elasticResistance));

                    /**
                     * The current scroll-position is at the right/bottom of the passed container, the snap scrolling
                     * will be triggered on lastChild (if it was passed) with align = "end".
                     */
                    if(finalPos + _finalDelta >= _bottomElasticBoundary) {
                        lastChildObject.alignX = "end";
                        lastChildObject.alignY = "end";
                        lastChildObject.snapEasingX = lastChildObject.elasticEasingX || this.options.elasticEasingX;
                        lastChildObject.snapEasingY = lastChildObject.elasticEasingY || this.options.elasticEasingY;
                        this.options.children = [lastChildObject];
                    }

                    return _finalDelta;
                }
            }
        
            //The snap scrolling won't be triggered because we're not 
            //at any end of the passed container.
            this.options.children = [];
            return delta;
        }

        if(this.onXAxis) {
            this.addSpeedModifierX(
                (deltaX, deltaY, event) => {
                    let _leftChildObject = this.#childrenMap.get("left");
                    let _rightChildObject = this.#childrenMap.get("right");

                    if(_leftChildObject === undefined || _rightChildObject === undefined) {
                        this.#remapElasticChildren();
                        _leftChildObject = this.#childrenMap.get("left");
                        _rightChildObject = this.#childrenMap.get("right");
                    }
                    
                    return this.elasticSpeedModifier(
                        deltaX, 
                        uss.getFinalXPosition(this.originalContainer, this.options), 
                        uss.getMaxScrollX,
                        _leftChildObject, 
                        _rightChildObject
                    );
                }
            );
        }
        
        if(this.onYAxis) {
            this.addSpeedModifierY(
                (deltaX, deltaY, event) => {
                    let _topChildObject = this.#childrenMap.get("top");
                    let _bottomChildObject = this.#childrenMap.get("bottom");

                    if(_topChildObject === undefined || _bottomChildObject === undefined) {
                        this.#remapElasticChildren();
                        _topChildObject = this.#childrenMap.get("top");
                        _bottomChildObject = this.#childrenMap.get("bottom");
                    }
                    
                    return this.elasticSpeedModifier(
                        deltaY, 
                        uss.getFinalYPosition(this.originalContainer, this.options), 
                        uss.getMaxScrollY,
                        _topChildObject, 
                        _bottomChildObject
                    );
                }
            );
        }
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

    executeCallback() {
        this.container.executeCallback();
    }

    get originalContainer() {
        return this.container.originalContainer;
    }

    get originalBuilder() {
        return this.container.originalBuilder;
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