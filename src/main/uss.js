//TODO: fix cypress tests
//TODO: fix the fact that iFrame's body/html elements may not be the same as the script's ones (create a GET_BODY_OF and GET_HTML_OF methods)
//TODO: write missing comments
//TODO: follow the same spacing styling of common.js
//TODO: understand how to specify the default values of functions' parameters (bugged now)
//TODO: order the functions in alphabetical order
//TODO: perhaps unify the MUTATION_OBSERVER.entries and the RESIZE_OBSERVER.entries into a single common list
//TODO: rename "forceCalculation" to "flushCache"
//TODO: add styling comment
//TODO: @ts-check //Use to check for type errors

import {
    IS_POSITIVE,
    IS_POSITIVE_OR_0,
    GET_LINE_FROM_P1_P2,
} from "./math.js"

import {
    K_IDX,
    K_IDY,
    K_FPX,
    K_FPY,
    K_SDX,
    K_SDY,
    K_TSAX,
    K_TSAY,
    K_OTSX,
    K_OTSY,
    K_CBX,
    K_CBY,
    K_PSCX,
    K_PSCY,
    K_TSCX,
    K_TSCY,
    K_MSX,
    K_MSY,
    K_VSB,
    K_HSB,
    K_TB,
    K_RB,
    K_BB,
    K_LB,
    K_SSPX,
    K_HSPX,
    K_SSPY,
    K_HSPY,
    K_SCX,
    K_SCY,
    K_BRB,
    K_RCBQ,
    K_MCBQ,
    K_FGS,
    K_WDS,
    K_PGS,
    NO_SP,
    NO_FGS,
    NO_VAL,
    INITIAL_WINDOW_WIDTH,
    INITIAL_WINDOW_HEIGHT,
    HIGHEST_SAFE_SCROLL_POS,
    THIS_WINDOW,
    TOP_WINDOW,
    REGEX_ALIGNMENT_NEAREST,
    REGEX_LOGGER_DISABLED,
    REGEX_LOGGER_LEGACY,
    REGEX_OVERFLOW,
    REGEX_OVERFLOW_HIDDEN,
    REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE,
    REGEX_OVERFLOW_WITH_VISIBLE,
    DEFAULT_WARNING_PRIMARY_MSG_1,
    DEFAULT_WARNING_PRIMARY_MSG_2,
    CHECK_INSTANCEOF,
    CLEAR_COMMON_DATA,
    CREATE_LOG_OPTIONS,
    GET_WINDOW_OF,
    IS_FUNCTION,
    IS_WINDOW,
    MERGE_OBJECTS,
    DEFAULT_ERROR_PRIMARY_MSG_1,
    DEFAULT_ERROR_PRIMARY_MSG_2,
    DEFAULT_ERROR_PRIMARY_MSG_3,
    DEFAULT_ERROR_PRIMARY_MSG_4,
    DEFAULT_ERROR_PRIMARY_MSG_5,
    TO_STRING,
} from "./common.js"



/**
 * A map containing function names and a partial `options` objects that, 
 * can be used with the uss loggers.
 * Note that these objects (the map entries) are partial and need 
 * to be completed (they only contain known/static log informations). 
 */
const DEFAULT_LOG_OPTIONS = new Map([
    ["isXScrolling", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["isYScrolling", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["isScrolling", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["getScrollXDirection", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getScrollYDirection", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["getXStepLengthCalculator", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getYStepLengthCalculator", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    
    ["getWindowScroller", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getPageScroller", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["setXStepLengthCalculator", [
        { primaryMsg: "newCalculator" + DEFAULT_ERROR_PRIMARY_MSG_3 },
        { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 },
    ]],
    ["setYStepLengthCalculator", [
        { primaryMsg: "newCalculator" + DEFAULT_ERROR_PRIMARY_MSG_3 },
        { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 },
    ]],
    ["setStepLengthCalculator", [
        { primaryMsg: "newCalculator" + DEFAULT_ERROR_PRIMARY_MSG_3 },
        { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 },
    ]],

    ["setXStepLength", { primaryMsg: "newStepLength" + DEFAULT_ERROR_PRIMARY_MSG_4 }],
    ["setYStepLength", { primaryMsg: "newStepLength" + DEFAULT_ERROR_PRIMARY_MSG_4 }],
    ["setStepLength", { primaryMsg: "newStepLength" + DEFAULT_ERROR_PRIMARY_MSG_4 }],

    ["setMinAnimationFrame", { primaryMsg: "newMinAnimationFrame" + DEFAULT_ERROR_PRIMARY_MSG_4 }],

    ["setPageScroller", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["addResizeCallback", [
        { primaryMsg: "newCallback" + DEFAULT_ERROR_PRIMARY_MSG_3 },
        { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 },
    ]],
    ["addMutationCallback", [
        { primaryMsg: "newCallback" + DEFAULT_ERROR_PRIMARY_MSG_3 },
        { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_2 },
    ]],

    ["setErrorLogger", { primaryMsg: "newLogger" + DEFAULT_ERROR_PRIMARY_MSG_3 }],
    ["setWarningLogger", { primaryMsg: "newLogger" + DEFAULT_ERROR_PRIMARY_MSG_3 }],

    ["calcScrollbarsDimensions", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["calcBordersDimensions", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["getScrollCalculators", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getBorderBox", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["getXScrollableParent", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getYScrollableParent", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["getScrollableParent", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],

    ["scrollXTo", { primaryMsg: "finalPosition" + DEFAULT_ERROR_PRIMARY_MSG_5 }],
    ["scrollYTo", { primaryMsg: "finalPosition" + DEFAULT_ERROR_PRIMARY_MSG_5 }],
    ["scrollXBy", { primaryMsg: "delta" + DEFAULT_ERROR_PRIMARY_MSG_5 }],
    ["scrollYBy", { primaryMsg: "delta" + DEFAULT_ERROR_PRIMARY_MSG_5 }],

    ["stopScrollingX", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["stopScrollingY", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
    ["stopScrolling", { primaryMsg: "container" + DEFAULT_ERROR_PRIMARY_MSG_1 }],
]);



/**
 * Default function used to calculate `DEFAULT_XSTEP_LENGTH` and `DEFAULT_YSTEP_LENGTH`.
 */
const GET_DEFAULT_STEP_LENGTH = GET_LINE_FROM_P1_P2(412, 16, 1920, 23)

/**
 * Default value for the `_xStepLength` variable.
 * 
 * 16px at 412px of `INITIAL_WINDOW_WIDTH` and 23px at 1920px of `INITIAL_WINDOW_WIDTH`.
 */
const DEFAULT_XSTEP_LENGTH = GET_DEFAULT_STEP_LENGTH(INITIAL_WINDOW_WIDTH);

/**
 * Default value for the `_yStepLength` variable.
 * 
 * 16px at 412px of `INITIAL_WINDOW_HEIGHT` and 23px at 1920px of `INITIAL_WINDOW_HEIGHT`.
 */
const DEFAULT_YSTEP_LENGTH = GET_DEFAULT_STEP_LENGTH(INITIAL_WINDOW_HEIGHT);

/**
 * Default value for the `_framesTime` variable (in ms).
 */
const DEFAULT_FRAME_TIME = 16.6;

//TODO: To look more into
//TODO: const DEFAULT_FRAME_TIME_CALCULATOR = TOP_WINDOW.requestIdleCallback || TOP_WINDOW.requestAnimationFrame;

/**
 * Default value for the `_minAnimationFrame` variable.
 * 51 frames at 929px of `INITIAL_WINDOW_HEIGHT`.
 */
const DEFAULT_MIN_ANIMATION_FRAMES = INITIAL_WINDOW_HEIGHT / DEFAULT_YSTEP_LENGTH;

/**
 * Index of the `_framesTime` array.
 * Use it to get the frames' time calculation phase.
 */
const FRM_TMS_PHASE = -1;

/**
 * Index of the `_framesTime` array.
 * Use it to get the current frames' time sum.
 */
const FRM_TMS_SUM = -2;

/**
 * The maximum length of an error/warning message.
 */
const MAX_MSG_LEN = 40;

/**
 * The default value for `_errorLogger`.
 * @param {Object} options A valid logging options object.
 * @param {String} options.subject The calling function's name.
 * @param {String} options.primaryMsg The expected value.
 * @param {String} options.secondaryMsg The received value.
 */
const DEFAULT_ERROR_LOGGER = (options) => {
    const functionName = options.subject;
    const expectedValue = options.primaryMsg;
    let receivedValue = options.secondaryMsg;

    if (REGEX_LOGGER_DISABLED.test(_debugMode)) return;

    const _isString = typeof receivedValue === "string";
    if (!_isString) receivedValue = TO_STRING(receivedValue);

    //Trim the received value if needed.
    if (receivedValue.length > MAX_MSG_LEN) {
        receivedValue = receivedValue.slice(0, MAX_MSG_LEN) + " ...";
    }

    //Insert leading and trailing quotes if needed.
    if (_isString) receivedValue = "\"" + receivedValue + "\"";

    if (REGEX_LOGGER_LEGACY.test(_debugMode)) {
        console.log("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)\n");
        console.error("USS ERROR\n", functionName, "was expecting", expectedValue + ", but received", receivedValue + ".");
        throw "USS fatal error (execution stopped)";
    }

    {
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

        {
            console.groupCollapsed("%cStack Trace", "font-family:system-ui; font-weight:500; font-size:17px; background:#3171e0; color:#f5f6f9; border-radius:5px; padding:0.3vh 0.5vw; margin-left:13px");
            console.trace("");
            console.groupEnd();
        }
        console.groupEnd();
    }

    throw "USS fatal error (execution stopped)";
}

/**
 * TODO: write comment
 */
const DEFAULT_MUTATION_OBSERVER = {
    callbackFrameId: NO_VAL,
    debouncedFrames: 0,
    totalDebounceFrames: 16,
    entries: new Map(), //<entry.target, MutationsObject> 
    observer: new MutationObserver((entries, observer) => {
        /** 
         * Each time a mutation event is observed on one of the entries
         * the number of debouced frames is reset.
         */
        DEFAULT_MUTATION_OBSERVER.debouncedFrames = 0;

        //Keep only the most up-to-date entry for each target
        for (const entry of entries) {
            //Update the record for the current entry.type.
            const _mutationObject = DEFAULT_MUTATION_OBSERVER.entries.get(entry.target);

            _mutationObject.hasMutated = true;

            //Update the attributes flag.
            if (!_mutationObject.hasModifiedAttributes) {
                _mutationObject.hasModifiedAttributes = entry.type === "attributes";
            }

            //Update the removed nodes.
            for (const removedNode of entry.removedNodes) {
                _mutationObject.removedNodes.push(removedNode)
            }
        }

        //Schedule the execution of DEFAULT_MUTATION_OBSERVER.callback if needed.
        if (DEFAULT_MUTATION_OBSERVER.callbackFrameId === NO_VAL) {
            DEFAULT_MUTATION_OBSERVER.callbackFrameId = TOP_WINDOW.requestAnimationFrame(DEFAULT_MUTATION_OBSERVER.callback);
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
        if (DEFAULT_MUTATION_OBSERVER.debouncedFrames < DEFAULT_MUTATION_OBSERVER.totalDebounceFrames) {
            DEFAULT_MUTATION_OBSERVER.debouncedFrames++;
            DEFAULT_MUTATION_OBSERVER.callbackFrameId = TOP_WINDOW.requestAnimationFrame(DEFAULT_MUTATION_OBSERVER.callback);
            return;
        }

        for (const [target, mutationObject] of DEFAULT_MUTATION_OBSERVER.entries) {
            if (!mutationObject.hasMutated) continue;

            const _containerData = _containersData.get(target);

            /**
             * External modifications can make _containersData and DEFAULT_MUTATION_OBSERVER.entries
             * inconsistent with each other.
             */
            if (!_containerData) {
                //TODO: whenever this will be supported, add this line.
                //DEFAULT_MUTATION_OBSERVER.observer.unobserve(target);
                continue;
            }

            /**
             * Change the element's frangment string if its href attribute has changed. 
             */
            if (mutationObject.hasModifiedAttributes) {
                const _pageURL = THIS_WINDOW.location.href.split("#")[0]; //location.href = optionalURL#fragment
                const _optionalURL = target.href ? target.href.split("#")[0] : NO_VAL;
                let _fragment = _optionalURL === _pageURL ? target.hash.slice(1) : NO_FGS;

                if (_fragment !== "" && _fragment !== NO_FGS) {
                    //Look for elements with the corresponding id or "name" attribute.
                    const _fragmentElement = document.getElementById(_fragment) ||
                        document.querySelector("a[name='" + _fragment + "']");

                    if (!_fragmentElement) {
                        _warningLogger(
                            {
                                subject: "#" + _fragment,
                                primaryMsg: DEFAULT_WARNING_PRIMARY_MSG_1,
                                useSubjectQuotes: true
                            }
                        );
                        _fragment = NO_FGS;
                    }
                }

                //Cache the fragment for later. 
                _containerData[K_FGS] = _fragment;
            }

            /**
             * Unobserve and remove the containerData 
             * of the nodes that have been removed from the document.
             */
            for (const removedNode of mutationObject.removedNodes) {
                for (const container of _containersData.keys()) {
                    /**
                     * Currently there's no mutation observer method 
                     * to unobserve the removedNode.
                     * Note that: elementX.contains(elementX) === true
                     */
                    if (!IS_WINDOW(container) && removedNode.contains(container)) {
                        DEFAULT_RESIZE_OBSERVER.observer.unobserve(container);
                        DEFAULT_RESIZE_OBSERVER.entries.delete(container);
                        DEFAULT_MUTATION_OBSERVER.entries.delete(container);
                        _containersData.delete(container);
                    }
                }
            }

            //Clear the mutationObject so that it can be reused.
            mutationObject.hasMutated = false;
            mutationObject.removedNodes.length = 0;
            mutationObject.hasModifiedAttributes = false;

            //TODO: decide what to pass as the input of callback: perhaps the container?

            //Execute the mutation callbacks
            for (const callback of _containerData[K_MCBQ]) callback();
        }

        DEFAULT_MUTATION_OBSERVER.callbackFrameId = NO_VAL;
    }
}

/**
 * TODO: write comment
 */
const DEFAULT_RESIZE_OBSERVER = {
    callbackFrameId: NO_VAL,
    debouncedFrames: 0,
    totalDebounceFrames: 16,
    entries: new Map(), //<entry.target, ResizeObject>
    observer: new ResizeObserver((entries) => {
        /**
         * Each time a resize event is observed on one of the entries
         * the number of debouced frames is reset.
         */
        DEFAULT_RESIZE_OBSERVER.debouncedFrames = 0;

        //Keep only the most up-to-date resized-entry for each target.
        for (const entry of entries) {
            const _resizeObject = DEFAULT_RESIZE_OBSERVER.entries.get(entry.target);

            _resizeObject.hasResized = true;

            //Update the target size.
            _resizeObject.width = entry.borderBoxSize[0].inlineSize;
            _resizeObject.height = entry.borderBoxSize[0].blockSize;
        }

        //Schedule the execution of DEFAULT_RESIZE_OBSERVER.callback if needed.
        if (DEFAULT_RESIZE_OBSERVER.callbackFrameId === NO_VAL) {
            DEFAULT_RESIZE_OBSERVER.callbackFrameId = TOP_WINDOW.requestAnimationFrame(DEFAULT_RESIZE_OBSERVER.callback);
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
        if (DEFAULT_RESIZE_OBSERVER.debouncedFrames < DEFAULT_RESIZE_OBSERVER.totalDebounceFrames) {
            DEFAULT_RESIZE_OBSERVER.debouncedFrames++;
            DEFAULT_RESIZE_OBSERVER.callbackFrameId = TOP_WINDOW.requestAnimationFrame(DEFAULT_RESIZE_OBSERVER.callback);
            return;
        }

        //TODO: does it make sense to clear the cache for the scrollable parents on resize?
        for (const [target, resizeObject] of DEFAULT_RESIZE_OBSERVER.entries) {
            if (!resizeObject.hasResized) continue;

            const _containerData = _containersData.get(target);

            /**
             * External modifications can make _containersData and DEFAULT_RESIZE_OBSERVER.entries
             * inconsistent with each other.
             */
            if (!_containerData) {
                DEFAULT_RESIZE_OBSERVER.observer.unobserve(target);
                continue;
            }

            const _newWidth = resizeObject.width;
            const _newHeight = resizeObject.height;

            /**
             * Clear the caches.
             * If the BorderBox has never been calculated, 
             * this is the initialization and there are no caches.
             */
            if (_containerData[K_BRB]) {
                //Horizontal resize.
                if (_containerData[K_BRB].width !== _newWidth) {
                    _containerData[K_MSX] = NO_VAL; //MaxScrollX
                    _containerData[K_VSB] = NO_VAL; //VerticalScrollbar
                    _containerData[K_RB] = NO_VAL;  //RightBorder
                    _containerData[K_LB] = NO_VAL;  //LeftBorder
                }

                //Vertical resize.
                if (_containerData[K_BRB].height !== _newHeight) {
                    _containerData[K_MSY] = NO_VAL; //MaxScrollY
                    _containerData[K_HSB] = NO_VAL; //HorizontalScrollbar
                    _containerData[K_TB] = NO_VAL;  //TopBorder
                    _containerData[K_BB] = NO_VAL;  //BottomBorder
                }
            }

            //BorderBox 
            _containerData[K_BRB] = {
                width: _newWidth,
                height: _newHeight
            }

            //Clear the resizeObject so that it can be reused.
            resizeObject.hasResized = false;

            //TODO: decide what to pass as the input of callback: perhaps the container?

            //Execute the resize callbacks
            for (const callback of _containerData[K_RCBQ]) callback();
        }

        DEFAULT_RESIZE_OBSERVER.callbackFrameId = NO_VAL;
    }
}

/**
 * The default value for `_warningLogger`.
 * @param {Object} options A valid logging options object.
 * @param {String} options.subject The subject of the warning message.
 * @param {String} options.primaryMsg The warning message.
 * @param {String} options.secondaryMsg Ignored, it's there for compatibility.
 * @param {boolean} options.useSubjectQuotes `true` if `subject` should be represented as a quoted string, `false` otherwise.
 */
const DEFAULT_WARNING_LOGGER = (options) => {
    let subject = options.subject;
    const message = options.primaryMsg;
    const useSubjectQuotes = options.useSubjectQuotes;

    if (REGEX_LOGGER_DISABLED.test(_debugMode)) return;

    const _isString = typeof subject === "string";
    if (!_isString) subject = TO_STRING(subject);

    //Trim the subject if needed.
    if (subject.length > MAX_MSG_LEN) {
        subject = subject.slice(0, MAX_MSG_LEN) + " ...";
    }

    //Insert leading and trailing quotes if needed.
    if (_isString && useSubjectQuotes) subject = "\"" + subject + "\"";

    if (REGEX_LOGGER_LEGACY.test(_debugMode)) {
        console.log("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)\n");
        console.warn("USS WARNING\n", subject, message + ".");
        return;
    }

    {
        console.groupCollapsed("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");

        console.log("%cUSS WARNING", "font-family:system-ui; font-weight:800; font-size:40px; background:#fcca03; color:black; border-radius:5px; padding:0.4vh 0.5vw; margin:1vh 0");
        console.log("%c" + subject + "%c" + message,
            "font-style:italic; font-family:system-ui; font-weight:700; font-size:17px; background:#fcca03; color:black; border-radius:5px 0px 0px 5px; padding:0.4vh 0.5vw; margin-left:13px",
            "font-family:system-ui; font-weight:600; font-size:17px; background:#fcca03; color:black; border-radius:0px 5px 5px 0px; padding:0.4vh 0.5vw"
        );
        {
            console.groupCollapsed("%cStack Trace", "font-family:system-ui; font-weight:500; font-size:17px; background:#3171e0; color:#f5f6f9; border-radius:5px; padding:0.3vh 0.5vw; margin-left:13px");
            console.trace("");
            console.groupEnd();
        }
        console.groupEnd();
    }
}

/**
 * The default `StepLengthCalculator` for scroll-animations on the x-axis of every container that doesn't have a custom `StepLengthCalculator` set.
 * Controls how long each animation-step on the x-axis must be (in px) in order to target the `_minAnimationFrame` property value. 
 * @param {number} remaning The remaning amount of pixels to scroll by the current scroll-animation.
 * @param {number} originalTimestamp The timestamp at which the current scroll-animation started.
 * @param {number} timestamp The current timestamp.
 * @param {number} total The total amount of pixels the current scroll-animation needed to scroll.
 * @param {number} currentPos The `scrollLeft`/`scrollX` pixel position of the container.
 * @param {number} finalPos The `scrollLeft`/`scrollX` pixel position the container has to reach.
 * @param {*} container An instance of `Element` or a `window`.
 * @returns {number} The amount of pixels to scroll on the x-axis of the container (can be negative, positive or 0px).
 */
const DEFAULT_XSTEP_LENGTH_CALCULATOR = (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    const _stepLength = total / _minAnimationFrame;
    if (_stepLength < 1) return 1;
    if (_stepLength > _xStepLength) return _xStepLength;
    return _stepLength;
}

/**
 * The default `StepLengthCalculator` for scroll-animations on the y-axis of every container that doesn't have a custom `StepLengthCalculator` set.
 * Controls how long each animation-step on the y-axis must be (in px) in order to target the `_minAnimationFrame` property value. 
 * @param {number} remaning The remaning amount of pixels to scroll by the current scroll-animation.
 * @param {number} originalTimestamp The timestamp at which the current scroll-animation started.
 * @param {number} timestamp The current timestamp.
 * @param {number} total The total amount of pixels the current scroll-animation needed to scroll.
 * @param {number} currentPos The `scrollTop`/`scrollY` pixel position of the container.
 * @param {number} finalPos The `scrollTop`/`scrollY` pixel position the container has to reach.
 * @param {*} container An instance of `Element` or a `window`.
 * @returns {number} The amount of pixels to scroll on the y-axis of the container (can be negative, positive or 0px).
 */
const DEFAULT_YSTEP_LENGTH_CALCULATOR = (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    const _stepLength = total / _minAnimationFrame;
    if (_stepLength < 1) return 1;
    if (_stepLength > _yStepLength) return _yStepLength;
    return _stepLength;
}



/**
 * A Map in which:
 * - The keys are an instances of `Element` or a `window` and they're internally called `containers`.
 * - The values are arrays.
 */
export let _containersData = new Map(); //TODO: perhaps const?

/**
 * If there's no `StepLengthCalculator` set for a container,
 * this represent the number of pixel scrolled during a single scroll-animation's step on the x-axis of that container.
 */
export let _xStepLength = DEFAULT_XSTEP_LENGTH;

/**
 * If there's no `StepLengthCalculator` set for a container,
 * this represent the number of pixel scrolled during a single scroll-animation's step on the y-axis of that container.
 */
export let _yStepLength = DEFAULT_YSTEP_LENGTH;

/**
 * This represents the lowest number of frames any scroll-animation on a container should last
 * if no `StepLengthCalculator` is set for it.
 */
export let _minAnimationFrame = DEFAULT_MIN_ANIMATION_FRAMES;

/**
 * The highest number of pixels that can be occupied by an unmodified scrollbar (it's browser dependent).
 */
export let _scrollbarsMaxDimension = NO_VAL;

/**
 * The time in milliseconds between two consecutive browser's frame repaints (e.g. at 60fps this is 16.6ms). 
 * It's the average of the values of `_framesTimes`.
 */
export let _framesTime = DEFAULT_FRAME_TIME;

/**
 * Contains up to the last `10` calculated frames' times.
 */
export let _framesTimes = []; //TODO: perhaps const?

/**
 * The container that scrolls the `document`.
 * It's also the value used when an API method requires the `container` input parameter but nothing is passed.
 */
export let _pageScroller = NO_VAL;

/**
 * `true` if the user has enabled any `reduce-motion` setting devicewise, `false` otherwise.
 * Internally used by the API to follow the user's accessibility preferences by 
 * reverting back every scroll-animation to the default jump-to-position behavior.
 */
export let _reducedMotion = "matchMedia" in TOP_WINDOW && TOP_WINDOW.matchMedia("(prefers-reduced-motion)").matches;

/**
 * Controls the way the `warning` and `error` messages are logged by the default `warning` and `error` loggers.
 * 
 * If it's set to:
 * - `disabled` (case insensitive) the API `won't show` any warning or error message.
 * - `legacy` (case insensitive) the API `won't style` any warning or error message.
 * 
 * Any other String will make the warning/error messages be displayed with the default API's styling.
 * 
 * A custom `_errorLogger` and/or `_warningLogger` should respect this preference.
 */
export let _debugMode = "";

/**
 * Logs the API `error` messages inside the browser's console.
 */
export let _errorLogger = DEFAULT_ERROR_LOGGER;

/**
 * Logs the API `warning` messages inside the browser's console.
 */
export let _warningLogger = DEFAULT_WARNING_LOGGER;



/**
 * Checks whether `container` is either a `window` of an instance of `Element` and if so:
 * - fills the passed `containerData` with the known informations of `container`
 * - starts to observe the `resize` and `mutation` events of `container` so that the API can react to them
 * @param {*} container The value to check.
 * @param {Array} containerData An array that will be filled with the known informations of `container`.
 * @returns `true` if the initialization was successful, `false` otherwise.
 */
const INIT_CONTAINER_DATA = (container, containerData = []) => {
    if (IS_WINDOW(container)) {
        let _debounceResizeEvent = false;

        container.addEventListener("resize", () => {
            //Make the resize callback fire only once per frame like the resize observer.
            if (_debounceResizeEvent) return;

            _debounceResizeEvent = true;
            TOP_WINDOW.requestAnimationFrame(() => _debounceResizeEvent = false);

            //Emulate what the DEFAULT_RESIZE_OBSERVER does for all the other containers.
            DEFAULT_RESIZE_OBSERVER.debouncedFrames = 0;

            const _resizeObject = DEFAULT_RESIZE_OBSERVER.entries.get(container);

            _resizeObject.hasResized = true;

            //Update the target size.
            _resizeObject.width = container.innerWidth;
            _resizeObject.height = container.innerHeight;

            //Schedule the execution of DEFAULT_RESIZE_OBSERVER.callback if needed.
            if (DEFAULT_RESIZE_OBSERVER.callbackFrameId === NO_VAL) {
                DEFAULT_RESIZE_OBSERVER.callbackFrameId = TOP_WINDOW.requestAnimationFrame(DEFAULT_RESIZE_OBSERVER.callback);
            }
        }, { passive: true });

        //Set a default resizeObject.
        DEFAULT_RESIZE_OBSERVER.entries.set(
            container,
            {
                hasResized: false,
                width: container.innerWidth,
                height: container.innerHeight,
            }
        );

        //A window doesn't have any scrollable parent.
        containerData[K_SSPX] = NO_SP;
        containerData[K_HSPX] = NO_SP;
        containerData[K_SSPY] = NO_SP;
        containerData[K_HSPY] = NO_SP;

        containerData[K_SCX] = () => container.scrollX; //ScrollXCalculator
        containerData[K_SCY] = () => container.scrollY; //ScrollYCalculator
        containerData[K_RCBQ] = []; //Resize callback queue
        //containerData[K_MCBQ] = []; //Mutation callback queue
        _containersData.set(container, containerData);

        return true;
    }

    if (CHECK_INSTANCEOF(container)) {
        try {
            DEFAULT_RESIZE_OBSERVER.observer.observe(container, { box: "border-box" });

            //Set a default resizeObject.
            DEFAULT_RESIZE_OBSERVER.entries.set(
                container,
                {
                    hasResized: false,
                    width: NO_VAL,
                    height: NO_VAL,
                }
            );

            //TODO: if a new API ever allow to watch for a computedStyle change, 
            //TODO: use it for invalidating scrollable parents caches
            DEFAULT_MUTATION_OBSERVER.observer.observe(
                container,
                {
                    attributes: true,
                    attributeFilter: ["href"],

                    //Only the direct children of container are observed.
                    childList: true,
                }
            );

            //Set a default mutationObject.
            DEFAULT_MUTATION_OBSERVER.entries.set(
                container,
                {
                    hasMutated: false,
                    removedNodes: [],
                    hasModifiedAttributes: false,
                }
            );
        } catch (unsupportedByResizeObserver) {
            return false;
        }

        containerData[K_SCX] = () => container.scrollLeft; //ScrollXCalculator
        containerData[K_SCY] = () => container.scrollTop;  //ScrollYCalculator
        containerData[K_RCBQ] = []; //Resize callback queue
        containerData[K_MCBQ] = []; //Mutation callback queue
        _containersData.set(container, containerData);

        return true;
    }

    return false;
}



/**
 * Returns the value of the `_xStepLength` property. 
 * @returns {number} The default number of pixels scrolled during a single scroll-animation's step on the x-axis of any container.
 */
export const getXStepLength = () => _xStepLength;

/**
 * Returns the value of the `_yStepLength` property. 
 * @returns {number} The default number of pixels scrolled during a single scroll-animation's step on the y-axis of any container.
 */
export const getYStepLength = () => _yStepLength;

/**
 * Returns the value of the `_minAnimationFrame` property. 
 * @returns {number} The minimum number of frames any scroll-animation should last by default.
 */
export const getMinAnimationFrame = () => _minAnimationFrame;

/**
 * Returns the value of the `_reducedMotion` property. 
 * @returns {boolean} `true` if the user has enabled any reduce-motion setting devicewise, `false` otherwise.
 */
export const getReducedMotionState = () => _reducedMotion;

/**
 * Returns the value of the `_debugMode` property. 
 * @returns {string} The mode in which the API's error/warning messages operate in. 
 */
export const getDebugMode = () => _debugMode;

/**
 * Checks whether `container` is being scrolled horizontally.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {boolean} `true` if a scroll-animation on the x-axis of `container` is currently being performed, `false` otherwise.
 */
export const isXScrolling = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return !!_containerData[K_IDX];

    if (INIT_CONTAINER_DATA(container)) return false;

    _errorLogger(CREATE_LOG_OPTIONS(options, "isXScrolling", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
}

/**
 * Checks whether `container` is being scrolled vertically.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {boolean} `true` if a scroll-animation on the y-axis of `container` is currently being performed, `false` otherwise.
 */
export const isYScrolling = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return !!_containerData[K_IDY];

    if (INIT_CONTAINER_DATA(container)) return false;

    _errorLogger(CREATE_LOG_OPTIONS(options, "isYScrolling", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
}

/**
 * Checks whether `container` is being scrolled.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {boolean} `true` if a scroll-animation is currently being performed on `container`, `false` otherwise.
 */
export const isScrolling = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return !!(_containerData[K_IDX] || _containerData[K_IDY]);

    if (INIT_CONTAINER_DATA(container)) return false;

    _errorLogger(CREATE_LOG_OPTIONS(options, "isScrolling", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
}

/**
 * Returns the horizontal pixel position `container` has to reach.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number} The target `scrollLeft`/`scrollX` pixel position of `container`.
 */
export const getFinalXPosition = (container = _pageScroller, options) => {
    options = MERGE_OBJECTS(options, { subject: "getFinalXPosition" });

    //If there's no scroll-animation on the x-axis, the current position is returned instead.
    const _containerData = _containersData.get(container) || [];

    if (_containerData[K_FPX] === 0) return 0;

    return _containerData[K_FPX] || getScrollXCalculator(container, options)();
}

/**
 * Returns the vertical pixel position `container` has to reach.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number} The target `scrollTop`/`scrollY` pixel position of `container`.
 */
export const getFinalYPosition = (container = _pageScroller, options) => {
    options = MERGE_OBJECTS(options, { subject: "getFinalYPosition" });

    //If there's no scroll-animation on the y-axis, the current position is returned instead.
    const _containerData = _containersData.get(container) || [];

    if (_containerData[K_FPY] === 0) return 0;

    return _containerData[K_FPY] || getScrollYCalculator(container, options)();
}

/**
 * Returns the direction of the current scroll-animation on the x-axis of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number} `1` if the target `scrollLeft`/`scrollX` is higher than the current one, `-1` it's lower, `0` otherwise.
 */
export const getScrollXDirection = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    //If there's no scroll-animation, 0 is returned.
    if (_containerData) return _containerData[K_SDX] || 0;

    if (INIT_CONTAINER_DATA(container)) return 0;

    _errorLogger(CREATE_LOG_OPTIONS(options, "getScrollXDirection", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
}

/**
 * Returns the direction of the current scroll-animation on the y-axis of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number} `1` if the target `scrollTop`/`scrollY` is higher than the current one, `-1` it's lower, `0` otherwise.
 */
export const getScrollYDirection = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    //If there's no scroll-animation, 0 is returned.
    if (_containerData) return _containerData[K_SDY] || 0;

    if (INIT_CONTAINER_DATA(container)) return 0;

    _errorLogger(CREATE_LOG_OPTIONS(options, "getScrollYDirection", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
}

/**
 * Returns a `StepLengthCalculator` set for the x-axis of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} getTemporary If `true` returns the `temporary` `StepLengthCalculator` set for the x-axis of `container`, otherwise returns the `permanent` one.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {function | undefined} The ease function which currently controls the scroll-animations on the x-axis of `container`.
 */
export const getXStepLengthCalculator = (container = _pageScroller, getTemporary = false, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return getTemporary ? _containerData[K_TSCX] : _containerData[K_PSCX];

    if (INIT_CONTAINER_DATA(container)) return;

    _errorLogger(CREATE_LOG_OPTIONS(options, "getXStepLengthCalculator", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
}

/**
 * Returns a `StepLengthCalculator` set for the y-axis of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} getTemporary If `true` returns the `temporary` `StepLengthCalculator` set for the y-axis of `container`, otherwise returns the `permanent` one.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {function | undefined} The ease function which currently controls the scroll-animations on the y-axis of `container`.
 */
export const getYStepLengthCalculator = (container = _pageScroller, getTemporary = false, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return getTemporary ? _containerData[K_TSCY] : _containerData[K_PSCY];

    if (INIT_CONTAINER_DATA(container)) return;

    _errorLogger(CREATE_LOG_OPTIONS(options, "getYStepLengthCalculator", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
}

/**
 * Returns the value of the `_scrollbarsMaxDimension` property. 
 * @param {boolean} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise it's returned from cache.  
 * @returns {number} The highest number of pixels an unmodified (browser) scrollbar can occupy.
 */
//TODO: perhaps use the `` to avoid going newline?
export const getScrollbarsMaxDimension = (forceCalculation = false) => {
    /**
     * Calculate the biggest possible size of an unmodified scrollbar on the webpage by:
     * - creating a <div> with id = "_uss-scrollbox"
     * - giving that <div> a mini-stylesheet that forces it to show the scrollbars 
     */
    if (forceCalculation || _scrollbarsMaxDimension === NO_VAL) {
        //Create the scrollable box.
        const _document = TOP_WINDOW.document;
        const _scrollBoxStyle = _document.createElement("style");
        const _scrollBox = _document.createElement("div");

        //Create the scrollable box's style.
        _scrollBox.id = "_uss-scrollbox";
        _scrollBoxStyle.appendChild(
            _document.createTextNode(
                "#_uss-scrollbox { display:block; width:100px; height:100px; overflow-x:scroll; border:none; padding:0px; scrollbar-height:auto; }" +
                "#_uss-scrollbox::-webkit-scrollbar { display:block; width:initial; height:initial; }"
            )
        );

        /**
         * Use the difference between the styled and unstyle scrollable box
         * in order to calculate _scrollbarsMaxDimension.
         */
        _document.head.appendChild(_scrollBoxStyle);
        _document.body.appendChild(_scrollBox);
        _scrollbarsMaxDimension = _scrollBox.offsetHeight - _scrollBox.clientHeight;
        _document.body.removeChild(_scrollBox);
        _document.head.removeChild(_scrollBoxStyle);
    }

    return _scrollbarsMaxDimension;
}

/**
 * Returns the `window scroller` relative to the passed container. 
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise it's returned from cache.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {*} The element that scrolls the `container`'s `window` when it's scrolled and that (viceversa) is scrolled when that `window` is scrolled.
 */
//TODO: verify that getWindowScroller is passed the options object if needed
export const getWindowScroller = (container = _pageScroller, forceCalculation = false, options) => {
    let _oldData = _containersData.get(container);
    let _containerData = _oldData || [];

    //Initialize the container if necessary.
    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getWindowScroller", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    //Get the container's window.
    const _window = IS_WINDOW(container) ? container : GET_WINDOW_OF(container);
    _oldData = _containersData.get(_window);
    _containerData = _oldData || [];

    //Initialize container's window if necessary.
    if (!_oldData) INIT_CONTAINER_DATA(_window, _containerData);

    //Calculate the container's window scroller if necessary.
    if (forceCalculation || _containerData[K_WDS] == NO_VAL) {
        const _body = _window.document.body;
        const _html = _window.document.documentElement;

        const _windowInitialX = _window.scrollX;
        const _windowInitialY = _window.scrollY;
        const _elementsToTest = [];
        let _elementsIndex = 0;

        if (
            _html.scrollLeft === _windowInitialX &&
            _html.scrollTop === _windowInitialY
        ) {
            _elementsToTest[_elementsIndex] = _html;
            _elementsIndex++;
        }

        if (
            _body.scrollLeft === _windowInitialX &&
            _body.scrollTop === _windowInitialY
        ) {
            _elementsToTest[_elementsIndex] = _body;
            _elementsIndex++;
        }

        //Neither _html nor _body have the same scrollPosition of _window.
        if (_elementsIndex === 0) {
            _containerData[K_WDS] = _window;
            return _window;
        }

        let _maxScrollX = _containerData[K_MSX] !== NO_VAL ? _containerData[K_MSX] : HIGHEST_SAFE_SCROLL_POS;
        let _maxScrollY = _containerData[K_MSY] !== NO_VAL ? _containerData[K_MSY] : HIGHEST_SAFE_SCROLL_POS;

        if (
            (_maxScrollX > 0 && _windowInitialX !== _maxScrollX) ||
            (_maxScrollY > 0 && _windowInitialY !== _maxScrollY)
        ) {
            //Try scrolling the body/html by scrolling _window.
            _window.scroll(HIGHEST_SAFE_SCROLL_POS, HIGHEST_SAFE_SCROLL_POS);

            _maxScrollX = _window.scrollX;
            _maxScrollY = _window.scrollY;

            //Cache the maxScrollX/maxScrollY.
            _containerData[K_MSX] = _maxScrollX;
            _containerData[K_MSY] = _maxScrollY;
        }

        //_window cannot scroll.
        if (_maxScrollX === 0 && _maxScrollY === 0) {
            _containerData[K_WDS] = _window;
            return _window;
        }

        //_window was already at its maxScrollX/maxScrollY.
        if (_windowInitialX === _maxScrollX && _windowInitialY === _maxScrollY) {
            //Try scrolling the body/html by scrolling _window.
            _window.scroll(0, 0);
        }

        let _windowScrollerFound = false;
        for (const element of _elementsToTest) {
            if (
                _window.scrollX === element.scrollLeft &&
                _window.scrollY === element.scrollTop
            ) {
                //Cache the maxScrollX/maxScrollY.
                const _elementOldData = _containersData.get(element);
                const _elementData = _elementOldData || [];
                _elementData[K_MSX] = _maxScrollX;
                _elementData[K_MSY] = _maxScrollY;

                if (!_elementOldData) INIT_CONTAINER_DATA(element, _elementData);

                _containerData[K_WDS] = element;
                _windowScrollerFound = true;
                break;
            }
        }

        /**
         * Scroll _window back to its initial position.
         * Note that if _window scrolls any other element, 
         * the latter will be scrolled back into place too.
         * Otherwise it was already in the correct scroll position 
         * because the tests didn't affect it. 
         */
        _window.scroll(_windowInitialX, _windowInitialY);

        //Fallback to _window.
        if (!_windowScrollerFound) _containerData[K_WDS] = _window;
    }

    return _containerData[K_WDS];
}

/**
 * Returns the `page scroller` relative to the passed container.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise it's returned from cache.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {*} The element that also scrolls the `container`'s `window` document.
 */
export const getPageScroller = (container = _pageScroller, forceCalculation = false, options) => {
    let _oldData = _containersData.get(container);
    let _containerData = _oldData || [];

    options = CREATE_LOG_OPTIONS(
        options,
        "getPageScroller",
        { secondaryMsg: container },
        DEFAULT_LOG_OPTIONS
    );

    //Initialize the container if necessary.
    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(options);
        return;
    }

    //Get the container's window.
    const _window = IS_WINDOW(container) ? container : GET_WINDOW_OF(container);
    _oldData = _containersData.get(_window);
    _containerData = _oldData || [];

    //Initialize container's window if necessary.
    if (!_oldData) INIT_CONTAINER_DATA(_window, _containerData);

    //Calculate the container's page scroller if necessary.
    if (forceCalculation || _containerData[K_PGS] == NO_VAL) {
        const _body = _window.document.body;
        const _html = _window.document.documentElement;

        const [_htmlMaxScrollX, _htmlMaxScrollY] = getMaxScrolls(_html, forceCalculation, options);
        const [_bodyMaxScrollX, _bodyMaxScrollY] = getMaxScrolls(_body, forceCalculation, options);

        /**
         * The _pageScroller is the element that scrolls the further between _html and _body.
         * If there's a tie or neither of those can scroll, it's defaulted to `window`.
         */
        if (
            (_htmlMaxScrollX > _bodyMaxScrollX && _htmlMaxScrollY >= _bodyMaxScrollY) ||
            (_htmlMaxScrollX >= _bodyMaxScrollX && _htmlMaxScrollY > _bodyMaxScrollY)
        ) {
            _containerData[K_PGS] = _html;
        } else if (
            (_bodyMaxScrollX > _htmlMaxScrollX && _bodyMaxScrollY >= _htmlMaxScrollY) ||
            (_bodyMaxScrollX >= _htmlMaxScrollX && _bodyMaxScrollY > _htmlMaxScrollY)
        ) {
            _containerData[K_PGS] = _body;
        } else {
            _containerData[K_PGS] = window;
        }
        
        //Save the page scroller of THIS_WINDOW for quicker use later on.
        if (_window == THIS_WINDOW) {
            _pageScroller = _containerData[K_PGS];
        }
    }

    return _containerData[K_PGS];
}

/**
 * Returns the value of the `_framesTime` property.
 * @param {boolean} [forceCalculation] If `true`, `calcFramesTimes` is internally called to initialize a new frames' time calculation, otherwise just acts as a getter.
 * @param {function} [callback] A callback function passed to `calcFramesTimes` if `forceCalculation` is `true` (deferred execution), otherwise immediately executed.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number} The time (in ms) between two consecutive browser's frame repaints (e.g. 16.6 at 60fps).
 */
export const getFramesTime = (forceCalculation = false, callback, options) => {
    options = MERGE_OBJECTS(options, { subject: "getFramesTime", requestPhase: 0 });

    if (forceCalculation) calcFramesTimes(NO_VAL, NO_VAL, callback, options);
    else if (IS_FUNCTION(callback)) callback();
    return _framesTime;
}

/**
 * Sets (or unsets if specified) the `StepLengthCalculator` for the x-axis of `container`.
 * @param {function} [newCalculator] A `StepLengthCalculator` or `undefined`. 
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} isTemporary If true `newCalculator` will be set as a temporary `StepLengthCalculator` of `container`, otherwise it will be set a `permanent` one.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setXStepLengthCalculator = (newCalculator, container = _pageScroller, isTemporary = false, options) => {
    const _isSettingOp = newCalculator !== undefined;
    if (!IS_FUNCTION(newCalculator) && _isSettingOp) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setXStepLengthCalculator", { secondaryMsg: newCalculator, idx: 0 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setXStepLengthCalculator", { secondaryMsg: newCalculator, idx: 1 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (isTemporary) {
        _containerData[K_TSCX] = newCalculator;
    } else {
        _containerData[K_PSCX] = newCalculator;

        //Setting a permanent StepLengthCalculator will unset the temporary one.
        if (_isSettingOp) _containerData[K_TSCX] = NO_VAL;
    }
}

/**
 * Sets (or unsets if specified) the `StepLengthCalculator` for the y-axis of `container`.
 * @param {function} [newCalculator] A `StepLengthCalculator` or `undefined`. 
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} isTemporary If true `newCalculator` will be set as a temporary `StepLengthCalculator` of `container`, otherwise it will be set a `permanent` one.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setYStepLengthCalculator = (newCalculator, container = _pageScroller, isTemporary = false, options) => {
    const _isSettingOp = newCalculator !== undefined;
    if (!IS_FUNCTION(newCalculator) && _isSettingOp) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setYStepLengthCalculator", { secondaryMsg: newCalculator, idx: 0 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setYStepLengthCalculator", { secondaryMsg: newCalculator, idx: 1 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (isTemporary) {
        _containerData[K_TSCY] = newCalculator;
    } else {
        _containerData[K_PSCY] = newCalculator;

        //Setting a permanent StepLengthCalculator will unset the temporary one.
        if (_isSettingOp) _containerData[K_TSCY] = NO_VAL;
    }
}

/**
 * Sets (or unsets if specified) the `StepLengthCalculator` for the both axes of `container`.
 * @param {function} [newCalculator] A `StepLengthCalculator` or `undefined`. 
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} isTemporary If true `newCalculator` will be set as a temporary `StepLengthCalculator` of `container`, otherwise it will be set a `permanent` one.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setStepLengthCalculator = (newCalculator, container = _pageScroller, isTemporary = false, options) => {
    const _isSettingOp = newCalculator !== undefined;
    if (!IS_FUNCTION(newCalculator) && _isSettingOp) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setStepLengthCalculator", { secondaryMsg: newCalculator, idx: 0 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setStepLengthCalculator", { secondaryMsg: newCalculator, idx: 1 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (isTemporary) {
        _containerData[K_TSCX] = newCalculator;
        _containerData[K_TSCY] = newCalculator;
    } else {
        _containerData[K_PSCX] = newCalculator;
        _containerData[K_PSCY] = newCalculator;

        //Setting a permanent StepLengthCalculator will unset the temporary one.
        if (_isSettingOp) {
            _containerData[K_TSCX] = NO_VAL;
            _containerData[K_TSCY] = NO_VAL;
        }
    }
}

/**
 * Sets (or unsets if specified) the default number of pixels scrolled during a single scroll-animation's step (`_xStepLength` property) on the x-axis of all containers. 
 * @param {number} newStepLength A finite `Number` > 0.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setXStepLength = (newStepLength = DEFAULT_XSTEP_LENGTH, options) => {
    if (!IS_POSITIVE(newStepLength)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setXStepLength", { secondaryMsg: newStepLength }, DEFAULT_LOG_OPTIONS));
        return;
    }
    _xStepLength = newStepLength;
}


/**
 * Sets (or unsets if specified) the default number of pixels scrolled during a single scroll-animation's step (`_yStepLength` property) on the y-axis of all containers. 
 * @param {number} newStepLength A finite `Number` > 0.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setYStepLength = (newStepLength = DEFAULT_YSTEP_LENGTH, options) => {
    if (!IS_POSITIVE(newStepLength)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setYStepLength", { secondaryMsg: newStepLength }, DEFAULT_LOG_OPTIONS));
        return;
    }
    _yStepLength = newStepLength;
}

/**
 * Sets the default number of pixels scrolled during a single scroll-animation's step (`_xStepLength` and `_yStepLength` properties) on any axis of all containers. 
 * @param {number} newStepLength A finite `Number` > 0.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setStepLength = (newStepLength, options) => {
    if (!IS_POSITIVE(newStepLength)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setStepLength", { secondaryMsg: newStepLength }, DEFAULT_LOG_OPTIONS));
        return;
    }
    _xStepLength = newStepLength;
    _yStepLength = newStepLength;
}

/**
 * Sets (or unsets if requested) the minimum number of frames any scroll-animation should last by default (`_minAnimationFrame` property).
 * @param {number} newMinAnimationFrame A finite `Number` > 0.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setMinAnimationFrame = (newMinAnimationFrame = DEFAULT_MIN_ANIMATION_FRAMES, options) => {
    if (!IS_POSITIVE(newMinAnimationFrame)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setMinAnimationFrame", { secondaryMsg: newMinAnimationFrame }, DEFAULT_LOG_OPTIONS));
        return;
    }
    _minAnimationFrame = newMinAnimationFrame;
}

/**
 * Tells the API which `Element` scrolls the `container`'s document (i.e. its `pageScroller`). 
 * @param {*} container An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setPageScroller = (container, options) => {
    let _containerData = _containersData.get(container);

    //Initialize the container if necessary.
    if (!_containerData && !INIT_CONTAINER_DATA(container)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setPageScroller", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }
    
    //Get the container's window.
    const _window = IS_WINDOW(container) ? container : GET_WINDOW_OF(container);
    const _oldData = _containersData.get(_window);
    _containerData = _containerData || [];

    //Initialize the container's window if necessary.
    if (!_oldData) INIT_CONTAINER_DATA(_window, _containerData);
    
    _containerData[K_PGS] = container;

    if (_window == THIS_WINDOW) {
        _pageScroller = container;        
    }
}

/**
 * Adds a callback function to the resize callback queue of `container`.
 * @param {function} newCallback A function that will be invoked when `container` is resized.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
//TODO: add cypress tests
export const addResizeCallback = (newCallback, container = _pageScroller, options) => {
    if (!IS_FUNCTION(newCallback)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "addResizeCallback", { secondaryMsg: newCallback, idx: 0 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "addResizeCallback", { secondaryMsg: newCallback, idx: 1 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    _containerData[K_RCBQ].push(newCallback);
}

/**
 * Adds a callback function to the mutation callback queue of `container`.
 * @param {function} newCallback A function that will be invoked when `container` is mutated.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
//TODO: add cypress tests
export const addMutationCallback = (newCallback, container = _pageScroller, options) => {
    if (!IS_FUNCTION(newCallback)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "addMutationCallback", { secondaryMsg: newCallback, idx: 0 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (IS_WINDOW(container) || (!_oldData && !INIT_CONTAINER_DATA(container, _containerData))) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "addMutationCallback", { secondaryMsg: newCallback, idx: 1 }, DEFAULT_LOG_OPTIONS));
        return;
    }

    _containerData[K_MCBQ].push(newCallback);
}

/**
 * Tells the API which mode should the error/warning messages operate in (`_debugMode` property).
 * @param {string} [newDebugMode] A **case insensitive** string between:
 * - `legacy` for unstyled API messages
 * - `disabled` to completely disable any API message
 * - Any other string for styled API messages **(default)**
 */
//TODO: perhaps use the errorLogger + options instead
export const setDebugMode = (newDebugMode = "") => {
    if (typeof newDebugMode === "string") {
        _debugMode = newDebugMode;
        return;
    }

    console.error(
        "USS ERROR\n",
        "setDebugMode",
        "was expecting the newDebugMode to be \"disabled\", \"legacy\" or any other string, but received", newDebugMode + "."
    );
}

/**
 * Sets the function that will be invoked when the API generates an error (`_errorLogger` property)
 * @param {function} [newLogger] A function which will be passed a single argument that contains the log informations: the `options` object.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setErrorLogger = (newLogger = DEFAULT_ERROR_LOGGER, options) => {
    if (!IS_FUNCTION(newLogger)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setErrorLogger", { secondaryMsg: newLogger }, DEFAULT_LOG_OPTIONS));
        return;
    }
    _errorLogger = newLogger;
}

/**
 * Sets the function that will be invoked when the API generates a warning (`_warningLogger` property)
 * @param {function} [newLogger] A function which will be passed a single argument that contains the log informations: the `options` object.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const setWarningLogger = (newLogger = DEFAULT_WARNING_LOGGER, options) => {
    if (!IS_FUNCTION(newLogger)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setWarningLogger", { secondaryMsg: newLogger }, DEFAULT_LOG_OPTIONS));
        return;
    }
    _warningLogger = newLogger;
}

/**
 * Requests a new frames' time measurement and asynchronously inserts the result into the `_framesTimes` array. 
 * When the calculation is finished, the `_framesTime` property will be updated accordingly.
 * @param {number} [previousTimestamp] The timestamp relative to the previous browser repaint.
 * @param {number} [currentTimestamp] The timestamp relative to the current browser repaint.
 * @param {function} [callback] A function which is invoked when the requested frames' time measurement has been performed.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const calcFramesTimes = (previousTimestamp, currentTimestamp, callback, options) => {
    options = MERGE_OBJECTS(options, { subject: "calcFramesTimes", requestPhase: 0 });

    /**
     * _framesTime[FRM_TMS_PHASE] contains the status of the previous requested frames' time recalculation.
     * options.requestPhase contains the status of the current requested frames' time recalculation.
     * If they don't match, a frames's time recalculation has already been requested but the previous
     * one hasn't been completed yet.
     */
    if (_framesTimes[FRM_TMS_PHASE] && _framesTimes[FRM_TMS_PHASE] !== options.requestPhase) return;

    if (!IS_POSITIVE_OR_0(previousTimestamp)) {
        options.requestPhase = 1;
        _framesTimes[FRM_TMS_PHASE] = 1;
        TOP_WINDOW.requestAnimationFrame((timestamp) => calcFramesTimes(timestamp, currentTimestamp, callback, options));
        return;
    }

    if (!IS_POSITIVE_OR_0(currentTimestamp)) {
        options.requestPhase = 2;
        _framesTimes[FRM_TMS_PHASE] = 2;
        TOP_WINDOW.requestAnimationFrame((timestamp) => calcFramesTimes(previousTimestamp, timestamp, callback, options));
        return;
    }

    /**
     * New frame time measurement.
     * Note that elements at negative indexes will not be taken into account by:
     * - for loops
     * - array.length
     * - array.unshift
     */
    const _newFrameTime = currentTimestamp - previousTimestamp;
    _framesTimes[FRM_TMS_PHASE] = 0;
    _framesTimes[FRM_TMS_SUM] = (_framesTimes[-2] || 0) + _newFrameTime; //Sum of all frames' time

    // Insert the new frame time into _framesTimes.
    _framesTimes.unshift(_newFrameTime);
    if (_framesTimes.length > 10) {
        _framesTimes[FRM_TMS_SUM] -= _framesTimes.pop();
    }

    _framesTime = _framesTimes[FRM_TMS_SUM] / _framesTimes.length;

    if (IS_FUNCTION(callback)) callback();
}

/**
 * Returns the size of the vertical scrollbar of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise it's returned from cache.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number} The width of the vertical scrollbar of `container`.
 */
export const calcXScrollbarDimension = (container = _pageScroller, forceCalculation = false, options) => {
    return calcScrollbarsDimensions(container, forceCalculation, MERGE_OBJECTS(options, { subject: "calcXScrollbarDimension" }))[0];
}

/**
 * Returns the size of the horizontal scrollbar of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise it's returned from cache.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number} The height of the horizontal scrollbar of `container`.
 */
export const calcYScrollbarDimension = (container = _pageScroller, forceCalculation = false, options) => {
    return calcScrollbarsDimensions(container, forceCalculation, MERGE_OBJECTS(options, { subject: "calcYScrollbarDimension" }))[1];
}

/**
 * Returns an array containing the size of the 2 scrollbars of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} forceCalculation If `true` the values are calculated on the fly (expensive operation), otherwise they're returned from cache.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number[]} An array containing: 
 * - The width of the vertical scrollbar of `container`
 * - The height of the horizontal scrollbar of `container`
 */
//TODO: don't use document.body and document.documentElement directly, use the getters
export const calcScrollbarsDimensions = (container = _pageScroller, forceCalculation = false, options) => {
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    /**
     * Only instances of HTMLElement and SVGElement have the style property, and they both implement Element.
     * All the other unsupported implementations are filtered out by the checking style property later.
     */
    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "calcScrollbarsDimensions", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (
        forceCalculation ||
        _containerData[K_VSB] === NO_VAL ||
        _containerData[K_HSB] === NO_VAL
    ) {
        const _windowScroller = getWindowScroller(container);

        if (IS_WINDOW(container) && container !== _windowScroller) {
            return calcScrollbarsDimensions(
                _windowScroller,
                forceCalculation,
                options
            );
        } else if (!container.style || getScrollbarsMaxDimension() === 0) {
            //The element cannot have scrollbars or their size is 0px on this webpage.
            _containerData[K_VSB] = 0;
            _containerData[K_HSB] = 0;
        } else {
            const _initialXPosition = container.scrollLeft;
            const _initialYPosition = container.scrollTop;

            if (container === document.body || container === document.documentElement) {
                //The properties of _style are automatically updated whenever the style is changed.
                const _style = TOP_WINDOW.getComputedStyle(container);

                const _initialWidth = Number.parseInt(_style.width);
                const _initialHeight = Number.parseInt(_style.height);
                const _initialOverflowX = container.style.overflowX;
                const _initialOverflowY = container.style.overflowY;

                //The container is forced to hide its scrollbars.
                container.style.overflowX = "hidden";
                container.style.overflowY = "hidden";

                _containerData[K_VSB] = Number.parseInt(_style.width) - _initialWidth;
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

            //If the container is the windowScroller, cache the values for it's window too.
            if (container === _windowScroller) {
                const _window = GET_WINDOW_OF(container);
                const _windowOldData = _containersData.get(_window);
                const _windowData = _windowOldData || [];

                _windowData[K_VSB] = _containerData[K_VSB];
                _windowData[K_HSB] = _containerData[K_HSB];

                if (!_windowOldData) INIT_CONTAINER_DATA(_window, _windowData);
            }
        }
    }

    return [
        _containerData[K_VSB], //Vertical scrollbar's width
        _containerData[K_HSB]  //Horizontal scrollbar's height
    ];
}

/**
 * Returns an array containing the size of the 4 borders of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} forceCalculation If `true` the values are calculated on the fly (expensive operation), otherwise they're returned from cache.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number[]} An array containing: 
 * - Top height of the top border of `container`
 * - Top width of the right border of `container`
 * - Top height of the bottom border of `container`
 * - Top width of the left border of `container`
 */
export const calcBordersDimensions = (container = _pageScroller, forceCalculation = false, options) => {
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "calcBordersDimensions", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (
        forceCalculation ||
        _containerData[K_TB] === NO_VAL ||
        _containerData[K_RB] === NO_VAL ||
        _containerData[K_BB] === NO_VAL ||
        _containerData[K_LB] === NO_VAL
    ) {
        if (IS_WINDOW(container)) {
            const _windowScroller = getWindowScroller(container);
            const _bordersDimensions = IS_WINDOW(_windowScroller) ?
                [0, 0, 0, 0] :
                calcBordersDimensions(_windowScroller, forceCalculation, options);

            _containerData[K_TB] = _bordersDimensions[0];
            _containerData[K_RB] = _bordersDimensions[1];
            _containerData[K_BB] = _bordersDimensions[2];
            _containerData[K_LB] = _bordersDimensions[3];
        } else {
            try {
                const _style = TOP_WINDOW.getComputedStyle(container);

                _containerData[K_TB] = Number.parseFloat(_style.borderTopWidth);
                _containerData[K_RB] = Number.parseFloat(_style.borderRightWidth);
                _containerData[K_BB] = Number.parseFloat(_style.borderBottomWidth);
                _containerData[K_LB] = Number.parseFloat(_style.borderLeftWidth);
            } catch (getComputedStyleNotSupported) {
                //TOP_WINDOW.getComputedStyle() may not work on the passed container 
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
}

/**
 * Returns the `scrollXCalculator` of `container`.  
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {function} A function that when invoked returns the real-time `scrollLeft` / `scrollX` value of `container`.
 */
export const getScrollXCalculator = (container = _pageScroller, options) => {
    return getScrollCalculators(container, MERGE_OBJECTS(options, { subject: "getScrollXCalculator" }))[0];
}

/**
 * Returns the `scrollYCalculator` of `container`.  
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {function} A function that when invoked returns the real-time `scrollTop` / `scrollY` value of `container`.  
 */
export const getScrollYCalculator = (container = _pageScroller, options) => {
    return getScrollCalculators(container, MERGE_OBJECTS(options, { subject: "getScrollYCalculator" }))[1];
}

/**
 * Returns an array containing the `scrollXCalculator` and the `scrollYCalculator` of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {function[]} An array containing 2 functions that when invoked return respectively: 
 * - The real-time `scrollLeft` / `scrollX` value of `container`
 * - The real-time `scrollTop` / `scrollY` value of `container`
 */
export const getScrollCalculators = (container = _pageScroller, options) => {
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getScrollCalculators", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    return [_containerData[K_SCX], _containerData[K_SCY]];
}

/**
 * Returns the `maxScrollX` of `container`.  
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise it's returned from cache.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number} The highest reacheable `scrollLeft` / `scrollX` value of `container`.
 */
export const getMaxScrollX = (container = _pageScroller, forceCalculation = false, options) => {
    return getMaxScrolls(container, forceCalculation, MERGE_OBJECTS(options, { subject: "getMaxScrollX" }))[0];
}

/**
 * Returns the `maxScrollY` of `container`.  
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise it's returned from cache.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number} The highest reacheable `scrollTop` / `scrollY` value of `container`.
 */
export const getMaxScrollY = (container = _pageScroller, forceCalculation = false, options) => {
    return getMaxScrolls(container, forceCalculation, MERGE_OBJECTS(options, { subject: "getMaxScrollY" }))[1];
}

/**
 * Returns an array containing the `maxScrollX` and the `maxScrollY` values of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} forceCalculation If `true` the values are calculated on the fly (expensive operation), otherwise they're returned from cache.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number[]} An array containing: 
 * - The highest reacheable `scrollLeft` / `scrollX` value of `container`
 * - The highest reacheable `scrollTop` / `scrollY` value of `container`
 */
export const getMaxScrolls = (container = _pageScroller, forceCalculation = false, options) => {
    //Check if the maxScrollX/maxScrollY values for the passed container have already been calculated. 
    const _oldData = _containersData.get(container) || [];
    if (
        !forceCalculation &&
        _oldData[K_MSX] !== NO_VAL &&
        _oldData[K_MSY] !== NO_VAL
    ) {
        return [_oldData[K_MSX], _oldData[K_MSY]];
    }

    options = MERGE_OBJECTS(options, { subject: "getMaxScrolls" });

    const [_scrollXCalculator, _scrollYCalculator] = getScrollCalculators(container, options);
    const _initialXPosition = _scrollXCalculator();
    const _initialYPosition = _scrollYCalculator();
    const _containerData = _containersData.get(container);

    container.scroll(HIGHEST_SAFE_SCROLL_POS, HIGHEST_SAFE_SCROLL_POS);

    _containerData[K_MSX] = _scrollXCalculator(); //maxScrollX
    _containerData[K_MSY] = _scrollYCalculator(); //maxScrollY

    //Scroll the container back to its initial position.
    container.scroll(_initialXPosition, _initialYPosition);

    let _windowScroller = getWindowScroller(container);
    
    /**
     * This is a summary table of the output:
     *                              _windowScroller
     *                     window |     !window     | container 
     * container !window | NO_VAL |      NO_VAL     |  window
     *            window | NO_VAL | _windowScroller |    /
     */
    if (!IS_WINDOW(container)) {
        _windowScroller = _windowScroller === container ? GET_WINDOW_OF(container) : NO_VAL;    
    } else if (_windowScroller(_windowScroller)) {
        _windowScroller = NO_VAL;
    }
    
    //Bidirectionally cache the value for window/_windowScroller too.
    if (_windowScroller) {
        const _windowScrollerOldData = _containersData.get(_windowScroller);
        const _windowScrollerData = _windowScrollerOldData || [];

        _windowScrollerData[K_MSX] = _containerData[K_MSX];
        _windowScrollerData[K_MSY] = _containerData[K_MSY];

        if (!_windowScrollerOldData) INIT_CONTAINER_DATA(_windowScroller, _windowScrollerData);
    }

    return [_containerData[K_MSX], _containerData[K_MSY]];
}

/**
 * Returns the `borderBox` of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {number[]} An object containing:
 * - The width of `container` taking into account borders and paddings
 * - The height of `container` taking into account borders and paddings
 */
//TODO: Add cypress tests
export const getBorderBox = (container = _pageScroller, options) => {
    //Check if the borderBox of the passed container has already been calculated. 
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getBorderBox", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (_containerData[K_BRB] === NO_VAL) {
        const _containerRect = !IS_WINDOW(container) ?
            container.getBoundingClientRect() :
            { width: container.innerWidth, height: container.innerHeight };

        _containerData[K_BRB] = {
            width: _containerRect.width,
            height: _containerRect.height,
        }
    }

    return _containerData[K_BRB];
}

/**
 * Returns the closest `scrollableParent` of `container` on the x-axis.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} includeHiddenParents `true` to include ancestors with `overflow:hidden` or `overflow-x:hidden` in the search, `false` otherwise.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {*} The closest ancestor of `container` which is scrollable on the x-axis or `null` if there's none.
 */
//TODO: don't use document.body and document.documentElement directly, use the getters
export const getXScrollableParent = (container = _pageScroller, includeHiddenParents = false, options) => {
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];
    const _cachedParent = includeHiddenParents ? _containerData[K_HSPX] : _containerData[K_SSPX];

    if (_cachedParent !== NO_VAL) return _cachedParent;

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getXScrollableParent", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (IS_WINDOW(container)) {
        _containerData[K_HSPX] = NO_SP;
        _containerData[K_HSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        return NO_SP;
    }

    options = MERGE_OBJECTS(options, { subject: "getXScrollableParent" });

    let _overflowRegex, _overflowRegexWithVisible;
    let _cacheResult;

    if (includeHiddenParents) {
        _cacheResult = (el) => _containerData[K_HSPX] = el;
        _overflowRegex = REGEX_OVERFLOW_HIDDEN;
        _overflowRegexWithVisible = REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE;
    } else {
        _cacheResult = (el) => _containerData[K_SSPX] = el;
        _overflowRegex = REGEX_OVERFLOW;
        _overflowRegexWithVisible = REGEX_OVERFLOW_WITH_VISIBLE;
    }

    const _containerInitialX = container.getBoundingClientRect().left;
    const _windowScroller = getWindowScroller(container);
    let _parent = container.parentElement;

    const _isScrollableParent = (overflowRegex) => {
        //The x-axis should be tested.
        if (
            IS_WINDOW(_parent) ||
            overflowRegex.test(TOP_WINDOW.getComputedStyle(_parent).overflowX)
        ) {
            if (_parent === _windowScroller) _parent = GET_WINDOW_OF(container);

            const [_scrollXCalculator, _scrollYCalculator] = getScrollCalculators(_parent, options);
            const _parentInitialX = _scrollXCalculator();
            const _parentInitialY = _scrollYCalculator();

            const _containerData = _containersData.get(_parent); //containerData of _parent
            let _maxScrollX = _containerData[K_MSX] !== NO_VAL ? _containerData[K_MSX] : HIGHEST_SAFE_SCROLL_POS;

            if (_maxScrollX > 0 && _parentInitialX !== _maxScrollX) {
                //Try scrolling the container by scrolling the parent.
                _parent.scroll(HIGHEST_SAFE_SCROLL_POS, _parentInitialY);

                _maxScrollX = _scrollXCalculator();

                //Cache the maxScrollX.
                _containerData[K_MSX] = _maxScrollX;
            }

            //The parent cannot scroll.
            if (_maxScrollX === 0) return false;

            //The parent was already at its maxScrollX.
            if (_parentInitialX === _maxScrollX) {
                //Try scrolling the container by scrolling the parent.
                _parent.scroll(0, _parentInitialY);
            }

            //Check if the container has moved.
            const _isXScrollable = _containerInitialX !== container.getBoundingClientRect().left;

            //Scroll the parent back to its initial position.
            _parent.scroll(_parentInitialX, _parentInitialY);

            if (_isXScrollable) {
                _cacheResult(_parent);
                return true;
            }
        }

        return false;
    }

    const _body = document.body;
    const _html = document.documentElement;
    
    //Test if any container's parent is scrollable on the x-axis.
    while (_parent) {
        const _regexToUse = _parent === _body || _parent === _html ? _overflowRegexWithVisible : _overflowRegex;

        if (_isScrollableParent(_regexToUse)) return _parent;

        _parent = _parent.parentElement;
    }

    //Test window if necessary.
    if (IS_WINDOW(_windowScroller)) {
        _parent = GET_WINDOW_OF(container);
        if (_isScrollableParent()) return _parent;
    }

    _cacheResult(NO_SP);
    return NO_SP;
}

/**
 * Returns the closest `scrollableParent` of `container` on the y-axis.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} includeHiddenParents `true` to include ancestors with `overflow:hidden` or `overflow-y:hidden` in the search, `false` otherwise.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {*} The closest ancestor of `container` which is scrollable on the y-axis or `null` if there's none.
 */
//TODO: don't use document.body and document.documentElement directly, use the getters
export const getYScrollableParent = (container = _pageScroller, includeHiddenParents = false, options) => {
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];
    const _cachedParent = includeHiddenParents ? _containerData[K_HSPY] : _containerData[K_SSPY];

    if (_cachedParent !== NO_VAL) return _cachedParent;

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getYScrollableParent", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (IS_WINDOW(container)) {
        _containerData[K_HSPX] = NO_SP;
        _containerData[K_HSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        return NO_SP;
    }

    options = MERGE_OBJECTS(options, { subject: "getYScrollableParent" });

    let _overflowRegex, _overflowRegexWithVisible;
    let _cacheResult;

    if (includeHiddenParents) {
        _cacheResult = (el) => _containerData[K_HSPY] = el;
        _overflowRegex = REGEX_OVERFLOW_HIDDEN;
        _overflowRegexWithVisible = REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE;
    } else {
        _cacheResult = (el) => _containerData[K_SSPY] = el;
        _overflowRegex = REGEX_OVERFLOW;
        _overflowRegexWithVisible = REGEX_OVERFLOW_WITH_VISIBLE;
    }

    const _containerInitialY = container.getBoundingClientRect().top;
    const _windowScroller = getWindowScroller(container);
    let _parent = container.parentElement;

    const _isScrollableParent = (overflowRegex) => {
        //The y-axis should be tested.
        if (
            IS_WINDOW(_parent) ||
            overflowRegex.test(TOP_WINDOW.getComputedStyle(_parent).overflowY)
        ) {
            if (_parent === _windowScroller) _parent = GET_WINDOW_OF(container);

            const [_scrollXCalculator, _scrollYCalculator] = getScrollCalculators(_parent, options);
            const _parentInitialX = _scrollXCalculator();
            const _parentInitialY = _scrollYCalculator();

            const _containerData = _containersData.get(_parent); //containerData of _parent
            let _maxScrollY = _containerData[K_MSY] !== NO_VAL ? _containerData[K_MSY] : HIGHEST_SAFE_SCROLL_POS;

            if (_maxScrollY > 0 && _parentInitialY !== _maxScrollY) {
                //Try scrolling the container by scrolling the parent.
                _parent.scroll(_parentInitialX, HIGHEST_SAFE_SCROLL_POS);

                _maxScrollY = _scrollYCalculator();

                //Cache the maxScrollY.
                _containerData[K_MSY] = _maxScrollY;
            }

            //The parent cannot scroll.
            if (_maxScrollY === 0) return false;

            //The parent was already at its maxScrollY.
            if (_parentInitialY === _maxScrollY) {
                //Try scrolling the container by scrolling the parent.
                _parent.scroll(_parentInitialX, 0);
            }

            //Check if the container has moved.
            const _isYScrollable = _containerInitialY !== container.getBoundingClientRect().top;

            //Scroll the parent back to its initial position.
            _parent.scroll(_parentInitialX, _parentInitialY);

            if (_isYScrollable) {
                _cacheResult(_parent);
                return true;
            }
        }

        return false;
    }

    const _body = document.body;
    const _html = document.documentElement;

    //Test if any container's parent is scrollable on the y-axis.
    while (_parent) {
        const _regexToUse = _parent === _body || _parent === _html ? _overflowRegexWithVisible : _overflowRegex;

        if (_isScrollableParent(_regexToUse)) return _parent;

        _parent = _parent.parentElement;
    }

    //Test the window of container if necessary.
    if (IS_WINDOW(_windowScroller)) {
        _parent = GET_WINDOW_OF(container);
        if (_isScrollableParent()) return _parent;
    }

    _cacheResult(NO_SP);
    return NO_SP;
}

/**
 * Returns the closest `scrollableParent` of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} includeHiddenParents `true` to include ancestors with `overflow:hidden`, `overflow-x:hidden` or `overflow-y:hidden` in the search, `false` otherwise.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {*} The closest ancestor of `container` which is scrollable or `null` if there's none.
 */
//TODO: don't use document.body and document.documentElement directly, use the getters
export const getScrollableParent = (container = _pageScroller, includeHiddenParents = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "getScrollableParent" });

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];
    let _cachedXParent, _cachedYParent;

    if (includeHiddenParents) {
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
    if (_isXParentCached || _isYParentCached) {
        if (_isXParentCached && !_isYParentCached) {
            _cachedYParent = getYScrollableParent(container, includeHiddenParents, options);
        } else if (!_isXParentCached && _isYParentCached) {
            _cachedXParent = getXScrollableParent(container, includeHiddenParents, options);
        }

        /**
         * This is a summary table of the output:
         *                              _cachedXParent
         *                         window |  NO_SP | el1 
         *                window | window | window | el1
         * _cachedYParent  NO_SP | window |  NO_SP | el1
         *                  el2  |  el2   |  el2   | el1 or el2
         */
        if (_cachedXParent === NO_SP) return _cachedYParent;
        if (_cachedYParent === NO_SP) return _cachedXParent;
        if (IS_WINDOW(_cachedXParent)) return _cachedYParent;
        if (IS_WINDOW(_cachedYParent)) return _cachedXParent;
        return _cachedXParent.contains(_cachedYParent) ? _cachedYParent : _cachedXParent;
    }

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getScrollableParent", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (IS_WINDOW(container)) {
        _containerData[K_HSPX] = NO_SP;
        _containerData[K_HSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        return NO_SP;
    }

    let _overflowRegex, _overflowRegexWithVisible;
    let _cacheXResult, _cacheYResult;

    if (includeHiddenParents) {
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

    const _containerInitialPos = container.getBoundingClientRect();
    const _containerInitialX = _containerInitialPos.left;
    const _containerInitialY = _containerInitialPos.top;
    const _windowScroller = getWindowScroller(container);
    let _parent = container.parentElement;

    const _isScrollableParent = (overflowRegex) => {
        let _testScrollX, _testScrollY;

        if (IS_WINDOW(_parent)) {
            _testScrollX = true;
            _testScrollY = true;
        } else {
            //Check if the overflow conditions are met.
            const _style = TOP_WINDOW.getComputedStyle(_parent);
            _testScrollX = overflowRegex.test(_style.overflowX);
            _testScrollY = overflowRegex.test(_style.overflowY);
        }

        //At least one axis should be tested.
        if (_testScrollX || _testScrollY) {
            if (_parent === _windowScroller) _parent = GET_WINDOW_OF(container);

            const [_scrollXCalculator, _scrollYCalculator] = getScrollCalculators(_parent, options);
            const _parentInitialX = _scrollXCalculator();
            const _parentInitialY = _scrollYCalculator();

            const _containerData = _containersData.get(_parent);  //containerData of _parent
            let _maxScrollX = _containerData[K_MSX] !== NO_VAL ? _containerData[K_MSX] : HIGHEST_SAFE_SCROLL_POS;
            let _maxScrollY = _containerData[K_MSY] !== NO_VAL ? _containerData[K_MSY] : HIGHEST_SAFE_SCROLL_POS;

            if (
                (_maxScrollX > 0 && _parentInitialX !== _maxScrollX) ||
                (_maxScrollY > 0 && _parentInitialY !== _maxScrollY)
            ) {
                //Try scrolling the container by scrolling the parent.
                _parent.scroll(HIGHEST_SAFE_SCROLL_POS, HIGHEST_SAFE_SCROLL_POS);

                _maxScrollX = _scrollXCalculator();
                _maxScrollY = _scrollYCalculator();

                //Cache the maxScrollX/maxScrollY.
                _containerData[K_MSX] = _maxScrollX;
                _containerData[K_MSY] = _maxScrollY;
            }

            //The parent cannot scroll.
            if (_maxScrollX === 0 && _maxScrollY === 0) return false;

            //The parent was already at its maxScrollX/maxScrollY.
            if (_parentInitialX === _maxScrollX && _parentInitialY === _maxScrollY) {
                //Try scrolling the container by scrolling the parent.
                _parent.scroll(0, 0);
            }

            //Check if the container has moved.
            const _containerPos = container.getBoundingClientRect();
            const _isXScrollable = _testScrollX && _containerInitialX !== _containerPos.left;
            const _isYScrollable = _testScrollY && _containerInitialY !== _containerPos.top;

            //Scroll the parent back to its initial position.
            _parent.scroll(_parentInitialX, _parentInitialY);

            if (_isXScrollable && !_isYScrollable) {
                _cacheXResult(_parent);
                return true;
            }

            if (!_isXScrollable && _isYScrollable) {
                _cacheYResult(_parent);
                return true;
            }

            if (_isXScrollable && _isYScrollable) {
                _cacheXResult(_parent);
                _cacheYResult(_parent);
                return true;
            }
        }

        return false;
    }

    const _body = document.body;
    const _html = document.documentElement;

    //Test if any container's parent is scrollable.
    while (_parent) {
        const _regexToUse = _parent === _body || _parent === _html ? _overflowRegexWithVisible : _overflowRegex;

        if (_isScrollableParent(_regexToUse)) return _parent;

        _parent = _parent.parentElement;
    }

    //Test the window of container if necessary.
    if (IS_WINDOW(_windowScroller)) {
        _parent = GET_WINDOW_OF(container);
        if (_isScrollableParent()) return _parent;
    }

    _cacheXResult(NO_SP);
    _cacheYResult(NO_SP);
    return NO_SP;
}

/**
 * Returns every `scrollableParent` of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {boolean} includeHiddenParents `true` to include ancestors with `overflow:hidden`, `overflow-x:hidden` or `overflow-y:hidden` in the search, `false` otherwise.
 * @param {function} [callback] A function that is invoked every time a `scrollableParent` is found. The input of this function is the just-found `scrollableParent`.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns {*[]} An array containing all the ancestors of `container` that are scrollable.
 */
export const getAllScrollableParents = (container = _pageScroller, includeHiddenParents = false, callback, options) => {
    options = MERGE_OBJECTS(options, { subject: "getAllScrollableParents" });

    const _scrollableParents = [];
    const _callback = IS_FUNCTION(callback) ? callback : () => { };
    const _scrollableParentFound = (el) => {
        _scrollableParents.push(el);
        _callback(el);
    }

    do {
        container = getScrollableParent(container, includeHiddenParents, options);
        if (container !== NO_SP) _scrollableParentFound(container);
    } while (container !== NO_SP);

    return _scrollableParents;
}

/**
 * Scrolls the x-axis of `container` to the specified position if possible.
 * @param {number} finalPosition A finite number indicating the `scrollLeft` / `scrollX` that `container` has to reach.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {function} [callback] A function that is executed when the scroll-animation has ended.
 * @param {boolean} containScroll `true` to clamp `finalPosition` to [`0`...`maxScrollX`], `false` otherwise.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const scrollXTo = (finalPosition, container = _pageScroller, callback, containScroll = false, options) => {
    if (!Number.isFinite(finalPosition)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "scrollXTo", { secondaryMsg: finalPosition }, DEFAULT_LOG_OPTIONS));
        return;
    }

    options = MERGE_OBJECTS(options, { subject: "scrollXTo" });

    //The container cannot be scrolled on the x-axis.
    const _maxScrollX = getMaxScrollX(container, false, options);
    if (_maxScrollX < 1) {
        _warningLogger(
            {
                subject: container,
                primaryMsg: "is not scrollable on the x-axis",
                useSubjectQuotes: false
            }
        );
        stopScrollingX(container, callback);
        return;
    }

    //Limit the final position to the [0, maxScrollX] interval. 
    if (containScroll) {
        if (finalPosition < 0) finalPosition = 0;
        else if (finalPosition > _maxScrollX) finalPosition = _maxScrollX;
    }

    const _scrollXCalculator = getScrollXCalculator(container);
    let _totalScrollAmount = finalPosition - _scrollXCalculator();
    const _direction = _totalScrollAmount > 0 ? 1 : -1;
    _totalScrollAmount *= _direction;

    //If the final position has already been reached,
    //or the scroll amount is less than 1px: no scroll-animation is performed.
    if (_totalScrollAmount < 1) {
        stopScrollingX(container, callback);
        return;
    }
    const _scroll = !IS_WINDOW(container) ? finalPos => container.scrollLeft = finalPos : finalPos => container.scroll(finalPos, container.scrollY);

    //If user prefers reduced motion
    //the API rolls back to the default "jump-to-position" behavior.
    if (_reducedMotion) {
        _scroll(finalPosition);
        stopScrollingX(container, callback);
        return;
    }

    //At this point we know the container has to be scrolled by a certain amount with smooth scroll.
    //Two possible cases:
    //  1) A scroll-animation is already being performed and it can be repurposed.
    //  2) No scroll-animations are being performed, no optimization can be done.
    const _containerData = _containersData.get(container);
    _containerData[K_FPX] = finalPosition;       //Final position
    _containerData[K_SDX] = _direction;          //Direction
    _containerData[K_TSAX] = _totalScrollAmount; //Total scroll amount
    _containerData[K_OTSX] = NO_VAL;             //Original timestamp
    _containerData[K_CBX] = callback;            //Callback

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated.
    if (_containerData[K_IDX]) return;

    //No scroll-animation is being performed so a new one is created.
    _containerData[K_IDX] = TOP_WINDOW.requestAnimationFrame(_stepX);

    function _stepX(timestamp) {
        const _finalPosition = _containerData[K_FPX];
        const _direction = _containerData[K_SDX];
        const _currentPosition = _scrollXCalculator();
        const _remaningScrollAmount = (_finalPosition - _currentPosition) * _direction;

        if (_remaningScrollAmount < 1) {
            stopScrollingX(container, _containerData[K_CBX]);
            return;
        }

        //There's no originalTimeStamp at the beginning of a scroll-animation.
        if (!_containerData[K_OTSX]) _containerData[K_OTSX] = timestamp;

        const _scrollID = _containerData[K_IDX];

        const _stepLengthCalculator = _containerData[K_TSCX] ? _containerData[K_TSCX] :
                                      _containerData[K_PSCX] ? _containerData[K_PSCX] :
                                      DEFAULT_XSTEP_LENGTH_CALCULATOR;

        let _stepLength = _stepLengthCalculator(
            _remaningScrollAmount,  //Remaning scroll amount
            _containerData[K_OTSX], //Original timestamp
            timestamp,              //Current timestamp
            _containerData[K_TSAX], //Total scroll amount
            _currentPosition,       //Current position
            _finalPosition,         //Final position
            container               //Container
        );

        //The current scroll-animation has been aborted by the StepLengthCalculator.
        if (_scrollID !== _containerData[K_IDX]) return;

        //The current scroll-animation has been altered by the StepLengthCalculator.
        if (_finalPosition !== _containerData[K_FPX]) {
            _containerData[K_IDX] = TOP_WINDOW.requestAnimationFrame(_stepX);
            return;
        }

        //The StepLengthCalculator returned an invalid stepLength.
        if (!Number.isFinite(_stepLength)) {
            _warningLogger(
                {
                    subject: _stepLength,
                    primaryMsg: DEFAULT_WARNING_PRIMARY_MSG_2,
                    useSubjectQuotes: true
                }
            );

            _stepLength = DEFAULT_XSTEP_LENGTH_CALCULATOR(
                _remaningScrollAmount,  //Remaning scroll amount
                _containerData[K_OTSX], //Original timestamp
                timestamp,              //Current timestamp
                _containerData[K_TSAX], //Total scroll amount
                _currentPosition,       //Current position
                _finalPosition,         //Final position
                container               //Container
            );
        }

        if (_remaningScrollAmount <= _stepLength) {
            _scroll(_finalPosition);
            stopScrollingX(container, _containerData[K_CBX]);
            return;
        }

        _scroll(_currentPosition + _stepLength * _direction);

        //The API tried to scroll but the final position was beyond the scroll limit of the container.
        if (_stepLength !== 0 && _currentPosition === _scrollXCalculator()) {
            stopScrollingX(container, _containerData[K_CBX]);
            return;
        }

        _containerData[K_IDX] = TOP_WINDOW.requestAnimationFrame(_stepX);
    }
}

/**
 * Scrolls the y-axis of `container` to the specified position if possible.
 * @param {number} finalPosition A finite number indicating the `scrollTop` / `scrollY` that `container` has to reach.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {function} [callback] A function that is executed when the scroll-animation has ended.
 * @param {boolean} containScroll `true` to clamp `finalPosition` to [`0`...`maxScrollY`], `false` otherwise.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const scrollYTo = (finalPosition, container = _pageScroller, callback, containScroll = false, options) => {
    if (!Number.isFinite(finalPosition)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "scrollYTo", { secondaryMsg: finalPosition }, DEFAULT_LOG_OPTIONS));
        return;
    }

    options = MERGE_OBJECTS(options, { subject: "scrollYTo" });

    //The container cannot be scrolled on the y-axis.
    const _maxScrollY = getMaxScrollY(container, false, options);
    if (_maxScrollY < 1) {
        _warningLogger(
            {
                subject: container,
                primaryMsg: "is not scrollable on the y-axis",
                useSubjectQuotes: false
            }
        );
        stopScrollingY(container, callback);
        return;
    }

    //Limit the final position to the [0, maxScrollY] interval. 
    if (containScroll) {
        if (finalPosition < 0) finalPosition = 0;
        else if (finalPosition > _maxScrollY) finalPosition = _maxScrollY;
    }

    const _scrollYCalculator = getScrollYCalculator(container);
    let _totalScrollAmount = finalPosition - _scrollYCalculator();
    const _direction = _totalScrollAmount > 0 ? 1 : -1;
    _totalScrollAmount *= _direction;

    //If the final position has already been reached,
    //or the scroll amount is less than 1px: no scroll-animation is performed.
    if (_totalScrollAmount < 1) {
        stopScrollingY(container, callback);
        return;
    }
    const _scroll = !IS_WINDOW(container) ? finalPos => container.scrollTop = finalPos : finalPos => container.scroll(container.scrollX, finalPos);

    //If user prefers reduced motion
    //the API rolls back to the default "jump-to-position" behavior.
    if (_reducedMotion) {
        _scroll(finalPosition);
        stopScrollingY(container, callback);
        return;
    }

    //At this point we know the container has to be scrolled by a certain amount with smooth scroll.
    //Two possible cases:
    //  1) A scroll-animation is already being performed and it can be repurposed.
    //  2) No scroll-animations are being performed, no optimization can be done.
    const _containerData = _containersData.get(container);
    _containerData[K_FPY] = finalPosition;       //Final position
    _containerData[K_SDY] = _direction;          //Direction
    _containerData[K_TSAY] = _totalScrollAmount; //Total scroll amount
    _containerData[K_OTSY] = NO_VAL;             //Original timestamp
    _containerData[K_CBY] = callback;            //Callback

    //A scroll-animation is already being performed and
    //the scroll-animation's informations have already been updated.
    if (_containerData[K_IDY]) return;

    //No scroll-animation is being performed so a new one is created.
    _containerData[K_IDY] = TOP_WINDOW.requestAnimationFrame(_stepY);

    function _stepY(timestamp) {
        const _finalPosition = _containerData[K_FPY];
        const _direction = _containerData[K_SDY];
        const _currentPosition = _scrollYCalculator();
        const _remaningScrollAmount = (_finalPosition - _currentPosition) * _direction;

        if (_remaningScrollAmount < 1) {
            stopScrollingY(container, _containerData[K_CBY]);
            return;
        }

        //There's no originalTimeStamp at the beginning of a scroll-animation.
        if (!_containerData[K_OTSY]) _containerData[K_OTSY] = timestamp;

        const _scrollID = _containerData[K_IDY];
        const _stepLengthCalculator = _containerData[K_TSCY] ? _containerData[K_TSCY] :
                                      _containerData[K_PSCY] ? _containerData[K_PSCY] :
                                      DEFAULT_YSTEP_LENGTH_CALCULATOR;

        let _stepLength = _stepLengthCalculator(
            _remaningScrollAmount,  //Remaning scroll amount
            _containerData[K_OTSY], //Original timestamp
            timestamp,              //Current timestamp
            _containerData[K_TSAY], //Total scroll amount
            _currentPosition,       //Current position
            _finalPosition,         //Final position
            container               //Container
        );

        //The current scroll-animation has been aborted by the StepLengthCalculator.
        if (_scrollID !== _containerData[K_IDY]) return;

        //The current scroll-animation has been altered by the StepLengthCalculator.
        if (_finalPosition !== _containerData[K_FPY]) {
            _containerData[K_IDY] = TOP_WINDOW.requestAnimationFrame(_stepY);
            return;
        }

        //The StepLengthCalculator returned an invalid stepLength.
        if (!Number.isFinite(_stepLength)) {
            _warningLogger(
                {
                    subject: _stepLength,
                    primaryMsg: DEFAULT_WARNING_PRIMARY_MSG_2,
                    useSubjectQuotes: true
                }
            );

            _stepLength = DEFAULT_YSTEP_LENGTH_CALCULATOR(
                _remaningScrollAmount,  //Remaning scroll amount
                _containerData[K_OTSY], //Original timestamp
                timestamp,              //Current timestamp
                _containerData[K_TSAY], //Total scroll amount
                _currentPosition,       //Current position
                _finalPosition,         //Final position
                container               //Container
            );
        }

        if (_remaningScrollAmount <= _stepLength) {
            _scroll(_finalPosition);
            stopScrollingY(container, _containerData[K_CBY]);
            return;
        }

        _scroll(_currentPosition + _stepLength * _direction);

        //The API tried to scroll but the final position was beyond the scroll limit of the container.
        if (_stepLength !== 0 && _currentPosition === _scrollYCalculator()) {
            stopScrollingY(container, _containerData[K_CBY]);
            return;
        }

        _containerData[K_IDY] = TOP_WINDOW.requestAnimationFrame(_stepY);
    }
}

/**
 * Scrolls the x-axis of `container` by the specified amount if possible.
 * @param {number} delta A finite number indicating the amount of pixels that the x-axis of `container` should be scrolled by.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {function} [callback] A function that is executed when the scroll-animation has ended.
 * @param {boolean} stillStart `true` if any on-going scroll-animation on the x-axis of `container` must be stopped before starting this scroll-animation.
 *                             `false` if any on-going scroll-animation on the x-axis of `container` should extended by `delta` if possible. 
 * @param {boolean} containScroll `true` to clamp the `finalPosition` of the scroll-animation to [`0`...`maxScrollX`], `false` otherwise.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const scrollXBy = (delta, container = _pageScroller, callback, stillStart = true, containScroll = false, options) => {
    if (!Number.isFinite(delta)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "scrollXBy", { secondaryMsg: delta }, DEFAULT_LOG_OPTIONS));
        return;
    }

    options = MERGE_OBJECTS(options, { subject: "scrollXBy" });

    const _currentPosition = getScrollXCalculator(container, options)();
    if (!stillStart) {
        const _containerData = _containersData.get(container) || [];

        //A scroll-animation on the x-axis is already being performed and can be repurposed.
        if (_containerData[K_IDX]) {

            //An actual scroll-animation has been requested.   
            if (delta !== 0) {
                let _finalPosition = _containerData[K_FPX] + delta;

                //Limit _finalPosition to [0, maxScrollX]. 
                if (containScroll) {
                    const _maxScrollX = getMaxScrollX(container, false, options);
                    if (_finalPosition < 0) _finalPosition = 0;
                    else if (_finalPosition > _maxScrollX) _finalPosition = _maxScrollX;
                }

                const _remaningScrollAmount = (_finalPosition - _currentPosition) * _containerData[K_SDX];

                //The scroll-animation has to scroll less than 1px.
                if (_remaningScrollAmount * _remaningScrollAmount < 1) {
                    stopScrollingX(container, callback);
                    return;
                }

                //Thanks to the new delta, the current scroll-animation 
                //has already surpassed the old _finalPosition.
                if (_remaningScrollAmount < 0) {
                    scrollXTo(_finalPosition, container, callback, containScroll, options);
                    return;
                }

                const _totalScrollAmount = _containerData[K_TSAX] * _containerData[K_SDX] + delta;
                _containerData[K_FPX] = _finalPosition;                              
                _containerData[K_SDX] = _totalScrollAmount > 0 ? 1 : -1; //direction
                _containerData[K_TSAX] = _totalScrollAmount * _containerData[K_SDX]; 
            }
            _containerData[K_OTSX] = NO_VAL; //originalTimestamp
            _containerData[K_CBX] = callback;
            return;
        }
    }

    scrollXTo(_currentPosition + delta, container, callback, containScroll, options);
}

/**
 * Scrolls the y-axis of `container` by the specified amount if possible.
 * @param {number} delta A finite number indicating the amount of pixels that the y-axis of `container` should be scrolled by.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {function} [callback] A function that is executed when the scroll-animation has ended.
 * @param {boolean} stillStart `true` if any on-going scroll-animation on the y-axis of `container` must be stopped before starting this scroll-animation.
 *                             `false` if any on-going scroll-animation on the y-axis of `container` should extended by `delta` if possible. 
 * @param {boolean} containScroll `true` to clamp the `finalPosition` of the scroll-animation to [`0`...`maxScrollY`], `false` otherwise.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const scrollYBy = (delta, container = _pageScroller, callback, stillStart = true, containScroll = false, options) => {
    if (!Number.isFinite(delta)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "scrollYBy", { secondaryMsg: delta }, DEFAULT_LOG_OPTIONS));
        return;
    }

    options = MERGE_OBJECTS(options, { subject: "scrollYBy" });

    const _currentPosition = getScrollYCalculator(container, options)();
    if (!stillStart) {
        const _containerData = _containersData.get(container) || [];

        //A scroll-animation on the y-axis is already being performed and can be repurposed.
        if (_containerData[K_IDY]) {

            //An actual scroll-animation has been requested.
            if (delta !== 0) {
                let _finalPosition = _containerData[K_FPY] + delta;

                //Limit _finalPosition to [0, maxScrollY].
                if (containScroll) {
                    const _maxScrollY = getMaxScrollY(container, false, options);
                    if (_finalPosition < 0) _finalPosition = 0;
                    else if (_finalPosition > _maxScrollY) _finalPosition = _maxScrollY;
                }

                const _remaningScrollAmount = (_finalPosition - _currentPosition) * _containerData[K_SDY];

                //The scroll-animation has to scroll less than 1px. 
                if (_remaningScrollAmount * _remaningScrollAmount < 1) {
                    stopScrollingY(container, callback);
                    return;
                }

                //Thanks to the new delta, the current scroll-animation 
                //has already surpassed the old _finalPosition. 
                if (_remaningScrollAmount < 0) {
                    scrollYTo(_finalPosition, container, callback, containScroll, options);
                    return;
                }

                const _totalScrollAmount = _containerData[K_TSAY] * _containerData[K_SDY] + delta;
                _containerData[K_FPY] = _finalPosition;                             
                _containerData[K_SDY] = _totalScrollAmount > 0 ? 1 : -1; //direction
                _containerData[K_TSAY] = _totalScrollAmount * _containerData[K_SDY];
            }
            _containerData[K_OTSY] = NO_VAL; //originalTimestamp
            _containerData[K_CBY] = callback;
            return;
        }
    }

    scrollYTo(_currentPosition + delta, container, callback, containScroll, options);
}

/**
 * Scrolls `container` to the specified positions if possible.
 * @param {number} finalXPosition A finite number indicating the `scrollLeft` / `scrollX` that `container` has to reach.
 * @param {number} finalYPosition A finite number indicating the `scrollTop` / `scrollY` that `container` has to reach.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {function} [callback] A function that is executed when the scroll-animation has ended.
 * @param {boolean} containScroll `true` to clamp `finalXPosition` to [`0`...`maxScrollX`] and `finalYPosition` to [`0`...`maxScrollY`], `false` otherwise.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const scrollTo = (finalXPosition, finalYPosition, container = _pageScroller, callback, containScroll = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "scrollTo" });

    if (!IS_FUNCTION(callback)) {
        scrollXTo(finalXPosition, container, NO_VAL, containScroll, options);
        scrollYTo(finalYPosition, container, NO_VAL, containScroll, options);
        return;
    }

    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the y-axis has finished too or it has been altered.
    const _scrollXCallback = () => {
        const _containerData = _containersData.get(container) || [];
        if (!_initPhase && _containerData[K_CBY] !== _scrollYCallback) callback();
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the x-axis has finished too or it has been altered.
    const _scrollYCallback = () => {
        const _containerData = _containersData.get(container) || [];
        if (!_initPhase && _containerData[K_CBX] !== _scrollXCallback) callback();
    }

    let _initPhase = true;
    scrollXTo(finalXPosition, container, _scrollXCallback, containScroll, options);
    _initPhase = false;
    scrollYTo(finalYPosition, container, _scrollYCallback, containScroll, options);
}

/**
 * Scrolls `container` by the specified amounts if possible.
 * @param {number} deltaX A finite number indicating the amount of pixels that the x-axis of `container` should be scrolled by.
 * @param {number} deltaY A finite number indicating the amount of pixels that the y-axis of `container` should be scrolled by.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {function} [callback] A function that is executed when the scroll-animation has ended.
 * @param {boolean} stillStart `true` if any on-going scroll-animation of `container` must be stopped before starting this scroll-animation.
 *                             `false` if any on-going scroll-animation of `container` should extended by `deltaX` and `deltaY` if possible. 
 * @param {boolean} containScroll `true` to clamp the `finalXPosition` of the scroll-animation to [`0`...`maxScrollX`] and 
 *                                                the `finalYPosition` of the scroll-animation to [`0`...`maxScrollY`], `false` otherwise.  
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const scrollBy = (deltaX, deltaY, container = _pageScroller, callback, stillStart = true, containScroll = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "scrollBy" });

    if (!IS_FUNCTION(callback)) {
        scrollXBy(deltaX, container, NO_VAL, stillStart, containScroll, options);
        scrollYBy(deltaY, container, NO_VAL, stillStart, containScroll, options);
        return;
    }

    let _initPhase = true;

    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the y-axis has finished too or it has been altered.
    const _scrollXCallback = () => {
        const _containerData = _containersData.get(container) || [];
        if (!_initPhase && _containerData[K_CBY] !== _scrollYCallback) callback();
    }
    //Execute the callback only if the initialization has finished and 
    //the scroll-animation on the x-axis has finished too or it has been altered.
    const _scrollYCallback = () => {
        const _containerData = _containersData.get(container) || [];
        if (!_initPhase && _containerData[K_CBX] !== _scrollXCallback) callback();
    }

    scrollXBy(deltaX, container, _scrollXCallback, stillStart, containScroll, options);
    _initPhase = false;
    scrollYBy(deltaY, container, _scrollYCallback, stillStart, containScroll, options);
}

/**
 * Finds and scrolls all the `scrollableParents` of `container` in order to make it visible on the screen with the specified alignments.
 * @param {*} container An instance of `Element` or a `window`.
 * @param {boolean} alignToLeft This value indicates the alignment (on the x-axis) of `container` and all its `scrollableParents`:
 * - `true` if the alignment should be to the `left`
 * - `false` if the alignment should be to the `right`
 * - `nearest` **(case insensitive)** if the alignment should be to the `closest side`:
 *    the alignment of each container is decided by measuring its position (on the x-axis) relative to its closest scrollable ancestor
 * - Any other value, if the alignment should be to the `center`
 * @param {boolean} alignToTop This value indicates the alignment (on the y-axis) of `container` and all its `scrollableParents`:
 * - `true` if the alignment should be to the `top`
 * - `false` if the alignment should be to the `bottom`
 * - `nearest` **(case insensitive)** if the alignment should be to the `closest side`:
 *    the alignment of each container is decided by measuring its position (on the y-axis) relative to its closest scrollable ancestor
 * - Any other value, if the alignment should be to the `center`
 * @param {function} [callback] A function invoked when `container` is scrolled into view.
 * @param {boolean} includeHiddenParents `true` to include `scrollableParents` with `overflow:hidden`, `overflow-x:hidden` or `overflow-y:hidden` in the search, `false` otherwise.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const scrollIntoView = (container, alignToLeft = true, alignToTop = true, callback, includeHiddenParents = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "scrollIntoView" });

    let _parentIdx = -1;
    const _parents = getAllScrollableParents(container, includeHiddenParents, () => _parentIdx++, options);

    //The container cannot be scrolled into view.
    if (_parentIdx < 0) {
        if (IS_FUNCTION(callback)) callback();
        return;
    }

    const _alignToNearestX = REGEX_ALIGNMENT_NEAREST.test(alignToLeft);
    const _alignToNearestY = REGEX_ALIGNMENT_NEAREST.test(alignToTop);

    let _alignToLeft = alignToLeft;
    let _alignToTop = alignToTop;
    let _parent = _parents[_parentIdx];
    let _container = _parents[_parentIdx - 1] || container;

    const _callback = () => {
        if (_parentIdx < 1) {
            if (IS_FUNCTION(callback)) callback();
            return;
        }
        _parentIdx--;
        _parent = _parents[_parentIdx];
        _container = _parents[_parentIdx - 1] || container;
        _scrollParent();
    }

    _scrollParent();

    function _scrollParent() {
        //_scrollbarsDimensions[0] = vertical scrollbar's width
        //_scrollbarsDimensions[1] = horizontal scrollbar's height
        const _scrollbarsDimensions = calcScrollbarsDimensions(_parent, false, options);

        //_bordersDimensions[0] = top border size
        //_bordersDimensions[1] = right border size
        //_bordersDimensions[2] = bottom border size
        //_bordersDimensions[3] = left border size
        const _bordersDimensions = calcBordersDimensions(_parent, false, options);

        //Current container position relative to the current parent.
        const { top, right, bottom, left } = _container.getBoundingClientRect();
        const _containerPos = { top, right, bottom, left };

        if (IS_WINDOW(_parent)) {
            _containerPos.right -= _parent.innerWidth;
            _containerPos.bottom -= _parent.innerHeight;
        } else {
            const _parentPos = _parent.getBoundingClientRect();

            _containerPos.top -= _parentPos.top;
            _containerPos.right -= _parentPos.right;
            _containerPos.bottom -= _parentPos.bottom;
            _containerPos.left -= _parentPos.left;
        }

        const _topDelta = _containerPos.top - _bordersDimensions[0];
        const _rightDelta = _containerPos.right + _bordersDimensions[1] + _scrollbarsDimensions[0];
        const _bottomDelta = _containerPos.bottom + _bordersDimensions[2] + _scrollbarsDimensions[1];
        const _leftDelta = _containerPos.left - _bordersDimensions[3];
        const _centerDeltaX = (_leftDelta + _rightDelta) * 0.5;
        const _centerDeltaY = (_topDelta + _bottomDelta) * 0.5;

        //Align to nearest is an indirect way to say: align to top/bottom/center.
        if (_alignToNearestX) {
            _alignToLeft = Math.abs(_leftDelta) < Math.abs(_centerDeltaX) ? true :
                           Math.abs(_rightDelta) < Math.abs(_centerDeltaX) ? false : NO_VAL;
        }

        if (_alignToNearestY) {
            _alignToTop = Math.abs(_topDelta) < Math.abs(_centerDeltaY) ? true :
                          Math.abs(_bottomDelta) < Math.abs(_centerDeltaY) ? false : NO_VAL;
        }

        let _deltaX = _alignToLeft === true ? _leftDelta :
                      _alignToLeft === false ? _rightDelta :
                      _centerDeltaX;
        let _deltaY = _alignToTop === true ? _topDelta :
                      _alignToTop === false ? _bottomDelta :
                      _centerDeltaY;

        _deltaX = _deltaX > 0 ? Math.round(_deltaX) : Math.floor(_deltaX);
        _deltaY = _deltaY > 0 ? Math.round(_deltaY) : Math.floor(_deltaY);

        const _shouldScrollX = _deltaX !== 0 && getMaxScrollX(_parent, false, options) >= 1;
        const _shouldScrollY = _deltaY !== 0 && getMaxScrollY(_parent, false, options) >= 1;

        if (_shouldScrollX && _shouldScrollY) scrollBy(_deltaX, _deltaY, _parent, _callback, true, true, options);
        else if (_shouldScrollX) scrollXBy(_deltaX, _parent, _callback, true, true, options);
        else if (_shouldScrollY) scrollYBy(_deltaY, _parent, _callback, true, true, options);
        else _callback();
    }
}

/**
 * Finds and scrolls all the `scrollableParents` of `container` in order to make it visible on the screen with the specified alignments only if it's not already visible.
 * @param {*} container An instance of `Element` or a `window`.
 * @param {boolean} alignToCenter This value indicates the alignments (on both the x and y axes) of `container`:
 * - `true` if the alignments should be to the `center` of its closest scrollable ancestor
 * - Any other value, if the alignments should to the `closest side`:
 *   the alignments are decided by measuring `container`'s position relative to its closest scrollable ancestor
 * 
 * All `container`'s `scrollableParents` are aligned to `nearest`.
 * @param {function} [callback] A function invoked when `container` is scrolled into view.
 * @param {boolean} includeHiddenParents `true` to include `scrollableParents` with `overflow:hidden`, `overflow-x:hidden` or `overflow-y:hidden` in the search, `false` otherwise.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const scrollIntoViewIfNeeded = (container, alignToCenter = true, callback, includeHiddenParents = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "scrollIntoViewIfNeeded" });

    let _parentIdx = -1;
    const _parents = getAllScrollableParents(container, includeHiddenParents, () => _parentIdx++, options);

    //The container cannot be scrolled into view.
    if (_parentIdx < 0) {
        if (IS_FUNCTION(callback)) callback();
        return;
    }

    let _alignToLeft = NO_VAL;
    let _alignToTop = NO_VAL;
    let _parent = _parents[_parentIdx];
    let _container = _parents[_parentIdx - 1] || container;

    const _callback = () => {
        if (_parentIdx < 1) {
            if (IS_FUNCTION(callback)) callback();
            return;
        }
        _parentIdx--;
        _parent = _parents[_parentIdx];
        _container = _parents[_parentIdx - 1] || container;
        _scrollParent();
    };

    _scrollParent();

    function _scrollParent() {
        //_scrollbarsDimensions[0] = vertical scrollbar's width
        //_scrollbarsDimensions[1] = horizontal scrollbar's height
        const _scrollbarsDimensions = calcScrollbarsDimensions(_parent, false, options);

        //_bordersDimensions[0] = top border size
        //_bordersDimensions[1] = right border size
        //_bordersDimensions[2] = bottom border size
        //_bordersDimensions[3] = left border size
        const _bordersDimensions = calcBordersDimensions(_parent, false, options);

        //Current container position relative to the current parent.
        const { top, right, bottom, left } = _container.getBoundingClientRect();
        const _containerPos = { top, right, bottom, left };

        if (IS_WINDOW(_parent)) {
            _containerPos.right -= _parent.innerWidth;
            _containerPos.bottom -= _parent.innerHeight;
        } else {
            const _parentPos = _parent.getBoundingClientRect();

            _containerPos.top -= _parentPos.top;
            _containerPos.right -= _parentPos.right;
            _containerPos.bottom -= _parentPos.bottom;
            _containerPos.left -= _parentPos.left;
        }

        const _topDelta = _containerPos.top - _bordersDimensions[0];
        const _rightDelta = _containerPos.right + _bordersDimensions[1] + _scrollbarsDimensions[0];
        const _bottomDelta = _containerPos.bottom + _bordersDimensions[2] + _scrollbarsDimensions[1];
        const _leftDelta = _containerPos.left - _bordersDimensions[3];
        const _centerDeltaX = (_leftDelta + _rightDelta) * 0.5;
        const _centerDeltaY = (_topDelta + _bottomDelta) * 0.5;

        //Check if the current container is already visible 
        //or if it's bigger than it's parent.
        const _isOriginalContainer = _container === container;
        const _isIntoViewX = _leftDelta > -0.5 && _rightDelta < 0.5;
        const _isIntoViewY = _topDelta > -0.5 && _bottomDelta < 0.5;
        const _overflowsX = _leftDelta <= 0 && _rightDelta >= 0;
        const _overflowsY = _topDelta <= 0 && _bottomDelta >= 0;

        let _shouldScrollX = (_isOriginalContainer && (alignToCenter || (!_isIntoViewX && !_overflowsX))) ||
                             (!_isOriginalContainer && !_isIntoViewX);

        let _shouldScrollY = (_isOriginalContainer && (alignToCenter || (!_isIntoViewY && !_overflowsY))) ||
                             (!_isOriginalContainer && !_isIntoViewY);

        if (!_shouldScrollX && !_shouldScrollY) {
            _callback();
            return;
        }

        //Possible alignments for the original element: center or nearest.
        //Possible alignments for every other container: nearest.
        if (_isOriginalContainer && alignToCenter) {
            _alignToLeft = NO_VAL;
            _alignToTop = NO_VAL;
        } else {
            if (_shouldScrollX) {
                _alignToLeft = Math.abs(_leftDelta) < Math.abs(_centerDeltaX) ? true :
                               Math.abs(_rightDelta) < Math.abs(_centerDeltaX) ? false : NO_VAL;
            }

            if (_shouldScrollY) {
                _alignToTop = Math.abs(_topDelta) < Math.abs(_centerDeltaY) ? true :
                              Math.abs(_bottomDelta) < Math.abs(_centerDeltaY) ? false : NO_VAL;
            }
        }

        let _deltaX = !_shouldScrollX ? 0 :
                      _alignToLeft === true ? _leftDelta :
                      _alignToLeft === false ? _rightDelta :
                      _centerDeltaX;
        let _deltaY = !_shouldScrollY ? 0 :
                      _alignToTop === true ? _topDelta :
                      _alignToTop === false ? _bottomDelta :
                      _centerDeltaY;

        _deltaX = _deltaX > 0 ? Math.round(_deltaX) : Math.floor(_deltaX);
        _deltaY = _deltaY > 0 ? Math.round(_deltaY) : Math.floor(_deltaY);

        _shouldScrollX = _deltaX !== 0 && getMaxScrollX(_parent, false, options) >= 1;
        _shouldScrollY = _deltaY !== 0 && getMaxScrollY(_parent, false, options) >= 1;

        if (_shouldScrollX && _shouldScrollY) scrollBy(_deltaX, _deltaY, _parent, _callback, true, true, options);
        else if (_shouldScrollX) scrollXBy(_deltaX, _parent, _callback, true, true, options);
        else if (_shouldScrollY) scrollYBy(_deltaY, _parent, _callback, true, true, options);
        else _callback();
    }
}

/**
 * Stops the current scroll-animation on the x-axis of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {function} [callback] A function invoked when the scroll-animation on the x-axis of `container` has been stopped.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const stopScrollingX = (container = _pageScroller, callback, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) {
        TOP_WINDOW.cancelAnimationFrame(_containerData[K_IDX]);

        //No scroll-animation on the y-axis is being performed.
        if (_containerData[K_IDY] === NO_VAL) {
            CLEAR_COMMON_DATA(_containerData);
        } else {
            _containerData[K_IDX] = NO_VAL;  //Scroll id on x-axis
            _containerData[K_CBX] = NO_VAL;  //Scroll callback on x-axis  
        }

        _containerData[K_TSCX] = NO_VAL; //Temporary StepLengthCalculator on the x-axis
    } else if (!INIT_CONTAINER_DATA(container)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "stopScrollingX", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (IS_FUNCTION(callback)) callback();
}

/**
 * Stops the current scroll-animation on the y-axis of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {function} [callback] A function invoked when the scroll-animation on the y-axis of `container` has been stopped.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const stopScrollingY = (container = _pageScroller, callback, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) {
        TOP_WINDOW.cancelAnimationFrame(_containerData[K_IDY]);

        //No scroll-animation on the x-axis is being performed.
        if (_containerData[K_IDX] === NO_VAL) {
            CLEAR_COMMON_DATA(_containerData);
        } else {
            _containerData[K_IDY] = NO_VAL;  //Scroll id on y-axis
            _containerData[K_CBY] = NO_VAL;  //Scroll callback on y-axis  
        }

        _containerData[K_TSCY] = NO_VAL; //Temporary StepLengthCalculator on the y-axis
    } else if (!INIT_CONTAINER_DATA(container)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "stopScrollingY", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (IS_FUNCTION(callback)) callback();
}

/**
 * Stops all the current scroll-animations of `container`.
 * @param {*} [container] An instance of `Element` or a `window`.
 * @param {function} [callback] A function invoked when all the scroll-animations of `container` have been stopped.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
export const stopScrolling = (container = _pageScroller, callback, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) {
        TOP_WINDOW.cancelAnimationFrame(_containerData[K_IDX]);
        TOP_WINDOW.cancelAnimationFrame(_containerData[K_IDY]);

        CLEAR_COMMON_DATA(_containerData);

        _containerData[K_TSCX] = NO_VAL; //Temporary StepLengthCalculator on the x-axis
        _containerData[K_TSCY] = NO_VAL; //Temporary StepLengthCalculator on the y-axis
    } else if (!INIT_CONTAINER_DATA(container)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "stopScrolling", { secondaryMsg: container }, DEFAULT_LOG_OPTIONS));
        return;
    }

    if (IS_FUNCTION(callback)) callback();
}

/**
 * Stops all the current API's scroll-animations.
 * @param {function} [callback] A function invoked when all scroll-animations have been stopped.
 */
export const stopScrollingAll = (callback) => {
    for (const [_container, _containerData] of _containersData.entries()) {
        TOP_WINDOW.cancelAnimationFrame(_containerData[K_IDX]);
        TOP_WINDOW.cancelAnimationFrame(_containerData[K_IDY]);

        CLEAR_COMMON_DATA(_containerData);

        _containerData[K_TSCX] = NO_VAL; //Temporary StepLengthCalculator on the x-axis
        _containerData[K_TSCY] = NO_VAL; //Temporary StepLengthCalculator on the y-axis
    }

    if (IS_FUNCTION(callback)) callback();
}

/**
 * Enables smooth-scrolling for valid anchor links (`<a>` and `<area>` elements) and their `scrollableParents`.
 * @param {boolean} alignToLeft This value indicates the alignment (on the x-axis) of the anchors and their `scrollableParents`:
 * - `true` if the alignment should be to the `left`
 * - `false` if the alignment should be to the `right`
 * - `nearest` **(case insensitive)** if the alignment should to the `closest side`:
 *    the alignment of each container is decided by measuring its position (on the x-axis) relative to its closest scrollable ancestor
 * - Any other value, if the alignment should be to the `center`
 * @param {boolean} alignToTop This value indicates the alignment (on the y-axis) of the anchors and their `scrollableParents`:
 * - `true` if the alignment should be to the `top`
 * - `false` if the alignment should be to the `bottom`
 * - `nearest` **(case insensitive)** if the alignment should to the `closest side`:
 *    the alignment of each container is decided by measuring its position (on the y-axis) relative to its closest scrollable ancestor
 * - Any other value, if the alignment should be to the `center`
 * @param {function} [init] A function that is invoked whenever any valid anchor is clicked.
 * 
 * If `updateHistory` is `true` this function is also called when the user navigates back/forward through the history.
 * 
 * When invoked, `init` is always passed the following input parameters (in this order):
 * - The anchor link that has been clicked
 * - The anchor destination element
 * - The event that triggered it
 * 
 * If `updateHistory` is `true` and the user navigates through the history, the passed anchor is `null`.
 * 
 * If the `init` function is not passed or it's not a function, the propagation of the event that would have triggered it (3rd parameter above) will be stopped.
 * 
 * If `init` returns `false`, no scroll-animation will be executed.
 * @param {function} [callback] A function which is invoked when any valid anchor element is successfully scrolled into view.
 * @param {boolean} includeHiddenParents `true` to include `scrollableParents` with `overflow:hidden`, `overflow-x:hidden` or `overflow-y:hidden` in the search, `false` otherwise.
 * @param {boolean} updateHistory `true` to let the scroll-animations (triggered by the anchor links) update the browser history, `false` otherwise. 
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 */
//TODO: add a cypress test for hrefSetup using the concepts of scrollIntoView/IfNeeded tests
export const hrefSetup = (alignToLeft = true, alignToTop = true, init, callback, includeHiddenParents = false, updateHistory = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "hrefSetup" });

    const _init = IS_FUNCTION(init) ? init : (anchor, el, event) => event.stopPropagation();
    const _pageURL = THIS_WINDOW.location.href.split("#")[0]; //location.href = optionalURL#fragment
    const _updateHistory =
        updateHistory &&
        THIS_WINDOW.history &&
        THIS_WINDOW.history.scrollRestoration; //Check if histoy manipulation is supported

    const scrollToFragment = (pageLink, fragment, event, updateHistoryIfNeeded) => {
        //Invalid fragment.
        if (fragment === NO_FGS) return;

        //href is "url#" or "url/".
        if (fragment === "") {
            //Scroll prevented by user.
            if (_init(pageLink, _pageScroller, event) === false) return;

            updateHistoryIfNeeded(fragment);
            scrollTo(0, 0, _pageScroller, callback, false, options);
            return;
        }

        //Look for elements with the corresponding id or "name" attribute.
        const _fragmentElement = document.getElementById(fragment) ||
                                 document.querySelector("a[name='" + fragment + "']");

        //Invalid fragment or scroll prevented by user.
        if (!_fragmentElement || _init(pageLink, _fragmentElement, event) === false) return;

        updateHistoryIfNeeded(fragment);
        scrollIntoView(_fragmentElement, alignToLeft, alignToTop, callback, includeHiddenParents, options);
    }

    /**
     * Note that:
     * pageLink.href = optionalURL#fragment
     * pageLink.hash = #fragment
     */
    for (const pageLink of document.links) {
        const _optionalURL = pageLink.href.split("#")[0];

        //The url points to another website.
        if (_optionalURL !== _pageURL) continue;

        const _fragment = pageLink.hash.slice(1);

        //href is "optionalURL#fragment".
        if (_fragment !== "") {
            //Look for elements with the corresponding id or "name" attribute.
            const _fragmentElement = document.getElementById(_fragment) ||
                                     document.querySelector("a[name='" + _fragment + "']");
            if (!_fragmentElement) {
                _warningLogger(
                    {
                        subject: "#" + _fragment,
                        primaryMsg: DEFAULT_WARNING_PRIMARY_MSG_1,
                        useSubjectQuotes: true
                    }
                );
                continue;
            }
        }

        const _oldData = _containersData.get(pageLink);
        const _containerData = _oldData || [];

        //pageLink not supported.
        if (!_oldData && !INIT_CONTAINER_DATA(pageLink, _containerData)) continue;

        //pageLink already managed.
        if (_containerData[K_FGS] !== NO_VAL) continue;

        //Cache the fragment for later. 
        _containerData[K_FGS] = _fragment;

        //The extra "." at the end of the fragment is used to prevent Safari from restoring
        //the scroll position before the popstate event (it won't recognize the fragment). 
        const _updateHistoryIfNeeded = _updateHistory ?
            (fragment) => {
                if (THIS_WINDOW.history.state !== fragment) {
                    THIS_WINDOW.history.pushState(fragment, "", "#" + fragment + ".");
                }
            } : () => { };

        //href="#fragment" scrolls the element associated with the fragment into view.
        pageLink.addEventListener("click", event => {
            const _containerData = _containersData.get(pageLink);
            const _fragment = _containerData[K_FGS];

            //Check if pageLink points to another page.
            if (_fragment === NO_FGS) {
                const _pageURL = THIS_WINDOW.location.href.split("#")[0]; //location.href = optionalURL#fragment
                const _optionalURL = pageLink.href.split("#")[0];
                if (_optionalURL !== _pageURL) return;
            }

            event.preventDefault();

            scrollToFragment(
                pageLink,
                _fragment,
                event,
                _updateHistoryIfNeeded,
            )
        }, { passive: false });
    }

    /**
     * Prevents the browser to jump-to-position,
     * when a user navigates through history.
     */
    if (_updateHistory) {
        const _oldData = _containersData.get(THIS_WINDOW);
        const _containerData = _oldData || [];
        if (!_oldData) INIT_CONTAINER_DATA(THIS_WINDOW, _containerData);

        //History already managed.
        if (_containerData[K_FGS] !== NO_VAL) return;

        //THIS_WINDOW's fragment is dynamically calculated every time,
        //because it's faster than caching.
        _containerData[K_FGS] = NO_FGS;

        const _smoothHistoryNavigation = (event) => scrollToFragment(
            NO_VAL,
            THIS_WINDOW.location.hash.slice(1, -1), //Remove the extra "." in the fragment
            event,
            () => { },
        );

        THIS_WINDOW.history.scrollRestoration = "manual";
        THIS_WINDOW.addEventListener("popstate", _smoothHistoryNavigation, { passive: true });
        THIS_WINDOW.addEventListener("unload", (event) => event.preventDefault(), { passive: false, once: true });

        //Checks if the page initially have a URL containing
        //a valid fragment and scrolls to it if necessary.
        if (document.readyState === "complete") _smoothHistoryNavigation(new Event("load"));
        else THIS_WINDOW.addEventListener("load", _smoothHistoryNavigation, { passive: true, once: true });
    }
}



const ussInit = () => {
    //Set the _reducedMotion.
    try { //Chrome, Firefox & Safari >= 14
        TOP_WINDOW.matchMedia("(prefers-reduced-motion)").addEventListener("change", () => {
            _reducedMotion = TOP_WINDOW.matchMedia("(prefers-reduced-motion)").matches;
            stopScrollingAll();
        }, { passive: true });
    } catch (addEventListenerNotSupported) { //Safari < 14
        TOP_WINDOW.matchMedia("(prefers-reduced-motion)").addListener(() => {
            _reducedMotion = TOP_WINDOW.matchMedia("(prefers-reduced-motion)").matches;
            stopScrollingAll();
        });
    }

    //Calculate the _scrollbarsMaxDimension.
    getScrollbarsMaxDimension();

    //Calculate the window scroller relative to THIS_WINDOW.
    getWindowScroller(THIS_WINDOW);

    //Calculate the page scroller relative to THIS_WINDOW.
    getPageScroller(THIS_WINDOW);

    //Calculate the average frames' time of the user's screen. 
    let _currentMeasurementsLeft = 60; //Do 60 measurements to establish the initial value
    const _measureFramesTime = () => {
        if (_currentMeasurementsLeft > 0) {
            _currentMeasurementsLeft--;
            calcFramesTimes(NO_VAL, NO_VAL, _measureFramesTime);
        }

        //_minAnimationFrame = 1000 / _framesTime; //<---------------------------------------------------------------------TO LOOK MORE INTO
    }
    _measureFramesTime();
}

if (document.readyState === "complete") ussInit();
else THIS_WINDOW.addEventListener("load", ussInit, { passive: true, once: true });