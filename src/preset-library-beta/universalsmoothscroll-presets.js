import { UssSmoothScroller } from "./uss-class-smooth-scroller.js";
import { UssSnapScroller } from "./uss-class-snap-scroller.js";

function isObject(object) {
    return object !== null && 
           typeof object === "object" && 
           !Array.isArray(object);
}

/**
 * This function enables the momentum smooth scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element or the Window.
 * @param {Object} options An object which containing the momentum smooth scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if the momentum smooth scrolling should be enabled on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=false] True if the momentum smooth scrolling should be enabled on the y-axis of container, false otherwise.
 * @param {Function} [options.callback] A function that will be executed when the container is done with the current momentum smooth scrolling scroll-animation.
 * @param {Function} [options.speedModifierX] A function that must return the number of pixel that will be added to the current total scrolling amount (on the x-axis)
 *                                            of this momentum smooth scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.speedModifierY] A function that must return the number of pixel that will be added to the current total scrolling amount (on the y-axis)
 *                                            of this momentum smooth scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.momentumEasingX] A valid stepLengthCalculator that will control the easing of this scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.momentumEasingY] A valid stepLengthCalculator that will control the easing of this scroll-animation (on the y-axis) of container.
 * @param {String} [options.debugString="addMomentumScrolling"] A string internally used to log the name of the most upper level function that caused an error/warning.   
 */
 export function addMomentumScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: true,
        callback: null,
        speedModifierX: (deltaX, deltaY) => deltaX,
        speedModifierY: (deltaX, deltaY) => deltaY,
        momentumEasingX: (remaning) => remaning / 25 + 1,
        momentumEasingY: (remaning) => remaning / 25 + 1,
        debugString: "addMomentumScrolling"
    }
) {
    //Check if the options parameter is a valid object.
    if (!isObject(options)) {
        uss._errorLogger("addMomentumScrolling", "the options parameter to be an object", options);
        return;
    }

    options.debugString = options.debugString || "addMomentumScrolling";
    
    //Check if the container is a valid container.
    if(container !== window && !(container instanceof Element)) {
        uss._errorLogger(options.debugString, "the container to be an Element or the Window", container);
        return;
    }

    //Check if at least one axis was requested to be momentum-scrolled.
    if(!options.onXAxis && !options.onYAxis) {
        uss._errorLogger(options.debugString, "onXAxis and/or onYAxis to be true", false);
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
    if(typeof options.momentumEasingX !== "function") options.momentumEasingX = (remaning) => remaning / 25 + 1;
    if(typeof options.momentumEasingY !== "function") options.momentumEasingY = (remaning) => remaning / 25 + 1;

    return new UssSmoothScroller(container, options);
}




/**
 * This function enables the momentum snap scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element or the Window.
 * @param {Object} options An object which containing the momentum snap scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis] "mandatory" to always trigger the snap-into-view behavior (on the x-axis) of this scroll-animation.
 *                                    "proximity" to trigger the snap-into-view behavior (on the x-axis) of this scroll-animation only if there's one of the 
 *                                    children.elements not further from its snap-point than half of his width. 
 * @param {Boolean} [options.onYAxis] "mandatory" to always trigger the snap-into-view behavior (on the y-axis) of this scroll-animation.
 *                                    "proximity" to trigger the snap-into-view behavior (on the y-axis) of this scroll-animation only if there's one of the 
 *                                    children.elements not further from its snap-point than half of his height. 
 * @param {Function} [options.callback] A function that will be executed when the container is done with the snap-into-view part of the current scroll-animation.
 * @param {Function} [options.snapEasingX] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
 *                                         scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.snapEasingY] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
 *                                         scroll-animation (on the y-axis) of container. 
 * @param {Number} [options.snapDelay=0] The number of milliseconds that will be waited from the end of the momentum smooth scroll part of this scroll-animation 
 *                                       in order to trigger the beginning of the snap-into-view part.
 * @param {Array} [options.children] An array of objects that have 2 properties:
 *                                   - element: a direct children of container that you want to snap-into-view.
 *                                   - align: "start" if you want element to be left-aligned on the x-axis and top-aligned on the y-axis.
 *                                            "end" if you want element to be right-aligned on the x-axis and bottom-aligned on the y-axis.
 *                                            Any other value if you want element to be center-aligned on both axes.
 * @param {String} [options.debugString="addMomentumScrolling"] A string internally used to log the name of the most upper level function that caused an error/warning.  
 * @returns {Function} A function that when invoked forces container to check and snap-scroll-into-view one of children.element if needed.  
 */
 export function addMomentumSnapScrolling(
    container, 
    options = {
        //TODO: add the momentumScrolling ones...
        snapEasingX: (remaning, ot, t, total) => (total - remaning) / 25 + 1,
        snapEasingY: (remaning, ot, t, total) => (total - remaning) / 25 + 1,
        snapDelay: 0,
        children: [],
        debugString: "addMomentumSnapScrolling"
    }, 
) {
    //Check if the options parameter is a valid object.
    if (!isObject(options)) {
        uss._errorLogger("addMomentumSnapScrolling", "the options parameter to be an object", options);
        return;
    }

    options.debugString = options.debugString || "addMomentumSnapScrolling";

    //Obtain the basic UssSmoothScroller needed for the snapScrolling.
    if(!(container instanceof UssSmoothScroller)) {
        //The callback should be called after the snapScrolling instead of 
        //being called at the end of the momentumScrolling.
        const _callback = typeof options.callback === "function" ? options.callback : () => {};

        options.callback = null;
        container = addMomentumScrolling(container, options);
        options.callback = _callback;
    } 

    //Check if the options.children parameter is an array.
    if(!Array.isArray(options.children)) {
        uss._errorLogger(options.debugString, "the options.children parameter to be an array", options.children);
        return;
    }

    //Check the elements of the options.children parameter are valid.
    const _childrenNum = options.children.length;
    for(let i = 0; i < _childrenNum; i++) {
        const _child = options.children[i];
        
        //Check if the child is an object.
        if (_child === null || typeof _child !== "object" || Array.isArray(_child)) {
            uss._errorLogger(options.debugString, "the elements of options.children to be objects", _child);
            return;
        }

        //Check if child.element is an Element.
        if(!(_child.element instanceof Element)) {
            uss._errorLogger(options.debugString, "the element parameter of each options.children object to be an Element", _child.element);
            return;
        }

        //Want the user about children that cannot be snap-scrolled by scrolling the passed container. 
        if(_child.element.dataset.uss || uss.getScrollableParent(_child.element, true, options) !== container.container) {
            uss._warningLogger(_child.element, "can't be scrolled into view by scrolling the passed container");
        }
    }

    if(typeof options.snapEasingX !== "function") options.snapEasingX = (remaning, ot, t, total) => (total - remaning) / 25 + 1;
    if(typeof options.snapEasingY !== "function") options.snapEasingY = (remaning, ot, t, total) => (total - remaning) / 25 + 1;

    return new UssSnapScroller(container, options);
}



/**
 * This function enables the elastic momentum scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element or the Window.
 * @param {Object} options An object which containing the momentum elastic scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if the elastic momentum smooth scrolling should be enabled on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=false] True if the elastic momentum smooth scrolling should be enabled on the y-axis of container, false otherwise.
 * @param {Function} [options.callback] A function that will be executed when the container is done with the elastic part of the current scroll-animation.
 * @param {Function} [options.momentumEasingX] A valid stepLengthCalculator that will control the easing of the momentum smooth scroll part of this 
 *                                             scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.momentumEasingY] A valid stepLengthCalculator that will control the easing of the momentum smooth scroll part of this 
 *                                             scroll-animation (on the y-axis) of container.
 * @param {Function} [options.elasticEasingX] A valid stepLengthCalculator that will control the easing of the elastic part of this 
 *                                            scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.elasticEasingY] A valid stepLengthCalculator that will control the easing of the elastic part of this 
 *                                            scroll-animation (on the y-axis) of container. 
 * @param {Number} [options.elasticAmount=100] The region of pixels from the left/top and the right/bottom borders of container that will trigger
 *                                             the elastic part of this scroll-animation when traspassed by the scroll-position of container.    
 * @param {Array} [options.children] An array of 1 or 2 objects that have only 1 property:
 *                                   - element: a direct children of container.
 *                                   options.children[0] should point to the element that will be left/top aligned after the elastic part of this scroll-animation. 
 *                                   options.children[1] should point to the element that will be right/bottom aligned after the elastic part of this scroll-animation.
 * @param {String} [options.debugString="addMomentumScrolling"] A string internally used to log the name of the most upper level function that caused an error/warning.   
 * @returns {Function} A function that when invoked forces container to be elastic-scrolled if needed.  
 */
 export function addElasticMomentumScrolling(
    container, 
    options = {
        //TODO: add the snapScrolling ones...
        elasticEasingX, 
        elasticEasingY, 
        elasticAmount: 100,
        children: [],
        debugString: "addElasticMomentumScrolling"
    }, 
) {
    //Check if the options parameter is a valid object.
    if (!isObject(options)) {
        uss._errorLogger("addElasticMomentumScrolling", "the options parameter to be an object", options);
        return;
    }

    options.debugString = options.debugString || "addElasticMomentumScrolling";

    //Obtain the basic UssSmoothScroller needed for the snapScrolling.
    if(!(container instanceof UssSmoothScroller)) {
        //The callback should be called after the snapScrolling instead of 
        //being called at the end of the momentumScrolling.
        const _callback = typeof options.callback === "function" ? options.callback : () => {};

        options.callback = null;
        container = addMomentumScrolling(container, options);
        options.callback = _callback;
    } 



    
    const _elasticAmount = options.elasticAmount;    
    if(!Number.isFinite(_elasticAmount)) {
        uss._errorLogger(options.debugString, "the options.elasticAmount to be finite number", container);
        return;
    }

    const _children = options.children;
    const _childrenNum = _children.length;

    //Check if the options.children parameter is an array.
    if(!Array.isArray(_children)) {
        uss._errorLogger(options.debugString, "the options.children parameter to be an array", _children);
        return;
    }

    //Check if the options.children parameter has at most 2 elements.
    if(_childrenNum < 1 || _childrenNum > 2) {
        uss._errorLogger(options.debugString, "the options.children parameter to have 1 or 2 elements.", _children);
        return;
    }

    //Check if the first element of the options.children parameter is a valid object.
    if(_children[0] === null || typeof _children[0] !== "object" || Array.isArray(_children[0])) {
        uss._errorLogger(options.debugString, "the elements of options.children to be objects", _children[0]);
        return;
    }

    //When the options.children of addMomentumSnapScrolling will contain only  
    //this.options.children[0], its alignment will be mandatory-start.
    _children[0].align = "start";

    //Check if the second element of the options.children parameter is a valid object.
    if(_childrenNum > 1) {
        if(_children[1] === null || typeof _children[1] !== "object" || Array.isArray(_children[1])) {
            uss._errorLogger(options.debugString, "the elements of options.children to be objects", _children[1]);
            return;
        }
        
        //When the options.children of addMomentumSnapScrolling will contain only  
        //this.options.children[1], its alignment will be mandatory-end.
        _children[1].align = "end";
    }

    const _onXAxis = options.onXAxis;
    const _onYAxis = options.onYAxis;
    if(_onXAxis) options.onXAxis = "mandatory";
    if(_onYAxis) options.onYAxis = "mandatory";

}