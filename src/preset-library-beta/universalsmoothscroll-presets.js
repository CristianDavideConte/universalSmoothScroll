/**
 * TODO: 
 * - use mutation observer + options object to automatically detect new children in SnapScrollBuilder 
 * - improve snap scrolling performances (intersection observers) 
 * - fix snap scrolling triggering too early with trackpads
 *
 * - improve touchScrollExtender easing pattern
 * - touchScrollExtender doens't work well with elasticScroll and SnapScrol (it produces a delayed and slow effect)
 * - make the _handlePointerMoveEvent of SmoothScrollBuilder dependent on the options.onXAxis/onYAxis passed
 * 
 * -fix easeElasticScrolling bottom elastic part not working properly onresize
 * 
 * - the width/height of smoothscrollbars should be counted as normal scrollbars' width/height if specified
 * - fix smoothscrollbars not having the correct height/width onpageload sometimes
 *
 * - fix the pointerdown event on anchor elements not working properly in the demo (see index.html -> TEMPORARY FIX)
 * 
 * - fix mobile multitasking freezing scrollbars
 * - smooth scrolling with animation allowed
 * - smooth scrolling for carousels (perhaps leave this implementation to the developer?)
 */


/**
 * Each of this functions should have an input interface that:
 *  - has the "container" as the first parameter
 *  - has an "options" object as the second parameter
 *  - returns a class that extends/ is a SmoothScrollBuilder
 * 
 * Every effect-specific input:
 * - should be a property of the "options" parameter
 * 
 * Each returned SmoothScrollBuilder:
 *  - can be the "container" parameter of other functions to enable chaining 
 *  - keeps track of a reference its own options object, which cannot be modified by other SmoothScrollBuilders.
 */

import { ElasticScrollBuilder } from "./uss-builder-elasticscroll.js";
import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";
import { SmoothScrollbarBuilder } from "./uss-builder-smoothscrollbar.js";
import { SnapScrollBuilder } from "./uss-builder-snapscroll.js";

/**
 * This function tests if the passed input is an instance of Object.
 * @param {*} value The value to test.
 *  
 * @returns True if value is a valid Object, false otherwise.  
 */
function isObject(value) {
    return value !== null && 
           typeof value === "object" && 
           !Array.isArray(value);
}

/**
 * This function uses the passed checker function to test if at least one between
 * options.onXAxis and options.onYAxis should be considered true.
 * Used to determine whether a requested smoothscroll effect should be applied.
 * @param {Object} options An Object with the onXAxis and onYAxis properties.
 * @param {Function} checker A function that returns true if the value it gets passed satisfy its internal condition, false otherwise.
 *  
 * @returns True if both options.onXAxis and options.onYAxis satisfy the checker conditions.
 */
function effectShoudBeApplied(options, checker = value => !!value) {
    return checker(options.onXAxis) || 
           checker(options.onYAxis);
}

/**
 * This function enables the smooth scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element or a SmoothScrollBuilder.
 * @param {Object} options An Object which containing the smooth scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if the smooth scrolling should be enabled on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=true] True if the smooth scrolling should be enabled on the y-axis of container, false otherwise.
 * @param {Boolean} [options.overscrollX=true] True if the scrolling should be propagated to the closest scrollable parent when 
*                                              the boundaries on the x-axis of this container are reached, false otherwise.
 * @param {Boolean} [options.overscrollY=true] True if the scrolling should be propagated to the closest scrollable parent when 
*                                              the boundaries on the y-axis of this container are reached, false otherwise.
 * @param {Function} [options.callback] A function that will be executed when the container is done with the current smooth scrolling scroll-animation.
 * @param {Function} [options.speedModifierX] A function that must return the number of pixel that will be added to the current total scrolling amount (on the x-axis)
 *                                            of this smooth scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.speedModifierY] A function that must return the number of pixel that will be added to the current total scrolling amount (on the y-axis)
 *                                            of this smooth scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.easingX] A valid stepLengthCalculator that will control the easing of this scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.easingY] A valid stepLengthCalculator that will control the easing of this scroll-animation (on the y-axis) of container.
 * 
 * @returns {SmoothScrollBuilder} The underling SmoothScrollBuilder used for this effect.  
 */
export function addSmoothScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: true,
        overscrollX: true,
        overscrollY: true,
        callback: () => {},
        speedModifierX: (deltaX, deltaY) => deltaX,
        speedModifierY: (deltaX, deltaY) => deltaY,
        easingX: (remaning) => remaning / 25 + 1,
        easingY: (remaning) => remaning / 25 + 1,
    }
) {
    if(container instanceof SmoothScrollBuilder) return container;

    //Check if the options parameter is a valid Object.
    if (!isObject(options)) {
        uss._errorLogger("addSmoothScrolling", "the options parameter to be an Object", options);
        return;
    }

    options.debugString = options.debugString || "addSmoothScrolling";
        
    //Check if the container is a valid container.
    if(!(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or a SmoothScrollBuilder", container);
        return;
    }

    //Check if at least one axis was requested.
    if(!effectShoudBeApplied(options)) {
        uss._errorLogger(options.debugString, "onXAxis and/or onYAxis to be !== false", false);
        return;
    }

    //If needed, check if the x-axis of the passed container is actually scrollable. 
    if(options.onXAxis && uss.getMaxScrollX(container, false, options) < 1) {
        uss._warningLogger(container, "is not scrollable on the x-axis");
    }

    //If needed, check if the y-axis of the passed container is actually scrollable. 
    if(options.onYAxis && uss.getMaxScrollY(container, false, options) < 1) {
        uss._warningLogger(container, "is not scrollable on the y-axis");
    }

    if(typeof options.callback !== "function") options.callback = () => {};

    if(typeof options.speedModifierX !== "function") options.speedModifierX = (deltaX, deltaY) => deltaX;
    if(typeof options.speedModifierY !== "function") options.speedModifierY = (deltaX, deltaY) => deltaY;
    
    //TODO Not good for touch-driven scrolling
    //Default easing behaviors: ease-out.
    if(typeof options.easingX !== "function") options.easingX = (remaning) => {
        return remaning / 25 + 1;
    }
    if(typeof options.easingY !== "function") options.easingY = (remaning) => {
        return remaning / 25 + 1;
    }

    const _builder = new SmoothScrollBuilder(container, options);
    _builder.build();
    
    return _builder;
}




/**
 * This function enables the snap scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element or a SmoothScrollBuilder.
 * @param {Object} options An Object which containing the snap scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] "mandatory" to always trigger the snap-into-view behavior (on the x-axis) of this scroll-animation.
 *                                          "proximity" to trigger the snap-into-view behavior (on the x-axis) of this scroll-animation only if there's one of the 
 *                                           children.elements not further from its snap-point than half of his width. 
 * @param {Boolean} [options.onYAxis="mandatory"] "mandatory" to always trigger the snap-into-view behavior (on the y-axis) of this scroll-animation.
 *                                                "proximity" to trigger the snap-into-view behavior (on the y-axis) of this scroll-animation only if there's one of the 
 *                                                children.elements not further from its snap-point than half of his height. 
 * @param {Array} [options.children] An array of Objects that have 2 properties:
 *                                   - element: a direct children of container that you want to snap-into-view.
 *                                   - align: "start" if you want element to be left-aligned on the x-axis and top-aligned on the y-axis.
 *                                            "end" if you want element to be right-aligned on the x-axis and bottom-aligned on the y-axis.
 *                                            Any other value if you want element to be center-aligned on both axes.
 * @param {Number} [options.activationDelay=0] The number of milliseconds that will be waited from the end of the smooth scroll part of this scroll-animation 
 *                                       in order to trigger the beginning of the snap-into-view part.
 * @param {Function} [options.easingX] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
 *                                         scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.easingY] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
 *                                         scroll-animation (on the y-axis) of container. 
 *  
 * @returns {SmoothScrollBuilder} The underling SmoothScrollBuilder used for this effect.  
 */
export function addSnapScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: "mandatory",
        callback: () => {},
        activationDelay: 0,
        children: [],
        easingX: (remaning, ot, t, total) => (total - remaning) / 25 + 1,
        easingY: (remaning, ot, t, total) => (total - remaning) / 25 + 1,
    }, 
) {
    //Check if the options parameter is a valid Object.
    if (!isObject(options)) {
        uss._errorLogger("addSmoothScrolling", "the options parameter to be an Object", options);
        return;
    }

    options.debugString = options.debugString || "addSnapScrolling";

    //Check if at least one axis was requested.
    if(!effectShoudBeApplied(options, value => /mandatory/.test(value) || /proximity/.test(value))) {
        uss._errorLogger(options.debugString, "onXAxis and/or onYAxis to be !== false", false);
        return;
    }

    //The callback should be called after the snapScrolling instead of 
    //being called at the end of the smooth scrolling.
    const _originalCallback = typeof options.callback === "function" ? options.callback : () => {};
    options.callback = () => {};
    container = addSmoothScrolling(container, options);
    options.callback = _originalCallback;

    //Check if the options.activationDelay parameter is a number >= 0.
    options.activationDelay = options.activationDelay || 0;
    if(!Number.isFinite(options.activationDelay) || options.activationDelay < 0) {
        uss._errorLogger(options.debugString, "the options.activationDelay parameter to be a number >= 0", options.activationDelay);
        return;
    }

    //Check if the options.children parameter is an array.
    options.children = options.children || [];
    if(!Array.isArray(options.children)) {
        uss._errorLogger(options.debugString, "the options.children parameter to be an array", options.children);
        return;
    }

    //Check the elements of the options.children parameter are valid.
    const _childrenNum = options.children.length;
    for(let i = 0; i < _childrenNum; i++) {
        const _child = options.children[i];
        
        //Check if the child is an Object.
        if (_child === null || typeof _child !== "object" || Array.isArray(_child)) {
            uss._errorLogger(options.debugString, "the elements of options.children to be Objects", _child);
            return;
        }

        //Check if child.element is an Element.
        if(!(_child.element instanceof Element)) {
            uss._errorLogger(options.debugString, "the element parameter of each options.children Object to be an Element", _child.element);
            return;
        }

        //Want the user about children that cannot be snap-scrolled by scrolling the passed container. 
        const _isScrollbar = _child.element.dataset.uss;
        if(_isScrollbar || uss.getScrollableParent(_child.element, true, options) !== container.container) {
            uss._warningLogger(_child.element, "can't be scrolled into view by scrolling the passed container");
        }
    }

    if(typeof options.easingX !== "function") options.easingX = (remaning, ot, t, total) => (total - remaning) / 25 + 1;
    if(typeof options.easingY !== "function") options.easingY = (remaning, ot, t, total) => (total - remaning) / 25 + 1;

    const _builder = new SnapScrollBuilder(container, options);
    _builder.build();
    
    return _builder;
}






const elasticScrollingDefaults = {
    top: {
        easing: (remaning) => Math.ceil(uss.getFramesTime(true) * remaning / 110),
        getElasticAmount: (builder) => Number.parseFloat(builder.style.paddingTop) || 0,
    },
    right: {
        easing: (remaning) => Math.ceil(uss.getFramesTime(true) * remaning / 110),
        getElasticAmount: (builder) => Number.parseFloat(builder.style.paddingRight) || 0,
    },
    bottom: {
        easing: (remaning) => Math.ceil(uss.getFramesTime(true) * remaning / 110),
        getElasticAmount: (builder) => Number.parseFloat(builder.style.paddingBottom) || 0,
    },
    left: {
        easing: (remaning) => Math.ceil(uss.getFramesTime(true) * remaning / 110),
        getElasticAmount: (builder) => Number.parseFloat(builder.style.paddingLeft) || 0,
    }
}

/**
 * This function enables the elastic scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element or a SmoothScrollBuilder.
 * @param {Object} options An Object which containing the elastic scrolling preferences/properties listed below.
 * 
 * //TODO
 * 
 * @returns {SmoothScrollBuilder} The underling SmoothScrollBuilder used for this effect.  
 */
export function addElasticScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: true,
        activationDelay: 60,
        elasticResistance: 3,
        callback: () => {},
    }, 
) {
    //Check if the options parameter is a valid Object.
    if (!isObject(options)) {
        uss._errorLogger("addElasticScrolling", "the options parameter to be an Object", options);
        return;
    }

    options.debugString = options.debugString || "addElasticScrolling";

    //Check if at least one axis was requested.
    if(!effectShoudBeApplied(options)) {
        uss._errorLogger(options.debugString, "onXAxis and/or onYAxis to be !== false", false);
        return;
    }
    
    //The callback should be called after the elasticScrolling instead of 
    //being called at the end of the smooth scrolling.
    const _originalCallback = typeof options.callback === "function" ? options.callback : () => {};
    options.callback = () => {};
    container = addSmoothScrolling(container, options);
    options.callback = _originalCallback;

    //Default easing behaviors: ease-out-like with 60ms of debounce time.
    options.activationDelay = options.activationDelay || 60;
    options.elasticResistance = Number.isFinite(options.elasticResistance) && 
                                                options.elasticResistance >= 0 ? options.elasticResistance : 3;

    //Check options.top, options.right, options.bottom or options.left
    //and fill the missing values if needed.
    const _elasticProps = ["top", "right", "bottom", "left"];

    for(const prop of _elasticProps) {
        const _propObj = options[prop];

        //Check if they are objects.
        if(!isObject(_propObj)) {
            options[prop] = elasticScrollingDefaults[prop];
            options[prop].elasticResistance = options.elasticResistance;
            continue;
        }

        //elasticResistance must be a finite number >= 0
        if(!Number.isFinite(_propObj.elasticResistance) || _propObj.elasticResistance < 0) {
            options[prop].elasticResistance = options.elasticResistance;
        }

        //Check if the easing is a function.
        if(typeof _propObj.easing !== "function") {
            options[prop].easing = elasticScrollingDefaults[prop].easing;
        }
        
        //Check if the getElasticAmount is a function.
        if(typeof _propObj.getElasticAmount !== "function") {
            options[prop].getElasticAmount = elasticScrollingDefaults[prop].getElasticAmount;
        }
    }

    //If these values are not passed at all, use the default values. 
    if(options.onXAxis) {
        options.right = options.right || elasticScrollingDefaults.right;
        options.left = options.left || elasticScrollingDefaults.left;
    }

    if(options.onYAxis) {
        options.top = options.top || elasticScrollingDefaults.top;
        options.bottom = options.bottom || elasticScrollingDefaults.bottom;
    }

    const _builder = new ElasticScrollBuilder(container, options);
    _builder.build();

    return _builder;
}










/**
 * This function adds the specified smooth scrollbars onto the passed container.
 * These scrollbars can controll the smooth scrolling of the passed container. 
 * @param {*} container An Element.
 * @param {Object} options An Object which containing the scrollbar's preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if a smooth scrollbar should be added on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=true] True if a smooth scrollbar should be added on the y-axis of container, false otherwise.
 * @param {Number} [options.thickness=17] The default width of the scrollbar on the y-axis of container and 
 *                                        the default height of the scrollbar on the x-axis of container. 
 * //TODO
 * @returns {SmoothScrollbarBuilder} The underling SmoothScrollbarBuilder used for this effect.  
 */
export function addSmoothScrollbar(
    container,
    options = {
        onXAxis: false,
        onYAxis: true,
        thickness: 17,     //Perhaps split into thicknessX and thicknessY ? 
        length: undefined, //Perhaps split into lengthX and lengthY ? 
    } 
) {
    //Check if the options parameter is a valid Object.
    if (!isObject(options)) {
        uss._errorLogger("addSmoothScrollbar", "the options parameter to be an Object", options);
        return;
    }

    options.debugString = options.debugString || "addSmoothScrollbar";
    
    //Check if at least one axis was requested.
    if(!effectShoudBeApplied(options)) {
        uss._errorLogger(options.debugString, "onXAxis and/or onYAxis to be !== false", false);
        return;
    }

    //Check if the thumb thickness is a positive number.
    options.thickness = options.thickness || 17;
    if(options.thickness <= 0 || (options.thickness && !Number.isFinite(options.thickness))) {
        uss._errorLogger(options.debugString, "the options.thickness to be a finite number > 0", options.thickness);
        return;
    }

    //Check if the thumb length is a positive number.
    if(options.length <= 0 || (options.length && !Number.isFinite(options.length))) {
        uss._errorLogger(options.debugString, "the options.length to be a finite number > 0", options.length);
        return;
    }

    container = addSmoothScrolling(container, options);

    //Check if the parent node has position:static because it breaks the scrollbars positions.
    if(container.originalContainer !== document.body && 
       container.originalContainer !== document.documentElement &&
       window.getComputedStyle(container.originalContainer.parentNode).position === "static"
    ) {
        uss._warningLogger(container.originalContainer.parentNode, "has position:static which may affect the scrollbars positioning")
    }
    
    const _builder = new SmoothScrollbarBuilder(container, options);
    _builder.build();

    return _builder;
}