const DEFAULTXSTEPLENGTH = window.innerWidth  * 50 / 1920; //Default number of pixels scrolled in a single scroll-animation's step on the x-axis: 50px steps for a 1920px screen width.
const DEFAULTYSTEPLENGTH = window.innerHeight * 50 / 937;  //Default number of pixels scrolled in a single scroll-animation's step on the y-axis: 50px steps for a 937px(1080px - urlbar) screen height.
const DEFAULTMINANIMATIONFRAMES = 5;                       //Default lowest possible number of frames any scroll-animation should last.
const DEFAULTSCROLLCALCULATORTESTVALUE = 100;              //Default number of pixel scrolled when testing a newScrollCalculator.

/*
 * _xMapContainerAnimationID: Map(Container, Array[idNumber]), a map in which:
 *                            1) The keys are the containers on which a scroll-animation on the x-axis has been requested.
 *                            2) The values are arrays of IDs.
 *                               This IDs are provided by the requestAnimationFrame() calls and are internally used to
 *                               keep track of the next scroll-animation's _stepX() function call and also by the stopScrollingX() function.
 * _yMapContainerAnimationID: Map(Container, Array[idNumber]), a map in which:
 *                            1) The keys are the containers on which a scroll-animation on the y-axis has been requested.
 *                            2) The values are arrays of IDs.
 *                               This IDs are provided by the requestAnimationFrame() calls and are internally used to
 *                               keep track of the next scroll-animation's _stepY() function call and also by the stopScrollingY() function.
 * _xStepLengthCalculator: Map(Container, stepCalculatorFunction), a map in which:
 *                         1) The keys are the container on which a scroll-animation on the x-axis has been requested.
 *                         2) The values are user-defined ease functions that will return the length of each individual step of a scroll-animation on the x-axis.
 * _yStepLengthCalculator: Map(Container, stepCalculatorFunction), a map in which:
 *                         1) The keys are the container on which a scroll-animation on the y-axis has been requested.
 *                         2) The values are user-defined ease functions that will return the length of each individual step of a scroll-animation on the y-axis.
 * _xStepLength: number, the number of pixels scrolled on the x-axis in a single scroll-animation's step.
 * _yStepLength: number, the number of pixels scrolled on the y-axis in a single scroll-animation's step.
 * _minAnimationFrame: number, the minimum number of frames any scroll-animation, on any axis, should last.
 * _reducedMotion: boolean, true if the user has enabled any "reduce-motion" setting devicewise, false otherwise.
 *                 Internally used to follow the user's accessibility settings reverting back to the browser's default jump behavior.
 *
 * isXscrolling: function, returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
 * isYscrolling: function, returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
 * isScrolling:  function, returns true if a scroll-animation on any axis of the passed container is currently being performed by this API, false otherwise.
 * getXStepLengthCalculator: function, returns the _xStepLengthCalculator ease function for the passed container.
 * getYStepLengthCalculator: function, returns the _yStepLengthCalculator ease function for the passed container.
 * getXStepLength: function, returns the value of _xStepLength.
 * getYStepLength: function, returns the value of _yStepLength.
 * getMinAnimationFrame: function, returns the value of _minAnimationFrame.
 * getReducedMotionState: function, returns the value of _reducedMotion.
 * setXStepLengthCalculator: function, sets the _xStepLengthCalculator for the requested container to the passed ease function if compatible.
 * setYStepLengthCalculator: function, sets the _yStepLengthCalculator for the requested container to the passed ease function if compatible.
 * setStepLengthCalculator: function, sets both the _xStepLengthCalculator and the _yStepLengthCalculator for the requested container to the passed ease function if compatible.
 * setXStepLength: function, sets the _xStepLength to the passed value if compatible.
 * setYStepLength: function, sets the _yStepLength to the passed value if compatible.
 * setStepLength: function, sets both the _xStepLength and the _yStepLength to the passed value if compatible.
 * setMinAnimationFrame: function, sets the _minAnimationFrame to the passed value if compatible.
 * calcXStepLength: function, takes in the remaning scroll amount of a scroll-animation on the x-axis and
 *                  returns how long each animation-step must be in order to target the _minAnimationFrame.
 * calcYStepLength: function, takes in the remaning scroll amount of a scroll-animation on the y-axis and
 *                  returns how long each animation-step must be in order to target the _minAnimationFrame.
 * getScrollXCalculator: function, takes in a container and returns a function that returns:
 *                       1) The scrollLeft property of the container if it's an instance of HTMLelement.
 *                       2) The scrollX property of the container if it's the window element.
 * getScrollYCalculator: function, takes in a container and returns a function that returns:
 *                       1) The scrollTop property of the container if it's an instance of HTMLelement.
 *                       2) The scrollY property of the container if it's the window element.
 * getMaxScrollX: function, takes in a scroll container and returns its highest scroll-reachable x-value.
 * getMaxScrollY: function, takes in a scroll container and returns its highest scroll-reachable y-value.
 * getScrollableParent: function, returns the first scrollable container of the passed element, works with "overflow('',X,Y): hidden" if specified.
 * scrollXTo: function, takes in a number which indicates the position that the passed container's "scrollX" (the left border's x-coordinate)
 *            has to reach and performs a scroll-animation on the x-axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollYTo: function, takes in a number which indicates the position that the passed container's "scrollY" (the top border's y-coordinate)
 *            has to reach and performs a scroll-animation on the y-axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollXBy: function, takes in a number which indicates the number of pixels on the x-axis that the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollYBy: function, takes in a number which indicates the number of pixels on the y-axis that the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollTo: function, takes in 2 numbers which respectively indicate the position that the passed container's "scrollX" (the left border's x-coordinate) and "scrollY" (the top border's y-coordinate)
 *           have to reach and performs 2 scroll-animations on both the x-axis and the y-axis.
 *           After the scroll-animations have finished a callback function can be invoked.
 * scrollBy: function, takes in 2 numbers which respectively indicate the number of pixels on the x-axis and the y-axis that the passed container has to be scrolled by and
 *           performs 2 scroll-animations on both the x-axis and the y-axis.
 *           After the scroll-animations have finished a callback function can be invoked.
 * scrollIntoView: function, scrolls the window and if necessary the container of the passed element in order to make it visible on the screen.
 *                 There are 3 possible allignments for both the passed element and it's closest scollable container: top, bottom, center.
 *                 The allignments can be changed by passing different values of alignToTop and alignToLeft.
 *                 Works with "overflow('',X,Y): hidden" if specified.
 *                 After the scroll-animations have finished a callback function can be invoked.
 * stopScrollingX: function, stops all the current scroll-animation on the x-axis of the passed container.
 *                 After the animation has finished a callback function can be invoked.
 * stopScrollingY: function, stops all the current scroll-animation on the y-axis of the passed container.
 *                 After the animation has finished a callback function can be invoked.
 * stopScrolling: function, stops all the current scroll-animation on both the x-axis and the y-axis of the passed container.
 *                After the animation has finished a callback function can be invoked.
 * hrefSetup: function, looks for every anchor element  (<a> && <area>) with a value for the href attribute linked to an element on the same page and
 *            attaches an eventListener(onclick) to it in order to trigger a smooth scroll-animation
 *            to reach the linked element (internally uses scrollIntoView).
 *            Before the scroll-animations are performed an init function can be invoked.
 *            After the scroll-animations have finished a callback function can be invoked.
 */
var uss = {
  _xMapContainerAnimationID: new Map(),
  _yMapContainerAnimationID: new Map(),
  _xStepLengthCalculator: new Map(),
  _yStepLengthCalculator: new Map(),
  _xStepLength: DEFAULTXSTEPLENGTH,
  _yStepLength: DEFAULTYSTEPLENGTH,
  _minAnimationFrame: DEFAULTMINANIMATIONFRAMES,
  _reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches,
  isXscrolling: function (container = window) {const _scheduledAnimations = uss._xMapContainerAnimationID.get(container); return typeof _scheduledAnimations !== "undefined" && _scheduledAnimations.length > 0;},
  isYscrolling: function (container = window) {const _scheduledAnimations = uss._yMapContainerAnimationID.get(container); return typeof _scheduledAnimations !== "undefined" && _scheduledAnimations.length > 0;},
  isScrolling:  function (container = window) {return uss.isXscrolling(container) || uss.isYscrolling(container);},
  getXStepLengthCalculator: function (container = window) {return uss._xStepLengthCalculator.get(container);},
  getYStepLengthCalculator: function (container = window) {return uss._yStepLengthCalculator.get(container);},
  getXStepLength: function () {return uss._xStepLength;},
  getYStepLength: function () {return uss._yStepLength;},
  getMinAnimationFrame: function () {return uss._minAnimationFrame;},
  getReducedMotionState: function () {return uss._reducedMotion;},
  setXStepLengthCalculator: function (newCalculator = undefined, container = window) {
    if(typeof newCalculator !== "function") {console.error("USS Error:", newCalculator, "is not a function"); return;}
    const _testValue = DEFAULTSCROLLCALCULATORTESTVALUE;
    const _testResult = newCalculator(_testValue, 0, _testValue, 0, _testValue, container); //remaningScrollAmount, timestamp, totalScrollAmount, currentXPosition, finalXPosition, container
    if(Number.isFinite(_testResult)) {uss._xStepLengthCalculator.set(container, newCalculator); return;}
    console.error("USS Error:", newCalculator.name || "Anonymous function", "didn't return a valid step value");
  },
  setYStepLengthCalculator: function (newCalculator = undefined, container = window) {
    if(typeof newCalculator !== "function") {console.error("USS Error:", newCalculator, "is not a function"); return;}
    const _testValue = DEFAULTSCROLLCALCULATORTESTVALUE;
    const _testResult = newCalculator(_testValue, 0, _testValue, 0, _testValue, container); //remaningScrollAmount, timestamp, totalScrollAmount, currentYPosition, finalYPosition, container
    if(Number.isFinite(_testResult)) {uss._yStepLengthCalculator.set(container, newCalculator); return;}
    console.error("USS Error:", newCalculator.name || "Anonymous function", "didn't return a valid step value");
  },
  setStepLengthCalculator: function (newCalculator = undefined, container = window) {
    if(typeof newCalculator !== "function") {console.error("USS Error:", newCalculator, "is not a function"); return;}
    const _testValue = DEFAULTSCROLLCALCULATORTESTVALUE;
    const _testResult = newCalculator(_testValue, 0, _testValue, 0, _testValue, container); //remaningScrollAmount, timestamp, totalScrollAmount, currentPosition, finalPosition, container
    if(Number.isFinite(_testResult)) {
      uss._xStepLengthCalculator.set(container, newCalculator);
      uss._yStepLengthCalculator.set(container, newCalculator);
      return;
    }
    console.error("USS Error:", newCalculator.name || "Anonymous function", "didn't return a valid step value");
  },
  setXStepLength: function (newXStepLength) {
    if(!Number.isFinite(newXStepLength)) {console.error("USS Error:", newXStepLength, "is not a number"); return;}
    if(newXStepLength <= 0) {console.error("USS Error:", newXStepLength, "must be a positive number"); return;}
    uss._xStepLength = newXStepLength;
  },
  setYStepLength: function (newYStepLength) {
    if(!Number.isFinite(newYStepLength)) {console.error("USS Error:", newYStepLength, "is not a number"); return;}
    if(newYStepLength <= 0) {console.error("USS Error:", newYStepLength, "must be a positive number"); return;}
    uss._yStepLength = newYStepLength;
  },
  setStepLength: function (newStepLength) {
    if(!Number.isFinite(newStepLength)) {console.error("USS Error:", newStepLength, "is not a number"); return;}
    if(newStepLength <= 0) {console.error("USS Error:", newStepLength, "must be a positive number"); return;}
    uss._xStepLength = newStepLength;
    uss._yStepLength = newStepLength;
  },
  setMinAnimationFrame: function (newMinAnimationFrame) {
    if(!Number.isFinite(newMinAnimationFrame)) {console.error("USS Error:", newMinAnimationFrame, "is not a number"); return;}
    if(newMinAnimationFrame <= 0) {console.error("USS Error:", newMinAnimationFrame, "must be a positive number"); return;}
    uss._minAnimationFrame = newMinAnimationFrame;
  },
  calcXStepLength: function (deltaX) {return (deltaX >= (uss._minAnimationFrame - 1) * uss._xStepLength) ? uss._xStepLength : Math.round(deltaX / uss._minAnimationFrame);},
  calcYStepLength: function (deltaY) {return (deltaY >= (uss._minAnimationFrame - 1) * uss._yStepLength) ? uss._yStepLength : Math.round(deltaY / uss._minAnimationFrame);},
  getScrollXCalculator: function (container = window) {
    return (container === window)             ? () => {return container.scrollX;}    :
           (container instanceof HTMLElement) ? () => {return container.scrollLeft;} :
           () => {
             console.error("USS Error: cannot determine the ScrollXCalculator of", container, "because it's neither an HTMLElement nor the window");
             throw "USS error";
          };
  },
  getScrollYCalculator: function (container = window) {
    return (container === window)             ? () => {return container.scrollY;}    :
           (container instanceof HTMLElement) ? () => {return container.scrollTop;}  :
           () => {
             console.error("USS Error: cannot determine the ScrollYCalculator of", container, "because it's neither an HTMLElement nor the window");
             throw "USS error";
           };
  },
  getMaxScrollX: function (container = window) {
    const _html = document.documentElement;
    const _body = document.body;
    return (container instanceof HTMLElement) ?
      container.scrollWidth - container.clientWidth :
      Math.max(
        _body.scrollWidth,
        _body.offsetWidth,
        _body.clientWidth,
        _html.clientWidth,
        _html.scrollWidth,
        _html.offsetWidth
      ) - _html.clientWidth; //Subtract document width because the scroll-animations on the x-axis always starts from the left of the container
  },
  getMaxScrollY: function (container = window) {
    const _html = document.documentElement;
    const _body = document.body;
    return (container instanceof HTMLElement) ?
      container.scrollHeight - container.clientHeight :
      Math.max(
        _body.scrollHeight,
        _body.offsetHeight,
        _body.clientHeight,
        _html.clientHeight,
        _html.scrollHeight,
        _html.offsetHeight
      ) - _html.clientHeight; //Subtract document height because the scroll-animations on the y-axis always starts from the top of the container
  },
  getScrollableParent: function (element = window, includeHidden = false) {
    if(element === window) return window;
    try {
      let _style = getComputedStyle(element);
      if(_style.position === "fixed") return window;
      const _excludeStaticParent = _style.position === "absolute";
      const _overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

      let _container;
      for(_container = element; (_container = _container.parentElement);) {
          _style = getComputedStyle(_container);
          if(_excludeStaticParent && _style.position === "static") continue;
          if(_overflowRegex.test(_style.overflow + _style.overflowY + _style.overflowX))
            if(_container.scrollWidth > _container.clientWidth || _container.scrollHeight > _container.clientHeight)
              return _container;
      }
      return window;
    } catch(e) {console.error("USS Error: Couldn't get the parent container of the element", element); return window;}
  },
  scrollXTo: function (finalXPosition, container = window, callback = () => {}, canOverlay = false) {
    if(!Number.isFinite(finalXPosition)) {console.error("USS Error:", finalXPosition, "is not a number"); return;}

    //If the container cannot be scrolled on the x-axis, _maxScrollX will be <= 0 and the function returns.
    //If the final position has already been reached, no scroll-animation is performed.
    const _maxScrollX = uss.getMaxScrollX(container);
    if(_maxScrollX <= 0) {if(typeof callback === "function") window.setTimeout(callback, 0); return;}
    if(finalXPosition < 0) finalXPosition = 0;

    const _scrollXCalculator = uss.getScrollXCalculator(container);
    const _scrollYCalculator = uss.getScrollYCalculator(container);
    let _totalScrollAmount = finalXPosition - _scrollXCalculator();
    const _direction = _totalScrollAmount > 0 ? 1 : -1;
    _totalScrollAmount *= _direction;
    if(_totalScrollAmount <= 0) {if(typeof callback === "function") window.setTimeout(callback, 0); return;}

    //If user prefers reduced motion
    //the API rolls back to the default "jump" behavior
    if(uss._reducedMotion) {
      container.scroll(finalXPosition, _scrollYCalculator());
      if(typeof callback === "function") window.setTimeout(callback, 0);
      return;
    }

    const _scrollStepLength = uss.calcXStepLength(_totalScrollAmount); //Default value for the step length

    //If one or more scroll-animation on the x-axis of the passed component have already been scheduled
    //and the requested scroll-animation cannot be overlayed,
    //all the already-scheduled ones are cancelled in order to make the new one play.
    if(canOverlay === false) uss.stopScrollingX(container, null);

    let _scheduledAnimations = uss._xMapContainerAnimationID.get(container);  //List of already scheduled scroll-animations' IDs
    if(typeof _scheduledAnimations === "undefined") _scheduledAnimations = [];
    _scheduledAnimations.push(window.requestAnimationFrame(_stepX));
    uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
    const _stepCalculator = uss._xStepLengthCalculator.get(container);
    const _usesCustomStepCalculator = typeof _stepCalculator === "function";

    function _stepX(timestamp) {
      _scheduledAnimations = uss._xMapContainerAnimationID.get(container);
      _scheduledAnimations.shift(); //The first _stepX to be executed is the first one which set an id

      const _currentXPosition = _scrollXCalculator();
      const _remaningScrollAmount = (finalXPosition - _currentXPosition) * _direction;
      if(_remaningScrollAmount <= 0) {
        uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") window.setTimeout(callback, 0);
        return;
      }

      let _calculatedScrollStepLength;
      if(_usesCustomStepCalculator) {
        _calculatedScrollStepLength = _stepCalculator(_remaningScrollAmount, timestamp, _totalScrollAmount, _currentXPosition, finalXPosition, container);
        if(!Number.isFinite(_calculatedScrollStepLength) || _calculatedScrollStepLength < 0) _calculatedScrollStepLength = _scrollStepLength;
      } else _calculatedScrollStepLength = _scrollStepLength;

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        container.scroll(finalXPosition, _scrollYCalculator());
        uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") window.setTimeout(callback, 0);
        return;
      }

      container.scroll(_currentXPosition + _calculatedScrollStepLength * _direction, _scrollYCalculator());

      if(_currentXPosition === _scrollXCalculator()) { //The finalXPosition was beyond the scroll limit of the container
        uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") window.setTimeout(callback, 0);
        return;
      }

      _scheduledAnimations.push(window.requestAnimationFrame(_stepX));
      uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
    }
  },
  scrollYTo: function (finalYPosition, container = window, callback = () => {}, canOverlay = false) {
    if(!Number.isFinite(finalYPosition)) {console.error("USS Error:", finalYPosition, "is not a number"); return;}

    //If the container cannot be scrolled on the y-axis, _maxScrollY will be <= 0 and the function returns.
    //If the final position has already been reached, no scroll-animation is performed.
    const _maxScrollY = uss.getMaxScrollY(container);
    if(_maxScrollY <= 0) {if(typeof callback === "function") window.setTimeout(callback, 0); return;}
    if(finalYPosition < 0) finalYPosition = 0;

    const _scrollXCalculator = uss.getScrollXCalculator(container);
    const _scrollYCalculator = uss.getScrollYCalculator(container);
    let _totalScrollAmount = finalYPosition - _scrollYCalculator();
    const _direction = _totalScrollAmount > 0 ? 1 : -1;
    _totalScrollAmount *= _direction;
    if(_totalScrollAmount <= 0) {if(typeof callback === "function") window.setTimeout(callback, 0); return;}

    //If user prefers reduced motion
    //the API rolls back to the default "jump" behavior
    if(uss._reducedMotion) {
      container.scroll(_scrollXCalculator(), finalYPosition);
      if(typeof callback === "function") window.setTimeout(callback, 0);
      return;
    }

    const _scrollStepLength = uss.calcYStepLength(_totalScrollAmount); //Default value for the step length

    //If one or more scroll-animation on the y-axis of the passed component have already been scheduled
    //and the requested scroll-animation cannot be overlayed,
    //all the already-scheduled ones are cancelled in order to make the new one play.
    if(canOverlay === false) uss.stopScrollingY(container, null);

    let _scheduledAnimations = uss._yMapContainerAnimationID.get(container);  //List of already scheduled scroll-animations' IDs
    if(typeof _scheduledAnimations === "undefined") _scheduledAnimations = [];
    _scheduledAnimations.push(window.requestAnimationFrame(_stepY));
    uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
    const _stepCalculator = uss._yStepLengthCalculator.get(container);
    const _usesCustomStepCalculator = typeof _stepCalculator === "function";

    function _stepY(timestamp) {
      _scheduledAnimations = uss._yMapContainerAnimationID.get(container);
      _scheduledAnimations.shift(); //The first _stepY to be executed is the first one which set an id

      const _currentYPosition = _scrollYCalculator();
      const _remaningScrollAmount = (finalYPosition - _currentYPosition) * _direction;
      if(_remaningScrollAmount <= 0) {
        uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") window.setTimeout(callback, 0);
        return;
      }

      let _calculatedScrollStepLength;
      if(_usesCustomStepCalculator) {
        _calculatedScrollStepLength = _stepCalculator(_remaningScrollAmount, timestamp, _totalScrollAmount, _currentYPosition, finalYPosition, container);
        if(!Number.isFinite(_calculatedScrollStepLength) || _calculatedScrollStepLength < 0) _calculatedScrollStepLength = _scrollStepLength;
      } else _calculatedScrollStepLength = _scrollStepLength;

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        container.scroll(_scrollXCalculator(), finalYPosition);
        uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") window.setTimeout(callback, 0);
        return;
      }

      container.scroll(_scrollXCalculator(), _currentYPosition + _calculatedScrollStepLength * _direction);

      if(_currentYPosition === _scrollYCalculator()) { //The finalYPosition was beyond the scroll limit of the container
        uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") window.setTimeout(callback, 0);
        return;
      }

      _scheduledAnimations.push(window.requestAnimationFrame(_stepY));
      uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
    }
  },
  scrollXBy: function (deltaX, container = window, callback = () => {}, canOverlay = false) {
    if(!Number.isFinite(deltaX)) {console.error("USS Error:", deltaX, "is not a number"); return;}
    if(deltaX === 0) {if(typeof callback === "function") window.setTimeout(callback, 0); return;}
    uss.scrollXTo(uss.getScrollXCalculator(container)() + deltaX, container, callback, canOverlay);
  },
  scrollYBy: function (deltaY, container = window, callback = () => {}, canOverlay = false) {
    if(!Number.isFinite(deltaY)) {console.error("USS Error:", deltaY, "is not a number"); return;}
    if(deltaY === 0) {if(typeof callback === "function") window.setTimeout(callback, 0); return;}
    uss.scrollYTo(uss.getScrollYCalculator(container)() + deltaY, container, callback, canOverlay);
  },
  scrollTo: function (finalXPosition, finalYPosition, container = window, callback = () => {}, canOverlay = false) {
    //This object is used to make sure that the passed callback function is called only
    //once all the scroll-animations for the passed container have been performed
    let _callback = {
      __requiredSteps: 1, //Number of the _callback.__function's calls required to trigger the passed scrollTo's callback function
      __currentSteps: 0,  //Number of the current _callback.__function's calls
      __function: (typeof callback === "function") ? () => {
        if(_callback.__currentSteps < _callback.__requiredSteps) {
          _callback.__currentSteps++;
          return;
        }
        callback();
      } : null //No action if no valid scrollTo's callback function is passed
    };

    uss.scrollXTo(finalXPosition, container, _callback.__function, canOverlay);
    uss.scrollYTo(finalYPosition, container, _callback.__function, canOverlay);
  },
  scrollBy: function (deltaX, deltaY, container = window, callback = () => {}, canOverlay = false) {
    if(!Number.isFinite(deltaX)) {console.error("USS Error:", deltaX, "is not a number"); return;}
    if(!Number.isFinite(deltaY)) {console.error("USS Error:", deltaY, "is not a number"); return;}
    if(deltaX === 0 && deltaY === 0) {if(typeof callback === "function") window.setTimeout(callback, 0); return;}
    if(deltaX === 0) {uss.scrollYBy(deltaY, container, callback, canOverlay); return;}
    if(deltaY === 0) {uss.scrollXBy(deltaX, container, callback, canOverlay); return;}
    uss.scrollTo(uss.getScrollXCalculator(container)() + deltaX, uss.getScrollYCalculator(container)() + deltaY, container, callback, canOverlay);
  },
  scrollIntoView: function (element = window, alignToLeft = true, alignToTop = true, callback = () => {}, includeHidden = false) {
    if(element === window) return;
    if(!(element instanceof HTMLElement)) {console.error("USS Error:", element, "is not an HTML element"); return;}

    const _container = uss.getScrollableParent(element, includeHidden); //First scrollable parent of the passed element

    const _elementRect = element.getBoundingClientRect();
    let _containerRect = (_container !== window) ? _container.getBoundingClientRect() : {left: 0, top: 0, width: window.innerWidth, height: window.innerHeight};

    const _elementCurrentX = _elementRect.left - _containerRect.left; //Element's x-coordinate relative to it's container
    const _elementCurrentY = _elementRect.top  - _containerRect.top;  //Element's y-coordinate relative to it's container
    const _elementFinalX   = (alignToLeft === true) ? 0 : (alignToLeft === false) ? _containerRect.width  - _elementRect.width    : 0.5 * (_containerRect.width  - _elementRect.width);
    const _elementFinalY   = (alignToTop  === true) ? 0 : (alignToTop  === false) ? _containerRect.height - _elementRect.height   : 0.5 * (_containerRect.height - _elementRect.height);

    //This object is used to make sure that the passed callback function is called only
    //once all the scroll-animations have been performed
    let _callback = {
      __requiredSteps: 0, //Number of the _callback.__function's calls altready made required to trigger the passed scrollIntoView's callback function
      __currentSteps: 0,  //Number of the current _callback.__function's calls
      __function: (typeof callback === "function") ? () => {
        if(_callback.__currentSteps < _callback.__requiredSteps) {
          _callback.__currentSteps++;
          return;
        }
        callback();
      } : () => {} //No action if no valid scrollIntoView's callback function is passed
    }

    window.setTimeout(() => {uss.scrollBy(_elementCurrentX - _elementFinalX, _elementCurrentY - _elementFinalY, _container, _callback.__function)}, 0);
    if(_container === window) return;

    let _containerCurrentX = _containerRect.left;
    let _containerCurrentY = _containerRect.top;
    const _containerFinalX = (alignToLeft === true) ? 0 : (alignToLeft === false) ? window.innerWidth  - _containerRect.width  : 0.5 * (window.innerWidth  - _containerRect.width);
    const _containerFinalY = (alignToTop  === true) ? 0 : (alignToTop  === false) ? window.innerHeight - _containerRect.height : 0.5 * (window.innerHeight - _containerRect.height);

    let _deltaX = _containerCurrentX - _containerFinalX; //Passed element container's remaning scroll amount on the x-axis
    let _deltaY = _containerCurrentY - _containerFinalY; //Passed element container's remaning scroll amount on the y-axis

    const _directionX = _deltaX > 0 ? 1 : -1;
    const _directionY = _deltaY > 0 ? 1 : -1;

    let _containerParent = uss.getScrollableParent(_container, includeHidden); //First scrollable parent of the passed element's container

    _callback.__requiredSteps++;
    window.setTimeout(_scrollParents, 0);

    function _scrollParents() {
      uss.scrollBy(_deltaX, _deltaY, _containerParent, () => {
        //We won't be able to scroll any further even if we wanted
        if(_containerParent === window) {
          element.focus();
          _callback.__function();
          return;
        }

        //Recalculate the passed element container's current position
        _containerRect = _container.getBoundingClientRect();
        _containerCurrentX = _containerRect.left;
        _containerCurrentY = _containerRect.top;

        //Recalculate the remaning scroll amounts
        _deltaX = _containerCurrentX - _containerFinalX;
        _deltaY = _containerCurrentY - _containerFinalY;

        if(_deltaX * _directionX > 0 || _deltaY * _directionY > 0) {
          _containerParent = uss.getScrollableParent(_containerParent, includeHidden);
          window.setTimeout(_scrollParents, 0);
          return;
        }

        element.focus();
        _callback.__function();
      });
    }
  },
  stopScrollingX: function (container = window, callback = () => {}) {
    let _scheduledAnimations = uss._xMapContainerAnimationID.get(container);
    if(typeof _scheduledAnimations === "undefined" || _scheduledAnimations.length === 0) {
      if(typeof callback === "function") window.setTimeout(callback, 0);
      return;
    }
    for(let __animationID of _scheduledAnimations) window.cancelAnimationFrame(__animationID);
    uss._xMapContainerAnimationID.set(container, []);
    if(typeof callback === "function") window.setTimeout(callback, 0);
  },
  stopScrollingY: function (container = window, callback = () => {}) {
    let _scheduledAnimations = uss._yMapContainerAnimationID.get(container);
    if(typeof _scheduledAnimations === "undefined" || _scheduledAnimations.length === 0) {
      if(typeof callback === "function") window.setTimeout(callback, 0);
      return;
    }
    for(let __animationID of _scheduledAnimations) window.cancelAnimationFrame(__animationID);
    uss._yMapContainerAnimationID.set(container, []);
    if(typeof callback === "function") window.setTimeout(callback, 0);
  },
  stopScrolling: function (container = window, callback = () => {}) {
    uss.stopScrollingX(container, null);
    uss.stopScrollingY(container, callback);
  },
  hrefSetup: function (alignToLeft = true, alignToTop = true, init = () => {}, callback = () => {}, includeHidden = false) {
    const _init = (typeof init === "function") ? init : () => {};
    const _pageLinks = document.links;
    const _pageURL = document.URL.split("#")[0];

    for(_pageLink of _pageLinks) {
      const _pageLinkParts = _pageLink.href.split("#"); //PageLink.href = OptionalURL#Section
      if(_pageLinkParts[0] !== _pageURL) continue;
      const _elementToReach = document.getElementById(_pageLinkParts[1]);
      if(_elementToReach === null) {console.warn("USS Error:", _pageLink, "doesn't have a valid destination element"); continue;}

      _pageLink.addEventListener("click", event => {
        event.preventDefault();
        _init(_pageLink, _elementToReach);
        uss.scrollIntoView(_elementToReach, alignToLeft, alignToTop, callback, includeHidden);
      }, {passive:false});
    }
  }
}


window.matchMedia("(prefers-reduced-motion)").addEventListener("change", () => uss._reducedMotion = !uss._reducedMotion);
