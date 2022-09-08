/**
 * TODO: 
 * - Move to Object based architecture
 * - add speedModifiers to elasticScrolling without breaking the scrolling
 * - smooth scrolling with animation allowed
 * - smooth scrolling for carousels (perhaps leave this implementation to the developer?)
 * - when scrollbars are one on top of each other the active state and the clicks of the bottom ones should be ignored.
 */


/**
 * Each of this functions should have an input interface that:
 *  - has the container as the first parameter
 *  - has an "options" object as the second parameter
 *  - every function-specific input should be a property of the "options" parameter
 * 
 * 
 * //<-------------------------------------PERHAPS MOVE TO A DIRECT APROACH ------------------------------------------------------>   
 * //make scrollbar as a property of the base SmoothScrollBuilder 
 * //instead of dispatching custom events. 
 * 
 * Each of this functions should dispatch the custom "ussmoverequest" 
 * to their container whenever they directly use:
 *  - the uss.scrollXTo/uss.scrollXBy functions
 *  - the uss.scrollYTo/uss.scrollYBy functions
 *  - the uss.scrollTo/uss.scrollBy functions
 * This event is used to request the container's controllers (e.g. its smooth scrollbars)
 * to scroll it whenever it's ok to do so (e.g. scroll only when the user isn't holding down the scrollbar). 
 */

import { ElasticScrollBuilder } from "./uss-builder-elasticscroll.js";
import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";
import { SnapScrollBuilder } from "./uss-builder-snapscroll.js";

function isObject(object) {
    return object !== null && 
           typeof object === "object" && 
           !Array.isArray(object);
}

/**
 * This function enables the momentum smooth scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element, the Window or a SmoothScrollBuilder.
 * @param {Object} options An object which containing the momentum smooth scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if the momentum smooth scrolling should be enabled on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=true] True if the momentum smooth scrolling should be enabled on the y-axis of container, false otherwise.
 * @param {Function} [options.callback] A function that will be executed when the container is done with the current momentum smooth scrolling scroll-animation.
 * @param {Function} [options.speedModifierX] A function that must return the number of pixel that will be added to the current total scrolling amount (on the x-axis)
 *                                            of this momentum smooth scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.speedModifierY] A function that must return the number of pixel that will be added to the current total scrolling amount (on the y-axis)
 *                                            of this momentum smooth scrolling scroll-animation.
 *                                            It will be passed the deltaX and the deltaY of the wheel event that triggered this scroll-animation.
 * @param {Function} [options.momentumEasingX] A valid stepLengthCalculator that will control the easing of this scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.momentumEasingY] A valid stepLengthCalculator that will control the easing of this scroll-animation (on the y-axis) of container.
 * @param {String} [options.debugString="addSmoothScrolling"] A string internally used to log the name of the most upper level function that caused an error/warning. 
 * 
 * @returns {SmoothScrollBuilder} The underling SmoothScrollBuilder used for this effect.  
 */
 export function addSmoothScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: true,
        callback: null,
        speedModifierX: (deltaX, deltaY) => deltaX,
        speedModifierY: (deltaX, deltaY) => deltaY,
        momentumEasingX: (remaning) => remaning / 25 + 1,
        momentumEasingY: (remaning) => remaning / 25 + 1,
    }
) {
    if(container instanceof SmoothScrollBuilder) return container;

    //Check if the options parameter is a valid object.
    if (!isObject(options)) {
        uss._errorLogger("addSmoothScrolling", "the options parameter to be an object", options);
        return;
    }

    options.debugString = options.debugString || "addSmoothScrolling";
    
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

    const _builder = new SmoothScrollBuilder(container, options);
    _builder.build();
    
    return _builder;
}




/**
 * This function enables the momentum snap scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element, the Window or a SmoothScrollBuilder.
 * @param {Object} options An object which containing the momentum snap scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] "mandatory" to always trigger the snap-into-view behavior (on the x-axis) of this scroll-animation.
 *                                          "proximity" to trigger the snap-into-view behavior (on the x-axis) of this scroll-animation only if there's one of the 
 *                                           children.elements not further from its snap-point than half of his width. 
 * @param {Boolean} [options.onYAxis="mandatory"] "mandatory" to always trigger the snap-into-view behavior (on the y-axis) of this scroll-animation.
 *                                                "proximity" to trigger the snap-into-view behavior (on the y-axis) of this scroll-animation only if there's one of the 
 *                                                children.elements not further from its snap-point than half of his height. 
 * @param {Array} [options.children] An array of objects that have 2 properties:
 *                                   - element: a direct children of container that you want to snap-into-view.
 *                                   - align: "start" if you want element to be left-aligned on the x-axis and top-aligned on the y-axis.
 *                                            "end" if you want element to be right-aligned on the x-axis and bottom-aligned on the y-axis.
 *                                            Any other value if you want element to be center-aligned on both axes.
 * @param {Number} [options.snapDelay=0] The number of milliseconds that will be waited from the end of the momentum smooth scroll part of this scroll-animation 
 *                                       in order to trigger the beginning of the snap-into-view part.
 * @param {Function} [options.snapEasingX] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
 *                                         scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.snapEasingY] A valid stepLengthCalculator that will control the easing of the snap-into-view part of this 
 *                                         scroll-animation (on the y-axis) of container. 
 * @param {String} [options.debugString="addSnapScrolling"] A string internally used to log the name of the most upper level function that caused an error/warning. 
 *  
 * @returns {SmoothScrollBuilder} The underling SmoothScrollBuilder used for this effect.  
 */
 export function addSnapScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: "mandatory",
        children: [],
        snapDelay: 0,
        snapEasingX: (remaning, ot, t, total) => (total - remaning) / 25 + 1,
        snapEasingY: (remaning, ot, t, total) => (total - remaning) / 25 + 1,
    }, 
) {
    options.debugString = options.debugString || "addSnapScrolling";

    //The callback should be called after the snapScrolling instead of 
    //being called at the end of the momentumScrolling.
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
        const _isScrollbar = _child.element.dataset.uss;
        if(_isScrollbar || uss.getScrollableParent(_child.element, true, options) !== container.container) {
            uss._warningLogger(_child.element, "can't be scrolled into view by scrolling the passed container");
        }
    }

    if(typeof options.snapEasingX !== "function") options.snapEasingX = (remaning, ot, t, total) => (total - remaning) / 25 + 1;
    if(typeof options.snapEasingY !== "function") options.snapEasingY = (remaning, ot, t, total) => (total - remaning) / 25 + 1;

    console.log(options.snapEasingY)

    const _builder = new SnapScrollBuilder(container, options);
    _builder.build();
    
    return _builder;
}





/**
 * This function enables the elastic momentum scrolling on the passed container
 * accordingly to what is specified in the passed options parameter. 
 * @param {*} container An Element, the Window or a SmoothScrollBuilder.
 * @param {Object} options An object which containing the momentum elastic scrolling preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if the elastic momentum smooth scrolling should be enabled on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=true] True if the elastic momentum smooth scrolling should be enabled on the y-axis of container, false otherwise.
 * @param {Array} [options.children] An array of 1 or 2 objects that have only 1 property:
 *                                   - element: a direct children of container.
 *                                   options.children[0] should point to the element that will be left/top aligned after the elastic part of this scroll-animation. 
 *                                   options.children[1] should point to the element that will be right/bottom aligned after the elastic part of this scroll-animation.
 * @param {Number} [options.elasticAmount=100] The region of pixels from the left/top and the right/bottom borders of container that will trigger
 *                                             the elastic part of this scroll-animation when traspassed by the scroll-position of container.    
 * @param {Function} [options.elasticEasingX] A valid stepLengthCalculator that will control the easing of the elastic part of this 
 *                                            scroll-animation (on the x-axis) of container. 
 * @param {Function} [options.elasticEasingY] A valid stepLengthCalculator that will control the easing of the elastic part of this 
 *                                            scroll-animation (on the y-axis) of container. 
 * @param {String} [options.debugString="addElasticScrolling"] A string internally used to log the name of the most upper level function that caused an error/warning. 
 *
 * @returns {SmoothScrollBuilder} The underling SmoothScrollBuilder used for this effect.  
 */
 export function addElasticScrolling(
    container, 
    options = {
        onXAxis: false,
        onYAxis: true,
        children: [],
        elasticAmount: 100,
        elasticEasingX: (remaning) => Math.ceil(uss._framesTime * remaning / 110), 
        elasticEasingY: (remaning) => Math.ceil(uss._framesTime * remaning / 110), 
    }, 
) {
    //Check if the options parameter is a valid object.
    if (!isObject(options)) {
        uss._errorLogger("addElasticScrolling", "the options parameter to be an object", options);
        return;
    }

    options.debugString = options.debugString || "addElasticScrolling";

    //Check if the options.elasticAmount is a number.
    if(!Number.isFinite(options.elasticAmount)) {
        uss._errorLogger(options.debugString, "options.elasticAmount to be a finite number", false);
        return;
    }

    if(options.onXAxis) options.onXAxis = "mandatory";
    if(options.onYAxis) options.onYAxis = "mandatory";

    //Default easing behaviors: ease-out-like.
    options.snapEasingX = typeof options.elasticEasingX === "function" ? options.elasticEasingX : (remaning) => Math.ceil(uss._framesTime * remaning / 110);
    options.snapEasingY = typeof options.elasticEasingY === "function" ? options.elasticEasingY : (remaning) => Math.ceil(uss._framesTime * remaning / 110);
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
 * These scrollbars can controll the momentum scrolling of the passed container. 
 * @param {*} container An Element.
 * @param {Object} options An object which containing the scrollbar's preferences/properties listed below.
 * @param {Boolean} [options.onXAxis=false] True if a smooth scrollbar should be added on the x-axis of container, false otherwise.
 * @param {Boolean} [options.onYAxis=false] True if a smooth scrollbar should be added on the y-axis of container, false otherwise.
 * @param {Boolean} [options.hideScrollbarX=false] True if a data-uss-scrollbar-hidden attribute should indicate (true/false) if the scrollbar on the x-axis of container 
 *                                                 is currently engaged, false otherwise.
 * @param {Boolean} [options.hideScrollbarY=false] True if a data-uss-scrollbar-hidden attribute should indicate (true/false) if the scrollbar on the y-axis of container 
 *                                                 is currently engaged, false otherwise.
 * @param {Number} [options.thumbSize=17] The default width of the scrollbar on the y-axis of container and 
 *                                        the default height of the scrollbar on the x-axis of container. 
 * @param {String} [options.transitionDurationX="0.2s"] This is the value of "transition-duration" css property of the scrollbar-thumb on the x-axis of container
 *                                                      whenever the scrollbar is not engaged, otherwise it's "0s". 
 * @param {String} [options.transitionDurationY="0.2s"] This is the value of "transition-duration" css property of the scrollbar-thumb on the y-axis of container
 *                                                      whenever the scrollbar is not engaged, otherwise it's "0s". 
 * @param {String} [options.debugString="addSmoothScrollbar"] A string internally used to log the name of the most upper level function that caused an error/warning. 
 * @returns {Array} An array containing one object for each scrollbar requested.
 *                  Each scrollbar object has this properties:
 *                  - track {HTMLElement} (public)
 *                  - thumb {HTMLElement} (public)
 *                  - pointerId {Number} (private)
 *                  - delayedScroller {Function} (private)
 *                  - updatePosition {Function} (public)
 */
/*
 export function addSmoothScrollbar(
    container,
    options = {
        onXAxis: false,
        onYAxis: false,
        hideScrollbarX: false,
        hideScrollbarY: false,
        thumbSize: 17,
        transitionDurationX: "0.2s",     
        transitionDurationY: "0.2s",      
        debugString: "addSmoothScrollbar",
    }
) {
    //Check if the options parameter is a valid object.
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
        uss._errorLogger("addSmoothScrollbar", "the options parameter to be an object", options);
        return;
    }

    options.debugString = options.debugString || "addSmoothScrollbar";

    //Check if the container is a valid container.
    const _containerIsElement = container instanceof Element;
    if(!_containerIsElement) {
        uss._errorLogger(options.debugString, "the container to be an Element", container);
        return;
    }
    
    //Check if the thumb size is a finite number.
    const _scrollbarThumbSize = options.thumbSize || 17;
    if(!Number.isFinite(_scrollbarThumbSize)) {
        uss._errorLogger(options.debugString, "the options.thumbSize to be a finite number", options.thumbSize);
        return;
    }
    
    const _onXAxis = options.onXAxis;
    const _onYAxis = options.onYAxis;
    let _scrollbars = [];
    
    //Check if at least one axis was requested to be momentum-scrolled.
    if(!_onXAxis && !_onYAxis) {
        uss._warningLogger(options.debugString, "was invoked but neither onXAxis or onYAxis were set");
        return _scrollbars;
    }

    //Check if the parent node has position:static because it breaks the scrollbars positions. 
    if(container !== document.body && 
       container !== document.documentElement &&
       window.getComputedStyle(container.parentNode).position === "static"
    ) {
        uss._warningLogger(container.parentNode, "has position:static which may affect the scrollbars positioning")
    }
    
    //Any ussmoverequest is handled by the scrollbars not by the container itself.
    container.addEventListener("ussmoverequest", (event) => {
        const __newEvent = new CustomEvent(
            "ussmoverequest", 
            {
                cancelable: true,
                detail: event.detail
            }
        );
        for(const scrollbar of _scrollbars) {
            scrollbar.thumb.dispatchEvent(__newEvent);
            if(__newEvent.defaultPrevented) event.preventDefault();
        }
    }, {passive:false});

    //Modify the container overflow's styles before caching the maxScrollX/Y values.
    if(_onXAxis) container.style.overflowX = "hidden";
    if(_onYAxis) container.style.overflowY = "hidden";

    if(_onXAxis) {
        //Check if the x-axis of the passed container is actually scrollable. 
        if(uss.getMaxScrollX(container, true, options) < 1) {
            uss._errorLogger(options.debugString, "a container that can be scrolled on the x-axis", container);
            return;
        }

        const _offset = _onYAxis ? _scrollbarThumbSize : 0;
        const _scrollbar = {
            track: document.createElement("div"),
            thumb: document.createElement("div"),
            pointerId: null,
            delayedScroller: null,
        }

        //Default dataset.
        _scrollbar.track.dataset.uss = "scrollbar-track-x";
        _scrollbar.thumb.dataset.uss = "scrollbar-thumb-x";

        //Scrollbar track visibility styles.
        _scrollbar.track.style = `
            contain: style paint;
            touch-action: none;
            position: absolute;
            z-index: 1;
            bottom: 0px;
            left: 0px;
            width: calc(100% - ${_offset}px);
            height: ${_scrollbarThumbSize}px;
        `

        //Scrollbar thumb visibility styles.
        _scrollbar.thumb.style = `
            position: absolute;
            touch-action: none;
            width: 25%;
            height: 100%;
        `

        //Accessibility styles.
        _scrollbar.track.tabIndex = -1;
        _scrollbar.thumb.tabIndex = -1;
  
        //Scroll the container on a pointermove event by the correspoing amount.
        let _selfMoveRequest = false;
        const _scrollContainer = (event) => { 
            //Only one pointer at a time can control the scrollbar.
            if(_scrollbar.pointerId !== event.pointerId) return;

            const __delta = event.movementX; 
            if(__delta === 0) return; 
            
            event.preventDefault();
            event.stopPropagation();

            const __containerScrollSize = uss.getMaxScrollX(container, false, options);
            const __trackSize = _scrollbar.track.clientWidth;
            
            const __scrollMultiplier = __containerScrollSize / __trackSize * 1.3325581395348836;
            const __finalDelta = __delta * __scrollMultiplier; 

            _selfMoveRequest = true;
            _scrollbar.delayedScroller = null;

            //Synchronous call that will execute _moveScrollbar after it.
            container.dispatchEvent(
                new WheelEvent(
                    "wheel", 
                    {
                        deltaX: __finalDelta,
                        deltaY: 0,
                    }
                )
            );
        }

        //Handle a ussmoverequest event by moving the scrollbar to the correct position.
        const _moveScrollbar = (event) => {
            //The event will be handled by the other scrollbar.
            if(event.detail.axis === 1) return;

            //Check if the scroll position of the container has already been updated,
            //if not use the scroller property of this event to update it. 
            const __scrollPositionAlreadyUpdated = event.defaultPrevented;
            event.preventDefault();

            //The user is still holding down the scrollbar, 
            //this request will be handled on the pointerup event if needed. 
            if(!_selfMoveRequest && _scrollbar.pointerId !== null) {
                _scrollbar.delayedScroller = event.detail.scroller;
                return;
            }
            
            //Update the container's final positions. 
            if(!__scrollPositionAlreadyUpdated) event.detail.scroller();

            const __thumbSize = _scrollbar.thumb.clientWidth;
            const __trackSize = _scrollbar.track.clientWidth;

            let __scrolledPercentage = uss.getFinalXPosition(container, options) / uss.getMaxScrollX(container, false, options);
            __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                   __scrolledPercentage < 0 ? 0 : 
                                   __scrolledPercentage;

            const __translateAmount = __scrolledPercentage * (__trackSize - __thumbSize);
            
            _scrollbar.thumb.style.transitionDuration = _scrollbar.pointerId !== null ? "0s" : options.transitionDurationX || "0.2s";
            _scrollbar.thumb.style.transform = "translateX(" + __translateAmount + "px)";
            _selfMoveRequest = false;
        }

        const _handlePointerDownOnTrack = (event) => {
            event.preventDefault();
            event.stopPropagation();

            //Trigger this move-to-position behavior only if the user
            //is not controlling the scrollbar with a pointer.
            if(_scrollbar.pointerId !== null) return;

            //The final scroll-position of container is proportional to  
            //where the user has clicked inside the scrollbar track.
            const __currentFinalPos = uss.getFinalXPosition(container);
            const __containerScrollSize = uss.getMaxScrollX(container, false, options);
            const __trackSize = _scrollbar.track.clientWidth;
            const __finalPos = event.offsetX / __trackSize * __containerScrollSize; 

            //The scrollbar will already be in the right position, no action needed.
            if(__currentFinalPos === __finalPos) return;

            //Scroll the container to the calculated position, inform the container that
            //it's being scrolled so that any effect (snap, elastic, etc...) is applied
            //and update the scrollbar position.
            uss.scrollXTo(__finalPos, container);
            _scrollbar.updatePosition();
        }

        _scrollbarSetup(_scrollbar, _scrollContainer, _moveScrollbar, _handlePointerDownOnTrack, options.hideScrollbarX);

        //Add the scrollbar to the container.
        _scrollbar.track.appendChild(_scrollbar.thumb);
        container.insertBefore(_scrollbar.track, container.firstChild);
        
        _scrollbars.push(_scrollbar);

        uss.addOnResizeEndCallback(_scrollbar.updatePosition);
    }

    if(_onYAxis) {
        //Check if the y-axis of the passed container is actually scrollable. 
        if(uss.getMaxScrollY(container, true, options) < 1) {
            uss._errorLogger(options.debugString, "a container that can be scrolled on the y-axis", container);
            return;
        }

        const _scrollbar = {
            track: document.createElement("div"),
            thumb: document.createElement("div"),
            pointerId: null,
            delayedScroller: null,
        }
    
        //Default dataset.
        _scrollbar.track.dataset.uss = "scrollbar-track-y";
        _scrollbar.thumb.dataset.uss = "scrollbar-thumb-y";

        //Scrollbar track visibility styles.
        _scrollbar.track.style = `
            contain: style paint;
            touch-action: none;
            position: absolute;
            z-index: 1;
            top: 0px;
            right: 0px;
            width: ${_scrollbarThumbSize}px;
            height: 100%;
        `

        //Scrollbar thumb visibility styles.
        _scrollbar.thumb.style = `
            position: absolute;
            touch-action: none;
            width: 100%;
            height: 25%;
        `

        //Accessibility styles.
        _scrollbar.track.tabIndex = -1;
        _scrollbar.thumb.tabIndex = -1;
  
        //Scroll the container on a pointermove event by the correspoing amount.
        let _selfMoveRequest = false;
        const _scrollContainer = (event) => {  
            //Only one pointer at a time can control the scrollbar.
            if(_scrollbar.pointerId !== event.pointerId) return;
     
            const __delta = event.movementY; 
            if(__delta === 0) return; 

            event.preventDefault();
            event.stopPropagation();       

            const __containerScrollSize = uss.getMaxScrollY(container, false, options);
            const __trackSize = _scrollbar.track.clientHeight;
            
            const __scrollMultiplier = __containerScrollSize / __trackSize * 1.3325581395348836;
            const __finalDelta = __delta * __scrollMultiplier; 

            _selfMoveRequest = true;
            _scrollbar.delayedScroller = null;

            //Synchronous call that will execute _moveScrollbar after it.
            container.dispatchEvent(
                new WheelEvent(
                    "wheel", 
                    {
                        deltaX: 0,
                        deltaY: __finalDelta,
                    }
                )
            );
        }

        //Handle a ussmoverequest event by moving the scrollbar to the correct position.
        const _moveScrollbar = (event) => {
            //The event will be handled by the other scrollbar.
            if(event.detail.axis === 0) return;

            //Check if the scroll position of the container has already been updated,
            //if not use the scroller property of this event to update it. 
            const __scrollPositionAlreadyUpdated = event.defaultPrevented;
            event.preventDefault();

            //The user is still holding down the scrollbar, 
            //this request will be handled on the pointerup event if needed. 
            if(!_selfMoveRequest && _scrollbar.pointerId !== null) {
                _scrollbar.delayedScroller = event.detail.scroller;
                return;
            }

            //Update the container's final positions. 
            if(!__scrollPositionAlreadyUpdated) event.detail.scroller();

            const __thumbSize = _scrollbar.thumb.clientHeight;
            const __trackSize = _scrollbar.track.clientHeight;

            let __scrolledPercentage = uss.getFinalYPosition(container, options) / uss.getMaxScrollY(container, false, options);
            __scrolledPercentage = __scrolledPercentage > 1 ? 1 :
                                   __scrolledPercentage < 0 ? 0 : 
                                   __scrolledPercentage;

            const __translateAmount = __scrolledPercentage * (__trackSize - __thumbSize);
            
            _scrollbar.thumb.style.transitionDuration = _scrollbar.pointerId !== null ? "0s" : options.transitionDurationY || "0.2s";
            _scrollbar.thumb.style.transform = "translateY(" + __translateAmount + "px)";
            _selfMoveRequest = false;
        }

        const _handlePointerDownOnTrack = (event) => {
            event.preventDefault();
            event.stopPropagation();

            //Trigger this move-to-position behavior only if the user
            //is not controlling the scrollbar with a pointer.
            if(_scrollbar.pointerId !== null) return;

            //The final scroll-position of container is proportional to  
            //where the user has clicked inside the scrollbar track.
            const __currentFinalPos = uss.getFinalYPosition(container);
            const __containerScrollSize = uss.getMaxScrollY(container, false, options);
            const __trackSize = _scrollbar.track.clientHeight;
            const __finalPos = event.offsetY / __trackSize * __containerScrollSize; 

            //The scrollbar will already be in the right position, no action needed.
            if(__currentFinalPos === __finalPos) return;

            //Scroll the container to the calculated position, inform the container that
            //it's being scrolled so that any effect (snap, elastic, etc...) is applied
            //and update the scrollbar position.
            uss.scrollYTo(__finalPos, container);
            _scrollbar.updatePosition();
        }

        _scrollbarSetup(_scrollbar, _scrollContainer, _moveScrollbar, _handlePointerDownOnTrack, options.hideScrollbarY);

        //Add the scrollbar to the container.
        _scrollbar.track.appendChild(_scrollbar.thumb);
        container.insertBefore(_scrollbar.track, container.firstChild);
        
        _scrollbars.push(_scrollbar);
        
        uss.addOnResizeEndCallback(_scrollbar.updatePosition);
    }

    function _scrollbarSetup(scrollbar, scrollContainer, moveScrollbar, handlePointerDownOnTrack, hideScrollbar) {
        scrollbar.updatePosition = () => {
            container.dispatchEvent(
                new WheelEvent(
                    "wheel",
                    {
                        deltaX: 0, 
                        deltaY: 0,
                    }
                )
            );
        }

        let __hideScrollbarIfNeeded = () => {};

        //Set the scrollbar status to engaged/disengaged by saving the id of
        //the pointer that is controlling it.
        const __setScrollbarEngagement = (event, id) => {
            event.preventDefault();
            event.stopPropagation();
            scrollbar.pointerId = id;
        } 

        //Disengage the scrollbar and handle any previous delayed scroll request.
        const __disengageScrollbar = (event) => {    
            //Wait for the initial pointer to leave the touch-surface.
            if(event.pointerId !== scrollbar.pointerId) return;

            __setScrollbarEngagement(event, null);  
            window.removeEventListener("pointermove", scrollContainer, {passive:false});     
            window.removeEventListener("pointerup", __disengageScrollbar, {passive:false});   

            //Handle any delayed scroll request if any.
            if(scrollbar.delayedScroller) {
                scrollbar.delayedScroller();
                scrollbar.updatePosition();
            }
            __hideScrollbarIfNeeded();
        }

        //If the user clicks the scrollbar track, the container should be scrolled to
        //the corresponding position and the scrollbar thumb should be moved accordingly.
        scrollbar.track.addEventListener("pointerdown", handlePointerDownOnTrack, {passive:false});

        //Engage the scrollbar.
        scrollbar.thumb.addEventListener("pointerdown", (event) => {
            //Only one pointer at a time can control the scrollbar.
            if(scrollbar.pointerId !== null) return;
        
            __setScrollbarEngagement(event, event.pointerId);     
            window.addEventListener("pointerup", __disengageScrollbar, {passive:false});
            window.addEventListener("pointermove", scrollContainer, {passive:false});   
        }, {passive:false});
        
        //Make the scrollbar listen for events that makes it move.
        scrollbar.thumb.addEventListener("ussmoverequest", moveScrollbar, {passive:false});

        //If requested, keep track of the scrollbar's hidden status.
        if(hideScrollbar) {
            let __pointerIsHoveringTrack = false;
            
            //The scrollbar's status is never set to hidden if the pointer is on it.
            scrollbar.track.addEventListener("pointerenter", () => {
                __pointerIsHoveringTrack = true;
                if(scrollbar.pointerId !== null) return;
                scrollbar.track.dataset.ussScrollbarHidden = false; 
            }, {passive:true});
            
            //The scrollbar's status is set to hidden if the pointer  
            //is not hovering it and the scrollbar thumb isn't being used.
            scrollbar.track.addEventListener("pointerleave", () => {
                __pointerIsHoveringTrack = false;
                if(scrollbar.pointerId !== null) return;
                scrollbar.thumb.style.transitionDuration = "";
                scrollbar.track.dataset.ussScrollbarHidden = true; 
            }, {passive:true});
            
            //Whenever the scrollbar is disengaged, check if  
            //its status should be set to hidden.
            __hideScrollbarIfNeeded = () => {
                if(__pointerIsHoveringTrack) return;
                scrollbar.thumb.style.transitionDuration = "";
                scrollbar.track.dataset.ussScrollbarHidden = true; 
            }

            //The scrollbar is initially hidden.
            scrollbar.track.dataset.ussScrollbarHidden = true; 
        }
    }

    return _scrollbars;
}
*/