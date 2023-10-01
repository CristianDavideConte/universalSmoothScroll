//TODO: move comments above the functions signatures.
//TODO: perhaps unify the MUTATION_OBSERVER.entries and the RESIZE_OBSERVER.entries
//TODO: rename the "fixed" StepLengthCalculator to "permanent" StepLengthCalculator
//TODO: rename "forceCalculation" to "flushCache"

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
    K_FSCX,
    K_FSCY,
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
    NO_VAL,
    NO_SP,
    NO_FGS,
    FRM_TMS_PHASE,
    FRM_TMS_SUM,
    INITIAL_WINDOW_WIDTH,
    INITIAL_WINDOW_HEIGHT,
    DEFAULT_XSTEP_LENGTH,
    DEFAULT_YSTEP_LENGTH,
    DEFAULT_MIN_ANIMATION_FRAMES,
    DEFAULT_FRAME_TIME,
    HIGHEST_SAFE_SCROLL_POS,
    REGEX_ALIGNMENT_NEAREST,
    REGEX_OVERFLOW,
    REGEX_OVERFLOW_HIDDEN,
    REGEX_OVERFLOW_WITH_VISIBLE,
    REGEX_OVERFLOW_HIDDEN_WITH_VISIBLE,
    MERGE_OBJECTS,
    CREATE_LOG_OPTIONS,
    CLEAR_COMMON_DATA,
    DEFAULT_XSTEP_LENGTH_CALCULATOR,
    DEFAULT_YSTEP_LENGTH_CALCULATOR,
    DEFAULT_ERROR_LOGGER,
    DEFAULT_WARNING_LOGGER,
    CHECK_INSTANCEOF,
    DEFAULT_WARNING_PRIMARY_MSG_1,
    DEFAULT_WARNING_PRIMARY_MSG_2
} from "./common.js"

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
        if (DEFAULT_RESIZE_OBSERVER.debouncedFrames < DEFAULT_RESIZE_OBSERVER.totalDebounceFrames) {
            DEFAULT_RESIZE_OBSERVER.debouncedFrames++;
            DEFAULT_RESIZE_OBSERVER.callbackFrameId = window.requestAnimationFrame(DEFAULT_RESIZE_OBSERVER.callback);
            return;
        }

        //TODO: does it make sense to clear the cache for the scrollable parents on resize?
        for (const [target, resizeObject] of DEFAULT_RESIZE_OBSERVER.entries) {
            if (!resizeObject.hasResized) continue;

            const _containerData = _containersData.get(target);

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
        if (DEFAULT_MUTATION_OBSERVER.debouncedFrames < DEFAULT_MUTATION_OBSERVER.totalDebounceFrames) {
            DEFAULT_MUTATION_OBSERVER.debouncedFrames++;
            DEFAULT_MUTATION_OBSERVER.callbackFrameId = window.requestAnimationFrame(DEFAULT_MUTATION_OBSERVER.callback);
            return;
        }

        for (const [target, mutationObject] of DEFAULT_MUTATION_OBSERVER.entries) {
            if (!mutationObject.hasMutated) continue;

            const _containerData = _containersData.get(target);

            /**
             * Change the element's frangment string if its href attribute has changed. 
             */
            if (mutationObject.hasModifiedAttributes) {
                const _pageURL = window.location.href.split("#")[0]; //location.href = optionalURL#fragment
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
                    if (container !== window && removedNode.contains(container)) {
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
const INIT_CONTAINER_DATA = (container, containerData = []) => {
    if (container === window) {
        let _debounceResizeEvent = false;

        window.addEventListener("resize", () => {
            //Update the internal Window sizes.
            _windowWidth = window.innerWidth;
            _windowHeight = window.innerHeight;

            //Make the resize callback fire only once per frame like the resize observer.
            if (_debounceResizeEvent) return;

            _debounceResizeEvent = true;
            window.requestAnimationFrame(() => _debounceResizeEvent = false);

            //Emulate what the DEFAULT_RESIZE_OBSERVER does for all the other containers.
            DEFAULT_RESIZE_OBSERVER.debouncedFrames = 0;

            const _resizeObject = DEFAULT_RESIZE_OBSERVER.entries.get(window);

            _resizeObject.hasResized = true;

            //Update the target size.
            _resizeObject.width = _windowWidth;
            _resizeObject.height = _windowHeight;

            //Schedule the execution of DEFAULT_RESIZE_OBSERVER.callback if needed.
            if (DEFAULT_RESIZE_OBSERVER.callbackFrameId === NO_VAL) {
                DEFAULT_RESIZE_OBSERVER.callbackFrameId = window.requestAnimationFrame(DEFAULT_RESIZE_OBSERVER.callback);
            }
        }, { passive: true });

        //Set a default resizeObject.
        DEFAULT_RESIZE_OBSERVER.entries.set(
            window,
            {
                hasResized: false,
                width: _windowWidth,
                height: _windowHeight,
            }
        );

        //The Window doesn't have any scrollable parent.
        containerData[K_SSPX] = NO_SP;
        containerData[K_HSPX] = NO_SP;
        containerData[K_SSPY] = NO_SP;
        containerData[K_HSPY] = NO_SP;

        containerData[K_SCX] = () => window.scrollX; //ScrollXCalculator
        containerData[K_SCY] = () => window.scrollY; //ScrollYCalculator
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

export let _containersData = new Map(); //TODO: perhaps const?
export let _xStepLength = DEFAULT_XSTEP_LENGTH;
export let _yStepLength = DEFAULT_YSTEP_LENGTH;
export let _minAnimationFrame = DEFAULT_MIN_ANIMATION_FRAMES;
export let _windowWidth = INITIAL_WINDOW_WIDTH;
export let _windowHeight = INITIAL_WINDOW_HEIGHT;
export let _scrollbarsMaxDimension = NO_VAL;
export let _framesTime = DEFAULT_FRAME_TIME;
export let _framesTimes = []; //TODO: perhaps const?
export let _windowScroller = NO_VAL;
export let _pageScroller = NO_VAL;
export let _reducedMotion = "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches;
export let _debugMode = "";
export let _errorLogger = DEFAULT_ERROR_LOGGER;
export let _warningLogger = DEFAULT_WARNING_LOGGER;

export const getXStepLength = () => _xStepLength;
export const getYStepLength = () => _yStepLength;
export const getMinAnimationFrame = () => _minAnimationFrame;
export const getWindowWidth = () => _windowWidth;
export const getWindowHeight = () => _windowHeight;
export const getReducedMotionState = () => _reducedMotion;
export const getDebugMode = () => _debugMode;


/**
 * Checks whether `container` is being scrolled horizontally.
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns `true` if a scroll-animation on the x-axis of `container` is currently being performed, `false` otherwise.
 */
export const isXScrolling = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return !!_containerData[K_IDX];

    if (INIT_CONTAINER_DATA(container)) return false;

    _errorLogger(CREATE_LOG_OPTIONS(options, "isXScrolling", { secondaryMsg: container }));
}


/**
 * Checks whether `container` is being scrolled vertically.
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns `true` if a scroll-animation on the y-axis of `container` is currently being performed, `false` otherwise.
 */
export const isYScrolling = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return !!_containerData[K_IDY];

    if (INIT_CONTAINER_DATA(container)) return false;

    _errorLogger(CREATE_LOG_OPTIONS(options, "isYScrolling", { secondaryMsg: container }));
}


/**
 * Checks whether `container` is being scrolled.
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns `true` if a scroll-animation is currently being performed on `container`, `false` otherwise.
 */
export const isScrolling = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return !!(_containerData[K_IDX] || _containerData[K_IDY]);

    if (INIT_CONTAINER_DATA(container)) return false;

    _errorLogger(CREATE_LOG_OPTIONS(options, "isScrolling", { secondaryMsg: container }));
}


/**
 * Returns the horizontal pixel position `container` has to reach.
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns Returns the target `scrollLeft`/`scrollX` pixel position of `container`.
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
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns Returns the target `scrollTop`/`scrollY` pixel position of `container`.
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
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns `1` if the target `scrollLeft`/`scrollX` is higher than the current one, `-1` it's lower, `0` otherwise.
 */
export const getScrollXDirection = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    //If there's no scroll-animation, 0 is returned.
    if (_containerData) return _containerData[K_SDX] || 0;

    if (INIT_CONTAINER_DATA(container)) return 0;

    _errorLogger(CREATE_LOG_OPTIONS(options, "getScrollXDirection", { secondaryMsg: container }));
}


/**
 * Returns the direction of the current scroll-animation on the y-axis of `container`.
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns `1` if the target `scrollTop`/`scrollY` is higher than the current one, `-1` it's lower, `0` otherwise.
 */
export const getScrollYDirection = (container = _pageScroller, options) => {
    const _containerData = _containersData.get(container);

    //If there's no scroll-animation, 0 is returned.
    if (_containerData) return _containerData[K_SDY] || 0;

    if (INIT_CONTAINER_DATA(container)) return 0;

    _errorLogger(CREATE_LOG_OPTIONS(options, "getScrollYDirection", { secondaryMsg: container }));
}


/**
 * Returns a `StepLengthCalculator` set for `container`.
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} getTemporary If `true` returns the `temporary` `StepLengthCalculator` set for the x-axis of `container`, otherwise returns the `fixed` one.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns The ease function which currently controls the scroll-animations on the x-axis of `container`.
 */
export const getXStepLengthCalculator = (container = _pageScroller, getTemporary = false, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return getTemporary ? _containerData[K_TSCX] : _containerData[K_FSCX];

    if (INIT_CONTAINER_DATA(container)) return;

    _errorLogger(CREATE_LOG_OPTIONS(options, "getXStepLengthCalculator", { secondaryMsg: container }));
}


/**
 * Returns a `StepLengthCalculator` set for `container`.
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} getTemporary If `true` returns the `temporary` `StepLengthCalculator` set for the y-axis of `container`, otherwise returns the `fixed` one.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns The ease function which currently controls the scroll-animations on the y-axis of `container`.
 */
export const getYStepLengthCalculator = (container = _pageScroller, getTemporary = false, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) return getTemporary ? _containerData[K_TSCY] : _containerData[K_FSCY];

    if (INIT_CONTAINER_DATA(container)) return;

    _errorLogger(CREATE_LOG_OPTIONS(options, "getYStepLengthCalculator", { secondaryMsg: container }));
}


/**
 * Returns the highest number of pixels a (browser) scrollbar can occupy. 
 * @param {*} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise the value is returned from cache.  
 * @returns The value of the `_scrollbarsMaxDimension` property.
 */
export const getScrollbarsMaxDimension = (forceCalculation = false) => {
    /**
     * Calculate the maximum sizes of scrollbars on the webpage by:
     * - creating a <div> with id = "_uss-scrollbox"
     * - giving that <div> a mini-stylesheet that forces it to show the scrollbars 
     */
    if (forceCalculation || _scrollbarsMaxDimension === NO_VAL) {
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
        _scrollbarsMaxDimension = _scrollBox.offsetHeight - _scrollBox.clientHeight;
        document.body.removeChild(_scrollBox);
        document.head.removeChild(_scrollBoxStyle);
    }

    return _scrollbarsMaxDimension;
}


/**
 * Returns the element that scrolls `window` when it's scrolled and that (viceversa) is scrolled when `window` is scrolled.
 * @param {*} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise the value is returned from cache.  
 * @returns The value of the `_windowScroller` property.
 */
export const getWindowScroller = (forceCalculation = false) => {
    if (forceCalculation || !_windowScroller) {
        const _oldData = _containersData.get(window);
        const _containerData = _oldData || [];
        if (!_oldData) INIT_CONTAINER_DATA(window, _containerData);

        const _body = document.body;
        const _html = document.documentElement;

        const _windowInitialX = window.scrollX;
        const _windowInitialY = window.scrollY;
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

        //Neither _html nor _body have the same scrollPosition of Window.
        if (_elementsIndex === 0) {
            _windowScroller = window;
            return _windowScroller;
        }

        let _maxScrollX = _containerData[K_MSX] !== NO_VAL ? _containerData[K_MSX] : HIGHEST_SAFE_SCROLL_POS;
        let _maxScrollY = _containerData[K_MSY] !== NO_VAL ? _containerData[K_MSY] : HIGHEST_SAFE_SCROLL_POS;

        if (
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
        if (_maxScrollX === 0 && _maxScrollY === 0) {
            _windowScroller = window;
            return _windowScroller;
        }

        //The Window was already at its maxScrollX/maxScrollY.
        if (_windowInitialX === _maxScrollX && _windowInitialY === _maxScrollY) {
            //Try to scroll the body/html by scrolling the Window.
            window.scroll(0, 0);
        }

        let _windowScrollerFound = false;
        for (const element of _elementsToTest) {
            if (
                window.scrollX === element.scrollLeft &&
                window.scrollY === element.scrollTop
            ) {
                //Cache the maxScrollX/maxScrollY.
                const _elementOldData = _containersData.get(element);
                const _elementData = _elementOldData || [];
                _elementData[K_MSX] = _maxScrollX;
                _elementData[K_MSY] = _maxScrollY;

                if (!_elementOldData) INIT_CONTAINER_DATA(element, _elementData);

                _windowScroller = element;
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
        if (!_windowScrollerFound) _windowScroller = window;
    }

    return _windowScroller;
}


/**
 * Returns the element that scrolls the document.
 * @param {*} forceCalculation If `true` the value is calculated on the fly (expensive operation), otherwise the value is returned from cache.  
 * @returns The value of the `_pageScroller` property.
 */
//TODO: is the options object needed here?
export const getPageScroller = (forceCalculation = false) => {
    //Check if the _pageScroller has already been calculated.
    if (forceCalculation || !_pageScroller) {
        const _body = document.body;
        const _html = document.documentElement;

        const [_htmlMaxScrollX, _htmlMaxScrollY] = getMaxScrolls(_html, forceCalculation);
        const [_bodyMaxScrollX, _bodyMaxScrollY] = getMaxScrolls(_body, forceCalculation);

        /**
         * The _pageScroller is the element that scrolls the further between _html and _body.
         * If there's a tie or neither of those can scroll, it's defaulted to `window`.
         */
        if (
            (_htmlMaxScrollX > _bodyMaxScrollX && _htmlMaxScrollY >= _bodyMaxScrollY) ||
            (_htmlMaxScrollX >= _bodyMaxScrollX && _htmlMaxScrollY > _bodyMaxScrollY)
        ) {
            _pageScroller = _html;
        } else if (
            (_bodyMaxScrollX > _htmlMaxScrollX && _bodyMaxScrollY >= _htmlMaxScrollY) ||
            (_bodyMaxScrollX >= _htmlMaxScrollX && _bodyMaxScrollY > _htmlMaxScrollY)
        ) {
            _pageScroller = _body;
        } else {
            _pageScroller = window;
        }
    }

    return _pageScroller;
}


/**
 * Returns the time (in ms) between two consecutive browser's frame repaints (e.g. 16.6ms at 60fps).
 * @param {*} forceCalculation If `true`, `calcFramesTimes` is internally called to initialize a new frames' time calculation, otherwise just acts as a getter.
 * @param {*} callback A callback function passed to `calcFramesTimes` if `forceCalculat ion` is `true` (deferred execution), otherwise immediately executed.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 * @returns The value of the `_framesTime` property.
 */
export const getFramesTime = (forceCalculation = false, callback, options) => {
    options = MERGE_OBJECTS(options, { subject: "getFramesTime", requestPhase: 0 });

    if (forceCalculation) calcFramesTimes(NO_VAL, NO_VAL, callback, options);
    else if (typeof callback === "function") callback();
    return _framesTime;
}


/**
 * Sets (or unsets if specified) the `StepLengthCalculator` for the x-axis of `container`.
 * @param {*} newCalculator A `StepLengthCalculator` or `undefined`. 
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} isTemporary If true `newCalculator` will be set as a temporary `StepLengthCalculator` of `container`, otherwise it will be set a `fixed` one.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 */
export const setXStepLengthCalculator = (newCalculator, container = _pageScroller, isTemporary = false, options) => {
    const _isSettingOp = newCalculator !== undefined;
    if (typeof newCalculator !== "function" && _isSettingOp) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setXStepLengthCalculator", { secondaryMsg: newCalculator, idx: 1 }));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setXStepLengthCalculator", { secondaryMsg: newCalculator, idx: 0 }));
        return;
    }

    if (isTemporary) {
        _containerData[K_TSCX] = newCalculator;
    } else {
        _containerData[K_FSCX] = newCalculator;

        //Setting a fixed StepLengthCalculator will unset the temporary one.
        if (_isSettingOp) _containerData[K_TSCX] = NO_VAL;
    }
}


/**
 * Sets (or unsets if specified) the `StepLengthCalculator` for the y-axis of `container`.
 * @param {*} newCalculator A `StepLengthCalculator` or `undefined`. 
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} isTemporary If true `newCalculator` will be set as a temporary `StepLengthCalculator` of `container`, otherwise it will be set a `fixed` one.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 */
export const setYStepLengthCalculator = (newCalculator, container = _pageScroller, isTemporary = false, options) => {
    const _isSettingOp = newCalculator !== undefined;
    if (typeof newCalculator !== "function" && _isSettingOp) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setYStepLengthCalculator", { secondaryMsg: newCalculator, idx: 1 }));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setYStepLengthCalculator", { secondaryMsg: newCalculator, idx: 0 }));
        return;
    }

    if (isTemporary) {
        _containerData[K_TSCY] = newCalculator;
    } else {
        _containerData[K_FSCY] = newCalculator;

        //Setting a fixed StepLengthCalculator will unset the temporary one.
        if (_isSettingOp) _containerData[K_TSCY] = NO_VAL;
    }
}


/**
 * Sets (or unsets if specified) the `StepLengthCalculator` for the both axes of `container`.
 * @param {*} newCalculator A `StepLengthCalculator` or `undefined`. 
 * @param {*} container An instance of `Element` or `window`.
 * @param {*} isTemporary If true `newCalculator` will be set as a temporary `StepLengthCalculator` of `container`, otherwise it will be set a `fixed` one.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 */
export const setStepLengthCalculator = (newCalculator, container = _pageScroller, isTemporary = false, options) => {
    const _isSettingOp = newCalculator !== undefined;
    if (typeof newCalculator !== "function" && _isSettingOp) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setStepLengthCalculator", { secondaryMsg: newCalculator, idx: 1 }));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setStepLengthCalculator", { secondaryMsg: newCalculator, idx: 0 }));
        return;
    }

    if (isTemporary) {
        _containerData[K_TSCX] = newCalculator;
        _containerData[K_TSCY] = newCalculator;
    } else {
        _containerData[K_FSCX] = newCalculator;
        _containerData[K_FSCY] = newCalculator;

        //Setting a fixed StepLengthCalculator will unset the temporary one.
        if (_isSettingOp) {
            _containerData[K_TSCX] = NO_VAL;
            _containerData[K_TSCY] = NO_VAL;
        }
    }
}


/**
 * Sets (or unsets if specified) the default number of pixels scrolled during a single scroll-animation's step (`_xStepLength` property) on the x-axis of all containers. 
 * @param {*} newStepLength A finite `Number` > 0.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 */
export const setXStepLength = (newStepLength = DEFAULT_XSTEP_LENGTH, options) => {
    if (!Number.isFinite(newStepLength) || newStepLength <= 0) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setXStepLength", { secondaryMsg: newStepLength }));
        return;
    }
    _xStepLength = newStepLength;
}


/**
 * Sets (or unsets if specified) the default number of pixels scrolled during a single scroll-animation's step (`_yStepLength` property) on the y-axis of all containers. 
 * @param {*} newStepLength A finite `Number` > 0.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 */
export const setYStepLength = (newStepLength = DEFAULT_YSTEP_LENGTH, options) => {
    if (!Number.isFinite(newStepLength) || newStepLength <= 0) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setYStepLength", { secondaryMsg: newStepLength }));
        return;
    }
    _yStepLength = newStepLength;
}


/**
 * Sets the default number of pixels scrolled during a single scroll-animation's step (`_xStepLength` and `_yStepLength` properties) on any axis of all containers. 
 * @param {*} newStepLength A finite `Number` > 0.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 */
export const setStepLength = (newStepLength, options) => {
    //TODO: use undefined to unset the values as in the setXStepLength and setYStepLength functions + change comments
    if (!Number.isFinite(newStepLength) || newStepLength <= 0) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setStepLength", { secondaryMsg: newStepLength }));
        return;
    }
    _xStepLength = newStepLength;
    _yStepLength = newStepLength;
}


/**
 * Sets (or unsets if requested) the minimum number of frames any scroll-animation should last by default (`_minAnimationFrame` property).
 * @param {*} newMinAnimationFrame A finite `Number` > 0.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 */
export const setMinAnimationFrame = (newMinAnimationFrame = DEFAULT_MIN_ANIMATION_FRAMES, options) => {
    if (!Number.isFinite(newMinAnimationFrame) || newMinAnimationFrame <= 0) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setMinAnimationFrame", { secondaryMsg: newMinAnimationFrame }));
        return;
    }
    _minAnimationFrame = newMinAnimationFrame;
}


/**
 * Tells the API which Element scrolls the document (`_pageScroller` property). 
 * @param {*} newPageScroller An instance of `Element` or `window`.
 * @param {*} options `[Private]` The input object used by the uss loggers.
 */
export const setPageScroller = (newPageScroller, options) => {
    if (!_containersData.get(newPageScroller) && !INIT_CONTAINER_DATA(newPageScroller)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setPageScroller", { secondaryMsg: newPageScroller }));
        return;
    }
    _pageScroller = newPageScroller;
}



//TODO: add cypress tests
export const addResizeCallback = (newCallback, container = _pageScroller, options) => {
    if (typeof newCallback !== "function") {
        _errorLogger(CREATE_LOG_OPTIONS(options, "addResizeCallback", { secondaryMsg: newCallback, idx: 1 }));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "addResizeCallback", { secondaryMsg: newCallback, idx: 0 }));
        return;
    }

    _containerData[K_RCBQ].push(newCallback);
}



//TODO: add cypress tests
export const addMutationCallback = (newCallback, container = _pageScroller, options) => {
    if (typeof newCallback !== "function") {
        _errorLogger(CREATE_LOG_OPTIONS(options, "addMutationCallback", { secondaryMsg: newCallback, idx: 1 }));
        return;
    }

    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (container === window || (!_oldData && !INIT_CONTAINER_DATA(container, _containerData))) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "addMutationCallback", { secondaryMsg: newCallback, idx: 0 }));
        return;
    }

    _containerData[K_MCBQ].push(newCallback);
}


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


export const setErrorLogger = (newErrorLogger = DEFAULT_ERROR_LOGGER, options) => {
    if (typeof newErrorLogger !== "function") {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setErrorLogger", { secondaryMsg: newErrorLogger }));
        return;
    }
    _errorLogger = newErrorLogger;
}

export const setWarningLogger = (newWarningLogger = DEFAULT_WARNING_LOGGER, options) => {
    if (typeof newWarningLogger !== "function") {
        _errorLogger(CREATE_LOG_OPTIONS(options, "setWarningLogger", { secondaryMsg: newWarningLogger }));
        return;
    }
    _warningLogger = newWarningLogger;
}

export const calcFramesTimes = (previousTimestamp, currentTimestamp, callback, options) => {
    options = MERGE_OBJECTS(options, { subject: "calcFramesTimes", requestPhase: 0 });

    /**
     * _framesTime[FRM_TMS_PHASE] contains the status of the previous requested frames' time recalculation.
     * options.requestPhase contains the status of the current requested frames' time recalculation.
     * If they don't match, a frames's time recalculation has already been requested but the previous
     * one hasn't been completed yet.
     */
    if (_framesTimes[FRM_TMS_PHASE] && _framesTimes[FRM_TMS_PHASE] !== options.requestPhase) return;

    if (!Number.isFinite(previousTimestamp) || previousTimestamp < 0) {
        options.requestPhase = 1;
        _framesTimes[FRM_TMS_PHASE] = 1;
        window.requestAnimationFrame((timestamp) => calcFramesTimes(timestamp, currentTimestamp, callback, options));
        return;
    }

    if (!Number.isFinite(currentTimestamp) || currentTimestamp < 0) {
        options.requestPhase = 2;
        _framesTimes[FRM_TMS_PHASE] = 2;
        window.requestAnimationFrame((timestamp) => calcFramesTimes(previousTimestamp, timestamp, callback, options));
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

    if (typeof callback === "function") callback();
}

export const calcXScrollbarDimension = (container = _pageScroller, forceCalculation = false, options) => {
    return calcScrollbarsDimensions(container, forceCalculation, MERGE_OBJECTS(options, { subject: "calcXScrollbarDimension" }))[0];
}

export const calcYScrollbarDimension = (container = _pageScroller, forceCalculation = false, options) => {
    return calcScrollbarsDimensions(container, forceCalculation, MERGE_OBJECTS(options, { subject: "calcYScrollbarDimension" }))[1];
}

export const calcScrollbarsDimensions = (container = _pageScroller, forceCalculation = false, options) => {
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    /**
     * Only instances of HTMLElement and SVGElement have the style property, and they both implement Element.
     * All the other unsupported implementations are filtered out by the checking style property later.
     */
    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "calcScrollbarsDimensions", { secondaryMsg: container }));
        return;
    }

    if (
        forceCalculation ||
        _containerData[K_VSB] === NO_VAL ||
        _containerData[K_HSB] === NO_VAL
    ) {
        const _windowScroller = getWindowScroller();

        if (container === window && window !== _windowScroller) {
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
                const _style = window.getComputedStyle(container);

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

            //If the container is the windowScroller, cache the values for the window too.
            if (container === _windowScroller) {
                const _windowOldData = _containersData.get(window);
                const _windowData = _windowOldData || [];

                _windowData[K_VSB] = _containerData[K_VSB];
                _windowData[K_HSB] = _containerData[K_HSB];

                if (!_windowOldData) INIT_CONTAINER_DATA(window, _windowData);
            }
        }
    }

    return [
        _containerData[K_VSB], //Vertical scrollbar's width
        _containerData[K_HSB]  //Horizontal scrollbar's height
    ];
}

export const calcBordersDimensions = (container = _pageScroller, forceCalculation = false, options) => {
    //Check if the bordersDimensions of the passed container have already been calculated. 
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "calcBordersDimensions", { secondaryMsg: container }));
        return;
    }

    if (
        forceCalculation ||
        _containerData[K_TB] === NO_VAL ||
        _containerData[K_RB] === NO_VAL ||
        _containerData[K_BB] === NO_VAL ||
        _containerData[K_LB] === NO_VAL
    ) {
        if (container === window) {
            const _windowScroller = getWindowScroller();
            const _bordersDimensions = _windowScroller === window ?
                [0, 0, 0, 0] :
                calcBordersDimensions(_windowScroller, forceCalculation, options);

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
            } catch (getComputedStyleNotSupported) {
                //window.getComputedStyle() may not work on the passed container 
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

export const getScrollXCalculator = (container = _pageScroller, options) => {
    return getScrollCalculators(container, MERGE_OBJECTS(options, { subject: "getScrollXCalculator" }))[0];
}

export const getScrollYCalculator = (container = _pageScroller, options) => {
    return getScrollCalculators(container, MERGE_OBJECTS(options, { subject: "getScrollYCalculator" }))[1];
}

export const getScrollCalculators = (container = _pageScroller, options) => {
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getScrollCalculators", { secondaryMsg: container }));
        return;
    }

    return [_containerData[K_SCX], _containerData[K_SCY]];
}

export const getMaxScrollX = (container = _pageScroller, forceCalculation = false, options) => {
    return getMaxScrolls(container, forceCalculation, MERGE_OBJECTS(options, { subject: "getMaxScrollX" }))[0];
}

export const getMaxScrollY = (container = _pageScroller, forceCalculation = false, options) => {
    return getMaxScrolls(container, forceCalculation, MERGE_OBJECTS(options, { subject: "getMaxScrollY" }))[1];
}

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

    let _windowScroller = getWindowScroller();
    _windowScroller = (container !== window && _windowScroller === container) ? window :
        (container === window && _windowScroller !== window) ? _windowScroller :
            NO_VAL;
    //Bidirectionally cache the value for the window/windowScroller too.
    if (_windowScroller) {
        const _windowScrollerOldData = _containersData.get(_windowScroller);
        const _windowScrollerData = _windowScrollerOldData || [];

        _windowScrollerData[K_MSX] = _containerData[K_MSX];
        _windowScrollerData[K_MSY] = _containerData[K_MSY];

        if (!_windowScrollerOldData) INIT_CONTAINER_DATA(_windowScroller, _windowScrollerData);
    }

    return [_containerData[K_MSX], _containerData[K_MSY]];
}




//TODO: Add cypress tests
export const getBorderBox = (container, options) => {
    //Check if the borderBox of the passed container has already been calculated. 
    const _oldData = _containersData.get(container);
    const _containerData = _oldData || [];

    if (!_oldData && !INIT_CONTAINER_DATA(container, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getBorderBox", { secondaryMsg: container }));
        return;
    }

    if (_containerData[K_BRB] === NO_VAL) {
        const _containerRect = container !== window ? container.getBoundingClientRect() :
            { width: _windowWidth, height: _windowHeight };

        _containerData[K_BRB] = {
            width: _containerRect.width,
            height: _containerRect.height,
        }
    }

    return _containerData[K_BRB];
}

//TODO: element should be called container and _container should be called _parent
export const getXScrollableParent = (element, includeHiddenParents = false, options) => {
    const _oldData = _containersData.get(element);
    const _containerData = _oldData || [];
    const _cachedParent = includeHiddenParents ? _containerData[K_HSPX] : _containerData[K_SSPX];

    if (_cachedParent !== NO_VAL) return _cachedParent;

    if (!_oldData && !INIT_CONTAINER_DATA(element, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getXScrollableParent", { secondaryMsg: element }));
        return;
    }

    if (element === window) {
        _containerData[K_HSPX] = NO_SP;
        _containerData[K_HSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        return NO_SP;
    }

    options = MERGE_OBJECTS(options, { subject: "getXScrollableParent" });

    const _body = document.body;
    const _html = document.documentElement;
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

    const _elementInitialX = element.getBoundingClientRect().left;
    const _windowScroller = getWindowScroller();
    let _container = element.parentElement;

    const _isScrollableParent = (overflowRegex) => {
        //The x-axis should be tested.
        if (
            _container === window ||
            overflowRegex.test(window.getComputedStyle(_container).overflowX)
        ) {
            if (_container === _windowScroller) _container = window;

            const [_scrollXCalculator, _scrollYCalculator] = getScrollCalculators(_container, options);
            const _containerInitialX = _scrollXCalculator();
            const _containerInitialY = _scrollYCalculator();

            const _containerData = _containersData.get(_container);
            let _maxScrollX = _containerData[K_MSX] !== NO_VAL ? _containerData[K_MSX] : HIGHEST_SAFE_SCROLL_POS;

            if (_maxScrollX > 0 && _containerInitialX !== _maxScrollX) {
                //Try to scroll the element by scrolling the parent.
                _container.scroll(HIGHEST_SAFE_SCROLL_POS, _containerInitialY);

                _maxScrollX = _scrollXCalculator();

                //Cache the maxScrollX.
                _containerData[K_MSX] = _maxScrollX;
            }

            //The parent cannot scroll.
            if (_maxScrollX === 0) return false;

            //The parent was already at its maxScrollX.
            if (_containerInitialX === _maxScrollX) {
                //Try to scroll the element by scrolling the parent.
                _container.scroll(0, _containerInitialY);
            }

            //Check if the element has moved.
            const _isXScrollable = _elementInitialX !== element.getBoundingClientRect().left;

            //Scroll the container back to its initial position.
            _container.scroll(_containerInitialX, _containerInitialY);

            if (_isXScrollable) {
                _cacheResult(_container);
                return true;
            }
        }

        return false;
    }

    //Test if the any parent of the passed element
    //is scrollable on the x-axis.
    while (_container) {
        const _regexToUse = _container === _body || _container === _html ? _overflowRegexWithVisible : _overflowRegex;

        if (_isScrollableParent(_regexToUse)) return _container;

        _container = _container.parentElement;
    }

    //Test the Window if necessary.
    if (_windowScroller === window) {
        _container = window;
        if (_isScrollableParent()) return _container;
    }

    _cacheResult(NO_SP);
    return NO_SP;
}

//TODO: element should be called container and _container should be called _parent
export const getYScrollableParent = (element, includeHiddenParents = false, options) => {
    const _oldData = _containersData.get(element);
    const _containerData = _oldData || [];
    const _cachedParent = includeHiddenParents ? _containerData[K_HSPY] : _containerData[K_SSPY];

    if (_cachedParent !== NO_VAL) return _cachedParent;

    if (!_oldData && !INIT_CONTAINER_DATA(element, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getYScrollableParent", { secondaryMsg: element }));
        return;
    }

    if (element === window) {
        _containerData[K_HSPX] = NO_SP;
        _containerData[K_HSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        _containerData[K_SSPY] = NO_SP;
        return NO_SP;
    }

    options = MERGE_OBJECTS(options, { subject: "getYScrollableParent" });

    const _body = document.body;
    const _html = document.documentElement;
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

    const _elementInitialY = element.getBoundingClientRect().top;
    const _windowScroller = getWindowScroller();
    let _container = element.parentElement;

    const _isScrollableParent = (overflowRegex) => {
        //The y-axis should be tested.
        if (
            _container === window ||
            overflowRegex.test(window.getComputedStyle(_container).overflowY)
        ) {
            if (_container === _windowScroller) _container = window;

            const [_scrollXCalculator, _scrollYCalculator] = getScrollCalculators(_container, options);
            const _containerInitialX = _scrollXCalculator();
            const _containerInitialY = _scrollYCalculator();

            const _containerData = _containersData.get(_container);
            let _maxScrollY = _containerData[K_MSY] !== NO_VAL ? _containerData[K_MSY] : HIGHEST_SAFE_SCROLL_POS;

            if (_maxScrollY > 0 && _containerInitialY !== _maxScrollY) {
                //Try to scroll the element by scrolling the parent.
                _container.scroll(_containerInitialX, HIGHEST_SAFE_SCROLL_POS);

                _maxScrollY = _scrollYCalculator();

                //Cache the maxScrollY.
                _containerData[K_MSY] = _maxScrollY;
            }

            //The parent cannot scroll.
            if (_maxScrollY === 0) return false;

            //The parent was already at its maxScrollY.
            if (_containerInitialY === _maxScrollY) {
                //Try to scroll the element by scrolling the parent.
                _container.scroll(_containerInitialX, 0);
            }

            //Check if the element has moved.
            const _isYScrollable = _elementInitialY !== element.getBoundingClientRect().top;

            //Scroll the container back to its initial position.
            _container.scroll(_containerInitialX, _containerInitialY);

            if (_isYScrollable) {
                _cacheResult(_container);
                return true;
            }
        }

        return false;
    }

    //Test if the any parent of the passed element
    //is scrollable on the x-axis.
    while (_container) {
        const _regexToUse = _container === _body || _container === _html ? _overflowRegexWithVisible : _overflowRegex;

        if (_isScrollableParent(_regexToUse)) return _container;

        _container = _container.parentElement;
    }

    //Test the Window if necessary.
    if (_windowScroller === window) {
        _container = window;
        if (_isScrollableParent()) return _container;
    }

    _cacheResult(NO_SP);
    return NO_SP;
}





//TODO: element should be called container and _container should be called _parent
export const getScrollableParent = (element, includeHiddenParents = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "getScrollableParent" });

    const _oldData = _containersData.get(element);
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
            _cachedYParent = getYScrollableParent(element, includeHiddenParents, options);
        } else if (!_isXParentCached && _isYParentCached) {
            _cachedXParent = getXScrollableParent(element, includeHiddenParents, options);
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
        if (_cachedXParent === window) return _cachedYParent;
        if (_cachedYParent === window) return _cachedXParent;
        return _cachedXParent.contains(_cachedYParent) ? _cachedYParent : _cachedXParent;
    }

    if (!_oldData && !INIT_CONTAINER_DATA(element, _containerData)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getScrollableParent", { secondaryMsg: element }));
        return;
    }

    if (element === window) {
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

    const _elementInitialPos = element.getBoundingClientRect();
    const _elementInitialX = _elementInitialPos.left;
    const _elementInitialY = _elementInitialPos.top;
    const _windowScroller = getWindowScroller();
    let _container = element.parentElement;

    const _isScrollableParent = (overflowRegex) => {
        let _testScrollX, _testScrollY;

        if (_container === window) {
            _testScrollX = true;
            _testScrollY = true;
        } else {
            //Check if the overflow conditions are met.
            const _style = window.getComputedStyle(_container);
            _testScrollX = overflowRegex.test(_style.overflowX);
            _testScrollY = overflowRegex.test(_style.overflowY);
        }

        //At least one axis should be tested.
        if (_testScrollX || _testScrollY) {
            if (_container === _windowScroller) _container = window;

            const [_scrollXCalculator, _scrollYCalculator] = getScrollCalculators(_container, options);
            const _containerInitialX = _scrollXCalculator();
            const _containerInitialY = _scrollYCalculator();

            const _containerData = _containersData.get(_container);
            let _maxScrollX = _containerData[K_MSX] !== NO_VAL ? _containerData[K_MSX] : HIGHEST_SAFE_SCROLL_POS;
            let _maxScrollY = _containerData[K_MSY] !== NO_VAL ? _containerData[K_MSY] : HIGHEST_SAFE_SCROLL_POS;

            if (
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
            if (_maxScrollX === 0 && _maxScrollY === 0) return false;

            //The parent was already at its maxScrollX/maxScrollY.
            if (_containerInitialX === _maxScrollX && _containerInitialY === _maxScrollY) {
                //Try to scroll the element by scrolling the parent.
                _container.scroll(0, 0);
            }

            //Check if the element has moved.
            const _elementPos = element.getBoundingClientRect();
            const _isXScrollable = _testScrollX && _elementInitialX !== _elementPos.left;
            const _isYScrollable = _testScrollY && _elementInitialY !== _elementPos.top;

            //Scroll the container back to its initial position.
            _container.scroll(_containerInitialX, _containerInitialY);

            if (_isXScrollable && !_isYScrollable) {
                _cacheXResult(_container);
                return true;
            }

            if (!_isXScrollable && _isYScrollable) {
                _cacheYResult(_container);
                return true;
            }

            if (_isXScrollable && _isYScrollable) {
                _cacheXResult(_container);
                _cacheYResult(_container);
                return true;
            }
        }

        return false;
    }

    //Test if the any parent of the passed element
    //is scrollable on either the x or y axis.
    while (_container) {
        const _regexToUse = _container === _body || _container === _html ? _overflowRegexWithVisible : _overflowRegex;

        if (_isScrollableParent(_regexToUse)) return _container;

        _container = _container.parentElement;
    }

    //Test the Window if necessary.
    if (_windowScroller === window) {
        _container = window;
        if (_isScrollableParent()) return _container;
    }

    _cacheXResult(NO_SP);
    _cacheYResult(NO_SP);
    return NO_SP;
}




//TODO: element should be called container
export const getAllScrollableParents = (element, includeHiddenParents = false, callback, options) => {
    options = MERGE_OBJECTS(options, { subject: "getAllScrollableParents" });

    const _scrollableParents = [];
    const _callback = typeof callback === "function" ? callback : () => { };
    const _scrollableParentFound = (el) => {
        _scrollableParents.push(el);
        _callback(el);
    }

    do {
        element = getScrollableParent(element, includeHiddenParents, options);
        if (element) _scrollableParentFound(element);
    } while (element);

    return _scrollableParents;
}

export const scrollXTo = (finalPosition, container = _pageScroller, callback, containScroll = false, options) => {
    if (!Number.isFinite(finalPosition)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "scrollXTo", { secondaryMsg: finalPosition }));
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
    const _scroll = container !== window ? finalPos => container.scrollLeft = finalPos : finalPos => container.scroll(finalPos, window.scrollY);

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
    _containerData[K_IDX] = window.requestAnimationFrame(_stepX);

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
            _containerData[K_FSCX] ? _containerData[K_FSCX] :
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
            _containerData[K_IDX] = window.requestAnimationFrame(_stepX);
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

        _containerData[K_IDX] = window.requestAnimationFrame(_stepX);
    }
}

export const scrollYTo = (finalPosition, container = _pageScroller, callback, containScroll = false, options) => {
    if (!Number.isFinite(finalPosition)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "scrollYTo", { secondaryMsg: finalPosition }));
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
    const _scroll = container !== window ? finalPos => container.scrollTop = finalPos : finalPos => container.scroll(window.scrollX, finalPos);

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
    _containerData[K_IDY] = window.requestAnimationFrame(_stepY);

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
            _containerData[K_FSCY] ? _containerData[K_FSCY] :
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
            _containerData[K_IDY] = window.requestAnimationFrame(_stepY);
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

        _containerData[K_IDY] = window.requestAnimationFrame(_stepY);
    }
}

//TODO: change deltaX to delta, finalXPosition to finalPosition and maxScrollX to maxScroll
export const scrollXBy = (deltaX, container = _pageScroller, callback, stillStart = true, containScroll = false, options) => {
    if (!Number.isFinite(deltaX)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "scrollXBy", { secondaryMsg: deltaX }));
        return;
    }

    options = MERGE_OBJECTS(options, { subject: "scrollXBy" });

    const _currentXPosition = getScrollXCalculator(container, options)();
    if (!stillStart) {
        const _containerData = _containersData.get(container) || [];

        //A scroll-animation on the x-axis is already being performed and can be repurposed.
        if (_containerData[K_IDX]) {

            //An actual scroll has been requested.   
            if (deltaX !== 0) {
                let _finalXPosition = _containerData[K_FPX] + deltaX;

                //Limit the final position to the [0, maxScrollX] interval. 
                if (containScroll) {
                    const _maxScrollX = getMaxScrollX(container, false, options);
                    if (_finalXPosition < 0) _finalXPosition = 0;
                    else if (_finalXPosition > _maxScrollX) _finalXPosition = _maxScrollX;
                }

                const _remaningScrollAmount = (_finalXPosition - _currentXPosition) * _containerData[K_SDX];

                //The scroll-animation has to scroll less than 1px.
                if (_remaningScrollAmount * _remaningScrollAmount < 1) {
                    stopScrollingX(container, callback);
                    return;
                }

                //Thanks to the new deltaX, the current scroll-animation 
                //has already surpassed the old finalXPosition.
                if (_remaningScrollAmount < 0) {
                    scrollXTo(_finalXPosition, container, callback, containScroll, options);
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

    scrollXTo(_currentXPosition + deltaX, container, callback, containScroll, options);
}

//TODO: change deltaX to delta, finalXPosition to finalPosition and maxScrollX to maxScroll
export const scrollYBy = (deltaY, container = _pageScroller, callback, stillStart = true, containScroll = false, options) => {
    if (!Number.isFinite(deltaY)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "scrollYBy", { secondaryMsg: deltaY }));
        return;
    }

    options = MERGE_OBJECTS(options, { subject: "scrollYBy" });

    const _currentYPosition = getScrollYCalculator(container, options)();
    if (!stillStart) {
        const _containerData = _containersData.get(container) || [];

        //A scroll-animation on the y-axis is already being performed and can be repurposed.
        if (_containerData[K_IDY]) {
            //An actual scroll has been requested.   
            if (deltaY !== 0) {
                let _finalYPosition = _containerData[K_FPY] + deltaY;

                //Limit the final position to the [0, maxScrollY] interval. 
                if (containScroll) {
                    const _maxScrollY = getMaxScrollY(container, false, options);
                    if (_finalYPosition < 0) _finalYPosition = 0;
                    else if (_finalYPosition > _maxScrollY) _finalYPosition = _maxScrollY;
                }

                const _remaningScrollAmount = (_finalYPosition - _currentYPosition) * _containerData[K_SDY];

                //The scroll-animation has to scroll less than 1px. 
                if (_remaningScrollAmount * _remaningScrollAmount < 1) {
                    stopScrollingY(container, callback);
                    return;
                }

                //Thanks to the new deltaY, the current scroll-animation 
                //has already surpassed the old finalYPosition. 
                if (_remaningScrollAmount < 0) {
                    scrollYTo(_finalYPosition, container, callback, containScroll, options);
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

    scrollYTo(_currentYPosition + deltaY, container, callback, containScroll, options);
}

export const scrollTo = (finalXPosition, finalYPosition, container = _pageScroller, callback, containScroll = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "scrollTo" });

    if (typeof callback !== "function") {
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

export const scrollBy = (deltaX, deltaY, container = _pageScroller, callback, stillStart = true, containScroll = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "scrollBy" });

    if (typeof callback !== "function") {
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

export const scrollIntoView = (element, alignToLeft = true, alignToTop = true, callback, includeHiddenParents = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "scrollIntoView" });

    let _containerIndex = -1;
    const _containers = getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++, options);

    //The element cannot be scrolled into view.
    if (_containerIndex < 0) {
        if (typeof callback === "function") callback();
        return;
    }

    const _alignToNearestX = REGEX_ALIGNMENT_NEAREST.test(alignToLeft);
    const _alignToNearestY = REGEX_ALIGNMENT_NEAREST.test(alignToTop);

    let _alignToLeft = alignToLeft;
    let _alignToTop = alignToTop;
    let _currentContainer = _containers[_containerIndex];
    let _currentElement = _containers[_containerIndex - 1] || element;

    const _callback = () => {
        if (_containerIndex < 1) {
            if (typeof callback === "function") callback();
            return;
        }
        _containerIndex--;
        _currentContainer = _containers[_containerIndex];
        _currentElement = _containers[_containerIndex - 1] || element;
        _scrollContainer();
    };

    _scrollContainer();

    function _scrollContainer() {
        //_scrollbarsDimensions[0] = vertical scrollbar's width
        //_scrollbarsDimensions[1] = horizontal scrollbar's height
        const _scrollbarsDimensions = calcScrollbarsDimensions(_currentContainer, false, options);

        //_bordersDimensions[0] = top border size
        //_bordersDimensions[1] = right border size
        //_bordersDimensions[2] = bottom border size
        //_bordersDimensions[3] = left border size
        const _bordersDimensions = calcBordersDimensions(_currentContainer, false, options);

        //Current element position relative to the current container.
        const { top, right, bottom, left } = _currentElement.getBoundingClientRect();
        const _elementPosition = { top, right, bottom, left };

        if (_currentContainer === window) {
            _elementPosition.right -= _windowWidth;
            _elementPosition.bottom -= _windowHeight;
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

        const _shouldScrollX = _deltaX !== 0 && getMaxScrollX(_currentContainer, false, options) >= 1;
        const _shouldScrollY = _deltaY !== 0 && getMaxScrollY(_currentContainer, false, options) >= 1;

        if (_shouldScrollX && _shouldScrollY) scrollBy(_deltaX, _deltaY, _currentContainer, _callback, true, true, options);
        else if (_shouldScrollX) scrollXBy(_deltaX, _currentContainer, _callback, true, true, options);
        else if (_shouldScrollY) scrollYBy(_deltaY, _currentContainer, _callback, true, true, options);
        else _callback();
    }
}

export const scrollIntoViewIfNeeded = (element, alignToCenter = true, callback, includeHiddenParents = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "scrollIntoViewIfNeeded" });

    let _containerIndex = -1;
    const _containers = getAllScrollableParents(element, includeHiddenParents, () => _containerIndex++, options);

    //The element cannot be scrolled into view.
    if (_containerIndex < 0) {
        if (typeof callback === "function") callback();
        return;
    }

    let _alignToLeft = NO_VAL;
    let _alignToTop = NO_VAL;
    let _currentContainer = _containers[_containerIndex];
    let _currentElement = _containers[_containerIndex - 1] || element;

    const _callback = () => {
        if (_containerIndex < 1) {
            if (typeof callback === "function") callback();
            return;
        }
        _containerIndex--;
        _currentContainer = _containers[_containerIndex];
        _currentElement = _containers[_containerIndex - 1] || element;
        _scrollContainer();
    };

    _scrollContainer();

    function _scrollContainer() {
        //_scrollbarsDimensions[0] = vertical scrollbar's width
        //_scrollbarsDimensions[1] = horizontal scrollbar's height
        const _scrollbarsDimensions = calcScrollbarsDimensions(_currentContainer, false, options);

        //_bordersDimensions[0] = top border size
        //_bordersDimensions[1] = right border size
        //_bordersDimensions[2] = bottom border size
        //_bordersDimensions[3] = left border size
        const _bordersDimensions = calcBordersDimensions(_currentContainer, false, options);

        //Current element position relative to the current container.
        const { top, right, bottom, left } = _currentElement.getBoundingClientRect();
        const _elementPosition = { top, right, bottom, left };

        if (_currentContainer === window) {
            _elementPosition.right -= _windowWidth;
            _elementPosition.bottom -= _windowHeight;
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

        if (!_shouldScrollX && !_shouldScrollY) {
            _callback();
            return;
        }

        //Possible alignments for the original element: center or nearest.
        //Possible alignments for every other container: nearest.
        if (_isOriginalElement && alignToCenter) {
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

        _shouldScrollX = _deltaX !== 0 && getMaxScrollX(_currentContainer, false, options) >= 1;
        _shouldScrollY = _deltaY !== 0 && getMaxScrollY(_currentContainer, false, options) >= 1;

        if (_shouldScrollX && _shouldScrollY) scrollBy(_deltaX, _deltaY, _currentContainer, _callback, true, true, options);
        else if (_shouldScrollX) scrollXBy(_deltaX, _currentContainer, _callback, true, true, options);
        else if (_shouldScrollY) scrollYBy(_deltaY, _currentContainer, _callback, true, true, options);
        else _callback();
    }
}

export const stopScrollingX = (container = _pageScroller, callback, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) {
        window.cancelAnimationFrame(_containerData[K_IDX]);

        //No scroll-animation on the y-axis is being performed.
        if (_containerData[K_IDY] === NO_VAL) {
            CLEAR_COMMON_DATA(_containerData);
        } else {
            _containerData[K_IDX] = NO_VAL;  //Scroll id on x-axis
            _containerData[K_CBX] = NO_VAL;  //Scroll callback on x-axis  
        }

        _containerData[K_TSCX] = NO_VAL; //Temporary StepLengthCalculator on the x-axis
    } else if (!INIT_CONTAINER_DATA(container)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "stopScrollingX", { secondaryMsg: container }));
        return;
    }

    if (typeof callback === "function") callback();
}

export const stopScrollingY = (container = _pageScroller, callback, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) {
        window.cancelAnimationFrame(_containerData[K_IDY]);

        //No scroll-animation on the x-axis is being performed.
        if (_containerData[K_IDX] === NO_VAL) {
            CLEAR_COMMON_DATA(_containerData);
        } else {
            _containerData[K_IDY] = NO_VAL;  //Scroll id on y-axis
            _containerData[K_CBY] = NO_VAL;  //Scroll callback on y-axis  
        }

        _containerData[K_TSCY] = NO_VAL; //Temporary StepLengthCalculator on the y-axis
    } else if (!INIT_CONTAINER_DATA(container)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "stopScrollingY", { secondaryMsg: container }));
        return;
    }

    if (typeof callback === "function") callback();
}

export const stopScrolling = (container = _pageScroller, callback, options) => {
    const _containerData = _containersData.get(container);

    if (_containerData) {
        window.cancelAnimationFrame(_containerData[K_IDX]);
        window.cancelAnimationFrame(_containerData[K_IDY]);

        CLEAR_COMMON_DATA(_containerData);

        _containerData[K_TSCX] = NO_VAL; //Temporary StepLengthCalculator on the x-axis
        _containerData[K_TSCY] = NO_VAL; //Temporary StepLengthCalculator on the y-axis
    } else if (!INIT_CONTAINER_DATA(container)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "stopScrolling", { secondaryMsg: container }));
        return;
    }

    if (typeof callback === "function") callback();
}

export const stopScrollingAll = (callback) => {
    for (const [_container, _containerData] of _containersData.entries()) {
        window.cancelAnimationFrame(_containerData[K_IDX]);
        window.cancelAnimationFrame(_containerData[K_IDY]);

        CLEAR_COMMON_DATA(_containerData);

        _containerData[K_TSCX] = NO_VAL; //Temporary StepLengthCalculator on the x-axis
        _containerData[K_TSCY] = NO_VAL; //Temporary StepLengthCalculator on the y-axis
    }

    if (typeof callback === "function") callback();
}




//TODO: add a cypress test for hrefSetup using the concepts of scrollIntoView/IfNeeded tests
export const hrefSetup = (alignToLeft = true, alignToTop = true, init, callback, includeHiddenParents = false, updateHistory = false, options) => {
    options = MERGE_OBJECTS(options, { subject: "hrefSetup" });

    const _init = typeof init === "function" ? init : (anchor, el, event) => event.stopPropagation();
    const _pageURL = window.location.href.split("#")[0]; //location.href = optionalURL#fragment
    const _updateHistory =
        updateHistory &&
        window.history &&
        window.history.pushState &&
        window.history.scrollRestoration; //Check if histoy manipulation is supported

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
                if (window.history.state !== fragment) {
                    window.history.pushState(fragment, "", "#" + fragment + ".");
                }
            } : () => { };

        //href="#fragment" scrolls the element associated with the fragment into view.
        pageLink.addEventListener("click", event => {
            const _containerData = _containersData.get(pageLink);
            const _fragment = _containerData[K_FGS];

            //Check if pageLink points to another page.
            if (_fragment === NO_FGS) {
                const _pageURL = window.location.href.split("#")[0]; //location.href = optionalURL#fragment
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
        const _oldData = _containersData.get(window);
        const _containerData = _oldData || [];
        if (!_oldData) INIT_CONTAINER_DATA(window, _containerData);

        //History already managed.
        if (_containerData[K_FGS] !== NO_VAL) return;

        //The window fragment is dynamically calculated every time, 
        //because it's faster than caching.
        _containerData[K_FGS] = NO_FGS;

        const _smoothHistoryNavigation = (event) => scrollToFragment(
            NO_VAL,
            window.location.hash.slice(1, -1), //Remove the extra "." in the fragment
            event,
            () => { },
        );

        window.history.scrollRestoration = "manual";
        window.addEventListener("popstate", _smoothHistoryNavigation, { passive: true });
        window.addEventListener("unload", (event) => event.preventDefault(), { passive: false, once: true });

        //Checks if the page initially have a URL containing
        //a valid fragment and scrolls to it if necessary.
        if (document.readyState === "complete") _smoothHistoryNavigation(new Event("load"));
        else window.addEventListener("load", _smoothHistoryNavigation, { passive: true, once: true });
    }
}



const ussInit = () => {
    //Set the _reducedMotion.
    try { //Chrome, Firefox & Safari >= 14
        window.matchMedia("(prefers-reduced-motion)").addEventListener("change", () => {
            _reducedMotion = window.matchMedia("(prefers-reduced-motion)").matches;
            stopScrollingAll();
        }, { passive: true });
    } catch (addEventListenerNotSupported) { //Safari < 14
        window.matchMedia("(prefers-reduced-motion)").addListener(() => {
            _reducedMotion = window.matchMedia("(prefers-reduced-motion)").matches;
            stopScrollingAll();
        }, { passive: true });
    }

    //Calculate the _scrollbarsMaxDimension.
    getScrollbarsMaxDimension();

    //Calculate the _windowScroller.
    getWindowScroller();

    //Calculate the _pageScroller.
    getPageScroller();

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
else window.addEventListener("load", ussInit, { passive: true, once: true });