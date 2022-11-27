/**
 * TODO: 
 * - add speedModifiers to elasticScrolling without breaking the scrolling
 * - smooth scrolling with animation allowed
 * - fix mobile multitasking freezing scrollbars
 * - allow scroll to be propagated to the containers underneath if the current one is at its maxScrollX/Y or 0 and 
 *    it's requested to scroll (overscroll effect)
 * - smooth scrolling for carousels (perhaps leave this implementation to the developer?)
 */


/**
 * Each of this functions should have an input interface that:
 *  - has the container as the first parameter
 *  - has an "options" Object as the second parameter
 *  - every function-specific input should be a property of the "options" parameter
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
    if(typeof options.easingX !== "function") options.easingX = (remaning) => remaning / 25 + 1;
    if(typeof options.easingY !== "function") options.easingY = (remaning) => remaning / 25 + 1;

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
 * @param {Number} [options.snapDelay=0] The number of milliseconds that will be waited from the end of the smooth scroll part of this scroll-animation 
 *                                       in order to trigger the beginning of the snap-into-view part.
 * @param {Function} [options.snapEasingX] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
 *                                         scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.snapEasingY] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
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
        children: [],
        snapDelay: 0,
        snapEasingX: (remaning, ot, t, total) => (total - remaning) / 25 + 1,
        snapEasingY: (remaning, ot, t, total) => (total - remaning) / 25 + 1,
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

    //Check if the options.children parameter is an array.
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

    if(typeof options.snapEasingX !== "function") options.snapEasingX = (remaning, ot, t, total) => (total - remaning) / 25 + 1;
    if(typeof options.snapEasingY !== "function") options.snapEasingY = (remaning, ot, t, total) => (total - remaning) / 25 + 1;

    const _builder = new SnapScrollBuilder(container, options);
    _builder.build();
    
    return _builder;
}





/**
 * This function enables the elastic scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element or a SmoothScrollBuilder.
 * @param {Object} options An Object which containing the elastic scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if the elastic smooth scrolling should be enabled on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=true] True if the elastic smooth scrolling should be enabled on the y-axis of container, false otherwise.
 * @param {Array} [options.children] An array of 1 or 2 Objects that have only 1 property:
 *                                   - element: a direct children of container.
 *                                   options.children[0] should point to the element that will be left/top aligned after the elastic part of this scroll-animation. 
 *                                   options.children[1] should point to the element that will be right/bottom aligned after the elastic part of this scroll-animation.
 * @param {Number} [options.elasticAmount=100] The region of pixels from the left/top and the right/bottom borders of container that will trigger
 *                                             the elastic part of this scroll-animation when traspassed by the scroll-position of container.    
 * @param {Function} [options.elasticEasingX] A valid stepLengthCalculator that will control the easing of the elastic part of this 
 *                                            scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.elasticEasingY] A valid stepLengthCalculator that will control the easing of the elastic part of this 
 *                                            scroll-animation (on the y-axis) of container. 
 *
 * @returns {SmoothScrollBuilder} The underling SmoothScrollBuilder used for this effect.  
 */
export function addElasticScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: true,
        callback: () => {},
        children: [],
        elasticAmount: 100,
        elasticEasingX: (remaning) => Math.ceil(uss.getFramesTime(true) * remaning / 110), 
        elasticEasingY: (remaning) => Math.ceil(uss.getFramesTime(true) * remaning / 110), 
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
    
    //Check if the options.elasticAmount is a number.
    if(!Number.isFinite(options.elasticAmount)) {
        uss._errorLogger(options.debugString, "options.elasticAmount to be a finite number", false);
        return;
    }

    if(options.onXAxis) options.onXAxis = "mandatory";
    if(options.onYAxis) options.onYAxis = "mandatory";

    //Default easing behaviors: ease-out-like.
    options.snapEasingX = typeof options.elasticEasingX === "function" ? options.elasticEasingX : (remaning) => Math.ceil(uss.getFramesTime(true) * remaning / 110);
    options.snapEasingY = typeof options.elasticEasingY === "function" ? options.elasticEasingY : (remaning) => Math.ceil(uss.getFramesTime(true) * remaning / 110);
    options.snapDelay = 60; //Debounce time
    
    container = addSnapScrolling(container, options);

    //Check if the options.children parameter has exactly 1 or 2 elements.
    const _childrenNum = options.children.length;
    if(_childrenNum < 1 || _childrenNum > 2) {
        uss._warningLogger(options.children, "should have exactly 1 or 2 elements");
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
 * @param {Number} [options.thumbSize=17] The default width of the scrollbar on the y-axis of container and 
 *                                        the default height of the scrollbar on the x-axis of container. 
 * @returns {SmoothScrollbarBuilder} The underling SmoothScrollbarBuilder used for this effect.  
 */
export function addSmoothScrollbar(
    container,
    options = {
        onXAxis: false,
        onYAxis: true,
        thumbSize: 17,
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

    //Check if the thumb size is a finite number.
    options.thumbSize = options.thumbSize || 17;
    if(!Number.isFinite(options.thumbSize)) {
        uss._errorLogger(options.debugString, "the options.thumbSize to be a finite number", options.thumbSize);
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