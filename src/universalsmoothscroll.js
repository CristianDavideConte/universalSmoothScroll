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
 * getDebugMode: function, returns the value of the "_debugMode" property.
 * setXStepLengthCalculator: function, sets the StepLengthCalculator for (the x-axis of) the passed container if compatible.
 * setYStepLengthCalculator: function, sets the StepLengthCalculator for (the y-axis of) the passed container if compatible.
 * setStepLengthCalculator: function, sets the StepLengthCalculator for (both the y and x axes of) the passed container if compatible.
 * setXStepLength: function, sets the "_xStepLength" property to the passed value if compatible.
 * setYStepLength: function, sets the "_yStepLength" property to the passed value if compatible.
 * setStepLength: function, sets both the "_xStepLength" and the "_yStepLength" properties to the passed value if compatible.
 * setMinAnimationFrame: function, sets the "_minAnimationFrame" property to the passed value if compatible.
 * setPageScroller: function, sets the "_pageScroller" property to the passed value if compatible.
 * addResizeCallback: function, add the passed resize callback to the resize callback queue of the passed container if compatible. 
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
const K_IDX = 0;   //Key to get the scroll id on the x-axis
const K_IDY = 1;   //Key to get the scroll id on the y-axis

const K_FPX = 2;   //Key to get the final x position
const K_FPY = 3;   //Key to get the final y position

const K_SDX = 4;   //Key to get the scroll direction on the x-axis 
const K_SDY = 5;   //Key to get the scroll direction on the y-axis

const K_TSAX = 6;  //Key to get the total scroll amount on the x-axis
const K_TSAY = 7;  //Key to get the total scroll amount on the y-axis

const K_OTSX = 8;  //Key to get the original timestamp of the scroll animation on the x-axis
const K_OTSY = 9;  //Key to get the original timestamp of the scroll animation on the y-axis

const K_CBX = 10;  //Key to get the callback for the scroll animation on the x-axis
const K_CBY = 11;  //Key to get the callback for the scroll animation on the y-axis

const K_FSCX = 12; //Key to get the fixed StepLengthCalculator for the scroll animation on the x-axis
const K_FSCY = 13; //Key to get the fixed StepLengthCalculator for the scroll animation on the y-axis

const K_TSCX = 14; //Key to get the temporary StepLengthCalculator for the scroll animation on the x-axis
const K_TSCY = 15; //Key to get the temporary StepLengthCalculator for the scroll animation on the y-axis

const K_MSX = 16;  //Key to get the maxScrollX value 
const K_MSY = 17;  //Key to get the maxScrollY value 

const K_VSB = 18;  //Key to get the vertical scrollbar's width 
const K_HSB = 19;  //Key to get the horizontal scrollbar's height

const K_TB = 20;   //Key to get the top border's height
const K_RB = 21;   //Key to get the right border's width
const K_BB = 22;   //Key to get the bottom border's height
const K_LB = 23;   //Key to get the left border's width

const K_SSPX = 24; //Key to get the standard scrollable parent on the x-axis (overflow !== "hidden") 
const K_HSPX = 25; //Key to get the hidden scrollable parent on the x-axis (overflow === "hidden") 
const K_SSPY = 26; //Key to get the standard scrollable parent on the y-axis (overflow !== "hidden") 
const K_HSPY = 27; //Key to get the hidden scrollable parent on the y-axis (overflow === "hidden") 

const K_SCX = 28;  //Key to get the ScrollXCalculator
const K_SCY = 29;  //Key to get the ScrollYCalculator

const K_BRB = 30; //Key to get the border box 

const K_RCBQ = 31;  //Key to get the resize callbacks queue
const K_MCBQ = 32;  //Key to get the mutation callbacks queue

const NO_VAL = undefined; //No value has been calculated yet
const NO_SP = null;       //No scrollable parent has been found
const MAX_MSG_LEN = 40;   //The maximum error/warning messages' lengths

const INITIAL_WINDOW_WIDTH  = window.innerWidth;
const INITIAL_WINDOW_HEIGHT = window.innerHeight;
const DEFAULT_XSTEP_LENGTH = 16 + 7 / 1508 * (INITIAL_WINDOW_WIDTH - 412);                         //16px at 412px of width  && 23px at 1920px of width 
const DEFAULT_YSTEP_LENGTH = Math.max(1, Math.abs(38 - 20 / 140 * (INITIAL_WINDOW_HEIGHT - 789))); //38px at 789px of height && 22px at 1920px of height
const DEFAULT_MIN_ANIMATION_FRAMES = INITIAL_WINDOW_HEIGHT / DEFAULT_YSTEP_LENGTH;                 //51 frames at 929px of height
const DEFAULT_FRAME_TIME = 16.6; //in ms
const HIGHEST_SAFE_SCROLL_POS = 1073741824; //2^30
//const DEFAULT_FRAME_TIME_CALCULATOR = window.requestIdleCallback || window.requestAnimationFrame; //TODO: To look more into

const REGEX_LOGGER_DISABLED = /disabled/i;
const REGEX_LOGGER_LEGACY = /legacy/i;
const REGEX_ALIGNMENT_NEAREST = /nearest/i;
const REGEX_OVERFLOW = /(auto|scroll)/;
const REGEX_OVERFLOW_HIDDEN = /(auto|scroll|hidden)/;
const REGEX_OVERFLOW_WITH_VISIBLE = /(auto|scroll|visible)/;
const REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE = /(auto|scroll|hidden|visible)/;

const CHECK_INSTANCEOF = (element, classType = Element) => {
  if(element instanceof classType) return true;

  /**
   * At this point we're either in an iFrame or element is not instanceof classType.
   * Instances of iFrames' classes are different from the outer window's ones.
   * The instance check is therefore done between the element and the iFrame's classes.
   *  
   * e.g. 
   * window.classType = window.Element
   * window.classType.name = "Element"
   * iFrameWindow[window.classType.name] = iFrameWindow.Element 
   * 
   * window.Element !== iFrameWindow.Element 
   */
  try {
    //Find the window associated with the passed element
    const _window = element.ownerDocument.defaultView; 
    //Check if element is instanceof the iFrame/inner classType
    return element instanceof _window[classType.name];
  } catch(UnsupportedOperation){
    return false;
  }
}

const TO_STRING = (value) => {
  const _type = typeof value;

  if(
    value === window || 
    value === null || 
    value === undefined ||
    _type === "boolean" || 
    _type === "number" ||
    _type === "bigint" || 
    _type === "string" || 
    _type === "symbol"
  ) {
    return String(value);
  }
  
  if(_type === "function") {
    const _name = value.name || value;
    return String(_name).replace(new RegExp("\n", "g"), "");
  }

  if(Array.isArray(value)) {
    return "[" + value.toString() + "]"; 
  }

  //Test if element has a tag, a class or an id.
  try {
    const _id = value.id ? "#" + value.id : "";
    const _className = value.className ? "." + value.className : "";
    return value.tagName.toLowerCase() + _id + _className; //e.g. div#myId.myClass
  } catch(IllegalInvocation) {}

  //Test if element is just some html code.
  try {
    if("outerHTML" in value) {
      return value.outerHTML.toString().replace(new RegExp("\n", "g"), "");
    }
  } catch(TypeError) {}

  return String(value);
}

const CLEAR_COMMON_DATA = (containerData) => {
  //Scroll animations' ids.
  containerData[K_IDX] = NO_VAL;
  containerData[K_IDY] = NO_VAL;

  //Final positions.
  containerData[K_FPX] = NO_VAL;
  containerData[K_FPY] = NO_VAL;

  //Scroll directions.
  containerData[K_SDX] = NO_VAL;
  containerData[K_SDY] = NO_VAL;

  //Total scroll amounts.
  containerData[K_TSAX] = NO_VAL;
  containerData[K_TSAY] = NO_VAL;

  //Original timestamps.
  containerData[K_OTSX] = NO_VAL;
  containerData[K_OTSY] = NO_VAL;

  //Scroll callbacks.
  containerData[K_CBX] = NO_VAL;
  containerData[K_CBY] = NO_VAL;
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
  if(REGEX_LOGGER_DISABLED.test(uss._debugMode)) return;
  
  const _isString = typeof receivedValue === "string";
  if(!_isString) receivedValue = TO_STRING(receivedValue);

  //Trim the received value if needed.
  if(receivedValue.length > MAX_MSG_LEN) {
    receivedValue = receivedValue.slice(0, MAX_MSG_LEN) + " ...";
  }
  
  //Insert leading and trailing quotes if needed.
  if(_isString) receivedValue = "\"" + receivedValue + "\"";

  if(REGEX_LOGGER_LEGACY.test(uss._debugMode)) {
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
  if(REGEX_LOGGER_DISABLED.test(uss._debugMode)) return;

  const _isString = typeof subject === "string";
  if(!_isString) subject = TO_STRING(subject);

  //Trim the subject if needed.
  if(subject.length > MAX_MSG_LEN) {
    subject = subject.slice(0, MAX_MSG_LEN) + " ...";
  }

  //Insert leading and trailing quotes if needed.
  if(_isString && keepQuotesForString) subject = "\"" + subject + "\"";

  if(REGEX_LOGGER_LEGACY.test(uss._debugMode)) {
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

//Todo: make this const
const DEFAULT_RESIZE_OBSERVER = {
  callbackFrameId: NO_VAL,
  debouncedFrames: 0,
  totalDebounceFrames: 16,
  entries: new Map(), //<entry.target, resized entry>
  observer: new ResizeObserver((entries) => {
    /**
     * Each time a resize event is observed on one of the entries
     * the number of debouced frames is reset.
     */
    DEFAULT_RESIZE_OBSERVER.debouncedFrames = 0;

    //Keep only the most up-to-date resized-entry for each target.
    for(const entry of entries) {
      DEFAULT_RESIZE_OBSERVER.entries.set(entry.target, entry);
    }

    //Schedule the execution of DEFAULT_RESIZE_OBSERVER.callback if needed.
    if(DEFAULT_RESIZE_OBSERVER.callbackFrameId === NO_VAL) {
      DEFAULT_RESIZE_OBSERVER.callbackFrameId = window.requestAnimationFrame(DEFAULT_RESIZE_OBSERVER.callback);
    }
  }),
  callback: () => {
    /**
     * This check ensures that before doing any work, 
     * a fixed number of frames has passed. 
     * Combining this debouncing with the fact that 
     * the resize observer only run once per frame, 
     * allows to clear the caches and execute any callback 
     * once and after the resizing has been completed. 
     */
    if(DEFAULT_RESIZE_OBSERVER.debouncedFrames < DEFAULT_RESIZE_OBSERVER.totalDebounceFrames) {
      DEFAULT_RESIZE_OBSERVER.debouncedFrames++;
      DEFAULT_RESIZE_OBSERVER.callbackFrameId = window.requestAnimationFrame(DEFAULT_RESIZE_OBSERVER.callback);
      return;
    }

    //TODO: vertical resize should not affect horizontal properties and viceversa.
    //Problem: this information isn't provided by the resize observer entry
    //Perhaps the entry.borderBox (seems to be the same as boundingClientRect) can be cached and used 

    //TODO: does it make sense to clear the cache for the scrollable parentxs on resize?

    //TODO: the window caches should be treated differently (e.g. the scrollable parents always NO_SP).

    //TODO: function that use forceCalculation/are cached:
    // getScrollbarsMaxDimension 
    // getWindowScroller
    // getPageScroller
    // getFrameTimes

    // getX/Y/All/ScrollableParent/s //DONE
    // calcX/Y/Scrollbar/sDimension/s //DONE
    // calcBordersDimensions //DONE
    // getMaxScroll/X/Y/s  //DONE
    // getBorderBox //DONE
    
    for(const [container, entry] of DEFAULT_RESIZE_OBSERVER.entries) { 
      const _containerData = uss._containersData.get(container);

      //Clear the caches.
      _containerData[K_MSX] = NO_VAL; //MaxScrollX
      _containerData[K_MSY] = NO_VAL; //MaxScrollY
      _containerData[K_VSB] = NO_VAL; //VerticalScrollbar
      _containerData[K_HSB] = NO_VAL; //HorizontalScrollbar
      
      //TODO: perhaps the MUTATION_OBSERVER should be in charge of these caches
      _containerData[K_TB] = NO_VAL;  //TopBorder
      _containerData[K_RB] = NO_VAL;  //RightBorder
      _containerData[K_BB] = NO_VAL;  //BottomBorder
      _containerData[K_LB] = NO_VAL;  //LeftBorder
      
      //TODO: the MUTATION_OBSERVER should be in charge of these caches
      //_containerData[K_SSPX] = NO_VAL; //Standard Scrollable Parent x-axis
      //_containerData[K_HSPX] = NO_VAL; //Hidden Scrollable Parent x-axis
      //_containerData[K_SSPY] = NO_VAL; //Standard Scrollable Parent y-axis
      //_containerData[K_HSPY] = NO_VAL; //Hidden Scrollable Parent y-axis

      //BorderBox 
      _containerData[K_BRB] = { 
        width: entry.borderBoxSize[0].inlineSize,
        height: entry.borderBoxSize[0].blockSize
      }

      //TODO: decide what to pass as the input of callback
      //The container?
      //The old border box so that the user can understand if it was a horizontal or vertical resize?

      //Execute the resize callbacks
      for(const callback of _containerData[K_RCBQ]) callback();
    }

    DEFAULT_RESIZE_OBSERVER.callbackFrameId = NO_VAL;
    DEFAULT_RESIZE_OBSERVER.entries.clear();
  }
}


//Todo: make this const
//TODO: perhaps use this on scrollable parents 
var DEFAULT_MUTATION_OBSERVER = {
  callbackFrameId: NO_VAL,
  debouncedFrames: 0,
  totalDebounceFrames: 16,
  entries: new Map(), //<entry.target, mutated entry>
  observer: new MutationObserver((entries, observer) => {
    console.log("MUTATION: ");
    console.log(entries);

    /**
     * Each time a mutation event is observed on one of the entries
     * the number of debouced frames is reset.
     */
    DEFAULT_MUTATION_OBSERVER.debouncedFrames = 0;

    //Keep only the most up-to-date entry for each target
    for(const entry of entries) {
      DEFAULT_MUTATION_OBSERVER.entries.set(entry.target, entry);
    }

    //Schedule the execution of DEFAULT_MUTATION_OBSERVER.callback if needed.
    if(DEFAULT_MUTATION_OBSERVER.callbackFrameId === NO_VAL) {
      DEFAULT_MUTATION_OBSERVER.callbackFrameId = window.requestAnimationFrame(DEFAULT_MUTATION_OBSERVER.callback);
    }
  }),
  callback: () => {
    /**
     * This check ensures that before doing any work, 
     * a fixed number of frames has passed. 
     * Combining this debouncing with the fact that 
     * the mutation observer only run once per frame, 
     * allows to clear the caches and execute any callback 
     * once and after all the mutations have been completed. 
     */
    if(DEFAULT_MUTATION_OBSERVER.debouncedFrames < DEFAULT_MUTATION_OBSERVER.totalDebounceFrames) {
      DEFAULT_MUTATION_OBSERVER.debouncedFrames++;
      DEFAULT_MUTATION_OBSERVER.callbackFrameId = window.requestAnimationFrame(DEFAULT_MUTATION_OBSERVER.callback);
      return;
    }

    //TODO: Not every mutation should erase the caches
    
    for(const [container, entry] of DEFAULT_MUTATION_OBSERVER.entries) { 
      const _containerData = uss._containersData.get(container);

      //TODO: is there any cached value other than the scrollable parents that could
      //be reseted on mutation?

      //Empty the caches
      //_containerData[K_MSX] = NO_VAL; 
      //_containerData[K_MSY] = NO_VAL; 
      //_containerData[K_VSB] = NO_VAL; 
      //_containerData[K_HSB] = NO_VAL; 
      //_containerData[K_TB] = NO_VAL; 
      //_containerData[K_RB] = NO_VAL; 
      //_containerData[K_BB] = NO_VAL; 
      //_containerData[K_LB] = NO_VAL; 

      //TODO: specify the right attributes to avoid useless caches erases
      _containerData[K_SSPX] = NO_VAL; 
      _containerData[K_HSPX] = NO_VAL; 
      _containerData[K_SSPY] = NO_VAL; 
      _containerData[K_HSPY] = NO_VAL; 

      //TODO: decide what to pass as the input of callback
      //The container?

      //Execute the mutation callbacks
      for(const callback of _containerData[K_MCBQ]) callback();
    }

    DEFAULT_MUTATION_OBSERVER.callbackFrameId = NO_VAL;
    DEFAULT_MUTATION_OBSERVER.entries.clear();
  }
}


const INIT_CONTAINER_DATA = (container, containerData = []) => {
  if(container === window) {  
    let _debounceResizeEvent = false;

    window.addEventListener("resize", () => {
      //Update the internal Window sizes.
      uss._windowWidth = window.innerWidth;
      uss._windowHeight = window.innerHeight; 
      
      //Make the resize callback fire only once per frame like the resize observer.
      if(_debounceResizeEvent) return;

      _debounceResizeEvent = true;
      window.requestAnimationFrame(() => _debounceResizeEvent = false);

      //Emulate what the DEFAULT_RESIZE_OBSERVER does for all the other containers.
      DEFAULT_RESIZE_OBSERVER.debouncedFrames = 0;

      //Keep only the most up-to-date resized-entry.
      DEFAULT_RESIZE_OBSERVER.entries.set(
        window, 
        {
          borderBoxSize: [
            {
              inlineSize: uss._windowWidth,
              blockSize: uss._windowHeight,
            }
          ]
        }
      );  

      //Schedule the execution of DEFAULT_RESIZE_OBSERVER.callback if needed.
      if(DEFAULT_RESIZE_OBSERVER.callbackFrameId === NO_VAL) {
        DEFAULT_RESIZE_OBSERVER.callbackFrameId = window.requestAnimationFrame(DEFAULT_RESIZE_OBSERVER.callback);
      }
    }, {passive:true});

    //The Window doesn't have any scrollable parent.
    containerData[K_SSPX] = NO_SP;
    containerData[K_HSPX] = NO_SP;
    containerData[K_SSPY] = NO_SP;
    containerData[K_HSPY] = NO_SP;

    containerData[K_SCX] = () => window.scrollX; //ScrollXCalculator
    containerData[K_SCY] = () => window.scrollY; //ScrollYCalculator
    containerData[K_RCBQ] = []; //Resize callback queue
    //containerData[K_MCBQ] = []; //Mutation callback queue //TODO: useless since window is never mutated??
    uss._containersData.set(container, containerData);

    return true;
  }
  
  if(CHECK_INSTANCEOF(container)) {
    try {
      DEFAULT_RESIZE_OBSERVER.observer.observe(container, { box: "border-box" }); 

      //TODO: add all the necessary filters to the attributeFilter property 
      //to avoid useless cache-erasing operations
      DEFAULT_MUTATION_OBSERVER.observer.observe(
        container, 
        { 
          attributes: true, 
          attributeOldValue: true,
          //attributeFilter: ["style"],
          childList: true
        }
      );
    } catch(unsupportedByResizeObserver) {
      return false;
    }

    containerData[K_SCX] = () => container.scrollLeft; //ScrollXCalculator
    containerData[K_SCY] = () => container.scrollTop;  //ScrollYCalculator
    containerData[K_RCBQ] = []; //Resize callback queue
    containerData[K_MCBQ] = []; //Mutation callback queue
    uss._containersData.set(container, containerData);

    return true;
  }

  return false;
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
  _debugMode: "",
  _errorLogger: DEFAULT_ERROR_LOGGER,
  _warningLogger: DEFAULT_WARNING_LOGGER,
  getXStepLength: () => uss._xStepLength,
  getYStepLength: () => uss._yStepLength,
  getMinAnimationFrame: () => uss._minAnimationFrame,
  getWindowWidth:  () => uss._windowWidth,
  getWindowHeight: () => uss._windowHeight,
  getReducedMotionState: () => uss._reducedMotion,
  getDebugMode: () => uss._debugMode, 
  isXScrolling: (container = uss._pageScroller, options = {debugString: "isXScrolling"}) => {
    const _containerData = uss._containersData.get(container);

    if(_containerData) return !!_containerData[K_IDX];

    if(INIT_CONTAINER_DATA(container)) return false;

    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  }, 
  isYScrolling: (container = uss._pageScroller, options = {debugString: "isYScrolling"}) => {
    const _containerData = uss._containersData.get(container);

    if(_containerData) return !!_containerData[K_IDY];
    
    if(INIT_CONTAINER_DATA(container)) return false;

    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },   
  isScrolling: (container = uss._pageScroller, options = {debugString: "isScrolling"}) => {
    const _containerData = uss._containersData.get(container);

    if(_containerData) return !!(_containerData[K_IDX] || _containerData[K_IDY]);

    if(INIT_CONTAINER_DATA(container)) return false;

    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getFinalXPosition: (container = uss._pageScroller, options = {debugString: "getFinalXPosition"}) => {
    //If there's no scroll-animation on the x-axis, the current position is returned instead.
    const _containerData = uss._containersData.get(container) || [];
    return _containerData[K_FPX] === 0 ? 0 : _containerData[K_FPX] || uss.getScrollXCalculator(container, options)();
  },
  getFinalYPosition: (container = uss._pageScroller, options = {debugString: "getFinalYPosition"}) => {
    //If there's no scroll-animation on the y-axis, the current position is returned instead.
    const _containerData = uss._containersData.get(container) || [];
    return _containerData[K_FPY] === 0 ? 0 : _containerData[K_FPY] || uss.getScrollYCalculator(container, options)();
  },
  getScrollXDirection: (container = uss._pageScroller, options = {debugString: "getScrollXDirection"}) => {
    const _containerData = uss._containersData.get(container);
    
    //If there's no scroll-animation, 0 is returned.
    if(_containerData) return _containerData[K_SDX] || 0;
    
    if(INIT_CONTAINER_DATA(container)) return 0;

    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getScrollYDirection: (container = uss._pageScroller, options = {debugString: "getScrollYDirection"}) => {
    const _containerData = uss._containersData.get(container);
    
    //If there's no scroll-animation, 0 is returned.
    if(_containerData) return _containerData[K_SDY] || 0;
    
    if(INIT_CONTAINER_DATA(container)) return 0;

    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
  },
  getXStepLengthCalculator: (container = uss._pageScroller, getTemporary = false, options = {debugString: "getXStepLengthCalculator"}) => {
    const _containerData = uss._containersData.get(container);
        
    if(_containerData) return getTemporary ? _containerData[K_TSCX] : _containerData[K_FSCX];

    if(INIT_CONTAINER_DATA(container)) return;

    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);    
  },
  getYStepLengthCalculator: (container = uss._pageScroller, getTemporary = false, options = {debugString: "getYStepLengthCalculator"}) => {    
    const _containerData = uss._containersData.get(container);
        
    if(_containerData) return getTemporary ? _containerData[K_TSCY] : _containerData[K_FSCY];

    if(INIT_CONTAINER_DATA(container)) return;

    uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);    
  },
  getScrollbarsMaxDimension: (forceCalculation = false) => {
    /**
     * Calculate the maximum sizes of scrollbars on the webpage by:
     * - creating a <div> with id = "_uss-scrollbox"
     * - giving that <div> a mini-stylesheet that forces it to show the scrollbars 
     */
    if(forceCalculation || uss._scrollbarsMaxDimension === NO_VAL) {
      const _scrollBoxStyle = document.createElement("style");
      const _scrollBox = document.createElement("div");
      _scrollBox.id = "_uss-scrollbox";
      _scrollBoxStyle.appendChild(
        //TODO: perhaps use the `` to avoid going newline?
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
      if(!_oldData) INIT_CONTAINER_DATA(window, _containerData);
            
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

      let _maxScrollX = _containerData[K_MSX] !== NO_VAL ? _containerData[K_MSX] : HIGHEST_SAFE_SCROLL_POS;
      let _maxScrollY = _containerData[K_MSY] !== NO_VAL ? _containerData[K_MSY] : HIGHEST_SAFE_SCROLL_POS;

      if(
        (_maxScrollX > 0 && _windowInitialX !== _maxScrollX) ||
        (_maxScrollY > 0 && _windowInitialY !== _maxScrollY)
      ) {
        //Try to scroll the body/html by scrolling the Window.
        window.scroll(HIGHEST_SAFE_SCROLL_POS, HIGHEST_SAFE_SCROLL_POS);

        _maxScrollX = window.scrollX;
        _maxScrollY = window.scrollY;

        //Cache the maxScrollX/maxScrollY.
        _containerData[K_MSX] = _maxScrollX;
        _containerData[K_MSY] = _maxScrollY;
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
          window.scrollX === element.scrollLeft  && 
          window.scrollY === element.scrollTop
        ) {
          //Cache the maxScrollX/maxScrollY.
          const _elementOldData = uss._containersData.get(element); 
          const _elementData = _elementOldData || [];
          _elementData[K_MSX] = _maxScrollX;
          _elementData[K_MSY] = _maxScrollY;
          
          if(!_elementOldData) INIT_CONTAINER_DATA(element, _elementData);
          
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
  setXStepLengthCalculator: (newCalculator, container = uss._pageScroller, isTemporary = false, options = {debugString: "setXStepLengthCalculator"}) => {
    const _isSettingOp = newCalculator !== undefined;
    if(typeof newCalculator !== "function" && _isSettingOp) {
      uss._errorLogger(options.debugString, "the newCalculator to be a function", newCalculator);
      return;
    }

    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];
    
    if(!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }

    if(isTemporary) {
      _containerData[K_TSCX] = newCalculator;
    } else {
      _containerData[K_FSCX] = newCalculator;

      //Setting a fixed StepLengthCalculator will unset the temporary one.
      if(_isSettingOp) _containerData[K_TSCX] = NO_VAL; 
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

    if(!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }

    if(isTemporary) {
      _containerData[K_TSCY] = newCalculator;
    } else {
      _containerData[K_FSCY] = newCalculator;

      //Setting a fixed StepLengthCalculator will unset the temporary one.
      if(_isSettingOp) _containerData[K_TSCY] = NO_VAL; 
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

    if(!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }

    if(isTemporary) {
      _containerData[K_TSCX] = newCalculator;
      _containerData[K_TSCY] = newCalculator;
    } else {
      _containerData[K_FSCX] = newCalculator;
      _containerData[K_FSCY] = newCalculator;

      //Setting a fixed StepLengthCalculator will unset the temporary one.
      if(_isSettingOp) {
        _containerData[K_TSCX] = NO_VAL;
        _containerData[K_TSCY] = NO_VAL;
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
    if(!uss._containersData.get(newPageScroller) && !INIT_CONTAINER_DATA(newPageScroller)) {
      uss._errorLogger(options.debugString, "the newPageScroller to be an Element or the Window", newPageScroller);
      return;
    }
    uss._pageScroller = newPageScroller;
  },
  //TODO: add cypress tests
  addResizeCallback: (newCallback, container = uss._pageScroller, options = {debugString: "addResizeCallback"}) => {
    if(typeof newCallback !== "function") {
      uss._errorLogger(options.debugString, "the newCallback to be a function", newCallback);
      return;
    }
    
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }

    _containerData[K_RCBQ].push(newCallback);
  },
  //TODO: add cypress tests
  addMutationCallback: (newCallback, container = uss._pageScroller, options = {debugString: "addMutationCallback"}) => {
    if(typeof newCallback !== "function") {
      uss._errorLogger(options.debugString, "the newCallback to be a function", newCallback);
      return;
    }
    
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(container === window || (!_oldData && !INIT_CONTAINER_DATA(container, _containerData))) {
      uss._errorLogger(options.debugString, "the container to be an Element", container);
      return;
    }

    _containerData[K_MCBQ].push(newCallback);
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
    
    /**
     * Only instances of HTMLElement and SVGElement have the style property, and they both implement Element.
     * All the other unsupported implementations are filtered out by the checking style property later.
     */
    if(!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }
    
    if(
      forceCalculation ||
      _containerData[K_VSB] === NO_VAL || 
      _containerData[K_HSB] === NO_VAL
    ) {
      const _windowScroller = uss.getWindowScroller();

      if(container === window && window !== _windowScroller) {
        return uss.calcScrollbarsDimensions(_windowScroller, forceCalculation, options);
      } else if(!container.style || uss.getScrollbarsMaxDimension() === 0) {
        //The element cannot have scrollbars or their size is 0px on this webpage.
        _containerData[K_VSB] = 0;
        _containerData[K_HSB] = 0;
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
        
          _containerData[K_VSB] = Number.parseInt(_style.width)  - _initialWidth;
          _containerData[K_HSB] = Number.parseInt(_style.height) - _initialHeight;
    
          container.style.overflowX = _initialOverflowX;
          container.style.overflowY = _initialOverflowY;
        } else {
          const _initialBorder = container.style.border;

          container.style.border = "none";
        
          _containerData[K_VSB] = container.offsetWidth - container.clientWidth;
          _containerData[K_HSB] = container.offsetHeight - container.clientHeight;
          
          container.style.border = _initialBorder;
        }

        //After modifying the styles of the container, the scroll position may change.
        container.scroll(_initialXPosition, _initialYPosition);

        //If the container is the windowScroller, cache the values for the window too.
        if(container === _windowScroller) {
          const _windowOldData = uss._containersData.get(window);
          const _windowData = _windowOldData || [];

          _windowData[K_VSB] = _containerData[K_VSB];
          _windowData[K_HSB] = _containerData[K_HSB];

          if(!_windowOldData) INIT_CONTAINER_DATA(window, _windowData);
        }
      }
    }
          
    return [
      _containerData[K_VSB], //Vertical scrollbar's width
      _containerData[K_HSB]  //Horizontal scrollbar's height
    ];
  },
  calcBordersDimensions: (container = uss._pageScroller, forceCalculation = false, options = {debugString: "calcBordersDimensions"}) => {
    //Check if the bordersDimensions of the passed container have already been calculated. 
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }

    if(
      forceCalculation ||
      _containerData[K_TB] === NO_VAL || 
      _containerData[K_RB] === NO_VAL || 
      _containerData[K_BB] === NO_VAL || 
      _containerData[K_LB] === NO_VAL 
    ) {
      if(container === window) {
        const _windowScroller = uss.getWindowScroller();
        const _bordersDimensions = _windowScroller === window ? [0,0,0,0] : uss.calcBordersDimensions(_windowScroller, forceCalculation, options);

        _containerData[K_TB] = _bordersDimensions[0];
        _containerData[K_RB] = _bordersDimensions[1];
        _containerData[K_BB] = _bordersDimensions[2];
        _containerData[K_LB] = _bordersDimensions[3];
      } else {
        try {
          const _style = window.getComputedStyle(container);
          
          _containerData[K_TB] = Number.parseFloat(_style.borderTopWidth);
          _containerData[K_RB] = Number.parseFloat(_style.borderRightWidth);
          _containerData[K_BB] = Number.parseFloat(_style.borderBottomWidth);
          _containerData[K_LB] = Number.parseFloat(_style.borderLeftWidth);
        } catch(getComputedStyleNotSupported) { 
          //window.getComputedStyle may not work on the passed container 
          _containerData[K_TB] = 0;
          _containerData[K_RB] = 0;
          _containerData[K_BB] = 0;
          _containerData[K_LB] = 0;
        }
      }
    }
    
    return [
      _containerData[K_TB], //top
      _containerData[K_RB], //right
      _containerData[K_BB], //bottom
      _containerData[K_LB], //left
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

    if(!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);     
      return;                                  
    }

    return [_containerData[K_SCX], _containerData[K_SCY]];
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
      _oldData[K_MSX] !== NO_VAL && 
      _oldData[K_MSY] !== NO_VAL
    ) {
      return [_oldData[K_MSX], _oldData[K_MSY]];
    }

    const [_scrollXCalculator, _scrollYCalculator] = uss.getScrollCalculators(container, options);
    const _initialXPosition = _scrollXCalculator();
    const _initialYPosition = _scrollYCalculator();
    const _containerData = uss._containersData.get(container);

    container.scroll(HIGHEST_SAFE_SCROLL_POS, HIGHEST_SAFE_SCROLL_POS);

    _containerData[K_MSX] = _scrollXCalculator(); //maxScrollX
    _containerData[K_MSY] = _scrollYCalculator(); //maxScrollY
    
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

      _windowScrollerData[K_MSX] = _containerData[K_MSX];
      _windowScrollerData[K_MSY] = _containerData[K_MSY];
      
      if(!_windowScrollerOldData) INIT_CONTAINER_DATA(_windowScroller, _windowScrollerData); 
    }

    return [_containerData[K_MSX], _containerData[K_MSY]];
  },
  //TODO: Add cypress tests
  getBorderBox: (container, options = {debugString: "getBorderBox"}) => {
    //Check if the borderBox of the passed container has already been calculated. 
    const _oldData = uss._containersData.get(container);
    const _containerData = _oldData || [];

    if(!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }

    if(_containerData[K_BRB] === NO_VAL) {
      const _containerRect = container !== window ? container.getBoundingClientRect() : 
                                                    { width: uss._windowWidth, height: uss._windowHeight };

      _containerData[K_BRB] = {
        width: _containerRect.width,
        height: _containerRect.height,
      }
    }

    return _containerData[K_BRB];
  },
  //TODO: element should be called container
  //      and _container should be called _parent 
  getXScrollableParent: (element, includeHiddenParents = false, options = {debugString: "getXScrollableParent"}) => {
    const _oldData = uss._containersData.get(element);
    const _containerData = _oldData || [];
    const _cachedParent = includeHiddenParents ? _containerData[K_HSPX] : _containerData[K_SSPX];
    
    if(_cachedParent !== NO_VAL) return _cachedParent;
    
    if(!_oldData && !INIT_CONTAINER_DATA(element, _containerData)) {
      uss._errorLogger(options.debugString, "the element to be an Element or the Window", element);
      return;
    }
    
    if(element === window) {
      _containerData[K_HSPX] = NO_SP;
      _containerData[K_HSPY] = NO_SP;
      _containerData[K_SSPY] = NO_SP;
      _containerData[K_SSPY] = NO_SP;
      return NO_SP;
    }

    const _body = document.body;
    const _html = document.documentElement;
    let _overflowRegex, _overflowRegexWithVisible;
    let _cacheResult;
    
    if(includeHiddenParents) {
      _cacheResult = (el) => _containerData[K_HSPX] = el;
      _overflowRegex = REGEX_OVERFLOW_HIDDEN;
      _overflowRegexWithVisible = REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE;
    } else {
      _cacheResult = (el) => _containerData[K_SSPX] = el;
      _overflowRegex = REGEX_OVERFLOW;
      _overflowRegexWithVisible = REGEX_OVERFLOW_WITH_VISIBLE;
    }

    const _elementInitialX = element.getBoundingClientRect().left;
    const _windowScroller = uss.getWindowScroller();
    let _container = element.parentElement;

    const _isScrollableParent = (overflowRegex) => {
      //The x-axis should be tested.
      if(
        _container === window || 
        overflowRegex.test(window.getComputedStyle(_container).overflowX)
      ) {
        if(_container === _windowScroller) _container = window;

        const [_scrollXCalculator, _scrollYCalculator] = uss.getScrollCalculators(_container, options);        
        const _containerInitialX = _scrollXCalculator();
        const _containerInitialY = _scrollYCalculator();
        
        const _containerData = uss._containersData.get(_container);
        let _maxScrollX = _containerData[K_MSX] !== NO_VAL ? _containerData[K_MSX] : HIGHEST_SAFE_SCROLL_POS;
        
        if(_maxScrollX > 0 && _containerInitialX !== _maxScrollX) {
          //Try to scroll the element by scrolling the parent.
          _container.scroll(HIGHEST_SAFE_SCROLL_POS, _containerInitialY);
  
          _maxScrollX = _scrollXCalculator();
  
          //Cache the maxScrollX.
          _containerData[K_MSX] = _maxScrollX;
        }

        //The parent cannot scroll.
        if(_maxScrollX === 0) return false;

        //The parent was already at its maxScrollX.
        if(_containerInitialX === _maxScrollX) {
          //Try to scroll the element by scrolling the parent.
          _container.scroll(0, _containerInitialY);
        }

        //Check if the element has moved.
        const _isXScrollable = _elementInitialX !== element.getBoundingClientRect().left;
        
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
      const _regexToUse = _container === _body || _container === _html ? _overflowRegexWithVisible : _overflowRegex;
      
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
    const _cachedParent = includeHiddenParents ? _containerData[K_HSPY] : _containerData[K_SSPY];
    
    if(_cachedParent !== NO_VAL) return _cachedParent;
    
    if(!_oldData && !INIT_CONTAINER_DATA(element, _containerData)) {
      uss._errorLogger(options.debugString, "the element to be an Element or the Window", element);
      return;
    }
    
    if(element === window) {
      _containerData[K_HSPX] = NO_SP;
      _containerData[K_HSPY] = NO_SP;
      _containerData[K_SSPY] = NO_SP;
      _containerData[K_SSPY] = NO_SP;
      return NO_SP;
    }

    const _body = document.body;
    const _html = document.documentElement;
    let _overflowRegex, _overflowRegexWithVisible;
    let _cacheResult;
    
    if(includeHiddenParents) {
      _cacheResult = (el) => _containerData[K_HSPY] = el;
      _overflowRegex = REGEX_OVERFLOW_HIDDEN;
      _overflowRegexWithVisible = REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE;
    } else {
      _cacheResult = (el) => _containerData[K_SSPY] = el;
      _overflowRegex = REGEX_OVERFLOW;
      _overflowRegexWithVisible = REGEX_OVERFLOW_WITH_VISIBLE;
    }

    const _elementInitialY = element.getBoundingClientRect().top;
    const _windowScroller = uss.getWindowScroller();
    let _container = element.parentElement;

    const _isScrollableParent = (overflowRegex) => {
      //The y-axis should be tested.
      if(
        _container === window || 
        overflowRegex.test(window.getComputedStyle(_container).overflowY)
      ) {
        if(_container === _windowScroller) _container = window;

        const [_scrollXCalculator, _scrollYCalculator] = uss.getScrollCalculators(_container, options);        
        const _containerInitialX = _scrollXCalculator();
        const _containerInitialY = _scrollYCalculator();
        
        const _containerData = uss._containersData.get(_container);
        let _maxScrollY = _containerData[K_MSY] !== NO_VAL ? _containerData[K_MSY] : HIGHEST_SAFE_SCROLL_POS;
        
        if(_maxScrollY > 0 && _containerInitialY !== _maxScrollY) {
          //Try to scroll the element by scrolling the parent.
          _container.scroll(_containerInitialX, HIGHEST_SAFE_SCROLL_POS);

          _maxScrollY = _scrollYCalculator();

          //Cache the maxScrollY.
          _containerData[K_MSY] = _maxScrollY;
        }

        //The parent cannot scroll.
        if(_maxScrollY === 0) return false;

        //The parent was already at its maxScrollY.
        if(_containerInitialY === _maxScrollY) {
          //Try to scroll the element by scrolling the parent.
          _container.scroll(_containerInitialX, 0);
        }

        //Check if the element has moved.
        const _isYScrollable = _elementInitialY !== element.getBoundingClientRect().top;
        
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
    //is scrollable on the x-axis.
    while(_container) {
      const _regexToUse = _container === _body || _container === _html ? _overflowRegexWithVisible : _overflowRegex;
      
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
      _cachedXParent = _containerData[K_HSPX];
      _cachedYParent = _containerData[K_HSPY];
    } else {
      _cachedXParent = _containerData[K_SSPX];
      _cachedYParent = _containerData[K_SSPY];
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
       *                  el2  |  el2   |  el2   | el1 or el2
       */
      if(_cachedXParent === NO_SP) return _cachedYParent;
      if(_cachedYParent === NO_SP) return _cachedXParent;
      if(_cachedXParent === window) return _cachedYParent;
      if(_cachedYParent === window) return _cachedXParent;
      return _cachedXParent.contains(_cachedYParent) ? _cachedYParent : _cachedXParent;
    }
    
    if(!_oldData && !INIT_CONTAINER_DATA(element, _containerData)) {
      uss._errorLogger(options.debugString, "the element to be an Element or the Window", element);
      return;
    }

    if(element === window) {
      _containerData[K_HSPX] = NO_SP;
      _containerData[K_HSPY] = NO_SP;
      _containerData[K_SSPY] = NO_SP;
      _containerData[K_SSPY] = NO_SP;
      return NO_SP;
    }

    const _body = document.body;
    const _html = document.documentElement;
    let _overflowRegex, _overflowRegexWithVisible;
    let _cacheXResult, _cacheYResult;
    
    if(includeHiddenParents) {
      _cacheXResult = (el) => _containerData[K_HSPX] = el;
      _cacheYResult = (el) => _containerData[K_HSPY] = el;
      _overflowRegex = REGEX_OVERFLOW_HIDDEN;
      _overflowRegexWithVisible = REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE;
    } else {
      _cacheXResult = (el) => _containerData[K_SSPX] = el;
      _cacheYResult = (el) => _containerData[K_SSPY] = el;
      _overflowRegex = REGEX_OVERFLOW;
      _overflowRegexWithVisible = REGEX_OVERFLOW_WITH_VISIBLE;
    }

    const _elementInitialPos = element.getBoundingClientRect();
    const _elementInitialX = _elementInitialPos.left;
    const _elementInitialY = _elementInitialPos.top;
    const _windowScroller = uss.getWindowScroller();
    let _container = element.parentElement;

    const _isScrollableParent = (overflowRegex) => {
      let _testScrollX, _testScrollY;

      if(_container === window) {
        _testScrollX = true;
        _testScrollY = true;  
      } else {       
        //Check if the overflow conditions are met.
        const _style = window.getComputedStyle(_container);
        _testScrollX = overflowRegex.test(_style.overflowX);
        _testScrollY = overflowRegex.test(_style.overflowY);  
      }
      
      //At least one axis should be tested.
      if(_testScrollX || _testScrollY) {
        if(_container === _windowScroller) _container = window;

        const [_scrollXCalculator, _scrollYCalculator] = uss.getScrollCalculators(_container, options);        
        const _containerInitialX = _scrollXCalculator();
        const _containerInitialY = _scrollYCalculator();
        
        const _containerData = uss._containersData.get(_container);
        let _maxScrollX = _containerData[K_MSX] !== NO_VAL ? _containerData[K_MSX] : HIGHEST_SAFE_SCROLL_POS;
        let _maxScrollY = _containerData[K_MSY] !== NO_VAL ? _containerData[K_MSY] : HIGHEST_SAFE_SCROLL_POS;
        
        if(
          (_maxScrollX > 0 && _containerInitialX !== _maxScrollX) ||
          (_maxScrollY > 0 && _containerInitialY !== _maxScrollY)
        ) {
          //Try to scroll the element by scrolling the parent.
          _container.scroll(HIGHEST_SAFE_SCROLL_POS, HIGHEST_SAFE_SCROLL_POS);

          _maxScrollX = _scrollXCalculator();
          _maxScrollY = _scrollYCalculator();

          //Cache the maxScrollX/maxScrollY.
          _containerData[K_MSX] = _maxScrollX;
          _containerData[K_MSY] = _maxScrollY;
        }

        //The parent cannot scroll.
        if(_maxScrollX === 0 && _maxScrollY === 0) return false;

        //The parent was already at its maxScrollX/maxScrollY.
        if(_containerInitialX === _maxScrollX && _containerInitialY === _maxScrollY) {
          //Try to scroll the element by scrolling the parent.
          _container.scroll(0,0);
        }

        //Check if the element has moved.
        const _elementPos = element.getBoundingClientRect();
        const _isXScrollable = _testScrollX && _elementInitialX !== _elementPos.left;
        const _isYScrollable = _testScrollY && _elementInitialY !== _elementPos.top;
        
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
    //is scrollable on either the x or y axis.
    while(_container) {
      const _regexToUse = _container === _body || _container === _html ? _overflowRegexWithVisible : _overflowRegex;
      
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
    const _containerData = uss._containersData.get(container);
    _containerData[K_FPX] = finalXPosition;      //finalXPosition
    _containerData[K_SDX] = _direction;          //direction
    _containerData[K_TSAX] = _totalScrollAmount; //totalScrollAmount
    _containerData[K_OTSX] = NO_VAL;             //originalTimestamp
    _containerData[K_CBX] = callback;            //callback

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated.
    if(_containerData[K_IDX]) return;

    //No scroll-animation is being performed so a new one is created.
    _containerData[K_IDX] = window.requestAnimationFrame(_stepX);

    function _stepX(timestamp) {
      const _finalXPosition = _containerData[K_FPX];
      const _direction = _containerData[K_SDX];
      const _currentXPosition = _scrollXCalculator();
      const _remaningScrollAmount = (_finalXPosition - _currentXPosition) * _direction;
      
      if(_remaningScrollAmount < 1) {
        uss.stopScrollingX(container, _containerData[K_CBX]);
        return;
      }
      
      //There's no originalTimeStamp at the beginning of a scroll-animation.
      if(!_containerData[K_OTSX]) _containerData[K_OTSX] = timestamp;
      
      const _scrollID = _containerData[K_IDX];  
      
      const _stepLengthCalculator = _containerData[K_TSCX] ? _containerData[K_TSCX] :   
                                     _containerData[K_FSCX] ? _containerData[K_FSCX] :
                                                              DEFAULT_XSTEP_LENGTH_CALCULATOR;

      let _stepLength = _stepLengthCalculator(
        _remaningScrollAmount, //Remaning scroll amount
        _containerData[K_OTSX], //Original timestamp
        timestamp,              //Current timestamp
        _containerData[K_TSAX], //Total scroll amount
        _currentXPosition,     //Current position
        _finalXPosition,       //Final position
        container               //Container
      );
      
      //The current scroll-animation has been aborted by the StepLengthCalculator.
      if(_scrollID !== _containerData[K_IDX]) return; 

      //The current scroll-animation has been altered by the StepLengthCalculator.
      if(_finalXPosition !== _containerData[K_FPX]) {  
        _containerData[K_IDX] = window.requestAnimationFrame(_stepX); 
        return;
      } 

      //The StepLengthCalculator returned an invalid stepLength.
      if(!Number.isFinite(_stepLength)) {
        uss._warningLogger(_stepLength, "is not a valid step length", true);

        _stepLength = DEFAULT_XSTEP_LENGTH_CALCULATOR(
          _remaningScrollAmount, //Remaning scroll amount
          _containerData[K_OTSX], //Original timestamp
          timestamp,              //Current timestamp
          _containerData[K_TSAX], //Total scroll amount
          _currentXPosition,     //Current position
          _finalXPosition,       //Final position
          container               //Container
        );
      }

      if(_remaningScrollAmount <= _stepLength) {
        _scroll(_finalXPosition);
        uss.stopScrollingX(container, _containerData[K_CBX]);
        return;
      }

      _scroll(_currentXPosition + _stepLength * _direction);

      //The API tried to scroll but the finalXPosition was beyond the scroll limit of the container.
      if(_stepLength !== 0 && _currentXPosition === _scrollXCalculator()) {
        uss.stopScrollingX(container, _containerData[K_CBX]);
        return;
      }

      _containerData[K_IDX] = window.requestAnimationFrame(_stepX);
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
    const _containerData = uss._containersData.get(container);
    _containerData[K_FPY] = finalYPosition;      //finalYPosition
    _containerData[K_SDY] = _direction;          //direction
    _containerData[K_TSAY] = _totalScrollAmount; //totalScrollAmount
    _containerData[K_OTSY] = NO_VAL;             //originalTimestamp
    _containerData[K_CBY] = callback;            //callback

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated.
    if(_containerData[K_IDY]) return;

    //No scroll-animation is being performed so a new one is created.
    _containerData[K_IDY] = window.requestAnimationFrame(_stepY);
     
    function _stepY(timestamp) {
      const _finalYPosition = _containerData[K_FPY];
      const _direction = _containerData[K_SDY];
      const _currentYPosition = _scrollYCalculator();
      const _remaningScrollAmount = (_finalYPosition - _currentYPosition) * _direction;

      if(_remaningScrollAmount < 1) {
        uss.stopScrollingY(container, _containerData[K_CBY]);
        return;
      }

      //There's no originalTimeStamp at the beginning of a scroll-animation.
      if(!_containerData[K_OTSY]) _containerData[K_OTSY] = timestamp;

      const _scrollID = _containerData[K_IDY];
      const _stepLengthCalculator = _containerData[K_TSCY] ? _containerData[K_TSCY] :   
                                     _containerData[K_FSCY] ? _containerData[K_FSCY] :
                                                              DEFAULT_YSTEP_LENGTH_CALCULATOR;

      let _stepLength = _stepLengthCalculator(
        _remaningScrollAmount, //Remaning scroll amount
        _containerData[K_OTSY], //Original timestamp
        timestamp,              //Current timestamp
        _containerData[K_TSAY], //Total scroll amount
        _currentYPosition,     //Current position
        _finalYPosition,       //Final position
        container               //Container
      );
      
      //The current scroll-animation has been aborted by the StepLengthCalculator.
      if(_scrollID !== _containerData[K_IDY]) return; 

      //The current scroll-animation has been altered by the StepLengthCalculator.
      if(_finalYPosition !== _containerData[K_FPY]) {  
        _containerData[K_IDY] = window.requestAnimationFrame(_stepY); 
        return;
      } 
      
      //The StepLengthCalculator returned an invalid stepLength.
      if(!Number.isFinite(_stepLength)) {
        uss._warningLogger(_stepLength, "is not a valid step length", true);

        _stepLength = DEFAULT_YSTEP_LENGTH_CALCULATOR(
          _remaningScrollAmount, //Remaning scroll amount
          _containerData[K_OTSY], //Original timestamp
          timestamp,              //Current timestamp
          _containerData[K_TSAY], //Total scroll amount
          _currentYPosition,     //Current position
          _finalYPosition,       //Final position
          container               //Container
        );
      }

      if(_remaningScrollAmount <= _stepLength) {
        _scroll(_finalYPosition);
        uss.stopScrollingY(container, _containerData[K_CBY]);
        return;
      }

      _scroll(_currentYPosition + _stepLength * _direction);

      //The API tried to scroll but the finalYPosition was beyond the scroll limit of the container.
      if(_stepLength !== 0 && _currentYPosition === _scrollYCalculator()) {
        uss.stopScrollingY(container, _containerData[K_CBY]);
        return;
      }

      _containerData[K_IDY] = window.requestAnimationFrame(_stepY);
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
      if(_containerData[K_IDX]) {  

        //An actual scroll has been requested.   
        if(deltaX !== 0) { 
          let _finalXPosition = _containerData[K_FPX] + deltaX;

          //Limit the final position to the [0, maxScrollX] interval. 
          if(containScroll) {
            const _maxScrollX = uss.getMaxScrollX(container, false, options);
            if(_finalXPosition < 0) _finalXPosition = 0;
            else if(_finalXPosition > _maxScrollX) _finalXPosition = _maxScrollX;
          }

          const _remaningScrollAmount = (_finalXPosition - _currentXPosition) * _containerData[K_SDX];
          
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
          
          const _totalScrollAmount = _containerData[K_TSAX] * _containerData[K_SDX] + deltaX; 
          _containerData[K_FPX] = _finalXPosition;                             //finalXPosition
          _containerData[K_SDX] = _totalScrollAmount > 0 ? 1 : -1;             //direction
          _containerData[K_TSAX] = _totalScrollAmount * _containerData[K_SDX]; //totalScrollAmount (always positive)
        }
        _containerData[K_OTSX] = NO_VAL;  //originalTimestamp
        _containerData[K_CBX] = callback; //callback
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
      if(_containerData[K_IDY]) {     
        //An actual scroll has been requested.   
        if(deltaY !== 0) { 
          let _finalYPosition = _containerData[K_FPY] + deltaY;

          //Limit the final position to the [0, maxScrollY] interval. 
          if(containScroll) {
            const _maxScrollY = uss.getMaxScrollY(container, false, options);
            if(_finalYPosition < 0) _finalYPosition = 0;
            else if(_finalYPosition > _maxScrollY) _finalYPosition = _maxScrollY;
          }

          const _remaningScrollAmount = (_finalYPosition - _currentYPosition) * _containerData[K_SDY];
          
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
          
          const _totalScrollAmount = _containerData[K_TSAY] * _containerData[K_SDY] + deltaY; 
          _containerData[K_FPY] = _finalYPosition;                             //finalYPosition
          _containerData[K_SDY] = _totalScrollAmount > 0 ? 1 : -1;             //direction
          _containerData[K_TSAY] = _totalScrollAmount * _containerData[K_SDY]; //totalScrollAmount (always positive)
        }
        _containerData[K_OTSY] = NO_VAL;  //originalTimestamp
        _containerData[K_CBY] = callback; //callback
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
      const _containerData = uss._containersData.get(container) || [];
      if(!_initPhase && _containerData[K_CBY] !== _scrollYCallback) callback();
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the x-axis has finished too or it has been altered.
    const _scrollYCallback = () => {
      const _containerData = uss._containersData.get(container) || [];
      if(!_initPhase && _containerData[K_CBX] !== _scrollXCallback) callback();
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

    let _initPhase = true;

    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the y-axis has finished too or it has been altered.
    const _scrollXCallback = () => {
      const _containerData = uss._containersData.get(container) || [];
      if(!_initPhase && _containerData[K_CBY] !== _scrollYCallback) callback();
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the x-axis has finished too or it has been altered.
    const _scrollYCallback = () => {
      const _containerData = uss._containersData.get(container) || [];
      if(!_initPhase && _containerData[K_CBX] !== _scrollXCallback) callback();
    }

    uss.scrollXBy(deltaX, container, _scrollXCallback, stillStart, containScroll, options);
    _initPhase = false;
    uss.scrollYBy(deltaY, container, _scrollYCallback, stillStart, containScroll, options);
  },
  scrollIntoView: (element, alignToLeft = true, alignToTop = true, callback, includeHiddenParents = false, options = {debugString: "scrollIntoView"}) => {
    let _containerIndex = -1;
    const _containers = uss.getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++, options);
    
    //The element cannot be scrolled into view.
    if(_containerIndex < 0) { 
      if(typeof callback === "function") callback();
      return;
    }

    const _alignToNearestX = REGEX_ALIGNMENT_NEAREST.test(alignToLeft);
    const _alignToNearestY = REGEX_ALIGNMENT_NEAREST.test(alignToTop);

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

    function _scrollContainer() {
      //_scrollbarsDimensions[0] = vertical scrollbar's width
      //_scrollbarsDimensions[1] = horizontal scrollbar's height
      const _scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer, false, options);

      //_bordersDimensions[0] = top border size
      //_bordersDimensions[1] = right border size
      //_bordersDimensions[2] = bottom border size
      //_bordersDimensions[3] = left border size
      const _bordersDimensions = uss.calcBordersDimensions(_currentContainer, false, options);  

      //Current element position relative to the current container.
      const {top, right, bottom, left} = _currentElement.getBoundingClientRect();
      const _elementPosition = {top, right, bottom, left};

      if(_currentContainer === window) {
        _elementPosition.right -= uss._windowWidth;
        _elementPosition.bottom -= uss._windowHeight;
      } else {
        const _containerRect = _currentContainer.getBoundingClientRect();

        _elementPosition.top -= _containerRect.top;
        _elementPosition.right -= _containerRect.right;
        _elementPosition.bottom -= _containerRect.bottom;
        _elementPosition.left -= _containerRect.left;
      }

      const _topDelta = _elementPosition.top - _bordersDimensions[0];
      const _rightDelta = _elementPosition.right + _bordersDimensions[1] + _scrollbarsDimensions[0];
      const _bottomDelta = _elementPosition.bottom + _bordersDimensions[2] + _scrollbarsDimensions[1];
      const _leftDelta = _elementPosition.left - _bordersDimensions[3];
      const _centerDeltaX = (_leftDelta + _rightDelta) * 0.5;  
      const _centerDeltaY = (_topDelta + _bottomDelta) * 0.5;  

      //Align to nearest is an indirect way to say: align to top/bottom/center.
      if(_alignToNearestX) {
        _alignToLeft = Math.abs(_leftDelta)  < Math.abs(_centerDeltaX) ? true : 
                       Math.abs(_rightDelta) < Math.abs(_centerDeltaX) ? false : NO_VAL;
      }

      if(_alignToNearestY) {
        _alignToTop = Math.abs(_topDelta)    < Math.abs(_centerDeltaY) ? true : 
                      Math.abs(_bottomDelta) < Math.abs(_centerDeltaY) ? false : NO_VAL;
      }

      let _deltaX = _alignToLeft === true  ? _leftDelta :
                    _alignToLeft === false ? _rightDelta :
                                             _centerDeltaX;
      let _deltaY = _alignToTop === true  ? _topDelta :
                    _alignToTop === false ? _bottomDelta :
                                            _centerDeltaY;

      _deltaX = _deltaX > 0 ? Math.round(_deltaX) : Math.floor(_deltaX);
      _deltaY = _deltaY > 0 ? Math.round(_deltaY) : Math.floor(_deltaY);

      const _shouldScrollX = _deltaX !== 0 && uss.getMaxScrollX(_currentContainer, false, options) >= 1;
      const _shouldScrollY = _deltaY !== 0 && uss.getMaxScrollY(_currentContainer, false, options) >= 1;

      if(_shouldScrollX && _shouldScrollY) uss.scrollBy(_deltaX, _deltaY, _currentContainer, _callback, true, true, options);
      else if(_shouldScrollX) uss.scrollXBy(_deltaX, _currentContainer, _callback, true, true, options);
      else if(_shouldScrollY) uss.scrollYBy(_deltaY, _currentContainer, _callback, true, true, options);
      else _callback();
    }
  },
  scrollIntoViewIfNeeded: (element, alignToCenter = true, callback, includeHiddenParents = false, options = {debugString: "scrollIntoViewIfNeeded"}) => {
    let _containerIndex = -1;
    const _containers = uss.getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++, options);
    
    //The element cannot be scrolled into view.
    if(_containerIndex < 0) { 
      if(typeof callback === "function") callback();
      return;
    }

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

    function _scrollContainer() {
      //_scrollbarsDimensions[0] = vertical scrollbar's width
      //_scrollbarsDimensions[1] = horizontal scrollbar's height
      const _scrollbarsDimensions = uss.calcScrollbarsDimensions(_currentContainer, false, options);

      //_bordersDimensions[0] = top border size
      //_bordersDimensions[1] = right border size
      //_bordersDimensions[2] = bottom border size
      //_bordersDimensions[3] = left border size
      const _bordersDimensions = uss.calcBordersDimensions(_currentContainer, false, options);  

      //Current element position relative to the current container.
      const {top, right, bottom, left} = _currentElement.getBoundingClientRect();
      const _elementPosition = {top, right, bottom, left};

      if(_currentContainer === window) {
        _elementPosition.right -= uss._windowWidth;
        _elementPosition.bottom -= uss._windowHeight;
      } else {
        const _containerRect = _currentContainer.getBoundingClientRect();

        _elementPosition.top -= _containerRect.top;
        _elementPosition.right -= _containerRect.right;
        _elementPosition.bottom -= _containerRect.bottom;
        _elementPosition.left -= _containerRect.left;
      }

      const _topDelta = _elementPosition.top - _bordersDimensions[0];
      const _rightDelta = _elementPosition.right + _bordersDimensions[1] + _scrollbarsDimensions[0];
      const _bottomDelta = _elementPosition.bottom + _bordersDimensions[2] + _scrollbarsDimensions[1];
      const _leftDelta = _elementPosition.left - _bordersDimensions[3];
      const _centerDeltaX = (_leftDelta + _rightDelta) * 0.5;  
      const _centerDeltaY = (_topDelta + _bottomDelta) * 0.5;  

      //Check if the current element is already visible 
      //or if it's bigger than it's parent.
      const _isOriginalElement = _currentElement === element;
      const _isIntoViewX = _leftDelta > -0.5 && _rightDelta < 0.5;
      const _isIntoViewY = _topDelta > -0.5 && _bottomDelta < 0.5;
      const _overflowsX = _leftDelta <= 0 && _rightDelta >= 0;
      const _overflowsY = _topDelta <= 0 && _bottomDelta >= 0;

      let _shouldScrollX = (_isOriginalElement && (alignToCenter || (!_isIntoViewX && !_overflowsX))) ||
                           (!_isOriginalElement && !_isIntoViewX);

      let _shouldScrollY = (_isOriginalElement && (alignToCenter || (!_isIntoViewY && !_overflowsY))) ||
                           (!_isOriginalElement && !_isIntoViewY);

      if(!_shouldScrollX && !_shouldScrollY) {
        _callback();
        return;
      }

      //Possible alignments for the original element: center or nearest.
      //Possible alignments for every other container: nearest.
      if(_isOriginalElement && alignToCenter) {
        _alignToLeft = NO_VAL;
        _alignToTop = NO_VAL;
      } else {
        if(_shouldScrollX) {
          _alignToLeft = Math.abs(_leftDelta)  < Math.abs(_centerDeltaX) ? true : 
                         Math.abs(_rightDelta) < Math.abs(_centerDeltaX) ? false : NO_VAL;
        }

        if(_shouldScrollY) {
          _alignToTop = Math.abs(_topDelta)    < Math.abs(_centerDeltaY) ? true : 
                        Math.abs(_bottomDelta) < Math.abs(_centerDeltaY) ? false : NO_VAL;
        }
      }

      let _deltaX = !_shouldScrollX ? 0 :
                    _alignToLeft === true  ? _leftDelta :
                    _alignToLeft === false ? _rightDelta :
                                             _centerDeltaX;
      let _deltaY = !_shouldScrollY ? 0 :
                    _alignToTop === true  ? _topDelta :
                    _alignToTop === false ? _bottomDelta :
                                            _centerDeltaY;

      _deltaX = _deltaX > 0 ? Math.round(_deltaX) : Math.floor(_deltaX);
      _deltaY = _deltaY > 0 ? Math.round(_deltaY) : Math.floor(_deltaY);

      _shouldScrollX = _deltaX !== 0 && uss.getMaxScrollX(_currentContainer, false, options) >= 1;
      _shouldScrollY = _deltaY !== 0 && uss.getMaxScrollY(_currentContainer, false, options) >= 1;

      if(_shouldScrollX && _shouldScrollY) uss.scrollBy(_deltaX, _deltaY, _currentContainer, _callback, true, true, options);
      else if(_shouldScrollX) uss.scrollXBy(_deltaX, _currentContainer, _callback, true, true, options);
      else if(_shouldScrollY) uss.scrollYBy(_deltaY, _currentContainer, _callback, true, true, options);
      else _callback();
    }
  },
  stopScrollingX: (container = uss._pageScroller, callback, options = {debugString: "stopScrollingX"}) => {
    const _containerData = uss._containersData.get(container);
    
    if(_containerData) {
      window.cancelAnimationFrame(_containerData[K_IDX]); 
           
      //No scroll-animation on the y-axis is being performed.
      if(_containerData[K_IDY] === NO_VAL) {
        CLEAR_COMMON_DATA(_containerData);
      } else {
        _containerData[K_IDX] = NO_VAL;  //Scroll id on x-axis
        _containerData[K_CBX] = NO_VAL;  //Scroll callback on x-axis  
      }

      _containerData[K_TSCX] = NO_VAL; //Temporary StepLengthCalculator on the x-axis
    } else if(!INIT_CONTAINER_DATA(container)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }

    if(typeof callback === "function") callback();
  },
  stopScrollingY: (container = uss._pageScroller, callback, options = {debugString: "stopScrollingY"}) => {
    const _containerData = uss._containersData.get(container);
    
    if(_containerData) {
      window.cancelAnimationFrame(_containerData[K_IDY]); 
           
      //No scroll-animation on the x-axis is being performed.
      if(_containerData[K_IDX] === NO_VAL) {
        CLEAR_COMMON_DATA(_containerData);
      } else {
        _containerData[K_IDY] = NO_VAL;  //Scroll id on y-axis
        _containerData[K_CBY] = NO_VAL;  //Scroll callback on y-axis  
      }

      _containerData[K_TSCY] = NO_VAL; //Temporary StepLengthCalculator on the y-axis
    } else if(!INIT_CONTAINER_DATA(container)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }

    if(typeof callback === "function") callback();
  },
  stopScrolling: (container = uss._pageScroller, callback, options = {debugString: "stopScrolling"}) => {
    const _containerData = uss._containersData.get(container);
    
    if(_containerData) {
      window.cancelAnimationFrame(_containerData[K_IDX]); 
      window.cancelAnimationFrame(_containerData[K_IDY]); 
           
      CLEAR_COMMON_DATA(_containerData);

      _containerData[K_TSCX] = NO_VAL; //Temporary StepLengthCalculator on the x-axis
      _containerData[K_TSCY] = NO_VAL; //Temporary StepLengthCalculator on the y-axis
    } else if(!INIT_CONTAINER_DATA(container)) {
      uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
      return;
    }

    if(typeof callback === "function") callback();
  },
  stopScrollingAll: (callback) => {
    for(const [_container, _containerData] of uss._containersData.entries()) {
      window.cancelAnimationFrame(_containerData[K_IDX]); 
      window.cancelAnimationFrame(_containerData[K_IDY]); 
          
      CLEAR_COMMON_DATA(_containerData);

      _containerData[K_TSCX] = NO_VAL; //Temporary StepLengthCalculator on the x-axis
      _containerData[K_TSCY] = NO_VAL; //Temporary StepLengthCalculator on the y-axis
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
          if(_init(NO_VAL, uss._pageScroller, event) !== false) {
              uss.scrollTo(0, 0, uss._pageScroller, callback, false, options);
          }
          return;
        } 

        const _elementToReach = document.getElementById(_fragment) || document.querySelector("a[name='" + _fragment + "']");
        if(_elementToReach && _init(NO_VAL, _elementToReach, event) !== false) {
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

function ussInit() {
  //Set the uss._reducedMotion.
  try { //Chrome, Firefox & Safari >= 14
    window.matchMedia("(prefers-reduced-motion)").addEventListener("change", () => {
      uss._reducedMotion = window.matchMedia("(prefers-reduced-motion)").matches;
      uss.stopScrollingAll();
    }, {passive:true});
  } catch(addEventListenerNotSupported) { //Safari < 14
    window.matchMedia("(prefers-reduced-motion)").addListener(() => {
      uss._reducedMotion = window.matchMedia("(prefers-reduced-motion)").matches;
      uss.stopScrollingAll();
    }, {passive:true});
  }

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
}