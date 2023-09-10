/**
 * TODO: THIS WILL BE THE NEXT EXTERNAL INTERFACE FOR THE SNAP SCROLL BUILDER.
 * 
 * addSnapScrolling{
 *     container,
 *     {   
 *         onXAxis: "mandatory",
 *         onYAxis: "proximity",
 *         ...
 *         children: [ //OPTIONAL
 *            {
 *                 element: document.getElementById("easeFunctionSelectorList").children[0], //COMPULSORY
 *                 alignX: "center",                                                         //OPTIONAL 
 *                 alignY: "center",                                                         //OPTIONAL 
 *                 snapEasingX: () => 25                                                     //OPTIONAL 
 *                 snapEasingY: () => 12                                                     //OPTIONAL 
 *            }, 
 *            {
 *                 element: document.getElementById("easeFunctionSelectorList").children[1],
 *                 alignX: "left",                                                             
 *                 alignY: "top",                                                             
 *                 snapEasingY: () => 27                                                      
 *            },
 *            {
 *                 element: document.body.children[1],
 *                 alignX: "right",                                                          
 *                 alignY: "bottom",                                                              
 *             },
 *             {
 *                 element: document.body.children[0],                                      
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
 * - alignX: "center"
 * - alignY: "center"
 * - snapEasingX: //see preset.js
 * - snapEasingY: //see preset.js
 */

import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";
import * as uss from "./../main/uss.js";

const MANDATORY_SNAP = 2;
const PROXIMITY_SNAP = 1;
const NO_SNAP = 0;

export class SnapScrollBuilder extends SmoothScrollBuilder {
    
    #calcDistances;
    #calcEuclideanDistance;
    #snapScroll;

    #intersectionObserver; 
    #intersectingElements;

    //Parameters already sanitized.
    constructor(container, options) {
        super(container, options);
    }

    build() {
        this.onXAxis = /mandatory/.test(this.options.onXAxis) ? MANDATORY_SNAP : 
                       /proximity/.test(this.options.onXAxis) ? PROXIMITY_SNAP : 
                                                                NO_SNAP;  
        this.onYAxis = /mandatory/.test(this.options.onYAxis) ? MANDATORY_SNAP : 
                       /proximity/.test(this.options.onYAxis) ? PROXIMITY_SNAP : 
                                                                NO_SNAP;  

        //Save the original callback so that even if it's modified by other builders,
        //we still have a reference to it.
        this.callback = this.options.callback;
        
        /*
        this.#intersectionObserver = new IntersectionObserver(
            (entries) => {
                if(entries.length > 0) {
                    this.#intersectingElements = entries;
                }
            }, 
            {
                root: this.originalContainer,
                rootMargin: "100%",
            }
        );

        //Observe intersection of passed children with this.originalContainer.
        for(const childObject of this.options.children) {
            this.#intersectionObserver.observe(childObject.element);
        }
        */

        if(this.onXAxis && !this.onYAxis) {
            /**
             * Calculate the distance between the child and its snap point based on
             * the passed alignments and its current position relative this.originalContainer.
             */
            this.#calcDistances = (containerPos, containerBorders, childPos, alignX, alignY) => {
                let _distance;

                if(/start/.test(alignX)) {
                    _distance = childPos.left - containerPos.left 
                                - containerBorders[3];
                } else if(/end/.test(alignX)) {
                    _distance = childPos.right - containerPos.right 
                                + containerBorders[1] 
                                + uss.calcXScrollbarDimension(this.originalContainer, false, this.options);
                } else {
                    _distance = 0.5 * (childPos.left + childPos.right - containerPos.left - containerPos.right 
                                    - containerBorders[1]
                                    + containerBorders[3] 
                                    + uss.calcXScrollbarDimension(this.originalContainer, false, this.options)
                                );
                }        

                /**
                 * If the snap-scroll is required on proximity, 
                 * check if the container and the child are not too far away.
                 */
                const _xTooFar = this.onXAxis === PROXIMITY_SNAP && Math.abs(_distance) - 1 > childPos.width * 0.5;
                return _xTooFar ? null : [_distance, 0];
            }

            /**
             * The euclidean distance is just the |deltaX|.
             * deltas = [deltaX, deltaY].
             */
            this.#calcEuclideanDistance = (deltas) => Math.abs(deltas[0]);

            this.#snapScroll = (deltas, easingX, easingY) => {    
                const _delta = Math.round(deltas[0]);
                     
                if(_delta === 0) {
                    this.executeCallback();
                    return;
                }

                uss.setXStepLengthCalculator(easingX, this.originalContainer, true, this.options);
                uss.scrollXBy(_delta, this.originalContainer, this.executeCallback, true, false, this.options);
            }
        } else if(!this.onXAxis && this.onYAxis) {
            /**
             * Calculate the distance between the child and its snap point based on
             * the passed alignments and its current position relative this.originalContainer.
             */
            this.#calcDistances = (containerPos, containerBorders, childPos, alignX, alignY) => {
                let _distance;

                if(/start/.test(alignY)) {
                    _distance = childPos.top - containerPos.top
                                - containerBorders[0];
                } else if(/end/.test(alignY)) {
                    _distance = childPos.bottom - containerPos.bottom 
                                + containerBorders[2]
                                + uss.calcYScrollbarDimension(this.originalContainer, false, this.options);
                } else {
                    _distance = 0.5 * (childPos.top + childPos.bottom 
                                    - containerPos.top - containerPos.bottom 
                                    - containerBorders[0]
                                    + containerBorders[2]
                                    + uss.calcYScrollbarDimension(this.originalContainer, false, this.options)
                                );    
                }        

                /**
                 * If the snap-scroll is required on proximity, 
                 * check if the container and the child are not too far away.
                 */
                const _yTooFar = this.onYAxis === PROXIMITY_SNAP && Math.abs(_distance) - 1 > childPos.height * 0.5;        
                return _yTooFar ? null : [0, _distance];
            }
            
            /**
             * The euclidean distance is just the |deltaY|.
             * deltas = [deltaX, deltaY].
             */
            this.#calcEuclideanDistance = (deltas) => Math.abs(deltas[1]);

            this.#snapScroll = (deltas, easingX, easingY) => {         
                const _delta = Math.round(deltas[1]);
                     
                if(_delta === 0) {
                    this.executeCallback();
                    return;
                }

                uss.setYStepLengthCalculator(easingY, this.originalContainer, true, this.options);
                uss.scrollYBy(_delta, this.originalContainer, this.executeCallback, true, false, this.options);
            }
        } else if(this.onXAxis && this.onYAxis) {
            /**
             * Calculate the distance between the child and its snap point based on
             * the passed alignments and its current position relative this.originalContainer.
             */
            this.#calcDistances = (containerPos, containerBorders, childPos, alignX, alignY) => {
                let _distanceX, _distanceY;

                if(/start/.test(alignX)) {
                    _distanceX = childPos.left - containerPos.left 
                                 - containerBorders[3];
                } else if(/end/.test(alignX)) {
                    _distanceX = childPos.right - containerPos.right 
                                 + containerBorders[1] 
                                 + uss.calcXScrollbarDimension(this.originalContainer, false, this.options);
                } else {
                    _distanceX = 0.5 * (childPos.left + childPos.right - containerPos.left - containerPos.right 
                                     - containerBorders[1]
                                     + containerBorders[3] 
                                     + uss.calcXScrollbarDimension(this.originalContainer, false, this.options)
                                 );
                }    

                if(/start/.test(alignY)) {
                    _distanceY = childPos.top - containerPos.top
                                 - containerBorders[0];
                } else if(/end/.test(alignY)) {
                    _distanceY = childPos.bottom - containerPos.bottom 
                                 + containerBorders[2]
                                 + uss.calcYScrollbarDimension(this.originalContainer, false, this.options);
                } else {
                    _distanceY = 0.5 * (childPos.top + childPos.bottom 
                                     - containerPos.top - containerPos.bottom 
                                     - containerBorders[0]
                                     + containerBorders[2]
                                     + uss.calcYScrollbarDimension(this.originalContainer, false, this.options)
                                 );    
                }   

                /**
                 * If the snap-scroll is required on proximity, 
                 * check if the container and the child are not too far away.
                 */
                const _xTooFar = this.onXAxis === PROXIMITY_SNAP && Math.abs(_distanceX) - 1 > childPos.width * 0.5;
                const _yTooFar = this.onYAxis === PROXIMITY_SNAP && Math.abs(_distanceY) - 1 > childPos.height * 0.5;    

                return _xTooFar && _yTooFar  ? null : 
                       _xTooFar && !_yTooFar ? [0, _distanceY] :
                       !_xTooFar && _yTooFar ? [_distanceX, 0] :
                                               [_distanceX, _distanceY];
            }

            /**
             * The euclidean distance is calculated by using the pythagoras theorem.
             * deltas = [deltaX, deltaY].
             */
            this.#calcEuclideanDistance = (deltas) => Math.sqrt(deltas[0] * deltas[0] + deltas[1] * deltas[1]);

            this.#snapScroll = (deltas, easingX, easingY) => {     
                const _deltaX = Math.round(deltas[0]);      
                const _deltaY = Math.round(deltas[1]);

                if(_deltaX === 0 && _deltaY === 0) {
                    this.executeCallback();
                    return;
                }

                uss.setXStepLengthCalculator(easingX, this.originalContainer, true, this.options);
                uss.setYStepLengthCalculator(easingY, this.originalContainer, true, this.options);
                uss.scrollBy(
                    _deltaX, 
                    _deltaY, 
                    this.originalContainer, 
                    this.executeCallback, 
                    true, 
                    false, 
                    this.options
                );
            }
        }

        /**
         * Function that invokes all the functions needed to manage the snap-scroll.
         * It's async because the snap-scroll animation must be completed before 
         * any other builder starts its effect. 
         */
        this.snapScrolling = async () => {
            return new Promise((resolve) => {
                this.resolve = resolve;

                window.clearTimeout(this.snapScrollingTimeout);
                this.snapScrollingTimeout = window.setTimeout(() => {
                    //There's no element to be snap-scrolled.
                    if(this.options.children.length < 1) {
                        this.executeCallback();
                        return;
                    }  

                    const __containerPos = this.originalContainer.getBoundingClientRect();
                    const __containerBorders = uss.calcBordersDimensions(this.originalContainer, false, this.options);

                    let __minEuclideanDistance = Infinity;
                    let __minDistancesArray = null;

                    let __snapEasingX = this.options.snapEasingX;
                    let __snapEasingY = this.options.snapEasingY;

                    /**
                    * Find the element to snap-align within the passed children parameter.
                    * Example of childObject:
                    *  {
                    *     element: document.getElementById("element1"), 
                    *     alignX: "center",                                                          
                    *     alignY: "center",                                                          
                    *     snapEasingX: () => 25                                                      
                    *     snapEasingY: () => 12                                                      
                    *  },   
                    */
                    for(const childObject of this.options.children) {
                        const __elementPos = childObject.element.getBoundingClientRect();
                    
                        const __distancesArray = this.#calcDistances(
                            __containerPos, 
                            __containerBorders, 
                            __elementPos, 
                            childObject.alignX,
                            childObject.alignY,
                        );
                        
                        /**
                         * If __distancesArray is null, the snapping is set on "proximity" 
                         * and the child is too far.
                         * Otherwise __distancesArray = [deltaX, deltaY].
                         */
                        if(!__distancesArray) continue; 

                        const __euclideanDistance = this.#calcEuclideanDistance(__distancesArray);

                        //Save the best result's parameter so far.
                        if(__euclideanDistance <= __minEuclideanDistance) {
                            __minEuclideanDistance = __euclideanDistance;
                            __minDistancesArray = __distancesArray;

                            __snapEasingX = childObject.snapEasingX || this.options.snapEasingX;
                            __snapEasingY = childObject.snapEasingY || this.options.snapEasingY;
                        }
                    }

                    //If __minDistancesArray is null, there's no element close enough to be snap-scrolled.
                    if(!__minDistancesArray) {
                        this.executeCallback();
                        return;
                    } 

                    this.#snapScroll(__minDistancesArray, __snapEasingX, __snapEasingY);
                    this.scrollbarX.updatePosition();
                    this.scrollbarY.updatePosition();
                }, this.options.activationDelay);
            });
        }

        uss.addResizeCallback(this.snapScrolling, this.originalContainer, this.options); 
        this.addCallback(this.snapScrolling);

        const _activationDelay = this.options.activationDelay;
        this.options.activationDelay = 0;
        this.snapScrolling();
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