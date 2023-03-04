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
 * DEFAULT_REGEX_LOGGER_DISABLED: regexp, the regular expression used by the default loggers to test if they're disabled.
 * DEFAULT_REGEX_LOGGER_LEGACY: regexp, the regular expression used by the default loggers to test if they should operate in legacy mode.
 * DEFAULT_REGEX_ALIGNMENT_NEAREST: regexp, the regular expression used by scrollIntoView to test if the passed alignments correspond to "nearest".
 * DEFAULT_REGEX_OVERFLOW: regexp, the regular expression used to test if any container has any of the "overflow" properties set to "auto" or "scroll".
 * DEFAULT_REGEX_OVERFLOW_HIDDEN: regexp, the regular expression used to test if any container has any of the "overflow" properties set to "auto", "scroll" or "hidden".
 * DEFAULT_REGEX_OVERFLOW_WITH_VISIBLE: regexp, the regular expression used to test if any container has any of the "overflow" properties set to "auto", "scroll" or "visible".
 * DEFAULT_REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE: regexp, the regular expression used to test if any container has any of the "overflow" properties set to "auto", "scroll", "hidden" or "visible".
 * DEFAULT_XSTEP_LENGTH_CALCULATOR: function, the default StepLengthCalculator for scroll-animations on the x-axis of every container that doesn't have a custom StepLengthCalculator set.
 *                                  Controls how long each animation-step on the x-axis must be (in px) in order to target the "_minAnimationFrame" property value. 
 * DEFAULT_YSTEP_LENGTH_CALCULATOR: function, the default StepLengthCalculator for scroll-animations on the y-axis of every container that doesn't have a custom StepLengthCalculator set.
 *                                  Controls how long each animation-step on the y-axis must be (in px) in order to target the "_minAnimationFrame" property value. 
 * DEFAULT_ERROR_LOGGER: function, the initial value of the "_errorLogger" property: it logs the API error messages inside the browser's console.
 * DEFAULT_WARNING_LOGGER: function, the initial value of the "_warningLogger" property: it logs the API warning messages inside the browser's console.
 */


/*
 * VARIABLES (INTERNAL USE):
 *
 * _containersData: Map(Container, Array), a map in which:
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
 *                     StepLengthCalculator is set for it.
 * _windowWidth: number, the current Window's inner width (in px).
 * _windowHeight: number, the current Window's inner height (in px).
 * _scrollbarsMaxDimension: number, the highest number of pixels any scrollbar on the page can occupy (it's browser dependent).
 * _framesTime: number, the time in milliseconds between two consecutive browser's frame repaints (e.g. at 60fps this is 16.6ms).
 *              It's the average of the uss._framesTimes's values.
 * _framesTimes: array, contains at most the last 10 calculated frames' times.
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
 * getFramesTime: function, returns the value of the "_framesTime" property. 
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
 * calcFramesTimes: function, requests a new frames' time measurement and asynchronously inserts the result into _framesTimes. 
 *                  When the calculation is finished, uss._framesTime will be updated accordingly.
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
const KX_ID = 0;   //Key to get the scroll id on the x-axis
const KY_ID = 1;   //Key to get the scroll id on the y-axis

const KX_FP = 2;   //Key to get the final x position
const KY_FP = 3;   //Key to get the final y position

const KX_SD = 4;   //Key to get the scroll direction on the x-axis 
const KY_SD = 5;   //Key to get the scroll direction on the y-axis

const KX_TS = 6;   //Key to get the total scroll amount on the x-axis
const KY_TS = 7;   //Key to get the total scroll amount on the y-axis

const KX_OT = 8;   //Key to get the initial timestamp of the scroll animation on the x-axis
const KY_OT = 9;   //Key to get the initial timestamp of the scroll animation on the y-axis

const KX_CB = 10;  //Key to get the callback for the scroll animation on the x-axis
const KY_CB = 11;  //Key to get the callback for the scroll animation on the y-axis

const KX_FSC = 12; //Key to get the fixed StepLengthCalculator for the scroll animation on the x-axis
const KY_FSC = 13; //Key to get the fixed StepLengthCalculator for the scroll animation on the y-axis

const KX_TSC = 14; //Key to get the temporary StepLengthCalculator for the scroll animation on the x-axis
const KY_TSC = 15; //Key to get the temporary StepLengthCalculator for the scroll animation on the y-axis

const KX_MS = 16;  //Key to get the maxScrollX value 
const KY_MS = 17;  //Key to get the maxScrollY value 

const KX_SB = 18;  //Key to get the vertical scrollbar's width 
const KY_SB = 19;  //Key to get the horizontal scrollbar's height

const KY_TB = 20;  //Key to get the top border's height
const KX_RB = 21;  //Key to get the right border's width
const KY_BB = 22;  //Key to get the bottom border's height
const KX_LB = 23;  //Key to get the left border's width

const KX_SSP = 24; //Key to get the standard scrollable parent on the x-axis (overflow !== "hidden") 
const KX_HSP = 25; //Key to get the hidden scrollable parent on the x-axis (overflow === "hidden") 
const KY_SSP = 26; //Key to get the standard scrollable parent on the y-axis (overflow !== "hidden") 
const KY_HSP = 27; //Key to get the hidden scrollable parent on the y-axis (overflow === "hidden") 

const KX_SC = 28;  //Key to get the ScrollXCalculator
const KY_SC = 29;  //Key to get the ScrollYCalculator

const NO_VAL = undefined; //No value has been calculated yet
const NO_SP = null;       //No scrollable parent has been found

const INITIAL_WINDOW_WIDTH  = window.innerWidth;
const INITIAL_WINDOW_HEIGHT = window.innerHeight;
const DEFAULT_XSTEP_LENGTH = 16 + 7 / 1508 * (INITIAL_WINDOW_WIDTH - 412);                         //16px at 412px of width  && 23px at 1920px of width 
const DEFAULT_YSTEP_LENGTH = Math.max(1, Math.abs(38 - 20 / 140 * (INITIAL_WINDOW_HEIGHT - 789))); //38px at 789px of height && 22px at 1920px of height
const DEFAULT_MIN_ANIMATION_FRAMES = INITIAL_WINDOW_HEIGHT / DEFAULT_YSTEP_LENGTH;                 //51 frames at 929px of height
const DEFAULT_FRAME_TIME = 16.6; //in ms
const HIGHEST_SAFE_SCROLL_POS = 1073741824; //2^30
//const DEFAULT_FRAME_TIME_CALCULATOR = window.requestIdleCallback || window.requestAnimationFrame; //To look more into

const DEFAULT_REGEX_LOGGER_DISABLED = /disabled/i;
const DEFAULT_REGEX_LOGGER_LEGACY = /legacy/i;
const DEFAULT_REGEX_ALIGNMENT_NEAREST = /nearest/i;
const DEFAULT_REGEX_OVERFLOW = /(auto|scroll)/;
const DEFAULT_REGEX_OVERFLOW_HIDDEN = /(auto|scroll|hidden)/;
const DEFAULT_REGEX_OVERFLOW_WITH_VISIBLE = /(auto|scroll|visible)/;
const DEFAULT_REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE = /(auto|scroll|hidden|visible)/;

const CHECK_INSTANCEOF = (element, classType = Element) => {
  if(element instanceof classType) return true;

  try {
    let _elementClass = Object.getPrototypeOf(element);
    classType = classType.prototype.toString();

    //Traverse the prototype chain up to Object.prototype.
    while(_elementClass) {
      if(_elementClass.toString() === classType) return true;
      _elementClass = Object.getPrototypeOf(_elementClass);
    }
  } catch(e){}
  
  return false;
}

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
  if(DEFAULT_REGEX_LOGGER_DISABLED.test(uss._debugMode)) return;
  
  //Convert to a string and eventually trim the receivedValue.
  const _receivedValueIsString = typeof receivedValue === "string";
  if(!_receivedValueIsString) {
    if(receivedValue === null || receivedValue === undefined) receivedValue = String(receivedValue);
    else if(receivedValue === window) receivedValue = "window";
    else if(Array.isArray(receivedValue)) receivedValue = "[" + receivedValue.toString() + "]"; 
    else if(CHECK_INSTANCEOF(receivedValue) || (receivedValue.tagName && (receivedValue.id || receivedValue.className))) {
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

  if(DEFAULT_REGEX_LOGGER_LEGACY.test(uss._debugMode)) {
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
  if(DEFAULT_REGEX_LOGGER_DISABLED.test(uss._debugMode)) return;

  //Convert to a string and eventually trim the subject.
  const _subjectIsString = typeof subject === "string";
  if(!_subjectIsString) {
    if(subject === null || subject === undefined) subject = String(subject);
    else if(subject === window) subject = "window";
    else if(Array.isArray(subject)) subject = "[" + subject.toString() + "]"; 
    else if(CHECK_INSTANCEOF(subject) || (subject.tagName && (subject.id || subject.className))) {
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

  if(DEFAULT_REGEX_LOGGER_LEGACY.test(uss._debugMode)) {
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
  _scrollbarsMaxDimension: NO_VAL,
  _framesTime: DEFAULT_FRAME_TIME,
  _framesTimes: [],
  _windowScroller: NO_VAL,
  _pageScroller: NO_VAL,
  _reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches,
  _onResizeEndCallbacks: [],
  _debugMode: "",
  _errorLogger: DEFAULT_ERROR_LOGGER,
  _warningLogger: DEFAULT_WARNING_LOGGER,
  isXScrolling: (container = uss._pageScroller, options = {debugString: "isXScrolling"}) => {
    const _containerData = uss._containersData.get(container);

    if(_containerData) return !!_containerData[KX_ID];

    if(container === window || CHECK_INSTANCEOF(container)) {
      uss._containersData.set(container, []);
      return false;
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  }, 
  isYScrolling: (container = uss._pageScroller, options = {debugString: "isYScrolling"}) => {
    const _containerData = uss._containersData.get(container);

    if(_containerData) return !!_containerData[KY_ID];

    if(container === window || CHECK_INSTANCEOF(container)) {
      uss._containersData.set(container, []);
      return false;
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },   
  isScrolling: (container = uss._pageScroller, options = {debugString: "isScrolling"}) => {
    const _containerData = uss._containersData.get(container);

    if(_containerData) return !!(_containerData[KX_ID] || _containerData[KY_ID]);

    if(container === window || CHECK_INSTANCEOF(container)) {
      uss._containersData.set(container, []);
      return false;
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getFinalXPosition: (container = uss._pageScroller, options = {debugString: "getFinalXPosition"}) => {
    //If there's no scroll-animation on the x-axis, the current position is returned instead.
    const _containerData = uss._containersData.get(container) || [];
    return _containerData[KX_FP] === 0 ? 0 : _containerData[KX_FP] || uss.getScrollXCalculator(container, options)();
  },
  getFinalYPosition: (container = uss._pageScroller, options = {debugString: "getFinalYPosition"}) => {
    //If there's no scroll-animation on the y-axis, the current position is returned instead.
    const _containerData = uss._containersData.get(container) || [];
    return _containerData[KY_FP] === 0 ? 0 : _containerData[KY_FP] || uss.getScrollYCalculator(container, options)();
  },
  getScrollXDirection: (container = uss._pageScroller, options = {debugString: "getScrollXDirection"}) => {
    const _containerData = uss._containersData.get(container);
    
    //If there's no scroll-animation, 0 is returned.
    if(_containerData) return _containerData[KX_SD] || 0;
    
    if(container === window || CHECK_INSTANCEOF(container)) {
      uss._containersData.set(container, []);
      return 0; 
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getScrollYDirection: (container = uss._pageScroller, options = {debugString: "getScrollYDirection"}) => {
    const _containerData = uss._containersData.get(container);
    
    //If there's no scroll-animation, 0 is returned.
    if(_containerData) return _containerData[KY_SD] || 0;
    
    if(container === window || CHECK_INSTANCEOF(container)) {
      uss._containersData.set(container, []);
      return 0; 
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getXStepLengthCalculator: (container = uss._pageScroller, getTemporary = false, options = {debugString: "getXStepLengthCalculator"}) => {
    const _containerData = uss._containersData.get(container);
        
    if(_containerData) return getTemporary ? _containerData[KX_TSC] : _containerData[KX_FSC];

    if(container === window || CHECK_INSTANCEOF(container)) {
      uss._containersData.set(container, []);
      return; 
    }
    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);    
  },
  getYStepLengthCalculator: (container = uss._pageScroller, getTemporary = false, options = {debugString: "getYStepLengthCalculator"}) => {    
    const _containerData = uss._containersData.get(container);
        
    if(_containerData) return getTemporary ? _containerData[KY_TSC] : _containerData[KY_FSC];

    if(container === window || CHECK_INSTANCEOF(container)) {
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
     * - creating a <div> with id = "_uss-scrollbox"
     * - giving that <div> a mini-stylesheet that forces it to show the scrollbars 
     */
    if(forceCalculation || !Number.isFinite(uss._scrollbarsMaxDimension)) {
      const _scrollBoxStyle = document.createElement("style");
      const _scrollBox = document.createElement("div");
      _scrollBox.id = "_uss-scrollbox";
      _scrollBoxStyle.appendChild(
        document.createTextNode(
          "#_uss-scrollbox { display:block; width:100px; height:100px; overflow-x:scroll; border:none; padding:0px; scrollbar-height:auto; }" + 
          "#_uss-scrollbox::-webkit-scrollbar { display:block; width:initial; height:initial; }"
        )
      );
      document.head.appendChild(_scrollBoxStyle);
      document.body.appendChild(_scrollBox);
      uss._scrollbarsMaxDimension = _scrollBox.offsetHeight - _scrollBox.clientHeight;
      document.body.removeChild(_scrollBox);
      document.head.removeChild(_scrollBoxStyle);
    }

    return uss._scrollbarsMaxDimension;
  },
  getWindowScroller: (forceCalculation = false) => {
    if(forceCalculation || !uss._windowScroller) {
      const _oldData = uss._containersData.get(window);
      const _containerData = _oldData || [];
            
      const _body = document.body;
      const _html = document.documentElement;

      const _windowInitialX = window.scrollX; 
      const _windowInitialY = window.scrollY; 
      const _elementsToTest = [];
      let _elementsIndex = 0;

      if(
        _html.scrollLeft === _windowInitialX && 
        _html.scrollTop === _windowInitialY
      ) {
        _elementsToTest[_elementsIndex] = _html;
        _elementsIndex++;
      }   
      
      if(
        _body.scrollLeft === _windowInitialX && 
        _body.scrollTop === _windowInitialY
      ) {
        _elementsToTest[_elementsIndex] = _body;
        _elementsIndex++;
      }   
        
      //Neither _html nor _body have the same scrollPosition of Window.
      if(_elementsIndex === 0) {
        uss._windowScroller = window;
        return uss._windowScroller;
      }

      let _maxScrollX = _containerData[KX_MS] || HIGHEST_SAFE_SCROLL_POS; //is never 0
      let _maxScrollY = _containerData[KY_MS] || HIGHEST_SAFE_SCROLL_POS; //is never 0

      if(_windowInitialX !== _maxScrollX || _windowInitialY !== _maxScrollY) {
        //Try to scroll the body/html by scrolling the Window.
        window.scroll(_maxScrollX, _maxScrollY);

        _maxScrollX = window.scrollX;
        _maxScrollY = window.scrollY;
      }
      
      //The Window cannot scroll.
      if(_maxScrollX === 0 && _maxScrollY === 0) {
        uss._windowScroller = window;
        return uss._windowScroller;
      }

      //The Window was already at its maxScrollX/maxScrollY.
      if(_windowInitialX === _maxScrollX && _windowInitialY === _maxScrollY) {
        //Try to scroll the body/html by scrolling the Window.
        window.scroll(0,0);
      }

      let _windowScrollerFound = false;
      for(const element of _elementsToTest) {        
        if(
          element.scrollLeft === window.scrollX && 
          element.scrollTop === window.scrollY
        ) {
          //Cache the maxScrollX/maxScrollY.
          const _elementOldData = uss._containersData.get(element); 
          const _elementData = _elementOldData || [];
          _elementData[KX_MS] = _maxScrollX;
          _elementData[KY_MS] = _maxScrollY;
          
          if(!_elementOldData) uss._containersData.set(element, _elementData);
          
          uss._windowScroller = element;
          _windowScrollerFound = true;
          break;
        }
      }

      /**
       * Scroll the Window back to its initial position.
       * Note that if the Window scrolls any other element, 
       * the latter will be scrolled back into place too.
       * Otherwise it was already in the correct scroll position 
       * because the tests didn't affect it. 
       */
      window.scroll(_windowInitialX, _windowInitialY);

      //Cache the maxScrollX/maxScrollY.
      _containerData[KX_MS] = _maxScrollX;
      _containerData[KY_MS] = _maxScrollY;
      if(!_oldData) uss._containersData.set(window, _containerData);

      //Fallback to the Window.
      if(!_windowScrollerFound) uss._windowScroller = window;
    }

    return uss._windowScroller;
  },
  getPageScroller: (forceCalculation = false) => {
    //Check if the _pageScroller has already been calculated.
    if(forceCalculation || !uss._pageScroller) {
      const _body = document.body;
      const _html = document.documentElement;

      const [_htmlMaxScrollX, _htmlMaxScrollY] = uss.getMaxScrolls(_html, forceCalculation);
      const [_bodyMaxScrollX, _bodyMaxScrollY] = uss.getMaxScrolls(_body, forceCalculation);

      /**
       * The _pageScroller is the element that scrolls the further between _html and _body.
       * If there's a tie or neither of those can scroll, it's defaulted to the Window.
       */
      if(
        (_htmlMaxScrollX >  _bodyMaxScrollX && _htmlMaxScrollY >= _bodyMaxScrollY) ||
        (_htmlMaxScrollX >= _bodyMaxScrollX && _htmlMaxScrollY >  _bodyMaxScrollY)
      ) {
        uss._pageScroller = _html;
      } else if(
        (_bodyMaxScrollX >  _htmlMaxScrollX && _bodyMaxScrollY >= _htmlMaxScrollY) || 
        (_bodyMaxScrollX >= _htmlMaxScrollX && _bodyMaxScrollY >  _htmlMaxScrollY) 
      ) {
        uss._pageScroller = _body;
      } else {
        uss._pageScroller = window;
      }
    }

    return uss._pageScroller;
  },
  getFramesTime: (forceCalculation = false, callback, options = {debugString: "getFramesTime", requestPhase: 0}) => {
    if(forceCalculation) uss.calcFramesTimes(NO_VAL, NO_VAL, callback, options);
    return uss._framesTime;
  },
  getReducedMotionState: () => uss._reducedMotion,
  getOnResizeEndCallbacks: () => uss._onResizeEndCallbacks,
  getDebugMode: () => uss._debugMode, 
  setXStepLengthCalculator: (newCalculator, container = uss._pageScroller, isTemporary = false, options = {debugString: "setXStepLengthCalculator"}) => {
    const _isSettingOp = newCalculator !== undefined;
    if(typeof newCalculator !== "function" && _isSettingOp) {
      uss._errorLogger(options.debugString, "the newCalculator to be a function", newCalculator);
      return;
    }

    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      if(container !== window && !CHECK_INSTANCEOF(container)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    }

    if(isTemporary) {
      _containerData[KX_TSC] = newCalculator;
    } else {
      //Setting a fixed StepLengthCalculator will unset the temporary one.
      _containerData[KX_FSC] = newCalculator;
      if(_isSettingOp) _containerData[KX_TSC] = NO_VAL; 
    }  
  },
  setYStepLengthCalculator: (newCalculator, container = uss._pageScroller, isTemporary = false, options = {debugString: "setYStepLengthCalculator"}) => {
    const _isSettingOp = newCalculator !== undefined;
    if(typeof newCalculator !== "function" && _isSettingOp) {
      uss._errorLogger(options.debugString, "the newCalculator to be a function", newCalculator);
      return;
    }

    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      if(container !== window && !CHECK_INSTANCEOF(container)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    }

    if(isTemporary) {
      _containerData[KY_TSC] = newCalculator;
    } else {
      //Setting a fixed StepLengthCalculator will unset the temporary one.
      _containerData[KY_FSC] = newCalculator;
      if(_isSettingOp) _containerData[KY_TSC] = NO_VAL; 
    }  
  },
  setStepLengthCalculator: (newCalculator, container = uss._pageScroller, isTemporary = false, options = {debugString: "setStepLengthCalculator"}) => {
    const _isSettingOp = newCalculator !== undefined;
    if(typeof newCalculator !== "function" && _isSettingOp) {
      uss._errorLogger(options.debugString, "the newCalculator to be a function", newCalculator);
      return;
    }

    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      if(container !== window && !CHECK_INSTANCEOF(container)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    }

    if(isTemporary) {
      _containerData[KX_TSC] = newCalculator;
      _containerData[KY_TSC] = newCalculator;
    } else {
      //Setting a fixed StepLengthCalculator will unset the temporary one.
      _containerData[KX_FSC] = newCalculator;
      _containerData[KY_FSC] = newCalculator;

      if(_isSettingOp) {
        _containerData[KX_TSC] = NO_VAL;
        _containerData[KY_TSC] = NO_VAL;
      } 
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
      if(newPageScroller !== window && !CHECK_INSTANCEOF(newPageScroller)) {
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
  calcFramesTimes: (previousTimestamp, currentTimestamp, callback, options = {debugString: "calcFramesTimes", requestPhase: 0}) => {
    /**
     * uss._framesTime[-1] contains the status of the previous requested frames' time recalculation.
     * options.requestPhase contains the status of the current requested frames' time recalculation.
     * If they don't match, a frames's time recalculation has already been requested but the previous
     * one hasn't been completed yet.
     */
    if(uss._framesTimes[-1] && uss._framesTimes[-1] !== options.requestPhase) return;
    
    if(!Number.isFinite(previousTimestamp) || previousTimestamp < 0) {
      options.requestPhase = 1;
      uss._framesTimes[-1] = 1;
      window.requestAnimationFrame((timestamp) => uss.calcFramesTimes(timestamp, currentTimestamp, callback, options));
      return;
    }

    if(!Number.isFinite(currentTimestamp) || currentTimestamp < 0) {
      options.requestPhase = 2;
      uss._framesTimes[-1] = 2;
      window.requestAnimationFrame((timestamp) => uss.calcFramesTimes(previousTimestamp, timestamp, callback, options));
      return;
    }

    /**
     * New frame time measurement.
     * Note that elements at negative indexes will not be taken into account by:
     * - for loops
     * - array.length
     * - array.unshift
     */
    uss._framesTimes[-1] = 0;
    uss._framesTimes.unshift(currentTimestamp - previousTimestamp);
    if(uss._framesTimes.length > 10) uss._framesTimes.pop();
    
    let _framesTimesSum = 0;
    for(const framesTime of uss._framesTimes) _framesTimesSum += framesTime;
    
    uss._framesTime = _framesTimesSum / uss._framesTimes.length;
    
    if(typeof callback === "function") callback();
  },
  calcXScrollbarDimension: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "calcXScrollbarDimension"}) => {
    return uss.calcScrollbarsDimensions(container, forceCalculation, options)[0];
  },
  calcYScrollbarDimension: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "calcYScrollbarDimension"}) => {
    return uss.calcScrollbarsDimensions(container, forceCalculation, options)[1];
  },
  calcScrollbarsDimensions: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "calcScrollbarsDimensions"}) => {
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      /**
       * Only instances of HTMLElement and SVGElement have the style property, and they both implement Element.
       * All the other unsupported implementations are filtered out by the checking style property later.
       */
      if(container !== window && !CHECK_INSTANCEOF(container)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    }
    
    if(
      forceCalculation ||
      !Number.isFinite(_containerData[KX_SB]) || 
      !Number.isFinite(_containerData[KY_SB])
    ) {
      const _windowScroller = uss.getWindowScroller();

      if(container === window && window !== _windowScroller) {
        return uss.calcScrollbarsDimensions(_windowScroller, forceCalculation, options);
      } else if(!container.style || uss.getScrollbarsMaxDimension() === 0) {
        //The element cannot have scrollbars or their size is 0px on this webpage.
        _containerData[KX_SB] = 0;
        _containerData[KY_SB] = 0;
     } else {
        const _initialXPosition = container.scrollLeft;
        const _initialYPosition = container.scrollTop;

        if(container === document.body || container === document.documentElement) {
          //The properties of _style are automatically updated whenever the style is changed.
          const _style = window.getComputedStyle(container);

          const _initialWidth  = Number.parseInt(_style.width);
          const _initialHeight = Number.parseInt(_style.height);  
          const _initialOverflowX = container.style.overflowX;
          const _initialOverflowY = container.style.overflowY;

          //The container is forced to hide its scrollbars.
          container.style.overflowX = "hidden";
          container.style.overflowY = "hidden";
        
          _containerData[KX_SB] = Number.parseInt(_style.width)  - _initialWidth;
          _containerData[KY_SB] = Number.parseInt(_style.height) - _initialHeight;
    
          container.style.overflowX = _initialOverflowX;
          container.style.overflowY = _initialOverflowY;
        } else {
          const _initialBorder = container.style.border;

          container.style.border = "none";
        
          _containerData[KX_SB] = container.offsetWidth - container.clientWidth;
          _containerData[KY_SB] = container.offsetHeight - container.clientHeight;
          
          container.style.border = _initialBorder;
        }

        //After modifying the styles of the container, the scroll position may change.
        container.scroll(_initialXPosition, _initialYPosition);

        //If the container is the windowScroller, cache the values for the window too.
        if(container === _windowScroller) {
          const _windowOldData = uss._containersData.get(window);
          const _windowData = _windowOldData || [];

          _windowData[KX_SB] = _containerData[KX_SB];
          _windowData[KY_SB] = _containerData[KY_SB];

          if(!_windowOldData) uss._containersData.set(window, _windowData);
        }
      }
    }
          
    return [
      _containerData[KX_SB], //Vertical scrollbar's width
      _containerData[KY_SB]  //Horizontal scrollbar's height
    ];
  },
  calcBordersDimensions: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "calcBordersDimensions"}) => {
    //Check if the bordersDimensions of the passed container have already been calculated. 
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData) {
      if(container !== window && !CHECK_INSTANCEOF(container)) {
        uss._errorLogger(options.debugString, "the container to be an Element the Window", container);
        return;
      }
      uss._containersData.set(container, _containerData);
    }

    if(
      forceCalculation ||
      !Number.isFinite(_containerData[KY_TB]) || 
      !Number.isFinite(_containerData[KX_RB]) || 
      !Number.isFinite(_containerData[KY_BB]) || 
      !Number.isFinite(_containerData[KX_LB]) 
    ) {
      if(container === window) {
        const _windowScroller = uss.getWindowScroller();
        const _bordersDimensions = _windowScroller === window ? [0,0,0,0] : uss.calcBordersDimensions(_windowScroller, forceCalculation, options);

        _containerData[KY_TB] = _bordersDimensions[0];
        _containerData[KX_RB] = _bordersDimensions[1];
        _containerData[KY_BB] = _bordersDimensions[2];
        _containerData[KX_LB] = _bordersDimensions[3];
      } else {
        try {
          const _style = window.getComputedStyle(container);
          
          _containerData[KY_TB] = Number.parseFloat(_style.borderTopWidth);
          _containerData[KX_RB] = Number.parseFloat(_style.borderRightWidth);
          _containerData[KY_BB] = Number.parseFloat(_style.borderBottomWidth);
          _containerData[KX_LB] = Number.parseFloat(_style.borderLeftWidth);
        } catch(e) { 
          //window.getComputedStyle may not work on the passed container 
          _containerData[KY_TB] = 0;
          _containerData[KX_RB] = 0;
          _containerData[KY_BB] = 0;
          _containerData[KX_LB] = 0;
        }
      }
    }
    
    return [
      _containerData[KY_TB], //top
      _containerData[KX_RB], //right
      _containerData[KY_BB], //bottom
      _containerData[KX_LB], //left
    ];
  },
  getScrollXCalculator: (container = uss._pageScroller, options = {debugString: "getScrollXCalculator"}) => {
    return uss.getScrollCalculators(container, options)[0];
  },
  getScrollYCalculator: (container = uss._pageScroller, options = {debugString: "getScrollYCalculator"}) => {
    return uss.getScrollCalculators(container, options)[1];
  },
  getScrollCalculators: (container = uss._pageScroller, options = {debugString: "getScrollCalculators"}) => {
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_containerData[KX_SC] || !_containerData[KY_SC]) {
      if(container === window) {
        _containerData[KX_SC] = () => window.scrollX; //ScrollXCalculator
        _containerData[KY_SC] = () => window.scrollY; //ScrollYCalculator
      } else if(CHECK_INSTANCEOF(container)) {
        _containerData[KX_SC] = () => container.scrollLeft; //ScrollXCalculator
        _containerData[KY_SC] = () => container.scrollTop;  //ScrollYCalculator
      } else {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);     
        return;                                  
      }

      if(!_oldData) uss._containersData.set(container, _containerData);
    }

    return [_containerData[KX_SC], _containerData[KY_SC]];
  },
  getMaxScrollX: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "getMaxScrollX"}) => {
    return uss.getMaxScrolls(container, forceCalculation, options)[0];
  },
  getMaxScrollY: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "getMaxScrollY"}) => {
    return uss.getMaxScrolls(container, forceCalculation, options)[1];
  },
  getMaxScrolls: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "getMaxScrolls"}) => {
    //Check if the maxScrollX/maxScrollY values for the passed container have already been calculated. 
    const _oldData = uss._containersData.get(container) || [];
    if(
      !forceCalculation && 
      Number.isFinite(_oldData[KX_MS]) && 
      Number.isFinite(_oldData[KY_MS])
    ) {
      return [_oldData[KX_MS], _oldData[KY_MS]];
    }

    const [_scrollXCalculator, _scrollYCalculator] = uss.getScrollCalculators(container, options);
    const _initialXPosition = _scrollXCalculator();
    const _initialYPosition = _scrollYCalculator();
    const _containerData = uss._containersData.get(container);

    container.scroll(HIGHEST_SAFE_SCROLL_POS, HIGHEST_SAFE_SCROLL_POS);

    _containerData[KX_MS] = _scrollXCalculator(); //maxScrollX
    _containerData[KY_MS] = _scrollYCalculator(); //maxScrollY
    
    //Scroll the container back to its initial position.
    container.scroll(_initialXPosition, _initialYPosition);
    
    let _windowScroller = uss.getWindowScroller();
    _windowScroller = (container !== window && _windowScroller === container) ? window :
                      (container === window && _windowScroller !== window)    ? _windowScroller : 
                                                                                NO_VAL;
    //Bidirectionally cache the value for the window/windowScroller too.
    if(_windowScroller) {
      const _windowScrollerOldData = uss._containersData.get(_windowScroller);
      const _windowScrollerData = _windowScrollerOldData || [];

      _windowScrollerData[KX_MS] = _containerData[KX_MS];
      _windowScrollerData[KY_MS] = _containerData[KY_MS];
      
      if(!_windowScrollerOldData) uss._containersData.set(_windowScroller, _windowScrollerData);
    }

    return [_containerData[KX_MS], _containerData[KY_MS]];
  },
  getXScrollableParent: (element, includeHiddenParents = false, options = {debugString: "getXScrollableParent"}) => {
    const _oldData = uss._containersData.get(element);
    const _containerData = _oldData || [];
    const _cachedParent = includeHiddenParents ? _containerData[KX_HSP] : _containerData[KX_SSP];
    
    if(_cachedParent !== NO_VAL) return _cachedParent;
    
    const _body = document.body;
    const _html = document.documentElement;
    let _overflowRegex, _overflowRegexWithVisible;
    let _cacheResult;
    
    if(includeHiddenParents) {
      _cacheResult = (el) => _containerData[KX_HSP] = el;
      _overflowRegex = DEFAULT_REGEX_OVERFLOW_HIDDEN;
      _overflowRegexWithVisible = DEFAULT_REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE;
    } else {
      _cacheResult = (el) => _containerData[KX_SSP] = el;
      _overflowRegex = DEFAULT_REGEX_OVERFLOW;
      _overflowRegexWithVisible = DEFAULT_REGEX_OVERFLOW_WITH_VISIBLE;
    }

    if(element === window) {
      _cacheResult(NO_SP);
      if(!_oldData) uss._containersData.set(element, _containerData);
      return NO_SP;
    }

    if(!_oldData) {
      if(!CHECK_INSTANCEOF(element)) {
        uss._errorLogger(options.debugString, "the element to be an Element or the Window", element);
        return;
      }
      uss._containersData.set(element, _containerData);
    }
    
    const _windowScroller = uss.getWindowScroller();
    let _container = element.parentElement;

    let _elementPosition = element.getBoundingClientRect();
    const _elementInitialX = _elementPosition.left;

    const _isScrollableParent = (overflowRegex) => {
      let _testScrollX;

      if(_container === window) {
        _testScrollX = true;  
      } else {
        //The parent is not scrollable on the x-axis, skip it.
        if(_container.scrollWidth <= _container.clientWidth) {
          return false;
        }
        
        //Check if the overflow conditions are met.
        const _style = window.getComputedStyle(_container);
        _testScrollX = overflowRegex.test(_style.overflowX);  
      }

      //The y-axis should be tested.
      if(_testScrollX) {
        if(_container === _windowScroller) _container = window;

        const _containerInitialX = uss.getScrollXCalculator(_container, options)();
        const _containerInitialY = uss.getScrollYCalculator(_container, options)();
        let _finalXPosition;

        if(_testScrollX) {
          _finalXPosition = _containerInitialX > 0 ? 0: HIGHEST_SAFE_SCROLL_POS;
        } else {
          _finalXPosition = _containerInitialX;
        }

        //Try to scroll the element by scrolling the parent.
        _container.scroll(_finalXPosition, _containerInitialY);

        //Check if the element has moved.
        _elementPosition = element.getBoundingClientRect();
        const _isXScrollable = _elementInitialX !== _elementPosition.left;
        
        //Scroll the container back to its initial position.
        _container.scroll(_containerInitialX, _containerInitialY);

        if(_isXScrollable) {
          _cacheResult(_container);
          return true;
        }
      }

      return false;
    }

    //Test if the any parent of the passed element
    //is scrollable on the x-axis.
    while(_container) {
      const _regexToUse = _container === _body || _container === _html ? _overflowRegexWithVisible : 
                                                                         _overflowRegex;
      if(_isScrollableParent(_regexToUse)) return _container;

      _container = _container.parentElement;
    }
    
    //Test the Window if necessary.
    if(_windowScroller === window) {
      _container = window;
      if(_isScrollableParent()) return _container;
    }

    _cacheResult(NO_SP);
    return NO_SP;
  },
  getYScrollableParent: (element, includeHiddenParents = false, options = {debugString: "getYScrollableParent"}) => {
    const _oldData = uss._containersData.get(element);
    const _containerData = _oldData || [];
    const _cachedParent = includeHiddenParents ? _containerData[KY_HSP] : _containerData[KY_SSP];
    
    if(_cachedParent !== NO_VAL) return _cachedParent;
    
    const _body = document.body;
    const _html = document.documentElement;
    let _overflowRegex, _overflowRegexWithVisible;
    let _cacheResult;
    
    if(includeHiddenParents) {
      _cacheResult = (el) => _containerData[KY_HSP] = el;
      _overflowRegex = DEFAULT_REGEX_OVERFLOW_HIDDEN;
      _overflowRegexWithVisible = DEFAULT_REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE;
    } else {
      _cacheResult = (el) => _containerData[KY_SSP] = el;
      _overflowRegex = DEFAULT_REGEX_OVERFLOW;
      _overflowRegexWithVisible = DEFAULT_REGEX_OVERFLOW_WITH_VISIBLE;
    }

    if(element === window) {
      _cacheResult(NO_SP);
      if(!_oldData) uss._containersData.set(element, _containerData);
      return NO_SP;
    }

    if(!_oldData) {
      if(!CHECK_INSTANCEOF(element)) {
        uss._errorLogger(options.debugString, "the element to be an Element or the Window", element);
        return;
      }
      uss._containersData.set(element, _containerData);
    }
    
    const _windowScroller = uss.getWindowScroller();
    let _container = element.parentElement;

    let _elementPosition = element.getBoundingClientRect();
    const _elementInitialY = _elementPosition.top;

    const _isScrollableParent = (overflowRegex) => {
      let _testScrollY;

      if(_container === window) {
        _testScrollY = true;  
      } else {
        //The parent is not scrollable on the y-axis, skip it.
        if(_container.scrollHeight <= _container.clientHeight) {
          return false;
        }
        
        //Check if the overflow conditions are met.
        const _style = window.getComputedStyle(_container);
        _testScrollY = overflowRegex.test(_style.overflowY);  
      }

      //The y-axis should be tested.
      if(_testScrollY) {
        if(_container === _windowScroller) _container = window;

        const _containerInitialX = uss.getScrollXCalculator(_container, options)();
        const _containerInitialY = uss.getScrollYCalculator(_container, options)();
        let _finalYPosition;

        if(_testScrollY) {
          _finalYPosition = _containerInitialY > 0 ? 0: HIGHEST_SAFE_SCROLL_POS;
        } else {
          _finalYPosition = _containerInitialY;
        }

        //Try to scroll the element by scrolling the parent.
        _container.scroll(_containerInitialX, _finalYPosition);

        //Check if the element has moved.
        _elementPosition = element.getBoundingClientRect();
        const _isYScrollable = _elementInitialY !== _elementPosition.top;
        
        //Scroll the container back to its initial position.
        _container.scroll(_containerInitialX, _containerInitialY);

        if(_isYScrollable) {
          _cacheResult(_container);
          return true;
        }
      }

      return false;
    }

    //Test if the any parent of the passed element
    //is scrollable on the y-axis.
    while(_container) {
      const _regexToUse = _container === _body || _container === _html ? _overflowRegexWithVisible : 
                                                                         _overflowRegex;
      if(_isScrollableParent(_regexToUse)) return _container;

      _container = _container.parentElement;
    }
    
    //Test the Window if necessary.
    if(_windowScroller === window) {
      _container = window;
      if(_isScrollableParent()) return _container;
    }

    _cacheResult(NO_SP);
    return NO_SP;
  },
  getScrollableParent: (element, includeHiddenParents = false, options = {debugString: "getScrollableParent"}) => {
    const _oldData = uss._containersData.get(element);
    const _containerData = _oldData || [];
    let _cachedXParent, _cachedYParent;
    
    if(includeHiddenParents) {
      _cachedXParent = _containerData[KX_HSP];
      _cachedYParent = _containerData[KY_HSP];
    } else {
      _cachedXParent = _containerData[KX_SSP];
      _cachedYParent = _containerData[KY_SSP];
    }

    /**
     * If at least one parent is cached, get the other and return the one
     * that is met first during the parents' exploration.
     */
    const _isXParentCached = _cachedXParent !== NO_VAL;
    const _isYParentCached = _cachedYParent !== NO_VAL;
    if(_isXParentCached || _isYParentCached) {
      if(_isXParentCached && !_isYParentCached) {
        _cachedYParent = uss.getYScrollableParent(element, includeHiddenParents, options);
      } else if(!_isXParentCached && _isYParentCached) {
        _cachedXParent = uss.getXScrollableParent(element, includeHiddenParents, options);
      }

      /**
       * This is a summary table of the output:
       *                              _cachedXParent
       *                         window |  NO_SP | el1 
       *                window | window | window | el1
       * _cachedYParent  NO_SP | window |  NO_SP | el1
       *                  el2  |  el2   |  el2   | el_ that is contained by the other el_
       */
      if(_cachedXParent === NO_SP) return _cachedYParent;
      if(_cachedYParent === NO_SP) return _cachedXParent;
      if(_cachedXParent === window) return _cachedYParent;
      if(_cachedYParent === window) return _cachedXParent;
      return _cachedXParent.contains(_cachedYParent) ? _cachedYParent : _cachedXParent;
    }

    const _body = document.body;
    const _html = document.documentElement;
    let _overflowRegex, _overflowRegexWithVisible;
    let _cacheXResult, _cacheYResult;
    
    if(includeHiddenParents) {
      _cacheXResult = (el) => _containerData[KX_HSP] = el;
      _cacheYResult = (el) => _containerData[KY_HSP] = el;
      _overflowRegex = DEFAULT_REGEX_OVERFLOW_HIDDEN;
      _overflowRegexWithVisible = DEFAULT_REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE;
    } else {
      _cacheXResult = (el) => _containerData[KX_SSP] = el;
      _cacheYResult = (el) => _containerData[KY_SSP] = el;
      _overflowRegex = DEFAULT_REGEX_OVERFLOW;
      _overflowRegexWithVisible = DEFAULT_REGEX_OVERFLOW_WITH_VISIBLE;
    }

    if(element === window) {
      _cacheXResult(NO_SP);
      _cacheYResult(NO_SP);
      if(!_oldData) uss._containersData.set(element, _containerData);
      return NO_SP;
    }

    if(!_oldData) {
      if(!CHECK_INSTANCEOF(element)) {
        uss._errorLogger(options.debugString, "the element to be an Element or the Window", element);
        return;
      }
      uss._containersData.set(element, _containerData);
    }
    
    const _windowScroller = uss.getWindowScroller();
    let _container = element.parentElement;

    let _elementPosition = element.getBoundingClientRect();
    const _elementInitialX = _elementPosition.left;
    const _elementInitialY = _elementPosition.top;

    const _isScrollableParent = (overflowRegex) => {
      let _testScrollX, _testScrollY;

      if(_container === window) {
        _testScrollX = true;
        _testScrollY = true;  
      } else {
        //The parent is not scrollable, skip it.
        if(_container.scrollHeight <= _container.clientHeight && 
           _container.scrollWidth  <= _container.clientWidth
        ) {
          return false;
        }
        
        //Check if the overflow conditions are met.
        const _style = window.getComputedStyle(_container);
        _testScrollX = overflowRegex.test(_style.overflowX);
        _testScrollY = overflowRegex.test(_style.overflowY);  
      }

      //At least one axis should be tested.
      if(_testScrollX || _testScrollY) {
        if(_container === _windowScroller) _container = window;

        const _containerInitialX = uss.getScrollXCalculator(_container, options)();
        const _containerInitialY = uss.getScrollYCalculator(_container, options)();
        let _finalXPosition, _finalYPosition;

        if(_testScrollX) {
          _finalXPosition = _containerInitialX > 0 ? 0 : HIGHEST_SAFE_SCROLL_POS;
        } else {
          _finalXPosition = _containerInitialX;
        }

        if(_testScrollY) {
          _finalYPosition = _containerInitialY > 0 ? 0: HIGHEST_SAFE_SCROLL_POS;
        } else {
          _finalYPosition = _containerInitialY;
        }

        //Try to scroll the element by scrolling the parent.
        _container.scroll(_finalXPosition, _finalYPosition);

        //Check if the element has moved.
        _elementPosition = element.getBoundingClientRect();
        const _isXScrollable = _elementInitialX !== _elementPosition.left;
        const _isYScrollable = _elementInitialY !== _elementPosition.top;
        
        //Scroll the container back to its initial position.
        _container.scroll(_containerInitialX, _containerInitialY);

        if(_isXScrollable && !_isYScrollable) {
          _cacheXResult(_container);
          return true;
        }
  
        if(!_isXScrollable && _isYScrollable) {
          _cacheYResult(_container);
          return true;
        }
        
        if(_isXScrollable && _isYScrollable) {
          _cacheXResult(_container);
          _cacheYResult(_container);
          return true;
        }
      }

      return false;
    }

    //Test if the any parent of the passed element
    //is scrollable on either the x or y axes.
    while(_container) {
      const _regexToUse = _container === _body || _container === _html ? _overflowRegexWithVisible : 
                                                                         _overflowRegex;
      if(_isScrollableParent(_regexToUse)) return _container;

      _container = _container.parentElement;
    }
    
    //Test the Window if necessary.
    if(_windowScroller === window) {
      _container = window;
      if(_isScrollableParent()) return _container;
    }

    _cacheXResult(NO_SP);
    _cacheYResult(NO_SP);
    return NO_SP;
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
    _containerData[KX_FP] = finalXPosition;     //finalXPosition
    _containerData[KX_SD] = _direction;         //direction
    _containerData[KX_TS] = _totalScrollAmount; //totalScrollAmount
    _containerData[KX_OT] = NO_VAL;             //originalTimestamp
    _containerData[KX_CB] = callback;           //callback

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated.
    if(_containerData[KX_ID]) return;

    //No scroll-animation is being performed so a new one is created.
    _containerData[KX_ID] = window.requestAnimationFrame(_stepX);
    if(!_oldData) uss._containersData.set(container, _containerData);

    function _stepX(timestamp) {
      const __finalXPosition = _containerData[KX_FP];
      const __direction = _containerData[KX_SD];
      const __currentXPosition = _scrollXCalculator();
      const __remaningScrollAmount = (__finalXPosition - __currentXPosition) * __direction;
      
      if(__remaningScrollAmount < 1) {
        uss.stopScrollingX(container, _containerData[KX_CB]);
        return;
      }
      
      //There's no originalTimeStamp at the beginning of a scroll-animation.
      if(!_containerData[KX_OT]) _containerData[KX_OT] = timestamp;
      
      const __scrollID = _containerData[KX_ID];  
      let __stepLength = _containerData[KX_TSC] ? _containerData[KX_TSC](__remaningScrollAmount, _containerData[KX_OT], timestamp, _containerData[KX_TS], __currentXPosition, __finalXPosition, container) :
                         _containerData[KX_FSC] ? _containerData[KX_FSC](__remaningScrollAmount, _containerData[KX_OT], timestamp, _containerData[KX_TS], __currentXPosition, __finalXPosition, container) :
                                                  DEFAULT_XSTEP_LENGTH_CALCULATOR(__remaningScrollAmount, _containerData[KX_OT], timestamp, _containerData[KX_TS], __currentXPosition, __finalXPosition, container);
      
      //The current scroll-animation has been aborted by the StepLengthCalculator.
      if(__scrollID !== _containerData[KX_ID]) return; 

      //The current scroll-animation has been altered by the StepLengthCalculator.
      if(__finalXPosition !== _containerData[KX_FP]) {  
        _containerData[KX_ID] = window.requestAnimationFrame(_stepX); 
        return;
      } 

      //The StepLengthCalculator returned an invalid stepLength.
      if(!Number.isFinite(__stepLength)) {
        uss._warningLogger(__stepLength, "is not a valid step length", true);
        __stepLength = DEFAULT_XSTEP_LENGTH_CALCULATOR(__remaningScrollAmount, _containerData[KX_OT], timestamp, _containerData[KX_TS], __currentXPosition, __finalXPosition, container);
      }

      if(__remaningScrollAmount <= __stepLength) {
        _scroll(__finalXPosition);
        uss.stopScrollingX(container, _containerData[KX_CB]);
        return;
      }

      _scroll(__currentXPosition + __stepLength * __direction);

      //The API tried to scroll but the finalXPosition was beyond the scroll limit of the container.
      if(__stepLength !== 0 && __currentXPosition === _scrollXCalculator()) {
        uss.stopScrollingX(container, _containerData[KX_CB]);
        return;
      }

      _containerData[KX_ID] = window.requestAnimationFrame(_stepX);
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
    _containerData[KY_FP] = finalYPosition;     //finalYPosition
    _containerData[KY_SD] = _direction;         //direction
    _containerData[KY_TS] = _totalScrollAmount; //totalScrollAmount
    _containerData[KY_OT] = NO_VAL;             //originalTimestamp
    _containerData[KY_CB] = callback;           //callback

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated.
    if(_containerData[KY_ID]) return;

    //No scroll-animation is being performed so a new one is created.
    _containerData[KY_ID] = window.requestAnimationFrame(_stepY);
    if(!_oldData) uss._containersData.set(container, _containerData);
     
    function _stepY(timestamp) {
      const __finalYPosition = _containerData[KY_FP];
      const __direction = _containerData[KY_SD];
      const __currentYPosition = _scrollYCalculator();
      const __remaningScrollAmount = (__finalYPosition - __currentYPosition) * __direction;

      if(__remaningScrollAmount < 1) {
        uss.stopScrollingY(container, _containerData[KY_CB]);
        return;
      }

      //There's no originalTimeStamp at the beginning of a scroll-animation.
      if(!_containerData[KY_OT]) _containerData[KY_OT] = timestamp;

      const __scrollID = _containerData[KY_ID];
      let __stepLength = _containerData[KY_TSC] ? _containerData[KY_TSC](__remaningScrollAmount, _containerData[KY_OT], timestamp, _containerData[KY_TS], __currentYPosition, __finalYPosition, container) :
                         _containerData[KY_FSC] ? _containerData[KY_FSC](__remaningScrollAmount, _containerData[KY_OT], timestamp, _containerData[KY_TS], __currentYPosition, __finalYPosition, container) :
                                                  DEFAULT_YSTEP_LENGTH_CALCULATOR(__remaningScrollAmount, _containerData[KY_OT], timestamp, _containerData[KY_TS], __currentYPosition, __finalYPosition, container);
      
      //The current scroll-animation has been aborted by the StepLengthCalculator.
      if(__scrollID !== _containerData[KY_ID]) return; 

      //The current scroll-animation has been altered by the StepLengthCalculator.
      if(__finalYPosition !== _containerData[KY_FP]) {  
        _containerData[KY_ID] = window.requestAnimationFrame(_stepY); 
        return;
      } 
      
      //The StepLengthCalculator returned an invalid stepLength.
      if(!Number.isFinite(__stepLength)) {
        uss._warningLogger(__stepLength, "is not a valid step length", true);
        __stepLength = DEFAULT_YSTEP_LENGTH_CALCULATOR(__remaningScrollAmount, _containerData[KY_OT], timestamp, _containerData[KY_TS], __currentYPosition, __finalYPosition, container);
      }

      if(__remaningScrollAmount <= __stepLength) {
        _scroll(__finalYPosition);
        uss.stopScrollingY(container, _containerData[KY_CB]);
        return;
      }

      _scroll(__currentYPosition + __stepLength * __direction);

      //The API tried to scroll but the finalYPosition was beyond the scroll limit of the container.
      if(__stepLength !== 0 && __currentYPosition === _scrollYCalculator()) {
        uss.stopScrollingY(container, _containerData[KY_CB]);
        return;
      }

      _containerData[KY_ID] = window.requestAnimationFrame(_stepY);
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
      if(_containerData[KX_ID]) {  

        //An actual scroll has been requested.   
        if(deltaX !== 0) { 
          let _finalXPosition = _containerData[KX_FP] + deltaX;

          //Limit the final position to the [0, maxScrollX] interval. 
          if(containScroll) {
            const _maxScrollX = uss.getMaxScrollX(container, false, options);
            if(_finalXPosition < 0) _finalXPosition = 0;
            else if(_finalXPosition > _maxScrollX) _finalXPosition = _maxScrollX;
          }

          const _remaningScrollAmount = (_finalXPosition - _currentXPosition) * _containerData[KX_SD];
          
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
          
          const _totalScrollAmount = _containerData[KX_TS] * _containerData[KX_SD] + deltaX; 
          _containerData[KX_FP] = _finalXPosition;                            //finalXPosition
          _containerData[KX_SD] = _totalScrollAmount > 0 ? 1 : -1;            //direction
          _containerData[KX_TS] = _totalScrollAmount * _containerData[KX_SD]; //totalScrollAmount (always positive)
        }
        _containerData[KX_OT] = NO_VAL;   //originalTimestamp
        _containerData[KX_CB] = callback; //callback
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
      if(_containerData[KY_ID]) {     
        //An actual scroll has been requested.   
        if(deltaY !== 0) { 
          let _finalYPosition = _containerData[KY_FP] + deltaY;

          //Limit the final position to the [0, maxScrollY] interval. 
          if(containScroll) {
            const _maxScrollY = uss.getMaxScrollY(container, false, options);
            if(_finalYPosition < 0) _finalYPosition = 0;
            else if(_finalYPosition > _maxScrollY) _finalYPosition = _maxScrollY;
          }

          const _remaningScrollAmount = (_finalYPosition - _currentYPosition) * _containerData[KY_SD];
          
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
          
          const _totalScrollAmount = _containerData[KY_TS] * _containerData[KY_SD] + deltaY; 
          _containerData[KY_FP] = _finalYPosition;                            //finalYPosition
          _containerData[KY_SD] = _totalScrollAmount > 0 ? 1 : -1;            //direction
          _containerData[KY_TS] = _totalScrollAmount * _containerData[KY_SD]; //totalScrollAmount (always positive)
        }
        _containerData[KY_OT] = NO_VAL;   //originalTimestamp
        _containerData[KY_CB] = callback; //callback
        return;
      }
    }

    uss.scrollYTo(_currentYPosition + deltaY, container, callback, containScroll, options);
  },
  scrollTo: (finalXPosition, finalYPosition, container = uss._pageScroller, callback, containScroll = false, options = {debugString: "scrollTo"}) => {
    if(typeof callback !== "function") {
      uss.scrollXTo(finalXPosition, container, NO_VAL, containScroll, options);
      uss.scrollYTo(finalYPosition, container, NO_VAL, containScroll, options);
      return;
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the y-axis has finished too or it has been altered.
    const _scrollXCallback = () => {
      const __containerData = uss._containersData.get(container) || [];
      if(!_initPhase && __containerData[KY_CB] !== _scrollYCallback) callback();
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the x-axis has finished too or it has been altered.
    const _scrollYCallback = () => {
      const __containerData = uss._containersData.get(container) || [];
      if(!_initPhase && __containerData[KX_CB] !== _scrollXCallback) callback();
    }

    let _initPhase = true;
    uss.scrollXTo(finalXPosition, container, _scrollXCallback, containScroll, options);
    _initPhase = false;
    uss.scrollYTo(finalYPosition, container, _scrollYCallback, containScroll, options);
  },
  scrollBy: (deltaX, deltaY, container = uss._pageScroller, callback, stillStart = true, containScroll = false, options = {debugString: "scrollBy"}) => {
    if(typeof callback !== "function") {
      uss.scrollXBy(deltaX, container, NO_VAL, stillStart, containScroll, options);
      uss.scrollYBy(deltaY, container, NO_VAL, stillStart, containScroll, options);
      return;
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the y-axis has finished too or it has been altered.
    const _scrollXCallback = () => {
      const __containerData = uss._containersData.get(container) || [];
      if(!_initPhase && __containerData[KY_CB] !== _scrollYCallback) callback();
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the x-axis has finished too or it has been altered.
    const _scrollYCallback = () => {
      const __containerData = uss._containersData.get(container) || [];
      if(!_initPhase && __containerData[KX_CB] !== _scrollXCallback) callback();
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

    const _alignToNearestLeft = DEFAULT_REGEX_ALIGNMENT_NEAREST.test(alignToLeft);
    const _alignToNearestTop  = DEFAULT_REGEX_ALIGNMENT_NEAREST.test(alignToTop);

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
      //__scrollbarsDimensions[0] = _currentContainer's vertical scrollbar's width
      //__scrollbarsDimensions[1] = _currentContainer's horizontal scrollbar's height
      const __scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer, false, options);

      //__bordersDimensions[0] = _currentContainer's top border size
      //__bordersDimensions[1] = _currentContainer's right border size
      //__bordersDimensions[2] = _currentContainer's bottom border size
      //__bordersDimensions[3] = _currentContainer's left border size
      const __bordersDimensions = uss.calcBordersDimensions(_currentContainer, false, options);   

      const __containerRect = _currentContainer !== window ? _currentContainer.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
      const __containerWidth  = __containerRect.width;
      const __containerHeight = __containerRect.height;

      const __elementRect = _currentElement.getBoundingClientRect(); //_currentElement can never be the Window
      const __elementWidth  = __elementRect.width;
      const __elementHeight = __elementRect.height;
      const __elementInitialX = __elementRect.left - __containerRect.left; //_currentElement's x-coordinate relative to it's container
      const __elementInitialY = __elementRect.top  - __containerRect.top;  //_currentElement's y-coordinate relative to it's container

      //Align to "nearest" is an indirect way to say: Align to "top" / "bottom" / "center".
      if(_alignToNearestLeft) {
        const __leftDelta   = __elementInitialX > 0 ? __elementInitialX : -__elementInitialX;  //distance from left border    (container<-element  container)
        const __rightDelta  = Math.abs(__containerWidth - __elementWidth - __elementInitialX); //distance from right border   (container  element->container)
        const __centerDelta = Math.abs((__containerWidth - __elementWidth) * 0.5 - __elementInitialX); //distance from center (container->element<-container)
        _alignToLeft = __leftDelta < __centerDelta ? true : __rightDelta < __centerDelta ? false : NO_VAL;
      }

      if(_alignToNearestTop) {
        const __topDelta    = __elementInitialY > 0 ? __elementInitialY : -__elementInitialY;    //distance from top border     (container↑↑element  container)
        const __bottomDelta = Math.abs(__containerHeight - __elementHeight - __elementInitialY); //distance from bottom border  (container  element↓↓container)
        const __centerDelta = Math.abs((__containerHeight - __elementHeight) * 0.5 - __elementInitialY); //distance from center (container↓↓element↑↑container)
        _alignToTop = __topDelta < __centerDelta ? true : __bottomDelta < __centerDelta ? false : NO_VAL;
      }
    
      const __elementFinalX = _alignToLeft === true  ? __bordersDimensions[3] : 
                              _alignToLeft === false ? __containerWidth  - __elementWidth  - __scrollbarsDimensions[0] - __bordersDimensions[1] : 
                                                      (__containerWidth  - __elementWidth  - __scrollbarsDimensions[0] - __bordersDimensions[1] + __bordersDimensions[3]) * 0.5;
      const __elementFinalY = _alignToTop  === true  ? __bordersDimensions[0] : 
                              _alignToTop  === false ? __containerHeight - __elementHeight - __scrollbarsDimensions[1] - __bordersDimensions[2] : 
                                                      (__containerHeight - __elementHeight - __scrollbarsDimensions[1] - __bordersDimensions[2] + __bordersDimensions[0]) * 0.5;
      
      const __deltaX = Math.round(__elementInitialX - __elementFinalX);
      const __deltaY = Math.round(__elementInitialY - __elementFinalY);
      const __scrollContainerX = __deltaX !== 0 && uss.getMaxScrollX(_currentContainer, false, options) >= 1;
      const __scrollContainerY = __deltaY !== 0 && uss.getMaxScrollY(_currentContainer, false, options) >= 1;

      if(__scrollContainerX && __scrollContainerY) uss.scrollBy(__deltaX, __deltaY, _currentContainer, _callback, true, true, options);
      else if(__scrollContainerX) uss.scrollXBy(__deltaX, _currentContainer, _callback, true, true, options);
      else if(__scrollContainerY) uss.scrollYBy(__deltaY, _currentContainer, _callback, true, true, options);
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

    const _alignElementToCenter = alignToCenter === true;

    let _alignToLeft = NO_VAL;
    let _alignToTop  = NO_VAL;
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
      //__scrollbarsDimensions[0] = _currentContainer's vertical scrollbar's width
      //__scrollbarsDimensions[1] = _currentContainer's horizontal scrollbar's height
      const __scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer, false, options);

      //__bordersDimensions[0] = _currentContainer's top border size
      //__bordersDimensions[1] = _currentContainer's right border size
      //__bordersDimensions[2] = _currentContainer's bottom border size
      //__bordersDimensions[3] = _currentContainer's left border size
      const __bordersDimensions = uss.calcBordersDimensions(_currentContainer, false, options);

      const __containerRect = _currentContainer !== window ? _currentContainer.getBoundingClientRect() : {left: 0, top: 0, width: uss._windowWidth, height: uss._windowHeight};
      const __containerWidth  = __containerRect.width;
      const __containerHeight = __containerRect.height;

      const __elementRect = _currentElement.getBoundingClientRect(); //_currentElement can never be the Window
      const __elementWidth  = __elementRect.width;
      const __elementHeight = __elementRect.height;
      const __elementInitialX = __elementRect.left - __containerRect.left; //_currentElement's x-coordinate relative to it's container
      const __elementInitialY = __elementRect.top  - __containerRect.top;  //_currentElement's y-coordinate relative to it's container
      
      const __isOriginalElement = _currentElement === element;
      const __elementIntoViewX = __elementInitialX > -1 && __elementInitialX + __elementWidth  - __containerWidth  + __scrollbarsDimensions[0] < 1;  //Checks if the element is already visible inside its container on the x-axis
      const __elementIntoViewY = __elementInitialY > -1 && __elementInitialY + __elementHeight - __containerHeight + __scrollbarsDimensions[1] < 1;  //Checks if the element is already visible inside its container on the y-axis    
      const __elementOverflowX = __elementInitialX <= 0 && __elementInitialX + __elementWidth  - __containerWidth  + __scrollbarsDimensions[0] >= 0; //Checks if the element's width is bigger than its container's width
      const __elementOverflowY = __elementInitialY <= 0 && __elementInitialY + __elementHeight - __containerHeight + __scrollbarsDimensions[1] >= 0; //Checks if the element's height is bigger than its container's height
      
      const __scrollNotNeededX = (__isOriginalElement && !_alignElementToCenter && (__elementIntoViewX || __elementOverflowX)) || 
                                 (!__isOriginalElement && __elementIntoViewX);
                                
      const __scrollNotNeededY = (__isOriginalElement && !_alignElementToCenter && (__elementIntoViewY || __elementOverflowY)) || 
                                 (!__isOriginalElement && __elementIntoViewY);

      if(__scrollNotNeededX && __scrollNotNeededY) { 
        if(__isOriginalElement) {
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
      if(__isOriginalElement && _alignElementToCenter) { 
          _alignToLeft = NO_VAL;
          _alignToTop = NO_VAL;
      } else {
        if(!__scrollNotNeededX) { //Scroll needed on x-axis
          const __leftDelta   = __elementInitialX > 0 ? __elementInitialX : -__elementInitialX;  //distance from left border    (container<-element  container)
          const __rightDelta  = Math.abs(__containerWidth - __elementWidth - __elementInitialX); //distance from right border   (container  element->container)
          const __centerDelta = Math.abs((__containerWidth - __elementWidth) * 0.5 - __elementInitialX); //distance from center (container->element<-container)
          _alignToLeft = __leftDelta < __centerDelta ? true : __rightDelta < __centerDelta ? false : NO_VAL;
        }

        if(!__scrollNotNeededY) { //Scroll needed on y-axis
          const __topDelta    = __elementInitialY > 0 ? __elementInitialY : -__elementInitialY;    //distance from top border     (container↑↑element  container)
          const __bottomDelta = Math.abs(__containerHeight - __elementHeight - __elementInitialY); //distance from bottom border  (container  element↓↓container)
          const __centerDelta = Math.abs((__containerHeight - __elementHeight) * 0.5 - __elementInitialY); //distance from center (container↓↓element↑↑container)
          _alignToTop = __topDelta < __centerDelta ? true : __bottomDelta < __centerDelta ? false : NO_VAL;
        }
      } 

      const __elementFinalX = __scrollNotNeededX ? __elementInitialX : 
                              _alignToLeft === true  ? __bordersDimensions[3] : 
                              _alignToLeft === false ? __containerWidth  - __elementWidth  - __scrollbarsDimensions[0] - __bordersDimensions[1] : 
                                                      (__containerWidth  - __elementWidth  - __scrollbarsDimensions[0] - __bordersDimensions[1] + __bordersDimensions[3]) * 0.5;
      const __elementFinalY = __scrollNotNeededY ? __elementInitialY : 
                              _alignToTop  === true  ? __bordersDimensions[0] :
                              _alignToTop  === false ? __containerHeight - __elementHeight - __scrollbarsDimensions[1] - __bordersDimensions[2] : 
                                                      (__containerHeight - __elementHeight - __scrollbarsDimensions[1] - __bordersDimensions[2] + __bordersDimensions[0]) * 0.5;
      
      const __deltaX = Math.round(__elementInitialX - __elementFinalX);
      const __deltaY = Math.round(__elementInitialY - __elementFinalY);
      const __scrollContainerX = __deltaX !== 0 && uss.getMaxScrollX(_currentContainer, false, options) >= 1;
      const __scrollContainerY = __deltaY !== 0 && uss.getMaxScrollY(_currentContainer, false, options) >= 1;

      if(__scrollContainerX && __scrollContainerY) uss.scrollBy(__deltaX, __deltaY, _currentContainer, _callback, true, true, options);
      else if(__scrollContainerX) uss.scrollXBy(__deltaX, _currentContainer, _callback, true, true, options);
      else if(__scrollContainerY) uss.scrollYBy(__deltaY, _currentContainer, _callback, true, true, options);
      else _callback();
    }
  }, 
  stopScrollingX: (container = uss._pageScroller, callback, options = {debugString: "stopScrollingX"}) => {
    const _containerData = uss._containersData.get(container);
    
    if(_containerData) {
      window.cancelAnimationFrame(_containerData[KX_ID]); 
      _containerData[KX_ID] = NO_VAL;  //scrollID on x-axis
      _containerData[KX_CB] = NO_VAL;  //callback on x-axis  
      _containerData[KX_TSC] = NO_VAL; //temporary StepLengthCalculator on the x-axis
          
      //No scroll-animation on the y-axis is being performed.
      if(!_containerData[KY_ID]) { 
        const _newData = [];
        
        if(_containerData[KX_FSC]) _newData[KX_FSC] = _containerData[KX_FSC]; //fixed StepLengthCalculator on the x-axis
        if(_containerData[KY_FSC]) _newData[KY_FSC] = _containerData[KY_FSC]; //fixed StepLengthCalculator on the y-axis
        if(_containerData[KY_TSC]) _newData[KY_TSC] = _containerData[KY_TSC]; //temporary StepLengthCalculator on the y-axis

        //Cached values.
        if(Number.isFinite(_containerData[KX_MS])) _newData[KX_MS] = _containerData[KX_MS]; //maxScrollX
        if(Number.isFinite(_containerData[KY_MS])) _newData[KY_MS] = _containerData[KY_MS]; //maxScrollY
        if(Number.isFinite(_containerData[KX_SB])) _newData[KX_SB] = _containerData[KX_SB]; //vertical scrollbar's width
        if(Number.isFinite(_containerData[KY_SB])) _newData[KY_SB] = _containerData[KY_SB]; //horizontal scrollbar's height
        if(Number.isFinite(_containerData[KY_TB])) _newData[KY_TB] = _containerData[KY_TB]; //top border's height
        if(Number.isFinite(_containerData[KX_RB])) _newData[KX_RB] = _containerData[KX_RB]; //right border's width
        if(Number.isFinite(_containerData[KY_BB])) _newData[KY_BB] = _containerData[KY_BB]; //bottom border's height
        if(Number.isFinite(_containerData[KX_LB])) _newData[KX_LB] = _containerData[KX_LB]; //left border's width
        if(_containerData[KX_SSP] || _containerData[KX_SSP] === NO_SP) _newData[KX_SSP] = _containerData[KX_SSP]; //next standard scrollable parent on the x-axis
        if(_containerData[KX_HSP] || _containerData[KX_HSP] === NO_SP) _newData[KX_HSP] = _containerData[KX_HSP]; //next hidden scrollable parent on the x-axis
        if(_containerData[KY_SSP] || _containerData[KY_SSP] === NO_SP) _newData[KY_SSP] = _containerData[KY_SSP]; //next standard scrollable parent on the y-axis
        if(_containerData[KY_HSP] || _containerData[KY_HSP] === NO_SP) _newData[KY_HSP] = _containerData[KY_HSP]; //next hidden scrollable parent on the y-axis
        if(_containerData[KX_SC]) _newData[KX_SC] = _containerData[KX_SC]; //scrollXCalculator
        if(_containerData[KY_SC]) _newData[KY_SC] = _containerData[KY_SC]; //scrollYCalculator
        
        uss._containersData.set(container, _newData);
      } 
    } else {
      if(container !== window && !CHECK_INSTANCEOF(container)) {
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
      window.cancelAnimationFrame(_containerData[KY_ID]);
      _containerData[KY_ID] = NO_VAL;  //scrollID on y-axis
      _containerData[KY_CB] = NO_VAL;  //callback on y-axis
      _containerData[KY_TSC] = NO_VAL; //temporary StepLengthCalculator on the y-axis
          
      //No scroll-animation on the x-axis is being performed.
      if(!_containerData[KX_ID]) { 
        const _newData = [];
        
        if(_containerData[KX_FSC]) _newData[KX_FSC] = _containerData[KX_FSC]; //fixed StepLengthCalculator on the x-axis
        if(_containerData[KY_FSC]) _newData[KY_FSC] = _containerData[KY_FSC]; //fixed StepLengthCalculator on the y-axis
        if(_containerData[KX_TSC]) _newData[KX_TSC] = _containerData[KX_TSC]; //temporary StepLengthCalculator on the x-axis
        
        //Cached values.
        if(Number.isFinite(_containerData[KX_MS])) _newData[KX_MS] = _containerData[KX_MS]; //maxScrollX
        if(Number.isFinite(_containerData[KY_MS])) _newData[KY_MS] = _containerData[KY_MS]; //maxScrollY
        if(Number.isFinite(_containerData[KX_SB])) _newData[KX_SB] = _containerData[KX_SB]; //vertical scrollbar's width
        if(Number.isFinite(_containerData[KY_SB])) _newData[KY_SB] = _containerData[KY_SB]; //horizontal scrollbar's height
        if(Number.isFinite(_containerData[KY_TB])) _newData[KY_TB] = _containerData[KY_TB]; //top border's height
        if(Number.isFinite(_containerData[KX_RB])) _newData[KX_RB] = _containerData[KX_RB]; //right border's width
        if(Number.isFinite(_containerData[KY_BB])) _newData[KY_BB] = _containerData[KY_BB]; //bottom border's height
        if(Number.isFinite(_containerData[KX_LB])) _newData[KX_LB] = _containerData[KX_LB]; //left border's width
        if(_containerData[KX_SSP] || _containerData[KX_SSP] === NO_SP) _newData[KX_SSP] = _containerData[KX_SSP]; //next standard scrollable parent on the x-axis
        if(_containerData[KX_HSP] || _containerData[KX_HSP] === NO_SP) _newData[KX_HSP] = _containerData[KX_HSP]; //next hidden scrollable parent on the x-axis
        if(_containerData[KY_SSP] || _containerData[KY_SSP] === NO_SP) _newData[KY_SSP] = _containerData[KY_SSP]; //next standard scrollable parent on the y-axis
        if(_containerData[KY_HSP] || _containerData[KY_HSP] === NO_SP) _newData[KY_HSP] = _containerData[KY_HSP]; //next hidden scrollable parent on the y-axis
        if(_containerData[KX_SC]) _newData[KX_SC] = _containerData[KX_SC]; //scrollXCalculator
        if(_containerData[KY_SC]) _newData[KY_SC] = _containerData[KY_SC]; //scrollYCalculator
        
        uss._containersData.set(container, _newData);
      } 
    } else {
      if(container !== window && !CHECK_INSTANCEOF(container)) {
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
      window.cancelAnimationFrame(_containerData[KX_ID]);
      window.cancelAnimationFrame(_containerData[KY_ID]);
      _containerData[KX_ID] = NO_VAL; //scrollID on x-axis
      _containerData[KY_ID] = NO_VAL; //scrollID on y-axis
      _containerData[KX_CB] = NO_VAL; //callback on x-axis
      _containerData[KY_CB] = NO_VAL; //callback on y-axis
          
      const _newData = [];
          
      if(_containerData[KX_FSC]) _newData[KX_FSC] = _containerData[KX_FSC]; //fixed StepLengthCalculator on the x-axis
      if(_containerData[KY_FSC]) _newData[KY_FSC] = _containerData[KY_FSC]; //fixed StepLengthCalculator on the y-axis

      //Cached values.  
      if(Number.isFinite(_containerData[KX_MS])) _newData[KX_MS] = _containerData[KX_MS]; //maxScrollX
      if(Number.isFinite(_containerData[KY_MS])) _newData[KY_MS] = _containerData[KY_MS]; //maxScrollY
      if(Number.isFinite(_containerData[KX_SB])) _newData[KX_SB] = _containerData[KX_SB]; //vertical scrollbar's width
      if(Number.isFinite(_containerData[KY_SB])) _newData[KY_SB] = _containerData[KY_SB]; //horizontal scrollbar's height
      if(Number.isFinite(_containerData[KY_TB])) _newData[KY_TB] = _containerData[KY_TB]; //top border's height
      if(Number.isFinite(_containerData[KX_RB])) _newData[KX_RB] = _containerData[KX_RB]; //right border's width
      if(Number.isFinite(_containerData[KY_BB])) _newData[KY_BB] = _containerData[KY_BB]; //bottom border's height
      if(Number.isFinite(_containerData[KX_LB])) _newData[KX_LB] = _containerData[KX_LB]; //left border's width
      if(_containerData[KX_SSP] || _containerData[KX_SSP] === NO_SP) _newData[KX_SSP] = _containerData[KX_SSP]; //next standard scrollable parent on the x-axis
      if(_containerData[KX_HSP] || _containerData[KX_HSP] === NO_SP) _newData[KX_HSP] = _containerData[KX_HSP]; //next hidden scrollable parent on the x-axis
      if(_containerData[KY_SSP] || _containerData[KY_SSP] === NO_SP) _newData[KY_SSP] = _containerData[KY_SSP]; //next standard scrollable parent on the y-axis
      if(_containerData[KY_HSP] || _containerData[KY_HSP] === NO_SP) _newData[KY_HSP] = _containerData[KY_HSP]; //next hidden scrollable parent on the y-axis
      if(_containerData[KX_SC]) _newData[KX_SC] = _containerData[KX_SC]; //scrollXCalculator
      if(_containerData[KY_SC]) _newData[KY_SC] = _containerData[KY_SC]; //scrollYCalculator
      
      uss._containersData.set(container, _newData);
    } else {
      if(container !== window && !CHECK_INSTANCEOF(container)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
      }
      uss._containersData.set(container, []);
    }

    if(typeof callback === "function") callback();
  },
  stopScrollingAll: (callback) => {
    for(const [_container, _containerData] of uss._containersData.entries()) {
      window.cancelAnimationFrame(_containerData[KX_ID]);
      window.cancelAnimationFrame(_containerData[KY_ID]);
      _containerData[KX_ID] = NO_VAL; //scrollID on x-axis
      _containerData[KY_ID] = NO_VAL; //scrollID on y-axis
      _containerData[KX_CB] = NO_VAL; //callback on x-axis
      _containerData[KY_CB] = NO_VAL; //callback on y-axis

      const _newData = [];

      if(_containerData[KX_FSC]) _newData[KX_FSC] = _containerData[KX_FSC]; //fixed StepLengthCalculator on the x-axis
      if(_containerData[KY_FSC]) _newData[KY_FSC] = _containerData[KY_FSC]; //fixed StepLengthCalculator on the y-axis
      
      //Cached values.
      if(Number.isFinite(_containerData[KX_MS])) _newData[KX_MS] = _containerData[KX_MS]; //maxScrollX
      if(Number.isFinite(_containerData[KY_MS])) _newData[KY_MS] = _containerData[KY_MS]; //maxScrollY
      if(Number.isFinite(_containerData[KX_SB])) _newData[KX_SB] = _containerData[KX_SB]; //vertical scrollbar's width
      if(Number.isFinite(_containerData[KY_SB])) _newData[KY_SB] = _containerData[KY_SB]; //horizontal scrollbar's height
      if(Number.isFinite(_containerData[KY_TB])) _newData[KY_TB] = _containerData[KY_TB]; //top border's height
      if(Number.isFinite(_containerData[KX_RB])) _newData[KX_RB] = _containerData[KX_RB]; //right border's width
      if(Number.isFinite(_containerData[KY_BB])) _newData[KY_BB] = _containerData[KY_BB]; //bottom border's height
      if(Number.isFinite(_containerData[KX_LB])) _newData[KX_LB] = _containerData[KX_LB]; //left border's width
      if(_containerData[KX_SSP] || _containerData[KX_SSP] === NO_SP) _newData[KX_SSP] = _containerData[KX_SSP]; //next standard scrollable parent on the x-axis
      if(_containerData[KX_HSP] || _containerData[KX_HSP] === NO_SP) _newData[KX_HSP] = _containerData[KX_HSP]; //next hidden scrollable parent on the x-axis
      if(_containerData[KY_SSP] || _containerData[KY_SSP] === NO_SP) _newData[KY_SSP] = _containerData[KY_SSP]; //next standard scrollable parent on the y-axis
      if(_containerData[KY_HSP] || _containerData[KY_HSP] === NO_SP) _newData[KY_HSP] = _containerData[KY_HSP]; //next hidden scrollable parent on the y-axis
      if(_containerData[KX_SC]) _newData[KX_SC] = _containerData[KX_SC]; //scrollXCalculator
      if(_containerData[KY_SC]) _newData[KY_SC] = _containerData[KY_SC]; //scrollYCalculator
      
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
        const __fragment = window.location.hash.slice(1, -1);
        
        //The URL is just "URL/#" or "URL/" 
        if(!__fragment) {
          if(_init(NO_VAL, uss._pageScroller, event) !== false) {
              uss.scrollTo(0, 0, uss._pageScroller, callback, false, options);
          }
          return;
        } 

        const __elementToReach = document.getElementById(__fragment) || document.querySelector("a[name='" + __fragment + "']");
        if(__elementToReach && _init(NO_VAL, __elementToReach, event) !== false) {
          uss.scrollIntoView(__elementToReach, alignToLeft, alignToTop, callback, includeHiddenParents, options);
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
  resizeHandled = false;
  
  //Update the internal Window sizes.
  uss._windowWidth = window.innerWidth;
  uss._windowHeight = window.innerHeight; 

  //Flush the internal caches.
  for(const containerData of uss._containersData.values()) {
    containerData[KX_MS] = NO_VAL;
    containerData[KY_MS] = NO_VAL; 
    containerData[KX_SB] = NO_VAL; //Perhaps use a mutation observer
    containerData[KY_SB] = NO_VAL; //Perhaps use a mutation observer
    containerData[KY_TB] = NO_VAL; //Perhaps use a resize observer 
    containerData[KX_RB] = NO_VAL; //Perhaps use a resize observer 
    containerData[KY_BB] = NO_VAL; //Perhaps use a resize observer 
    containerData[KX_LB] = NO_VAL; //Perhaps use a resize observer 
    containerData[KX_SSP] = NO_VAL; //Perhaps use a resize observer 
    containerData[KX_HSP] = NO_VAL; //Perhaps use a resize observer 
    containerData[KY_SSP] = NO_VAL; //Perhaps use a resize observer 
    containerData[KY_HSP] = NO_VAL; //Perhaps use a resize observer 
    //containerData[KX_SC] doesn't need to be reset
    //containerData[KY_SC] doesn't need to be reset
  }

  for(const callback of uss._onResizeEndCallbacks) callback();
}

let resizeHandled = false;  
window.addEventListener("resize", () => {
  if(resizeHandled) return;
  
  window.addEventListener("pointerover", onResize, {passive:true});
  window.addEventListener("pointerdown", onResize, {passive:true});
  window.addEventListener("touchstart", onResize, {passive:true});
  window.addEventListener("mousemove", onResize, {passive:true});
  window.addEventListener("keydown", onResize, {passive:true});
  window.addEventListener("focus", onResize, {passive:true});
  resizeHandled = true;
}, {passive:true});

function ussInit() {
  //Calculate the _windowScroller.
  uss.getWindowScroller();

  //Calculate the _pageScroller.
  uss.getPageScroller();

  //Calculate the _scrollbarsMaxDimension.
  uss.getScrollbarsMaxDimension();

  //Calculate the average frames' time of the user's screen. 
  let _currentMeasurementsLeft = 60; //Do 60 measurements to establish the initial value
  const _measureFramesTime = () => {
    if(_currentMeasurementsLeft > 0) {
      _currentMeasurementsLeft--;
      uss.calcFramesTimes(NO_VAL, NO_VAL, _measureFramesTime);
    }
    
    //uss._minAnimationFrame = 1000 / uss._framesTime; //<---------------------------------------------------------------------TO LOOK MORE INTO
  }
  _measureFramesTime();
}

if(document.readyState === "complete") ussInit();
else window.addEventListener("load", ussInit, {passive:true, once:true});

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