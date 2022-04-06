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
 * DEFAULT_SCROLL_CALCULATOR_TEST_VALUE: number, the default number of pixel scrolled when testing a newScrollCalculator.
 * DEFAULT_PAGE_SCROLLER: object, the initial value of the uss_pageScroller variable: 
 *                        it represent the default value used when an API method requires the "container" input parameter but nothing is passed.
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
 *                      1 if the scrolling is from right-to-left, -1 if the scrolling is from left-to-right, 0 if there's no scroll-animation.
 * getScrollYDirection: function, returns the direction of the current scroll-animation on the y-axis of the passed container:
 *                      1 if the scrolling is from bottom-to-top, -1 if the scrolling is from top-to-bottom, 0 if there's no scroll-animation.
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
 * stopScrollingAll: function, stops all the current scroll-animation on both the x and y axes of all the containers.
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
const DEFAULT_SCROLL_CALCULATOR_TEST_VALUE = 100;
const DEFAULT_PAGE_SCROLLER = window;
const DEFAULT_ERROR_LOGGER  = (functionName, expectedValue, receivedValue) => {
  if(/disabled/i.test(uss._debugMode)) return;
  
  //Convert and trim the receivedValue's string
  const _receivedValueIsString = typeof receivedValue === "string";
  receivedValue = receivedValue === null ? "null" : receivedValue === undefined ? "undefined" : receivedValue.name || receivedValue.toString().replaceAll("\n", " ");
  if(receivedValue.length > 30) receivedValue = receivedValue.slice(0, 30) + " ...";
  if(_receivedValueIsString) receivedValue = "\"" + receivedValue + "\"";

  if(/legacy/i.test(uss._debugMode)) {
    console.log("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)\n");
    console.error("USS ERROR\n ", functionName, "was expecting", expectedValue + ", but it received", receivedValue + ".");
    return;
  }

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
  if(/disabled/i.test(uss._debugMode)) return;

  //Convert and trim the subject's string
  const _subjectIsString = typeof subject === "string";
  subject = subject === null ? "null" : subject === undefined ? "undefined" : subject.name || subject.toString().replaceAll("\n", " ");
  if(subject.length > 30) subject = subject.slice(0, 30) + " ...";
  if(_subjectIsString) subject = "\"" + subject + "\"";

  if(/legacy/i.test(uss._debugMode)) {
    console.log("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)\n");
    console.warn("USS WARNING\n ", subject, message + ".");
    return;
  }

  console.groupCollapsed("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");

    console.log("%cUSS WARNING:",
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
  _windowWidth:  INITIAL_WINDOW_WIDTH,
  _scrollbarsMaxDimension: 0,
  _pageScroller: DEFAULT_PAGE_SCROLLER,
  _reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches,
  _debugMode: "",
  isXscrolling: function (container = uss._pageScroller) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("isXscrolling", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    return typeof _containerData[0] === "number";
  },
  isYscrolling: function (container = uss._pageScroller) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("isYscrolling", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    return typeof _containerData[1] === "number";
  },
  isScrolling:  function (container = uss._pageScroller) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("isScrolling", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    return typeof _containerData[0] === "number" || typeof _containerData[1] === "number";
  },
  getFinalXPosition: function (container = uss._pageScroller) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getFinalXPosition", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];

    //If there's no scroll-animation on the x-axis, the current position is returned instead
    return typeof _containerData[0] === "number" ? _containerData[2] : uss.getScrollXCalculator(container)();
  },
  getFinalYPosition: function (container = uss._pageScroller) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getFinalYPosition", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];

    //If there's no scroll-animation on the y-axis, the current position is returned instead
    return typeof _containerData[1] === "number" ? _containerData[3] : uss.getScrollYCalculator(container)();
  },
  getScrollXDirection: function (container = uss._pageScroller) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getScrollXDirection", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];

    //If there's no scroll-animation on the x-axis, 0 is returned instead
    return typeof _containerData[0] === "number" ? _containerData[4] : 0;
  },
  getScrollYDirection: function (container = uss._pageScroller) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getScrollYDirection", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];

    //If there's no scroll-animation on the y-axis, 0 is returned instead
    return typeof _containerData[1] === "number" ? _containerData[5] : 0;
  },
  getXStepLengthCalculator: function (container = uss._pageScroller, getTemporary = false) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getXStepLengthCalculator", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    return getTemporary ? _containerData[14] : _containerData[12];
  },
  getYStepLengthCalculator: function (container = uss._pageScroller, getTemporary = false) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("getYStepLengthCalculator", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    return getTemporary ? _containerData[15] : _containerData[13];
  },
  getXStepLength: function () {return uss._xStepLength;},
  getYStepLength: function () {return uss._yStepLength;},
  getMinAnimationFrame: function () {return uss._minAnimationFrame;},
  getWindowHeight: function () {return uss._windowHeight;},
  getWindowWidth: function () {return uss._windowWidth;},
  getScrollbarsMaxDimension: function() {return uss._scrollbarsMaxDimension;},
  getPageScroller: function () {return uss._pageScroller;},
  getReducedMotionState: function () {return uss._reducedMotion;},
  getDebugMode: function () {return uss._debugMode;}, 
  setXStepLengthCalculator: function (newCalculator, container = uss._pageScroller, isTemporary = false) {
    if(typeof newCalculator !== "function") {
      DEFAULT_ERROR_LOGGER("setXStepLengthCalculator", "a function", newCalculator);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("setXStepLengthCalculator", "an HTMLElement or the Window", container);
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
    if(isTemporary) _containerData[14] = newCalculator;
    else {
      _containerData[12] = newCalculator;
      _containerData[14] = null; //Setting a non-temporary StepLengthCalculator will unset the temporary one
    }
    uss._containersData.set(container, _containerData);
  },
  setYStepLengthCalculator: function (newCalculator, container = uss._pageScroller, isTemporary = false) {
    if(typeof newCalculator !== "function") {
      DEFAULT_ERROR_LOGGER("setYStepLengthCalculator", "a function", newCalculator);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("setYStepLengthCalculator", "an HTMLElement or the Window", container);
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
    if(isTemporary) _containerData[15] = newCalculator;
    else {
      _containerData[13] = newCalculator;
      _containerData[15] = null; //Setting a non-temporary StepLengthCalculator will unset the temporary one
    }
    uss._containersData.set(container, _containerData);
  },
  setStepLengthCalculator: function (newCalculator, container = uss._pageScroller, isTemporary = false) {
    if(typeof newCalculator !== "function") {
      DEFAULT_ERROR_LOGGER("setStepLengthCalculator", "a function", newCalculator);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("setStepLengthCalculator", "an HTMLElement or the Window", container);
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
    if(isTemporary) {
      _containerData[14] = newCalculator;
      _containerData[15] = newCalculator;
    } else {
      _containerData[12] = newCalculator;
      _containerData[13] = newCalculator;

      //Setting a non-temporary StepLengthCalculators will unset the temporary ones
      _containerData[14] = null;
      _containerData[15] = null;
    }
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
    if(newPageScroller !== window && !(newPageScroller instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("setPageScroller", "an HTMLElement or the Window", newPageScroller);
      return;
    }
    uss._pageScroller = newPageScroller;
  },
  setDebugMode: function(newDebugMode = "") {
    if(typeof newDebugMode !== "string") {
      let _oldMode = null;
      if(/disabled/i.test(uss._debugMode)) {
        _oldMode = uss._debugMode;
        uss._debugMode = "legacy";
      }
      DEFAULT_ERROR_LOGGER("setDebugMode", "\"disabled\", \"legacy\" or any other string", newDebugMode);
      if(!!_oldMode) uss._debugMode = _oldMode;
      return;
    }
    uss._debugMode = newDebugMode;
  },
  calcXStepLength: function (deltaX) {
    if(!Number.isFinite(deltaX) || deltaX < 0) {
      DEFAULT_ERROR_LOGGER("calcXStepLength", "a positive number", deltaX);
      throw "USS fatal error (execution stopped)";
    }
    return deltaX >= uss._minAnimationFrame * uss._xStepLength ? uss._xStepLength : Math.ceil(deltaX / uss._minAnimationFrame);
  },
  calcYStepLength: function (deltaY) {
    if(!Number.isFinite(deltaY) || deltaY < 0) {
      DEFAULT_ERROR_LOGGER("calcYStepLength", "a positive number", deltaY);
      throw "USS fatal error (execution stopped)";
    }
    return deltaY >= uss._minAnimationFrame * uss._yStepLength ? uss._yStepLength : Math.ceil(deltaY / uss._minAnimationFrame);
  },
  calcScrollbarsDimensions: function (element) {
    if(element === window) return [0, 0]; //[Vertical scrollbar's width, Horizontal scrollbar's height]
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("calcScrollbarsDimensions", "an HTMLElement or the Window", element);
      throw "USS fatal error (execution stopped)";
    }

    if(uss._scrollbarsMaxDimension === 0) return [0, 0]; //[Vertical scrollbar's width, Horizontal scrollbar's height]

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
  calcBordersDimensions: function (element) {
    if(element === window) return [0,0,0,0]; //[top, right, bottom, left]
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("calcBordersDimensions", "an HTMLElement or the Window", element);
      throw "USS fatal error (execution stopped)";
    }

    const _style = window.getComputedStyle(element);
    return [Number.parseInt(_style.borderTopWidth),
            Number.parseInt(_style.borderRightWidth),
            Number.parseInt(_style.borderBottomWidth),
            Number.parseInt(_style.borderLeftWidth)
           ];
  },
  getScrollXCalculator: function (container = uss._pageScroller) {
    return container === window             ? () => {return window.scrollX;}       :
           container instanceof HTMLElement ? () => {return container.scrollLeft;} :
                                              () => {
                                                DEFAULT_ERROR_LOGGER("getScrollXCalculator", "an HTMLElement or the Window", container);
                                                throw "USS fatal error (execution stopped)";
                                              };
  },
  getScrollYCalculator: function (container = uss._pageScroller) {
    return container === window             ? () => {return window.scrollY;}      :
           container instanceof HTMLElement ? () => {return container.scrollTop;} :
                                              () => {
                                                DEFAULT_ERROR_LOGGER("getScrollYCalculator", "an HTMLElement or the Window", container);
                                                throw "USS fatal error (execution stopped)";
                                              };
  },
  getMaxScrollX: function (container = uss._pageScroller) {
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
    DEFAULT_ERROR_LOGGER("getMaxScrollX", "an HTMLElement or the Window", container);
  },
  getMaxScrollY: function (container = uss._pageScroller) {
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
    DEFAULT_ERROR_LOGGER("getMaxScrollY", "an HTMLElement or the Window", container);
  },
  getXScrollableParent: function (element, includeHiddenParents = false) {
    if(element === window) return null;
    try {
      let _style = window.getComputedStyle(element);
      if(_style.position === "fixed") return null;
      const _relativePositioned = _style.position !== "absolute";
      const _overflowRegex = includeHiddenParents ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

      let _container = element.parentElement;
      while(_container) {
        _style = window.getComputedStyle(_container);
        if(_relativePositioned || _style.position !== "static")
          if(_overflowRegex.test(_style.overflowX))
            if(_container.scrollWidth > _container.clientWidth)
              return _container;
        if(_style.position === "fixed") return null;
        _container = _container.parentElement;
      }
    } catch(e) {
      DEFAULT_ERROR_LOGGER("getXScrollableParent", "an HTMLElement or the Window", element);
    }
    return window;
  },
  getYScrollableParent: function (element, includeHiddenParents = false) {
    if(element === window) return null;
    try {
      let _style = window.getComputedStyle(element);
      if(_style.position === "fixed") return null;
      const _relativePositioned = _style.position !== "absolute";
      const _overflowRegex = includeHiddenParents ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

      let _container = element.parentElement;
      while(_container) {
        _style = window.getComputedStyle(_container);
        if(_relativePositioned || _style.position !== "static")
          if(_overflowRegex.test(_style.overflowY))
            if(_container.scrollHeight > _container.clientHeight)
              return _container;
        if(_style.position === "fixed") return null;
        _container = _container.parentElement;
      }
    } catch(e) {
      DEFAULT_ERROR_LOGGER("getYScrollableParent", "an HTMLElement or the Window", element);
    }
    return window;
  },
  getScrollableParent: function (element, includeHiddenParents = false) {
    if(element === window) return null;
    try {
      let _style = window.getComputedStyle(element);
      if(_style.position === "fixed") return null;
      const _relativePositioned = _style.position !== "absolute";
      const _overflowRegex = includeHiddenParents ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

      let _container = element.parentElement;
      while(_container) {
        _style = window.getComputedStyle(_container);
        if(_relativePositioned || _style.position !== "static")
          if(_overflowRegex.test(_style.overflow))
            if(_container.scrollWidth > _container.clientWidth || _container.scrollHeight > _container.clientHeight)
              return _container;
        if(_style.position === "fixed") return null;
        _container = _container.parentElement;
      }
    } catch(e) {
      DEFAULT_ERROR_LOGGER("getScrollableParent", "an HTMLElement or the Window", element);
    }
    return window;
  },
  getAllScrollableParents: function (element, includeHiddenParents = false, callback) {
    const _scrollableParents = [];
    if(element === window) return _scrollableParents;
    try {
      let _style = window.getComputedStyle(element);
      if(_style.position === "fixed") return _scrollableParents;
      const _callback = typeof callback === "function" ? callback : () => {};
      const _relativePositioned = _style.position !== "absolute";
      const _overflowRegex = includeHiddenParents ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

      let _includeWindow = true;
      let _container = element.parentElement;
      while(_container) {
        _style = window.getComputedStyle(_container);
        if(_relativePositioned || _style.position !== "static")
          if(_overflowRegex.test(_style.overflow))
            if(_container.scrollWidth > _container.clientWidth || _container.scrollHeight > _container.clientHeight) {
              if(_container === document.body || _container === document.documentElement) _includeWindow = false;
              _scrollableParents.push(_container);
              _callback(_container);
            }
        if(_style.position === "fixed") return _scrollableParents;
        _container = _container.parentElement;
      }
      if(_includeWindow) {
        _scrollableParents.push(window);
        _callback(window);
      }
    } catch(e) {
      DEFAULT_ERROR_LOGGER("getAllScrollableParents", "an HTMLElement or the Window", element);
    }
    return _scrollableParents;
  },
  scrollXTo: function (finalXPosition, container = uss._pageScroller, callback) {
    if(!Number.isFinite(finalXPosition)) {
      DEFAULT_ERROR_LOGGER("scrollXTo", "a number as the finalXPosition", finalXPosition);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollXTo", "an HTMLElement or the Window", container);
      return;
    }

    //The container cannot be scrolled on the x-axis
    if(uss.getMaxScrollX(container) < 1) {
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
    const _containerData = uss._containersData.get(container) || [];
    _containerData[2]  = finalXPosition;
    _containerData[4]  = _direction;
    _containerData[6]  = _totalScrollAmount;
    _containerData[8]  = performance.now();
    _containerData[10] = callback;

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated
    if(typeof _containerData[0] === "number") return;

    //No scroll-animations are being performed so a new one is created
    _containerData[0] = window.requestAnimationFrame(_stepX);
    uss._containersData.set(container, _containerData);

    let _calculatedScrollStepLength;

    function _stepX(timestamp) {
      const finalXPosition = _containerData[2];
      const _direction = _containerData[4];

      const _currentXPosition = _scrollXCalculator();
      const _remaningScrollAmount = (finalXPosition - _currentXPosition) * _direction;
      if(_remaningScrollAmount <= 0) {
        _containerData[0]  = null;
        _containerData[14] = null;
        if(typeof _containerData[10] === "function") window.requestAnimationFrame(_containerData[10]);
        return;
      }

      try {
        const _scrollID = _containerData[0];
        const _calculatorIndex = typeof _containerData[14] === "function" ? 14 : 12;
        _calculatedScrollStepLength = _containerData[_calculatorIndex](_remaningScrollAmount, _containerData[8], timestamp, _containerData[6], _currentXPosition, finalXPosition, container);
        if(_scrollID !== _containerData[0]) return; //The current scroll-animation has been aborted by the stepLengthCalculator
        if(finalXPosition !== _containerData[2]) {  //The current scroll-animation has been altered by the stepLengthCalculator
          _containerData[0] = window.requestAnimationFrame(_stepX); 
          return;
        } 
        if(!Number.isFinite(_calculatedScrollStepLength)) {
          DEFAULT_WARNING_LOGGER(_calculatedScrollStepLength, "is not a valid step length");
          _calculatedScrollStepLength = uss.calcXStepLength(_totalScrollAmount);
        }
      } catch(e) {
        _calculatedScrollStepLength = uss.calcXStepLength(_totalScrollAmount);
      }

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        _containerData[0]  = null;
        _containerData[14] = null;
        _scroll(finalXPosition);
        if(typeof _containerData[10] === "function") window.requestAnimationFrame(_containerData[10]);
        return;
      }

      _scroll(_currentXPosition + _calculatedScrollStepLength * _direction);

      //The API tried to scroll but the finalXPosition was beyond the scroll limit of the container
      if(_calculatedScrollStepLength !== 0 && _currentXPosition === _scrollXCalculator()) {
        _containerData[0]  = null;
        _containerData[14] = null;
        if(typeof _containerData[10] === "function") window.requestAnimationFrame(_containerData[10]);
        return;
      }

      _containerData[0] = window.requestAnimationFrame(_stepX);
    }
  },
  scrollYTo: function (finalYPosition, container = uss._pageScroller, callback) {
    if(!Number.isFinite(finalYPosition)) {
      DEFAULT_ERROR_LOGGER("scrollYTo", "a number as the finalYPosition", finalYPosition);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollYTo", "an HTMLElement or the Window", container);
      return;
    }

    //The container cannot be scrolled on the y-axis
    if(uss.getMaxScrollY(container) < 1) {
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
    const _containerData = uss._containersData.get(container) || [];
    _containerData[3]  = finalYPosition;
    _containerData[5]  = _direction;
    _containerData[7]  = _totalScrollAmount;
    _containerData[9]  = performance.now();
    _containerData[11] = callback;

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated
    if(typeof _containerData[1] === "number") return;

    //No scroll-animations are being performed so a new one is created
    _containerData[1] = window.requestAnimationFrame(_stepY);
    uss._containersData.set(container, _containerData);
    
    let _calculatedScrollStepLength;
    
    function _stepY(timestamp) {
      const finalYPosition = _containerData[3];
      const _direction = _containerData[5];

      const _currentYPosition = _scrollYCalculator();
      const _remaningScrollAmount = (finalYPosition - _currentYPosition) * _direction;
      if(_remaningScrollAmount <= 0) {
        _containerData[1]  = null;
        _containerData[15] = null;
        if(typeof _containerData[11] === "function") window.requestAnimationFrame(_containerData[11]);
        return;
      }

      try {
        const _scrollID = _containerData[1];
        const _calculatorIndex = typeof _containerData[15] === "function" ? 15 : 13;
        _calculatedScrollStepLength =  _containerData[_calculatorIndex](_remaningScrollAmount, _containerData[9], timestamp, _containerData[7], _currentYPosition, finalYPosition, container);
        if(_scrollID !== _containerData[1]) return; //The current scroll-animation has been aborted by the stepLengthCalculator
        if(finalYPosition !== _containerData[3]) {  //The current scroll-animation has been altered by the stepLengthCalculator
          _containerData[1] = window.requestAnimationFrame(_stepY); 
          return;
        } 
        if(!Number.isFinite(_calculatedScrollStepLength)) {
          DEFAULT_WARNING_LOGGER(_calculatedScrollStepLength, "is not a valid step length");
          _calculatedScrollStepLength = uss.calcYStepLength(_totalScrollAmount);
        }
      } catch(e) {
        _calculatedScrollStepLength = uss.calcYStepLength(_totalScrollAmount);
      }

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        _containerData[1]  = null;
        _containerData[15] = null;
        _scroll(finalYPosition);
        if(typeof _containerData[11] === "function") window.requestAnimationFrame(_containerData[11]);
        return;
      }

      _scroll(_currentYPosition + _calculatedScrollStepLength * _direction);

      //The API tried to scroll but the finalYPosition was beyond the scroll limit of the container
      if(_calculatedScrollStepLength !== 0 && _currentYPosition === _scrollYCalculator()) {
        _containerData[1]  = null;
        _containerData[15] = null;
        if(typeof _containerData[11] === "function") window.requestAnimationFrame(_containerData[11]);
        return;
      }

      _containerData[1] = window.requestAnimationFrame(_stepY);
    }
  },
  scrollXBy: function (deltaX, container = uss._pageScroller, callback, stillStart = true) {
    if(!Number.isFinite(deltaX)) {
      DEFAULT_ERROR_LOGGER("scrollXBy", "a number as the deltaX", deltaX);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollXBy", "an HTMLElement or the Window", container);
      return;
    }

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];

      //A scroll-animation on the x-axis is already being performed and can be repurposed
      if(typeof _containerData[0] === "number")  {
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
  scrollYBy: function (deltaY, container = uss._pageScroller, callback, stillStart = true) {
    if(!Number.isFinite(deltaY)) {
      DEFAULT_ERROR_LOGGER("scrollYBy", "a number as the deltaY", deltaY);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollYBy", "an HTMLElement or the Window", container);
      return;
    }

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];

      //A scroll-animation on the y-axis is already being performed and can be repurposed
      if(typeof _containerData[1] === "number")  {
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
  scrollTo: function (finalXPosition, finalYPosition, container = uss._pageScroller, callback) {
    if(!Number.isFinite(finalXPosition)) {
      DEFAULT_ERROR_LOGGER("scrollTo", "a number as the finalXPosition", finalXPosition);
      return;
    }
    if(!Number.isFinite(finalYPosition)) {
      DEFAULT_ERROR_LOGGER("scrollTo", "a number as the finalYPosition", finalYPosition);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollTo", "an HTMLElement or the Window", container);
      return;
    }
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
  scrollBy: function (deltaX, deltaY, container = uss._pageScroller, callback, stillStart = true) {
    if(!Number.isFinite(deltaX)) {
      DEFAULT_ERROR_LOGGER("scrollBy", "a number as the deltaX", deltaX);
      return;
    }
    if(!Number.isFinite(deltaY)) {
      DEFAULT_ERROR_LOGGER("scrollBy", "a number as the deltaY", deltaY);
      return;
    }
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollBy", "an HTMLElement or the Window", container);
      return;
    }

    let _finalXPosition;
    let _finalYPosition;

    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];
      _finalXPosition = typeof _containerData[0] === "number" ? _containerData[2] : uss.getScrollXCalculator(container)();
      _finalYPosition = typeof _containerData[1] === "number" ? _containerData[3] : uss.getScrollYCalculator(container)();
    } else {
      _finalXPosition = uss.getScrollXCalculator(container)();
      _finalYPosition = uss.getScrollYCalculator(container)();
    }

    uss.scrollTo(_finalXPosition + deltaX, _finalYPosition  + deltaY, container, callback);
  },
  scrollIntoView: function (element, alignToLeft = true, alignToTop = true, callback, includeHiddenParents = false) {
    if(element === window) {
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollIntoView", "an HTMLElement or the Window", element);
      return;
    }

    let _containerIndex = -1;
    const _containers = uss.getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++);
    if(_containerIndex < 0) { //The element cannot be scrolled
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }

    let _alignToTop  = alignToTop;
    let _alignToLeft = alignToLeft;
    let _currentElement, _currentContainer;

    _currentContainer = _containers[_containerIndex];
    _currentElement   = _containerIndex < 1 ? element : _containers[_containerIndex - 1];

    _scrollContainer();

    function _scrollContainer() {   
      //_scrollbarsDimensions[0] = current __container's vertical scrollbar's width
      //_scrollbarsDimensions[1] = current __container's horizontal scrollbar's height
      const _scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer);

      //_bordersDimensions[0] = current __container's top border size
      //_bordersDimensions[1] = current __container's right border size
      //_bordersDimensions[2] = current __container's bottom border size
      //_bordersDimensions[3] = current __container's left border size
      const _bordersDimensions = uss.calcBordersDimensions(_currentContainer);   

      const _containerRect = _currentContainer !== window ? _currentContainer.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
      const _containerWidth  = _containerRect.width;
      const _containerHeight = _containerRect.height;

      const _elementRect = _currentElement.getBoundingClientRect(); //The element can never be the window
      const _elementWidth  = _elementRect.width;
      const _elementHeight = _elementRect.height;
      const _elementInitialX = _elementRect.left - _containerRect.left; //Element's x-coordinate relative to it's container
      const _elementInitialY = _elementRect.top  - _containerRect.top;  //Element's y-coordinate relative to it's container

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
      
      uss.scrollBy(_elementInitialX - _elementFinalX, _elementInitialY - _elementFinalY, _currentContainer, () => {
        if(_currentElement === element) {
            if(typeof callback === "function") window.requestAnimationFrame(callback);
            return;
        } 
        _containerIndex--;
        _currentContainer = _containers[_containerIndex];
        _currentElement   = _containerIndex < 1 ? element : _containers[_containerIndex - 1];
        _scrollContainer();
      });
    }
  },
  scrollIntoViewIfNeeded: function (element, alignToCenter = true, callback, includeHiddenParents = false) {
    if(element === window) {
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }
    if(!(element instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("scrollIntoView", "an HTMLElement or the Window", element);
      return;
    }

    let _containerIndex = -1;
    const _containers = uss.getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++);
    if(_containerIndex < 0) { //The element cannot be scrolled
      if(typeof callback === "function") window.requestAnimationFrame(callback);
      return;
    }

    let _alignToTop  = null;
    let _alignToLeft = null;
    let _currentElement, _currentContainer;

    _currentContainer = _containers[_containerIndex];
    _currentElement   = _containerIndex < 1 ? element : _containers[_containerIndex - 1];

    _scrollContainer();

    function _scrollContainer() {   
      //_scrollbarsDimensions[0] = current __container's vertical scrollbar's width
      //_scrollbarsDimensions[1] = current __container's horizontal scrollbar's height
      const _scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer);

      //_bordersDimensions[0] = current __container's top border size
      //_bordersDimensions[1] = current __container's right border size
      //_bordersDimensions[2] = current __container's bottom border size
      //_bordersDimensions[3] = current __container's left border size
      const _bordersDimensions = uss.calcBordersDimensions(_currentContainer);   

      const _containerRect = _currentContainer !== window ? _currentContainer.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
      const _containerWidth  = _containerRect.width;
      const _containerHeight = _containerRect.height;

      const _elementRect = _currentElement.getBoundingClientRect(); //The element can never be the window
      const _elementWidth  = _elementRect.width;
      const _elementHeight = _elementRect.height;
      const _elementInitialX = _elementRect.left - _containerRect.left; //Element's x-coordinate relative to it's container
      const _elementInitialY = _elementRect.top  - _containerRect.top;  //Element's y-coordinate relative to it's container
      
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
        
      uss.scrollBy(_elementInitialX - _elementFinalX, _elementInitialY - _elementFinalY, _currentContainer, () => {
        if(_currentElement === element) {
            if(typeof callback === "function") window.requestAnimationFrame(callback);
            return;
        } 
        _containerIndex--;
        _currentContainer = _containers[_containerIndex];
        _currentElement   = _containerIndex < 1 ? element : _containers[_containerIndex - 1];
        _scrollContainer();
      });
    }
  },
  stopScrollingX: function (container = uss._pageScroller, callback) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("stopScrollingX", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    window.cancelAnimationFrame(_containerData[0]);
    _containerData[0] = null;
    _containerData[14] = null;

    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrollingY: function (container = uss._pageScroller, callback) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("stopScrollingY", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    window.cancelAnimationFrame(_containerData[1]);
    _containerData[1] = null;
    _containerData[15] = null;

    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrolling: function (container = uss._pageScroller, callback) {
    if(container !== window && !(container instanceof HTMLElement)) {
      DEFAULT_ERROR_LOGGER("stopScrolling", "an HTMLElement or the Window", container);
      return;
    }
    const _containerData = uss._containersData.get(container) || [];
    window.cancelAnimationFrame(_containerData[0]);
    window.cancelAnimationFrame(_containerData[1]);
    _containerData[0] = null;
    _containerData[1] = null;
    _containerData[14] = null;
    _containerData[15] = null;

    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrollingAll: function (callback) {
    const _containersData = uss._containersData.values() || [];

    //Iterate directly on the container's data-arrays
    for(let _containerData of _containersData) {
      window.cancelAnimationFrame(_containerData[0]);
      window.cancelAnimationFrame(_containerData[1]);
      _containerData[0] = null;
      _containerData[1] = null;
      _containerData[14] = null;
      _containerData[15] = null;
    }

    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  hrefSetup: function (alignToLeft = true, alignToTop = true, init, callback, includeHiddenParents = false, updateHistory = false) {
    const _init = typeof init === "function" ? init : () => {};
    const _pageLinks = document.links;
    const _pageURL = document.URL.split("#")[0];
    const _updateHistory = updateHistory && !!(window.history && window.history.pushState && window.history.scrollRestoration); //Check if histoy manipulation is supported
    
    if(_updateHistory) {
      window.history.scrollRestoration = "manual"; 
      window.addEventListener("popstate", _smoothHistoryNavigation, {passive:true});
      window.addEventListener("unload", (e) => {e.preventDefault()}, {passive:false});

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

    for(const _pageLink of _pageLinks) {
      const _pageLinkParts = _pageLink.href.split("#"); //PageLink.href = OptionalURL#Fragment
      if(_pageLinkParts[0] !== _pageURL) continue;
      if(_pageLinkParts[1] === "") { //href="#" scrolls the _pageScroller to its top
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
        DEFAULT_WARNING_LOGGER(_pageLinkParts[1], "is not a valid anchor's destination");
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

window.addEventListener("resize", () => {uss._windowHeight = window.innerHeight; uss._windowWidth = window.innerWidth;} , {passive:true});
window.addEventListener("load", function calcMaxScrollbarsDimensions() {
  const __scrollBox = document.createElement("div");
  __scrollBox.style.overflowX = "scroll";
  document.body.appendChild(__scrollBox);
  uss._scrollbarsMaxDimension = __scrollBox.offsetHeight  - __scrollBox.clientHeight;
  document.body.removeChild(__scrollBox);
  window.removeEventListener("load", calcMaxScrollbarsDimensions);
}, {passive: true});

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