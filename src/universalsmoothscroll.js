/*
 * CONSTANTS (INTERNAL USE):
 *
 * INITIAL_WINDOW_WIDTH: number, the Window's inner width (in px) when the page is first loaded.
 * INITIAL_WINDOW_HEIGHT: number, the Window's inner height (in px) when the page is first loaded.
 * DEFAULT_XSTEP_LENGTH: number, the initial value of the "_xStepLength" property: it represents the default number of pixels scrolled in a single scroll-animation's step on the x-axis. 
 *                       It's 16px at 412px of (initial Window's) width and 23px at 1920px of (initial Window's) width.
 * DEFAULT_YSTEP_LENGTH: number, The initial value of the "_yStepLength" property: it represents the default number of pixels scrolled in a single scroll-animation's step on the y-axis. 
 *                       It's 38px at 789px of (initial Window's) height and 22px at 1920px of (initial Window's) height.
 * DEFAULT_MIN_ANIMATION_FRAMES: number, the initial value of the "_minAnimationFrame" property: 
 *                               it represents the default lowest number of frames any scroll-animation on a container should last if no StepLengthCalculator is set for it.
 * DEFAULT_FRAME_TIME: number, the initial value of the "_framesTime" property: it's 16.6 and it initially assumes that the user's browser/screen is refreshing at 60fps. 
 * DEFAULT_XSTEP_LENGTH_CALCULATOR: function, the default stepLengthCalculator for scroll-animations on the x-axis of every container that doesn't have a custom stepLengthCalculator set.
 *                                  Controls how long each animation-step on the x-axis must be (in px) in order to target the "_minAnimationFrame" property value. 
 * DEFAULT_YSTEP_LENGTH_CALCULATOR: function, the default stepLengthCalculator for scroll-animations on the y-axis of every container that doesn't have a custom stepLengthCalculator set.
 *                                  Controls how long each animation-step on the y-axis must be (in px) in order to target the "_minAnimationFrame" property value. 
 * DEFAULT_ERROR_LOGGER: function, the initial value of the "_errorLogger" property: it logs the API error messages inside the browser's console.
 * DEFAULT_WARNING_LOGGER: function, the initial value of the "_warningLogger" property: it logs the API warning messages inside the browser's console.
 */


/*
 * VARIABLES (INTERNAL USE):
 *
 * _containersData: Map(Container, Array[]), a map in which:
 *                  1) The keys are an instances of Element or the Window and they're internally called "containers".
 *                  2) The values are arrays:
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
 *                         It's null if a scroll-animation on the x-axis of this container has been scheduled but has not been performed yet or 
 *                         if a scroll-animation with "stillStart = false" has been requested.
 *                     [9] contains the starting time in milliseconds (as a DOMHighResTimeStamp) of the current scroll-animation on the y-axis of this container.
 *                         It's null if a scroll-animation on the y-axis of this container has been scheduled but has not been performed yet or 
 *                         if a scroll-animation with "stillStart = false" has been requested.
 *                     [10] contains a callback function that will be executed when the current scroll-animation on the x-axis of this container has been performed.
 *                     [11] contains a callback function that will be executed when the current scroll-animation on the y-axis of this container has been performed.
 *                     [12] contains the StepLengthCalculator that controls the scroll-animations on the x-axis of this container.
 *                     [13] contains the StepLengthCalculator that controls the scroll-animations on the y-axis of this container.
 *                     [14] contains the StepLengthCalculator that controls the scroll-animations on the x-axis of this container.
 *                          If valid, replaces [12] for the current scroll-animation on the x-axis of this container and it's automatically invalidated at the end.
 *                     [15] contains the StepLengthCalculator that controls the scroll-animations on the y-axis of this container.
 *                          If valid, replaces [13] for the current scroll-animation on the y-axis of this container and it's automatically invalidated at the end.
 *                     [16] contains the cached value of the highest reacheable scrollLeft/scrollX value of this container (its maxScrollX).
 *                     [17] contains the cached value of the highest reacheable scrollTop/scrollY value of this container (its maxScrollY).
 *                     [18] contains the cached value of the vertical scrollbar's width of this container.
 *                     [19] contains the cached value of the horizontal scrollbar's height of this container.
 *                     [20] contains the cached value of the top border's height (in px) of this container.
 *                     [21] contains the cached value of the right border's width (in px) of this container.
 *                     [22] contains the cached value of the bottom border's height (in px) of this container.
 *                     [23] contains the cached value of the left border's width (in px) of this container.
 *                     [24] contains the cached value of this container's next scrollable parent on the x-axis which does not have "overflow-x:hidden".
 *                     [25] contains the cached value of this container's next scrollable parent on the x-axis which has "overflow-x:hidden".
 *                     [26] contains the cached value of this container's next scrollable parent on the y-axis which does not have "overflow-y:hidden".
 *                     [27] contains the cached value of this container's next scrollable parent on the y-axis which has "overflow-y:hidden".
 *                     [28] contains the cached value of this container's scrollXCalculator.
 *                     [29] contains the cached value of this container's scrollYCalculator.
 * _xStepLength: number, if there's no StepLengthCalculator set for a container, this represent the number of pixels scrolled during a
 *                       single scroll-animation's step on the x-axis of that container.
 * _yStepLength: number, if there's no StepLengthCalculator set for a container, this represent the number of pixels scrolled during a
 *                       single scroll-animation's step on the y-axis of that container.
 * _minAnimationFrame: number, this represents the lowest number of frames any scroll-animation on a container should last if no 
 *                     stepLengthCalculator is set for it.
 * _windowWidth: number, the current Window's inner width (in px).
 * _windowHeight: number, the current Window's inner height (in px).
 * _scrollbarsMaxDimension: number, the highest number of pixels any scrollbar on the page can occupy (it's browser dependent).
 * _framesTime: number, the time in milliseconds between two consecutive browser's frame repaints (e.g. at 60fps this is 16.6ms).
 * _windowScroller: object, the element that scrolls the Window when it's scrolled and that (viceversa) is scrolled when the Window is scrolled.
 * _pageScroller: object, the element that scrolls the document. 
 *                        It's also the value used when an API method requires the container input parameter but nothing is passed.
 * _reducedMotion: boolean, true if the user has enabled any reduce-motion setting devicewise, false otherwise. 
 *                 Internally used by the API to follow the user's accessibility preferences by reverting back every scroll-animation 
 *                 to the default jump-to-position behavior.
 * _onResizeEndCallbacks: array, contains all the functions that should be executed only 
 *                        once the user has finished resizing the browser's Window and has interacted with it.
 *                        An interaction can be a:
 *                         - pointerover event
 *                         - pointerdown event
 *                         - touchstart event
 *                         - mousemove event
 *                         - keydown event
 *                         - focus event
 * _debugMode: string, controls the way the warning and error messages are logged by the default error/warning loggers.
 *             If it's set to:
 *             - "disabled" (case insensitive) the API won't show any warning or error message. 
 *             - "legacy" (case insensitive) the API won't style any warning or error message.
 *             - Any other string will make the warning and error messages be displayed with the default API's styling.
 *             Custom values of the _errorLogger and/or _warningLogger properties should respect this preference.
 * _errorLogger: function, logs the API error messages inside the browser's console.
 * _warningLogger: function, logs the API warning messages inside the browser's console.
 */


/*
 * FUNCTIONS (PUBLIC USE):
 *
 * isXScrolling: function, returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
 * isYScrolling: function, returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
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
 * getWindowScroller: function, returns the value of the "_windowScroller" property.
 * getPageScroller: function, returns the value of the "_pageScroller" property.
 * getReducedMotionState: function, returns the value of the "_reducedMotion" property.
 * getOnResizeEndCallbacks: function, returns the value of the "_onResizeEndCallbacks" property.
 * getDebugMode: function, returns the value of the "_debugMode" property.
 * setXStepLengthCalculator: function, sets the StepLengthCalculator for (the x-axis of) the passed container if compatible.
 * setYStepLengthCalculator: function, sets the StepLengthCalculator for (the y-axis of) the passed container if compatible.
 * setStepLengthCalculator: function, sets the StepLengthCalculator for (both the y and x axes of) the passed container if compatible.
 * setXStepLength: function, sets the "_xStepLength" property to the passed value if compatible.
 * setYStepLength: function, sets the "_yStepLength" property to the passed value if compatible.
 * setStepLength: function, sets both the "_xStepLength" and the "_yStepLength" properties to the passed value if compatible.
 * setMinAnimationFrame: function, sets the "_minAnimationFrame" property to the passed value if compatible.
 * setPageScroller: function, sets the "_pageScroller" property to the passed value if compatible.
 * addOnResizeEndCallback: function, adds the passed function to the "_onResizeEndCallbacks" array. 
 * setDebugMode: function, sets the "_debugMode" property to the passed value if compatible.
 * setErrorLogger: function, sets the "_errorLogger" property to the passed value if compatible.
 * setWarningLogger: function, sets the "_warningLogger" property to the passed value if compatible.
 * calcXScrollbarDimension: function, returns the vertical scrollbar's width (in px) of the passed container.
 * calcYScrollbarDimension: function, returns the horizontal scrollbar's height (in px) of the passed container.
 * calcScrollbarsDimensions: function, returns an array containing 2 numbers:
 *                           [0] contains the vertical scrollbar's width (in px) of the passed container.
 *                           [1] contains the horizontal scrollbar's height (in px) of the passed container.
 * calcBordersDimensions: function, returns an array containing 4 numbers:
 *                        [0] contains the top border's height (in px) of the passed container.
 *                        [1] contains the right border's width (in px) of the passed container.
 *                        [2] contains the bottom border's height (in px) of the passed container.
 *                        [3] contains the left border's width (in px) of the passed container.
 *                        The returned border sizes don't take into consideration the css "transform" property's effects. 
 * getScrollXCalculator: function, returns a function that returns:
 *                       - The scrollLeft property of the passed container if it's an instance of Element.
 *                       - The scrollX property of the passed container if it's the Window.
 * getScrollYCalculator: function, returns a function that returns:
 *                       - The scrollTop property of the passed container if it's an instance of Element.
 *                       - The scrollY property of the passed container if it's the Window.
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

{
const INITIAL_WINDOW_WIDTH  = window.innerWidth;
const INITIAL_WINDOW_HEIGHT = window.innerHeight;
const DEFAULT_XSTEP_LENGTH = 16 + 7 / 1508 * (INITIAL_WINDOW_WIDTH - 412);                         //16px at 412px of width  && 23px at 1920px of width 
const DEFAULT_YSTEP_LENGTH = Math.max(1, Math.abs(38 - 20 / 140 * (INITIAL_WINDOW_HEIGHT - 789))); //38px at 789px of height && 22px at 1920px of height
const DEFAULT_MIN_ANIMATION_FRAMES = INITIAL_WINDOW_HEIGHT / DEFAULT_YSTEP_LENGTH;                 //51 frames at 929px of height
const DEFAULT_FRAME_TIME = 16.6; //in ms
const DEFAULT_XSTEP_LENGTH_CALCULATOR = (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
  const _stepLength = total / uss._minAnimationFrame;
  if(_stepLength < 1) return 1;
  if(_stepLength > uss._xStepLength) return uss._xStepLength;
  return _stepLength;
}

const DEFAULT_YSTEP_LENGTH_CALCULATOR = (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
  const _stepLength = total / uss._minAnimationFrame;
  if(_stepLength < 1) return 1;
  if(_stepLength > uss._yStepLength) return uss._yStepLength;
  return _stepLength;
}

const DEFAULT_ERROR_LOGGER = (functionName, expectedValue, receivedValue) => {
  if(/disabled/i.test(uss._debugMode)) return;
  
  //Convert to a string and eventually trim the receivedValue.
  const _receivedValueIsString = typeof receivedValue === "string";
  if(!_receivedValueIsString) {
    if(receivedValue === null || receivedValue === undefined) receivedValue = String(receivedValue);
    else if(receivedValue === window) receivedValue = "window";
    else if(Array.isArray(receivedValue)) receivedValue = "[" + receivedValue.toString() + "]"; 
    else if(receivedValue instanceof Element || (receivedValue.tagName && (receivedValue.id || receivedValue.className))) {
      const _id = receivedValue.id ? "#" + receivedValue.id : "";
      const _className = receivedValue.className ? "." + receivedValue.className : "";
      receivedValue = receivedValue.tagName.toLowerCase() + _id + _className;
    } else {
      receivedValue = receivedValue.name || 
                      receivedValue.outerHTML ||
                      receivedValue
                      .toString()
                      .replace(new RegExp("\n", "g"), "");
    } 
  }

  if(receivedValue.length > 40) receivedValue = receivedValue.slice(0, 40) + " ...";
  if(_receivedValueIsString) receivedValue = "\"" + receivedValue + "\"";

  if(/legacy/i.test(uss._debugMode)) {
    console.log("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)\n");
    console.error("USS ERROR\n", functionName, "was expecting", expectedValue + ", but received", receivedValue + ".");
    throw "USS fatal error (execution stopped)";
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
  throw "USS fatal error (execution stopped)";
}

const DEFAULT_WARNING_LOGGER = (subject, message, keepQuotesForString = true) => {
  if(/disabled/i.test(uss._debugMode)) return;

  //Convert to a string and eventually trim the subject.
  const _subjectIsString = typeof subject === "string";
  if(!_subjectIsString) {
    if(subject === null || subject === undefined) subject = String(subject);
    else if(subject === window) subject = "window";
    else if(Array.isArray(subject)) subject = "[" + subject.toString() + "]"; 
    else if(subject instanceof Element || (subject.tagName && (subject.id || subject.className))) {
      const _id = subject.id ? "#" + subject.id : "";
      const _className = subject.className ? "." + subject.className : "";
      subject = subject.tagName.toLowerCase() + _id + _className;
    } else {
      subject = subject.name || 
                subject.outerHTML ||
                subject
                .toString()
                .replace(new RegExp("\n", "g"), "");
    }
  }

  if(subject.length > 40) subject = subject.slice(0, 40) + " ...";
  if(_subjectIsString && keepQuotesForString) subject = "\"" + subject + "\"";

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

window.uss = {
  _containersData: new Map(),
  _xStepLength: DEFAULT_XSTEP_LENGTH,
  _yStepLength: DEFAULT_YSTEP_LENGTH,
  _minAnimationFrame: DEFAULT_MIN_ANIMATION_FRAMES,
  _windowWidth:  INITIAL_WINDOW_WIDTH,
  _windowHeight: INITIAL_WINDOW_HEIGHT,
  _scrollbarsMaxDimension: null,
  _framesTime: DEFAULT_FRAME_TIME,
  _windowScroller: null,
  _pageScroller: null,
  _reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches,
  _onResizeEndCallbacks: [],
  _debugMode: "",
  _errorLogger: DEFAULT_ERROR_LOGGER,
  _warningLogger: DEFAULT_WARNING_LOGGER,
  isXScrolling: (container = uss._pageScroller, options = {debugString: "isXScrolling"}) => {
    const _containerData = uss._containersData.get(container);

    if(_containerData) return !!_containerData[0];

    if(container === window || container instanceof Element) {
      uss._containersData.set(container, []);
      return false;
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  }, 
  isYScrolling: (container = uss._pageScroller, options = {debugString: "isYScrolling"}) => {
    const _containerData = uss._containersData.get(container);

    if(_containerData) return !!_containerData[1];

    if(container === window || container instanceof Element) {
      uss._containersData.set(container, []);
      return false;
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },   
  isScrolling: (container = uss._pageScroller, options = {debugString: "isScrolling"}) => {
    const _containerData = uss._containersData.get(container);

    if(_containerData) return !!(_containerData[0] || _containerData[1]);

    if(container === window || container instanceof Element) {
      uss._containersData.set(container, []);
      return false;
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getFinalXPosition: (container = uss._pageScroller, options = {debugString: "getFinalXPosition"}) => {
    //If there's no scroll-animation on the x-axis, the current position is returned instead.
    const _containerData = uss._containersData.get(container) || [];
    return _containerData[2] === 0 ? 0 : _containerData[2] || uss.getScrollXCalculator(container, options)();
  },
  getFinalYPosition: (container = uss._pageScroller, options = {debugString: "getFinalYPosition"}) => {
    //If there's no scroll-animation on the y-axis, the current position is returned instead.
    const _containerData = uss._containersData.get(container) || [];
    return _containerData[3] === 0 ? 0 : _containerData[3] || uss.getScrollYCalculator(container, options)();
  },
  getScrollXDirection: (container = uss._pageScroller, options = {debugString: "getScrollXDirection"}) => {
    const _containerData = uss._containersData.get(container);
    
    //If there's no scroll-animation, 0 is returned.
    if(_containerData) return _containerData[4] || 0;
    
    if(container === window || container instanceof Element) {
      uss._containersData.set(container, []);
      return 0; 
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getScrollYDirection: (container = uss._pageScroller, options = {debugString: "getScrollYDirection"}) => {
    const _containerData = uss._containersData.get(container);
    
    //If there's no scroll-animation, 0 is returned.
    if(_containerData) return _containerData[5] || 0;
    
    if(container === window || container instanceof Element) {
      uss._containersData.set(container, []);
      return 0; 
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getXStepLengthCalculator: (container = uss._pageScroller, getTemporary = false, options = {debugString: "getXStepLengthCalculator"}) => {
    const _containerData = uss._containersData.get(container);
        
    if(_containerData) return getTemporary ? _containerData[14] : _containerData[12];

    if(container === window || container instanceof Element) {
      uss._containersData.set(container, []);
      return; 
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);    
  },
  getYStepLengthCalculator: (container = uss._pageScroller, getTemporary = false, options = {debugString: "getYStepLengthCalculator"}) => {    
    const _containerData = uss._containersData.get(container);
        
    if(_containerData) return getTemporary ? _containerData[15] : _containerData[13];

    if(container === window || container instanceof Element) {
      uss._containersData.set(container, []);
      return; 
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);    
  },
  getXStepLength: () => uss._xStepLength,
  getYStepLength: () => uss._yStepLength,
  getMinAnimationFrame: () => uss._minAnimationFrame,
  getWindowWidth:  () => uss._windowWidth,
  getWindowHeight: () => uss._windowHeight,
  getScrollbarsMaxDimension: (forceCalculation = false) => {
    /**
     * Calculate the maximum sizes of scrollbars on the webpage by:
     * - creating a <div> with id = "__ussScrollBox"
     * - giving that <div> a mini-stylesheet that forces it to show the scrollbars 
     */
    if(forceCalculation || !Number.isFinite(uss._scrollbarsMaxDimension)) {
      const __scrollBoxStyle = document.createElement("style");
      const __scrollBox = document.createElement("div");
      __scrollBox.id = "__uss-ScrollBox";
      __scrollBoxStyle.appendChild(
        document.createTextNode(
          "#__uss-ScrollBox { display:block; width:100px; height:100px; overflow-x:scroll; border:none; padding:0px; }"  + 
          "#__uss-ScrollBox::-webkit-scrollbar { display:block; width:initial; height:initial; }"
        )
      );
      document.head.appendChild(__scrollBoxStyle);
      document.body.appendChild(__scrollBox);
      uss._scrollbarsMaxDimension = __scrollBox.offsetHeight - __scrollBox.clientHeight;
      document.body.removeChild(__scrollBox);
      document.head.removeChild(__scrollBoxStyle);
    }

    return uss._scrollbarsMaxDimension;
  },
  getWindowScroller: (forceCalculation = false) => {
    //Check if the _windowScroller has already been calculated.
    if(forceCalculation || !uss._windowScroller) {
      /**
       * Test if the window is scrollable and if scrolling it 
       * also scrolls the passed element.
       * Returns true if the uss._windowScroller has been set, false otherwise.
       */
      const _testScroller = (element) => {
        //Save the original scroll positions of the Window and the element.
        const _originalWindowXPos = window.scrollX;
        const _originalWindowYPos = window.scrollY; 
        const _originalElementXPos = element.scrollLeft;
        const _originalElementYPos = element.scrollTop; 

        //Scroll the Window and the element to a known initial position.
        window.scroll(0,0);
        element.scroll(0,0);

        //Try to scroll the element by scrolling the Window.
        window.scroll(100, 100);

        const __isWindowScrollable = window.scrollX !== 0 || window.scrollY !== 0;
        const __windowScrollsElement = __isWindowScrollable && 
                                      element.scrollLeft === window.scrollX && 
                                      element.scrollTop === window.scrollY;
                          
        //Restore the original scroll positions of the Window and the element.
        window.scroll(_originalWindowXPos, _originalWindowYPos);
        element.scroll(_originalElementXPos, _originalElementYPos);
        
        if(!__isWindowScrollable) {
          uss._windowScroller = window;
          return true;
        }
        if(__windowScrollsElement) {
          uss._windowScroller = element;
          return true;
        }
        return false;
      }

      //Only test the body if the html is not the element that scrolls the window.
      if(!_testScroller(document.documentElement)) {
        if(!_testScroller(document.body)) {
          uss._windowScroller = window; //Fallback to window
        }
      }
    }

    return uss._windowScroller;
  },
  getPageScroller: (forceCalculation = false, options = {debugString: "getPageScroller"}) => {
    //Check if the _pageScroller has already been calculated.
    if(forceCalculation || !uss._pageScroller) {
      //The _pageScroller is the element that can scroll the further between document.documentElement and document.body.
      //If there's a tie or neither of those can scroll, it's defaulted to the 
      //the document.scrollingElement (if supported) or the Window.
      const _htmlMaxScrollX = uss.getMaxScrollX(document.documentElement, true, options);
      const _htmlMaxScrollY = uss.getMaxScrollY(document.documentElement, true, options);
      const _bodyMaxScrollX = uss.getMaxScrollX(document.body, true, options);
      const _bodyMaxScrollY = uss.getMaxScrollY(document.body, true, options);

      //Cache the _pageScroller for later use.
      if(
        (_htmlMaxScrollX >  _bodyMaxScrollX && _htmlMaxScrollY >= _bodyMaxScrollY) ||
        (_htmlMaxScrollX >= _bodyMaxScrollX && _htmlMaxScrollY >  _bodyMaxScrollY)
      ) {
        uss._pageScroller = document.documentElement;
      } else if(
        (_bodyMaxScrollX >  _htmlMaxScrollX && _bodyMaxScrollY >= _htmlMaxScrollY) || 
        (_bodyMaxScrollX >= _htmlMaxScrollX && _bodyMaxScrollY >  _htmlMaxScrollY) 
      ) {
        uss._pageScroller = document.body;
      } else {
        uss._pageScroller = document.scrollingElement || window;
      }
    }

    return uss._pageScroller;
  },
  getReducedMotionState: () => uss._reducedMotion,
  getOnResizeEndCallbacks: () => uss._onResizeEndCallbacks,
  getDebugMode: () => uss._debugMode, 
  setXStepLengthCalculator: (newCalculator = DEFAULT_XSTEP_LENGTH_CALCULATOR, container = uss._pageScroller, isTemporary = false, options = {debugString: "setXStepLengthCalculator"}) => {
    if(typeof newCalculator !== "function") {
      uss._errorLogger(options.debugString, "the newCalculator to be a function", newCalculator);
      return;
    }

    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    }

    if(isTemporary) {
      _containerData[14] = newCalculator;
    } else {
      //Setting a non-temporary StepLengthCalculator will unset the temporary one.
      _containerData[12] = newCalculator;
      _containerData[14] = null; 
    }  
  },
  setYStepLengthCalculator: (newCalculator = DEFAULT_YSTEP_LENGTH_CALCULATOR, container = uss._pageScroller, isTemporary = false, options = {debugString: "setYStepLengthCalculator"}) => {
    if(typeof newCalculator !== "function") {
      uss._errorLogger(options.debugString, "the newCalculator to be a function", newCalculator);
      return;
    }

    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    }

    if(isTemporary) {
      _containerData[15] = newCalculator;
    } else {
      //Setting a non-temporary StepLengthCalculator will unset the temporary one.
      _containerData[13] = newCalculator;
      _containerData[15] = null; 
    }  
  },
  setStepLengthCalculator: (newCalculator, container = uss._pageScroller, isTemporary = false, options = {debugString: "setStepLengthCalculator"}) => {
    if(typeof newCalculator !== "function") {
      uss._errorLogger(options.debugString, "the newCalculator to be a function", newCalculator);
      return;
    }

    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    }

    if(isTemporary) {
      _containerData[14] = newCalculator;
      _containerData[15] = newCalculator;
    } else {
      //Setting a non-temporary StepLengthCalculator will unset the temporary one.
      _containerData[12] = newCalculator;
      _containerData[13] = newCalculator;
      _containerData[14] = null; 
      _containerData[15] = null; 
    }
  },
  setXStepLength: (newXStepLength = DEFAULT_XSTEP_LENGTH, options = {debugString: "setXStepLength"}) => {
    if(!Number.isFinite(newXStepLength) || newXStepLength <= 0) {
      uss._errorLogger(options.debugString, "the newXStepLength to be a positive number", newXStepLength);
      return;
    }
    uss._xStepLength = newXStepLength;
  },
  setYStepLength: (newYStepLength = DEFAULT_YSTEP_LENGTH, options = {debugString: "setYStepLength"}) => {
    if(!Number.isFinite(newYStepLength) || newYStepLength <= 0) {
      uss._errorLogger(options.debugString, "the newYStepLength to be a positive number", newYStepLength);
      return;
    }
    uss._yStepLength = newYStepLength;
  },
  setStepLength: (newStepLength, options = {debugString: "setStepLength"}) => {
    if(!Number.isFinite(newStepLength) || newStepLength <= 0) {
      uss._errorLogger(options.debugString, "the newStepLength to be a positive number", newStepLength);
      return;
    }
    uss._xStepLength = newStepLength;
    uss._yStepLength = newStepLength;
  },
  setMinAnimationFrame: (newMinAnimationFrame = DEFAULT_MIN_ANIMATION_FRAMES, options = {debugString: "setMinAnimationFrame"}) => {
    if(!Number.isFinite(newMinAnimationFrame) || newMinAnimationFrame <= 0) {
      uss._errorLogger(options.debugString, "the newMinAnimationFrame to be a positive number", newMinAnimationFrame);
      return;
    }
    uss._minAnimationFrame = newMinAnimationFrame;
  },
  setPageScroller: (newPageScroller, options = {debugString: "setPageScroller"}) => {
    if(!uss._containersData.get(newPageScroller)) {
      if(newPageScroller !== window && !(newPageScroller instanceof Element)) {
        uss._errorLogger(options.debugString, "the newPageScroller to be an Element or the Window", newPageScroller);
        return;
      }
      uss._containersData.set(newPageScroller, []);
    }
    uss._pageScroller = newPageScroller;
  },
  addOnResizeEndCallback: (newCallback, options = {debugString: "addOnResizeEndCallback"}) => {
    if(typeof newCallback !== "function") {
      uss._errorLogger(options.debugString, "the newCallback to be a function", newCallback);
      return;
    }
    uss._onResizeEndCallbacks.push(newCallback);
  },
  setDebugMode: (newDebugMode = "", options = {debugString: "setDebugMode"}) => {
    if(typeof newDebugMode === "string") {
      uss._debugMode = newDebugMode;
      return;
    }
    console.error("USS ERROR\n", 
                  options.debugString, 
                  "was expecting the newDebugMode to be \"disabled\", \"legacy\" or any other string, but received", newDebugMode + "."
    );
  },
  setErrorLogger: (newErrorLogger = DEFAULT_ERROR_LOGGER, options = {debugString: "setErrorLogger"}) => {
    if(typeof newErrorLogger !== "function") {
      uss._errorLogger(options.debugString, "the newErrorLogger to be a function", newErrorLogger);
      return;
    }
    uss._errorLogger = newErrorLogger;
  }, 
  setWarningLogger: (newWarningLogger = DEFAULT_WARNING_LOGGER, options = {debugString: "setWarningLogger"}) => {
    if(typeof newWarningLogger !== "function") {
      uss._errorLogger(options.debugString, "the newWarningLogger to be a function", newWarningLogger);
      return;
    }
    uss._warningLogger = newWarningLogger;
  }, 
  calcXScrollbarDimension: (container, forceCalculation = false, options = {debugString: "calcXScrollbarDimension"}) => {
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      /**
       * Only instances of HTMLElement and SVGElement have the style property, but
       * they both implement Element and there are no other implementation of this interface on a website,
       * so its fine to check for the container being instanceof Element.
       */
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    } else if(!forceCalculation && Number.isFinite(_containerData[18])) {
      return _containerData[18]; //Vertical scrollbar's width
    }

    let _scrollbarDimension;

    //The scrollbars can only be 0px on this webpage.
    if(uss.getScrollbarsMaxDimension(false) === 0) {
      _scrollbarDimension = 0;
    } else if(container === window) { 
      const _pageScroller = uss.getPageScroller(false, options);
      options.debugString = "calcXScrollbarDimension(uss.getPageScroller(false))";
      _scrollbarDimension = _pageScroller === window ? 0 : uss.calcXScrollbarDimension(_pageScroller, forceCalculation, options);
    } else {
      const _style = window.getComputedStyle(container); //Live object
      const _originalWidth  = Number.parseInt(_style.width);
      const _clientWidth  = container.clientWidth;
      const _originalOverflowY = container.style.overflowY;
      const _originalScrollLeft = container.scrollLeft;

      //The properties of _style are automatically updated whenever the style is changed.
      container.style.overflowY = "hidden"; //The container is forced to hide its vertical scrollbars
    
      //When the vertical scrollbar is hidden the container's width increases only if 
      //it was originally showing a scrollbar, otherwise it remains the same. 
      _scrollbarDimension = Number.parseInt(_style.width) - _originalWidth; //Vertical scrollbar's width

      //If the container is not scrollable but has "overflow:scroll"
      //the dimensions can only be calculated by using clientWidth.
      //If the overflow is "visible" the dimensions are < 0.
      if(_scrollbarDimension === 0)    _scrollbarDimension = container.clientWidth - _clientWidth;
      else if(_scrollbarDimension < 0) _scrollbarDimension = 0;
      
      container.style.overflowY = _originalOverflowY;
      container.scrollLeft = _originalScrollLeft;
    }

    //Cache the value for later use.
    _containerData[18] = _scrollbarDimension;

    return _scrollbarDimension;
  },
  calcYScrollbarDimension: (container, forceCalculation = false, options = {debugString: "calcYScrollbarDimension"}) => {
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      /**
       * Only instances of HTMLElement and SVGElement have the style property, but
       * they both implement Element and there are no other implementation of this interface on a website,
       * so its fine to check for the container being instanceof Element.
       */
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    } else if(!forceCalculation && Number.isFinite(_containerData[19])) {
      return _containerData[19]; //Horizontal scrollbar's height
    }

    let _scrollbarDimension;

    //The scrollbars can only be 0px on this webpage.
    if(uss.getScrollbarsMaxDimension(false) === 0) {
      _scrollbarDimension = 0;
    } else if(container === window) {
      const _pageScroller = uss.getPageScroller(false, options);
      options.debugString = "calcYScrollbarDimension(uss.getPageScroller(false))";
      _scrollbarDimension = _pageScroller === window ? 0 : uss.calcYScrollbarDimension(_pageScroller, forceCalculation, options);
    } else {
      const _style = window.getComputedStyle(container);
      const _originalHeight = Number.parseInt(_style.height);   
      const _clientHeight = container.clientHeight;
      const _originalOverflowX = container.style.overflowX;
      const _originalScrollTop  = container.scrollTop;

      //The properties of _style are automatically updated whenever the style is changed.
      container.style.overflowX = "hidden"; //The container is forced to hide its horizontal scrollbars
    
      //When the horizontal scrollbar is hidden the container's height increases only if 
      //it was originally showing a scrollbar, otherwise it remains the same. 
      _scrollbarDimension = Number.parseInt(_style.height) - _originalHeight; //Horizontal scrollbar's height

      //If the container is not scrollable but has "overflow:scroll"
      //the dimensions can only be calculated by using clientHeight.
      //If the overflow is "visible" the dimensions are < 0.
      if(_scrollbarDimension === 0)    _scrollbarDimension = container.clientHeight - _clientHeight;
      else if(_scrollbarDimension < 0) _scrollbarDimension = 0;
      
      container.style.overflowX = _originalOverflowX;
      container.scrollTop = _originalScrollTop;
    }

    //Cache the value for later use.
    _containerData[19] = _scrollbarDimension;

    return _scrollbarDimension;
  },
  calcScrollbarsDimensions: (container, forceCalculation = false, options = {debugString: "calcScrollbarsDimensions"}) => {
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      /**
       * Only instances of HTMLElement and SVGElement have the style property, but
       * they both implement Element and there are no other implementation of this interface on a website,
       * so its fine to check for the container being instanceof Element.
       */
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    } else if(!forceCalculation && 
              Number.isFinite(_containerData[18]) && 
              Number.isFinite(_containerData[19])
    ) {
      return [
        _containerData[18], //Vertical scrollbar's width
        _containerData[19]  //Horizontal scrollbar's height
      ];
    }

    let _scrollbarsDimensions;

    //The scrollbars can only be 0px on this webpage.
    if(uss.getScrollbarsMaxDimension(false) === 0) {
      _scrollbarsDimensions = [0,0];
    } else if(container === window) { 
      const _pageScroller = uss.getPageScroller(false, options);
      options.debugString = "calcScrollbarsDimensions(uss.getPageScroller(false))";
      _scrollbarsDimensions = _pageScroller === window ? [0,0] : uss.calcScrollbarsDimensions(_pageScroller, forceCalculation, options);
    } else {
      _scrollbarsDimensions = [];
      const _style = window.getComputedStyle(container);
      const _originalWidth  = Number.parseInt(_style.width);
      const _originalHeight = Number.parseInt(_style.height);   
      const _clientWidth  = container.clientWidth;
      const _clientHeight = container.clientHeight;
      const _originalOverflowX = container.style.overflowX;
      const _originalOverflowY = container.style.overflowY;
      const _originalScrollLeft = container.scrollLeft;
      const _originalScrollTop  = container.scrollTop;

      //The properties of _style are automatically updated whenever the style is changed.
      container.style.overflowX = "hidden"; //The container is forced to hide its horizontal scrollbars
      container.style.overflowY = "hidden"; //The container is forced to hide its vertical scrollbars
    
      //When the scrollbars are hidden the container's width/height increase only if 
      //it was originally showing scrollbars, otherwise they remain the same. 
      _scrollbarsDimensions[0] = Number.parseInt(_style.width)  - _originalWidth;  //Vertical scrollbar's width
      _scrollbarsDimensions[1] = Number.parseInt(_style.height) - _originalHeight; //Horizontal scrollbar's height

      //If the container is not scrollable but has "overflow:scroll"
      //the dimensions can only be calculated by using clientWidth/clientHeight.
      //If the overflow is "visible" the dimensions are < 0.
      if(_scrollbarsDimensions[0] === 0)    _scrollbarsDimensions[0] = container.clientWidth - _clientWidth;
      else if(_scrollbarsDimensions[0] < 0) _scrollbarsDimensions[0] = 0;
      
      if(_scrollbarsDimensions[1] === 0)    _scrollbarsDimensions[1] = container.clientHeight - _clientHeight;
      else if(_scrollbarsDimensions[1] < 0) _scrollbarsDimensions[1] = 0;
      
      container.style.overflowX = _originalOverflowX;
      container.style.overflowY = _originalOverflowY;
      container.scrollLeft = _originalScrollLeft;
      container.scrollTop  = _originalScrollTop;
    }

    //Cache the values for later use.
    _containerData[18] = _scrollbarsDimensions[0];
    _containerData[19] = _scrollbarsDimensions[1];
    
    return _scrollbarsDimensions;
  },
  calcBordersDimensions: (container, forceCalculation = false, options = {debugString: "calcBordersDimensions"}) => {
    //Check if the bordersDimensions of the passed container have already been calculated. 
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    } else if(!forceCalculation && 
        Number.isFinite(_containerData[20]) && 
        Number.isFinite(_containerData[21]) && 
        Number.isFinite(_containerData[22]) && 
        Number.isFinite(_containerData[23]) 
    ) {
      return [
        _containerData[20], //top
        _containerData[21], //right
        _containerData[22], //bottom
        _containerData[23], //left
      ];
    }

    let _bordersDimensions;

    if(container === window) { 
      const _pageScroller = uss.getPageScroller(false, options);
      options.debugString = "calcBordersDimensions(uss.getPageScroller())";
      _bordersDimensions = _pageScroller === window ? [0,0,0,0] : uss.calcBordersDimensions(_pageScroller, forceCalculation, options);
    } else {
      const _style = window.getComputedStyle(container);
      _bordersDimensions = [
                              Number.parseFloat(_style.borderTopWidth),
                              Number.parseFloat(_style.borderRightWidth),
                              Number.parseFloat(_style.borderBottomWidth),
                              Number.parseFloat(_style.borderLeftWidth)
                            ];
    }

    //Cache the values for later use.
    _containerData[20] = _bordersDimensions[0]; //top
    _containerData[21] = _bordersDimensions[1]; //right
    _containerData[22] = _bordersDimensions[2]; //bottom
    _containerData[23] = _bordersDimensions[3]; //left

    return _bordersDimensions;
  },
  getScrollXCalculator: (container = uss._pageScroller, options = {debugString: "getScrollXCalculator"}) => {
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_containerData[28]) {
      /**
       * Since the functions that determine the scroll position of the container
       * are fixed, we can cache the scrollYCalculator of container too. 
       */
      if(container === window) {
        _containerData[28] = () => window.scrollX; //ScrollXCalculator
        _containerData[29] = () => window.scrollY; //ScrollYCalculator
      } else if(container instanceof Element) {
        _containerData[28] = () => container.scrollLeft; //ScrollXCalculator
        _containerData[29] = () => container.scrollTop;  //ScrollYCalculator
      } else {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);     
        return;                                  
      }
      if(!_oldData) uss._containersData.set(container, _containerData);
    }
    return _containerData[28];
  },
  getScrollYCalculator: (container = uss._pageScroller, options = {debugString: "getScrollYCalculator"}) => {
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_containerData[29]) {
      /**
       * Since the functions that determine the scroll position of the container
       * are fixed, we can cache the scrollXCalculator of container too. 
       */
      if(container === window) {
        _containerData[28] = () => window.scrollX; //ScrollXCalculator
        _containerData[29] = () => window.scrollY; //ScrollYCalculator
      } else if(container instanceof Element) {
        _containerData[28] = () => container.scrollLeft; //ScrollXCalculator
        _containerData[29] = () => container.scrollTop;  //ScrollYCalculator
      } else {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);                                       
        return;                                  
      }
      uss._containersData.set(container, _containerData);
    }
    return _containerData[29];
  },
  getMaxScrollX: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "getMaxScrollX"}) => {
    //Check if the maxScrollX value for the passed container has already been calculated. 
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];
    if(!forceCalculation && Number.isFinite(_containerData[16])) return _containerData[16];

    if(container === window) {
      const _originalXPosition = window.scrollX;
      container.scroll(1073741824, window.scrollY); //highest safe scroll value: 2^30 = 1073741824
      const _maxScroll = window.scrollX;
      container.scroll(_originalXPosition, window.scrollY);

      //Cache the value for later use.
      _containerData[16] = _maxScroll;
      if(!_oldData) uss._containersData.set(container, _containerData);

      return _maxScroll;
    }
    if(container instanceof Element) {
      const _originalXPosition = container.scrollLeft;
      container.scrollLeft = 1073741824; //highest safe scroll value: 2^30 = 1073741824
      const _maxScroll = container.scrollLeft;
      container.scrollLeft = _originalXPosition;

      //Cache the value for later use.
      _containerData[16] = _maxScroll;
      if(!_oldData) uss._containersData.set(container, _containerData);
      
      return _maxScroll;
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getMaxScrollY: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "getMaxScrollY"}) => {
    //Check if the maxScrollY value for the passed container has already been calculated. 
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];
    if(!forceCalculation && Number.isFinite(_containerData[17])) return _containerData[17];

    if(container === window) {
      const _originalYPosition = window.scrollY;
      container.scroll(window.scrollX, 1073741824); //highest safe scroll value: 2^30 = 1073741824
      const _maxScroll = window.scrollY;
      container.scroll(window.scrollX, _originalYPosition);
      
      //Cache the value for later use.
      _containerData[17] = _maxScroll;
      if(!_oldData) uss._containersData.set(container, _containerData);

      return _maxScroll;
    }
    if(container instanceof Element) {
      const _originalYPosition = container.scrollTop;
      container.scrollTop = 1073741824; //highest safe scroll value: 2^30 = 1073741824
      const _maxScroll = container.scrollTop;
      container.scrollTop = _originalYPosition;
      
      //Cache the value for later use.
      _containerData[17] = _maxScroll;
      if(!_oldData) uss._containersData.set(container, _containerData);

      return _maxScroll;
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getXScrollableParent: (element, includeHiddenParents = false, options = {debugString: "getXScrollableParent"}) => {
    const _oldData = uss._containersData.get(element);
    const _containerData = _oldData || [];
    const _cachedParent = includeHiddenParents ? _containerData[25] : _containerData[24];
    
    if(_cachedParent || _cachedParent === null) return _cachedParent;

    const _body = document.body;
    const _html = document.documentElement;
    let _cacheResult;
    let _overflowRegex, _overflowRegexWithVisible;

    if(includeHiddenParents) {
      _cacheResult = (el) => _containerData[25] = el;
      _overflowRegex = /(auto|scroll|hidden)/;
      _overflowRegexWithVisible = /(visible|auto|scroll|hidden)/;
    } else {
      _cacheResult = (el) => _containerData[24] = el;
      _overflowRegex = /(auto|scroll)/
      _overflowRegexWithVisible = /(visible|auto|scroll)/;
    }
    
    if(element === window || element === _html) {
      _cacheResult(null);
      if(!_oldData) uss._containersData.set(element, _containerData);
      return null;
    }

    if(!_oldData) {
      if(!(element instanceof Element)) {
        uss._errorLogger(options.debugString, "the element to be an Element or the Window", element);
        return;
      }
      uss._containersData.set(element, _containerData);
    }
    
    //If the element has position:fixed,  
    //it has no scrollable parent.
    let _style = window.getComputedStyle(element);
    if(_style.position === "fixed") {
      _cacheResult(null);
      return null;
    }

    const _relativePositioned = _style.position !== "absolute";
    const _testIfScrollable = (el) => uss.getMaxScrollX(el) >= 1; 
    element = element.parentElement;

    //Test if the any parent of the passed element (up to the _body) 
    //is scrollable on either the x or y axes.
    while(element && element !== _body && element !== _html) {
      _style = window.getComputedStyle(element);

      if((_relativePositioned || _style.position !== "static") &&
          _overflowRegex.test(_style.overflowX) && 
          _testIfScrollable(element)
      ) {
        _cacheResult(element);
        return element;
      }

      //This parent has position:fixed, no other parent can scroll the element.
      if(_style.position === "fixed") {
        _cacheResult(null);
        return null;
      }

      element = element.parentElement;
    }

    //This parent has position:absolute and it's a child of _body, 
    //no other parent can scroll the element.
    if(element === _body && _style.position === "absolute") {
      _cacheResult(null);
      return null;
    }

    const _windowScroller = uss.getWindowScroller(false, options);

    while(element) {
      _style = window.getComputedStyle(element);
      
      if(_overflowRegexWithVisible.test(_style.overflowX) && 
         _testIfScrollable(element)
      ) {
        if(_windowScroller === element) element = window;
        _cacheResult(element);
        return element;
      }

      element = element.parentElement;
    }
    
    _cacheResult(null);
    return null;
  },
  getYScrollableParent: (element, includeHiddenParents = false, options = {debugString: "getYScrollableParent"}) => {
    const _oldData = uss._containersData.get(element);
    const _containerData = _oldData || [];
    const _cachedParent = includeHiddenParents ? _containerData[27] : _containerData[26];
    
    if(_cachedParent || _cachedParent === null) return _cachedParent;

    const _body = document.body;
    const _html = document.documentElement;
    let _cacheResult;
    let _overflowRegex, _overflowRegexWithVisible;

    if(includeHiddenParents) {
      _cacheResult = (el) => _containerData[27] = el;
      _overflowRegex = /(auto|scroll|hidden)/;
      _overflowRegexWithVisible = /(visible|auto|scroll|hidden)/;
    } else {
      _cacheResult = (el) => _containerData[26] = el;
      _overflowRegex = /(auto|scroll)/
      _overflowRegexWithVisible = /(visible|auto|scroll)/;
    }
    
    if(element === window || element === _html) {
      _cacheResult(null);
      if(!_oldData) uss._containersData.set(element, _containerData);
      return null;
    }
    
    if(!_oldData) {
      if(!(element instanceof Element)) {
        uss._errorLogger(options.debugString, "the element to be an Element or the Window", element);
        return;
      }
      uss._containersData.set(element, _containerData);
    }

    //If the element has position:fixed,  
    //it has no scrollable parent.
    let _style = window.getComputedStyle(element);
    if(_style.position === "fixed") {
      _cacheResult(null);
      return null;
    }

    const _relativePositioned = _style.position !== "absolute";
    const _testIfScrollable = (el) => uss.getMaxScrollY(el) >= 1; 
    element = element.parentElement;

    //Test if the any parent of the passed element (up to the _body) 
    //is scrollable on either the x or y axes.
    while(element && element !== _body && element !== _html) {
      _style = window.getComputedStyle(element);

      if((_relativePositioned || _style.position !== "static") &&
          _overflowRegex.test(_style.overflowY) && 
          _testIfScrollable(element)
      ) {
        _cacheResult(element);
        return element;
      }

      //This parent has position:fixed, no other parent can scroll the element.
      if(_style.position === "fixed") {
        _cacheResult(null);
        return null;
      }

      element = element.parentElement;
    }

    //This parent has position:absolute and it's a child of _body, 
    //no other parent can scroll the element.
    if(element === _body && _style.position === "absolute") {
      _cacheResult(null);
      return null;
    }

    const _windowScroller = uss.getWindowScroller(false, options);

    while(element) {
      _style = window.getComputedStyle(element);
      
      if(_overflowRegexWithVisible.test(_style.overflowY) && 
         _testIfScrollable(element)
      ) {
        if(_windowScroller === element) element = window;
        _cacheResult(element);
        return element;
      }

      element = element.parentElement;
    }
    
    _cacheResult(null);
    return null;
  },
  getScrollableParent: (element, includeHiddenParents = false, options = {debugString: "getYScrollableParent"}) => {
    const _oldData = uss._containersData.get(element);
    const _containerData = _oldData || [];
    let _cachedXParent, _cachedYParent;

    if(includeHiddenParents) {
      _cachedXParent = _containerData[25];
      _cachedYParent = _containerData[27];
    } else {
      _cachedXParent = _containerData[24];
      _cachedYParent = _containerData[26];
    }

    /**
     * If at least one parent is cached, get the other and return the one
     * that is met first during the parents' exploration.
     */
    const _xParentIsCached = _cachedXParent || _cachedXParent === null;
    const _yParentIsCached = _cachedYParent || _cachedYParent === null;
    if(_xParentIsCached || _yParentIsCached) {
      if(_xParentIsCached && !_yParentIsCached) {
        _cachedYParent = uss.getYScrollableParent(element, includeHiddenParents, options);
      } else if(!_xParentIsCached && _yParentIsCached) {
        _cachedXParent = uss.getXScrollableParent(element, includeHiddenParents, options);
      }

      return _cachedXParent === window || _cachedXParent === null || _cachedXParent.contains(_cachedYParent) ? _cachedYParent : _cachedXParent;
    }

    const _body = document.body;
    const _html = document.documentElement;
    let _cacheXResult, _cacheYResult;
    let _overflowRegex, _overflowRegexWithVisible;

    if(includeHiddenParents) {
      _cacheXResult = (el) => _containerData[25] = el;
      _cacheYResult = (el) => _containerData[27] = el;
      _overflowRegex = /(auto|scroll|hidden)/;
      _overflowRegexWithVisible = /(visible|auto|scroll|hidden)/;
    } else {
      _cacheXResult = (el) => _containerData[24] = el;
      _cacheYResult = (el) => _containerData[26] = el;
      _overflowRegex = /(auto|scroll)/
      _overflowRegexWithVisible = /(visible|auto|scroll)/;
    }
    
    if(element === window || element === _html) {
      _cacheXResult(null);
      _cacheYResult(null);
      if(!_oldData) uss._containersData.set(element, _containerData);
      return null;
    }

    if(!_oldData) {
      if(!(element instanceof Element)) {
        uss._errorLogger(options.debugString, "the element to be an Element or the Window", element);
        return;
      }
      uss._containersData.set(element, _containerData);
    }

    //If the element has position:fixed,  
    //it has no scrollable parent.
    let _style = window.getComputedStyle(element);
    if(_style.position === "fixed") {
      _cacheXResult(null);
      _cacheYResult(null);
      return null;
    }

    const _relativePositioned = _style.position !== "absolute";
    const _testIfScrollableX = (el) => uss.getMaxScrollX(el) >= 1; 
    const _testIfScrollableY = (el) => uss.getMaxScrollY(el) >= 1; 
    element = element.parentElement;

    //Test if the any parent of the passed element (up to the _body) 
    //is scrollable on either the x or y axes.
    while(element && element !== _body && element !== _html) {
      _style = window.getComputedStyle(element);

      if((_relativePositioned || _style.position !== "static")) {
        const _isXScrollable = _overflowRegex.test(_style.overflowX) && _testIfScrollableX(element);
        const _isYScrollable = _overflowRegex.test(_style.overflowY) && _testIfScrollableY(element);

        if(_isXScrollable && !_isYScrollable) {
          _cacheXResult(element);
          return element;
        }

        if(!_isXScrollable && _isYScrollable) {
          _cacheYResult(element);
          return element;
        }
        
        if(_isXScrollable && _isYScrollable) {
          _cacheXResult(element);
          _cacheYResult(element);
          return element;
        }
      }

      //This parent has position:fixed, no other parent can scroll the element.
      if(_style.position === "fixed") {
        _cacheXResult(null);
        _cacheYResult(null);
        return null;
      }

      element = element.parentElement;
    }

    //This parent has position:absolute and it's a child of _body, 
    //no other parent can scroll the element.
    if(element === _body && _style.position === "absolute") {
      _cacheXResult(null);
      return null;
    }

    const _windowScroller = uss.getWindowScroller(false, options);

    while(element) {
      _style = window.getComputedStyle(element);

      const _isXScrollable = _overflowRegexWithVisible.test(_style.overflowX) && _testIfScrollableX(element);
      const _isYScrollable = _overflowRegexWithVisible.test(_style.overflowY) && _testIfScrollableY(element);

      if(_windowScroller === element) element = window;

      if(_isXScrollable && !_isYScrollable) {
        _cacheXResult(element);
        return element;
      }

      if(!_isXScrollable && _isYScrollable) {
        _cacheYResult(element);
        return element;
      }
      
      if(_isXScrollable && _isYScrollable) {
        _cacheXResult(element);
        _cacheYResult(element);
        return element;
      }

      element = element.parentElement;
    }
    
    _cacheXResult(null);
    _cacheYResult(null);
    return null;
  },
  getAllScrollableParents: (element, includeHiddenParents = false, callback, options = {debugString: "getAllScrollableParents"}) => {
    const _scrollableParents = [];
    const _callback = typeof callback === "function" ? callback : () => {};
    const _scrollableParentFound = (el) => {
      _scrollableParents.push(el);
      _callback(el);
    }

    do {
      element = uss.getScrollableParent(element, includeHiddenParents, options);
      if(element) _scrollableParentFound(element);
    } while(element);

    return _scrollableParents;
  },
  scrollXTo: (finalXPosition, container = uss._pageScroller, callback, containScroll = false, options = {debugString: "scrollXTo"}) => {
    if(!Number.isFinite(finalXPosition)) {
      uss._errorLogger(options.debugString, "the finalXPosition to be a number", finalXPosition);
      return;
    }

    //The container cannot be scrolled on the x-axis.
    const _maxScrollX = uss.getMaxScrollX(container, false, options);
    if(_maxScrollX < 1) {
      uss._warningLogger(container, "is not scrollable on the x-axis", false);
      uss.stopScrollingX(container, callback);
      return; 
    }

    //Limit the final position to the [0, maxScrollX] interval. 
    if(containScroll) {
      if(finalXPosition < 0) finalXPosition = 0;
      else if(finalXPosition > _maxScrollX) finalXPosition = _maxScrollX;
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
    //the API rolls back to the default "jump-to-position" behavior.
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
    _containerData[2]  = finalXPosition;     //finalXPosition
    _containerData[4]  = _direction;         //direction
    _containerData[6]  = _totalScrollAmount; //totalScrollAmount
    _containerData[8]  = null;               //originalTimestamp
    _containerData[10] = callback;           //callback

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated.
    if(!!_containerData[0]) return;

    //No scroll-animation is being performed so a new one is created.
    _containerData[0] = window.requestAnimationFrame(_stepX);
    if(!_oldData) uss._containersData.set(container, _containerData);

    function _stepX(timestamp) {
      const _finalXPosition = _containerData[2];
      const _direction = _containerData[4];
      const _currentXPosition = _scrollXCalculator();
      const _remaningScrollAmount = (_finalXPosition - _currentXPosition) * _direction;
      
      if(_remaningScrollAmount < 1) {
        uss.stopScrollingX(container, _containerData[10]);
        return;
      }
      
      //The originalTimeStamp is null at the beginning of a scroll-animation.
      if(!_containerData[8]) _containerData[8] = timestamp;
      
      const _scrollID = _containerData[0];  
      let _stepLength = _containerData[14] ? _containerData[14](_remaningScrollAmount, _containerData[8], timestamp, _containerData[6], _currentXPosition, _finalXPosition, container) :
                        _containerData[12] ? _containerData[12](_remaningScrollAmount, _containerData[8], timestamp, _containerData[6], _currentXPosition, _finalXPosition, container) :
                                             DEFAULT_XSTEP_LENGTH_CALCULATOR(_remaningScrollAmount, _containerData[8], timestamp, _containerData[6], _currentXPosition, _finalXPosition, container);
      
      //The current scroll-animation has been aborted by the stepLengthCalculator.
      if(_scrollID !== _containerData[0]) return; 

      //The current scroll-animation has been altered by the stepLengthCalculator.
      if(_finalXPosition !== _containerData[2]) {  
        _containerData[0] = window.requestAnimationFrame(_stepX); 
        return;
      } 

      //The stepLengthCalculator returned an invalid stepLength.
      if(!Number.isFinite(_stepLength)) {
        uss._warningLogger(_stepLength, "is not a valid step length", true);
        _stepLength = DEFAULT_XSTEP_LENGTH_CALCULATOR(_remaningScrollAmount, _containerData[8], timestamp, _containerData[6], _currentXPosition, _finalXPosition, container);
      }

      if(_remaningScrollAmount <= _stepLength) {
        _scroll(_finalXPosition);
        uss.stopScrollingX(container, _containerData[10]);
        return;
      }

      _scroll(_currentXPosition + _stepLength * _direction);

      //The API tried to scroll but the finalXPosition was beyond the scroll limit of the container.
      if(_stepLength !== 0 && _currentXPosition === _scrollXCalculator()) {
        uss.stopScrollingX(container, _containerData[10]);
        return;
      }

      _containerData[0] = window.requestAnimationFrame(_stepX);
    }
  },
  scrollYTo: (finalYPosition, container = uss._pageScroller, callback, containScroll = false, options = {debugString: "scrollYTo"}) => {
    if(!Number.isFinite(finalYPosition)) {
      uss._errorLogger(options.debugString, "the finalYPosition to be a number", finalYPosition);
      return;
    }

    //The container cannot be scrolled on the y-axis.
    const _maxScrollY = uss.getMaxScrollY(container, false, options);
    if(_maxScrollY < 1) {
      uss._warningLogger(container, "is not scrollable on the y-axis", false);
      uss.stopScrollingY(container, callback);
      return;
    }

    //Limit the final position to the [0, maxScrollY] interval. 
    if(containScroll) {
      if(finalYPosition < 0) finalYPosition = 0;
      else if(finalYPosition > _maxScrollY) finalYPosition = _maxScrollY;
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
    //the API rolls back to the default "jump-to-position" behavior.
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
    _containerData[3]  = finalYPosition;     //finalYPosition
    _containerData[5]  = _direction;         //direction
    _containerData[7]  = _totalScrollAmount; //totalScrollAmount
    _containerData[9]  = null;               //originalTimestamp
    _containerData[11] = callback;           //callback

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated.
    if(!!_containerData[1]) return;

    //No scroll-animation is being performed so a new one is created.
    _containerData[1] = window.requestAnimationFrame(_stepY);
    if(!_oldData) uss._containersData.set(container, _containerData);
     
    function _stepY(timestamp) {
      const _finalYPosition = _containerData[3];
      const _direction = _containerData[5];
      const _currentYPosition = _scrollYCalculator();
      const _remaningScrollAmount = (_finalYPosition - _currentYPosition) * _direction;

      if(_remaningScrollAmount < 1) {
        uss.stopScrollingY(container, _containerData[11]);
        return;
      }

      //The originalTimeStamp is null at the beginning of a scroll-animation.
      if(!_containerData[9]) _containerData[9] = timestamp;

      const _scrollID = _containerData[1];
      let _stepLength = _containerData[15] ? _containerData[15](_remaningScrollAmount, _containerData[9], timestamp, _containerData[7], _currentYPosition, _finalYPosition, container) :
                        _containerData[13] ? _containerData[13](_remaningScrollAmount, _containerData[9], timestamp, _containerData[7], _currentYPosition, _finalYPosition, container) :
                                             DEFAULT_YSTEP_LENGTH_CALCULATOR(_remaningScrollAmount, _containerData[9], timestamp, _containerData[7], _currentYPosition, _finalYPosition, container);
      
      //The current scroll-animation has been aborted by the stepLengthCalculator.
      if(_scrollID !== _containerData[1]) return; 

      //The current scroll-animation has been altered by the stepLengthCalculator.
      if(_finalYPosition !== _containerData[3]) {  
        _containerData[1] = window.requestAnimationFrame(_stepY); 
        return;
      } 
      
      //The stepLengthCalculator returned an invalid stepLength.
      if(!Number.isFinite(_stepLength)) {
        uss._warningLogger(_stepLength, "is not a valid step length", true);
        _stepLength = DEFAULT_YSTEP_LENGTH_CALCULATOR(_remaningScrollAmount, _containerData[9], timestamp, _containerData[7], _currentYPosition, _finalYPosition, container);
      }

      if(_remaningScrollAmount <= _stepLength) {
        _scroll(_finalYPosition);
        uss.stopScrollingY(container, _containerData[11]);
        return;
      }

      _scroll(_currentYPosition + _stepLength * _direction);

      //The API tried to scroll but the finalYPosition was beyond the scroll limit of the container.
      if(_stepLength !== 0 && _currentYPosition === _scrollYCalculator()) {
        uss.stopScrollingY(container, _containerData[11]);
        return;
      }

      _containerData[1] = window.requestAnimationFrame(_stepY);
    }
  },
  scrollXBy: (deltaX, container = uss._pageScroller, callback, stillStart = true, containScroll = false, options = {debugString: "scrollXBy"}) => {
    if(!Number.isFinite(deltaX)) {
      uss._errorLogger(options.debugString, "the deltaX to be a number", deltaX);
      return;
    }

    const _currentXPosition = uss.getScrollXCalculator(container, options)();
    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];

      //A scroll-animation on the x-axis is already being performed and can be repurposed.
      if(!!_containerData[0]) {     

        //An actual scroll has been requested.   
        if(deltaX !== 0) { 
          let _finalXPosition = _containerData[2] + deltaX;

          //Limit the final position to the [0, maxScrollX] interval. 
          if(containScroll) {
            const _maxScrollX = uss.getMaxScrollX(container, false, options);
            if(_finalXPosition < 0) _finalXPosition = 0;
            else if(_finalXPosition > _maxScrollX) _finalXPosition = _maxScrollX;
          }

          const _remaningScrollAmount = (_finalXPosition - _currentXPosition) * _containerData[4];
          
          //The scroll-animation has to scroll less than 1px.
          if(_remaningScrollAmount * _remaningScrollAmount < 1) { 
            uss.stopScrollingX(container, callback);
            return;
          }

          //Thanks to the new deltaX, the current scroll-animation 
          //has already surpassed the old finalXPosition.
          if(_remaningScrollAmount < 0) {
            uss.scrollXTo(_finalXPosition, container, callback, containScroll, options);
            return;
          }
          
          const _totalScrollAmount = _containerData[6] * _containerData[4] + deltaX; 
          _containerData[2] = _finalXPosition;                        //finalXPosition
          _containerData[4] = _totalScrollAmount > 0 ? 1 : -1;        //direction
          _containerData[6] = _totalScrollAmount * _containerData[4]; //totalScrollAmount (always positive)
        }
        _containerData[8]  = null;                                    //originalTimestamp
        _containerData[10] = callback;                                //callback
        return;
      }
    }

    uss.scrollXTo(_currentXPosition + deltaX, container, callback, containScroll, options);
  },
  scrollYBy: (deltaY, container = uss._pageScroller, callback, stillStart = true, containScroll = false, options = {debugString: "scrollYBy"}) => {
    if(!Number.isFinite(deltaY)) {
      uss._errorLogger(options.debugString, "the deltaY to be a number", deltaY);
      return;
    }

    const _currentYPosition = uss.getScrollYCalculator(container, options)();
    if(!stillStart) {
      const _containerData = uss._containersData.get(container) || [];

      //A scroll-animation on the y-axis is already being performed and can be repurposed.
      if(!!_containerData[1]) {     
        //An actual scroll has been requested.   
        if(deltaY !== 0) { 
          let _finalYPosition = _containerData[3] + deltaY;

          //Limit the final position to the [0, maxScrollY] interval. 
          if(containScroll) {
            const _maxScrollY = uss.getMaxScrollY(container, false, options);
            if(_finalYPosition < 0) _finalYPosition = 0;
            else if(_finalYPosition > _maxScrollY) _finalYPosition = _maxScrollY;
          }

          const _remaningScrollAmount = (_finalYPosition - _currentYPosition) * _containerData[5];
          
          //The scroll-animation has to scroll less than 1px. 
          if(_remaningScrollAmount * _remaningScrollAmount < 1) { 
            uss.stopScrollingY(container, callback);
            return;
          }

          //Thanks to the new deltaY, the current scroll-animation 
          //has already surpassed the old finalYPosition. 
          if(_remaningScrollAmount < 0) {
            uss.scrollYTo(_finalYPosition, container, callback, containScroll, options);
            return;
          }
          
          const _totalScrollAmount = _containerData[7] * _containerData[5] + deltaY; 
          _containerData[3] = _finalYPosition;                        //finalYPosition
          _containerData[5] = _totalScrollAmount > 0 ? 1 : -1;        //direction
          _containerData[7] = _totalScrollAmount * _containerData[5]; //totalScrollAmount (always positive)
        }
        _containerData[9]  = null;                                    //originalTimestamp
        _containerData[11] = callback;                                //callback
        return;
      }
    }

    uss.scrollYTo(_currentYPosition + deltaY, container, callback, containScroll, options);
  },
  scrollTo: (finalXPosition, finalYPosition, container = uss._pageScroller, callback, containScroll = false, options = {debugString: "scrollTo"}) => {
    if(typeof callback !== "function") {
      uss.scrollXTo(finalXPosition, container, null, containScroll, options);
      uss.scrollYTo(finalYPosition, container, null, containScroll, options);
      return;
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the y-axis has finished too or it has been altered.
    const _scrollXCallback = () => {
      const _containerData = uss._containersData.get(container) || [];
      if(!_initPhase && _containerData[11] !== _scrollYCallback) callback();
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the x-axis has finished too or it has been altered.
    const _scrollYCallback = () => {
      const _containerData = uss._containersData.get(container) || [];
      if(!_initPhase && _containerData[10] !== _scrollXCallback) callback();
    }

    let _initPhase = true;
    uss.scrollXTo(finalXPosition, container, _scrollXCallback, containScroll, options);
    _initPhase = false;
    uss.scrollYTo(finalYPosition, container, _scrollYCallback, containScroll, options);
  },
  scrollBy: (deltaX, deltaY, container = uss._pageScroller, callback, stillStart = true, containScroll = false, options = {debugString: "scrollBy"}) => {
    if(typeof callback !== "function") {
      uss.scrollXBy(deltaX, container, null, stillStart, containScroll, options);
      uss.scrollYBy(deltaY, container, null, stillStart, containScroll, options);
      return;
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the y-axis has finished too or it has been altered.
    const _scrollXCallback = () => {
      const _containerData = uss._containersData.get(container) || [];
      if(!_initPhase && _containerData[11] !== _scrollYCallback) callback();
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the x-axis has finished too or it has been altered.
    const _scrollYCallback = () => {
      const _containerData = uss._containersData.get(container) || [];
      if(!_initPhase && _containerData[10] !== _scrollXCallback) callback();
    }

    let _initPhase = true;
    uss.scrollXBy(deltaX, container, _scrollXCallback, stillStart, containScroll, options);
    _initPhase = false;
    uss.scrollYBy(deltaY, container, _scrollYCallback, stillStart, containScroll, options);
  },
  scrollIntoView: (element, alignToLeft = true, alignToTop = true, callback, includeHiddenParents = false, options = {debugString: "scrollIntoView"}) => {
    let _containerIndex = -1;
    const _containers = uss.getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++, options);
    
    //The element cannot be scrolled into view
    if(_containerIndex < 0) { 
      if(typeof callback === "function") callback();
      return;
    }

    const _alignToNearestLeft = /nearest/i.test(alignToLeft);
    const _alignToNearestTop = /nearest/i.test(alignToTop);

    let _alignToLeft = alignToLeft;
    let _alignToTop  = alignToTop;
    let _currentContainer = _containers[_containerIndex];
    let _currentElement = _containers[_containerIndex - 1] || element;

    const _callback = () => {
      if(_containerIndex < 1) {
          if(typeof callback === "function") callback();
          return;
      } 
      _containerIndex--;
      _currentContainer = _containers[_containerIndex];
      _currentElement   = _containers[_containerIndex - 1] || element;
      _scrollContainer();
    };

    _scrollContainer();

    //Execute all the calculations needed for scrolling an element into view.
    function _scrollContainer() {   
      //_scrollbarsDimensions[0] = _currentContainer's vertical scrollbar's width
      //_scrollbarsDimensions[1] = _currentContainer's horizontal scrollbar's height
      const _scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer, false);

      //_bordersDimensions[0] = _currentContainer's top border size
      //_bordersDimensions[1] = _currentContainer's right border size
      //_bordersDimensions[2] = _currentContainer's bottom border size
      //_bordersDimensions[3] = _currentContainer's left border size
      const _bordersDimensions = uss.calcBordersDimensions(_currentContainer, false);   

      const _containerRect = _currentContainer !== window ? _currentContainer.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
      const _containerWidth  = _containerRect.width;
      const _containerHeight = _containerRect.height;

      const _elementRect = _currentElement.getBoundingClientRect(); //_currentElement can never be the Window
      const _elementWidth  = _elementRect.width;
      const _elementHeight = _elementRect.height;
      const _elementInitialX = _elementRect.left - _containerRect.left; //_currentElement's x-coordinate relative to it's container
      const _elementInitialY = _elementRect.top  - _containerRect.top;  //_currentElement's y-coordinate relative to it's container

      //Align to "nearest" is an indirect way to say: Align to "top" / "bottom" / "center".
      if(_alignToNearestLeft) {
        const _leftDelta   = _elementInitialX > 0 ? _elementInitialX : -_elementInitialX;  //distance from left border    (container<-element  container)
        const _rightDelta  = Math.abs(_containerWidth - _elementInitialX - _elementWidth); //distance from right border   (container  element->container)
        const _centerDelta = Math.abs(0.5 * (_containerWidth - _elementWidth) - _elementInitialX); //distance from center (container->element<-container)
        _alignToLeft = _leftDelta < _centerDelta ? true : _rightDelta < _centerDelta ? false : null;
      }

      if(_alignToNearestTop) {
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
      
      const _deltaX = Math.round(_elementInitialX - _elementFinalX);
      const _deltaY = Math.round(_elementInitialY - _elementFinalY);
      const _scrollContainerX = _deltaX !== 0 && uss.getMaxScrollX(_currentContainer) >= 1;
      const _scrollContainerY = _deltaY !== 0 && uss.getMaxScrollY(_currentContainer) >= 1;

      if(_scrollContainerX && _scrollContainerY) uss.scrollBy(_deltaX, _deltaY, _currentContainer, _callback, true, true, options);
      else if(_scrollContainerX) uss.scrollXBy(_deltaX, _currentContainer, _callback, true, true, options);
      else if(_scrollContainerY) uss.scrollYBy(_deltaY, _currentContainer, _callback, true, true, options);
      else _callback();
    }
  },
  scrollIntoViewIfNeeded: (element, alignToCenter = true, callback, includeHiddenParents = false, options = {debugString: "scrollIntoViewIfNeeded"}) => {
    let _containerIndex = -1;
    const _containers = uss.getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++, options);
    
    //The element cannot be scrolled into view
    if(_containerIndex < 0) { 
      if(typeof callback === "function") callback();
      return;
    }

    let _alignToLeft = null;
    let _alignToTop  = null;
    let _currentContainer = _containers[_containerIndex];
    let _currentElement = _containers[_containerIndex - 1] || element;
    
    const _callback = () => {
      if(_containerIndex < 1) {
          if(typeof callback === "function") callback();
          return;
      } 
      _containerIndex--;
      _currentContainer = _containers[_containerIndex];
      _currentElement   = _containers[_containerIndex - 1] || element;
      _scrollContainer();
    };

    _scrollContainer();

    //Execute all the calculations needed for scrolling an element into view.
    function _scrollContainer() {   
      //_scrollbarsDimensions[0] = _currentContainer's vertical scrollbar's width
      //_scrollbarsDimensions[1] = _currentContainer's horizontal scrollbar's height
      const _scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer, false);

      //_bordersDimensions[0] = _currentContainer's top border size
      //_bordersDimensions[1] = _currentContainer's right border size
      //_bordersDimensions[2] = _currentContainer's bottom border size
      //_bordersDimensions[3] = _currentContainer's left border size
      const _bordersDimensions = uss.calcBordersDimensions(_currentContainer, false);   

      const _containerRect = _currentContainer !== window ? _currentContainer.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
      const _containerWidth  = _containerRect.width;
      const _containerHeight = _containerRect.height;

      const _elementRect = _currentElement.getBoundingClientRect(); //_currentElement can never be the Window
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
          if(typeof callback === "function") callback();
        } else {
          _containerIndex--;
          _currentContainer = _containers[_containerIndex];
          _currentElement   = _containerIndex < 1 ? element : _containers[_containerIndex - 1];
          _scrollContainer();
        }
        return;
      } 
        
      //Possible alignments for the original element: center or nearest.
      //Possible alignments for its containers: nearest.
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
      
      const _deltaX = Math.round(_elementInitialX - _elementFinalX);
      const _deltaY = Math.round(_elementInitialY - _elementFinalY);
      const _scrollContainerX = _deltaX !== 0 && uss.getMaxScrollX(_currentContainer) >= 1;
      const _scrollContainerY = _deltaY !== 0 && uss.getMaxScrollY(_currentContainer) >= 1;

      if(_scrollContainerX && _scrollContainerY) uss.scrollBy(_deltaX, _deltaY, _currentContainer, _callback, true, true, options);
      else if(_scrollContainerX) uss.scrollXBy(_deltaX, _currentContainer, _callback, true, true, options);
      else if(_scrollContainerY) uss.scrollYBy(_deltaY, _currentContainer, _callback, true, true, options);
      else _callback();
    }
  }, 
  stopScrollingX: (container = uss._pageScroller, callback, options = {debugString: "stopScrollingX"}) => {
    const _containerData = uss._containersData.get(container);
    
    if(_containerData) {
      window.cancelAnimationFrame(_containerData[0]); 
      _containerData[0] = null;  //scrollID on x-axis
      _containerData[10] = null; //callback on x-axis  
          
      //No scroll-animation on the y-axis is being performed.
      if(!_containerData[1]) { 
        const _newData = [];
        
        if(_containerData[12]) _newData[12] = _containerData[12]; //Non-temporary stepLengthCalculator on the x-axis
        if(_containerData[13]) _newData[13] = _containerData[13]; //Non-temporary stepLengthCalculator on the y-axis
        if(_containerData[15]) _newData[15] = _containerData[15]; //Temporary stepLengthCalculator on the y-axis

        //Cached values.
        if(Number.isFinite(_containerData[16])) _newData[16] = _containerData[16]; //maxScrollX
        if(Number.isFinite(_containerData[17])) _newData[17] = _containerData[17]; //maxScrollY
        if(Number.isFinite(_containerData[18])) _newData[18] = _containerData[18]; //vertical scrollbar's width
        if(Number.isFinite(_containerData[19])) _newData[19] = _containerData[19]; //horizontal scrollbar's height
        if(Number.isFinite(_containerData[20])) _newData[20] = _containerData[20]; //top border's height
        if(Number.isFinite(_containerData[21])) _newData[21] = _containerData[21]; //right border's width
        if(Number.isFinite(_containerData[22])) _newData[22] = _containerData[22]; //bottom border's height
        if(Number.isFinite(_containerData[23])) _newData[23] = _containerData[23]; //left border's width
        if(_containerData[24] || _containerData[24] === null) _newData[24] = _containerData[24]; //Next not-hidden scrollable parent on the x-axis
        if(_containerData[25] || _containerData[25] === null) _newData[25] = _containerData[25]; //Next hidden scrollable parent on the x-axis
        if(_containerData[26] || _containerData[26] === null) _newData[26] = _containerData[26]; //Next not-hidden scrollable parent on the y-axis
        if(_containerData[27] || _containerData[27] === null) _newData[27] = _containerData[27]; //Next hidden scrollable parent on the y-axis
        if(_containerData[28]) _newData[28] = _containerData[28]; //ScrollXCalculator
        if(_containerData[29]) _newData[29] = _containerData[29]; //ScrollYCalculator
        
        uss._containersData.set(container, _newData);
      } 
    } else {
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, []);
    }

    if(typeof callback === "function") callback();
  },  
  stopScrollingY: (container = uss._pageScroller, callback, options = {debugString: "stopScrollingY"}) => {
    const _containerData = uss._containersData.get(container);
    
    if(_containerData) {
      window.cancelAnimationFrame(_containerData[1]);
      _containerData[1] = null;  //scrollID on y-axis
      _containerData[11] = null; //callback on x-axis
          
      //No scroll-animation on the x-axis is being performed.
      if(!_containerData[0]) { 
        const _newData = [];
        
        if(_containerData[12]) _newData[12] = _containerData[12]; //Non-temporary stepLengthCalculator on the x-axis
        if(_containerData[13]) _newData[13] = _containerData[13]; //Non-temporary stepLengthCalculator on the y-axis
        if(_containerData[14]) _newData[14] = _containerData[14]; //Temporary stepLengthCalculator on the x-axis
        
        //Cached values.
        if(Number.isFinite(_containerData[16])) _newData[16] = _containerData[16]; //maxScrollX
        if(Number.isFinite(_containerData[17])) _newData[17] = _containerData[17]; //maxScrollY
        if(Number.isFinite(_containerData[18])) _newData[18] = _containerData[18]; //vertical scrollbar's width
        if(Number.isFinite(_containerData[19])) _newData[19] = _containerData[19]; //horizontal scrollbar's height
        if(Number.isFinite(_containerData[20])) _newData[20] = _containerData[20]; //top border's height
        if(Number.isFinite(_containerData[21])) _newData[21] = _containerData[21]; //right border's width
        if(Number.isFinite(_containerData[22])) _newData[22] = _containerData[22]; //bottom border's height
        if(Number.isFinite(_containerData[23])) _newData[23] = _containerData[23]; //left border's width
        if(_containerData[24] || _containerData[24] === null) _newData[24] = _containerData[24]; //Next not-hidden scrollable parent on the x-axis
        if(_containerData[25] || _containerData[25] === null) _newData[25] = _containerData[25]; //Next hidden scrollable parent on the x-axis
        if(_containerData[26] || _containerData[26] === null) _newData[26] = _containerData[26]; //Next not-hidden scrollable parent on the y-axis
        if(_containerData[27] || _containerData[27] === null) _newData[27] = _containerData[27]; //Next hidden scrollable parent on the y-axis
        if(_containerData[28]) _newData[28] = _containerData[28]; //ScrollXCalculator
        if(_containerData[29]) _newData[29] = _containerData[29]; //ScrollYCalculator
        
        uss._containersData.set(container, _newData);
      } 
    } else {
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, []);
    }

    if(typeof callback === "function") callback();
  },
  stopScrolling: (container = uss._pageScroller, callback, options = {debugString: "stopScrolling"}) => {
    const _containerData = uss._containersData.get(container);
    
    if(_containerData) {
      window.cancelAnimationFrame(_containerData[0]);
      window.cancelAnimationFrame(_containerData[1]);
      _containerData[0] = null;  //scrollID on x-axis
      _containerData[1] = null;  //scrollID on y-axis
      _containerData[10] = null; //callback on x-axis
      _containerData[11] = null; //callback on y-axis
          
      const _newData = [];
          
      if(_containerData[12]) _newData[12] = _containerData[12]; //Non-temporary stepLengthCalculator on the x-axis
      if(_containerData[13]) _newData[13] = _containerData[13]; //Non-temporary stepLengthCalculator on the y-axis

      //Cached values.  
      if(Number.isFinite(_containerData[16])) _newData[16] = _containerData[16]; //maxScrollX
      if(Number.isFinite(_containerData[17])) _newData[17] = _containerData[17]; //maxScrollY
      if(Number.isFinite(_containerData[18])) _newData[18] = _containerData[18]; //vertical scrollbar's width
      if(Number.isFinite(_containerData[19])) _newData[19] = _containerData[19]; //horizontal scrollbar's height
      if(Number.isFinite(_containerData[20])) _newData[20] = _containerData[20]; //top border's height
      if(Number.isFinite(_containerData[21])) _newData[21] = _containerData[21]; //right border's width
      if(Number.isFinite(_containerData[22])) _newData[22] = _containerData[22]; //bottom border's height
      if(Number.isFinite(_containerData[23])) _newData[23] = _containerData[23]; //left border's width
      if(_containerData[24] || _containerData[24] === null) _newData[24] = _containerData[24]; //Next not-hidden scrollable parent on the x-axis
      if(_containerData[25] || _containerData[25] === null) _newData[25] = _containerData[25]; //Next hidden scrollable parent on the x-axis
      if(_containerData[26] || _containerData[26] === null) _newData[26] = _containerData[26]; //Next not-hidden scrollable parent on the y-axis
      if(_containerData[27] || _containerData[27] === null) _newData[27] = _containerData[27]; //Next hidden scrollable parent on the y-axis
      if(_containerData[28]) _newData[28] = _containerData[28]; //ScrollXCalculator
      if(_containerData[29]) _newData[29] = _containerData[29]; //ScrollYCalculator
      
      uss._containersData.set(container, _newData);
    } else {
      if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, []);
    }

    if(typeof callback === "function") callback();
  },
  stopScrollingAll: (callback) => {
    for(const [_container, _containerData] of uss._containersData.entries()) {
      window.cancelAnimationFrame(_containerData[0]);
      window.cancelAnimationFrame(_containerData[1]);
      _containerData[0] = null;  //scrollID on x-axis
      _containerData[1] = null;  //scrollID on y-axis
      _containerData[10] = null; //callback on x-axis
      _containerData[11] = null; //callback on y-axis

      const _newData = [];

      if(_containerData[12]) _newData[12] = _containerData[12]; //Non-temporary stepLengthCalculator on the x-axis
      if(_containerData[13]) _newData[13] = _containerData[13]; //Non-temporary stepLengthCalculator on the y-axis
      
      //Cached values.
      if(Number.isFinite(_containerData[16])) _newData[16] = _containerData[16]; //maxScrollX
      if(Number.isFinite(_containerData[17])) _newData[17] = _containerData[17]; //maxScrollY
      if(Number.isFinite(_containerData[18])) _newData[18] = _containerData[18]; //vertical scrollbar's width
      if(Number.isFinite(_containerData[19])) _newData[19] = _containerData[19]; //horizontal scrollbar's height
      if(Number.isFinite(_containerData[20])) _newData[20] = _containerData[20]; //top border's height
      if(Number.isFinite(_containerData[21])) _newData[21] = _containerData[21]; //right border's width
      if(Number.isFinite(_containerData[22])) _newData[22] = _containerData[22]; //bottom border's height
      if(Number.isFinite(_containerData[23])) _newData[23] = _containerData[23]; //left border's width
      if(_containerData[24] || _containerData[24] === null) _newData[24] = _containerData[24]; //Next not-hidden scrollable parent on the x-axis
      if(_containerData[25] || _containerData[25] === null) _newData[25] = _containerData[25]; //Next hidden scrollable parent on the x-axis
      if(_containerData[26] || _containerData[26] === null) _newData[26] = _containerData[26]; //Next not-hidden scrollable parent on the y-axis
      if(_containerData[27] || _containerData[27] === null) _newData[27] = _containerData[27]; //Next hidden scrollable parent on the y-axis
      if(_containerData[28]) _newData[28] = _containerData[28]; //ScrollXCalculator
      if(_containerData[29]) _newData[29] = _containerData[29]; //ScrollYCalculator
      
      uss._containersData.set(_container, _newData)
    }

    if(typeof callback === "function") callback();
  },
  hrefSetup: (alignToLeft = true, alignToTop = true, init, callback, includeHiddenParents = false, updateHistory = false, options = {debugString: "hrefSetup"}) => {
    const _init = typeof init === "function" ? init : (anchor, el, event) => event.stopPropagation();
    const _pageURL = window.location.href.split("#")[0]; //location.href = optionalURL#fragment
    const _updateHistory = updateHistory && 
                           !!(window.history && 
                              window.history.pushState && 
                              window.history.scrollRestoration); //Check if histoy manipulation is supported
    
    if(_updateHistory) {
      window.history.scrollRestoration = "manual";       
      window.addEventListener("popstate", _smoothHistoryNavigation, {passive:true}); 
      window.addEventListener("unload", (event) => event.preventDefault(), {passive:false, once:true});

      //Prevents the browser to jump-to-position,
      //when a user navigates through history.
      function _smoothHistoryNavigation(event) {
        const _fragment = window.location.hash.slice(1, -1);
        
        //The URL is just "URL/#" or "URL/" 
        if(!_fragment) {
          if(_init(null, uss._pageScroller, event) !== false) {
              uss.scrollTo(0, 0, uss._pageScroller, callback, false, options);
          }
          return;
        } 

        const _elementToReach = document.getElementById(_fragment) || document.querySelector("a[name='" + _fragment + "']");
        if(_elementToReach && _init(null, _elementToReach, event) !== false) {
          uss.scrollIntoView(_elementToReach, alignToLeft, alignToTop, callback, includeHiddenParents, options);
        }
      }
      //Checks if the page initially have a URL containing 
      //a valid fragment and scrolls to it if necessary.
      if(document.readyState === "complete") _smoothHistoryNavigation(new Event("load"));
      else window.addEventListener("load", _smoothHistoryNavigation, {passive:true, once:true});
    }

    for(const _pageLink of document.links) {
      const _optionalURL = _pageLink.href.split("#")[0]; //_pageLink.href = optionalURL#fragment

      //This pageLink refers to another webpage, 
      //no need to smooth scroll.
      if(_optionalURL !== _pageURL) continue;
      
      const _fragment = _pageLink.hash.substring(1);
      
      //href="#" scrolls the _pageScroller to its top left.
      if(_fragment === "") { 
        _pageLink.addEventListener("click", event => {
          event.preventDefault();
          
          //False means the scroll-animation has been prevented by the user.
          if(_init(_pageLink, uss._pageScroller, event) === false) return; 
          if(_updateHistory && window.history.state !== "") {
            window.history.pushState("", "", "#");
          }

          uss.scrollTo(0, 0, uss._pageScroller, callback, false, options);
        }, {passive:false});
        continue;
      }

      //Look for elements with the corresponding id or "name" attribute.
      const _elementToReach = document.getElementById(_fragment) || document.querySelector("a[name='" + _fragment + "']");
      if(!_elementToReach) {
        uss._warningLogger("#" + _fragment, "is not a valid anchor's destination", true);
        continue;
      }

      //href="#fragment" scrolls the element associated with the fragment into view.
      _pageLink.addEventListener("click", event => {
        event.preventDefault();

        //False means the scroll-animation has been prevented by the user.
        //The extra "." at the end of the fragment is used to prevent Safari from restoring 
        //the scrol position before the popstate event (it won't recognize the fragment). 
        if(_init(_pageLink, _elementToReach, event) === false) return; 
        if(_updateHistory && window.history.state !== _fragment) {
          window.history.pushState(_fragment, "", "#" + _fragment + ".");
        }

        uss.scrollIntoView(_elementToReach, alignToLeft, alignToTop, callback, includeHiddenParents, options);
      }, {passive:false});
    }
  }
}



function onResize() {
  window.removeEventListener("pointerover", onResize, {passive:true});
  window.removeEventListener("pointerdown", onResize, {passive:true});
  window.removeEventListener("touchstart", onResize, {passive:true});
  window.removeEventListener("mousemove", onResize, {passive:true});
  window.removeEventListener("keydown", onResize, {passive:true});
  window.removeEventListener("focus", onResize, {passive:true});
  _resizeHandled = false;
  
  //Update the internal Window sizes.
  uss._windowWidth = window.innerWidth;
  uss._windowHeight = window.innerHeight; 

  //Flush the internal caches.
  for(const containerData of uss._containersData.values()) {
    containerData[16] = undefined;
    containerData[17] = undefined; 
    containerData[18] = undefined; //Perhaps use a mutation observer
    containerData[19] = undefined; //Perhaps use a mutation observer
    containerData[20] = undefined; //Perhaps use a resize observer 
    containerData[21] = undefined; //Perhaps use a resize observer 
    containerData[22] = undefined; //Perhaps use a resize observer 
    containerData[23] = undefined; //Perhaps use a resize observer 
    containerData[24] = undefined; //Perhaps use a resize observer 
    containerData[25] = undefined; //Perhaps use a resize observer 
    containerData[26] = undefined; //Perhaps use a resize observer 
    containerData[27] = undefined; //Perhaps use a resize observer 
    //containerData[28] doesn't need to be reset
    //containerData[29] doesn't need to be reset
  }

  for(const callback of uss._onResizeEndCallbacks) callback();
}

let _resizeHandled = false;  
window.addEventListener("resize", () => {
  if(_resizeHandled) return;
  
  window.addEventListener("pointerover", onResize, {passive:true});
  window.addEventListener("pointerdown", onResize, {passive:true});
  window.addEventListener("touchstart", onResize, {passive:true});
  window.addEventListener("mousemove", onResize, {passive:true});
  window.addEventListener("keydown", onResize, {passive:true});
  window.addEventListener("focus", onResize, {passive:true});
  _resizeHandled = true;
}, {passive:true});

function __ussInit() {
  //Force the calculation of the _windowScroller.
  uss.getWindowScroller(true);

  //Force the calculation of the _pageScroller.
  uss.getPageScroller(true);

  //Force the calculation of the _scrollbarsMaxDimension at the startup.
  uss.getScrollbarsMaxDimension(true);

  //Calculate the average frames' time of the user's screen. 
  //(and the corresponding minAnimationFrame.) //<---------------------------------------------------------------------TO LOOK MORE INTO
  const __totalMeasurementsNumber = 3;
  const __totalFramesInMeasurement = 60; //How many frames are considered in a single measurement 
  let __totalFramesTime = 0;
  let __currentMeasurementsLeft = __totalMeasurementsNumber; 
  let __currentFrameCount = __totalFramesInMeasurement;
  let __originalTimestamp = performance.now();
  window.requestAnimationFrame(function __calcFrameTime(_currentTimestamp) {
    __currentFrameCount--;
    if(__currentFrameCount > 0) {
      window.requestAnimationFrame(__calcFrameTime);
      return;
    }

    __currentMeasurementsLeft--;
    __totalFramesTime += (_currentTimestamp - __originalTimestamp) / __totalFramesInMeasurement;

    //Start a new measurement.
    if(__currentMeasurementsLeft > 0) {
      __currentFrameCount = __totalFramesInMeasurement;
      __originalTimestamp = performance.now();
      window.requestAnimationFrame(__calcFrameTime);
      return;
    }

    //All the measurements have been completed.
    uss._framesTime = Math.min(DEFAULT_FRAME_TIME, __totalFramesTime / __totalMeasurementsNumber); //At least 60fps.
    //uss._minAnimationFrame = 1000 / uss._framesTime; //<---------------------------------------------------------------------TO LOOK MORE INTO
  });
}

if(document.readyState === "complete") __ussInit();
else window.addEventListener("load", __ussInit, {passive:true, once:true});

try { //Chrome, Firefox & Safari >= 14
  window.matchMedia("(prefers-reduced-motion)").addEventListener("change", () => {
    uss._reducedMotion = window.matchMedia("(prefers-reduced-motion)").matches;
    uss.stopScrollingAll();
  }, {passive:true});
} catch(e) { //Safari < 14
  window.matchMedia("(prefers-reduced-motion)").addListener(() => {
    uss._reducedMotion = window.matchMedia("(prefers-reduced-motion)").matches;
    uss.stopScrollingAll();
  }, {passive:true});
}
}