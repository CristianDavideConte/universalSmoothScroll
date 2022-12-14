/**
 * TODO: THIS WILL BE THE NEXT EXTERNAL INTERFACE FOR THE SNAP SCROLL BUILDER.
 * 
 * addSnapScrolling{
 *     container,
 *     {   
 *         onXAxis: true,
 *         onYAxis: true,
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
                const delta = Math.round(deltas[0]);
                     
                if(delta === 0) {
                    this.executeCallback();
                    return;
                }

                uss.setXStepLengthCalculator(easingX, this.originalContainer, true, this.options);
                uss.scrollXBy(delta, this.originalContainer, this.executeCallback, true, false, this.options);
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
                const delta = Math.round(deltas[1]);
                     
                if(delta === 0) {
                    this.executeCallback();
                    return;
                }

                uss.setYStepLengthCalculator(easingY, this.originalContainer, true, this.options);
                uss.scrollYBy(delta, this.originalContainer, this.executeCallback, true, false, this.options);
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

            this.#snapScroll = (deltas) => {              
                const deltaX = Math.round(deltas[0]);      
                const deltaY = Math.round(deltas[1]);

                if(deltaX === 0 && deltaY === 0) {
                    this.executeCallback();
                    return;
                }

                uss.setXStepLengthCalculator(easingX, this.originalContainer, true, this.options);
                uss.setYStepLengthCalculator(easingY, this.originalContainer, true, this.options);
                uss.scrollBy(
                    deltaX, 
                    deltaY, 
                    this.originalContainer, 
                    this.executeCallback, 
                    true, 
                    false, 
                    this.options
                );
            }
        }

        
        this.snapScrolling = () => {        
            window.clearTimeout(this.snapScrollingTimeout);
            this.snapScrollingTimeout = window.setTimeout(() => {
                if(this.options.children.length < 1) {
                    this.executeCallback();
                    return;
                }  

                const _containerPos = this.originalContainer.getBoundingClientRect();
                const _containerBorders = uss.calcBordersDimensions(this.originalContainer, false, this.options);

                let _minEuclideanDistance = Infinity;
                let _minDistances = Infinity;

                let _snapEasingX = this.options.snapEasingX;
                let _snapEasingY = this.options.snapEasingY;

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
                    const _elementPos = childObject.element.getBoundingClientRect();
                   
                    const _distances = this.#calcDistances(
                        _containerPos, 
                        _containerBorders, 
                        _elementPos, 
                        childObject.alignX,
                        childObject.alignY,
                    );
                    
                    /**
                     * If _distances is null, the snapping is set on "proximity" 
                     * and the child is too far.
                     * Otherwise _distances = [deltaX, deltaY].
                     */
                    if(!_distances) continue; 

                    const _euclideanDistance = this.#calcEuclideanDistance(_distances);

                    if(_euclideanDistance <= _minEuclideanDistance) {
                        _minEuclideanDistance = _euclideanDistance;
                        _minDistances = _distances;

                        _snapEasingX = childObject.snapEasingX || this.options.snapEasingX;
                        _snapEasingY = childObject.snapEasingY || this.options.snapEasingY;
                    }
                }

                //There's no element to be snap-scrolled.
                if(!_minDistances) return; 

                this.#snapScroll(_minDistances, _snapEasingX, _snapEasingY);
                this.scrollbarX.updatePosition();
                this.scrollbarY.updatePosition();
            }, this.options.snapDelay);
        }
        
        uss.addOnResizeEndCallback(this.snapScrolling); 
        this.container.addCallback(this.snapScrolling);
        this.snapScrolling();
    }

    /**
     * Execute this.callback only at the end of the snap scroll. 
     */
    addCallback(callback) {
        super.addCallback(callback); 
    }

    executeCallback() {
        this.callback();
    }

    get originalContainer() {
        return this.container.originalContainer;
    }

    get originalBuilder() {
        return this.container.originalBuilder;
    }
    
    get style() {
        return this.originalBuilder.style;
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