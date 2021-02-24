const DEFAULTXSTEPLENGTH = window.innerWidth  * 50 / 1920; //Default number of pixel scrolled in a single scroll-animation's step on the x-axis: 50px steps for a 1920px screen width.
const DEFAULTYSTEPLENGTH = window.innerHeight * 50 / 937;  //Default number of pixel scrolled in a single scroll-animation's step on the y-axis: 50px steps for a 937px(1080px - urlbar) screen height.
const DEFAULTMINANIMATIONFRAMES = 5;                       //Default lowest possible number of frames any scroll-animation should last.

/*
 * _xMapContainerAnimationID: Map(Container, Array[idNumber]), a map in which:
 *                            1) The keys are the containers on which a scroll-animation on the x-axis has been requested.
 *                            2) The values are Array of IDs. This IDs are provided by the requestAnimationFrame() calls and
 *                               are used internally to keep track of the next scroll-animation's step function call and also
 *                               by the stopScrollingX() function to stop any scroll-animation on the x-axis for the passed container.
 * _yMapContainerAnimationID: Map(Container, Array[idNumber]), a map in which:
 *                            1) The keys are the containers on which a scroll-animation on the y-axis has been requested.
 *                            2) The values are Array of IDs. This IDs are provided by the requestAnimationFrame() calls and
 *                               are used internally to keep track of the next scroll-animation's step function call and also
 *                               by the stopScrollingY() function to stop any scroll-animation on the x-axis for the passed container.
 * _xStepLengthCalculator: Map(Container, stepCalculatorFunction), a map in which:
 *                         1) The keys are the container on which a scroll-animation on the x-axis has been requested.
 *                         2) The values are user-defined functions that can modify the step's length at each
 *                            _stepX (internal function that executes the instructions for a single scroll-animation's step on the x-axis) call of a scroll-animation.
 * _yStepLengthCalculator: Map(Container, stepCalculatorFunction), a map in which:
 *                         1) The keys are the container on which a scroll-animation on the y-axis has been requested.
 *                         2) The values are user-defined functions that can modify the step's length at each
 *                            _stepY (internal function that executes the instructions for a single scroll-animation's step on the y-axis) call of a scroll-animation.
 * _xStepLength: number, the number of pixel scrolled on the x-axis in a single scroll-animation's step.
 * _yStepLength: number, the number of pixel scrolled on the y-axis in a single scroll-animation's step.
 * _minAnimationFrame: number, the minimum number of frames any scroll-animation, on any axis, should last.
 *
 * isXscrolling: function, returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
 * isYscrolling: function, returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
 * getXStepLengthCalculator: function, returns the _xStepLengthCalculator function for the passed container.
 * getYStepLengthCalculator: function, returns the _yStepLengthCalculator function for the passed container.
 * getXStepLength: function, returns the value of _xStepLength.
 * getYStepLength: function, returns the value of _yStepLength.
 * getMinAnimationFrame: function, returns the value of _minAnimationFrame.
 * setXStepLengthCalculator: function, sets the _xStepLengthCalculator for the requested container to the passed function if compatible.
 * setYStepLengthCalculator: function, sets the _yStepLengthCalculator for the requested container to the passed function if compatible.
 * setXStepLength: function, sets the _xStepLength to the passed value if compatible.
 * setYStepLength: function, sets the _yStepLength to the passed value if compatible.
 * setMinAnimationFrame: function, sets the _minAnimationFrame to the passed value if compatible.
 * calcXStepLength: function, takes in the remaning scroll amount of a scroll-animation on the x-axis and
 *                 calculates how long each animation-step must be in order to target the _minAnimationFrame.
 * calcYStepLength: function, takes in the remaning scroll amount of a scroll-animation on the y-axis and
 *                 calculates how long each animation-step must be in order to target the _minAnimationFrame.
 * getScrollXCalculator: function, takes in a container and returns a function that returns:
 *                       1) The scrollLeft property of the container if it's a DOM element.
 *                       2) The scrollX property of the container if it's the window element.
 * getScrollYCalculator: function, takes in a container and returns a function that returns:
 *                       1) The scrollTop property of the container if it's a DOM element.
 *                       2) The scrollY property of the container if it's the window element.
 * getMaxScrollX: function, takes in a scroll container and returns its highest scroll-reachable x-value.
 * getMaxScrollY: function, takes in a scroll container and returns its highest scroll-reachable y-value.
 * getScrollableParent: function, returns the first scrollable container of the passed element, works with "overflow('',X,Y): hidden" if specified.
 * scrollXTo: function, takes in a number which indicates the position that the passed container's "scrollX" (the left border's x-coordinate)
 *            has to reach and performs a scroll-animation on the x-axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollYTo: function, takes in a number which indicates the position that tha passed container's "scrollY" (the top border's y-coordinate)
 *            has to reach and performs a scroll-animation on the y-axis,
 *            After the animation has finished a callback function can be invoked.
 * scrollXBy: function, takes in a number which indicates the number of pixel on the x-axis the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollYBy: function, takes in a number which indicates the number of pixel on the y-axis the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis.
 *            After the animation has finished a callback function can be invoked.
 * scrollTo: function, a shorthand for calling scrollXTo() and scrollYTo() one after another (the 2 animations are performed at the same time),
 *           performs 2 scroll-animation on the x and y axises based on the passed parameters.
 * scrollBy: function, a shorthand for calling scrollXBy() and scrollYBy() one after another (the 2 animations are performed at the same time),
 *           performs 2 scroll-animation on the x and y axises based on the passed parameters.
 * scrollIntoView: function, scrolls the window and if necessary the container of the passed element in order to
 *                 make it visible on the screen.
 *                 There are 3 possible allignments for both the passed element and it's closest scollable parent: top, bottom, center.
 *                 The allignments can be changed by passing different values of alignToTop and alignToLeft.
 *                 Works with "overflow('',X,Y): hidden" if specified.
 * stopScrollingX: function, stops all the current scroll-animation on the x-axis of the passed container.
 *                 After the animation has finished a callback function can be invoked.
 * stopScrollingY: function, stops all the current scroll-animation on the y-axis of the passed container.
 *                 After the animation has finished a callback function can be invoked.
 * stopScrolling: function, stops all the current scroll-animation on both the x-axis and the y-axis of the passed container.
 *                After the animation has finished a callback function can be invoked.
 * hrefSetup: function, looks for every anchor element with a href attribute linked to an element on the same page and
 *            attaches an eventListener(onclick) to it in order to trigger a smooth-scroll-animation
 *            to reach the linked element (internally uses scrollIntoView).
 */
var uss = {
  _xMapContainerAnimationID: new Map(),
  _yMapContainerAnimationID: new Map(),
  _xStepLengthCalculator: new Map(),
  _yStepLengthCalculator: new Map(),
  _xStepLength: DEFAULTXSTEPLENGTH,
  _yStepLength: DEFAULTYSTEPLENGTH,
  _minAnimationFrame: DEFAULTMINANIMATIONFRAMES,
  isXscrolling: function (container = window) {const _scheduledAnimations = uss._xMapContainerAnimationID.get(container); return typeof _scheduledAnimations !== "undefined" && _scheduledAnimations.length > 0;},
  isYscrolling: function (container = window) {const _scheduledAnimations = uss._yMapContainerAnimationID.get(container); return typeof _scheduledAnimations !== "undefined" && _scheduledAnimations.length > 0;},
  getXStepLengthCalculator: function (container = window) {return uss._xStepLengthCalculator.get(container)},
  getYStepLengthCalculator: function (container = window) {return uss._yStepLengthCalculator.get(container)},
  getXStepLength: function () {return uss._xStepLength;},
  getYStepLength: function () {return uss._yStepLength;},
  getMinAnimationFrame: function () {return uss._minAnimationFrame;},
  setXStepLengthCalculator: function (newCalculator = undefined, container = window) {
    if(typeof newCalculator !== "function") {console.log("USS error: ", newCalculator, " is not a function"); return;}
    const _remaning = uss.getMaxScrollX(container);
    const _testValue = newCalculator(_remaning, 0, _remaning, 0, _remaning, container); //remaningScrollAmount, timestamp, totalScrollAmount, currentXPosition, finalXPosition, container
    if(typeof _testValue !== "number" || window.isNaN(_testValue)) {console.log("USS error: ", newCalculator, " didn't return a valid step value"); return;}
    uss._xStepLengthCalculator.set(container, newCalculator)
  },
  setYStepLengthCalculator: function (newCalculator = undefined, container = window) {
    if(typeof newCalculator !== "function") {console.log("USS error: ", newCalculator, " is not a function"); return;}
    const _remaning = uss.getMaxScrollY(container);
    const _testValue = newCalculator(_remaning, 0, _remaning, 0, _remaning, container); //remaningScrollAmount, timestamp, totalScrollAmount, currentXPosition, finalXPosition, container
    if(typeof _testValue !== "number" || window.isNaN(_testValue)) {console.log("USS error: ", newCalculator, " didn't return a valid step value"); return;}
    uss._yStepLengthCalculator.set(container, newCalculator)
  },
  setXStepLength: function (newXStepLength) {
    if(typeof newXStepLength !== "number" || window.isNaN(newXStepLength)) {console.log("USS error: ", newXStepLength, " is not a number"); return;}
    if(newXStepLength <= 0) {console.log("USS error: ", newXStepLength, " must be a positive number"); return;}
    uss._xStepLength = newXStepLength;
  },
  setYStepLength: function (newYStepLength) {
    if(typeof newYStepLength !== "number" || window.isNaN(newYStepLength)) {console.log("USS error: ", newYStepLength, " is not a number"); return;}
    if(newYStepLength <= 0) {console.log("USS error: ", newYStepLength, " must be a positive number"); return;}
    uss._yStepLength = newYStepLength;
  },
  setMinAnimationFrame: function (newMinAnimationFrame) {
    if(typeof newMinAnimationFrame !== "number" || window.isNaN(newMinAnimationFrame)) {console.log("USS error: ", newMinAnimationFrame, " is not a number"); return;}
    if(newMinAnimationFrame <= 0) {console.log("USS error: ", newMinAnimationFrame, " must be a positive number"); return;}
    uss._minAnimationFrame = newMinAnimationFrame;
  },
  calcXStepLength: function (deltaX) {return (deltaX >= (uss._minAnimationFrame - 1) * uss._xStepLength) ? uss._xStepLength : Math.round(deltaX / uss._minAnimationFrame);},
  calcYStepLength: function (deltaY) {return (deltaY >= (uss._minAnimationFrame - 1) * uss._yStepLength) ? uss._yStepLength : Math.round(deltaY / uss._minAnimationFrame);},
  getScrollXCalculator: function (container = window) {return (container instanceof HTMLElement) ? () => {return container.scrollLeft} : () => {return container.scrollX};},
  getScrollYCalculator: function (container = window) {return (container instanceof HTMLElement) ? () => {return container.scrollTop}  : () => {return container.scrollY};},
  getMaxScrollX: function (container = window) {
    const html = document.documentElement;
    const body = document.body;
    return (container instanceof HTMLElement) ?
      container.scrollWidth - container.clientWidth :
      Math.max(
        body.scrollWidth,
        body.offsetWidth,
        body.clientWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      ) - html.clientWidth; //Subtract document width because the scroll-animations on the x-axis always starts from the left of the container
  },
  getMaxScrollY: function (container = window) {
    const html = document.documentElement;
    const body = document.body;
    return (container instanceof HTMLElement) ?
      container.scrollHeight - container.clientHeight :
      Math.max(
        body.scrollHeight,
        body.offsetHeight,
        body.clientHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      ) - html.clientHeight; //Subtract document height because the scroll-animations on the y-axis always starts from the top of the container
  },
  getScrollableParent: function (element = window, includeHidden = false) {
    try {
      let style = getComputedStyle(element);
      const excludeStaticParent = style.position === "absolute";
      const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

      if (style.position === "fixed") return window;
      for (let container = element; (container = container.parentElement);) {
          style = getComputedStyle(container);
          if (excludeStaticParent && style.position === "static") continue;
          if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return container;
      }
      return window;
    } catch(exception) {console.log("USS error: Couldn't get the parent container of the element:\n", element);}
  },
  scrollXTo: function (finalXPosition, container = window, callback = () => {}, canOverlay = false) {
    if (typeof finalXPosition !== "number" || window.isNaN(finalXPosition)) {console.log("USS error: ", finalXPosition, " is not a number"); return;}

    //If the container cannot be scrolled on the x-axis _maxScrollX will be <= 0 and the function returns.
    //If the scroll-limit has already been reached, no scroll-animation is performed.
    const _maxScrollX = uss.getMaxScrollX(container);
    if(_maxScrollX <= 0) return;
    if(finalXPosition < 0) finalXPosition = 0;

    const scrollXCalculator = uss.getScrollXCalculator(container);
    const scrollYCalculator = uss.getScrollYCalculator(container);
    let _totalScrollAmount = finalXPosition - scrollXCalculator();
    const _direction = Math.sign(_totalScrollAmount);
    _totalScrollAmount *= _direction;
    if(_totalScrollAmount <= 0) {if(typeof callback === "function") setTimeout(callback, 0); return;}

    const _scrollStepLength = uss.calcXStepLength(_totalScrollAmount); //Default value for the step length

    //If one or more scroll-animation on the x-axis of the passed component have being scheduled
    //and the current requested scroll-animation cannot be overlayed,
    //all the already-scheduled ones gets cancelled in order to make the new one play.
    if(canOverlay === false) uss.stopScrollingX(container, null);

    let _scheduledAnimations = uss._xMapContainerAnimationID.get(container);  //List of already scheduled animations' IDs
    if(typeof _scheduledAnimations === "undefined") _scheduledAnimations = [];
    _scheduledAnimations.push(window.requestAnimationFrame(_stepX));
    uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
    const _stepCalculator = uss._xStepLengthCalculator.get(container);
    const _usesCustomStepCalculator = typeof _stepCalculator === "function";

    function _stepX (timestamp) {
      _scheduledAnimations = uss._xMapContainerAnimationID.get(container);
      _scheduledAnimations.shift(); //The first _stepX to be executed is the first one which set an id

      const _currentXPosition = scrollXCalculator();
      const _remaningScrollAmount = (finalXPosition - _currentXPosition) * _direction;
      if(_remaningScrollAmount <= 0) {
        uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      let _calculatedScrollStepLength;
      if (_usesCustomStepCalculator) {
        _calculatedScrollStepLength = _stepCalculator(_remaningScrollAmount, timestamp, _totalScrollAmount, _currentXPosition, finalXPosition, container);
        if(_calculatedScrollStepLength < 0) _calculatedScrollStepLength = _scrollStepLength;
      } else _calculatedScrollStepLength = _scrollStepLength;

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        container.scroll(finalXPosition, scrollYCalculator());
        uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      container.scroll(_currentXPosition + _calculatedScrollStepLength * _direction, scrollYCalculator());

      if(_currentXPosition === scrollXCalculator()) { //The finalXPosition was beyond the scroll limit of the container
        uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      _scheduledAnimations.push(window.requestAnimationFrame(_stepX));
      uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
    }
  },
  scrollYTo: function (finalYPosition, container = window, callback = () => {}, canOverlay = false) {
    if (typeof finalYPosition !== "number" || window.isNaN(finalYPosition)) {console.log("USS error: ", finalYPosition, " is not a number"); return;}

    //If the container cannot be scrolled on the y-axis _maxScrollY will be <= 0 and the function returns.
    //If the scroll-limit has already been reached, no scroll-animation is performed.
    const _maxScrollY = uss.getMaxScrollY(container);
    if(_maxScrollY <= 0) return;
    if(finalYPosition < 0) finalYPosition = 0;

    const scrollXCalculator = uss.getScrollXCalculator(container);
    const scrollYCalculator = uss.getScrollYCalculator(container);
    let _totalScrollAmount = finalYPosition - scrollYCalculator();
    const _direction = Math.sign(_totalScrollAmount);
    _totalScrollAmount *= _direction;
    if(_totalScrollAmount <= 0) {if(typeof callback === "function") setTimeout(callback, 0); return;}

    const _scrollStepLength = uss.calcYStepLength(_totalScrollAmount); //Default value for the step length

    //If one or more scroll-animation on the y-axis of the passed component have being scheduled
    //and the current requested scroll-animation cannot be overlayed,
    //all the already-scheduled ones gets cancelled in order to make the new one play.
    if(canOverlay === false) uss.stopScrollingY(container, null);

    let _scheduledAnimations = uss._yMapContainerAnimationID.get(container);  //List of already scheduled animations' IDs
    if(typeof _scheduledAnimations === "undefined") _scheduledAnimations = [];
    _scheduledAnimations.push(window.requestAnimationFrame(_stepY));
    uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
    const _stepCalculator = uss._yStepLengthCalculator.get(container);
    const _usesCustomStepCalculator = typeof _stepCalculator === "function";

    function _stepY (timestamp) {
      _scheduledAnimations = uss._yMapContainerAnimationID.get(container);
      _scheduledAnimations.shift(); //The first _stepY to be executed is the first one which set an id

      const _currentYPosition = scrollYCalculator();
      const _remaningScrollAmount = (finalYPosition - _currentYPosition) * _direction;
      if(_remaningScrollAmount <= 0) {
        uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      let _calculatedScrollStepLength;
      if (_usesCustomStepCalculator) {
        _calculatedScrollStepLength = _stepCalculator(_remaningScrollAmount, timestamp, _totalScrollAmount, _currentYPosition, finalYPosition, container);
        if(_calculatedScrollStepLength < 0) _calculatedScrollStepLength = _scrollStepLength;
      } else _calculatedScrollStepLength = _scrollStepLength;

      if(_remaningScrollAmount <= _calculatedScrollStepLength) {
        container.scroll(scrollXCalculator(), finalYPosition);
        uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      container.scroll(scrollXCalculator(), _currentYPosition + _calculatedScrollStepLength * _direction);

      if(_currentYPosition === scrollYCalculator()) { //The finalYPosition was beyond the scroll limit of the container
        uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      _scheduledAnimations.push(window.requestAnimationFrame(_stepY));
      uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
    }
  },
  scrollXBy: function (deltaX, container = window, callback = () => {}, canOverlay = false) {
    if (typeof deltaX !== "number" || window.isNaN(deltaX)) {console.log("USS error: ", deltaX, " is not a number"); return;}
    if(deltaX === 0) return;
    uss.scrollXTo(uss.getScrollXCalculator(container)() + deltaX, container, callback, canOverlay);
  },
  scrollYBy: function (deltaY, container = window, callback = () => {}, canOverlay = false) {
    if (typeof deltaY !== "number" || window.isNaN(deltaY)) {console.log("USS error: ", deltaY, " is not a number"); return;}
    if(deltaY === 0) return;
    uss.scrollYTo(uss.getScrollYCalculator(container)() + deltaY, container, callback, canOverlay);
  },
  scrollTo: function (finalXPosition, finalYPosition, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false) {
    setTimeout(() => uss.scrollXTo(finalXPosition, xContainer, xCallback, xCanOverlay), 0);//Async so that the browser can repaint
    setTimeout(() => uss.scrollYTo(finalYPosition, yContainer, yCallback, yCanOverlay), 0);//Async so that the browser can repaint
  },
  scrollBy: function (deltaX, deltaY, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false) {
    setTimeout(() => uss.scrollXBy(deltaX, xContainer, xCallback, xCanOverlay), 0);//Async so that the browser can repaint
    setTimeout(() => uss.scrollYBy(deltaY, yContainer, yCallback, yCanOverlay), 0);//Async so that the browser can repaint
  },
  scrollIntoView: function (element = window, alignToLeft = true, alignToTop = true, includeHidden = false) {
    if(element === window) return;
    const container = uss.getScrollableParent(element, includeHidden);
    const elementBoundingClientRect = element.getBoundingClientRect();
    let elementOffsetLeft;
    let elementOffsetTop;
    if(container !== window) {
      const containerBoundingClientRect = container.getBoundingClientRect();
      const containerOffsetLeft = (alignToLeft === true) ? containerBoundingClientRect.left : (alignToLeft === false) ? containerBoundingClientRect.left - window.innerWidth  + containerBoundingClientRect.width  : containerBoundingClientRect.left - window.innerWidth  / 2 + containerBoundingClientRect.width  / 2;
      const containerOffsetTop  = (alignToTop  === true) ? containerBoundingClientRect.top  : (alignToTop  === false) ? containerBoundingClientRect.top  - window.innerHeight + containerBoundingClientRect.height : containerBoundingClientRect.top  - window.innerHeight / 2 + containerBoundingClientRect.height / 2;
      elementOffsetLeft = (alignToLeft === true) ? elementBoundingClientRect.left - containerBoundingClientRect.left : (alignToLeft === false) ? elementBoundingClientRect.left - containerBoundingClientRect.left - containerBoundingClientRect.width  + elementBoundingClientRect.width  : elementBoundingClientRect.left - containerBoundingClientRect.left - containerBoundingClientRect.width  / 2 + elementBoundingClientRect.width  / 2;
      elementOffsetTop  = (alignToTop  === true) ? elementBoundingClientRect.top  - containerBoundingClientRect.top  : (alignToTop  === false) ? elementBoundingClientRect.top  - containerBoundingClientRect.top  - containerBoundingClientRect.height + elementBoundingClientRect.height : elementBoundingClientRect.top  - containerBoundingClientRect.top  - containerBoundingClientRect.height / 2 + elementBoundingClientRect.height / 2;
      setTimeout(() => uss.scrollXBy(containerOffsetLeft, window, null, false), 0); //Async so that the browser can repaint
      setTimeout(() => uss.scrollYBy(containerOffsetTop,  window, null, false), 0); //Async so that the browser can repaint
    } else {
      elementOffsetLeft = (alignToLeft === true) ? elementBoundingClientRect.left : (alignToLeft === false) ? elementBoundingClientRect.left - window.innerWidth  + elementBoundingClientRect.width  : elementBoundingClientRect.left - window.innerWidth  / 2 + elementBoundingClientRect.width  / 2;
      elementOffsetTop  = (alignToTop  === true) ? elementBoundingClientRect.top  : (alignToTop  === false) ? elementBoundingClientRect.top  - window.innerHeight + elementBoundingClientRect.height : elementBoundingClientRect.top  - window.innerHeight / 2 + elementBoundingClientRect.height / 2;
    }
    setTimeout(() => uss.scrollXBy(elementOffsetLeft, container, null, false), 0); //Async so that the browser can repaint
    setTimeout(() => uss.scrollYBy(elementOffsetTop,  container, null, false), 0); //Async so that the browser can repaint
  },
  stopScrollingX: function (container = window, callback = () => {}) {
    let _scheduledAnimations = uss._xMapContainerAnimationID.get(container);
    if(typeof _scheduledAnimations === "undefined" || _scheduledAnimations.length === 0) return;
    _scheduledAnimations.forEach(animationID => window.cancelAnimationFrame(animationID));
    uss._xMapContainerAnimationID.set(container, []);
    if(typeof callback === "function") setTimeout(callback, 0);
  },
  stopScrollingY: function (container = window, callback = () => {}) {
    let _scheduledAnimations = uss._yMapContainerAnimationID.get(container);
    if(typeof _scheduledAnimations === "undefined" || _scheduledAnimations.length === 0) return;
    _scheduledAnimations.forEach(animationID => window.cancelAnimationFrame(animationID));
    uss._yMapContainerAnimationID.set(container, []);
    if(typeof callback === "function") setTimeout(callback, 0);
  },
  stopScrolling: function (container = window, callback = () => {}) {
    uss.stopScrollingX(container, null);
    uss.stopScrollingY(container, callback);
  },
  hrefSetup: function (includeHidden = false) {
    const pageLinks = document.links;
    const pageURL = document.URL.split("#")[0];
    for(pageLink of pageLinks) {
      const pageLinkParts = pageLink.href.split("#"); //PageLink.href = OptionalURL#Section
      if(pageLinkParts[0] !== pageURL) continue;
      const elementToReach = document.getElementById(pageLinkParts[1]);
      if(elementToReach instanceof HTMLElement)
        pageLink.addEventListener("click", event => {event.preventDefault(); uss.scrollIntoView(elementToReach, true, true, includeHidden);}, {passive:false});
    }
  }
};
