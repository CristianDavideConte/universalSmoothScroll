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
 *                 easingX: () => 25                                                     //OPTIONAL 
 *                 easingY: () => 12                                                     //OPTIONAL 
 *            }, 
 *            {
 *                 element: document.getElementById("easeFunctionSelectorList").children[1],
 *                 alignX: "left",                                                             
 *                 alignY: "top",                                                             
 *                 easingY: () => 27                                                      
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
 * - easingX: //see preset.js
 * - easingY: //see preset.js
 */

import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";

const MANDATORY_SNAP = 2;
const PROXIMITY_SNAP = 1;
const NO_SNAP = 0;

export class SnapScrollBuilder extends SmoothScrollBuilder {
    
    #getDistances;
    #calcEuclideanDistance;
    #snapScroll;

    #minRectIntersectionObserver; 
    #maxRectIntersectionObserver; 

    //Parameters already sanitized.
    constructor(container, options) {
        super(container, options);
    }

    build() {
        //N.B. All the children have either snap-type: mandatory or snap-type: proximity,
        //     but not both of them at the same time.
        this.onXAxis = /mandatory/.test(this.options.onXAxis) ? MANDATORY_SNAP : 
                       /proximity/.test(this.options.onXAxis) ? PROXIMITY_SNAP : 
                                                                NO_SNAP;  
        this.onYAxis = /mandatory/.test(this.options.onYAxis) ? MANDATORY_SNAP : 
                       /proximity/.test(this.options.onYAxis) ? PROXIMITY_SNAP : 
                                                                NO_SNAP;  

        //Save the original callback so that even if it's modified by other builders,
        //we still have a reference to it.
        this.callback = this.options.callback;
        




        if(this.onXAxis && !this.onYAxis) {
            /**
             * Calculate the distance between the child and its snap point based on
             * the passed alignments and its current position relative this.originalContainer.
             */
            this.#getDistances = (containerPos, containerBorders, childPos, alignX, alignY) => {
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
             * deltas = [deltaX, deltaY].
             * The euclidean distance is just the |deltaX|.
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
            this.#getDistances = (containerPos, containerBorders, childPos, alignX, alignY) => {
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
             * deltas = [deltaX, deltaY].
             * The euclidean distance is just the |deltaY|.
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
            this.#getDistances = (containerPos, containerBorders, childPos, alignX, alignY) => {
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
             * deltas = [deltaX, deltaY].
             * The euclidean distance is calculated by using the pythagoras theorem.
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



















        const intersectionObserversEntriesMap = new Map();
        const minIntersectingElements = new Set(); 
        const maxIntersectingElements = new Set(); 

        let minRootMargin = 0;
        let maxRootMargin = 100;

        const createObservers = () => {
            let minExecuted = false;
            let maxExecuted = false;

            intersectionObserversEntriesMap.clear();
            minIntersectingElements.clear();
            maxIntersectingElements.clear();

            this.#minRectIntersectionObserver = new IntersectionObserver(
                (entries) => {
                    intersectionObserverCallback(entries, minIntersectingElements);
                    this.#minRectIntersectionObserver.disconnect();

                    /**
                     * No entry was intersecting this.originalContainer with the current minRootMargin.
                     * Double minRootMargin and maxRootMargin and redo the intersections.
                     */
                    if(minIntersectingElements.size === 0) {
                        minRootMargin = maxRootMargin;
                        maxRootMargin *= 2;
                        this.#maxRectIntersectionObserver.disconnect();
                        createObservers();
                        return;
                    }

                    /**
                     * Both this.#minRectIntersectionObserver and this.#maxRectIntersectionObserver 
                     * have executed their callbacks, no more intersections are needed, 
                     * this.originalContainer can be snap-scrolled.  
                     */
                    if(maxExecuted) {
                        executeSnapScroll();
                        return;
                    }

                    minExecuted = true;
                },
                {
                    root: this.originalContainer,
                    rootMargin: minRootMargin + "%",
                }
            );

            this.#maxRectIntersectionObserver = new IntersectionObserver(
                (entries) => {
                    intersectionObserverCallback(entries, maxIntersectingElements);
                    this.#maxRectIntersectionObserver.disconnect();

                    /**
                     * Both this.#minRectIntersectionObserver and this.#maxRectIntersectionObserver 
                     * have executed their callbacks, no more intersections are needed, 
                     * this.originalContainer can be snap-scrolled.  
                     */
                    if(minExecuted) {
                        /**
                         * No entry was intersecting this.originalContainer with the current minRootMargin.
                         * Double minRootMargin and maxRootMargin and redo the intersections.
                         */
                        if(minIntersectingElements.size === 0) {
                            minRootMargin = maxRootMargin;
                            maxRootMargin *= 2;
                            this.#minRectIntersectionObserver.disconnect();
                            createObservers();
                            return;
                        }

                        executeSnapScroll();
                        return;
                    }

                    maxExecuted = true;
                },
                {
                    root: this.originalContainer,
                    rootMargin: maxRootMargin + "%",
                }
            );
            
            //Observe intersection of passed children with this.originalContainer.
            for(const childObject of this.options.children) {
                const __element = childObject.element;
                this.#minRectIntersectionObserver.observe(__element);
                this.#maxRectIntersectionObserver.observe(__element);
            }
        }
  
                
        /**
        * Find the element to snap-align within the passed children parameter.
        * Example of childObject:
        *  {
        *     element: document.getElementById("element1"), 
        *     alignX: "center",                                                          
        *     alignY: "center",                                                          
        *     easingX: () => 25                                                      
        *     easingY: () => 12                                                      
        *  },   
        */
       
        const executeSnapScroll = () => {
            const __entriesSet = new Set([...minIntersectingElements, ...maxIntersectingElements]);
            const __entries = new Map();
            __entriesSet.forEach(entry => __entries.set(entry.target, entry));

            const __containerPos = __entries.values().next().value.rootBounds;
            const __containerBorders = uss.calcBordersDimensions(this.originalContainer, false, this.options);

            let __minEuclideanDistance = Infinity;
            let __minDistancesArray = null;

            let __easingX = this.options.easingX;
            let __easingY = this.options.easingY;

            //Iterate through the snapCandidates and find the one to snap-scroll.
            for(const childObject of this.options.children) {
                const __entry = __entries.get(childObject.element); 
                
                if(!__entry) continue;

                const __elementPos = __entry.boundingClientRect;

                const __distancesArray = this.#getDistances(
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

                    __easingX = childObject.easingX || this.options.easingX;
                    __easingY = childObject.easingY || this.options.easingY;
                }
            }

            /**
             * At this point, if __minDistancesArray is null, 
             * there's no element close enough to be snap-scrolled or 
             * no element at all inside options.children.
             */
            if(!__minDistancesArray) {
                this.executeCallback();
                return;
            } 

            this.#snapScroll(__minDistancesArray, __easingX, __easingY);
            this.scrollbarX.updatePosition();
            this.scrollbarY.updatePosition();
        }


        const intersectionObserverCallback = (entries, intersectingElementsSet) => {
            //Map each intersection target to the corresponding properties.
            if(intersectionObserversEntriesMap.size === 0) {
                for(const entry of entries) {
                    intersectionObserversEntriesMap.set(entry.target, entry);
                }
            }

            //Iterate through the snapCandidates and find the one to snap-scroll.
            for(const childObject of this.options.children) {
                const __entry = intersectionObserversEntriesMap.get(childObject.element); 
                
                if(__entry.isIntersecting) intersectingElementsSet.add(__entry);
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

                    createObservers();
                }, this.options.activationDelay);
            });
        }

        uss.addResizeCallback(this.snapScrolling, this.originalContainer, this.options); 
        this.addCallback(this.snapScrolling);

        //Temporarily set the activationDelay to 0, so that snapScrolling can be immediately applied.
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