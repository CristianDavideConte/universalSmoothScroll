/*
 * CONSTANTS (INTERNAL USE):
 *
 * INITIAL_WINDOW_HEIGHT: number, the window's inner height (in px) when the page is first loaded.
 * INITIAL_WINDOW_WIDTH: number, the window's inner width (in px) when the page is first loaded.
 * DEFAULT_XSTEP_LENGTH: number, the initial value of the uss._xStepLength variable: it represents the default number of pixels scrolled in a single scroll-animation's step on the x-axis. 
 *                       It's 16px at 412px of (initial window's) width and 23px at 1920px of (initial window's) width.
 * DEFAULT_YSTEP_LENGTH: number, The initial value of the uss._yStepLength variable: it represents the default number of pixels scrolled in a single scroll-animation's step on the y-axis. 
 *                       It's 38px at 789px of (initial window's) height and 22px at 1920px of (initial window's) height.
 * DEFAULT_MIN_ANIMATION_FRAMES: number, The initial value of the `uss._minAnimationFrame` variable: 
 *                               it represent the default lowest number of frames any scroll-animation should last if no StepLengthCalculator is set for a container.
 * DEFAULT_TEST_CALCULATOR_SCROLL_VALUE: number, the default number of pixel scrolled when testing a newScrollCalculator.
 * DEFAULT_TEST_CALCULATOR_DURATION: number, the default number of milliseconds the test of a newStepLengthCalculator should last.
 * DEFAULT_ERROR_LOGGER: function, logs the API error messages inside the browser's console.
 * DEFAULT_WARNING_LOGGER: function, logs the API warning messages inside the browser's console.
 */


/*
 * VARIABLES (INTERNAL USE):
 *
 * _containersData: Map(Container, Array[]), a map in which:
 *                  1) A key is a DOM element internally called "container".
 *                  2) A value is an array with 14 values, which are:
 *                     [0] contains the ID of a requested scroll-animation on the x-axis of this container provided by the requestAnimationFrame method.
 *                         It's null or undefined if no scroll-animation on the x-axis of this container is currently being performed.
 *                     [1] contains the ID of a requested scroll-animation on the y-axis of this container provided by the requestAnimationFrame method.
 *                         It's null or undefined if no scroll-animation on the y-axis of this container is currently being performed.
 *                     [2] contains the final position (in px) at which this container will be at the end of the scroll-animation on the x-axis.
 *                     [3] contains the final position (in px) at which this container will be at the end of the scroll-animation on the y-axis.
 *                     [4] contains the direction of the current scroll-animation on the x-axis of this container:
 *                         1 if the scrolling is from right-to-left, -1 otherwise.
 *                     [5] contains the direction of the current scroll-animation on the y-axis of this container:
 *                         1 if the scrolling is from bottom-to-top, -1 otherwise.
 *                     [6] contains the total amount of pixels that have to be scrolled by current scroll-animation on the x-axis of this container.
 *                     [7] contains the total amount of pixels that have to be scrolled by current scroll-animation on the y-axis of this container.
 *                     [8] contains the starting time in milliseconds (as a DOMHighResTimeStamp) of the current scroll-animation on the x-axis of this container.
 *                     [9] contains the starting time in milliseconds (as a DOMHighResTimeStamp) of the current scroll-animation on the y-axis of this container.
 *                     [10] contains a callback function that will be executed when the current scroll-animation on the x-axis of this container has been performed.
 *                     [11] contains a callback function that will be executed when the current scroll-animation on the y-axis of this container has been performed.
 *                     [12] contains the StepLengthCalculator that controls the scroll-animations on the x-axis of this container.
 *                     [13] contains the StepLengthCalculator that controls the scroll-animations on the y-axis of this container.
 *                     [14] contains the StepLengthCalculator that controls the scroll-animations on the x-axis of this container.
 *                          If valid, replaces [12] for the current scroll-animation on the x-axis of this container and it's automatically invalidated at the end.
 *                     [15] contains the StepLengthCalculator that controls the scroll-animations on the y-axis of this container.
 *                          If valid, replaces [13] for the current scroll-animation on the y-axis of this container and it's automatically invalidated at the end.
 * _xStepLength: number, if there's no StepLengthCalculator set for a container, this represent the number of pixels scrolled during a single scroll-animation's step on the x-axis of that container.
 * _yStepLength: number, if there's no StepLengthCalculator set for a container, this represent the number of pixels scrolled during a single scroll-animation's step on the y-axis of that container.
 * _minAnimationFrame: number, if there's no StepLengthCalculator set for a container, this represent the minimum number of frames any scroll-animation, on any axis of that container, should last.
 * _windowHeight: number, the current window's inner heigth (in px).
 * _windowWidth: number, the current window's inner width (in px).
 * _scrollbarsMaxDimension: number, the highest amount of pixels any scrollbar on the page can occupy (it's browser dependent).
 * _pageScroller: object, the value used when an API method requires the "container" input parameter but nothing is passed: 
 *                it should be used to tell the USS API which is the element that scrolls the document.
 * _reducedMotion: boolean, true if the user has enabled any reduce-motion setting devicewise, false otherwise. 
 *                 Internally used by the API to follow the user's accessibility preferences, reverting back every scroll-animation to the default jump-to-position behavior.
 * _debugMode: string, controls the way the warning and error messages are logged in the browser's console.
 *             If it's set to:
 *             - "disabled" (case insensitive) the API won't show any warning or error message. 
 *             - "legacy" (case insensitive) the API won't style any warning or error message.
 *             Any other value will make the warning and error messages be displayed with the default API's styling.
 */


/*
 * FUNCTIONS (PUBLIC USE):
 *
 * isXscrolling: function, returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
 * isYscrolling: function, returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
 * isScrolling:  function, returns true if a scroll-animation on any axis of the passed container is currently being performed by this API, false otherwise.
 * getFinalXPosition: function, returns the position (in px) at which the passed container will be at the end of the scroll-animation on the x-axis.
 *                    The current position is returned if no scroll-animation is in place.
 * getFinalYPosition: function, returns the position (in px) at which the passed container will be at the end of the scroll-animation on the y-axis.
 *                    The current position is returned if no scroll-animation is in place.
 * getScrollXDirection: function, returns the direction of the current scroll-animation on the x-axis of the passed container:
 *                      1 if its scrollLeft/scrollX will increase, -1 if its scrollLeft/scrollX will decrease, 0 if there's no scroll-animation.
 * getScrollYDirection: function, returns the direction of the current scroll-animation on the y-axis of the passed container:
 *                      1 if its scrollTop/scrollY will increase, -1 if its scrollTop/scrollY will decrease, 0 if there's no scroll-animation.
 * getXStepLengthCalculator: function, returns the current StepLengthCalculator which controls the animations on the x-axis of the passed container if available.
 * getYStepLengthCalculator: function, returns the current StepLengthCalculator which controls the animations on the y-axis of the passed container if available.
 * getXStepLength: function, returns the value of the "_xStepLength" property.
 * getYStepLength: function, returns the value of the "_yStepLength" property.
 * getMinAnimationFrame: function, returns the value of the "_minAnimationFrame" property.
 * getWindowHeight: function, returns the value of the "_windowHeight" property.
 * getWindowWidth: function, returns the value of the "_windowWidth" property.
 * getScrollbarsMaxDimension: function, returns the value of the "_scrollbarsMaxDimension" property.
 * getPageScroller: function, returns the value of the "_pageScroller" property.
 * getReducedMotionState: function, returns the value of the "_reducedMotion" property.
 * getDebugMode: function, returns the value of the "_debugMode" property.
 * setXStepLengthCalculator: function, sets the StepLengthCalculator for (the x-axis of) the passed container if compatible.
 * setYStepLengthCalculator: function, sets the StepLengthCalculator for (the y-axis of) the passed container if compatible.
 * setStepLengthCalculator: function, sets the StepLengthCalculator for (both the y and x axes of) the passed container if compatible.
 * setXStepLength: function, sets the "_xStepLength" property to the passed value if compatible.
 * setYStepLength: function, sets the "_yStepLength" property to the passed value if compatible.
 * setStepLength: function, sets both the "_xStepLength" and the "_yStepLength" properties to the passed value if compatible.
 * setMinAnimationFrame: function, sets the "_minAnimationFrame" property to the passed value if compatible.
 * setPageScroller: function, sets the "_pageScroller" property to the passed value if compatible.
 * setDebugMode: function, sets the "_debugMode" property to the passed value if compatible.
 * calcXStepLength: function, returns how long each animation-step on the x-axis must be in order to target the "_minAnimationFrame" property value.  
 *                            This function can be considered the default StepLengthCalculator for any scroll-animation on the x-axis of any container.
 * calcYStepLength: function, returns how long each animation-step on the y-axis must be in order to target the "_minAnimationFrame" property value.
 *                            This function can be considered the default StepLengthCalculator for any scroll-animation on the y-axis of any container.
 * calcScrollbarsDimensions: function, returns an array containing 2 numbers:
 *                           [0] contains the vertical scrollbar's width (in px) of the passed element.
 *                           [1] contains the horizontal scrollbar's height (in px) of the passed element.
 * calcBordersDimensions: function, returns an array containing 4 numbers:
 *                        [0] contains the top border's height (in px) of the passed element.
 *                        [1] contains the right border's width (in px) of the passed element.
 *                        [2] contains the bottom border's height (in px) of the passed element.
 *                        [3] contains the left border's width (in px) of the passed element.
 *                        The returned border sizes don't take into consideration the css "transform" property's effects. 
 * getScrollXCalculator: function, returns a function that returns:
 *                       - The scrollLeft property of the passed container if it's an instance of HTMLElement.
 *                       - The scrollX property of the passed container if it's the window element.
 * getScrollYCalculator: function, returns a function that returns:
 *                       - The scrollTop property of the passed container if it's an instance of HTMLElement.
 *                       - The scrollY property of the passed container if it's the window element.
 * getMaxScrollX: function, returns the highest reacheable scrollLeft/scrollX value of the passed container.
 * getMaxScrollY: function, returns the highest reacheable scrollTop/scrollY value of the passed container.
 * getXScrollableParent: function, returns the first scrollable container (on the x-axis) of the passed element or null if it doesn't have one. 
 * getYScrollableParent: function, returns the first scrollable container (on the y-axis) of the passed element or null if it doesn't have one.
 * getScrollableParent: function, returns the first scrollable container (on either the x or y axis) of the passed element or null if it doesn't have one. 
 * getAllScrollableParents: function, returns an array containing all the scrollable containers (on either the x or y axis) of the passed element.
 * scrollXTo: function, scrolls the x-axis of the passed container to the specified position (in px) if possible.
 * scrollYTo: function, scrolls the y-axis of the passed container to the specified position (in px) if possible.
 * scrollXBy: function, scrolls the x-axis the passed container by the specified amount of pixels if possible.
 * scrollYBy: function, scrolls the y-axis the passed container by the specified amount of pixels if possible.
 * scrollTo: function, scrolls both the x and y axes of the passed container to the specified positions (in px) if possible.
 * scrollBy: function, scrolls both the x and y axes of the passed container by the specified amount of pixels if possible.
 * scrollIntoView: function, scrolls all the scrollable parents of the passed element in order to make it visible on the screen with the specified alignments.
 * scrollIntoViewIfNeeded: function, scrolls all the scrollable parents of the passed element in order to make it visible on the screen with the specified alignment
 *                         only if it's not already visible.
 * stopScrollingX: function, stops all the current scroll-animation on the x-axis of the passed container.
 * stopScrollingY: function, stops all the current scroll-animation on the y-axis of the passed container.
 * stopScrolling: function, stops all the current scroll-animation on both the x and y axes of the passed container.
 * stopScrollingAll: function, stops all the current scroll-animations on both the x and y axes of all the containers.
 * hrefSetup: function, automatically binds every valid anchor (<a> and <area> in the DOM) to the corresponding element that should be scrolled into view.
 *                      Whenever a valid anchor is clicked the passed init function is invoked and if it doesn't return "false", 
 *                      a scroll-animation will bring into view the linked element and the browser's history will be updated (if requested).
 */
"use strict";

const INITIAL_WINDOW_WIDTH  = window.innerWidth;
const INITIAL_WINDOW_HEIGHT = window.innerHeight;
const DEFAULT_XSTEP_LENGTH = 16 + 7 / 1508 * (INITIAL_WINDOW_WIDTH - 412);                         //16px at 412px of width  && 23px at 1920px of width 
const DEFAULT_YSTEP_LENGTH = Math.max(1, Math.abs(38 - 20 / 140 * (INITIAL_WINDOW_HEIGHT - 789))); //38px at 789px of height && 22px at 1920px of height
const DEFAULT_MIN_ANIMATION_FRAMES = INITIAL_WINDOW_HEIGHT / DEFAULT_YSTEP_LENGTH;                 //51 frames at 929px of height
const DEFAULT_TEST_CALCULATOR_SCROLL_VALUE = 100; //in px
const DEFAULT_TEST_CALCULATOR_DURATION = 5000;    //in ms
const DEFAULT_ERROR_LOGGER  = (functionName, expectedValue, receivedValue) => {
  if(/disabled/i.test(uss._debugMode)) return;
  
  //Convert and trim the receivedValue's string
  const _receivedValueIsString = typeof receivedValue === "string";
  receivedValue = receivedValue === null ? "null" : receivedValue === undefined ? "undefined" : receivedValue.name || receivedValue.toString().replace(new RegExp("\n", "g"), "");
  if(receivedValue.length > 40) receivedValue = receivedValue.slice(0, 40) + " ...";
  if(_receivedValueIsString) receivedValue = "\"" + receivedValue + "\"";

  if(/legacy/i.test(uss._debugMode)) {
    console.log("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)\n");
    console.error("USS ERROR\n", functionName, "was expecting", expectedValue + ", but received", receivedValue + ".");
    return;
  }

  console.group("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");

    console.log("%cUSS ERROR", "font-family:system-ui; font-weight:800; font-size:40px; background:#eb445a; color:black; border-radius:5px; padding:0.4vh 0.5vw; margin:1vh 0");
    console.log("%c" + functionName + "%cwas expecting " + expectedValue,
                "font-style:italic; font-family:system-ui; font-weight:700; font-size:17px; background:#2dd36f; color:black; border-radius:5px 0px 0px 5px; padding:0.4vh 0.5vw; margin-left:13px",
                "font-family:system-ui; font-weight:600; font-size:17px; background:#2dd36f; color:black; border-radius:0px 5px 5px 0px; padding:0.4vh 0.5vw"
               );
    console.log("%cBut received%c" + receivedValue,
                "font-family:system-ui; font-weight:600; font-size:17px; background:#eb445a; color:black; border-radius:5px 0px 0px 5px; padding:0.4vh 0.5vw; margin-left:13px",
                "font-style:italic; font-family:system-ui; font-weight:700; font-size:17px; background:#eb445a; color:black; border-radius:0px 5px 5px 0px; padding:0.4vh 0.5vw"
               );

    console.groupCollapsed("%cStack Trace", "font-family:system-ui; font-weight:500; font-size:17px; background:#3171e0; color:#f5f6f9; border-radius:5px; padding:0.3vh 0.5vw; margin-left:13px");
      console.trace("");
    console.groupEnd("Stack Trace");

  console.groupEnd("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");
}

const DEFAULT_WARNING_LOGGER = (subject, message, keepQuotesForString = true) => {
  if(/disabled/i.test(uss._debugMode)) return;

  //Convert and trim the subject's string
  subject = subject === null ? "null" : subject === undefined ? "undefined" : subject.name || subject.toString().replace(new RegExp("\n", "g"), "");
  if(subject.length > 30) subject = subject.slice(0, 30) + " ...";
  if(keepQuotesForString && typeof subject === "string") subject = "\"" + subject + "\"";

  if(/legacy/i.test(uss._debugMode)) {
    console.log("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)\n");
    console.warn("USS WARNING\n", subject, message + ".");
    return;
  }

  console.groupCollapsed("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");

    console.log("%cUSS WARNING", "font-family:system-ui; font-weight:800; font-size:40px; background:#fcca03; color:black; border-radius:5px; padding:0.4vh 0.5vw; margin:1vh 0");
    console.log("%c" + subject + "%c" + message,
                "font-style:italic; font-family:system-ui; font-weight:700; font-size:17px; background:#fcca03; color:black; border-radius:5px 0px 0px 5px; padding:0.4vh 0.5vw; margin-left:13px",
                "font-family:system-ui; font-weight:600; font-size:17px; background:#fcca03; color:black; border-radius:0px 5px 5px 0px; padding:0.4vh 0.5vw"
               );

    console.groupCollapsed("%cStack Trace", "font-family:system-ui; font-weight:500; font-size:17px; background:#3171e0; color:#f5f6f9; border-radius:5px; padding:0.3vh 0.5vw; margin-left:13px");
      console.trace("");
    console.groupEnd("Stack Trace");

  console.groupEnd("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");
}

var uss = {
  _containersData: new Map(),
  _xStepLength: DEFAULT_XSTEP_LENGTH,
  _yStepLength: DEFAULT_YSTEP_LENGTH,
  _minAnimationFrame: DEFAULT_MIN_ANIMATION_FRAMES,
  _windowHeight: INITIAL_WINDOW_HEIGHT,
  _windowWidth:  INITIAL_WINDOW_WIDTH,
  _scrollbarsMaxDimension: 0,
  _pageScroller: document.scrollingElement || window,
  _reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches,
  _debugMode: "",
  isXscrolling: (container = uss._pageScroller) => {
    if(container === window || container instanceof HTMLElement) {
      const _containerData = uss._containersData.get(container) || [];
      return !!_containerData[0];
    }
    DEFAULT_ERROR_LOGGER("isXscrolling", "the container to be an HTMLElement or the Window", container);
  },
  isYscrolling: (container = uss._pageScroller) => {
    if(container === window || container instanceof HTMLElement) {
      const _containerData = uss._containersData.get(container) || [];
      return !!_containerData[1];
    }
    DEFAULT_ERROR_LOGGER("isYscrolling", "the container to be an HTMLElement or the Window", container);
  },
  isScrolling: (container = uss._pageScroller) => {
    if(container === window || container instanceof HTMLElement) { 
      const _containerData = uss._containersData.get(container) || [];
      return !!_containerData[0] || !!_containerData[1];
    }
    DEFAULT_ERROR_LOGGER("isScrolling", "the container to be an HTMLElement or the Window", container);
  },
  getFinalXPosition: (container = uss._pageScroller) => {
    if(container === window || container instanceof HTMLElement) { 
      //If there's no scroll-animation on the x-axis, the current position is returned instead
      const _containerData = uss._containersData.get(container) || [];
      return _containerData[2] === 0 ? 0 : _containerData[2] || uss.getScrollXCalculator(container)();
    }
    DEFAULT_ERROR_LOGGER("getFinalXPosition", "the container to be an HTMLElement or the Window", container);
  },
  getFinalYPosition: (container = uss._pageScroller) => {
    if(container === window || container instanceof HTMLElement) { 
      //If there's no scroll-animation on the y-axis, the current position is returned instead
      const _containerData = uss._containersData.get(container) || [];
      return _containerData[3] === 0 ? 0 : _containerData[3] || uss.getScrollYCalculator(container)();
    }
    DEFAULT_ERROR_LOGGER("getFinalYPosition", "the container to be an HTMLElement or the Window", container);
  },
  getScrollXDirection: (container = uss._pageScroller) => {
    if(container === window || container instanceof HTMLElement) { 
      //If there's no scroll-animation on the x-axis, 0 is returned instead
      const _containerData = uss._containersData.get(container) || [];
      return _containerData[4] || 0;
    }
    DEFAULT_ERROR_LOGGER("getScrollXDirection", "the container to be an HTMLElement or the Window", container);
  },
  getScrollYDirection: (container = uss._pageScroller) => {
    if(container === window || container instanceof HTMLElement) { 
      //If there's no scroll-animation on the y-axis, 0 is returned instead
      const _containerData = uss._containersData.get(container) || [];
      return _containerData[5] || 0;
    }
    DEFAULT_ERROR_LOGGER("getScrollYDirection", "the container to be an HTMLElement or the Window", container);  
  },
  getXStepLengthCalculator: (container = uss._pageScroller, getTemporary = false) => {
    if(container === window || container instanceof HTMLElement) { 
      const _containerData = uss._containersData.get(container) || [];
      return getTemporary ? _containerData[14] : _containerData[12];
    }
    DEFAULT_ERROR_LOGGER("getXStepLengthCalculator", "the container to be an HTMLElement or the Window", container);
  },
  getYStepLengthCalculator: (container = uss._pageScroller, getTemporary = false) => {    
    if(container === window || container instanceof HTMLElement) { 
      const _containerData = uss._containersData.get(container) || [];
      return getTemporary ? _containerData[15] : _containerData[13];
    }
    DEFAULT_ERROR_LOGGER("getYStepLengthCalculator", "the container to be an HTMLElement or the Window", container);
  },
  getXStepLength: () => uss._xStepLength,
  getYStepLength: () => uss._yStepLength,
  getMinAnimationFrame: () => uss._minAnimationFrame,
  getWindowHeight: () => uss._windowHeight,
  getWindowWidth:  () => uss._windowWidth,
  getScrollbarsMaxDimension: () => uss._scrollbarsMaxDimension,
  getPageScroller: () => uss._pageScroller,
  getReducedMotionState: () => uss._reducedMotion,
  getDebugMode: () => uss._debugMode, 
  setXStepLengthCalculator: (newCalculator, container = uss._pageScroller, isTemporary = false, shouldBeTested = false) => {
    if(typeof newCalculator !== "function") {
      DEFAULT_ERROR_LOGGER("setXStepLengthCalculator", "the newCalculator to be a function", newCalculator);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("setXStepLengthCalculator", "the container to be an HTMLElement or the Window", container);
      return;
    }
    //If requested, a full scroll-animation is simulated to test newCalculator
    if(shouldBeTested) {
      const _originalTimestamp = performance.now();
      let _remaningScrollAmount = DEFAULT_TEST_CALCULATOR_SCROLL_VALUE;
      let _currentTimestamp;
      do {
        _currentTimestamp = performance.now();
        const _testResult = newCalculator(
                              _remaningScrollAmount,                                        //remaningScrollAmount
                              _originalTimestamp,                                           //originalTimestamp
                              _currentTimestamp,                                            //currentTimestamp
                              DEFAULT_TEST_CALCULATOR_SCROLL_VALUE,                         //totalScrollAmount
                              DEFAULT_TEST_CALCULATOR_SCROLL_VALUE - _remaningScrollAmount, //currentXPosition
                              DEFAULT_TEST_CALCULATOR_SCROLL_VALUE,                         //finalXPosition
                              container                                                     //container
                            );
        if(!Number.isFinite(_testResult)) {
          DEFAULT_ERROR_LOGGER("setXStepLengthCalculator", "the newCalculator to return a valid step value", _testResult);
          return;
        }
        _remaningScrollAmount -= _testResult;    
      } while(_remaningScrollAmount > 0 && _currentTimestamp - _originalTimestamp <= DEFAULT_TEST_CALCULATOR_DURATION);
      //The passed stepLengthCalculator may have entered a loop
      if(_currentTimestamp - _originalTimestamp > DEFAULT_TEST_CALCULATOR_DURATION) {
        DEFAULT_WARNING_LOGGER(newCalculator.name || "the passed calculator", 
                              "didn't complete the test scroll-animation within " + DEFAULT_TEST_CALCULATOR_DURATION + "ms", 
                              false);
      }
    }
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];
    if(isTemporary) _containerData[14] = newCalculator;
    else {
      _containerData[12] = newCalculator;
      if(!!_containerData[14]) _containerData[14] = null; //Setting a non-temporary StepLengthCalculator will unset the temporary one
    }
    if(!_oldData) uss._containersData.set(container, _containerData);
  },
  setYStepLengthCalculator: (newCalculator, container = uss._pageScroller, isTemporary = false, shouldBeTested = false) => {
    if(typeof newCalculator !== "function") {
      DEFAULT_ERROR_LOGGER("setYStepLengthCalculator", "the newCalculator to be a function", newCalculator);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("setYStepLengthCalculator", "the container to be an HTMLElement or the Window", container);
      return;
    }
    //If requested, a full scroll-animation is simulated to test newCalculator
    if(shouldBeTested) {
      const _originalTimestamp = performance.now();
      let _remaningScrollAmount = DEFAULT_TEST_CALCULATOR_SCROLL_VALUE;
      let _currentTimestamp;
      do {
        _currentTimestamp = performance.now();
        const _testResult = newCalculator(
                              _remaningScrollAmount,                                        //remaningScrollAmount
                              _originalTimestamp,                                           //originalTimestamp
                              _currentTimestamp,                                            //currentTimestamp
                              DEFAULT_TEST_CALCULATOR_SCROLL_VALUE,                         //totalScrollAmount
                              DEFAULT_TEST_CALCULATOR_SCROLL_VALUE - _remaningScrollAmount, //currentXPosition
                              DEFAULT_TEST_CALCULATOR_SCROLL_VALUE,                         //finalXPosition
                              container                                                     //container
                            );
        if(!Number.isFinite(_testResult)) {
          DEFAULT_ERROR_LOGGER("setYStepLengthCalculator", "the newCalculator to return a valid step value", _testResult);
          return;
        }
        _remaningScrollAmount -= _testResult;     
      } while(_remaningScrollAmount > 0 && _currentTimestamp - _originalTimestamp <= DEFAULT_TEST_CALCULATOR_DURATION);
      //The passed stepLengthCalculator may have entered a loop
      if(_currentTimestamp - _originalTimestamp > DEFAULT_TEST_CALCULATOR_DURATION) {
        DEFAULT_WARNING_LOGGER(newCalculator.name || "the passed calculator", 
                              "didn't complete the test scroll-animation within " + DEFAULT_TEST_CALCULATOR_DURATION + "ms", 
                              false);
      }
    }
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];
    if(isTemporary) _containerData[15] = newCalculator;
    else {
      _containerData[13] = newCalculator;
      if(!!_containerData[15]) _containerData[15] = null; //Setting a non-temporary StepLengthCalculator will unset the temporary one
    }
    if(!_oldData) uss._containersData.set(container, _containerData);
  },
  setStepLengthCalculator: (newCalculator, container = uss._pageScroller, isTemporary = false, shouldBeTested = false) => {
    if(typeof newCalculator !== "function") {
      DEFAULT_ERROR_LOGGER("setStepLengthCalculator", "the newCalculator to be a function", newCalculator);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("setStepLengthCalculator", "the container to be an HTMLElement or the Window", container);
      return;
    }
    //If requested, a full scroll-animation is simulated to test newCalculator
    if(shouldBeTested) {
      const _originalTimestamp = performance.now();
      let _remaningScrollAmount = DEFAULT_TEST_CALCULATOR_SCROLL_VALUE;
      let _currentTimestamp;
      do {
        _currentTimestamp = performance.now();
        const _testResult = newCalculator(
                              _remaningScrollAmount,                                        //remaningScrollAmount
                              _originalTimestamp,                                           //originalTimestamp
                              _currentTimestamp,                                            //currentTimestamp
                              DEFAULT_TEST_CALCULATOR_SCROLL_VALUE,                         //totalScrollAmount
                              DEFAULT_TEST_CALCULATOR_SCROLL_VALUE - _remaningScrollAmount, //currentXPosition
                              DEFAULT_TEST_CALCULATOR_SCROLL_VALUE,                         //finalXPosition
                              container                                                     //container
                            );
        if(!Number.isFinite(_testResult)) {
          DEFAULT_ERROR_LOGGER("setStepLengthCalculator", "the newCalculator to return a valid step value", _testResult);
          return;
        }
        _remaningScrollAmount -= _testResult;     
      } while(_remaningScrollAmount > 0 && _currentTimestamp - _originalTimestamp <= DEFAULT_TEST_CALCULATOR_DURATION);
      //The passed stepLengthCalculator may have entered a loop
      if(_currentTimestamp - _originalTimestamp > DEFAULT_TEST_CALCULATOR_DURATION) {
        DEFAULT_WARNING_LOGGER(newCalculator.name || "the passed calculator", 
                              "didn't complete the test scroll-animation within " + DEFAULT_TEST_CALCULATOR_DURATION + "ms", 
                              false);
      }
    }
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];
    if(isTemporary) {
      _containerData[14] = newCalculator;
      _containerData[15] = newCalculator;
    } else {
      _containerData[12] = newCalculator;
      _containerData[13] = newCalculator;

      //Setting a non-temporary StepLengthCalculators will unset the temporary ones
      if(!!_containerData[14]) _containerData[14] = null;
      if(!!_containerData[15]) _containerData[15] = null;
    }
    if(!_oldData) uss._containersData.set(container, _containerData);
  },
  setXStepLength: (newXStepLength) => {
    if(!Number.isFinite(newXStepLength) || newXStepLength <= 0) {
      DEFAULT_ERROR_LOGGER("setXStepLength", "the newXStepLength to be a positive number", newXStepLength);
      return;
    }
    uss._xStepLength = newXStepLength;
  },
  setYStepLength: (newYStepLength) => {
    if(!Number.isFinite(newYStepLength) || newYStepLength <= 0) {
      DEFAULT_ERROR_LOGGER("setYStepLength", "the newYStepLength to be a positive number", newYStepLength);
      return;
    }
    uss._yStepLength = newYStepLength;
  },
  setStepLength: (newStepLength) => {
    if(!Number.isFinite(newStepLength) || newStepLength <= 0) {
      DEFAULT_ERROR_LOGGER("setStepLength", "the newStepLength to be a positive number", newStepLength);
      return;
    }
    uss._xStepLength = newStepLength;
    uss._yStepLength = newStepLength;
  },
  setMinAnimationFrame: (newMinAnimationFrame) => {
    if(!Number.isFinite(newMinAnimationFrame) || newMinAnimationFrame <= 0) {
      DEFAULT_ERROR_LOGGER("setMinAnimationFrame", "the newMinAnimationFrame to be a positive number", newMinAnimationFrame);
      return;
    }
    uss._minAnimationFrame = newMinAnimationFrame;
  },
  setPageScroller: (newPageScroller) => {
    if(newPageScroller !== window && !(newPageScroller instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("setPageScroller", "the newPageScroller to be an HTMLElement or the Window", newPageScroller);
      return;
    }
    uss._pageScroller = newPageScroller;
  },
  setDebugMode: (newDebugMode = "") => {
    if(typeof newDebugMode !== "string") {
      let _oldMode = null;
      if(/disabled/i.test(uss._debugMode)) {
        _oldMode = uss._debugMode;
        uss._debugMode = "legacy"; //Temporarily set the debug mode to "legacy" to show the error 
      }
      DEFAULT_ERROR_LOGGER("setDebugMode", "the newDebugMode to be \"disabled\", \"legacy\" or any other string", newDebugMode);
      if(!!_oldMode) uss._debugMode = _oldMode;
      return;
    }
    uss._debugMode = newDebugMode;
  },
  calcXStepLength: (deltaX) => {
    if(!Number.isFinite(deltaX) || deltaX < 0) {
      DEFAULT_ERROR_LOGGER("calcXStepLength", "the deltaX to be a positive number", deltaX);
      throw "USS fatal error (execution stopped)";
    }
    return deltaX >= uss._minAnimationFrame * uss._xStepLength ? uss._xStepLength : Math.ceil(deltaX / uss._minAnimationFrame);
  },
  calcYStepLength: (deltaY) => {
    if(!Number.isFinite(deltaY) || deltaY < 0) {
      DEFAULT_ERROR_LOGGER("calcYStepLength", "the deltaY to be a positive number", deltaY);
      throw "USS fatal error (execution stopped)";
    }
    return deltaY >= uss._minAnimationFrame * uss._yStepLength ? uss._yStepLength : Math.ceil(deltaY / uss._minAnimationFrame);
  },
  calcScrollbarsDimensions: (element) => {
    if(element === window) {
      element = document.scrollingElement || uss.getPageScroller();
      if(element === window) return [0,0];
    } else if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("calcScrollbarsDimensions", "the element to be an HTMLElement or the Window", element);
      throw "USS fatal error (execution stopped)";
    }

    if(uss._scrollbarsMaxDimension === 0) return [0,0]; //[Vertical scrollbar's width, Horizontal scrollbar's height]

    const _scrollbarsDimensions = [];
    const _elementStyle = window.getComputedStyle(element);
    const _originalWidth  = Number.parseInt(_elementStyle.width);
    const _originalHeight = Number.parseInt(_elementStyle.height);   
    const _clientWidth  = element.clientWidth;
    const _clientHeight = element.clientHeight;
    const _originalOverflowX = element.style.overflowX;
    const _originalOverflowY = element.style.overflowY;
    const _originalScrollLeft = element.scrollLeft;
    const _originalScrollTop  = element.scrollTop;

    //The properties of _elementStyle are automatically updated whenever the style is changed 
    element.style.overflowX = "hidden"; //The element is forced to hide its vertical scrollbars
    element.style.overflowY = "hidden"; //The element is forced to hide its horizontal scrollbars
   
    //When the scrollbars are hidden the element's width/height increase only if 
    //it was originally showing scrollbars, otherwise they remain the same 
    _scrollbarsDimensions[0] = Number.parseInt(_elementStyle.width)  - _originalWidth;  //Vertical scrollbar's width
    _scrollbarsDimensions[1] = Number.parseInt(_elementStyle.height) - _originalHeight; //Horizontal scrollbar's height

    //If the element is not scrollable but has "overflow:scroll"
    //the dimensions can only be calculated by using clientWidth/clientHeight.
    //If the overflow is "visible" the dimensions are < 0
    if(_scrollbarsDimensions[0] === 0)    _scrollbarsDimensions[0] = element.clientWidth - _clientWidth;
    else if(_scrollbarsDimensions[0] < 0) _scrollbarsDimensions[0] = 0;
    
    if(_scrollbarsDimensions[1] === 0)    _scrollbarsDimensions[1] = element.clientHeight - _clientHeight;
    else if(_scrollbarsDimensions[1] < 0) _scrollbarsDimensions[1] = 0;
     
    element.style.overflowX = _originalOverflowX;
    element.style.overflowY = _originalOverflowY;
    element.scrollLeft = _originalScrollLeft;
    element.scrollTop  = _originalScrollTop;

    return _scrollbarsDimensions;
  },
  calcBordersDimensions: (element) => {
    if(element === window) {
      element = document.scrollingElement || uss.getPageScroller();
      if(element === window) return [0,0,0,0]; //[top, right, bottom, left]
    }
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("calcBordersDimensions", "the element to be an HTMLElement or the Window", element);
      throw "USS fatal error (execution stopped)";
    }

    const _style = window.getComputedStyle(element);
    return [Number.parseInt(_style.borderTopWidth),
            Number.parseInt(_style.borderRightWidth),
            Number.parseInt(_style.borderBottomWidth),
            Number.parseInt(_style.borderLeftWidth)
           ];
  },
  getScrollXCalculator: (container = uss._pageScroller) => {
    return container === window             ? () => window.scrollX       :
           container instanceof HTMLElement ? () => container.scrollLeft :
                                              () => {
                                                DEFAULT_ERROR_LOGGER("getScrollXCalculator", "the container to be an HTMLElement or the Window", container);
                                                throw "USS fatal error (execution stopped)";
                                              };
  },
  getScrollYCalculator: (container = uss._pageScroller) => {
    return container === window             ? () => window.scrollY      :
           container instanceof HTMLElement ? () => container.scrollTop :
                                              () => {
                                                DEFAULT_ERROR_LOGGER("getScrollYCalculator", "the container to be an HTMLElement or the Window", container);
                                                throw "USS fatal error (execution stopped)";
                                              };
  },
  getMaxScrollX: (container = uss._pageScroller) => {
    if(container === window) {
      const _originalXPosition = window.scrollX;
      container.scroll(1073741824, window.scrollY); //highest safe scroll value: 2^30 = 1073741824
      const _maxScroll = window.scrollX;
      container.scroll(_originalXPosition, window.scrollY);
      return _maxScroll;
    }
    if(container === document.documentElement || container === document.body) {
      const _originalXPosition = container.scrollLeft;
      container.scrollLeft = 1073741824; //highest safe scroll value: 2^30 = 1073741824
      const _maxScroll = container.scrollLeft;
      container.scrollLeft = _originalXPosition;
      return _maxScroll;
    }
    if(container instanceof HTMLElement) return container.scrollWidth - container.clientWidth;
    DEFAULT_ERROR_LOGGER("getMaxScrollX", "the container to be an HTMLElement or the Window", container);
  },
  getMaxScrollY: (container = uss._pageScroller) => {
    if(container === window) {
      const _originalYPosition = window.scrollY;
      container.scroll(window.scrollX, 1073741824); //highest safe scroll value: 2^30 = 1073741824
      const _maxScroll = window.scrollY;
      container.scroll(window.scrollX, _originalYPosition);
      return _maxScroll;
    }
    if(container === document.documentElement || container === document.body) {
      const _originalYPosition = container.scrollTop;
      container.scrollTop = 1073741824; //highest safe scroll value: 2^30 = 1073741824
      const _maxScroll = container.scrollTop;
      container.scrollTop = _originalYPosition;
      return _maxScroll;
    }
    if(container instanceof HTMLElement) return container.scrollHeight - container.clientHeight;
    DEFAULT_ERROR_LOGGER("getMaxScrollY", "the container to be an HTMLElement or the Window", container);
  },
  getXScrollableParent: (element, includeHiddenParents = false) => {
    if(element === window) return null;
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getXScrollableParent", "the element to be an HTMLElement or the Window", element);
      return null;
    }
    //Initially test if the element is the body or the documentElement.
    //These two elements consider overflow:visible as overflow:auto.
    const _bodyOverflowRegex = includeHiddenParents ? /(auto|scroll|hidden|visible)/ : /(auto|scroll|visible)/;
    const _html = document.documentElement;
    const _body = document.body;
    if(element === _body) {
      if(_bodyOverflowRegex.test(window.getComputedStyle(_html).overflowX) && uss.getMaxScrollX(_html) >= 1) return _html;
      element = _html;
    }
    if(element === _html) {
      if(uss.getMaxScrollX(window) >= 1) return window;
      return null;
    }

    //The element is a generic HtmlElement.
    //Test the position, the scrollWidth and the overflow property.
    let _style = window.getComputedStyle(element);
    if(_style.position === "fixed") return null;
    const _overflowRegex = includeHiddenParents ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
    const _relativePositioned = _style.position !== "absolute";

    do {
      element = element.parentElement;
      _style = window.getComputedStyle(element);
      if(element === _body) break;
      if((_relativePositioned || _style.position !== "static") &&
         (element.scrollWidth > element.clientWidth) &&
         _overflowRegex.test(_style.overflowX)
      ) {
        return element;
      }
      if(_style.position === "fixed") return null; //If this parent is fixed, no other parent can scroll the element
    } while(true); //Until body is reached

    if(_bodyOverflowRegex.test(_style.overflowX) && uss.getMaxScrollX(_body) >= 1) return _body;
    if(_bodyOverflowRegex.test(window.getComputedStyle(_html).overflowX) && uss.getMaxScrollX(_html) >= 1) return _html;
    if(uss.getMaxScrollX(window) >= 1) return window;
    return null;
  },
  getYScrollableParent: (element, includeHiddenParents = false) => {
    if(element === window) return null;
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getYScrollableParent", "the element to be an HTMLElement or the Window", element);
      return null;
    }
    //Initially test if the element is the body or the documentElement.
    //These two elements consider overflow:visible as overflow:auto.
    const _bodyOverflowRegex = includeHiddenParents ? /(auto|scroll|hidden|visible)/ : /(auto|scroll|visible)/;
    const _html = document.documentElement;
    const _body = document.body;
    if(element === _body) {
      if(_bodyOverflowRegex.test(window.getComputedStyle(_html).overflowY) && uss.getMaxScrollY(_html) >= 1) return _html;
      element = _html;
    }
    if(element === _html) {
      if(uss.getMaxScrollY(window) >= 1) return window;
      return null;
    }

    //The element is a generic HtmlElement.
    //Test the position, the scrollHeight and the overflow property.
    let _style = window.getComputedStyle(element);
    if(_style.position === "fixed") return null;
    const _overflowRegex = includeHiddenParents ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
    const _relativePositioned = _style.position !== "absolute";

    do {
      element = element.parentElement;
      _style = window.getComputedStyle(element);
      if(element === _body) break;
      if((_relativePositioned || _style.position !== "static") &&
         (element.scrollHeight > element.clientHeight) &&
         _overflowRegex.test(_style.overflowY)
      ) {
        return element;
      }
      if(_style.position === "fixed") return null; //If this parent is fixed, no other parent can scroll the element
    } while(true); //Until body is reached

    if(_bodyOverflowRegex.test(_style.overflowY) && uss.getMaxScrollY(_body) >= 1) return _body;
    if(_bodyOverflowRegex.test(window.getComputedStyle(_html).overflowY) && uss.getMaxScrollY(_html) >= 1) return _html;
    if(uss.getMaxScrollY(window) >= 1) return window;
    return null;
  },    
  getScrollableParent: (element, includeHiddenParents = false) => {
    if(element === window) return null;
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getScrollableParent", "the element to be an HTMLElement or the Window", element);
      return null;
    }
    //Initially test if the element is the body or the documentElement.
    //These two elements consider overflow:visible as overflow:auto.
    const _bodyOverflowRegex = includeHiddenParents ? /(auto|scroll|hidden|visible)/ : /(auto|scroll|visible)/;
    const _html = document.documentElement;
    const _body = document.body;
    const _isScrollable = (el) => uss.getMaxScrollX(el) >= 1 || uss.getMaxScrollY(el) >= 1;
    if(element === _body) {
      if(_bodyOverflowRegex.test(window.getComputedStyle(_html).overflow) && _isScrollable(_html)) return _html;
      element = _html;
    }
    if(element === _html) {
      if(_isScrollable(window)) return window;
      return null;
    }

    //The element is a generic HtmlElement.
    //Test the position, the scrollWidth/scrollHeight and the overflow property.
    let _style = window.getComputedStyle(element);
    if(_style.position === "fixed") return null;
    const _overflowRegex = includeHiddenParents ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
    const _relativePositioned = _style.position !== "absolute";

    do {
      element = element.parentElement;
      _style = window.getComputedStyle(element);
      if(element === _body) break;
      if((_relativePositioned || _style.position !== "static") &&
         (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight) &&
         _overflowRegex.test(_style.overflow)
      ) {
        return element;
      }
      if(_style.position === "fixed") return null; //If this parent is fixed, no other parent can scroll the element
    } while(true); //Until body is reached

    if(_bodyOverflowRegex.test(_style.overflow) && _isScrollable(_body)) return _body;
    if(_bodyOverflowRegex.test(window.getComputedStyle(_html).overflow) && _isScrollable(_html)) return _html;
    if(_isScrollable(window)) return window;
    return null;
  },
  getAllScrollableParents: (element, includeHiddenParents = false, callback) => { 
    if(element === window) return [];
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getAllScrollableParents", "the element to be an HTMLElement or the Window", element);
      return [];
    }
    //Initially test if the element is the body or the documentElement.
    //These two elements consider overflow:visible as overflow:auto.
    const _bodyOverflowRegex = includeHiddenParents ? /(auto|scroll|hidden|visible)/ : /(auto|scroll|visible)/;
    const _html = document.documentElement;
    const _body = document.body;
    const _scrollableParents = [];
    const _callback = typeof callback === "function" ? callback : () => {};
    const _isScrollable = (el) => uss.getMaxScrollX(el) >= 1 || uss.getMaxScrollY(el) >= 1;
    const _scrollableParentFound = (el) => {
      _scrollableParents.push(el);
      _callback(el);
    }
    if(element === _body) {
      if(_bodyOverflowRegex.test(window.getComputedStyle(_html).overflow) && _isScrollable(_html)) _scrollableParentFound(_html);
      element = _html;
    }
    if(element === _html) {
      if(_isScrollable(window)) _scrollableParentFound(window);
      return _scrollableParents;
    }

    //The element is a generic HtmlElement.
    //Test the position, the scrollWidth/scrollHeight and the overflow property.
    let _style = window.getComputedStyle(element);
    if(_style.position === "fixed") return _scrollableParents;
    const _overflowRegex = includeHiddenParents ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
    const _relativePositioned = _style.position !== "absolute";

    do {
      element = element.parentElement;
      _style = window.getComputedStyle(element);
      if(element === _body) break;
      if((_relativePositioned || _style.position !== "static") &&
         (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight) &&
         _overflowRegex.test(_style.overflow)
      ) {
        _scrollableParentFound(element);
      }
      if(_style.position === "fixed") return _scrollableParents; //If this parent is fixed, no other parent can scroll the element
    } while(true); //Until body is reached

    if(_bodyOverflowRegex.test(_style.overflow) && _isScrollable(_body)) _scrollableParentFound(_body);
    if(_bodyOverflowRegex.test(window.getComputedStyle(_html).overflow) && _isScrollable(_html)) _scrollableParentFound(_html);
    if(_isScrollable(window)) _scrollableParentFound(window);
    return _scrollableParents;
  },
  scrollXTo: (finalXPosition, container = uss._pageScroller, callback) => {
    if(!Number.isFinite(finalXPosition)) {
      DEFAULT_ERROR_LOGGER("scrollXTo", "the finalXPosition to be a number", finalXPosition);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollXTo", "the container to be an HTMLElement or the Window", container);
      return;
    }

    //The container cannot be scrolled on the x-axis
    if(uss.getMaxScrollX(container) < 1) {
      const _containerName = container === window ? "window" : 
                                                    container.tagName.toLowerCase() + 
                                                    (container.id ? "#" + container.id : "") + 
                                                    (container.className ? "." + container.className : "");
      DEFAULT_WARNING_LOGGER(_containerName, "is not scrollable on the x-axis", false);
      uss.stopScrollingX(container, callback);
      return; 
    }

    const _scrollXCalculator = uss.getScrollXCalculator(container);
    let _totalScrollAmount = finalXPosition - _scrollXCalculator();
    const _direction = _totalScrollAmount > 0 ? 1 : -1;
    _totalScrollAmount *= _direction;

    //If the final position has already been reached,
    //or the scroll amount is less than 1px: no scroll-animation is performed.
    if(_totalScrollAmount < 1) {
      uss.stopScrollingX(container, callback);
      return;
    }
    const _scroll = container !== window ? finalPos => container.scrollLeft = finalPos : finalPos => container.scroll(finalPos, window.scrollY);

    //If user prefers reduced motion
    //the API rolls back to the default "jump-to-position" behavior
    if(uss._reducedMotion) {
      _scroll(finalXPosition);
      uss.stopScrollingX(container, callback);
      return;
    }

    //At this point we know the container has to be scrolled by a certain amount with smooth scroll.
    //Two possible cases:
    //  1) A scroll-animation is already being performed and it can be repurposed.
    //  2) No scroll-animations are being performed, no optimization can be done.
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];
    _containerData[2]  = finalXPosition;
    _containerData[4]  = _direction;
    _containerData[6]  = _totalScrollAmount;
    _containerData[8]  = performance.now();
    _containerData[10] = callback;

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated
    if(!!_containerData[0]) return;

    //No scroll-animation is being performed so a new one is created
    _containerData[0] = window.requestAnimationFrame(_stepX);
    if(!_oldData) uss._containersData.set(container, _containerData);

    function _stepX(timestamp) {
      const finalXPosition = _containerData[2];
      const _direction = _containerData[4];
      let _calculatedScrollStepLength;

      const _currentXPosition = _scrollXCalculator();
      const _remaningScrollAmount = (finalXPosition - _currentXPosition) * _direction;
      if(_remaningScrollAmount < 1) {
        uss.stopScrollingX(container, _containerData[10]);
        return;
      }

      try {
        const _scrollID = _containerData[0];
        _calculatedScrollStepLength = !!_containerData[14] ? _containerData[14](_remaningScrollAmount, _containerData[8], timestamp, _containerData[6], _currentXPosition, finalXPosition, container) 
                                                           : _containerData[12](_remaningScrollAmount, _containerData[8], timestamp, _containerData[6], _currentXPosition, finalXPosition, container);
        if(_scrollID !== _containerData[0]) return; //The current scroll-animation has been aborted by the stepLengthCalculator
        if(finalXPosition !== _containerData[2]) {  //The current scroll-animation has been altered by the stepLengthCalculator
          _containerData[0] = window.requestAnimationFrame(_stepX); 
          return;
        } 
        if(!Number.isFinite(_calculatedScrollStepLength)) {
          DEFAULT_WARNING_LOGGER(_calculatedScrollStepLength, "is not a valid step length", true);
          _calculatedScrollStepLength = uss.calcXStepLength(_totalScrollAmount);
        }
      } catch(e) {
        _calculatedScrollStepLength = uss.calcXStepLength(_totalScrollAmount);
      }

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        _scroll(finalXPosition);
        uss.stopScrollingX(container, _containerData[10]);
        return;
      }

      _scroll(_currentXPosition + _calculatedScrollStepLength * _direction);

      //The API tried to scroll but the finalXPosition was beyond the scroll limit of the container
      if(_calculatedScrollStepLength !== 0 && _currentXPosition === _scrollXCalculator()) {
        uss.stopScrollingX(container, _containerData[10]);
        return;
      }

      _containerData[0] = window.requestAnimationFrame(_stepX);
    }
  },
  scrollYTo: (finalYPosition, container = uss._pageScroller, callback) => {
    if(!Number.isFinite(finalYPosition)) {
      DEFAULT_ERROR_LOGGER("scrollYTo", "the finalYPosition to be a number", finalYPosition);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollYTo", "the container to be an HTMLElement or the Window", container);
      return;
    }

    //The container cannot be scrolled on the y-axis
    if(uss.getMaxScrollY(container) < 1) {
      const _containerName = container === window ? "window" : 
                                                    container.tagName.toLowerCase() + 
                                                    (container.id ? "#" + container.id : "") + 
                                                    (container.className ? "." + container.className : "");
      DEFAULT_WARNING_LOGGER(_containerName, "is not scrollable on the y-axis", false);
      uss.stopScrollingY(container, callback);
      return;
    }

    const _scrollYCalculator = uss.getScrollYCalculator(container);
    let _totalScrollAmount = finalYPosition - _scrollYCalculator();
    const _direction = _totalScrollAmount > 0 ? 1 : -1;
    _totalScrollAmount *= _direction;

    //If the final position has already been reached,
    //or the scroll amount is less than 1px: no scroll-animation is performed.
    if(_totalScrollAmount < 1) {
      uss.stopScrollingY(container, callback);
      return;
    }
    const _scroll = container !== window ? finalPos => container.scrollTop = finalPos : finalPos => container.scroll(window.scrollX, finalPos);

    //If user prefers reduced motion
    //the API rolls back to the default "jump-to-position" behavior
    if(uss._reducedMotion) {
      _scroll(finalYPosition);
      uss.stopScrollingY(container, callback);
      return;
    }

    //At this point we know the container has to be scrolled by a certain amount with smooth scroll.
    //Two possible cases:
    //  1) A scroll-animation is already being performed and it can be repurposed.
    //  2) No scroll-animations are being performed, no optimization can be done.
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];
    _containerData[3]  = finalYPosition;
    _containerData[5]  = _direction;
    _containerData[7]  = _totalScrollAmount;
    _containerData[9]  = performance.now();
    _containerData[11] = callback;

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated
    if(!!_containerData[1]) return;

    //No scroll-animation is being performed so a new one is created
    _containerData[1] = window.requestAnimationFrame(_stepY);
    if(!_oldData) uss._containersData.set(container, _containerData);
     
    function _stepY(timestamp) {
      const finalYPosition = _containerData[3];
      const _direction = _containerData[5];
      let _calculatedScrollStepLength;

      const _currentYPosition = _scrollYCalculator();
      const _remaningScrollAmount = (finalYPosition - _currentYPosition) * _direction;
      if(_remaningScrollAmount < 1) {
        uss.stopScrollingY(container, _containerData[11]);
        return;
      }

      try {
        const _scrollID = _containerData[1];
        _calculatedScrollStepLength = !!_containerData[15] ? _containerData[15](_remaningScrollAmount, _containerData[9], timestamp, _containerData[7], _currentYPosition, finalYPosition, container) 
                                                           : _containerData[13](_remaningScrollAmount, _containerData[9], timestamp, _containerData[7], _currentYPosition, finalYPosition, container);
        if(_scrollID !== _containerData[1]) return; //The current scroll-animation has been aborted by the stepLengthCalculator
        if(finalYPosition !== _containerData[3]) {  //The current scroll-animation has been altered by the stepLengthCalculator
          _containerData[1] = window.requestAnimationFrame(_stepY); 
          return;
        } 
        if(!Number.isFinite(_calculatedScrollStepLength)) {
          DEFAULT_WARNING_LOGGER(_calculatedScrollStepLength, "is not a valid step length", true);
          _calculatedScrollStepLength = uss.calcYStepLength(_totalScrollAmount);
        }
      } catch(e) {
        _calculatedScrollStepLength = uss.calcYStepLength(_totalScrollAmount);
      }

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        _scroll(finalYPosition);
        uss.stopScrollingY(container, _containerData[11]);
        return;
      }

      _scroll(_currentYPosition + _calculatedScrollStepLength * _direction);

      //The API tried to scroll but the finalYPosition was beyond the scroll limit of the container
      if(_calculatedScrollStepLength !== 0 && _currentYPosition === _scrollYCalculator()) {
        uss.stopScrollingY(container, _containerData[11]);
        return;
      }

      _containerData[1] = window.requestAnimationFrame(_stepY);
    }
  },
  scrollXBy: (deltaX, container = uss._pageScroller, callback, stillStart = true) => {
    if(!Number.isFinite(deltaX)) {
      DEFAULT_ERROR_LOGGER("scrollXBy", "the deltaX to be a number", deltaX);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollXBy", "the container to be an HTMLElement or the Window", container);
      return;
    }

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];

      //A scroll-animation on the x-axis is already being performed and can be repurposed
      if(!!_containerData[0]) {
        _containerData[8]  = performance.now();                        //originalTimestamp
        _containerData[10] = callback;                                 //callback
        
        if(deltaX !== 0) {                                             //An actual scroll has been requested
          _containerData[2] += deltaX;                                 //finalXPosition
          const _totalScrollAmount = _containerData[2] - uss.getScrollXCalculator(container)(); //This can be negative, but we want it to always be positive
          _containerData[4]  = _totalScrollAmount > 0 ? 1 : -1;        //direction
          _containerData[6]  = _totalScrollAmount * _containerData[4]; //totalScrollAmount
        } 
        return;
      }
    }

    uss.scrollXTo(uss.getScrollXCalculator(container)() + deltaX, container, callback);
  },
  scrollYBy: (deltaY, container = uss._pageScroller, callback, stillStart = true) => {
    if(!Number.isFinite(deltaY)) {
      DEFAULT_ERROR_LOGGER("scrollYBy", "the deltaY to be a number", deltaY);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollYBy", "the container to be an HTMLElement or the Window", container);
      return;
    }

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];

      //A scroll-animation on the y-axis is already being performed and can be repurposed
      if(!!_containerData[1]) {
        _containerData[9]  = performance.now();                        //originalTimestamp
        _containerData[11] = callback;                                 //callback
        
        if(deltaY !== 0) {                                             //An actual scroll has been requested
          _containerData[3] += deltaY;                                 //finalYPosition
          const _totalScrollAmount = _containerData[3] - uss.getScrollYCalculator(container)(); //This can be negative, but we want it to always be positive
          _containerData[5]  = _totalScrollAmount > 0 ? 1 : -1;        //direction
          _containerData[7]  = _totalScrollAmount * _containerData[5]; //totalScrollAmount
        }
        return;
      }
    }

    uss.scrollYTo(uss.getScrollYCalculator(container)() + deltaY, container, callback);
  },
  scrollTo: (finalXPosition, finalYPosition, container = uss._pageScroller, callback) => {
    if(!Number.isFinite(finalXPosition)) {
      DEFAULT_ERROR_LOGGER("scrollTo", "the finalXPosition to be a number", finalXPosition);
      return;
    }
    if(!Number.isFinite(finalYPosition)) {
      DEFAULT_ERROR_LOGGER("scrollTo", "the finalYPosition to be a number", finalYPosition);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollTo", "the container to be an HTMLElement or the Window", container);
      return;
    }
    
    //This function is used to make sure that the passed callback is only called
    //once all the scroll-animations for the passed container have been performed
    let _currentStep = 0 //Number of the current _callback's calls
    const _callback = typeof callback === "function" ? () => {
      if(_currentStep < 1) _currentStep++;
      else callback();
    } : null; //No action if no valid scrollTo's callback function is passed

    uss.scrollXTo(finalXPosition, container, _callback);
    uss.scrollYTo(finalYPosition, container, _callback);
  },
  scrollBy: (deltaX, deltaY, container = uss._pageScroller, callback, stillStart = true) => {
    if(!Number.isFinite(deltaX)) {
      DEFAULT_ERROR_LOGGER("scrollBy", "the deltaX to be a number", deltaX);
      return;
    }
    if(!Number.isFinite(deltaY)) {
      DEFAULT_ERROR_LOGGER("scrollBy", "the deltaY to be a number", deltaY);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollBy", "the container to be an HTMLElement or the Window", container);
      return;
    }

    let _finalXPosition;
    let _finalYPosition;

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];
      _finalXPosition = !!_containerData[0] ? _containerData[2] : uss.getScrollXCalculator(container)();
      _finalYPosition = !!_containerData[1] ? _containerData[3] : uss.getScrollYCalculator(container)();
    } else {
      _finalXPosition = uss.getScrollXCalculator(container)();
      _finalYPosition = uss.getScrollYCalculator(container)();
    }

    uss.scrollTo(_finalXPosition + deltaX, _finalYPosition + deltaY, container, callback);
  },
  scrollIntoView: (element, alignToLeft = true, alignToTop = true, callback, includeHiddenParents = false) => {
    if(element === window) {
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollIntoView", "the container to be an HTMLElement or the Window", element);
      return;
    }

    let _containerIndex = -1;
    const _containers = uss.getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++);
    if(_containerIndex < 0) { //The element cannot be scrolled into view
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }
    
    let _alignToTop  = alignToTop;
    let _alignToLeft = alignToLeft;
    let _currentContainer = _containers[_containerIndex];
    let _currentElement   = _containers[_containerIndex - 1];
    
    //The window can scroll the body and/or the html,
    //there's no need to scroll them after having scrolled the window.
    if(_currentContainer === window && 
      (_currentElement === document.body || _currentElement === document.documentElement)
    ) {
      _containerIndex--;
      _containers[_containerIndex] = window;
    }
    _currentElement = _containerIndex < 1 ? element : _containers[_containerIndex - 1];

    _scrollContainer();

    function _scrollContainer() {   
      //_scrollbarsDimensions[0] = _currentContainer's vertical scrollbar's width
      //_scrollbarsDimensions[1] = _currentContainer's horizontal scrollbar's height
      const _scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer);

      //_bordersDimensions[0] = _currentContainer's top border size
      //_bordersDimensions[1] = _currentContainer's right border size
      //_bordersDimensions[2] = _currentContainer's bottom border size
      //_bordersDimensions[3] = _currentContainer's left border size
      const _bordersDimensions = uss.calcBordersDimensions(_currentContainer);   

      const _containerRect = _currentContainer !== window ? _currentContainer.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
      const _containerWidth  = _containerRect.width;
      const _containerHeight = _containerRect.height;

      const _elementRect = _currentElement.getBoundingClientRect(); //_currentElement can never be the window
      const _elementWidth  = _elementRect.width;
      const _elementHeight = _elementRect.height;
      const _elementInitialX = _elementRect.left - _containerRect.left; //_currentElement's x-coordinate relative to it's container
      const _elementInitialY = _elementRect.top  - _containerRect.top;  //_currentElement's y-coordinate relative to it's container

      //Align to "nearest" is an indirect way to say: Align to "top" / "bottom" / "center"
      if(alignToLeft === "nearest") {
        const _leftDelta   = _elementInitialX > 0 ? _elementInitialX : -_elementInitialX;  //distance from left border    (container<-element  container)
        const _rightDelta  = Math.abs(_containerWidth - _elementInitialX - _elementWidth); //distance from right border   (container  element->container)
        const _centerDelta = Math.abs(0.5 * (_containerWidth - _elementWidth) - _elementInitialX); //distance from center (container->element<-container)
        _alignToLeft = _leftDelta < _centerDelta ? true : _rightDelta < _centerDelta ? false : null;
      }

      if(alignToTop  === "nearest") {
        const _topDelta    = _elementInitialY > 0 ? _elementInitialY : -_elementInitialY;    //distance from top border     (container↑↑element  container)
        const _bottomDelta = Math.abs(_containerHeight - _elementInitialY - _elementHeight); //distance from bottom border  (container  element↓↓container)
        const _centerDelta = Math.abs(0.5 * (_containerHeight - _elementHeight) - _elementInitialY); //distance from center (container↓↓element↑↑container)
        _alignToTop = _topDelta < _centerDelta ? true : _bottomDelta < _centerDelta ? false : null;
      }
    
      const _elementFinalX = _alignToLeft === true  ? _bordersDimensions[3] : 
                             _alignToLeft === false ? _containerWidth  - _elementWidth  - _scrollbarsDimensions[0] - _bordersDimensions[1] : 
                                                     (_containerWidth  - _elementWidth  - _scrollbarsDimensions[0] - _bordersDimensions[1] + _bordersDimensions[3]) * 0.5;
      const _elementFinalY = _alignToTop  === true  ? _bordersDimensions[0] : 
                             _alignToTop  === false ? _containerHeight - _elementHeight - _scrollbarsDimensions[1] - _bordersDimensions[2] : 
                                                     (_containerHeight - _elementHeight - _scrollbarsDimensions[1] - _bordersDimensions[2] + _bordersDimensions[0]) * 0.5;
      const _deltaX = _elementInitialX - _elementFinalX;
      const _deltaY = _elementInitialY - _elementFinalY;
      const _callback = () => {
        if(_currentElement === element) {
            if(typeof callback === "function") callback();
            return;
        } 
        _containerIndex--;
        _currentContainer = _containers[_containerIndex];
        _currentElement   = _containerIndex < 1 ? element : _containers[_containerIndex - 1];
        _scrollContainer();
      };
      if(_deltaX !== 0 && _deltaY !== 0) uss.scrollBy(_deltaX, _deltaY, _currentContainer, _callback);
      else if(_deltaX !== 0) uss.scrollXBy(_deltaX, _currentContainer, _callback);
      else if(_deltaY !== 0) uss.scrollYBy(_deltaY, _currentContainer, _callback);
      else _callback();
    }
  },
  scrollIntoViewIfNeeded: (element, alignToCenter = true, callback, includeHiddenParents = false) => {
    if(element === window) {
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollIntoView", "the container to be an HTMLElement or the Window", element);
      return;
    }

    let _containerIndex = -1;
    const _containers = uss.getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++);
    if(_containerIndex < 0) { //The element cannot be scrolled into view
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }

    let _alignToTop  = null;
    let _alignToLeft = null;
    let _currentContainer = _containers[_containerIndex];
    let _currentElement   = _containers[_containerIndex - 1];
    
    //The window can scroll the body and/or the html,
    //there's no need to scroll them after having scrolled the window.
    if(_currentContainer === window && 
      (_currentElement === document.body || _currentElement === document.documentElement)
    ) {
      _containerIndex--;
      _containers[_containerIndex] = window;
    }
    _currentElement = _containerIndex < 1 ? element : _containers[_containerIndex - 1];

    _scrollContainer();

    function _scrollContainer() {   
      //_scrollbarsDimensions[0] = _currentContainer's vertical scrollbar's width
      //_scrollbarsDimensions[1] = _currentContainer's horizontal scrollbar's height
      const _scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer);

      //_bordersDimensions[0] = _currentContainer's top border size
      //_bordersDimensions[1] = _currentContainer's right border size
      //_bordersDimensions[2] = _currentContainer's bottom border size
      //_bordersDimensions[3] = _currentContainer's left border size
      const _bordersDimensions = uss.calcBordersDimensions(_currentContainer);   

      const _containerRect = _currentContainer !== window ? _currentContainer.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
      const _containerWidth  = _containerRect.width;
      const _containerHeight = _containerRect.height;

      const _elementRect = _currentElement.getBoundingClientRect(); //_currentElement can never be the window
      const _elementWidth  = _elementRect.width;
      const _elementHeight = _elementRect.height;
      const _elementInitialX = _elementRect.left - _containerRect.left; //_currentElement's x-coordinate relative to it's container
      const _elementInitialY = _elementRect.top  - _containerRect.top;  //_currentElement's y-coordinate relative to it's container
      
      const _elementIntoViewX = _elementInitialX > -1 && _elementInitialX + _elementWidth  - _containerWidth  + _scrollbarsDimensions[0] < 1;  //Checks if the element is already in the viewport on the x-axis
      const _elementIntoViewY = _elementInitialY > -1 && _elementInitialY + _elementHeight - _containerHeight + _scrollbarsDimensions[1] < 1;  //Checks if the element is already in the viewport on the y-axis    
      const _elementOverflowX = _elementInitialX <= 0 && _elementInitialX + _elementWidth  - _containerWidth  + _scrollbarsDimensions[0] >= 0; //Checks if the element's width is bigger than its container's width
      const _elementOverflowY = _elementInitialY <= 0 && _elementInitialY + _elementHeight - _containerHeight + _scrollbarsDimensions[1] >= 0; //Checks if the element's height is bigger than its container's height
      const _isOriginalElement = _currentElement === element;
      let _scrollNotNeededX = _elementIntoViewX || (_isOriginalElement && _elementOverflowX);
      let _scrollNotNeededY = _elementIntoViewY || (_isOriginalElement && _elementOverflowY);

      if(_scrollNotNeededX && _scrollNotNeededY) { 
        if(_isOriginalElement) {
          if(typeof callback === "function") window.requestAnimationFrame(callback);
        } else {
          _containerIndex--;
          _currentContainer = _containers[_containerIndex];
          _currentElement   = _containerIndex < 1 ? element : _containers[_containerIndex - 1];
          _scrollContainer();
        }
        return;
      } 
        
      //Possible alignments for the original element: center or nearest
      //Possible alignments for its containers: nearest
      if(_isOriginalElement && alignToCenter === true) { 
          _scrollNotNeededX = false;
          _scrollNotNeededY = false;
      } else {
        if(!_scrollNotNeededX) { //Scroll needed on x-axis
          const _leftDelta   = _elementInitialX > 0 ? _elementInitialX : -_elementInitialX;  //distance from left border    (container<-element  container)
          const _rightDelta  = Math.abs(_containerWidth - _elementInitialX - _elementWidth); //distance from right border   (container  element->container)
          const _centerDelta = Math.abs(0.5 * (_containerWidth - _elementWidth) - _elementInitialX); //distance from center (container->element<-container)
          _alignToLeft = _leftDelta < _centerDelta ? true : _rightDelta < _centerDelta ? false : null;
        }

        if(!_scrollNotNeededY) { //Scroll needed on y-axis
          const _topDelta    = _elementInitialY > 0 ? _elementInitialY : -_elementInitialY;    //distance from top border     (container↑↑element  container)
          const _bottomDelta = Math.abs(_containerHeight - _elementInitialY - _elementHeight); //distance from bottom border  (container  element↓↓container)
          const _centerDelta = Math.abs(0.5 * (_containerHeight - _elementHeight) - _elementInitialY); //distance from center (container↓↓element↑↑container)
          _alignToTop = _topDelta < _centerDelta ? true : _bottomDelta < _centerDelta ? false : null;
        }
      } 

      const _elementFinalX = _scrollNotNeededX ? _elementInitialX : 
                             _alignToLeft === true  ? _bordersDimensions[3] : 
                             _alignToLeft === false ? _containerWidth  - _elementWidth  - _scrollbarsDimensions[0] - _bordersDimensions[1] : 
                                                     (_containerWidth  - _elementWidth  - _scrollbarsDimensions[0] - _bordersDimensions[1] + _bordersDimensions[3]) * 0.5;
      const _elementFinalY = _scrollNotNeededY ? _elementInitialY : 
                             _alignToTop  === true  ? _bordersDimensions[0] :
                             _alignToTop  === false ? _containerHeight - _elementHeight - _scrollbarsDimensions[1] - _bordersDimensions[2] : 
                                                     (_containerHeight - _elementHeight - _scrollbarsDimensions[1] - _bordersDimensions[2] + _bordersDimensions[0]) * 0.5;
      
      const _deltaX = _elementInitialX - _elementFinalX;
      const _deltaY = _elementInitialY - _elementFinalY;
      
      const _callback = () => {
        if(_currentElement === element) {
            if(typeof callback === "function") callback();
            return;
        } 
        _containerIndex--;
        _currentContainer = _containers[_containerIndex];
        _currentElement   = _containerIndex < 1 ? element : _containers[_containerIndex - 1];
        _scrollContainer();
      };
      if(_deltaX !== 0 && _deltaY !== 0) uss.scrollBy(_deltaX, _deltaY, _currentContainer, _callback);
      else if(_deltaX !== 0) uss.scrollXBy(_deltaX, _currentContainer, _callback);
      else if(_deltaY !== 0) uss.scrollYBy(_deltaY, _currentContainer, _callback);
      else _callback();
    }
  },
  stopScrollingX: (container = uss._pageScroller, callback) => {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("stopScrollingX", "the container to be an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    window.cancelAnimationFrame(_containerData[0]); 
    _containerData[0] = null;

    if(!_containerData[1]) { //No scroll-animation on the y-axis is being performed
      const _newData = [];
      if(!!_containerData[12]) _newData[12] = _containerData[12];
      if(!!_containerData[13]) _newData[13] = _containerData[13];
      uss._containersData.set(container, _newData);
    }

    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrollingY: (container = uss._pageScroller, callback) => {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("stopScrollingY", "the container to be an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    window.cancelAnimationFrame(_containerData[1]);
    _containerData[1] = null;
  
    if(!_containerData[1]) { //No scroll-animation on the x-axis is being performed
      const _newData = [];
      if(!!_containerData[12]) _newData[12] = _containerData[12];
      if(!!_containerData[13]) _newData[13] = _containerData[13];
      uss._containersData.set(container, _newData);
    }

    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrolling: (container = uss._pageScroller, callback) => {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("stopScrolling", "the container to be an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    window.cancelAnimationFrame(_containerData[0]);
    window.cancelAnimationFrame(_containerData[1]);
    _containerData[0] = null;
    _containerData[1] = null;
    
    const _newData = [];
    if(!!_containerData[12]) _newData[12] = _containerData[12];
    if(!!_containerData[13]) _newData[13] = _containerData[13];  
    uss._containersData.set(container, _newData);

    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrollingAll: (callback) => {
    for(const [_container, _containerData] of uss._containersData.entries()) {
      window.cancelAnimationFrame(_containerData[0]);
      window.cancelAnimationFrame(_containerData[1]);
      _containerData[0] = null;
      _containerData[1] = null;

      const _newData = [];
      if(!!_containerData[12]) _newData[12] = _containerData[12];
      if(!!_containerData[13]) _newData[13] = _containerData[13];
      uss._containersData.set(_container, _newData)
    }

    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  hrefSetup: (alignToLeft = true, alignToTop = true, init, callback, includeHiddenParents = false, updateHistory = false) => {
    const _init = typeof init === "function" ? init : () => {};
    const _pageURL = document.URL.split("#")[0];
    const _updateHistory = updateHistory && !!(window.history && window.history.pushState && window.history.scrollRestoration); //Check if histoy manipulation is supported
    
    if(_updateHistory) {
      window.history.scrollRestoration = "manual"; 
      window.addEventListener("popstate", _smoothHistoryNavigation, {passive:true});
      window.addEventListener("unload", (event) => event.preventDefault(), {passive:false, once:true});

      //Prevents the browser to jump-to-position,
      //when a user navigates through history
      function _smoothHistoryNavigation () {
        const _fragment = document.URL.split("#")[1];
        if(!_fragment) { //The URL is just "URL/#" or "URL/"
          if(_init(window, uss._pageScroller) !== false) uss.scrollTo(0, 0, uss._pageScroller, callback);
          return;
        } 
        const __elementToReach = document.getElementById(_fragment) || document.querySelector("a[name='" + _fragment + "']");
        if(__elementToReach !== null && _init(window, __elementToReach) !== false) {
          uss.scrollIntoView(__elementToReach, alignToLeft, alignToTop, callback, includeHiddenParents);
        }
      }
    }

    for(const _pageLink of document.links) {
      const _pageLinkParts = _pageLink.href.split("#"); //PageLink.href = OptionalURL#Fragment
      if(_pageLinkParts[0] !== _pageURL) continue;
      if(_pageLinkParts[1] === "") { //href="#" scrolls the _pageScroller to its top left
        _pageLink.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          if(_init(_pageLink, uss._pageScroller) === false) return; //False means the scroll-animation has been explicitly prevented
          if(_updateHistory && window.history.state !== "#") window.history.pushState("#", "", "#");
          uss.scrollTo(0, 0, uss._pageScroller, callback);
        }, {passive:false});
        continue;
      }

      //Look for elements with the corresponding id or "name" attribute
      const _elementToReach = document.getElementById(_pageLinkParts[1]) || document.querySelector("a[name='" + _pageLinkParts[1] + "']");
      if(_elementToReach === null) {
        DEFAULT_WARNING_LOGGER(_pageLinkParts[1], "is not a valid anchor's destination", true);
        continue;
      }

      _pageLink.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        if(_init(_pageLink, _elementToReach) === false) return; //False means the scroll-animation has been explicitly prevented
        if(_updateHistory && window.history.state !== _pageLinkParts[1]) window.history.pushState(_pageLinkParts[1], "", "#" + _pageLinkParts[1]);
        uss.scrollIntoView(_elementToReach, alignToLeft, alignToTop, callback, includeHiddenParents);
      }, {passive:false});
    }
  }
}

window.addEventListener("resize", () => {uss._windowHeight = window.innerHeight; uss._windowWidth = window.innerWidth;}, {passive:true});
window.addEventListener("load", () => {
  const __scrollBox = document.createElement("div");
  __scrollBox.style.overflowX = "scroll";
  document.body.appendChild(__scrollBox);
  uss._scrollbarsMaxDimension = __scrollBox.offsetHeight  - __scrollBox.clientHeight;
  document.body.removeChild(__scrollBox);
}, {passive:true, once:true});

try { //Chrome, Firefox & Safari >= 14
  window.matchMedia("(prefers-reduced-motion)").addEventListener("change", () => {
    uss._reducedMotion = !uss._reducedMotion;
    uss.stopScrollingAll();
  }, {passive:true});
} catch(e) { //Safari < 14
  window.matchMedia("(prefers-reduced-motion)").addListener(() => {
    uss._reducedMotion = !uss._reducedMotion;
    uss.stopScrollingAll();
  }, {passive:true});
}