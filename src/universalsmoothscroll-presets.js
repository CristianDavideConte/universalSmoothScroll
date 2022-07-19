/**
 * TODO:
 * - fix error logging's weird output format
 * - elastic scrolling
 * - touch smooth scrolling
 * - smooth scrolling with animation allowed
 * - smooth scrolling for carousels (perhaps leave this implementation to the developer?)
 * - TURN THIS INTO A MODULE
 */


/**
 * Each of this functions should have an input interface that:
 *  - has the container as the first parameter
 *  - has an "options" object as the second parameter
 *  - every function-specific input should be a property of the "options" parameter
 */

function __testImports() {
    //Test if the universalsmoothscroll library has been imported.
    try {
        !!uss;
    } catch(e) {
        throw "You must import the universalsmoothscroll library in order to use this function";
    }

    //Test if the universalsmoothscroll-ease-functions library has been imported.
    try {
        return !!EASE_LINEAR; //full API and libraries support
    } catch(e) {
        return false; //full API support but no libraries support
    }
}

//export
function addMomentumScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: false,
        callback: null,
        speedModifierX: null,
        speedModifierY: null,
        momentumEasingX: null,
        momentumEasingY: null,
        debugString: "addMomentumScrolling"
    }
) {
    __testImports();

    //Check if the options parameter is a valid object.
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
        uss._errorLogger("addMomentumScrolling", "the options parameter to be an object", options);
    }

    const _onXAxis = options.onXAxis;
    const _onYAxis = options.onYAxis;
    options.debugString = options.debugString || "addMomentumScrolling";

    //Check if at least one axis was requested to be momentum-scrolled.
    if(!_onXAxis && !_onYAxis) {
        uss._warningLogger(options.debugString, "was invoked but neither onXAxis or onYAxis were set");
    }

    //If needed, check if the x-axis of the passed container is actually scrollable. 
    if(_onXAxis && uss.getMaxScrollX(container, false, options) < 1) {
        uss._errorLogger(options.debugString, "a container that can be scrolled on the x-axis", container);
    }

    //If needed, check if the y-axis of the passed container is actually scrollable. 
    if(_onYAxis && uss.getMaxScrollY(container, false, options) < 1) {
        uss._errorLogger(options.debugString, "a container that can be scrolled on the y-axis", container);
    }

    const _speedModifierX = typeof options.speedModifierX === "function" ? options.speedModifierX : (deltaX, deltaY) => deltaX; 
    const _speedModifierY = typeof options.speedModifierY === "function" ? options.speedModifierY : (deltaX, deltaY) => deltaY; 
    const _easingX = options.momentumEasingX || function(remaning) {return remaning / 25 + 1};
    const _easingY = options.momentumEasingY || function(remaning) {return remaning / 25 + 1};

    const _momentumScrolling = _onXAxis && !_onYAxis ? (deltaX, deltaY) => { 
                                                            uss.setXStepLengthCalculator(_easingX, container, true, options);
                                                            uss.scrollXBy(_speedModifierX(deltaX, deltaY), container, options.callback, false, options);
                                                        } :
                               !_onXAxis && _onYAxis ? (deltaX, deltaY) => {
                                                            uss.setYStepLengthCalculator(_easingY, container, true, options);
                                                            uss.scrollYBy(_speedModifierY(deltaX, deltaY), container, options.callback, false, options);
                                                        } :
                                                        (deltaX, deltaY) => {
                                                            uss.setXStepLengthCalculator(_easingX, container, true, options);
                                                            uss.setYStepLengthCalculator(_easingY, container, true, options);
                                                            uss.scrollBy(_speedModifierX(deltaX, deltaY), 
                                                                         _speedModifierY(deltaX, deltaY), 
                                                                         container, 
                                                                         options.callback, 
                                                                         false,
                                                                         options
                                                            );
                                                        };
    container.addEventListener("wheel", (event) => {
        event.preventDefault();
        event.stopPropagation();
        _momentumScrolling(event.deltaX, event.deltaY);
    }, {passive:false});
}

//export
function addMomentumSnapScrolling(
    container, 
    options = {
        onXAxis: null,
        onYAxis: null,
        callback: null,
        speedModifierX: null,
        speedModifierY: null,
        momentumEasingX: null,
        momentumEasingY: null,
        snapEasingX: null,
        snapEasingY: null,
        snapDelay: 0,
        children: [],
        debugString: "addMomentumSnapScrolling"
    }, 
) {
    //console.time("init");
    __testImports();

    //Check if the options parameter is a valid object.
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
        uss._errorLogger("addMomentumSnapScrolling", "the options parameter to be an object", options);
    }

    options.debugString = options.debugString || "addMomentumSnapScrolling";

    //Check if the container is a valid container.
    if(container !== window && !(container instanceof HTMLElement)) {
        uss._errorLogger(options.debugString, "the container to be an HTMLElement or the Window", container);
    }

    //Check if the options.children parameter is an array.
    if(!Array.isArray(options.children)) {
        uss._errorLogger(options.debugString, "the options.children parameter to be an array", options.children);
    }

    //Check the elements of the options.children parameter are valid.
    for(const _child of options.children) {
        //Check if the child is an object.
        if (_child === null || typeof _child !== "object" || Array.isArray(_child)) {
            uss._errorLogger(options.debugString, "the elements of options.children to be objects", _child);
        }

        //Check if child.element is an HTMLElement.
        if(!(_child.element instanceof HTMLElement)) {
            uss._errorLogger(options.debugString, "the element parameter of each options.children object to be an HTMLElement", _child.element);
        }

        //Remove children that cannot be snap-scrolled by scrolling the passed container. 
        if(uss.getScrollableParent(_child.element, true, options) !== container) {
            uss._warningLogger(_child.element, "can't be scrolled into view by scrolling the passed container (ignored)");
            options.children.splice(i, 1);
        }
    }

    const _onXAxis = /mandatory/.test(options.onXAxis) ? 1 : // 1 === "mandatory"
                     /proximity/.test(options.onXAxis) ? 0 : // 0 === "proximity"
                                                        -1;  //-1 === no snap on x-axis
    const _onYAxis = /mandatory/.test(options.onYAxis) ? 1 : // 1 === "mandatory"
                     /proximity/.test(options.onYAxis) ? 0 : // 0 === "proximity"
                                                        -1;  //-1 === no snap on y-axis

    const _callback = typeof options.callback === "function" ? options.callback : () => {};

    options.onXAxis = _onXAxis > -1;
    options.onYAxis = _onYAxis > -1;
    options.callback = snapScrolling;

    addMomentumScrolling(container, options);

    const _easingX = options.snapEasingX || function(remaning, ot, t, total) {return (total - remaning) / 25 + 1};
    const _easingY = options.snapEasingY || function(remaning, ot, t, total) {return (total - remaning) / 25 + 1};
                                                             
    let _calcDistances, 
        _calcEuclideanDistance, 
        _snapScroll;

    if(_onXAxis > -1 && _onYAxis < 0) { //Momentum-snap on the x-axis only. 
        _calcDistances = (containerPos, containerBorders, childPos, align) => {
            const _distance =  /start/.test(align) ? childPos.left - containerPos.left - containerBorders[3] :  
                                 /end/.test(align) ? childPos.right - containerPos.right + uss.calcXScrollbarDimension(container, false, options) + containerBorders[1] :
                                                     (childPos.left + childPos.right 
                                                        - containerPos.left - containerPos.right 
                                                        + uss.calcXScrollbarDimension(container, false, options)
                                                        - containerBorders[1]
                                                        + containerBorders[3]
                                                     ) * 0.5;

            //The snap-scroll is required on proximity (_onXAxis === 0), 
            //check if the container and the child are not too far away.
            return _onXAxis === 0 && Math.abs(_distance) - 1 > childPos.width * 0.5 ? null : [_distance, 0];
        }

        //The euclidean distance is just the |deltaX|.
        _calcEuclideanDistance = (deltas) => Math.abs(deltas[0]);

        _snapScroll = (deltas) => {
            uss.setXStepLengthCalculator(_easingX, container, true, options);
            uss.scrollXBy(Math.round(deltas[0]), container, _callback, true, options);
        }
    } else if(_onXAxis < 0 && _onYAxis > -1) { //Momentum-snap on the y-axis only.
        _calcDistances = (containerPos, containerBorders, childPos, align) => {
            const _distance = /start/.test(align) ? childPos.top - containerPos.top - containerBorders[0] : 
                                /end/.test(align) ? childPos.bottom - containerPos.bottom + uss.calcYScrollbarDimension(container, false, options) + containerBorders[2] :
                                                    (childPos.top + childPos.bottom 
                                                        - containerPos.top - containerPos.bottom 
                                                        + uss.calcYScrollbarDimension(container, false, options)
                                                        - containerBorders[0]
                                                        + containerBorders[2]
                                                    ) * 0.5;     
         
            //The snap-scroll is required on proximity (_onYAxis === 0), 
            //check if the container and the child are not too far away.
            return _onYAxis === 0 && Math.abs(_distance) - 1 > childPos.height * 0.5 ? null : [0, _distance];
        }

        //The euclidean distance is just the |deltaY|.
        _calcEuclideanDistance = (deltas) => Math.abs(deltas[1]);

        _snapScroll = (deltas) => {
            uss.setYStepLengthCalculator(_easingY, container, true, options);
            uss.scrollYBy(Math.round(deltas[1]), container, _callback, true, options);
        }
    } else { //Momentum-snap on both axes.
        _calcDistances = (containerPos, containerBorders, childPos, align) => {
            const _distanceX =  /start/.test(align) ? childPos.left - containerPos.left - containerBorders[3] :  
                                  /end/.test(align) ? childPos.right - containerPos.right + uss.calcXScrollbarDimension(container, false, options) + containerBorders[1] :
                                                      (childPos.left + childPos.right 
                                                         - containerPos.left - containerPos.right 
                                                         + uss.calcXScrollbarDimension(container, false, options)
                                                         - containerBorders[1]
                                                         + containerBorders[3]
                                                      ) * 0.5;

            const _distanceY = /start/.test(align) ? childPos.top - containerPos.top - containerBorders[0] : 
                                 /end/.test(align) ? childPos.bottom - containerPos.bottom + uss.calcYScrollbarDimension(container, false, options) + containerBorders[2] :
                                                     (childPos.top + childPos.bottom 
                                                         - containerPos.top - containerPos.bottom 
                                                         + uss.calcYScrollbarDimension(container, false, options)
                                                         - containerBorders[0]
                                                         + containerBorders[2]
                                                     ) * 0.5;  

            //If the snap-scroll is required on proximity (_onXAxis === 0 && _onYAxis === 0), 
            //check if the container and the child are not too far away.
            const _xTooFar = _onXAxis === 0 && Math.abs(_distanceX) - 1 > childPos.width * 0.5;
            const _yTooFar = _onYAxis === 0 && Math.abs(_distanceY) - 1 > childPos.height * 0.5;

            return _xTooFar && _yTooFar  ? null : 
                   _xTooFar && !_yTooFar ? [null, _distanceY, _distanceX] :
                   !_xTooFar && _yTooFar ? [_distanceX, null, _distanceY] :
                                           [_distanceX, _distanceY];
        }

        //The euclidean distance is calculated by using the pythagoras theorem.
        _calcEuclideanDistance = (deltas) => {
            return deltas[0] === null ? Math.sqrt(deltas[2] * deltas[2] + deltas[1] * deltas[1]) :
                   deltas[1] === null ? Math.sqrt(deltas[0] * deltas[0] + deltas[2] * deltas[2]) :
                                        Math.sqrt(deltas[0] * deltas[0] + deltas[1] * deltas[1]);
        }

        _snapScroll = (deltas) => {
            //Note: Math.round(null) === 0
            uss.setXStepLengthCalculator(_easingX, container, true, options);
            uss.setYStepLengthCalculator(_easingY, container, true, options);
            uss.scrollBy(Math.round(deltas[0]), Math.round(deltas[1]), container, _callback, true, options);
        }
    }

    //console.timeEnd("init");

    //This function finds which of the passed options.children is the closest to a snap-point
    //and snaps it into view with a smooth scroll-animation. 
    let _snapScrollingTimeout;
    function snapScrolling() {        
        window.clearTimeout(_snapScrollingTimeout);
        _snapScrollingTimeout = window.setTimeout(() => {
            if(options.children.length < 1) {
                _callback();
                return;
            }  

            //console.time("main");
            const _containerPos = container.getBoundingClientRect();
            const _containerBorders = uss.calcBordersDimensions(container, false, options);

            let _minEuclideanDistance = Infinity;
            let _minDistances = Infinity;

            /**
             * Find the element to snap-align within the passed children parameter.
             * The performance of this search-method is fine with up to 10.000 children. 
             */
            for(const child of options.children) {
                const _childPos = child.element.getBoundingClientRect();
                const _requestedAlignment = child.align;

                const _distances = _calcDistances(_containerPos, _containerBorders, _childPos, _requestedAlignment);
                if(!_distances) continue; //In normal conditions _distances is an array
                const _euclideanDistance = _calcEuclideanDistance(_distances);

                if(_euclideanDistance <= _minEuclideanDistance) {
                    _minEuclideanDistance = _euclideanDistance;
                    _minDistances = _distances;
                }
            }
            //console.timeEnd("main");
            //console.time("scroll")
            if(_minDistances === Infinity) {
                _callback();
                return;
            } 

            _snapScroll(_minDistances);
            //console.timeEnd("scroll")
        }, options.snapDelay);
    }

    return snapScrolling;
}








//export
function addElasticMomentumScrolling(
    container, 
    options = {
        onXAxis: null,
        onYAxis: null,
        callback: null,
        momentumEasingX: null,
        momentumEasingY: null,
        elasticEasingX: null, 
        elasticEasingY: null, 
        elasticAmount: 100,
        children: [],
        debugString: "addElasticMomentumScrolling"
    }, 
) {
    __testImports();

    //Check if the options parameter is a valid object.
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
        uss._errorLogger("addElasticMomentumScrolling", "the options parameter to be an object", options);
    }

    options.debugString = options.debugString || "addElasticMomentumScrolling";

    //Check if the container is a valid container.
    if(container !== window && !(container instanceof HTMLElement)) {
        uss._errorLogger(options.debugString, "the container to be an HTMLElement or the Window", container);
    }
        
    const _children = options.children;

    //Check if the options.children parameter is an array.
    if(!Array.isArray(_children)) {
        uss._errorLogger(options.debugString, "the options.children parameter to be an array", _children);
    }

    //Check if the options.children parameter has at most 2 elements.
    if(_children.length > 2) {
        uss._errorLogger(options.debugString, "the options.children parameter to have at most 2 elements.", _children);
    }

    //Check if the first element of the options.children parameter is a valid object.
    if(_children.length > 0) {  
        if(_children[0] === null || typeof _children[0] !== "object" || Array.isArray(_children[0])) {
            uss._errorLogger(options.debugString, "the elements of options.children to be objects", _children[0]);
        }

        //When the options.children of addMomentumSnapScrolling will contain only  
        //this.options.children[0], its alignment will be mandatory-start.
        _children[0].align = "start";
    }

    //Check if the second element of the options.children parameter is a valid object.
    if(_children.length > 1) {
        if(_children[1] === null || typeof _children[1] !== "object" || Array.isArray(_children[1])) {
            uss._errorLogger(options.debugString, "the elements of options.children to be objects", _children[1]);
        }
        
        //When the options.children of addMomentumSnapScrolling will contain only  
        //this.options.children[1], its alignment will be mandatory-end.
        _children[1].align = "end";
    }

    const _onXAxis = options.onXAxis;
    const _onYAxis = options.onYAxis;
    if(_onXAxis) options.onXAxis = "mandatory";
    if(_onYAxis) options.onYAxis = "mandatory";

    const _elasticAmount = options.elasticAmount || 100;

    if(_onXAxis) {
        options.speedModifierX = (deltaX, deltaY) => {
            const _delta = deltaX;
            const _finalPos = uss.getFinalXPosition(container, options) + _delta;
            
            if(_finalPos <= _elasticAmount) {
                //We're at the left of the passed container, the snap scrolling
                //will be triggered on _children[0] with align = "start".
                if(_children[0]) options.children = [_children[0]];

                //Mathematical explanation of the below delta's easing: 
                //_finalPos => f1 = -x + k   //f1 in [0.._elasticAmount]
                //_progress => f2 = f1 / k   //f2 in [1..0]
                //easing    => f3 = f2^(1.3) //f3 in [0..1]
                const _progress = Math.max(0, _finalPos / _elasticAmount);
                return _delta * Math.pow(_progress, 1.3) - 1; //delta * f3 - 1
            }
        
            const _maxScroll = uss.getMaxScrollX(container, false, options);
            if(_finalPos >= _maxScroll - _elasticAmount) {
                //We're at the bottom of the passed container, the snap scrolling
                //will be triggered on _children[1] with align = "end".
                if(_children[1]) options.children = [_children[1]];

                //Mathematical explanation of the below delta's easing: 
                //_finalPos => f1 = -x + k   //f1 in [_maxScroll - _elasticAmount.._maxScroll]
                //_progress => f2 = f1 / k   //f2 in [1..0]
                //easing    => f3 = f2^(1.3) //f3 in [0..1]
                const _progress = Math.max(0, (_maxScroll - _finalPos) / _elasticAmount);
                return _delta * Math.pow(_progress, 1.3) + 1; //delta * f3 + 1 
            }
        
            //The snap scrolling won't be triggered because we're not 
            //at any end of the passed container.
            options.children = [];
            return _delta;
        }
    }

    if(_onYAxis) {
        options.speedModifierY = (deltaX, deltaY) => {
            const _delta = deltaY;
            const _finalPos = uss.getFinalYPosition(container, options) + _delta;
            
            //We're at the top of the passed container beyond the _elasticAmount trigger. 
            if(_finalPos <= _elasticAmount) {
                //The snap scrolling will be triggered on _children[0] with align: "start".
                if(_children[0]) options.children = [_children[0]];

                //Mathematical explanation of the below delta's easing: 
                //_finalPos => f1 = -x + k   //f1 in [0.._elasticAmount]
                //_progress => f2 = f1 / k   //f2 in [1..0]
                //easing    => f3 = f2^(1.3) //f3 in [0..1]
                const _progress = Math.max(0, _finalPos / _elasticAmount);
                return _delta * Math.pow(_progress, 1.3) - 1; //delta * f3 - 1
            }
        
            const _maxScroll = uss.getMaxScrollY(container, false, options);
            
            //We're at the bottom of the passed container beyond the _elasticAmount trigger. 
            if(_finalPos >= _maxScroll - _elasticAmount) {
                //The snap scrolling will be triggered on _children[1] with align: "end".
                if(_children[1]) options.children = [_children[1]];

                //Mathematical explanation of the below delta's easing: 
                //_finalPos => f1 = -x + k   //f1 in [_maxScroll - _elasticAmount.._maxScroll]
                //_progress => f2 = f1 / k   //f2 in [1..0]
                //easing    => f3 = f2^(1.3) //f3 in [0..1]
                const _progress = Math.max(0, (_maxScroll - _finalPos) / _elasticAmount);
                return _delta * Math.pow(_progress, 1.3) + 1; //delta * f3 + 1 
            }

            //The snap scrolling won't be triggered because we're not 
            //at any end of the passed container.
            options.children = [];
            return _delta;
        }
    }

    //TODO Test new elastic easings (perhaps see index.html) <------------------------
    options.snapEasingX = options.elasticEasingX || EASE_OUT_CUBIC(); //NOT FINAL <------------------------------
    options.snapEasingY = options.elasticEasingY || EASE_OUT_CUBIC(); //NOT FINAL <------------------------------

    //Doesn't work on laptop (60fps monitors)
    options.snapEasingY = (remaning, originalTimeStamp, timestamp) => {
        return remaning / 20 + 1;
    }
    
    options.elasticEasingX = undefined;
    options.elasticEasingY = undefined;
    options.snapDelay = 60; //Debounce time

    addMomentumSnapScrolling(container, options)(); 
}
