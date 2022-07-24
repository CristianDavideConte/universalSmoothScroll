/**
 * TODO:
 * - fix error logging's weird output format
 * - fix momentum snap scrolling bug that stops the scrolling if an anchor link is hovered
 * - scrollbar smooth scrolling
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

/**
 * This function enables the momentum smooth scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An HTMLElement or the window element.
 * @param {Object} options An object which containing the momentum smooth scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if the momentum smooth scrolling should be enabled on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=false] True if the momentum smooth scrolling should be enabled on the y-axis of container, false otherwise.
 * @param {Function} [options.callback] A function that will be executed when the container is done with the current momentum smooth scrolling scroll-animation.
 * @param {Function} [options.speedModifierX] A function that must return the number of pixel that will be added to the current total scrolling amount (on the x-axis)
 *                                            of this momentum smooth scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.speedModifierY] A function that must return the number of pixel that will be added to the current total scrolling amount (on the y-axis)
 *                                            of this momentum smooth scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.momentumEasingX] A valid stepLengthCalculator that will control the easing of this scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.momentumEasingY] A valid stepLengthCalculator that will control the easing of this scroll-animation (on the y-axis) of container.
 * @param {String} [options.debugString="addMomentumScrolling"] A string internally used to log the name of the most upper level function that caused an error/warning.   
 */
//export
function addMomentumScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: false,
        callback,
        speedModifierX,
        speedModifierY,
        momentumEasingX,
        momentumEasingY,
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

    //Default easing behaviors: ease-out.
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
        if(event.deltaZ) return;
        event.preventDefault();
        event.stopPropagation();
        _momentumScrolling(event.deltaX, event.deltaY);
    }, {passive:false});
}

/**
 * This function enables the momentum snap scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An HTMLElement or the window element.
 * @param {Object} options An object which containing the momentum snap scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis] "mandatory" to always trigger the snap-into-view behavior (on the x-axis) of this scroll-animation.
 *                                    "proximity" to trigger the snap-into-view behavior (on the x-axis) of this scroll-animation only if there's one of the 
 *                                    children.elements not further from its snap-point than half of his width. 
 * @param {Boolean} [options.onYAxis] "mandatory" to always trigger the snap-into-view behavior (on the y-axis) of this scroll-animation.
 *                                    "proximity" to trigger the snap-into-view behavior (on the y-axis) of this scroll-animation only if there's one of the 
 *                                    children.elements not further from its snap-point than half of his height. 
 * @param {Function} [options.callback] A function that will be executed when the container is done with the snap-into-view part of the current scroll-animation.
 * @param {Function} [options.speedModifierX] A function that must return the number of pixel that will be added to the current total scrolling amount (on the x-axis)
 *                                            of this momentum snap scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.speedModifierY] A function that must return the number of pixel that will be added to the current total scrolling amount (on the y-axis)
 *                                            of this momentum snap scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.momentumEasingX] A valid stepLengthCalculator that will control the easing of the momentum smooth scroll part of this 
 *                                             scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.momentumEasingY] A valid stepLengthCalculator that will control the easing of the momentum smooth scroll part of this 
 *                                             scroll-animation (on the y-axis) of container.
 * @param {Function} [options.snapEasingX] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
 *                                         scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.snapEasingY] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
 *                                         scroll-animation (on the y-axis) of container. 
 * @param {Number} [options.snapDelay=0] The number of milliseconds that will be waited from the end of the momentum smooth scroll part of this scroll-animation 
 *                                       in order to trigger the beginning of the snap-into-view part.
 * @param {Array} [options.children] An array of objects that have 2 properties:
 *                                   - element: a direct children of container that you want to snap-into-view.
 *                                   - align: "start" if you want element to be left-aligned on the x-axis and top-aligned on the y-axis.
 *                                            "end" if you want element to be right-aligned on the x-axis and bottom-aligned on the y-axis.
 *                                            Any other value if you want element to be center-aligned on both axes.
 * @param {String} [options.debugString="addMomentumScrolling"] A string internally used to log the name of the most upper level function that caused an error/warning.   
 */
//export
function addMomentumSnapScrolling(
    container, 
    options = {
        onXAxis,
        onYAxis,
        callback,
        speedModifierX,
        speedModifierY,
        momentumEasingX,
        momentumEasingY,
        snapEasingX,
        snapEasingY,
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
    const _childrenNum = options.children.length;
    for(let i = 0; i < _childrenNum; i++) {
        const _child = options.children[i];
        
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
            uss._warningLogger(_child.element, "can't be scrolled into view by scrolling the passed container");
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

    //Default easing behaviors: ease-in.
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
            const _delta = Math.round(deltas[0]);
            uss.setXStepLengthCalculator(_easingX, container, true, options);
            uss.scrollXBy(_delta, container, _callback, true, options);
            
            container.dispatchEvent(
                new WheelEvent("wheel", { //TODO use custom event https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
                    deltaX: _delta,
                    deltaY: 0,
                    deltaZ: 1, //Tells the other functions that the scrolling has already taken place
                    deltaMode: 0,
                })
            );
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
            const _delta = Math.round(deltas[1]); 
            uss.setYStepLengthCalculator(_easingY, container, true, options);
            uss.scrollYBy(_delta, container, _callback, true, options);
            
            container.dispatchEvent(
                new WheelEvent("wheel", {
                    deltaX: 0,
                    deltaY: _delta,
                    deltaZ: 1, //Tells the other functions that the scrolling has already taken place
                    deltaMode: 0,
                })
            );
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
            const _deltaX = Math.round(deltas[0]);
            const _deltaY = Math.round(deltas[1]);
            uss.setXStepLengthCalculator(_easingX, container, true, options);
            uss.setYStepLengthCalculator(_easingY, container, true, options);
            uss.scrollBy(_deltaX, _deltaY, container, _callback, true, options);

            container.dispatchEvent(
                new WheelEvent("wheel", {
                    deltaX: _deltaX,
                    deltaY: _deltaY,
                    deltaZ: 1, //Tells the other functions that the scrolling has already taken place
                    deltaMode: 0,
                })
            );
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

/**
 * This function enables the elastic momentum scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An HTMLElement or the window element.
 * @param {Object} options An object which containing the momentum elastic scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if the elastic momentum smooth scrolling should be enabled on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=false] True if the elastic momentum smooth scrolling should be enabled on the y-axis of container, false otherwise.
 * @param {Function} [options.callback] A function that will be executed when the container is done with the elastic part of the current scroll-animation.
 * @param {Function} [options.momentumEasingX] A valid stepLengthCalculator that will control the easing of the momentum smooth scroll part of this 
 *                                             scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.momentumEasingY] A valid stepLengthCalculator that will control the easing of the momentum smooth scroll part of this 
 *                                             scroll-animation (on the y-axis) of container.
 * @param {Function} [options.elasticEasingX] A valid stepLengthCalculator that will control the easing of the elastic part of this 
 *                                            scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.elasticEasingY] A valid stepLengthCalculator that will control the easing of the elastic part of this 
 *                                            scroll-animation (on the y-axis) of container. 
 * @param {Number} [options.elasticAmount=100] The region of pixels from the left/top and the right/bottom borders of container that will trigger
 *                                             the elastic part of this scroll-animation when traspassed by the scroll-position of container.    
 * @param {Array} [options.children] An array of 1 or 2 objects that have only 1 property:
 *                                   - element: a direct children of container.
 *                                   options.children[0] should point to the element that will be left/top aligned after the elastic part of this scroll-animation. 
 *                                   options.children[1] should point to the element that will be right/bottom aligned after the elastic part of this scroll-animation.
 * @param {String} [options.debugString="addMomentumScrolling"] A string internally used to log the name of the most upper level function that caused an error/warning.   
 */
//export
function addElasticMomentumScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: false,
        callback,
        momentumEasingX,
        momentumEasingY,
        elasticEasingX, 
        elasticEasingY, 
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
    const _childrenNum = _children.length;

    //Check if the options.children parameter is an array.
    if(!Array.isArray(_children)) {
        uss._errorLogger(options.debugString, "the options.children parameter to be an array", _children);
    }

    //Check if the options.children parameter has at most 2 elements.
    if(_childrenNum < 1 || _childrenNum > 2) {
        uss._errorLogger(options.debugString, "the options.children parameter to have 1 or 2 elements.", _children);
    }

    //Check if the first element of the options.children parameter is a valid object.
    if(_children[0] === null || typeof _children[0] !== "object" || Array.isArray(_children[0])) {
        uss._errorLogger(options.debugString, "the elements of options.children to be objects", _children[0]);
    }

    //When the options.children of addMomentumSnapScrolling will contain only  
    //this.options.children[0], its alignment will be mandatory-start.
    _children[0].align = "start";

    //Check if the second element of the options.children parameter is a valid object.
    if(_childrenNum > 1) {
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

    //Default easing behaviors: ease-out-like.
    options.snapEasingX = options.elasticEasingX || function(remaning) {return Math.ceil(uss._framesTime * remaning / 160)};
    options.snapEasingY = options.elasticEasingY || function(remaning) {return Math.ceil(uss._framesTime * remaning / 160)};

    options.elasticEasingX = undefined;
    options.elasticEasingY = undefined;
    options.snapDelay = 60; //Debounce time

    addMomentumSnapScrolling(container, options)(); 
}










//export
function addSmoothScrollbar(
    container,
    options = {
        onXAxis: false,
        onYAxis: false,
        hideTimeoutX: 2000,
        hideTimeoutY: 2000,
        thumbSize,
        transitionDurationX,     
        transitionDurationY,      
        debugString: "addSmoothScrollbar",
    }
) {
    __testImports();

    //Check if the options parameter is a valid object.
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
        uss._errorLogger("addSmoothScrollbar", "the options parameter to be an object", options);
    }

    options.debugString = options.debugString || "addSmoothScrollbar";

    //Check if the container is a valid container.
    if(container !== window && !(container instanceof HTMLElement)) {
        uss._errorLogger(options.debugString, "the container to be an HTMLElement or the Window", container);
    }
    
    const _onXAxis = options.onXAxis;
    const _onYAxis = options.onYAxis;
    
    //Check if at least one axis was requested to be momentum-scrolled.
    if(!_onXAxis && !_onYAxis) {
        uss._warningLogger(options.debugString, "was invoked but neither onXAxis or onYAxis were set");
    }

    let _scrollbars = [];
    const _scrollbarThumbSize = options.thumbSize || 17;

    if(_onXAxis) {
        const _maxScroll = uss.getMaxScrollX(container, false, options);

        //Check if the x-axis of the passed container is actually scrollable. 
        if(_maxScroll < 1) {
            //uss._errorLogger(options.debugString, "a container that can be scrolled on the x-axis", container);
        }
        
        const _offset = _onYAxis ? _scrollbarThumbSize : 0;
        const _offsetPx = _offset + "px";
        _scrollbars.push(
            _createScrollbar(
                "calc(100% - " + _offsetPx + ")",
                _scrollbarThumbSize + "px",
                "calc(100% - "+ _scrollbarThumbSize + "px) " + _offsetPx + " 0 0",
                "100%",
                "25%",
                _offset,
                true
            )
        );
    }

    if(_onYAxis) {
        const _maxScroll = uss.getMaxScrollY(container, false, options);

        //Check if the y-axis of the passed container is actually scrollable. 
        if(_maxScroll < 1) {
            //uss._errorLogger(options.debugString, "a container that can be scrolled on the y-axis", container);
        }
        
        _scrollbars.push(
            _createScrollbar(
                _scrollbarThumbSize + "px",
                "100%",
                "0 0 0 calc(100% - " + _scrollbarThumbSize + "px)",
                "25%",
                "100%",
                0,
                false
            )
        );
    }

    function _createScrollbar(trackWidth, trackHeight, trackMargin, thumbHeight, thumbWidth, offset, onXAxis) {
        const __scrollbarTrack = document.createElement("div");
        const __scrollbarThumb = document.createElement("div");
    
        __scrollbarTrack.style = `
            position: absolute;
            z-index: 1;
            background-color: blue;
            margin: ${trackMargin};
            height: ${trackHeight};
            width: ${trackWidth};
        `

        __scrollbarThumb.style = `
            position: absolute;
            background-color: red;
            height: ${thumbHeight};
            width: ${thumbWidth};
        `

        //Accessibility styles.
        __scrollbarTrack.tabIndex = -1;
        __scrollbarThumb.tabIndex = -1;
        
        //Hide container's default scrollbars.
        if(onXAxis) container.style.overflowX = "hidden";
        else container.style.overflowY = "hidden";

        //Indicates that descendants of the element don't display outside its bounds.
        //It's use to create a new stacking context so that the position:absolute 
        //of the scrollbar are always relative to the container.
            //container.style.contain = "paint"; //Perhaps change to transform:translateZ(0)


        let __scrollbarEngaged = false;
        let __lastKnowMousePos;
        let __hideTimeout;
        let __moveScrollbarTimeout;
        let __moveScrollbarOffset = {
            deltaX: 0,
            deltaY: 0,
            deltaZ: 0,
            deltaMode: 0
        }
        const __setEngagedStatus = (event, status) => {
            event.preventDefault();
            event.stopPropagation();
            
            __scrollbarEngaged = status;
            __lastKnowMousePos = {
                x: event.clientX,
                y: event.clientY
            }
        } 

        //Engage the scrollbar.
        __scrollbarThumb.addEventListener("mousedown", (event) => {
            __setEngagedStatus(event, true);     
            window.addEventListener("mouseup", disengageScrollbar, {passive:false});
            window.addEventListener("mousemove", scrollContainer, {passive:true});   
        }, {passive:false});
        
        //Disengage the scrollbar.
        function disengageScrollbar(event) {            
            __setEngagedStatus(event, false);  
            window.removeEventListener("mousemove", scrollContainer, {passive:true});     
            window.removeEventListener("mouseup", disengageScrollbar, {passive:false});   
        }

        //Make the container move based on the scrollbar movement.
        function scrollContainer(event) {      
            let __scrollbarOffset = 0;  
            const __delta = Math.sqrt(event.movementX * event.movementX + event.movementY * event.movementY);
            
            if(onXAxis) {
                if(__moveScrollbarTimeout) { 
                    window.clearTimeout(__moveScrollbarTimeout);
                    __scrollbarOffset = __moveScrollbarOffset.deltaX;
                    __moveScrollbarTimeout = null;
                    __moveScrollbarOffset.deltaX = 0;
                }

                const __containerScrollWidth = container.scrollWidth;
                const __containerClientWidth = container.clientWidth || window.innerWidth; 
                
                const __direction = Math.sign(event.clientX - __lastKnowMousePos.x);
                const __scrollMultiplier = __containerScrollWidth / __containerClientWidth;
                const __finalDelta = __direction * __delta * __scrollMultiplier; 

                __lastKnowMousePos.x = event.clientX;

                container.dispatchEvent(
                    new WheelEvent("wheel", {
                        deltaX: __finalDelta - __scrollbarOffset,
                        deltaY: 0,
                        deltaZ: 0,
                        deltaMode: 0,
                    })
                );
            } else {
                if(__moveScrollbarTimeout) { 
                    window.clearTimeout(__moveScrollbarTimeout);
                    __scrollbarOffset = __moveScrollbarOffset.deltaY;
                    __moveScrollbarTimeout = null;
                    __moveScrollbarOffset.deltaY = 0;
                }

                const __containerScrollHeight = container.scrollHeight;
                const __containerClientHeight = container.clientHeight || window.innerHeight; 
                
                const __direction = Math.sign(event.clientY - __lastKnowMousePos.y);
                const __scrollMultiplier = __containerScrollHeight / __containerClientHeight;
                const __finalDelta = __direction * __delta * __scrollMultiplier; 

                __lastKnowMousePos.y = event.clientY;

                container.dispatchEvent(
                    new WheelEvent("wheel", {
                        deltaX: 0,
                        deltaY: __finalDelta - __scrollbarOffset,
                        deltaZ: 0,
                        deltaMode: 0,
                    })
                );
            } 
        };

        container.addEventListener("wheel", (event) => {
            //The scrollbar is being held by the user but the API has 
            //scrolled the container past its position.
            if(__scrollbarEngaged && event.deltaZ) {
                __moveScrollbarOffset = {
                    deltaX: event.deltaX,
                    deltaY: event.deltaY,
                    deltaZ: event.deltaZ,
                    deltaMode: event.deltaMode,
                }

                __moveScrollbarTimeout = window.setTimeout(
                    () => {
                        container.dispatchEvent(
                            new WheelEvent("wheel", __moveScrollbarOffset)
                        );
                    }, 
                    200
                );
                
                return;
            }

            window.clearTimeout(__moveScrollbarTimeout);
            __moveScrollbarTimeout = null; 
            
            if(__scrollbarEngaged) {
                __scrollbarThumb.style.transitionDuration = "0s";
            } else {
                if(onXAxis) __scrollbarThumb.style.transitionDuration = options.transitionDurationX || "0.2s";
                else        __scrollbarThumb.style.transitionDuration = options.transitionDurationY || "0.2s";
            }

            if(onXAxis) {
                const __thumbSize = __scrollbarThumb.getBoundingClientRect().width;
                const __containerClientWidth = container.clientWidth || window.innerWidth; 

                let __scrolledPercentage = uss.getFinalXPosition(container) / uss.getMaxScrollX(container);
                __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                       __scrolledPercentage < 0 ? 0 : 
                                       __scrolledPercentage;


                const __translateAmount = __scrolledPercentage * (__containerClientWidth - __thumbSize - offset);
                __scrollbarThumb.style.transform = "translateX(" + __translateAmount + "px)";
            } else {
                const __thumbSize = __scrollbarThumb.getBoundingClientRect().height;
                const __containerClientHeight = container.clientHeight || window.innerHeight; 

                let __scrolledPercentage = uss.getFinalYPosition(container) / uss.getMaxScrollY(container);
                __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                       __scrolledPercentage < 0 ? 0 : 
                                       __scrolledPercentage;

                const __translateAmount = __scrolledPercentage * (__containerClientHeight - __thumbSize);
                __scrollbarThumb.style.transform = "translateY(" + __translateAmount + "px)";
            }
        }, {passive:true})



        //Add the scrollbar to the container.
        __scrollbarTrack.appendChild(__scrollbarThumb);
        container.insertBefore(__scrollbarTrack, container.firstChild);
        
        return {
            track: __scrollbarTrack,
            thumb: __scrollbarThumb,
        }
    }

    return _scrollbars;
}