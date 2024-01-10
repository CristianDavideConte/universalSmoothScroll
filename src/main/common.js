//TODO: perhaps shift K_WDS and K_PGS to 0 and 1
//TODO: import these keys in the cypress tests constants
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
 * Key to get the permanent `StepLengthCalculator` for the scroll animation on the x-axis of a container.
 */
export const K_PSCX = 12;

/**
 * Key to get the permanent `StepLengthCalculator` for the scroll animation on the y-axis of a container.
 */
export const K_PSCY = 13;

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
 * Key to get the element that scrolls a window (its window scroller).
 */
export const K_WDS = 34;

/**
 * Key to get the element that scrolls the container's window document (its page scroller).
 */
export const K_PGS = 35;




/**
 * A constant for indicating that `no valid fragment string` is associated with a container.
 */
export const NO_FGS = null;

/**
 * A constant for indicating that `no scrollable parent` has been found.
 */
export const NO_SP = null;

/**
 * A `placeholder` for a value that hasn't been calculated yet.
 */
export const NO_VAL = undefined;

/**
 * The `window` in which the API has been initialized.
 */
export const THIS_WINDOW = window;

/**
 * The topmost `window` in the `window hierarchy`.
 */
export const TOP_WINDOW = window.top;

/**
 * The initial inner `width` of `THIS_WINDOW`.
 */
export const INITIAL_WINDOW_WIDTH = THIS_WINDOW.innerWidth;

/**
 * The initial inner `height` of `THIS_WINDOW`.
 */
export const INITIAL_WINDOW_HEIGHT = THIS_WINDOW.innerHeight;

/**
 * The `highest scrollLeft / scrollTop` value that can be used by the API before scroll breaks (2^30px).
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
 * It can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_1 = " to be an instance of Element or a window";

/**
 * A string containing part of an error message.
 * It can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_2 = " to be an instance of Element";

/**
 * A string containing part of an error message.
 * It can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_3 = " to be a function";

/**
 * A string containing part of an error message.
 * It can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_4 = " to be a positive number";

/**
 * A string containing part of an error message.
 * It can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_5 = " to be a number";

/**
 * A string containing part of an error message.
 * It can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_6 = " to be an object";

/**
 * A string containing part of an error message.
 * It can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_7 = " to be an array of numbers";

/**
 * A string containing part of an error message.
 * It can be used to build the `options` object for the error logger.   
 */
export const DEFAULT_ERROR_PRIMARY_MSG_8 = " to be a number in [0..1]";

/**
 * A string containing part of a warning message.
 * It can be used to build the `options` object for the warning logger.   
 */
export const DEFAULT_WARNING_PRIMARY_MSG_1 = "is not a valid anchor's destination";

/**
 * A string containing part of a warning message.
 * It can be used to build the `options` object for the warning logger.   
 */
export const DEFAULT_WARNING_PRIMARY_MSG_2 = "is not a valid step length";



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
        const _window = GET_WINDOW_OF(value);
        
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
 * @param {Object} staticOptions The `options` object passed to the calling function (`highest priority` during merge). 
 * @param {String} functionName The calling function's name.
 * @param {Object} runtimeOptions Logging `options` that are known at runtime only (`lowest priority` during merge).
 * @param {number} [runtimeOptions.idx] The index of the message to use (`logOptionsMap.get(functionName)[runtimeOptions.idx]`).
 * @param {Map<String, object>} logOptionsMap A map containing function names and a partial `options` objects.
 * @returns {Object} A valid logging `options` object that can be used with the uss loggers.
 */
export const CREATE_LOG_OPTIONS = (staticOptions, functionName, runtimeOptions, logOptionsMap) => {
    let defaultOptions = logOptionsMap.get(functionName);

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
 * Returns the `window` associated with the passed `container`.
 *  
 * `Note:` no checks are done on `container`.
 * @param {*} container An instance of `Element` or a `window`.
 * @returns Returns the `window` associated with `container`. 
 */
export const GET_WINDOW_OF = (container) => {
    return container.ownerDocument.defaultView;
}

/**
 * Checks whether `value` is a function.
 * @param {*} value The value to check. 
 * @returns {boolean} `true` if `value` is a function, `false` otherwise.
 */
export const IS_FUNCTION = (value) => {
    return typeof value === "function"; 
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
 * Checks whether `value` is a window object.
 * Works with iFrames' windows too.
 * @param {*} value The value to check.
 * @returns `true` if `value` is a window object, `false` otherwise.
 */
export const IS_WINDOW = (value) => {
    if (value === THIS_WINDOW) return true;
    
    /**
     * Inside iFrames the pointer to the window object may be different
     * from the one used in this module, but a window still exists and 
     * it can be retrieved by asking for the value.window.
     */
    try {
        return value === value.window;
    } catch (UnsupportedOperation) {
        return false;
    }
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
        IS_WINDOW(value) ||
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