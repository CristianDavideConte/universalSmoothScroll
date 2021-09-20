/*
 * CONSTANTS (INTERNAL USE):
 *
 * INITIAL_WINDOW_HEIGHT: number, the window's inner height measured in pixels when first loaded.
 * INITIAL_WINDOW_WIDTH: number, the window's inner width measured in pixels when first loaded.
 * DEFAULT_XSTEP_LENGTH: number, the default number of pixels scrolled in a single scroll-animation's step on the x-axis: 50px steps for a 1920px screen width.
 * DEFAULT_YSTEP_LENGTH: number, the default number of pixels scrolled in a single scroll-animation's step on the y-axis: 50px steps for a 937px(1080px - urlbar) screen height.
 * DEFAULT_MIN_ANIMATION_FRAMES: number, the default lowest possible number of frames any scroll-animation should last if no custom StepLengthCalculator are set for a container.
 * DEFAULT_SCROLL_CALCULATOR_TEST_VALUE: number, the default number of pixel scrolled when testing a newScrollCalculator.
 * DEFAULT_PAGE_SCROLLER: object, the initial default value of the "container" input parameter used by some of the API's methods.
 * DEFAULT_ERROR_LOGGER: function, pretty-prints the API error messages inside the console.
 * DEFAULT_WARNING_LOGGER: function, pretty-prints the API warning messages inside the console.
 */


/*
 * VARIABLES (INTERNAL USE):
 *
 * _containersData: Map(Container, Array[]), a map in which:
 *                  1) A key is a DOM element internally called "container".
 *                  2) A value is an array with 14 values, which are:
 *                     [0] contains the ID of a requested scroll-animation on the x-axis provided by the requestAnimationFrame() method.
 *                         Null if no scroll-animations on the x-axis are currently being performed.
 *                     [1] contains the ID of a requested scroll-animation on the y-axis provided by the requestAnimationFrame() method.
 *                         Null if no scroll-animations on the y-axis are currently being performed.
 *                     [2] contains the position in pixel at which the container will be at the end of the scroll-animation on the x-axis.
 *                     [3] contains the position in pixel at which the container will be at the end of the scroll-animation on the y-axis.
 *                     [4] contains the direction of the current scroll-animation on the x-axis.
 *                         1 if the elements inside the container will go from right to left as a consequence of the scrolling, -1 otherwise.
 *                     [5] contains the direction of the current scroll-animation on the y-axis.
 *                         1 if the elements inside the container will go from bottom to top as a consequence of the scrolling, -1 otherwise.
 *                     [6] contains the total amount of pixels that have to be scrolled from the start of the current scroll-animation on the x-axis to its end.
 *                     [7] contains the total amount of pixels that have to be scrolled from the start of the current scroll-animation on the y-axis to its end.
 *                     [8] contains the starting time in milliseconds (as a DOMHighResTimeStamp) of the current scroll-animation on the x-axis.
 *                     [9] contains the starting time in milliseconds (as a DOMHighResTimeStamp) of the current scroll-animation on the y-axis.
 *                     [10] contains a callback function that will be executed when the current scroll-animation on the x-axis has been performed.
 *                     [11] contains a callback function that will be executed when the current scroll-animation on the y-axis has been performed.
 *                     [12] contains a user-defined ease functions that will return the length of every single step of all scroll-animations on the x-axis.
 *                     [13] contains a user-defined ease functions that will return the length of every single step of all scroll-animations on the y-axis.
 * _xStepLength: number, the number of pixels scrolled on the x-axis during a single scroll-animation's step.
 * _yStepLength: number, the number of pixels scrolled on the y-axis during a single scroll-animation's step.
 * _minAnimationFrame: number, the minimum number of frames any scroll-animation, on any axis, should last if no custom StepLengthCalculator are set for a container.
 * _windowHeight: number, the current window's inner heigth in pixels.
 * _windowWidth: number, the current window's inner width in pixels.
 * _pageScroller: object, the current default value of the "container" input parameter used by some of the API's methods.
 * _reducedMotion: boolean, true if the user has enabled any "reduce-motion" setting devicewise, false otherwise.
 *                 Internally used to follow the user's accessibility preferences reverting back to the browser's default jump-to-position behavior if needed.
 */


/*
 * METHODS (PUBLIC USE):
 *
 * isXscrolling: function, returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
 * isYscrolling: function, returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
 * isScrolling:  function, returns true if a scroll-animation on any axis of the passed container is currently being performed by this API, false otherwise.
 * getXStepLengthCalculator: function, returns the current ease function used by the passed container if available.
 * getYStepLengthCalculator: function, returns the current ease function used by the passed container if available.
 * getXStepLength: function, returns the value of _xStepLength.
 * getYStepLength: function, returns the value of _yStepLength.
 * getMinAnimationFrame: function, returns the value of _minAnimationFrame.
 * getWindowHeight: function, returns the value of _windowHeight.
 * getWindowWidth: function, returns the value of _windowWidth.
 * getPageScroller: function, returns the value of _pageScroller.
 * getReducedMotionState: function, returns the value of _reducedMotion.
 * setXStepLengthCalculator: function, sets the ease function for the requested container to the passed function if compatible.
 * setYStepLengthCalculator: function, sets the ease function for the requested container to the passed function if compatible.
 * setStepLengthCalculator: function, sets both the  for the requested container to the passed ease function if compatible.
 * setXStepLength: function, sets the _xStepLength to the passed value if compatible.
 * setYStepLength: function, sets the _yStepLength to the passed value if compatible.
 * setStepLength: function, sets both the _xStepLength and the _yStepLength to the passed value if compatible.
 * setMinAnimationFrame: function, sets the _minAnimationFrame to the passed value if compatible.
 * setPageScroller: function, sets the _pageScroller to the passed value if compatible.
 * calcXStepLength: function, takes in the remaning scroll amount of a scroll-animation on the x-axis and
 *                  returns how long each animation-step must be in order to target the _minAnimationFrame value.
 * calcYStepLength: function, takes in the remaning scroll amount of a scroll-animation on the y-axis and
 *                  returns how long each animation-step must be in order to target the _minAnimationFrame value.
 * getScrollXCalculator: function, takes in a container and returns a function that returns:
 *                       - The scrollLeft property of the container if it's an instance of HTMLElement.
 *                       - The scrollX property of the container if it's the window element.
 * getScrollYCalculator: function, takes in a container and returns a function that returns:
 *                       - The scrollTop property of the container if it's an instance of HTMLElement.
 *                       - The scrollY property of the container if it's the window element.
 * getMaxScrollX: function, takes in a scroll container and returns its highest scroll-reachable x-value.
 * getMaxScrollY: function, takes in a scroll container and returns its highest scroll-reachable y-value.
 * getXScrollableParent: function, returns the first scrollable container for the passed element on the x-axis, works with "overflow('',X,Y): hidden" if specified.
 * getYScrollableParent: function, returns the first scrollable container for the passed element on the y-axis, works with "overflow('',X,Y): hidden" if specified.
 * getScrollableParent: function, returns the first scrollable container for the passed element, works with "overflow('',X,Y): hidden" if specified.
 * scrollXTo: function, takes in a number which indicates the position that the passed container's left border's x-coordinate
 *            has to reach and performs a scroll-animation on the x-axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollYTo: function, takes in a number which indicates the position that the passed container's top border's y-coordinate
 *            has to reach and performs a scroll-animation on the y-axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollXBy: function, takes in a number which indicates the number of pixels on the x-axis that the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollYBy: function, takes in a number which indicates the number of pixels on the y-axis that the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollTo: function, takes in 2 numbers which respectively indicate the position that the passed container's left border's x-coordinate and top border's y-coordinate
 *           have to reach and performs 2 scroll-animations on both the x-axis and the y-axis.
 *           After the scroll-animations have finished a callback function can be invoked.
 * scrollBy: function, takes in 2 numbers which respectively indicate the number of pixels on the x-axis and the y-axis that the passed container has to be scrolled by and
 *           performs 2 scroll-animations on both the x-axis and the y-axis.
 *           After the scroll-animations have finished a callback function can be invoked.
 * scrollIntoView: function, scrolls all the necessary containers of the passed element in order to make it and its closest scrollable parent visible on the screen.
 *                 There are 4 possible alignments for both: top, bottom, center, nearest.
 *                 The alignments can be changed by passing different values of alignToTop and alignToLeft.
 *                 Works with "overflow('',X,Y): hidden" if specified.
 *                 After the scroll-animations have finished a callback function can be invoked.
 * scrollIntoViewIfNeeded: function, scrolls all the necessary containers of the passed element in order to make it and its closest scrollable parent visible on the screen only if they are not already fully visible.
 *                         There are 2 possible alignments for both: center, nearest.
 *                         The alignments can be changed by passing different values of alignToCenter.
 *                         Works with "overflow('',X,Y): hidden" if specified.
 *                         After the scroll-animations have finished a callback function can be invoked.
 * stopScrollingX: function, stops all the current scroll-animation on the x-axis of the passed container.
 *                 After the animations have been stopped a callback function can be invoked.
 * stopScrollingY: function, stops all the current scroll-animation on the y-axis of the passed container.
 *                 After the animations have been stopped a callback function can be invoked.
 * stopScrolling: function, stops all the current scroll-animation on both the x-axis and the y-axis of the passed container.
 *                After the animations have been stopped a callback function can be invoked.
 * hrefSetup: function, looks for every anchor element  (<a> && <area>) with a value for the href attribute linked to an element on the same page and
 *            registers an eventListener for it in order to trigger a smooth scroll-animation
 *            to reach the linked element once the anchor is clicked (internally uses scrollIntoView).
 *            Before the scroll-animations are performed an init function can be invoked: if this functions returns false, the scroll-animation is prevented.
 *            After the scroll-animations have been performed a callback function can be invoked.
 */
"use strict";

const INITIAL_WINDOW_HEIGHT = window.innerHeight;
const INITIAL_WINDOW_WIDTH = window.innerWidth;
const DEFAULT_XSTEP_LENGTH = INITIAL_WINDOW_HEIGHT * 50 / 1920;
const DEFAULT_YSTEP_LENGTH = INITIAL_WINDOW_WIDTH  * 50 / 937;
const DEFAULT_MIN_ANIMATION_FRAMES = 60;
const DEFAULT_SCROLL_CALCULATOR_TEST_VALUE = 100;
const DEFAULT_PAGE_SCROLLER = window;
const DEFAULT_ERROR_LOGGER = (functionName, expectedValue, receivedValue) => {
  receivedValue = receivedValue === null ? "null" : receivedValue === undefined ? "undefined" : receivedValue.name || receivedValue;
  console.group("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");

    console.log("%cUSS ERROR",
                "font-family: system-ui; font-weight: 800; font-size: 40px;  background: #eb445a; color:black; border-radius: 5px 5px 5px 5px; padding:0.4vh 0.5vw; margin: 1vh 0"
               );
    console.log("  %c" + functionName + "%cwas expecting " + expectedValue,
                "font-style: italic; font-family: system-ui; font-weight: 700; font-size: 17px; background: #2dd36f; color: black; border-radius: 5px 0px 0px 5px; padding:0.4vh 0.5vw",
                "font-family: system-ui; font-weight: 600; font-size: 17px; background: #2dd36f; color:black; border-radius: 0px 5px 5px 0px; padding:0.4vh 0.5vw"
               );
    console.log("  %cBut it received%c"+ receivedValue,
                "font-family: system-ui; font-weight: 600; font-size: 17px; background: #eb445a; color:black; border-radius: 5px 0px 0px 5px; padding:0.4vh 0.5vw",
                "font-style: italic; font-family: system-ui; font-weight: 700; font-size: 17px; background: #eb445a; color: black; border-radius: 0px 5px 5px 0px; padding:0.4vh 0.5vw"
               );
    console.trace("%cStack Trace",
                  "font-family: system-ui; font-weight: 500; font-size: 17px; background: #3171e0; color: #f5f6f9; border-radius: 5px; padding:0.3vh 0.5vw; margin-left: 2px; margin-top: 1vh"
                 );

  console.groupEnd("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");
}

const DEFAULT_WARNING_LOGGER = (subject, message) => {
  console.groupCollapsed("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");

    console.log("%cUSS WARNING",
                "font-family: system-ui; font-weight: 800; font-size: 40px;  background: #fcca03; color:black; border-radius: 5px 5px 5px 5px; padding:0.4vh 0.5vw; margin: 1vh 0"
               );
    console.log("  %c" + subject + "%c" + message,
                "font-style: italic; font-family: system-ui; font-weight: 700; font-size: 17px; background: #fcca03; color: black; border-radius: 5px 0px 0px 5px; padding:0.4vh 0.5vw",
                "font-family: system-ui; font-weight: 600; font-size: 17px; background: #fcca03; color:black; border-radius: 0px 5px 5px 0px; padding:0.4vh 0.5vw"
               );
    console.trace("%cStack Trace",
                  "font-family: system-ui; font-weight: 500; font-size: 17px; background: #3171e0; color: #f5f6f9; border-radius: 5px; padding:0.3vh 0.5vw; margin-left: 2px; margin-top: 1vh"
                 );

  console.groupEnd("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");
}

var uss = {
  _containersData: new Map(),
  _xStepLength: DEFAULT_XSTEP_LENGTH,
  _yStepLength: DEFAULT_YSTEP_LENGTH,
  _minAnimationFrame: DEFAULT_MIN_ANIMATION_FRAMES,
  _windowHeight: INITIAL_WINDOW_HEIGHT,
  _windowWidth: INITIAL_WINDOW_WIDTH,
  _pageScroller: DEFAULT_PAGE_SCROLLER,
  _reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches,
  isXscrolling: function (container = uss._pageScroller) {const _containerData = uss._containersData.get(container) || []; return typeof _containerData[0] !== "undefined" && _containerData[0] !== null;},
  isYscrolling: function (container = uss._pageScroller) {const _containerData = uss._containersData.get(container) || []; return typeof _containerData[1] !== "undefined" && _containerData[1] !== null;},
  isScrolling:  function (container = uss._pageScroller) {const _containerData = uss._containersData.get(container) || []; return (typeof _containerData[0] !== "undefined" && _containerData[0] !== null) || (typeof _containerData[1] !== "undefined" && _containerData[1] !== null);},
  getXStepLengthCalculator: function (container = uss._pageScroller) {const _containerData = uss._containersData.get(container) || []; return _containerData[12];},
  getYStepLengthCalculator: function (container = uss._pageScroller) {const _containerData = uss._containersData.get(container) || []; return _containerData[13];},
  getXStepLength: function () {return uss._xStepLength;},
  getYStepLength: function () {return uss._yStepLength;},
  getMinAnimationFrame: function () {return uss._minAnimationFrame;},
  getWindowHeight: function () {return uss._windowHeight;},
  getWindowWidth: function () {return uss._windowWidth;},
  getPageScroller: function () {return uss._pageScroller;},
  getReducedMotionState: function () {return uss._reducedMotion;},
  setXStepLengthCalculator: function (newCalculator, container = uss._pageScroller) {
    if(typeof newCalculator !== "function") {
      DEFAULT_ERROR_LOGGER("setXStepLengthCalculator", "a function", newCalculator);
      return;
    }

    const _testResult = newCalculator(DEFAULT_SCROLL_CALCULATOR_TEST_VALUE, //remaningScrollAmount
                                      0,                                    //originalTimestamp
                                      0,                                    //currentTimestamp
                                      DEFAULT_SCROLL_CALCULATOR_TEST_VALUE, //totalScrollAmount
                                      0,                                    //currentXPosition
                                      DEFAULT_SCROLL_CALCULATOR_TEST_VALUE, //finalXPosition
                                      container                             //container
                                      );

    if(!Number.isFinite(_testResult)) {
      DEFAULT_ERROR_LOGGER("setXStepLengthCalculator", "a function which returns a valid step value", newCalculator.name || "Anonymous function");
      return;
    }

    const _containerData = uss._containersData.get(container) || [];
    _containerData[12] = newCalculator;
    uss._containersData.set(container, _containerData);
  },
  setYStepLengthCalculator: function (newCalculator, container = uss._pageScroller) {
    if(typeof newCalculator !== "function") {
      DEFAULT_ERROR_LOGGER("setYStepLengthCalculator", "a function", newCalculator);
      return;
    }

    const _testResult = newCalculator(DEFAULT_SCROLL_CALCULATOR_TEST_VALUE, //remaningScrollAmount
                                      0,                                    //originalTimestamp
                                      0,                                    //currentTimestamp
                                      DEFAULT_SCROLL_CALCULATOR_TEST_VALUE, //totalScrollAmount
                                      0,                                    //currentYPosition
                                      DEFAULT_SCROLL_CALCULATOR_TEST_VALUE, //finalYPosition
                                      container                             //container
                                      );

    if(!Number.isFinite(_testResult)) {
      DEFAULT_ERROR_LOGGER("setYStepLengthCalculator", "a function which returns a valid step value", newCalculator.name || "Anonymous function");
      return;
    }

    const _containerData = uss._containersData.get(container) || [];
    _containerData[13] = newCalculator;
    uss._containersData.set(container, _containerData);
  },
  setStepLengthCalculator: function (newCalculator, container = uss._pageScroller) {
    if(typeof newCalculator !== "function") {
      DEFAULT_ERROR_LOGGER("setStepLengthCalculator", "a function", newCalculator);
      return;
    }

    const _testResult = newCalculator(DEFAULT_SCROLL_CALCULATOR_TEST_VALUE, //remaningScrollAmount
                                      0,                                    //originalTimestamp
                                      0,                                    //currentTimestamp
                                      DEFAULT_SCROLL_CALCULATOR_TEST_VALUE, //totalScrollAmount
                                      0,                                    //currentPosition
                                      DEFAULT_SCROLL_CALCULATOR_TEST_VALUE, //finalPosition
                                      container                             //container
                                      );

    if(!Number.isFinite(_testResult)) {
      DEFAULT_ERROR_LOGGER("setStepLengthCalculator", "a function which returns a valid step value", newCalculator.name || "Anonymous function");
      return;
    }

    const _containerData = uss._containersData.get(container) || [];
    _containerData[12] = newCalculator;
    _containerData[13] = newCalculator;
    uss._containersData.set(container, _containerData);
  },
  setXStepLength: function (newXStepLength) {
    if(!Number.isFinite(newXStepLength) || newXStepLength <= 0) {
      DEFAULT_ERROR_LOGGER("setXStepLength", "a positive number", newXStepLength);
      return;
    }
    uss._xStepLength = newXStepLength;
  },
  setYStepLength: function (newYStepLength) {
    if(!Number.isFinite(newYStepLength) || newYStepLength <= 0) {
      DEFAULT_ERROR_LOGGER("setYStepLength", "a positive number", newYStepLength);
      return;
    }
    uss._yStepLength = newYStepLength;
  },
  setStepLength: function (newStepLength) {
    if(!Number.isFinite(newStepLength) || newStepLength <= 0) {
      DEFAULT_ERROR_LOGGER("setStepLength", "a positive number", newStepLength);
      return;
    }
    uss._xStepLength = newStepLength;
    uss._yStepLength = newStepLength;
  },
  setMinAnimationFrame: function (newMinAnimationFrame) {
    if(!Number.isFinite(newMinAnimationFrame) || newMinAnimationFrame <= 0) {
      DEFAULT_ERROR_LOGGER("setMinAnimationFrame", "a positive number", newMinAnimationFrame);
      return;
    }
    uss._minAnimationFrame = newMinAnimationFrame;
  },
  setPageScroller: function (newPageScroller) {
    if(newPageScroller instanceof HTMLElement || newPageScroller === window) {
      uss._pageScroller = newPageScroller;
      return;
    }
    DEFAULT_ERROR_LOGGER("setPageScroller", "an HTMLElement or the Window", newPageScroller);
  },
  calcXStepLength: function (deltaX) {return deltaX >= uss._minAnimationFrame * uss._xStepLength ? uss._xStepLength : Math.ceil(deltaX / uss._minAnimationFrame);},
  calcYStepLength: function (deltaY) {return deltaY >= uss._minAnimationFrame * uss._yStepLength ? uss._yStepLength : Math.ceil(deltaY / uss._minAnimationFrame);},
  getScrollXCalculator: function (container = uss._pageScroller) {
    return container === window             ? () => {return container.scrollX;}    :
           container instanceof HTMLElement ? () => {return container.scrollLeft;} :
           () => {
             DEFAULT_ERROR_LOGGER("getScrollXCalculator", "an HTMLElement or the Window", container);
             throw "USS fatal error (execution stopped)";
           };
  },
  getScrollYCalculator: function (container = uss._pageScroller) {
    return container === window             ? () => {return container.scrollY;}   :
           container instanceof HTMLElement ? () => {return container.scrollTop;} :
           () => {
             DEFAULT_ERROR_LOGGER("getScrollYCalculator", "an HTMLElement or the Window", container);
             throw "USS fatal error (execution stopped)";
           };
  },
  getMaxScrollX: function (container = uss._pageScroller) {
    const _html = document.documentElement;
    const _body = document.body;
    return container instanceof HTMLElement ?
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
  getMaxScrollY: function (container = uss._pageScroller) {
    const _html = document.documentElement;
    const _body = document.body;
    return container instanceof HTMLElement ?
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
  getXScrollableParent: function (element, includeHidden = false) {
    if(element === window) return window;
    try {
      let _style = window.getComputedStyle(element);
      if(_style.position === "fixed") return uss._pageScroller;
      const _excludeStaticParent = _style.position === "absolute";
      const _overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

      let _container = element.parentElement;
      while(_container !== null) {
          _style = window.getComputedStyle(_container);
          if(!_excludeStaticParent || _style.position !== "static")
            if(_overflowRegex.test(_style.overflowX))
              if(_container.scrollWidth > _container.clientWidth)
                return _container;
          _container = _container.parentElement;
      }
      return window;
    } catch(e) {
      DEFAULT_ERROR_LOGGER("getXScrollableParent", "an HTMLElement or the Window", element);
      return window;
    }
  },
  getYScrollableParent: function (element, includeHidden = false) {
    if(element === window) return window;
    try {
      let _style = window.getComputedStyle(element);
      if(_style.position === "fixed") return uss._pageScroller;
      const _excludeStaticParent = _style.position === "absolute";
      const _overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

      let _container = element.parentElement;
      while(_container !== null) {
          _style = window.getComputedStyle(_container);
          if(!_excludeStaticParent || _style.position !== "static")
            if(_overflowRegex.test(_style.overflowY))
              if(_container.scrollHeight > _container.clientHeight)
                return _container;
          _container = _container.parentElement;
      }
      return window;
    } catch(e) {
      DEFAULT_ERROR_LOGGER("getYScrollableParent", "an HTMLElement or the Window", element);
      return window;
    }
  },
  getScrollableParent: function (element, includeHidden = false) {
    if(element === window) return window;
    try {
      let _style = window.getComputedStyle(element);
      if(_style.position === "fixed") return uss._pageScroller;
      const _excludeStaticParent = _style.position === "absolute";
      const _overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

      let _container = element.parentElement;
      while(_container !== null) {
          _style = window.getComputedStyle(_container);
          if(!_excludeStaticParent || _style.position !== "static")
            if(_overflowRegex.test(_style.overflow))
              if(_container.scrollWidth > _container.clientWidth || _container.scrollHeight > _container.clientHeight)
                return _container;
          _container = _container.parentElement;
      }
      return window;
    } catch(e) {
      DEFAULT_ERROR_LOGGER("getScrollableParent", "an HTMLElement or the Window", element);
      return window;
    }
  },
  scrollXTo: function (finalXPosition, container = uss._pageScroller, callback = () => {}) {
    if(!Number.isFinite(finalXPosition)) {
      DEFAULT_ERROR_LOGGER("scrollXTo", "a number as the finalXPosition", finalXPosition);
      return;
    }

    //If the container cannot be scrolled on the x-axis, maxScrollX will be <= 0 and the function returns.
    //If the final position has already been reached, no scroll-animation is performed.
    if(uss.getMaxScrollX(container) <= 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

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
    //Two possible cases:
    //  1) A scroll-animation is already being performed and it can be repurposed.
    //  2) No scroll-animations are being performed, no optimization can be done.
    const _containerData = uss._containersData.get(container) || [];
    _containerData[2]  = finalXPosition;
    _containerData[4]  = _direction;
    _containerData[6]  = _totalScrollAmount;
    _containerData[8]  = performance.now();
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
        if(!Number.isFinite(_calculatedScrollStepLength)) _calculatedScrollStepLength = _scrollStepLength;
      } else _calculatedScrollStepLength = _scrollStepLength;

      if(_remaningScrollAmount <=  Math.abs(_calculatedScrollStepLength)) {
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
  scrollYTo: function (finalYPosition, container = uss._pageScroller, callback = () => {}) {
    if(!Number.isFinite(finalYPosition)) {
      DEFAULT_ERROR_LOGGER("scrollYTo", "a number as the finalYPosition", finalYPosition);
      return;
    }

    //If the container cannot be scrolled on the y-axis, maxScrollY will be <= 0 and the function returns.
    //If the final position has already been reached, no scroll-animation is performed.
    if(uss.getMaxScrollY(container) <= 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

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
    //Two possible cases:
    //  1) A scroll-animation is already being performed and it can be repurposed.
    //  2) No scroll-animations are being performed, no optimization can be done.
    const _containerData = uss._containersData.get(container) || [];
    _containerData[3]  = finalYPosition;
    _containerData[5]  = _direction;
    _containerData[7]  = _totalScrollAmount;
    _containerData[9]  = performance.now();
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
        if(!Number.isFinite(_calculatedScrollStepLength)) _calculatedScrollStepLength = _scrollStepLength;
      } else _calculatedScrollStepLength = _scrollStepLength;

      if(_remaningScrollAmount <= Math.abs(_calculatedScrollStepLength)) {
        _containerData[1] = null;
        container.scroll(_scrollXCalculator(), finalYPosition);
        if(typeof _containerData[11] === "function") window.requestAnimationFrame(_containerData[11]);
        return;
      }

      container.scroll(_scrollXCalculator(), _currentYPosition + _calculatedScrollStepLength * _direction);

      //The API tried to scroll but the finalYPosition was beyond the scroll limit of the container
      if(_calculatedScrollStepLength !== 0 && _currentYPosition === _scrollYCalculator()) {
        _containerData[1] = null;
        if(typeof _containerData[11] === "function") window.requestAnimationFrame(_containerData[11]);
        return;
      }

      _containerData[1] = window.requestAnimationFrame(_stepY);
    }
  },
  scrollXBy: function (deltaX, container = uss._pageScroller, callback = () => {}, stillStart = true) {
    if(!Number.isFinite(deltaX)) {
      DEFAULT_ERROR_LOGGER("scrollXBy", "a number as the deltaX", deltaX);
      return;
    }
    if(deltaX === 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];

      //A scroll-animation on the x-axis is already being performed and can be repurposed
      if(typeof _containerData[0] !== "undefined" && _containerData[0] !== null)  {
        _containerData[2] += deltaX; //finalXPosition
        const _totalScrollAmount = _containerData[2] - uss.getScrollXCalculator(container)();
        _containerData[4]  = _totalScrollAmount > 0 ? 1 : -1;
        _containerData[6]  = _totalScrollAmount * _containerData[4];
        _containerData[8]  = performance.now();
        _containerData[10] = callback;
        return;
      }
    }

    uss.scrollXTo(uss.getScrollXCalculator(container)() + deltaX, container, callback);
  },
  scrollYBy: function (deltaY, container = uss._pageScroller, callback = () => {}, stillStart = true) {
    if(!Number.isFinite(deltaY)) {
      DEFAULT_ERROR_LOGGER("scrollYBy", "a number as the deltaY", deltaY);
      return;
    }
    if(deltaY === 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];

      //A scroll-animation on the y-axis is already being performed and can be repurposed
      if(typeof _containerData[1] !== "undefined" && _containerData[1] !== null)  {
        _containerData[3] += deltaY; //finalYPosition
        const _totalScrollAmount = _containerData[3] - uss.getScrollYCalculator(container)();
        _containerData[5]  = _totalScrollAmount > 0 ? 1 : -1;
        _containerData[7]  = _totalScrollAmount * _containerData[5];
        _containerData[9]  = performance.now();
        _containerData[11] = callback;
        return;
      }
    }

    uss.scrollYTo(uss.getScrollYCalculator(container)() + deltaY, container, callback);
  },
  scrollTo: function (finalXPosition, finalYPosition, container = uss._pageScroller, callback = () => {}) {
    //This object is used to make sure that the passed callback function is called only
    //once all the scroll-animations for the passed container have been performed
    let _callback = {
      __requiredSteps: 1, //Number of the _callback.__function's calls required to trigger the passed scrollTo's callback function
      __currentSteps: 0,  //Number of the current _callback.__function's calls
      __function: typeof callback === "function" ? () => {
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
  scrollBy: function (deltaX, deltaY, container = uss._pageScroller, callback = () => {}, stillStart = true) {
    if(!Number.isFinite(deltaX)) {
      DEFAULT_ERROR_LOGGER("scrollBy", "a number as the deltaX", deltaX);
      return;
    }
    if(!Number.isFinite(deltaY)) {
      DEFAULT_ERROR_LOGGER("scrollBy", "a number as the deltaY", deltaY);
      return;
    }
    if(deltaX === 0 && deltaY === 0) {if(typeof callback === "function") window.requestAnimationFrame(callback); return;}
    if(deltaX === 0) {uss.scrollYBy(deltaY, container, callback, stillStart); return;}
    if(deltaY === 0) {uss.scrollXBy(deltaX, container, callback, stillStart); return;}
    uss.scrollTo(uss.getScrollXCalculator(container)() + deltaX, uss.getScrollYCalculator(container)() + deltaY, container, callback);
  },
  scrollIntoView: function (element, alignToLeft = true, alignToTop = true, callback = () => {}, includeHidden = false) {
    if(element === window) return;
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollIntoView", "an HTMLElement or the Window", element);
      return;
    }

    let _alignToTop  = alignToTop;
    let _alignToLeft = alignToLeft;
    const _container = uss.getScrollableParent(element, includeHidden); //First scrollable parent of the passed element
    let _containerRect = _container !== window ? _container.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
    const _containerWidth = _containerRect.width;
    const _containerHeight = _containerRect.height;

    //_scrollbarDimensions[0] = scrollbar's dimension on the x-axis of the current parent
    //_scrollbarDimensions[1] = scrollbar's dimension on the y-axis of the current parent
    let _scrollbarDimensions = [];

    if(_container === window) {
      _scrollElementContainer();
      return;
    }

    let _containerInitialX = _containerRect.left;
    let _containerInitialY = _containerRect.top;

    //Align to "nearest" is an indirect way to say: Align to "top" / "bottom" / "center"
    if(alignToLeft === "nearest") {
      const _containerToElementLeftDistance   = Math.abs(_containerInitialX);
      const _containerToElementRightDistance  = Math.abs(uss._windowWidth - _containerInitialX - _containerWidth);
      const _containerToElementCenterDistance = Math.abs(uss._windowWidth * 0.5 - _containerInitialX - _containerWidth * 0.5);
      _alignToLeft = _containerToElementLeftDistance < _containerToElementCenterDistance ? true : _containerToElementRightDistance < _containerToElementCenterDistance ? false : null;
    }

    if(alignToTop  === "nearest") {
      const _containerToElementTopDistance    = Math.abs(_containerInitialY);
      const _containerToElementBottomDistance = Math.abs(uss._windowHeight - _containerInitialY - _containerHeight);
      const _containerToElementCenterDistance = Math.abs(uss._windowHeight * 0.5 - _containerInitialY - _containerHeight * 0.5);
      _alignToTop = _containerToElementTopDistance < _containerToElementCenterDistance ? true : _containerToElementBottomDistance < _containerToElementCenterDistance ? false : null;
    }

    const _containerFinalX = _alignToLeft === true ? 0 : _alignToLeft === false ? uss._windowWidth  - _containerWidth  : 0.5 * (uss._windowWidth  - _containerWidth);
    const _containerFinalY = _alignToTop  === true ? 0 : _alignToTop  === false ? uss._windowHeight - _containerHeight : 0.5 * (uss._windowHeight - _containerHeight);

    let _deltaX = _containerInitialX - _containerFinalX; //Passed element containers' remaning scroll amount on the x-axis
    let _deltaY = _containerInitialY - _containerFinalY; //Passed element containers' remaning scroll amount on the y-axis

    const _directionX = _deltaX > 0 ? 1 : -1;
    const _directionY = _deltaY > 0 ? 1 : -1;

    //First scrollable parent of the passed element's container
    let _containerParent = _deltaX * _directionX > 0 && _deltaY * _directionY > 0 ? uss.getScrollableParent(_container,  includeHidden) :
                           _deltaX * _directionX > 0                              ? uss.getXScrollableParent(_container, includeHidden) :
                                                                                    uss.getYScrollableParent(_container, includeHidden);
    _scrollParents();

    function _scrollElementContainer() {
      const _elementRect = element.getBoundingClientRect();
      const _elementInitialX = _elementRect.left - _containerRect.left; //Element's x-coordinate relative to it's container
      const _elementInitialY = _elementRect.top  - _containerRect.top;  //Element's y-coordinate relative to it's container
      const _elementWidth  = _elementRect.width;
      const _elementHeight = _elementRect.height;

      //Align to "nearest" is an indirect way to say: Align to "top" / "bottom" / "center"
      if(alignToLeft === "nearest") {
        const _containerToElementLeftDistance   = Math.abs(_elementInitialX);
        const _containerToElementRightDistance  = Math.abs(_containerWidth - _elementInitialX - _elementWidth);
        const _containerToElementCenterDistance = Math.abs(_containerWidth * 0.5 - _elementInitialX - _elementWidth * 0.5);
        _alignToLeft = _containerToElementLeftDistance < _containerToElementCenterDistance ? true : _containerToElementRightDistance < _containerToElementCenterDistance ? false : null;
      }

      if(alignToTop  === "nearest") {
        const _containerToElementTopDistance    = Math.abs(_elementInitialY);
        const _containerToElementBottomDistance = Math.abs(_containerHeight - _elementInitialY - _elementHeight);
        const _containerToElementCenterDistance = Math.abs(_containerHeight * 0.5 - _elementInitialY - _elementHeight * 0.5);
        _alignToTop = _containerToElementTopDistance < _containerToElementCenterDistance ? true : _containerToElementBottomDistance < _containerToElementCenterDistance ? false : null;
      }

      const _elementFinalX = _alignToLeft === true ? 0 : _alignToLeft === false ? _containerWidth  - _elementWidth  : 0.5 * (_containerWidth  - _elementWidth);
      const _elementFinalY = _alignToTop  === true ? 0 : _alignToTop  === false ? _containerHeight - _elementHeight : 0.5 * (_containerHeight - _elementHeight);
      _getContainerScrollbarDimensions(_container);

      uss.scrollBy(_elementInitialX - _elementFinalX + _scrollbarDimensions[0], _elementInitialY - _elementFinalY + _scrollbarDimensions[1], _container, callback);
    }

    function _getContainerScrollbarDimensions(scrollableContainer) {
      if(scrollableContainer === window) {
        _scrollbarDimensions = [0, 0]; //[Scrollbar width, Scrollbar height]
        return;
      }

      let __scrollBox = document.createElement("div");
      __scrollBox.style.overflow = "scroll";
      scrollableContainer.appendChild(__scrollBox);
      _scrollbarDimensions[0] = __scrollBox.offsetWidth  - __scrollBox.clientWidth;
      _scrollbarDimensions[1] = __scrollBox.offsetHeight - __scrollBox.clientHeight;
      scrollableContainer.removeChild(__scrollBox);
    }

    function _scrollParents() {
      _getContainerScrollbarDimensions(_containerParent);
      uss.scrollBy(_deltaX + _scrollbarDimensions[0], _deltaY + _scrollbarDimensions[1], _containerParent, () => {
        //We won't be able to scroll any further even if we wanted
        if(_containerParent === window) {
          _scrollElementContainer();
          return;
        }

        //Recalculate the passed element container's current position
        _containerRect = _container.getBoundingClientRect();
        _containerInitialX = _containerRect.left;
        _containerInitialY = _containerRect.top;

        //Recalculate the remaning scroll amounts
        _deltaX = _containerInitialX - _containerFinalX;
        _deltaY = _containerInitialY - _containerFinalY;

        //The container is either in the correct position or it cannot be scrolled anymore
        if(_deltaX * _directionX <= 0 && _deltaY * _directionY <= 0) {
          _scrollElementContainer();
          return;
        }

        _containerParent = _deltaX * _directionX > 0 && _deltaY * _directionY > 0 ? uss.getScrollableParent(_containerParent,  includeHidden) :
                           _deltaX * _directionX > 0                              ? uss.getXScrollableParent(_containerParent, includeHidden) :
                                                                                    uss.getYScrollableParent(_containerParent, includeHidden);
        window.requestAnimationFrame(_scrollParents);
      });
    }
  },
  scrollIntoViewIfNeeded: function(element, alignToCenter = true, callback = () => {}, includeHidden = false) {
    if(element === window) return;
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollIntoViewIfNeeded", "an HTMLElement or the Window", element);
      return;
    }

    let _alignToTop, _alignToLeft;
    const _container = uss.getScrollableParent(element, includeHidden); //First scrollable parent of the passed element
    let _containerRect = _container !== window ? _container.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
    const _containerWidth = _containerRect.width;
    const _containerHeight = _containerRect.height;
    let _containerInitialX = _containerRect.left;
    let _containerInitialY = _containerRect.top;

    //_scrollbarDimensions[0] = scrollbar's dimension on the x-axis of the current parent
    //_scrollbarDimensions[1] = scrollbar's dimension on the y-axis of the current parent
    let _scrollbarDimensions = [];
    _getContainerScrollbarDimensions(_container);

    //Container is already in the viewport
    if(_container === window || (_containerInitialX >= 0 && _containerInitialY >= 0 && _containerInitialX + _containerWidth + _scrollbarDimensions[0] <= uss._windowWidth && _containerInitialY + _containerHeight + _scrollbarDimensions[1]  <= uss._windowHeight)) {
      _scrollElementContainer();
      return;
    }

    //2 possible alignments: "nearest" or center
    if(alignToCenter !== true) {
      const _containerToElementLeftDistance   = Math.abs(_containerInitialX);
      const _containerToElementRightDistance  = Math.abs(uss._windowWidth - _containerInitialX - _containerWidth);
      let _containerToElementCenterDistance   = Math.abs(uss._windowWidth * 0.5 - _containerInitialX - _containerWidth * 0.5);
      const _containerToElementTopDistance    = Math.abs(_containerInitialY);
      const _containerToElementBottomDistance = Math.abs(uss._windowHeight - _containerInitialY - _containerHeight);

      _alignToLeft = _containerToElementLeftDistance < _containerToElementCenterDistance ? true : _containerToElementRightDistance < _containerToElementCenterDistance ? false : null;

      _containerToElementCenterDistance = Math.abs(uss._windowHeight * 0.5 - _containerInitialY - _containerHeight * 0.5);

      _alignToTop  = _containerToElementTopDistance < _containerToElementCenterDistance ? true : _containerToElementBottomDistance < _containerToElementCenterDistance ? false : null;
    } else {
      _alignToLeft = null;
      _alignToTop  = null;
    }

    const _containerFinalX = _alignToLeft === true ? 0 : _alignToLeft === false ? uss._windowWidth  - _containerWidth  : 0.5 * (uss._windowWidth  - _containerWidth);
    const _containerFinalY = _alignToTop  === true ? 0 : _alignToTop  === false ? uss._windowHeight - _containerHeight : 0.5 * (uss._windowHeight - _containerHeight);

    let _deltaX = _containerInitialX - _containerFinalX; //Passed element containers' remaning scroll amount on the x-axis
    let _deltaY = _containerInitialY - _containerFinalY; //Passed element containers' remaning scroll amount on the y-axis

    const _directionX = _deltaX > 0 ? 1 : -1;
    const _directionY = _deltaY > 0 ? 1 : -1;

    //First scrollable parent of the passed element's container
    let _containerParent = _deltaX * _directionX > 0 && _deltaY * _directionY > 0 ? uss.getScrollableParent(_container,  includeHidden) :
                           _deltaX * _directionX > 0                              ? uss.getXScrollableParent(_container, includeHidden) :
                                                                                    uss.getYScrollableParent(_container, includeHidden);
    _scrollParents();

    function _scrollElementContainer() {
      const _elementRect = element.getBoundingClientRect();
      const _elementInitialX = _elementRect.left - _containerRect.left; //Element's x-coordinate relative to it's container
      const _elementInitialY = _elementRect.top  - _containerRect.top;  //Element's y-coordinate relative to it's container
      const _elementWidth  = _elementRect.width;
      const _elementHeight = _elementRect.height;

      const _elementOverflowX = _elementInitialX <= 0 && _elementInitialX + _elementWidth  >= _containerWidth;  //Checks if the elements is already in the viewport and its width is bigger than its container's width
      const _elementOverflowY = _elementInitialY <= 0 && _elementInitialY + _elementHeight >= _containerHeight; //Checks if the elements is already in the viewport and its height is bigger than its container's height
      const _elementIntoViewX = _elementInitialX >= 0 && _elementInitialX + _elementWidth + _scrollbarDimensions[0] <= _containerWidth;   //Checks if the element is already in the viewport on the x-axis
      const _elementIntoViewY = _elementInitialY >= 0 && _elementInitialY + _elementHeight + _scrollbarDimensions[1] <= _containerHeight; //Checks if the element is already in the viewport on the y-axis

      //Element is already in the viewport or its size exceed the viewport
      if((_elementOverflowX && _elementOverflowY) || (_elementIntoViewX && _elementIntoViewY)) {
        if(typeof callback === "function") window.requestAnimationFrame(callback);
        return;
      }

      //2 possible alignments: "nearest" or center
      if(alignToCenter !== true) {
        if(!_elementOverflowX && !_elementIntoViewX) {
          const _containerToElementLeftDistance   = Math.abs(_elementInitialX);
          const _containerToElementRightDistance  = Math.abs(_containerWidth - _elementInitialX - _elementWidth);
          const _containerToElementCenterDistance = Math.abs(_containerWidth * 0.5 - _elementInitialX - _elementWidth * 0.5);
          _alignToLeft = _containerToElementLeftDistance < _containerToElementCenterDistance ? true : _containerToElementRightDistance < _containerToElementCenterDistance ? false : null;
        }

        if(!_elementOverflowY && !_elementIntoViewY) {
        const _containerToElementTopDistance    = Math.abs(_elementInitialY);
        const _containerToElementBottomDistance = Math.abs(_containerHeight - _elementInitialY - _elementHeight);
        const _containerToElementCenterDistance = Math.abs(_containerHeight * 0.5 - _elementInitialY - _elementHeight * 0.5);
        _alignToTop = _containerToElementTopDistance < _containerToElementCenterDistance ? true : _containerToElementBottomDistance < _containerToElementCenterDistance ? false : null;
        }
      } else {
        _alignToLeft = null;
        _alignToTop  = null;
      }

      _getContainerScrollbarDimensions(_container);
      const _elementFinalX = _elementOverflowX || _elementIntoViewX ? _elementInitialX + _scrollbarDimensions[0] : _alignToLeft === true ? 0 : _alignToLeft === false ? _containerWidth  - _elementWidth  : 0.5 * (_containerWidth  - _elementWidth);
      const _elementFinalY = _elementOverflowY || _elementIntoViewY ? _elementInitialY + _scrollbarDimensions[1] : _alignToTop  === true ? 0 : _alignToTop  === false ? _containerHeight - _elementHeight : 0.5 * (_containerHeight - _elementHeight);

      uss.scrollBy(_elementInitialX - _elementFinalX + _scrollbarDimensions[0], _elementInitialY - _elementFinalY + _scrollbarDimensions[1], _container, callback);
    }

    function _getContainerScrollbarDimensions(scrollableContainer) {
      if(scrollableContainer === window) {
        _scrollbarDimensions = [0, 0]; //[Scrollbar width, Scrollbar height]
        return;
      }

      let __scrollBox = document.createElement("div");
      __scrollBox.style.overflow = "scroll";
      scrollableContainer.appendChild(__scrollBox);
      _scrollbarDimensions[0] = __scrollBox.offsetWidth  - __scrollBox.clientWidth;
      _scrollbarDimensions[1] = __scrollBox.offsetHeight - __scrollBox.clientHeight;
      scrollableContainer.removeChild(__scrollBox);
    }

    function _scrollParents() {
      _getContainerScrollbarDimensions(_containerParent);
      uss.scrollBy(_deltaX + _scrollbarDimensions[0], _deltaY + _scrollbarDimensions[1], _containerParent, () => {
        //We won't be able to scroll any further even if we wanted
        if(_containerParent === window) {
          _scrollElementContainer();
          return;
        }

        //Recalculate the passed element container's current position
        _containerRect = _container.getBoundingClientRect();
        _containerInitialX = _containerRect.left;
        _containerInitialY = _containerRect.top;

        //Recalculate the remaning scroll amounts
        _deltaX = _containerInitialX - _containerFinalX;
        _deltaY = _containerInitialY - _containerFinalY;

        //The container is either in the correct position or it cannot be scrolled anymore
        if(_deltaX * _directionX <= 0 && _deltaY * _directionY <= 0) {
          _scrollElementContainer();
          return;
        }

        _containerParent = _deltaX * _directionX > 0 && _deltaY * _directionY > 0 ? uss.getScrollableParent(_containerParent,  includeHidden) :
                           _deltaX * _directionX > 0                              ? uss.getXScrollableParent(_containerParent, includeHidden) :
                                                                                    uss.getYScrollableParent(_containerParent, includeHidden);
        window.requestAnimationFrame(_scrollParents);
      });
    }
  },
  stopScrollingX: function (container = uss._pageScroller, callback = () => {}) {
    const _containerData = uss._containersData.get(container);
    if(typeof _containerData !== "undefined") {
      window.cancelAnimationFrame(_containerData[0]);
      _containerData[0] = null;
    }
    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrollingY: function (container = uss._pageScroller, callback = () => {}) {
    const _containerData = uss._containersData.get(container);
    if(typeof _containerData !== "undefined") {
      window.cancelAnimationFrame(_containerData[1]);
      _containerData[1] = null;
    }
    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrolling: function (container = uss._pageScroller, callback = () => {}) {
    const _containerData = uss._containersData.get(container);
    if(typeof _containerData !== "undefined") {
      window.cancelAnimationFrame(_containerData[0]);
      window.cancelAnimationFrame(_containerData[1]);
      _containerData[0] = null;
      _containerData[1] = null;
    }
    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  hrefSetup: function (alignToLeft = true, alignToTop = true, init = () => {}, callback = () => {}, includeHidden = false) {
    const _init = typeof init === "function" ? init : () => {};
    const _pageLinks = document.links;
    const _pageURL = document.URL.split("#")[0];

    for(const _pageLink of _pageLinks) {
      const _pageLinkParts = _pageLink.href.split("#"); //PageLink.href = OptionalURL#Section
      if(_pageLinkParts[0] !== _pageURL) continue;
      if(_pageLinkParts[1] === "") { //href="#" scrolls the _pageScroller to its top
        _pageLink.addEventListener("click", event => {
          event.preventDefault();
          if(_init(_pageLink, uss._pageScroller) === false) return; //False means the scroll-animation has been explicitly prevented
          uss.scrollYTo(0, uss._pageScroller, callback);
        }, {passive:false});
        continue;
      }

      //Look for elements with the corresponding id or "name" attribute
      const _elementToReach = document.getElementById(_pageLinkParts[1]) || document.querySelector("a[name='" + _pageLinkParts[1] + "']");
      if(_elementToReach === null) {
        DEFAULT_WARNING_LOGGER(_pageLinkParts[1], "is not a valid anchor's destination");
        continue;
      }

      _pageLink.addEventListener("click", event => {
        event.preventDefault();
        if(_init(_pageLink, _elementToReach) === false) return; //False means the scroll-animation has been explicitly prevented
        uss.scrollIntoView(_elementToReach, alignToLeft, alignToTop, callback, includeHidden);
      }, {passive:false});
    }
  }
}

window.addEventListener("resize", () => {uss._windowHeight = window.innerHeight; uss._windowWidth = window.innerWidth;} , {passive:true});
try { //Chrome, Firefox & Safari >= 14
  window.matchMedia("(prefers-reduced-motion)").addEventListener("change", () => {
    uss._reducedMotion = !uss._reducedMotion;
    const _containers  = uss._containersData.keys();
    for(let _container of _containers) uss.stopScrolling(_container);
  }, {passive:true});
} catch(e) { //Safari < 14
  window.matchMedia("(prefers-reduced-motion)").addListener(() => {
    uss._reducedMotion = !uss._reducedMotion;
    const _containers  = uss._containersData.keys();
    for(let _container of _containers) uss.stopScrolling(_container);
  }, {passive:true});
}
