import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";

export class SnapScrollBuilder extends SmoothScrollBuilder {

    //Parameters already sanitized.
    constructor(container, options) {
        super(container, options);
    }

    build() {
        this.onXAxis = /mandatory/.test(this.options.onXAxis) ? 2 : // 2 === "mandatory"
                       /proximity/.test(this.options.onXAxis) ? 1 : // 1 === "proximity"
                                                                0;  // 0 === no snap on x-axis
        this.onYAxis = /mandatory/.test(this.options.onYAxis) ? 2 : // 2 === "mandatory"
                       /proximity/.test(this.options.onYAxis) ? 1 : // 1 === "proximity"
                                                                0;  // 0 === no snap on y-axis

        //Save the original callback so that even if it's modified by other builders,
        //we still have a reference to it.
        this.callback = this.options.callback;

        this.originalBuilder.options.debugString = this.options.debugString;

        if(this.onXAxis && !this.onYAxis) { //Momentum-snap on the x-axis only. 
            this.calcDistances = (containerPos, containerBorders, childPos, align) => {
                const _distance =  /start/.test(align) ? childPos.left - containerPos.left - containerBorders[3] :  
                                     /end/.test(align) ? childPos.right - containerPos.right + uss.calcXScrollbarDimension(this.originalContainer, false, this.options) + containerBorders[1] :
                                                         (childPos.left + childPos.right 
                                                            - containerPos.left - containerPos.right 
                                                            + uss.calcXScrollbarDimension(this.originalContainer, false, this.options)
                                                            - containerBorders[1]
                                                            + containerBorders[3] 
                                                         ) * 0.5;

                //The snap-scroll is required on proximity (_onXAxis === 0), 
                //check if the container and the child are not too far away.
                return this.onXAxis === 1 && Math.abs(_distance) - 1 > childPos.width * 0.5 ? null : [_distance, 0];
            }

            //The euclidean distance is just the |deltaX|.
            this.calcEuclideanDistance = (deltas) => Math.abs(deltas[0]);

            this.snapScroll = (deltas) => {
                uss.setXStepLengthCalculator(this.options.snapEasingX, this.originalContainer, true, this.options);
                uss.scrollXBy(Math.round(deltas[0]), this.originalContainer, this.executeCallback, true, false, this.options);
            }

            this.axisNumber = 0;
        } else if(!this.onXAxis && this.onYAxis) { //Momentum-snap on the y-axis only.
            this.calcDistances = (containerPos, containerBorders, childPos, align) => {
                const _distance = /start/.test(align) ? childPos.top - containerPos.top - containerBorders[0] : 
                                    /end/.test(align) ? childPos.bottom - containerPos.bottom + uss.calcYScrollbarDimension(this.originalContainer, false, this.options) + containerBorders[2] :
                                                        (childPos.top + childPos.bottom 
                                                            - containerPos.top - containerPos.bottom 
                                                            + uss.calcYScrollbarDimension(this.originalContainer, false, this.options)
                                                            - containerBorders[0]
                                                            + containerBorders[2]
                                                        ) * 0.5;     

                //The snap-scroll is required on proximity (_onYAxis === 0), 
                //check if the container and the child are not too far away.
                return this.onYAxis === 1 && Math.abs(_distance) - 1 > childPos.height * 0.5 ? null : [0, _distance];
            }

            //The euclidean distance is just the |deltaY|.
            this.calcEuclideanDistance = (deltas) => Math.abs(deltas[1]);

            this.snapScroll = (deltas) => {
                uss.setYStepLengthCalculator(this.options.snapEasingY, this.originalContainer, true, this.options);
                uss.scrollYBy(Math.round(deltas[1]), this.originalContainer, this.executeCallback, true, false, this.options);
            }
            
            this.axisNumber = 1;
        } else { //Momentum-snap on both axes.
            this.calcDistances = (containerPos, containerBorders, childPos, align) => {
                const _distanceX =  /start/.test(align) ? childPos.left - containerPos.left - containerBorders[3] :  
                                      /end/.test(align) ? childPos.right - containerPos.right + uss.calcXScrollbarDimension(this.originalContainer, false, this.options) + containerBorders[1] :
                                                          (childPos.left + childPos.right 
                                                              - containerPos.left - containerPos.right 
                                                              + uss.calcXScrollbarDimension(this.originalContainer, false, this.options)
                                                              - containerBorders[1]
                                                              + containerBorders[3]
                                                          ) * 0.5;

                const _distanceY = /start/.test(align) ? childPos.top - containerPos.top - containerBorders[0] : 
                                     /end/.test(align) ? childPos.bottom - containerPos.bottom + uss.calcYScrollbarDimension(this.originalContainer, false, this.options) + containerBorders[2] :
                                                         (childPos.top + childPos.bottom 
                                                             - containerPos.top - containerPos.bottom 
                                                             + uss.calcYScrollbarDimension(this.originalContainer, false, this.options)
                                                             - containerBorders[0]
                                                             + containerBorders[2]
                                                         ) * 0.5;  

                //If the snap-scroll is required on proximity (_onXAxis === 0 && _onYAxis === 0), 
                //check if the container and the child are not too far away.
                const _xTooFar = this.onXAxis === 1 && Math.abs(_distanceX) - 1 > childPos.width * 0.5;
                const _yTooFar = this.onYAxis === 1 && Math.abs(_distanceY) - 1 > childPos.height * 0.5;

                return _xTooFar && _yTooFar  ? null : 
                       _xTooFar && !_yTooFar ? [null, _distanceY, _distanceX] :
                       !_xTooFar && _yTooFar ? [_distanceX, null, _distanceY] :
                                               [_distanceX, _distanceY];
            }

            //The euclidean distance is calculated by using the pythagoras theorem.
            this.calcEuclideanDistance = (deltas) => {
                return deltas[0] === null ? Math.sqrt(deltas[2] * deltas[2] + deltas[1] * deltas[1]) :
                       deltas[1] === null ? Math.sqrt(deltas[0] * deltas[0] + deltas[2] * deltas[2]) :
                                            Math.sqrt(deltas[0] * deltas[0] + deltas[1] * deltas[1]);
            }

            this.snapScroll = (deltas) => {            
                //Note: Math.round(null) === 0
                uss.setXStepLengthCalculator(this.options.snapEasingX, this.originalContainer, true, this.options);
                uss.setYStepLengthCalculator(this.options.snapEasingY, this.originalContainer, true, this.options);
                uss.scrollBy(Math.round(deltas[0]), Math.round(deltas[1]), this.originalContainer, this.executeCallback, true, false, this.options);
            }

            this.axisNumber = 2;
        }

        //This function finds which of the passed this.snapChildren is the closest to a snap-point
        //and snaps it into view with a smooth scroll-animation. 
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

                /**
                * Find the element to snap-align within the passed children parameter.
                * The performance of this search-method is fine with up to 10.000 children. 
                */
                for(const child of this.options.children) {
                    const _childPos = child.element.getBoundingClientRect();
                    const _requestedAlignment = child.align;

                    const _distances = this.calcDistances(_containerPos, _containerBorders, _childPos, _requestedAlignment);
                    if(!_distances) continue; //In normal conditions _distances is an array
                    const _euclideanDistance = this.calcEuclideanDistance(_distances);

                    if(_euclideanDistance <= _minEuclideanDistance) {
                        _minEuclideanDistance = _euclideanDistance;
                        _minDistances = _distances;
                    }
                }
                if(_minDistances === Infinity) {
                    this.executeCallback();
                    return;
                } 

                this.snapScroll(_minDistances);
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