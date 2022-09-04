import { UssSmoothScroller } from "./uss-class-smooth-scroller.js";

export class UssSnapScroller extends UssSmoothScroller {

    #onXAxis; //Contains the behavior of the snap scrolling on x-axis  
    #onYAxis; //Contains the behavior of the snap scrolling on y-axis  
    #axisNumber; //Axis number for the snap scrolling
                                    
    #calcDistances;
    #calcEuclideanDistance; 

    #snapScroll;
    #snapScrollingTimeout;


    //The constructor assumes that the options object is valid.
    //All the checks are done before invoking it.
    constructor(container, options) {
        super(container, options);

        this.#onXAxis = /mandatory/.test(options.onXAxis) ? 1 : // 1 === "mandatory"
                        /proximity/.test(options.onXAxis) ? 0 : // 0 === "proximity"
                                                           -1;  //-1 === no snap on x-axis
        this.#onYAxis = /mandatory/.test(options.onYAxis) ? 1 : // 1 === "mandatory"
                        /proximity/.test(options.onYAxis) ? 0 : // 0 === "proximity"
                                                           -1;  //-1 === no snap on y-axis
        
        //this.onXAxis = this.#onXAxis > -1;
        //this.onYAxis = this.#onYAxis > -1;

        console.log(container.container, this.onXAxis, this.#onXAxis, this.onYAxis, this.#onYAxis)

        //Default easing behaviors: ease-in.
        this.snapEasingX = options.snapEasingX;
        this.snapEasingY = options.snapEasingY;

        this.snapDelay = options.snapDelay;

        this.snapChildren = options.children;

        this.debugString = options.debugString;

        if(this.onXAxis && !this.onYAxis) { //Momentum-snap on the x-axis only. 
            this.#calcDistances = (containerPos, containerBorders, childPos, align) => {
                const _distance =  /start/.test(align) ? childPos.left - containerPos.left - containerBorders[3] :  
                                     /end/.test(align) ? childPos.right - containerPos.right + uss.calcXScrollbarDimension(this.container, false, options) + containerBorders[1] :
                                                         (childPos.left + childPos.right 
                                                            - containerPos.left - containerPos.right 
                                                            + uss.calcXScrollbarDimension(this.container, false, options)
                                                            - containerBorders[1]
                                                            + containerBorders[3] 
                                                         ) * 0.5;

                //The snap-scroll is required on proximity (_onXAxis === 0), 
                //check if the container and the child are not too far away.
                return this.#onXAxis === 0 && Math.abs(_distance) - 1 > childPos.width * 0.5 ? null : [_distance, 0];
            }

            //The euclidean distance is just the |deltaX|.
            this.#calcEuclideanDistance = (deltas) => Math.abs(deltas[0]);

            this.#snapScroll = (deltas) => {
                uss.setXStepLengthCalculator(this.snapEasingX, this.container, true, options);
                uss.scrollXBy(Math.round(deltas[0]), this.container, options.callback, true, options);
            }

            this.#axisNumber = 0;
        } else if(!this.onXAxis && this.onYAxis) { //Momentum-snap on the y-axis only.
            this.#calcDistances = (containerPos, containerBorders, childPos, align) => {
                const _distance = /start/.test(align) ? childPos.top - containerPos.top - containerBorders[0] : 
                                    /end/.test(align) ? childPos.bottom - containerPos.bottom + uss.calcYScrollbarDimension(this.container, false, options) + containerBorders[2] :
                                                        (childPos.top + childPos.bottom 
                                                            - containerPos.top - containerPos.bottom 
                                                            + uss.calcYScrollbarDimension(this.container, false, options)
                                                            - containerBorders[0]
                                                            + containerBorders[2]
                                                        ) * 0.5;     

                //The snap-scroll is required on proximity (_onYAxis === 0), 
                //check if the container and the child are not too far away.
                return this.#onYAxis === 0 && Math.abs(_distance) - 1 > childPos.height * 0.5 ? null : [0, _distance];
            }

            //The euclidean distance is just the |deltaY|.
            this.#calcEuclideanDistance = (deltas) => Math.abs(deltas[1]);

            this.#snapScroll = (deltas) => {
                uss.setYStepLengthCalculator(this.snapEasingY, this.container, true, options);
                uss.scrollYBy(Math.round(deltas[1]), this.container, options.callback, true, options);
            }
            
            this.#axisNumber = 1;
        } else { //Momentum-snap on both axes.
            this.#calcDistances = (containerPos, containerBorders, childPos, align) => {
                const _distanceX =  /start/.test(align) ? childPos.left - containerPos.left - containerBorders[3] :  
                                      /end/.test(align) ? childPos.right - containerPos.right + uss.calcXScrollbarDimension(this.container, false, options) + containerBorders[1] :
                                                          (childPos.left + childPos.right 
                                                              - containerPos.left - containerPos.right 
                                                              + uss.calcXScrollbarDimension(this.container, false, options)
                                                              - containerBorders[1]
                                                              + containerBorders[3]
                                                          ) * 0.5;

                const _distanceY = /start/.test(align) ? childPos.top - containerPos.top - containerBorders[0] : 
                                     /end/.test(align) ? childPos.bottom - containerPos.bottom + uss.calcYScrollbarDimension(this.container, false, options) + containerBorders[2] :
                                                         (childPos.top + childPos.bottom 
                                                             - containerPos.top - containerPos.bottom 
                                                             + uss.calcYScrollbarDimension(this.container, false, options)
                                                             - containerBorders[0]
                                                             + containerBorders[2]
                                                         ) * 0.5;  

                //If the snap-scroll is required on proximity (_onXAxis === 0 && _onYAxis === 0), 
                //check if the container and the child are not too far away.
                const _xTooFar = this.#onXAxis === 0 && Math.abs(_distanceX) - 1 > childPos.width * 0.5;
                const _yTooFar = this.#onYAxis === 0 && Math.abs(_distanceY) - 1 > childPos.height * 0.5;

                return _xTooFar && _yTooFar  ? null : 
                       _xTooFar && !_yTooFar ? [null, _distanceY, _distanceX] :
                       !_xTooFar && _yTooFar ? [_distanceX, null, _distanceY] :
                                               [_distanceX, _distanceY];
            }

            //The euclidean distance is calculated by using the pythagoras theorem.
            this.#calcEuclideanDistance = (deltas) => {
                return deltas[0] === null ? Math.sqrt(deltas[2] * deltas[2] + deltas[1] * deltas[1]) :
                       deltas[1] === null ? Math.sqrt(deltas[0] * deltas[0] + deltas[2] * deltas[2]) :
                                            Math.sqrt(deltas[0] * deltas[0] + deltas[1] * deltas[1]);
            }

            this.#snapScroll = (deltas) => {            
                //Note: Math.round(null) === 0
                uss.setXStepLengthCalculator(this.snapEasingX, this.container, true, options);
                uss.setYStepLengthCalculator(this.snapEasingY, this.container, true, options);
                uss.scrollBy(Math.round(deltas[0]), Math.round(deltas[1]), this.container, options.callback, true, options);
            }

            this.#axisNumber = 2;
        }

        //This function finds which of the passed this.snapChildren is the closest to a snap-point
        //and snaps it into view with a smooth scroll-animation. 
        this.snapScrolling = () => {        
            window.clearTimeout(this.#snapScrollingTimeout);
            this.#snapScrollingTimeout = window.setTimeout(() => {
                if(this.snapChildren.length < 1) {
                    this.callback();
                    return;
                }  

                //console.time("main");
                const _containerPos = this.container.getBoundingClientRect();
                const _containerBorders = uss.calcBordersDimensions(this.container, false, options);

                let _minEuclideanDistance = Infinity;
                let _minDistances = Infinity;

                /**
                * Find the element to snap-align within the passed children parameter.
                * The performance of this search-method is fine with up to 10.000 children. 
                */
                for(const child of this.snapChildren) {
                    const _childPos = child.element.getBoundingClientRect();
                    const _requestedAlignment = child.align;

                    const _distances = this.#calcDistances(_containerPos, _containerBorders, _childPos, _requestedAlignment);
                    if(!_distances) continue; //In normal conditions _distances is an array
                    const _euclideanDistance = this.#calcEuclideanDistance(_distances);

                    if(_euclideanDistance <= _minEuclideanDistance) {
                        _minEuclideanDistance = _euclideanDistance;
                        _minDistances = _distances;
                    }
                }
                if(_minDistances === Infinity) {
                    this.callback();
                    return;
                } 

                const __scrollRequest = new CustomEvent(
                    "ussmoverequest", 
                    { 
                        cancelable: true,
                        detail: {
                            axis: this.#axisNumber,
                            scroller: () => this.#snapScroll(_minDistances),
                        }
                    }
                );
                this.container.dispatchEvent(__scrollRequest);

                //If no one has handled the scroll request yet.
                if(!__scrollRequest.defaultPrevented) {
                    this.#snapScroll(_minDistances);
                }
            }, this.snapDelay);
        }

        //The underlying UssSmoothScroller manages the callbacks.
        container.callback = () => {
            this.callback();
            this.snapScrolling();
        }
    }
}