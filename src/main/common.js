//TODO: @ts-check //Use to check for type errors
/**
 * CODE STYLING NOTE:
 * Constans, variables and functions are logically grouped in this file: this helps
 * with organizing code and understanding which variables should be initialized first.
 * The groups are separed by new lines.
 * 
 * New line rules:
 * - 1 newline for entities in the same logical group
 * - 3 newlines between a logical group and another
 */



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
 * Key to get the fixed `StepLengthCalculator` for the scroll animation on the x-axis of a container.
 */
export const K_FSCX = 12;

/**
 * Key to get the fixed `StepLengthCalculator` for the scroll animation on the y-axis of a container.
 */
export const K_FSCY = 13;

/**
 * Key to get the temporary `StepLengthCalculator` for the scroll animation on the x-axis of a container.
 */
export const K_TSCX = 14;

/**
 * Key to get the temporary `StepLengthCalculator` for the scroll animation on the y-axis of a container.
 */
export const K_TSCY = 15;

/**
 * Key to get the `maxScrollX` value of a container.
 */
export const K_MSX = 16;

/**
 * Key to get the `maxScrollY` value of a container.
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
 * Key to get the `ScrollXCalculator` of a container.
 */
export const K_SCX = 28;

/**
 * Key to get the `ScrollYCalculator` of a container.
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
 * A constant for indicating that no valid fragment string is associated with a container.
 */
export const NO_FGS = null;

/**
 * A constant for indicating that no scrollable parent has been found.
 */
export const NO_SP = null;

/**
 * A constant for a value that hasn't been calculated yet.
 */
export const NO_VAL = undefined;



/**
 * Index of the `_framesTime` array.
 * Use it to get the frames' time calculation phase.
 */
export const FRM_TMS_PHASE = -1;

/**
 * Index of the `_framesTime` array.
 * Use it to get the current frames' time sum.
 */
export const FRM_TMS_SUM = -2;

/**
 * The maximum length of an error/warning message.
 */
export const MAX_MSG_LEN = 40;



/**
 * The initial inner width of the `window`.
 */
export const INITIAL_WINDOW_WIDTH = window.innerWidth;

/**
 * The initial inner height of the `window`.
 */
export const INITIAL_WINDOW_HEIGHT = window.innerHeight;

/**
 * The highest `scrollLeft`/`scrollTop` value that can be used by the API before scroll breaks (2^30px).
 */
export const HIGHEST_SAFE_SCROLL_POS = 1073741824;



/**
 * The regex used by the `scrollIntoView` and `scrollIntoViewIfNeeded` functions 
 * to test if the passed alignments are set to `nearest` mode. 
 */
export const REGEX_ALIGNMENT_NEAREST = /nearest/i;

/**
 * The regex used to detect if the uss loggers are disabled.
 */
export const REGEX_LOGGER_DISABLED = /disabled/i;

/**
 * The regex used to detect if the uss loggers are in `legacy` mode.
 */
export const REGEX_LOGGER_LEGACY = /legacy/i;

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
 * is set to either `auto`, `scroll`, `hidden` or `visible`. 
 */
export const REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE = /(auto|scroll|hidden|visible)/;

/**
 * The regex used to test if the `overflow` property of an element
 * is set to either `auto`, `scroll` or `visible`. 
 */
export const REGEX_OVERFLOW_WITH_VISIBLE = /(auto|scroll|visible)/;



/**
 * A string containing part of an error message.
 * Can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_1 = "the input to be an instance of Element or window";

/**
 * A string containing part of an error message.
 * Can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_2 = "the input to be an instance of Element";

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
const DEFAULT_LOG_OPTIONS = new Map([
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



/**
 * Checks whether `value` is instance of the specified class type.
 * Works with iFrames' classes too.
 * @param {*} value The value to check.
 * @param {*} classType A js class (e.g. window.Element or simply Element).
 * @returns {boolean} `true` if `value` is instance of classType, `false` otherwise.
 */
export const CHECK_INSTANCEOF = (value, classType = Element) => {
    if (value instanceof classType) return true;

    /**
     * At this point we're either in an iFrame or value is not instanceof classType.
     * Instances of iFrames' classes are different from the outer window's ones.
     * The instance check is therefore done between the value and the iFrame's classes.
     *  
     * e.g. 
     * window.classType = window.Element
     * window.classType.name = "Element"
     * iFrameWindow[window.classType.name] = iFrameWindow.Element 
     * 
     * window.Element !== iFrameWindow.Element 
     */
    try {
        //Find the window associated with the passed value.
        const _window = value.ownerDocument.defaultView;
        //Check if value is instanceof the iFrame/inner classType.
        return value instanceof _window[classType.name];
    } catch (UnsupportedOperation) {
        return false;
    }
}

/**
 * Invalidates the temporary values of the passed `containerData`.
 * @param {*[]} containerData An array, one contained by `_containersData`.
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
 * Creates a valid `options` object that can be used as the input of the default loggers.
 * This method should be called inside a function, which is referred to as `calling function`. 
 * @param {Object} staticOptions The `options` object passed to the calling function.
 * @param {String} functionName The calling function's name.
 * @param {Object} runtimeOptions Logging options that are known at runtime only.
 * @param {number} [runtimeOptions.idx] The index of the message inside `defaultLogOptionsMap[functionName]` to use.
 * @param {Map<String, object>} [defaultLogOptionsMap] A map containing function names and a partial `options` objects.
 * @returns {Object} A valid logging `options` object that can be used with the uss loggers.
 */
export const CREATE_LOG_OPTIONS = (staticOptions, functionName, runtimeOptions, defaultLogOptionsMap = DEFAULT_LOG_OPTIONS) => {
    let defaultOptions = defaultLogOptionsMap.get(functionName);

    /**
     * Multiple log options can be associated with a single function,
     * choose one specified by the otherDefaultOptions argument. 
     */
    if (Array.isArray(defaultOptions)) {
        defaultOptions = defaultOptions[runtimeOptions.idx]
    }

    /**
     * Retrieve the function's default static-logging options and
     * merge them with the non-static ones.
     */
    defaultOptions = MERGE_OBJECTS(
        defaultOptions,
        runtimeOptions
    );

    if (defaultOptions.subject == NO_VAL) {
        defaultOptions.subject = functionName;
    }

    return MERGE_OBJECTS(staticOptions, defaultOptions);
}

/**
 * Checks whether `value` is an object.
 * @param {*} value The value to check. 
 * @returns {boolean} `true` if `value` is an object, `false` otherwise.
 */
export const IS_OBJECT = (value) => {
    return value !== null &&
        typeof value === "object" &&
        !Array.isArray(value);
}

/**
 * Merges two objects into one.
 * @param {Object} obj1 In case of conflicts, this object's properties will have the priority.
 * @param {Object} obj2 In case of conflicts, this object's properties won't have the priority.
 * @returns {Object} An object with all the properties of `obj1` and `obj2` merged.
 */
export const MERGE_OBJECTS = (obj1, obj2) => {
    return IS_OBJECT(obj1) ? Object.assign({}, obj2, obj1) : obj2;
}

/**
 * Creates a uss-styled string representation of `value`.
 * @param {*} value The value to convert to a string.
 * @returns {String} The string representing `value`.
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