const INITIAL_WINDOW_HEIGHT = window.innerHeight;                //The window's inner height when first loaded
const INITIAL_WINDOW_WIDTH = window.innerWidth;                  //The window's inner width when first loaded
const DEFAULT_XSTEP_LENGTH = INITIAL_WINDOW_HEIGHT  * 50 / 1920; //Default number of pixels scrolled in a single scroll-animation's step on the x-axis: 50px steps for a 1920px screen width.
const DEFAULT_YSTEP_LENGTH = INITIAL_WINDOW_WIDTH * 50 / 937;    //Default number of pixels scrolled in a single scroll-animation's step on the y-axis: 50px steps for a 937px(1080px - urlbar) screen height.
const DEFAULT_MIN_ANIMATION_FRAMES = 5;                          //Default lowest possible number of frames any scroll-animation should last.
const DEFAULT_SCROLL_CALCULATOR_TEST_VALUE = 100;                //Default number of pixel scrolled when testing a newScrollCalculator.

/*
 * _containersData: Map(Container, Array[]), a map in which:
 *                  1) A key is a DOM element internally called "container".
 *                  2) A value is an array with 14 values, which are:
 *                     [0] contains the ID of a requested scroll-animation on the x-axis provided by the requestAnimationFrame() method.
 *                         null if no scroll-animations on the x-axis are currently being performed.
 *                     [1] contains the ID of a requested scroll-animation on the y-axis provided by the requestAnimationFrame() method.
 *                         null if no scroll-animations on the y-axis are currently being performed.
 *                     [2] contains the position in pixel at which the container will be at the end of the scroll-animation on the x-axis.
 *                     [3] contains the position in pixel at which the container will be at the end of the scroll-animation on the y-axis.
 *                     [4] contains the direction of the current scroll-animation on the x-axis.
 *                         1 if the elements inside the container will go from right to left because of the scrolling, -1 otherwise.
 *                     [5] contains the direction of the current scroll-animation on the y-axis.
 *                         1 if the elements inside the container will go from bottom to top because of the scrolling, -1 otherwise.
 *                     [6] contains the total amount of pixels that have to be scrolled from the start of the current scroll-animation on the x-axis to its end.
 *                     [7] contains the total amount of pixels that have to be scrolled from the start of the current scroll-animation on the y-axis to its end.
 *                     [8] contains the starting time in milliseconds (DOMHighResTimeStamp) of the current scroll-animation on the x-axis.
 *                     [9] contains the starting time in milliseconds (DOMHighResTimeStamp) of the current scroll-animation on the y-axis.
 *                     [10] contains a callback function that will be executed when the current scroll-animation on the x-axis has been performed.
 *                     [11] contains a callback function that will be executed when the current scroll-animation on the y-axis has been performed.
 *                     [12] contains a user-defined ease functions that will return the length of each individual step of a scroll-animation on the x-axis.
 *                     [13] contains a user-defined ease functions that will return the length of each individual step of a scroll-animation on the y-axis.
 * _xStepLength: number, the number of pixels scrolled on the x-axis in a single scroll-animation's step.
 * _yStepLength: number, the number of pixels scrolled on the y-axis in a single scroll-animation's step.
 * _minAnimationFrame: number, the minimum number of frames any scroll-animation, on any axis, should last.
 * _windowHeight: number, the current window's inner heigth in pixels.
 * _windowWidth: number, the current window's inner width in pixels.
 * _reducedMotion: boolean, true if the user has enabled any "reduce-motion" setting devicewise, false otherwise.
 *                 Internally used to follow the user's accessibility settings reverting back to the browser's default jump behavior.
 *
 * isXscrolling: function, returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
 * isYscrolling: function, returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
 * isScrolling:  function, returns true if a scroll-animation on any axis of the passed container is currently being performed by this API, false otherwise.
 * getXStepLengthCalculator: function, returns the current ease function used by the passed container.
 * getYStepLengthCalculator: function, returns the current ease function used by the passed container.
 * getXStepLength: function, returns the value of _xStepLength.
 * getYStepLength: function, returns the value of _yStepLength.
 * getMinAnimationFrame: function, returns the value of _minAnimationFrame.
 * getWindowHeight: function, returns the value of _windowHeight.
 * getWindowWidth: function, returns the value of _windowWidth.
 * getReducedMotionState: function, returns the value of _reducedMotion.
 * setXStepLengthCalculator: function, sets the ease function for the requested container to the passed function if compatible.
 * setYStepLengthCalculator: function, sets the ease function for the requested container to the passed function if compatible.
 * setStepLengthCalculator: function, sets both the  for the requested container to the passed ease function if compatible.
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
  _containersData: new Map(),
  _xStepLength: DEFAULT_XSTEP_LENGTH,
  _yStepLength: DEFAULT_YSTEP_LENGTH,
  _minAnimationFrame: DEFAULT_MIN_ANIMATION_FRAMES,
  _windowHeight: INITIAL_WINDOW_HEIGHT,
  _windowWidth: INITIAL_WINDOW_WIDTH,
  _reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches,
  isXscrolling: function (container = window) {const _containerData = uss._containersData.get(container) || []; return typeof _containerData[0] !== "undefined" && _containerData[0] !== null;},
  isYscrolling: function (container = window) {const _containerData = uss._containersData.get(container) || []; return typeof _containerData[1] !== "undefined" && _containerData[1] !== null;},
  isScrolling:  function (container = window) {const _containerData = uss._containersData.get(container) || []; return (typeof _containerData[0] !== "undefined" && _containerData[0] !== null) || (typeof _containerData[1] !== "undefined" && _containerData[1] !== null);},
  getXStepLengthCalculator: function (container = window) {const _containerData = uss._containersData.get(container) || []; return _containerData[12];},
  getYStepLengthCalculator: function (container = window) {const _containerData = uss._containersData.get(container) || []; return _containerData[13];},
  getXStepLength: function () {return uss._xStepLength;},
  getYStepLength: function () {return uss._yStepLength;},
  getMinAnimationFrame: function () {return uss._minAnimationFrame;},
  getWindowHeight: function () {return uss._windowHeight;},
  getWindowWidth: function () {return uss._windowWidth;},
  getReducedMotionState: function () {return uss._reducedMotion;},
  setXStepLengthCalculator: function (newCalculator = undefined, container = window) {
    if(typeof newCalculator !== "function") {console.error("USS Error:", newCalculator, "is not a function"); return;}
    const _testValue = DEFAULT_SCROLL_CALCULATOR_TEST_VALUE;
    const _testResult = newCalculator(_testValue, 0, 0, _testValue, 0, _testValue, container); //remaningScrollAmount, originalTimestamp ,timestamp, totalScrollAmount, currentXPosition, finalXPosition, container
    if(Number.isFinite(_testResult) && _testResult >= 0) {
      const _containerData = uss._containersData.get(container) || [];
      _containerData[12] = newCalculator;
      uss._containersData.set(container, _containerData);
      return;
    }
    console.error("USS Error:", newCalculator.name || "Anonymous function", "didn't return a valid step value");
  },
  setYStepLengthCalculator: function (newCalculator = undefined, container = window) {
    if(typeof newCalculator !== "function") {console.error("USS Error:", newCalculator, "is not a function"); return;}
    const _testValue = DEFAULT_SCROLL_CALCULATOR_TEST_VALUE;
    const _testResult = newCalculator(_testValue, 0, 0, _testValue, 0, _testValue, container); //remaningScrollAmount, originalTimestamp, timestamp, totalScrollAmount, currentYPosition, finalYPosition, container
    if(Number.isFinite(_testResult) && _testResult >= 0) {
      const _containerData = uss._containersData.get(container) || [];
      _containerData[13] = newCalculator;
      uss._containersData.set(container, _containerData);
      return;
    }
    console.error("USS Error:", newCalculator.name || "Anonymous function", "didn't return a valid step value");
  },
  setStepLengthCalculator: function (newCalculator = undefined, container = window) {
    if(typeof newCalculator !== "function") {console.error("USS Error:", newCalculator, "is not a function"); return;}
    const _testValue = DEFAULT_SCROLL_CALCULATOR_TEST_VALUE;
    const _testResult = newCalculator(_testValue, 0, 0, _testValue, 0, _testValue, container); //remaningScrollAmount, originalTimestamp, timestamp, totalScrollAmount, currentPosition, finalPosition, container
    if(Number.isFinite(_testResult) && _testResult >= 0) {
      const _containerData = uss._containersData.get(container) || [];
      _containerData[12] = newCalculator;
      _containerData[13] = newCalculator;
      uss._containersData.set(container, _containerData);
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
  calcXStepLength: function (deltaX) {return (deltaX >= (uss._minAnimationFrame - 1) * uss._xStepLength) ? uss._xStepLength : Math.ceil(deltaX / uss._minAnimationFrame);},
  calcYStepLength: function (deltaY) {return (deltaY >= (uss._minAnimationFrame - 1) * uss._yStepLength) ? uss._yStepLength : Math.ceil(deltaY / uss._minAnimationFrame);},
  getScrollXCalculator: function (container = window) {
    return (container === window)             ? () => {return container.scrollX;}    :
           (container instanceof HTMLElement) ? () => {return container.scrollLeft;} :
           () => {
             console.error("USS Error: cannot determine the ScrollXCalculator of", container, "because it's neither an HTMLElement nor the window");
             throw "USS error";
           };
  },
  getScrollYCalculator: function (container = window) {
    return (container === window)             ? () => {return container.scrollY;}   :
           (container instanceof HTMLElement) ? () => {return container.scrollTop;} :
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

      let _container = element.parentElement;
      while(_container !== null) {
          _style = getComputedStyle(_container);
          if(_excludeStaticParent && _style.position === "static") {_container = _container.parentElement; continue;}
          if(_overflowRegex.test(_style.overflow + _style.overflowY + _style.overflowX))
            if(_container.scrollWidth > _container.clientWidth || _container.scrollHeight > _container.clientHeight)
              return _container;
          _container = _container.parentElement;
      }
      return window;
    } catch(e) {console.error("USS Error: Couldn't get the parent container of the element", element); return window;}
  },
  scrollXTo: function (finalXPosition, container = window, callback = () => {}) {
    if(!Number.isFinite(finalXPosition)) {console.error("USS Error:", finalXPosition, "is not a number"); return;}

    //If the container cannot be scrolled on the x-axis, _maxScrollX will be <= 0 and the function returns.
    //If the final position has already been reached, no scroll-animation is performed.
    const _maxScrollX = uss.getMaxScrollX(container);
    if(_maxScrollX <= 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

    const _scrollXCalculator = uss.getScrollXCalculator(container);
    const _scrollYCalculator = uss.getScrollYCalculator(container);
    let _totalScrollAmount = finalXPosition - _scrollXCalculator();
    const _direction = _totalScrollAmount > 0 ? 1 : -1;
    _totalScrollAmount *= _direction;
    if(_totalScrollAmount <= 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

    //If user prefers reduced motion
    //the API rolls back to the default "jump-to-position" behavior
    if(uss._reducedMotion) {
      container.scroll(finalXPosition, _scrollYCalculator());
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }

    //At this point we know the container has to be scrolled by a certain amount with smooth scroll.
    //Two possible cases: a scroll-animation is already being performed and it can be reused or not.
    let _containerData = uss._containersData.get(container) || [];
    _containerData[2] = finalXPosition;
    _containerData[4] = _direction;
    _containerData[6] = _totalScrollAmount;
    _containerData[8] = performance.now();
    _containerData[10] = callback;

     //A scroll-animation is already being performed and
     //the scroll-animation's informations have already been updated
    if(typeof _containerData[0] !== "undefined" && _containerData[0] !== null) return;

    //No scroll-animations are being performed so a new one is created
    _containerData[0] = window.requestAnimationFrame(_stepX);
    uss._containersData.set(container, _containerData);

    const _scrollStepLength = uss.calcXStepLength(_totalScrollAmount); //Default value for the step length
    const _stepCalculator = _containerData[12];
    const _usesCustomStepCalculator = typeof _stepCalculator === "function";

    function _stepX(timestamp) {
      const finalXPosition = _containerData[2];
      const _direction = _containerData[4];

      const _currentXPosition = _scrollXCalculator();
      const _remaningScrollAmount = (finalXPosition - _currentXPosition) * _direction;
      if(_remaningScrollAmount <= 0) {
        _containerData[0] = null;
        if(typeof _containerData[10] === "function") window.requestAnimationFrame(_containerData[10]);
        return;
      }

      let _calculatedScrollStepLength;
      if(_usesCustomStepCalculator) {
        _calculatedScrollStepLength = _stepCalculator(_remaningScrollAmount, _containerData[8], timestamp, _containerData[6], _currentXPosition, finalXPosition, container);
        if(!Number.isFinite(_calculatedScrollStepLength) || _calculatedScrollStepLength < 0) _calculatedScrollStepLength = _scrollStepLength;
      } else _calculatedScrollStepLength = _scrollStepLength;

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        _containerData[0] = null;
        container.scroll(finalXPosition, _scrollYCalculator());
        if(typeof _containerData[10] === "function") window.requestAnimationFrame(_containerData[10]);
        return;
      }

      container.scroll(_currentXPosition + _calculatedScrollStepLength * _direction, _scrollYCalculator());

      //The API tried to scroll but the finalXPosition was beyond the scroll limit of the container
      if(_calculatedScrollStepLength >= 1 && _currentXPosition === _scrollXCalculator()) {
        _containerData[0] = null;
        if(typeof _containerData[10] === "function") window.requestAnimationFrame(_containerData[10]);
        return;
      }

      _containerData[0] = window.requestAnimationFrame(_stepX);
    }
  },
  scrollYTo: function (finalYPosition, container = window, callback = () => {}) {
    if(!Number.isFinite(finalYPosition)) {console.error("USS Error:", finalYPosition, "is not a number"); return;}

    //If the container cannot be scrolled on the y-axis, _maxScrollY will be <= 0 and the function returns.
    //If the final position has already been reached, no scroll-animation is performed.
    const _maxScrollY = uss.getMaxScrollY(container);
    if(_maxScrollY <= 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

    const _scrollXCalculator = uss.getScrollXCalculator(container);
    const _scrollYCalculator = uss.getScrollYCalculator(container);
    let _totalScrollAmount = finalYPosition - _scrollYCalculator();
    const _direction = _totalScrollAmount > 0 ? 1 : -1;
    _totalScrollAmount *= _direction;
    if(_totalScrollAmount <= 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

    //If user prefers reduced motion
    //the API rolls back to the default "jump-to-position" behavior
    if(uss._reducedMotion) {
      container.scroll(_scrollXCalculator(), finalYPosition);
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }

    //At this point we know the container has to be scrolled by a certain amount with smooth scroll.
    //Two possible cases: a scroll-animation is already being performed and it can be reused or not.
    let _containerData = uss._containersData.get(container) || [];
    _containerData[3] = finalYPosition;
    _containerData[5] = _direction;
    _containerData[7] = _totalScrollAmount;
    _containerData[9] = performance.now();
    _containerData[11] = callback;

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated
    if(typeof _containerData[1] !== "undefined" && _containerData[1] !== null) return;

    //No scroll-animations are being performed so a new one is created
    _containerData[1] = window.requestAnimationFrame(_stepY);
    uss._containersData.set(container, _containerData);

    const _scrollStepLength = uss.calcYStepLength(_totalScrollAmount); //Default value for the step length
    const _stepCalculator = _containerData[13];
    const _usesCustomStepCalculator = typeof _stepCalculator === "function";

    function _stepY(timestamp) {
      const finalYPosition = _containerData[3];
      const _direction = _containerData[5];

      const _currentYPosition = _scrollYCalculator();
      const _remaningScrollAmount = (finalYPosition - _currentYPosition) * _direction;
      if(_remaningScrollAmount <= 0) {
        _containerData[1] = null;
        if(typeof _containerData[11] === "function") window.requestAnimationFrame(_containerData[11]);
        return;
      }

      let _calculatedScrollStepLength;
      if(_usesCustomStepCalculator) {
        _calculatedScrollStepLength = _stepCalculator(_remaningScrollAmount, _containerData[9], timestamp, _containerData[7], _currentYPosition, finalYPosition, container);
        if(!Number.isFinite(_calculatedScrollStepLength) || _calculatedScrollStepLength < 0) _calculatedScrollStepLength = _scrollStepLength;
      } else _calculatedScrollStepLength = _scrollStepLength;

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        _containerData[1] = null;
        container.scroll(_scrollXCalculator(), finalYPosition);
        if(typeof _containerData[11] === "function") window.requestAnimationFrame(_containerData[11]);
        return;
      }

      container.scroll(_scrollXCalculator(), _currentYPosition + _calculatedScrollStepLength * _direction);

      //The API tried to scroll but the finalYPosition was beyond the scroll limit of the container
      if(_calculatedScrollStepLength >= 1 && _currentYPosition === _scrollYCalculator()) {
        _containerData[1] = null;
        if(typeof _containerData[11] === "function") window.requestAnimationFrame(_containerData[11]);
        return;
      }

      _containerData[1] = window.requestAnimationFrame(_stepY);
    }
  },
  scrollXBy: function (deltaX, container = window, callback = () => {}, stillStart = true) {
    if(!Number.isFinite(deltaX)) {console.error("USS Error:", deltaX, "is not a number"); return;}
    if(deltaX === 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];
      if(typeof _containerData[0] !== "undefined" && _containerData[0] != null)  {
        _containerData[2] += deltaX; //finalXPosition
        const _totalScrollAmount = _containerData[2] - uss.getScrollXCalculator(container)();
        _containerData[4] = _totalScrollAmount > 0 ? 1 : -1;
        _containerData[6] = _totalScrollAmount * _containerData[4];
        _containerData[8] = performance.now();
        _containerData[10] = callback;
        return;
      }
    }

    uss.scrollXTo(uss.getScrollXCalculator(container)() + deltaX, container, callback);
  },
  scrollYBy: function (deltaY, container = window, callback = () => {}, stillStart = true) {
    if(!Number.isFinite(deltaY)) {console.error("USS Error:", deltaY, "is not a number"); return;}
    if(deltaY === 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];
      if(typeof _containerData[1] !== "undefined" && _containerData[1] != null)  {
        _containerData[3] += deltaY; //finalYPosition
        const _totalScrollAmount = _containerData[3] - uss.getScrollYCalculator(container)();
        _containerData[5] = _totalScrollAmount > 0 ? 1 : -1;
        _containerData[7] = _totalScrollAmount * _containerData[5];
        _containerData[9] = performance.now();
        _containerData[11] = callback;
        return;
      }
    }

    uss.scrollYTo(uss.getScrollYCalculator(container)() + deltaY, container, callback);
  },
  scrollTo: function (finalXPosition, finalYPosition, container = window, callback = () => {}) {
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

    uss.scrollXTo(finalXPosition, container, _callback.__function);
    uss.scrollYTo(finalYPosition, container, _callback.__function);
  },
  scrollBy: function (deltaX, deltaY, container = window, callback = () => {}, stillStart = true) {
    if(!Number.isFinite(deltaX)) {console.error("USS Error:", deltaX, "is not a number"); return;}
    if(!Number.isFinite(deltaY)) {console.error("USS Error:", deltaY, "is not a number"); return;}
    if(deltaX === 0 && deltaY === 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}
    if(deltaX === 0) {uss.scrollYBy(deltaY, container, callback, stillStart); return;}
    if(deltaY === 0) {uss.scrollXBy(deltaX, container, callback, stillStart); return;}
    uss.scrollTo(uss.getScrollXCalculator(container)() + deltaX, uss.getScrollYCalculator(container)() + deltaY, container, callback);
  },
  scrollIntoView: function (element = window, alignToLeft = true, alignToTop = true, callback = () => {}, includeHidden = false) {
    if(element === window) return;
    if(!(element instanceof HTMLElement)) {console.error("USS Error:", element, "is not an HTML element"); return;}

    const _container = uss.getScrollableParent(element, includeHidden); //First scrollable parent of the passed element
    let _containerRect = (_container !== window) ? _container.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};

    if(_container === window) {
      const _elementRect = element.getBoundingClientRect();
      const _elementInitialX = _elementRect.left - _containerRect.left; //Element's x-coordinate relative to it's container
      const _elementInitialY = _elementRect.top  - _containerRect.top;  //Element's y-coordinate relative to it's container
      const _elementFinalX   = (alignToLeft === true) ? 0 : (alignToLeft === false) ? _containerRect.width  - _elementRect.width  : 0.5 * (_containerRect.width  - _elementRect.width);
      const _elementFinalY   = (alignToTop  === true) ? 0 : (alignToTop  === false) ? _containerRect.height - _elementRect.height : 0.5 * (_containerRect.height - _elementRect.height);

      uss.scrollBy(_elementInitialX - _elementFinalX, _elementInitialY - _elementFinalY, _container, callback);
      element.focus();
      return;
    }

    let _containerInitialX = _containerRect.left;
    let _containerInitialY = _containerRect.top;
    const _containerFinalX = (alignToLeft === true) ? 0 : (alignToLeft === false) ? uss._windowWidth  - _containerRect.width  : 0.5 * (uss._windowWidth  - _containerRect.width);
    const _containerFinalY = (alignToTop  === true) ? 0 : (alignToTop  === false) ? uss._windowHeight - _containerRect.height : 0.5 * (uss._windowHeight - _containerRect.height);

    let _deltaX = _containerInitialX - _containerFinalX; //Passed element containers' remaning scroll amount on the x-axis
    let _deltaY = _containerInitialY - _containerFinalY; //Passed element containers' remaning scroll amount on the y-axis

    const _directionX = _deltaX > 0 ? 1 : -1;
    const _directionY = _deltaY > 0 ? 1 : -1;

    let _containerParent = uss.getScrollableParent(_container, includeHidden); //First scrollable parent of the passed element's container
    _scrollParents();

    function _scrollParents() {
      uss.scrollBy(_deltaX, _deltaY, _containerParent, () => {
        //We won't be able to scroll any further even if we wanted
        if(_containerParent === window) {
          const _elementRect = element.getBoundingClientRect();
          const _elementInitialX = _elementRect.left - _containerRect.left; //Element's x-coordinate relative to it's container
          const _elementInitialY = _elementRect.top  - _containerRect.top;  //Element's y-coordinate relative to it's container
          const _elementFinalX   = (alignToLeft === true) ? 0 : (alignToLeft === false) ? _containerRect.width  - _elementRect.width  : 0.5 * (_containerRect.width  - _elementRect.width);
          const _elementFinalY   = (alignToTop  === true) ? 0 : (alignToTop  === false) ? _containerRect.height - _elementRect.height : 0.5 * (_containerRect.height - _elementRect.height);

          element.focus();
          uss.scrollBy(_elementInitialX - _elementFinalX, _elementInitialY - _elementFinalY, _container, callback);
          return;
        }

        //Recalculate the passed element container's current position
        _containerRect = _container.getBoundingClientRect();
        _containerInitialX = _containerRect.left;
        _containerInitialY = _containerRect.top;

        //Recalculate the remaning scroll amounts
        _deltaX = _containerInitialX - _containerFinalX;
        _deltaY = _containerInitialY - _containerFinalY;

        if(_deltaX * _directionX > 0 || _deltaY * _directionY > 0) {
          _containerParent = uss.getScrollableParent(_containerParent, includeHidden);
          window.requestAnimationFrame(_scrollParents);
          return;
        }

        const _elementRect = element.getBoundingClientRect();
        const _elementInitialX = _elementRect.left - _containerRect.left; //Element's x-coordinate relative to it's container
        const _elementInitialY = _elementRect.top  - _containerRect.top;  //Element's y-coordinate relative to it's container
        const _elementFinalX   = (alignToLeft === true) ? 0 : (alignToLeft === false) ? _containerRect.width  - _elementRect.width  : 0.5 * (_containerRect.width  - _elementRect.width);
        const _elementFinalY   = (alignToTop  === true) ? 0 : (alignToTop  === false) ? _containerRect.height - _elementRect.height : 0.5 * (_containerRect.height - _elementRect.height);

        element.focus();
        uss.scrollBy(_elementInitialX - _elementFinalX, _elementInitialY - _elementFinalY, _container, callback);
      });
    }
  },
  stopScrollingX: function (container = window, callback = () => {}) {
    let _containerData = uss._containersData.get(container);
    if(typeof _containerData !== "undefined") {
      window.cancelAnimationFrame(_containerData[0]);
      _containerData[0] = null;
    }
    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrollingY: function (container = window, callback = () => {}) {
    let _containerData = uss._containersData.get(container);
    if(typeof _containerData !== "undefined") {
      window.cancelAnimationFrame(_containerData[1]);
      _containerData[1] = null;
    }
    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrolling: function (container = window, callback = () => {}) {
    let _containerData = uss._containersData.get(container);
    if(typeof _containerData !== "undefined") {
      window.cancelAnimationFrame(_containerData[0]);
      window.cancelAnimationFrame(_containerData[1]);
      _containerData[0] = null;
      _containerData[1] = null;
    }
    if(typeof callback === "function") window.requestAnimationFrame(callback);
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
      const _currentPageLink = _pageLink;

      _pageLink.addEventListener("click", event => {
        event.preventDefault();
        if(_init(_currentPageLink, _elementToReach) === false) return; //False means the scroll-animation has been explicitly prevented
        uss.scrollIntoView(_elementToReach, alignToLeft, alignToTop, callback, includeHidden);
      }, {passive:false});
    }
  }
}

window.addEventListener("resize", () => {uss._windowHeight = window.innerHeight; uss._windowWidth = window.innerWidth;} , {passive:true});
window.matchMedia("(prefers-reduced-motion)").addEventListener("change", () => {
  uss._reducedMotion = !uss._reducedMotion;
  const _containers = uss._containersData.keys();
  for(const _container of _containers) uss.stopScrolling(_container);
}, {passive:true});
