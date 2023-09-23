//TODO: remove the uss.something calls and import only the needed variables + solve setters for private variables
//TODO: finish comments
//TODO: use backticks (``) instead of quotes ("") for properties names in comments.
import * as uss from "./uss.js";

/**
 * Key to get the scroll id on the x-axis.
 */
export const K_IDX = 0;
/**
 * Key to get the scroll id on the y-axis.
 */  
export const K_IDY = 1;
/**
 * Key to get the final x position of a container.
 */
export const K_FPX = 2; 
/**
 * Key to get the final y position of a container.
 */
export const K_FPY = 3;
/**
 * Key to get the scroll direction on the x-axis of a container.
 */
export const K_SDX = 4;
/**
 * Key to get the scroll direction on the y-axis of a container.
 */
export const K_SDY = 5;
/**
 * Key to get the total scroll amount on the x-axis of a container.
 */
export const K_TSAX = 6;
/**
 * Key to get the total scroll amount on the y-axis of a container.
 */
export const K_TSAY = 7;
/**
 * Key to get the original timestamp of the scroll animation on the x-axis of a container.
 */
export const K_OTSX = 8;
/**
 * Key to get the original timestamp of the scroll animation on the y-axis of a container.
 */
export const K_OTSY = 9;
/**
 * Key to get the callback for the scroll animation on the x-axis of a container.
 */
export const K_CBX = 10;
/**
 * Key to get the callback for the scroll animation on the y-axis of a container.
 */
export const K_CBY = 11;
/**
 * Key to get the fixed StepLengthCalculator for the scroll animation on the x-axis of a container.
 */
export const K_FSCX = 12;
/**
 * Key to get the fixed StepLengthCalculator for the scroll animation on the y-axis of a container.
 */
export const K_FSCY = 13;
/**
 * Key to get the temporary StepLengthCalculator for the scroll animation on the x-axis of a container.
 */
export const K_TSCX = 14;
/**
 * Key to get the temporary StepLengthCalculator for the scroll animation on the y-axis of a container.
 */
export const K_TSCY = 15;
/**
 * Key to get the maxScrollX value of a container.
 */
export const K_MSX = 16;
/**
 * Key to get the maxScrollY value of a container.
 */
export const K_MSY = 17;
/**
 * Key to get the vertical scrollbar's width of a container.
 */
export const K_VSB = 18;
/**
 * Key to get the horizontal scrollbar's height of a container. 
 */
export const K_HSB = 19;
/**
 * Key to get the top border's height of a container.
 */
export const K_TB = 20;
/**
 * Key to get the right border's width of a container.
 */
export const K_RB = 21;
/**
 * Key to get the bottom border's height of a container.
 */
export const K_BB = 22;
/**
 * Key to get the left border's width of a container.
 */
export const K_LB = 23;
/**
 * Key to get the standard scrollable parent on the x-axis (overflow !== `hidden`) of a container.
 */
export const K_SSPX = 24;
/**
 * Key to get the hidden scrollable parent on the x-axis (overflow === `hidden`) of a container.
 */
export const K_HSPX = 25;
/**
 * Key to get the standard scrollable parent on the y-axis (overflow !== `hidden`) of a container.
 */
export const K_SSPY = 26;
/**
 * Key to get the hidden scrollable parent on the y-axis (overflow === `hidden`) of a container.
 */
export const K_HSPY = 27;
/**
 * Key to get the ScrollXCalculator of a container.
 */
export const K_SCX = 28;
/**
 * Key to get the ScrollYCalculator of a container.
 */
export const K_SCY = 29;
/**
 * Key to get the border box of a container.
 */
export const K_BRB = 30;
/**
 * Key to get the resize callbacks queue of a container.
 */
export const K_RCBQ = 31;
/**
 * Key to get the mutation callbacks queue of a container.
 */
export const K_MCBQ = 32;
/**
 * Key to get the fragment string linked to a container.
 */
export const K_FGS = 33;


/**
 * A constant for a value that hasn't been calculated yet.
 */
export const NO_VAL = undefined;
/**
 * A constant for indicating that no scrollable parent has been found.
 */
export const NO_SP = null;
/**
 * A constant for indicating that no valid fragment string is associated with a container.
 */
export const NO_FGS = null;
/**
 * The maximum length of an error/warning message.
 */
export const MAX_MSG_LEN = 40;
/**
 * Index of the _framesTime array.
 * Use it to get the frames' time calculation phase.
 */
export const FRM_TMS_PHASE = -1;
/**
 * Index of the _framesTime array.
 * Use it to get the current frames' time sum.
 */
export const FRM_TMS_SUM = -2;


/**
 * The initial inner width of the window.
 */
export const INITIAL_WINDOW_WIDTH = window.innerWidth;
/**
 * The initial inner height of the window.
 */
export const INITIAL_WINDOW_HEIGHT = window.innerHeight;
/**
 * Default value for the _xStepLength variable.
 * 16px at 412px of window width && 23px at 1920px of window width.
 */
export const DEFAULT_XSTEP_LENGTH = 16 + 7 / 1508 * (INITIAL_WINDOW_WIDTH - 412);
/**
 * Default value for the _yStepLength variable.
 * 38px at 789px of window height && 22px at 1920px of window height.
 */
export const DEFAULT_YSTEP_LENGTH = Math.max(1, Math.abs(38 - 20 / 140 * (INITIAL_WINDOW_HEIGHT - 789)));
/**
 * Default value for the _minAnimationFrame variable.
 * 51 frames at 929px of window height.
 */
export const DEFAULT_MIN_ANIMATION_FRAMES = INITIAL_WINDOW_HEIGHT / DEFAULT_YSTEP_LENGTH;
/**
 * Default value for the _framesTime variable (in ms).
 */
export const DEFAULT_FRAME_TIME = 16.6;
/**
 * The highest scrollLeft/scrollTop value that can be used by the API before scroll breaks (2^30px).
 */
export const HIGHEST_SAFE_SCROLL_POS = 1073741824;
//TODO: To look more into
//const DEFAULT_FRAME_TIME_CALCULATOR = window.requestIdleCallback || window.requestAnimationFrame;


/**
 * The regex used to detect if the uss loggers are disabled.
 */
export const REGEX_LOGGER_DISABLED = /disabled/i;
/**
 * The regex used to detect if the uss loggers are in `legacy` mode.
 */
export const REGEX_LOGGER_LEGACY = /legacy/i;
/**
 * The regex used by the scrollIntoView and scrollIntoView functions 
 * to test if the passed alignments are set to `nearest` mode. 
 */
export const REGEX_ALIGNMENT_NEAREST = /nearest/i;
/**
 * The regex used to test if the `overflow` property of an element
 * is set to either `auto` or `scroll`. 
 */
export const REGEX_OVERFLOW = /(auto|scroll)/;
/**
 * The regex used to test if the `overflow` property of an element
 * is set to either `auto`, `scroll` or `hidden`. 
 */
export const REGEX_OVERFLOW_HIDDEN = /(auto|scroll|hidden)/;
/**
 * The regex used to test if the `overflow` property of an element
 * is set to either `auto`, `scroll` or `visible`. 
 */
export const REGEX_OVERFLOW_WITH_VISIBLE = /(auto|scroll|visible)/;
/**
 * The regex used to test if the `overflow` property of an element
 * is set to either `auto`, `scroll`, `hidden` or `visible`. 
 */
export const REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE = /(auto|scroll|hidden|visible)/;


/**
 * A string containing part of an error message.
 * Can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_1 = "the input to be an Element or the Window";
/**
 * A string containing part of an error message.
 * Can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_2 = "the input to be an Element";
/**
 * A string containing part of an error message.
 * Can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_3 = "the input to be a function";
/**
 * A string containing part of an error message.
 * Can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_4 = "the input to be a positive number";
/**
 * A string containing part of an error message.
 * Can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_5 = "the input to be a number";
/**
 * A string containing part of a warning message.
 * Can be used to build the `options` object for the warning logger.   
 */
export const DEFAULT_WARNING_PRIMARY_MSG_1 = "is not a valid anchor's destination";
/**
 * A string containing part of a warning message.
 * Can be used to build the `options` object for the warning logger.   
 */
export const DEFAULT_WARNING_PRIMARY_MSG_2 = "is not a valid step length";
/**
 * A map containing function names and a partial `options` objects that, 
 * can be used with the uss loggers.
 * Note that these objects (the map entries) are partial and need 
 * to be completed (they only contain known/static log informations). 
 */
export const DEFAULT_LOG_OPTIONS = new Map([
    ["isXScrolling", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["isYScrolling", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["isScrolling", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["getScrollXDirection", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getScrollYDirection", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["getXStepLengthCalculator", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getYStepLengthCalculator", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["setXStepLengthCalculator", [
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 },
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_3 },
    ]],
    ["setYStepLengthCalculator", [
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 },
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_3 },
    ]],
    ["setStepLengthCalculator", [
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 },
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_3 },
    ]],

    ["setXStepLength", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_4 }],
    ["setYStepLength", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_4 }],
    ["setStepLength", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_4 }],

    ["setMinAnimationFrame", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_4 }],
    ["setPageScroller", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["addResizeCallback", [
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 },
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_3 },
    ]],
    ["addMutationCallback", [
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_2 },
        { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_3 },
    ]],

    ["setErrorLogger", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_3 }],
    ["setWarningLogger", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_3 }],

    ["calcScrollbarsDimensions", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["calcBordersDimensions", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["getScrollCalculators", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getBorderBox", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["getXScrollableParent", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getYScrollableParent", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getScrollableParent", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["scrollXTo", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_5 }],
    ["scrollYTo", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_5 }],
    ["scrollXBy", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_5 }],
    ["scrollYBy", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_5 }],

    ["stopScrollingX", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["stopScrollingY", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["stopScrolling", { primaryMsg: DEFAULT_ERROR_PRIMARY_MSG_1 }],
]);


//TODO: use this function everywhere in the uss modules
/**
 * Checks if the passed value is an object.
 * @param {*} value The value to be checked. 
 * @returns True if `value` is an object, false otherwise.
 */
export const IS_OBJECT = (value) => {
    return value !== null &&
        typeof value === "object" &&
        !Array.isArray(value);
}


/**
 * Merges two objects into one.
 * @param {*} obj1 In case of conflicts, this object's properties will have the priority.
 * @param {*} obj2 In case of conflicts, this object's properties won't have the priority.
 * @returns An object with all the properties of `obj1` and `obj2` merged.
 */
export const MERGE_OBJECTS = (obj1, obj2) => {
    return IS_OBJECT(obj1) ? Object.assign({}, obj2, obj1) : obj2;
}


/**
 * Creates a valid `options` object that can be used as the input of the default loggers. 
 * @param {*} options The options object passed to the calling function.
 * @param {*} functionName The calling function's name.
 * @param {*} otherDefaultOptions Non-static default logging options.
 * @returns A valid logging `options` object that can be used with the uss loggers.
 */
export const CREATE_LOG_OPTIONS = (options, functionName, otherDefaultOptions) => {
    let defaultOptions = DEFAULT_LOG_OPTIONS.get(functionName);

    /**
     * Multiple log options can be associated with a single function,
     * choose one specified by the otherDefaultOptions argument. 
     */
    if (Array.isArray(defaultOptions)) {
        defaultOptions = defaultOptions[otherDefaultOptions.idx]
    }

    /**
     * Retrieve the function's default static-logging options and
     * merge them with the non-static ones.
     */
    defaultOptions = MERGE_OBJECTS(
        defaultOptions,
        otherDefaultOptions
    );

    if (defaultOptions.subject == NO_VAL) {
        defaultOptions.subject = functionName;
    }

    return MERGE_OBJECTS(options, defaultOptions);
}


/**
 * Checks whether `element` is instance of the specified class type.
 * Works with iFrames' classes too.
 * @param {*} element The element you want to check, it can be anything.
 * @param {*} classType A js class (e.g. window.Element or simply Element).
 * @returns True if `element` is instance of classType, false otherwise.
 */
export const CHECK_INSTANCEOF = (element, classType = Element) => {
    if (element instanceof classType) return true;

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
    } catch (UnsupportedOperation) {
        return false;
    }
}


/**
 * Creates a uss representation of the passed `value`.
 * @param {*} value The value to be converted into a string.
 * @returns The string representing `value`.
 */
export const TO_STRING = (value) => {
    const _type = typeof value;

    if (
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

    if (_type === "function") {
        const _name = value.name || value;
        return String(_name).replace(new RegExp("\n", "g"), "");
    }

    if (Array.isArray(value)) {
        return "[" + value.toString() + "]";
    }

    //Test if element has a tag, a class or an id.
    try {
        const _id = value.id ? "#" + value.id : "";
        const _className = value.className ? "." + value.className : "";
        return value.tagName.toLowerCase() + _id + _className; //e.g. div#myId.myClass
    } catch (IllegalInvocation) { }

    //Test if element is just some html code.
    try {
        if ("outerHTML" in value) {
            return value.outerHTML.toString().replace(new RegExp("\n", "g"), "");
        }
    } catch (TypeError) { }

    return String(value);
}


/**
 * Invalidates the temporary values of the passed `containerData`.
 * @param {*} containerData An array, one contained by `_containersData`.
 */
export const CLEAR_COMMON_DATA = (containerData) => {
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


/**
 * The default StepLengthCalculator for scroll-animations on the x-axis of every container that doesn't have a custom StepLengthCalculator set.
 * Controls how long each animation-step on the x-axis must be (in px) in order to target the `_minAnimationFrame` property value. 
 * @param {*} remaning The remaning amount of pixels to scroll by the current scroll-animation.
 * @param {*} originalTimestamp The timestamp at which the current scroll-animation started.
 * @param {*} timestamp The current timestamp.
 * @param {*} total The total amount of pixels the current scroll-animation needed to scroll.
 * @param {*} currentPos The scrollLeft/scrollX pixel position of the container.
 * @param {*} finalPos The scrollLeft/scrollX pixel position the container has to reach.
 * @param {*} container An instance of Element or the Window.
 * @returns The amount of pixels to scroll on the x-axis of the container (can be negative, positive or 0px).
 */
export const DEFAULT_XSTEP_LENGTH_CALCULATOR = (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    const _stepLength = total / uss._minAnimationFrame;
    if (_stepLength < 1) return 1;
    if (_stepLength > uss._xStepLength) return uss._xStepLength;
    return _stepLength;
}


/**
 * The default StepLengthCalculator for scroll-animations on the y-axis of every container that doesn't have a custom StepLengthCalculator set.
 * Controls how long each animation-step on the y-axis must be (in px) in order to target the `_minAnimationFrame` property value. 
 * @param {*} remaning The remaning amount of pixels to scroll by the current scroll-animation.
 * @param {*} originalTimestamp The timestamp at which the current scroll-animation started.
 * @param {*} timestamp The current timestamp.
 * @param {*} total The total amount of pixels the current scroll-animation needed to scroll.
 * @param {*} currentPos The scrollTop/scrollY pixel position of the container.
 * @param {*} finalPos The scrollTop/scrollY pixel position the container has to reach.
 * @param {*} container An instance of Element or the Window.
 * @returns The amount of pixels to scroll on the y-axis of the container (can be negative, positive or 0px).
 */
export const DEFAULT_YSTEP_LENGTH_CALCULATOR = (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    const _stepLength = total / uss._minAnimationFrame;
    if (_stepLength < 1) return 1;
    if (_stepLength > uss._yStepLength) return uss._yStepLength;
    return _stepLength;
}


/**
 * The default value for `_errorLogger`.
 * @param {*} options A valid logging options object.
 *            options.subject must be the calling function's name.
 *            options.primaryMsg must be expected value.
 *            options.secondaryMsg must be received value.
 */
export const DEFAULT_ERROR_LOGGER = (options) => {
    const functionName = options.subject;
    const expectedValue = options.primaryMsg;
    let receivedValue = options.secondaryMsg;

    if (REGEX_LOGGER_DISABLED.test(uss._debugMode)) return;

    const _isString = typeof receivedValue === "string";
    if (!_isString) receivedValue = TO_STRING(receivedValue);

    //Trim the received value if needed.
    if (receivedValue.length > MAX_MSG_LEN) {
        receivedValue = receivedValue.slice(0, MAX_MSG_LEN) + " ...";
    }

    //Insert leading and trailing quotes if needed.
    if (_isString) receivedValue = "\"" + receivedValue + "\"";

    if (REGEX_LOGGER_LEGACY.test(uss._debugMode)) {
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


/**
 * The default value for `_warningLogger`.
 * @param {*} options A valid logging options object.
 *            options.subject must be the subject of the warning message.
 *            options.primaryMsg must be the warning message.
 *            options.secondaryMsg isn't used.
 *            options.useSubjectQuotes must be true if the subject should be represented as a quoted string, false otherwise.
 */
export const DEFAULT_WARNING_LOGGER = (options) => {
    let subject = options.subject;
    const message = options.primaryMsg;
    const useSubjectQuotes = options.useSubjectQuotes;

    if (REGEX_LOGGER_DISABLED.test(uss._debugMode)) return;

    const _isString = typeof subject === "string";
    if (!_isString) subject = TO_STRING(subject);

    //Trim the subject if needed.
    if (subject.length > MAX_MSG_LEN) {
        subject = subject.slice(0, MAX_MSG_LEN) + " ...";
    }

    //Insert leading and trailing quotes if needed.
    if (_isString && useSubjectQuotes) subject = "\"" + subject + "\"";

    if (REGEX_LOGGER_LEGACY.test(uss._debugMode)) {
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

