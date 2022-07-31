/**
 * TODO: 
 * - add speedModifiers to momentumElasticScrolling without breaking the scrolling
 * - smooth scrolling with animation allowed
 * - smooth scrolling for carousels (perhaps leave this implementation to the developer?)
 */


/**
 * Each of this functions should have an input interface that:
 *  - has the container as the first parameter
 *  - has an "options" object as the second parameter
 *  - every function-specific input should be a property of the "options" parameter
 * 
 * Each of this functions should dispatch the custom "ussmoverequest" 
 * to their container whenever they directly use:
 *  - the uss.scrollXTo/uss.scrollXBy functions
 *  - the uss.scrollYTo/uss.scrollYBy functions
 *  - the uss.scrollTo/uss.scrollBy functions
 * This event is used to request the container's controllers (e.g. its smooth scrollbars)
 * to scroll it whenever it's ok to do so (e.g. scroll only when the user isn't holding down the scrollbar). 
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
export function addMomentumScrolling(
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
        return;
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
        return;
    }

    //If needed, check if the y-axis of the passed container is actually scrollable. 
    if(_onYAxis && uss.getMaxScrollY(container, false, options) < 1) {
        uss._errorLogger(options.debugString, "a container that can be scrolled on the y-axis", container);
        return;
    }

    const _speedModifierX = typeof options.speedModifierX === "function" ? options.speedModifierX : (deltaX, deltaY) => deltaX; 
    const _speedModifierY = typeof options.speedModifierY === "function" ? options.speedModifierY : (deltaX, deltaY) => deltaY; 

    //Default easing behaviors: ease-out.
    const _easingX = options.momentumEasingX || function(remaning) {return remaning / 25 + 1};
    const _easingY = options.momentumEasingY || function(remaning) {return remaning / 25 + 1};

    let _pointersDownIds = [];
    let _callbackOnPointerUp = false;
    let _momentumScrolling,
        _axis;

    //Execute the options.callback only if it's a function and the user  
    //is not holding the pointer down. Wait for the pointerup event otherwise.
    const _callback = typeof options.callback === "function" ? () => {
        if(_pointersDownIds.length > 0) {
            _callbackOnPointerUp = true;
            return;
        } 
        options.callback();
    } : null;

    if(_onXAxis && !_onYAxis) {
        _momentumScrolling = (deltaX, deltaY) => { 
            uss.setXStepLengthCalculator(_easingX, container, true, options);
            uss.scrollXBy(_speedModifierX(deltaX, deltaY), container, _callback, false, options);
        }
        _axis = 0;
    } else if(!_onXAxis && _onYAxis) {
        _momentumScrolling = (deltaX, deltaY) => {
            uss.setYStepLengthCalculator(_easingY, container, true, options);
            uss.scrollYBy(_speedModifierY(deltaX, deltaY), container, _callback, false, options);                                                            
        } 
        _axis = 1;
    } else {
        _momentumScrolling = (deltaX, deltaY) => {
            uss.setXStepLengthCalculator(_easingX, container, true, options);
            uss.setYStepLengthCalculator(_easingY, container, true, options);
            uss.scrollBy(
                _speedModifierX(deltaX, deltaY), 
                _speedModifierY(deltaX, deltaY), 
                container, 
                _callback, 
                false, 
                options
            );
        }
        _axis = 2;
    }

    const _handleMoveEvent = (deltaX, deltaY, event) => {
        event.preventDefault();
        event.stopPropagation();

        const __scrollRequest = new CustomEvent(
            "ussmoverequest", 
            { 
                cancelable: true,
                detail: {
                    axis: _axis,
                    scroller: () => _momentumScrolling(deltaX, deltaY),
                }
            }
        );
        container.dispatchEvent(__scrollRequest);

        //If no one has handled the scroll request yet.
        if(!__scrollRequest.defaultPrevented) {
            _momentumScrolling(deltaX, deltaY);
        }
    } 
    
    const _handlePointerUpEvent = (event) => {
        //The pointerup event was triggered by a pointer not related with this container.
        const _pointerIdIndex = _pointersDownIds.indexOf(event.pointerId);
        if(_pointerIdIndex < 0) return;

        _pointersDownIds.splice(_pointerIdIndex, 1);
        if(_pointersDownIds.length === 0) {
            if(_callbackOnPointerUp) {
                options.callback();
                _callbackOnPointerUp = false;
            }
            window.removeEventListener("pointerup", _handlePointerUpEvent, {passive:true});
        }
    } 
    
    container.style.touchAction = "none";
    
    container.addEventListener("pointerdown", (event) => {
        //The pointerdown event is not relevant for scrolling if the pointer is a mouse.
        if(event.pointerType === "mouse") return;

        event.preventDefault();
        event.stopPropagation();

        if(_pointersDownIds.length === 0) {
            window.addEventListener("pointerup", _handlePointerUpEvent, {passive:true});
        }
        _pointersDownIds.push(event.pointerId);
    }, {passive:false});

    container.addEventListener("pointermove", (event) => {
        if(_pointersDownIds.length === 0) return;
        _handleMoveEvent(-event.movementX, -event.movementY, event);  
    }, {passive:false});

    container.addEventListener("wheel", (event) => _handleMoveEvent(event.deltaX, event.deltaY, event), {passive:false});
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
 *                                            It will be passed the movementX and the movementY of the pointermove event that triggered this scroll-animation.
 * @param {Function} [options.speedModifierY] A function that must return the number of pixel that will be added to the current total scrolling amount (on the y-axis)
 *                                            of this momentum snap scrolling scroll-animation.
 *                                            It will be passed the movementX and the movementY of the pointermove event that triggered this scroll-animation.
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
 * @returns {Function} A function that when invoked forces container to check and snap-scroll-into-view one of children.element if needed.  
 */
export function addMomentumSnapScrolling(
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
        return;
    }

    options.debugString = options.debugString || "addMomentumSnapScrolling";

    //Check if the container is a valid container.
    if(container !== window && !(container instanceof HTMLElement)) {
        uss._errorLogger(options.debugString, "the container to be an HTMLElement or the Window", container);
        return;
    }

    //Check if the options.children parameter is an array.
    if(!Array.isArray(options.children)) {
        uss._errorLogger(options.debugString, "the options.children parameter to be an array", options.children);
        return;
    }

    //Check the elements of the options.children parameter are valid.
    const _childrenNum = options.children.length;
    for(let i = 0; i < _childrenNum; i++) {
        const _child = options.children[i];
        
        //Check if the child is an object.
        if (_child === null || typeof _child !== "object" || Array.isArray(_child)) {
            uss._errorLogger(options.debugString, "the elements of options.children to be objects", _child);
            return;
        }

        //Check if child.element is an HTMLElement.
        if(!(_child.element instanceof HTMLElement)) {
            uss._errorLogger(options.debugString, "the element parameter of each options.children object to be an HTMLElement", _child.element);
            return;
        }

        //Remove children that cannot be snap-scrolled by scrolling the passed container. 
        if(_child.element.dataset.uss || uss.getScrollableParent(_child.element, true, options) !== container) {
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
        _snapScroll,
        _axis;

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
        _axis = 0;
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
        _axis = 1;
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
        _axis = 2;
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

            const __scrollRequest = new CustomEvent(
                "ussmoverequest", 
                { 
                    cancelable: true,
                    detail: {
                        axis: _axis,
                        scroller: () => _snapScroll(_minDistances),
                    }
                }
            );
            container.dispatchEvent(__scrollRequest);
            
            //If no one has handled the scroll request yet.
            if(!__scrollRequest.defaultPrevented) {
                _snapScroll(_minDistances);
            }
            
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
 * @returns {Function} A function that when invoked forces container to be elastic-scrolled if needed.  
 */
export function addElasticMomentumScrolling(
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
        return;
    }

    options.debugString = options.debugString || "addElasticMomentumScrolling";

    //Check if the container is a valid container.
    if(container !== window && !(container instanceof HTMLElement)) {
        uss._errorLogger(options.debugString, "the container to be an HTMLElement or the Window", container);
        return;
    }
        
    const _children = options.children;
    const _childrenNum = _children.length;

    //Check if the options.children parameter is an array.
    if(!Array.isArray(_children)) {
        uss._errorLogger(options.debugString, "the options.children parameter to be an array", _children);
        return;
    }

    //Check if the options.children parameter has at most 2 elements.
    if(_childrenNum < 1 || _childrenNum > 2) {
        uss._errorLogger(options.debugString, "the options.children parameter to have 1 or 2 elements.", _children);
        return;
    }

    //Check if the first element of the options.children parameter is a valid object.
    if(_children[0] === null || typeof _children[0] !== "object" || Array.isArray(_children[0])) {
        uss._errorLogger(options.debugString, "the elements of options.children to be objects", _children[0]);
        return;
    }

    //When the options.children of addMomentumSnapScrolling will contain only  
    //this.options.children[0], its alignment will be mandatory-start.
    _children[0].align = "start";

    //Check if the second element of the options.children parameter is a valid object.
    if(_childrenNum > 1) {
        if(_children[1] === null || typeof _children[1] !== "object" || Array.isArray(_children[1])) {
            uss._errorLogger(options.debugString, "the elements of options.children to be objects", _children[1]);
            return;
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

                //If the user scrolls in the same direction as the elastic part of
                //this scroll-animation, it won't encounter resistance. 
                if(_delta > 0) return _delta; 

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

                //If the user scrolls in the same direction as the elastic part of
                //this scroll-animation, it won't encounter resistance. 
                if(_delta < 0) return _delta; 
                
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

                //If the user scrolls in the same direction as the elastic part of
                //this scroll-animation, it won't encounter resistance. 
                if(_delta > 0) return _delta; 

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
                
                //If the user scrolls in the same direction as the elastic part of
                //this scroll-animation, it won't encounter resistance. 
                if(_delta < 0) return _delta; 

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

    const _elasticScroll = addMomentumSnapScrolling(container, options);
    _elasticScroll();
    
    return _elasticScroll; 
}

/**
 * This function adds the specified smooth scrollbars onto the passed container.
 * These scrollbars can controll the momentum scrolling of the passed container. 
 * @param {*} container An HTMLElement.
 * @param {Object} options An object which containing the scrollbar's preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if a smooth scrollbar should be added on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=false] True if a smooth scrollbar should be added on the y-axis of container, false otherwise.
 * @param {Boolean} [options.hideScrollbarX=false] True if a data-uss-scrollbar-hidden attribute should indicate (true/false) if the scrollbar on the x-axis of container 
 *                                                 is currently engaged, false otherwise.
 * @param {Boolean} [options.hideScrollbarY=false] True if a data-uss-scrollbar-hidden attribute should indicate (true/false) if the scrollbar on the y-axis of container 
 *                                                 is currently engaged, false otherwise.
 * @param {Number} [options.thumbSize=17] The default width of the scrollbar on the y-axis of container and 
 *                                        the default height of the scrollbar on the x-axis of container. 
 * @param {String} [options.transitionDurationX="0.2s"] This is the value of "transition-duration" css property of the scrollbar-thumb on the x-axis of container
 *                                                      whenever the scrollbar is not engaged, otherwise it's "0s". 
 * @param {String} [options.transitionDurationY="0.2s"] This is the value of "transition-duration" css property of the scrollbar-thumb on the y-axis of container
 *                                                      whenever the scrollbar is not engaged, otherwise it's "0s". 
 * @param {String} [options.debugString="addSmoothScrollbar"] A string internally used to log the name of the most upper level function that caused an error/warning. 
 * @returns {Array} An array containing one object for each scrollbar requested.
 *                  Each scrollbar object has this properties:
 *                  - track {HTMLElement} (public)
 *                  - thumb {HTMLElement} (public)
 *                  - pointerId {Number} (private)
 *                  - delayedScroller {Function} (private)
 *                  - updatePosition {Function} (public)
 */
export function addSmoothScrollbar(
    container,
    options = {
        onXAxis: false,
        onYAxis: false,
        hideScrollbarX: false,
        hideScrollbarY: false,
        thumbSize: 17,
        transitionDurationX: "0.2s",     
        transitionDurationY: "0.2s",      
        debugString: "addSmoothScrollbar",
    }
) {
    __testImports();

    //Check if the options parameter is a valid object.
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
        uss._errorLogger("addSmoothScrollbar", "the options parameter to be an object", options);
        return;
    }

    options.debugString = options.debugString || "addSmoothScrollbar";

    //Check if the container is a valid container.
    const _containerIsElement = container instanceof HTMLElement;
    if(!_containerIsElement) {
        uss._errorLogger(options.debugString, "the container to be an HTMLElement", container);
        return;
    }
    
    //Check if the thumb size is a finite number.
    const _scrollbarThumbSize = options.thumbSize || 17;
    if(!Number.isFinite(_scrollbarThumbSize)) {
        uss._errorLogger(options.debugString, "the options.thumbSize to be a finite number", options.thumbSize);
        return;
    }
    
    const _onXAxis = options.onXAxis;
    const _onYAxis = options.onYAxis;
    let _scrollbars = [];
    
    //Check if at least one axis was requested to be momentum-scrolled.
    if(!_onXAxis && !_onYAxis) {
        uss._warningLogger(options.debugString, "was invoked but neither onXAxis or onYAxis were set");
        return _scrollbars;
    }

    //Check if the parent node has position:static because it breaks the scrollbars positions. 
    if(container !== document.body && 
       container !== document.documentElement &&
       window.getComputedStyle(container.parentNode).position === "static"
    ) {
        uss._warningLogger(container.parentNode, "has position:static which may affect the scrollbars positioning")
    }
    
    //Any ussmoverequest is handled by the scrollbars not by the container itself.
    container.addEventListener("ussmoverequest", (event) => {
        const __newEvent = new CustomEvent(
            "ussmoverequest", 
            {
                cancelable: true,
                detail: event.detail
            }
        );
        for(const scrollbar of _scrollbars) {
            scrollbar.thumb.dispatchEvent(__newEvent);
            if(__newEvent.defaultPrevented) event.preventDefault();
        }
    }, {passive:false});

    //Modify the container overflow's styles before caching the maxScrollX/Y values.
    if(_onXAxis) container.style.overflowX = "hidden";
    if(_onYAxis) container.style.overflowY = "hidden";

    if(_onXAxis) {
        //Check if the x-axis of the passed container is actually scrollable. 
        if(uss.getMaxScrollX(container, true, options) < 1) {
            uss._errorLogger(options.debugString, "a container that can be scrolled on the x-axis", container);
            return;
        }

        const _offset = _onYAxis ? _scrollbarThumbSize : 0;
        const _scrollbar = {
            track: document.createElement("div"),
            thumb: document.createElement("div"),
            pointerId: null,
            delayedScroller: null,
        }

        //Default dataset.
        _scrollbar.track.dataset.uss = "scrollbar-track-x";
        _scrollbar.thumb.dataset.uss = "scrollbar-thumb-x";

        //Scrollbar track visibility styles.
        _scrollbar.track.style = `
            contain: style paint;
            touch-action: none;
            position: absolute;
            z-index: 1;
            bottom: 0px;
            left: 0px;
            width: calc(100% - ${_offset}px);
            height: ${_scrollbarThumbSize}px;
        `

        //Scrollbar thumb visibility styles.
        _scrollbar.thumb.style = `
            position: absolute;
            touch-action: none;
            width: 25%;
            height: 100%;
        `

        //Accessibility styles.
        _scrollbar.track.tabIndex = -1;
        _scrollbar.thumb.tabIndex = -1;
  
        //Scroll the container on a pointermove event by the correspoing amount.
        let _selfMoveRequest = false;
        const _scrollContainer = (event) => { 
            //Only one pointer at a time can control the scrollbar.
            if(_scrollbar.pointerId !== event.pointerId) return;

            const __delta = event.movementX; 
            if(__delta === 0) return; 
            
            event.preventDefault();
            event.stopPropagation();

            const __containerScrollSize = uss.getMaxScrollX(container, false, options);
            const __trackSize = _scrollbar.track.clientWidth;
            
            const __scrollMultiplier = __containerScrollSize / __trackSize * 1.3325581395348836;
            const __finalDelta = __delta * __scrollMultiplier; 

            _selfMoveRequest = true;
            _scrollbar.delayedScroller = null;

            //Synchronous call that will execute _moveScrollbar after it.
            container.dispatchEvent(
                new WheelEvent(
                    "wheel", 
                    {
                        deltaX: __finalDelta,
                        deltaY: 0,
                    }
                )
            );
        }

        //Handle a ussmoverequest event by moving the scrollbar to the correct position.
        const _moveScrollbar = (event) => {
            //The event will be handled by the other scrollbar.
            if(event.detail.axis === 1) return;

            //Check if the scroll position of the container has already been updated,
            //if not use the scroller property of this event to update it. 
            const __scrollPositionAlreadyUpdated = event.defaultPrevented;
            event.preventDefault();

            //The user is still holding down the scrollbar, 
            //this request will be handled on the pointerup event if needed. 
            if(!_selfMoveRequest && _scrollbar.pointerId !== null) {
                _scrollbar.delayedScroller = event.detail.scroller;
                return;
            }
            
            //Update the container's final positions. 
            if(!__scrollPositionAlreadyUpdated) event.detail.scroller();

            const __thumbSize = _scrollbar.thumb.clientWidth;
            const __trackSize = _scrollbar.track.clientWidth;

            let __scrolledPercentage = uss.getFinalXPosition(container, options) / uss.getMaxScrollX(container, false, options);
            __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                   __scrolledPercentage < 0 ? 0 : 
                                   __scrolledPercentage;

            const __translateAmount = __scrolledPercentage * (__trackSize - __thumbSize);
            
            _scrollbar.thumb.style.transitionDuration = _scrollbar.pointerId !== null ? "0s" : options.transitionDurationX || "0.2s";
            _scrollbar.thumb.style.transform = "translateX(" + __translateAmount + "px)";
            _selfMoveRequest = false;
        }

        const _handlePointerDownOnTrack = (event) => {
            event.preventDefault();
            event.stopPropagation();

            //Trigger this move-to-position behavior only if the user
            //is not controlling the scrollbar with a pointer.
            if(_scrollbar.pointerId !== null) return;

            //The final scroll-position of container is proportional to  
            //where the user has clicked inside the scrollbar track.
            const __currentFinalPos = uss.getFinalXPosition(container);
            const __containerScrollSize = uss.getMaxScrollX(container, false, options);
            const __trackSize = _scrollbar.track.clientWidth;
            const __finalPos = event.offsetX / __trackSize * __containerScrollSize; 

            //The scrollbar will already be in the right position, no action needed.
            if(__currentFinalPos === __finalPos) return;

            //Scroll the container to the calculated position, inform the container that
            //it's being scrolled so that any effect (snap, elastic, etc...) is applied
            //and update the scrollbar position.
            uss.scrollXTo(__finalPos, container);
            _scrollbar.updatePosition();
        }

        _scrollbarSetup(_scrollbar, _scrollContainer, _moveScrollbar, _handlePointerDownOnTrack, options.hideScrollbarX);

        //Add the scrollbar to the container.
        _scrollbar.track.appendChild(_scrollbar.thumb);
        container.insertBefore(_scrollbar.track, container.firstChild);
        
        _scrollbars.push(_scrollbar);

        uss.addOnResizeEndCallback(_scrollbar.updatePosition);
    }

    if(_onYAxis) {
        //Check if the y-axis of the passed container is actually scrollable. 
        if(uss.getMaxScrollY(container, true, options) < 1) {
            uss._errorLogger(options.debugString, "a container that can be scrolled on the y-axis", container);
            return;
        }

        const _scrollbar = {
            track: document.createElement("div"),
            thumb: document.createElement("div"),
            pointerId: null,
            delayedScroller: null,
        }
    
        //Default dataset.
        _scrollbar.track.dataset.uss = "scrollbar-track-y";
        _scrollbar.thumb.dataset.uss = "scrollbar-thumb-y";

        //Scrollbar track visibility styles.
        _scrollbar.track.style = `
            contain: style paint;
            touch-action: none;
            position: absolute;
            z-index: 1;
            top: 0px;
            right: 0px;
            width: ${_scrollbarThumbSize}px;
            height: 100%;
        `

        //Scrollbar thumb visibility styles.
        _scrollbar.thumb.style = `
            position: absolute;
            touch-action: none;
            width: 100%;
            height: 25%;
        `

        //Accessibility styles.
        _scrollbar.track.tabIndex = -1;
        _scrollbar.thumb.tabIndex = -1;
  
        //Scroll the container on a pointermove event by the correspoing amount.
        let _selfMoveRequest = false;
        const _scrollContainer = (event) => {  
            //Only one pointer at a time can control the scrollbar.
            if(_scrollbar.pointerId !== event.pointerId) return;
     
            const __delta = event.movementY; 
            if(__delta === 0) return; 

            event.preventDefault();
            event.stopPropagation();       

            const __containerScrollSize = uss.getMaxScrollY(container, false, options);
            const __trackSize = _scrollbar.track.clientHeight;
            
            const __scrollMultiplier = __containerScrollSize / __trackSize * 1.3325581395348836;
            const __finalDelta = __delta * __scrollMultiplier; 

            _selfMoveRequest = true;
            _scrollbar.delayedScroller = null;

            //Synchronous call that will execute _moveScrollbar after it.
            container.dispatchEvent(
                new WheelEvent(
                    "wheel", 
                    {
                        deltaX: 0,
                        deltaY: __finalDelta,
                    }
                )
            );
        }

        //Handle a ussmoverequest event by moving the scrollbar to the correct position.
        const _moveScrollbar = (event) => {
            //The event will be handled by the other scrollbar.
            if(event.detail.axis === 0) return;

            //Check if the scroll position of the container has already been updated,
            //if not use the scroller property of this event to update it. 
            const __scrollPositionAlreadyUpdated = event.defaultPrevented;
            event.preventDefault();

            //The user is still holding down the scrollbar, 
            //this request will be handled on the pointerup event if needed. 
            if(!_selfMoveRequest && _scrollbar.pointerId !== null) {
                _scrollbar.delayedScroller = event.detail.scroller;
                return;
            }

            //Update the container's final positions. 
            if(!__scrollPositionAlreadyUpdated) event.detail.scroller();

            const __thumbSize = _scrollbar.thumb.clientHeight;
            const __trackSize = _scrollbar.track.clientHeight;

            let __scrolledPercentage = uss.getFinalYPosition(container, options) / uss.getMaxScrollY(container, false, options);
            __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                   __scrolledPercentage < 0 ? 0 : 
                                   __scrolledPercentage;

            const __translateAmount = __scrolledPercentage * (__trackSize - __thumbSize);
            
            _scrollbar.thumb.style.transitionDuration = _scrollbar.pointerId !== null ? "0s" : options.transitionDurationY || "0.2s";
            _scrollbar.thumb.style.transform = "translateY(" + __translateAmount + "px)";
            _selfMoveRequest = false;
        }

        const _handlePointerDownOnTrack = (event) => {
            event.preventDefault();
            event.stopPropagation();

            //Trigger this move-to-position behavior only if the user
            //is not controlling the scrollbar with a pointer.
            if(_scrollbar.pointerId !== null) return;

            //The final scroll-position of container is proportional to  
            //where the user has clicked inside the scrollbar track.
            const __currentFinalPos = uss.getFinalYPosition(container);
            const __containerScrollSize = uss.getMaxScrollY(container, false, options);
            const __trackSize = _scrollbar.track.clientHeight;
            const __finalPos = event.offsetY / __trackSize * __containerScrollSize; 

            //The scrollbar will already be in the right position, no action needed.
            if(__currentFinalPos === __finalPos) return;

            //Scroll the container to the calculated position, inform the container that
            //it's being scrolled so that any effect (snap, elastic, etc...) is applied
            //and update the scrollbar position.
            uss.scrollYTo(__finalPos, container);
            _scrollbar.updatePosition();
        }

        _scrollbarSetup(_scrollbar, _scrollContainer, _moveScrollbar, _handlePointerDownOnTrack, options.hideScrollbarY);

        //Add the scrollbar to the container.
        _scrollbar.track.appendChild(_scrollbar.thumb);
        container.insertBefore(_scrollbar.track, container.firstChild);
        
        _scrollbars.push(_scrollbar);
        
        uss.addOnResizeEndCallback(_scrollbar.updatePosition);
    }

    function _scrollbarSetup(scrollbar, scrollContainer, moveScrollbar, handlePointerDownOnTrack, hideScrollbar) {
        scrollbar.updatePosition = () => {
            container.dispatchEvent(
                new WheelEvent(
                    "wheel",
                    {
                        deltaX: 0, 
                        deltaY: 0,
                    }
                )
            );
        }

        let __hideScrollbarIfNeeded = () => {};

        //Set the scrollbar status to engaged/disengaged by saving the id of
        //the pointer that is controlling it.
        const __setScrollbarEngagement = (event, id) => {
            event.preventDefault();
            event.stopPropagation();
            scrollbar.pointerId = id;
        } 

        //Disengage the scrollbar and handle any previous delayed scroll request.
        const __disengageScrollbar = (event) => {    
            //Wait for the initial pointer to leave the touch-surface.
            if(event.pointerId !== scrollbar.pointerId) return;

            __setScrollbarEngagement(event, null);  
            window.removeEventListener("pointermove", scrollContainer, {passive:false});     
            window.removeEventListener("pointerup", __disengageScrollbar, {passive:false});   

            //Handle any delayed scroll request if any.
            if(scrollbar.delayedScroller) {
                scrollbar.delayedScroller();
                scrollbar.updatePosition();
            }
            __hideScrollbarIfNeeded();
        }

        //If the user clicks the scrollbar track, the container should be scrolled to
        //the corresponding position and the scrollbar thumb should be moved accordingly.
        scrollbar.track.addEventListener("pointerdown", handlePointerDownOnTrack, {passive:false});

        //Engage the scrollbar.
        scrollbar.thumb.addEventListener("pointerdown", (event) => {
            //Only one pointer at a time can control the scrollbar.
            if(scrollbar.pointerId !== null) return;
        
            __setScrollbarEngagement(event, event.pointerId);     
            window.addEventListener("pointerup", __disengageScrollbar, {passive:false});
            window.addEventListener("pointermove", scrollContainer, {passive:false});   
        }, {passive:false});
        
        //Make the scrollbar listen for events that makes it move.
        scrollbar.thumb.addEventListener("ussmoverequest", moveScrollbar, {passive:false});

        //If requested, keep track of the scrollbar's hidden status.
        if(hideScrollbar) {
            let __pointerIsHoveringTrack = false;
            
            //The scrollbar's status is never set to hidden if the pointer is on it.
            scrollbar.track.addEventListener("pointerenter", () => {
                __pointerIsHoveringTrack = true;
                if(scrollbar.pointerId !== null) return;
                scrollbar.track.dataset.ussScrollbarHidden = false; 
            }, {passive:true});
            
            //The scrollbar's status is set to hidden if the pointer  
            //is not hovering it and the scrollbar thumb isn't being used.
            scrollbar.track.addEventListener("pointerleave", () => {
                __pointerIsHoveringTrack = false;
                if(scrollbar.pointerId !== null) return;
                scrollbar.thumb.style.transitionDuration = "";
                scrollbar.track.dataset.ussScrollbarHidden = true; 
            }, {passive:true});
            
            //Whenever the scrollbar is disengaged, check if  
            //its status should be set to hidden.
            __hideScrollbarIfNeeded = () => {
                if(__pointerIsHoveringTrack) return;
                scrollbar.thumb.style.transitionDuration = "";
                scrollbar.track.dataset.ussScrollbarHidden = true; 
            }

            //The scrollbar is initially hidden.
            scrollbar.track.dataset.ussScrollbarHidden = true; 
        }
    }

    return _scrollbars;
}