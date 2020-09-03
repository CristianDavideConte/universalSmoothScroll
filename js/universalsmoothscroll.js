const DEFAULTXSTEPLENGTH = window.innerWidth  * 50 / 1920; //Default number of pixel scrolled in a single scroll-animation's (on the x-axis) step: 50px steps for a 1920px screen width.
const DEFAULTYSTEPLENGTH = window.innerHeight * 50 / 937; //Default number of pixel scrolled in a single scroll-animation's (on the y-axis) step: 50px steps for a 937px(1080px - urlbar) screen height.
const DEFAULTMINANIMATIONFRAMES = 5; //Default lowest possible number of frames any scroll-animation should last.

/*
 * _xMapContainerAnimationID: Map(Container, Array[idNumber]), a map in which:
 *                            1) The keys are the containers on which a scroll-animation on the x-axis has been requested.
 *                            2) The values are Array of ids. This ids are provided by the requestAnimationFrame() calls and
 *                               are used by the stopScrollingX() function any scroll-animation on the x-axis for the passed component.
 * _yMapContainerAnimationID: Map(Container, Array[idNumber]), a map in which:
 *                            1) The keys are the containers on which a scroll-animation on the y-axis has been requested.
 *                            2) The values are Array of ids. This ids are provided by the requestAnimationFrame() calls and
 *                               are used by the stopScrollingY() function any scroll-animation on the y-axis for the passed component.
 * _xStepLengthCalculator: Map(Container, stepCalculatorFunction), a map in which:
 *                         1) The keys are the container on which a scroll-animation on the x-axis has been requested.
 *                         2) The values are user-defined functions that can modify the step's length at each _stepX call of a scroll-animation on the x-axis.
 * _yStepLengthCalculator: Map(Container, stepCalculatorFunction), a map in which:
 *                         1) The keys are the container on which a scroll-animation on the y-axis has been requested.
 *                         2) The values are user-defined functions that can modify the step's length at each _stepY call of a scroll-animation on the y-axis.
 * _xStepLength: number, the number of pixel scrolled in a single scroll-animation's (on the x-axis) step.
 * _yStepLength: number, the number of pixel scrolled in a single scroll-animation's (on the y-axis) step.
 * _minAnimationFrame: number, the minimum number of frames any scroll-animation (on any axis) should last.
 *
 * isXscrolling: function, return true if a scroll-animation on the x-axis of the passed container is currently being performed, false otherwise.
 * isYscrolling: function, return true if a scroll-animation on the y-axis of the passed container is currently being performed, false otherwise.
 * getXStepLengthCalculator: function, return the _xStepLengthCalculator function for the passed container.
 * getYStepLengthCalculator: function, return the _yStepLengthCalculator function for the passed container.
 * getXStepLength: function, return the value of _xStepLength.
 * getYStepLength: function, return the value of _yStepLength.
 * getMinAnimationFrame: function, return the value of _minAnimationFrame.
 * setXStepLengthCalculator: function, sets the _xStepLengthCalculator for the requested container to the passed function if compatible.
 * setYStepLengthCalculator: function, sets the _yStepLengthCalculator for the requested container to the passed function if compatible.
 * setXStepLength: function, sets the _xStepLength to the passed value if compatible.
 * setYStepLength: function, sets the _yStepLength to the passed value if compatible.
 * setMinAnimationFrame: function, sets the _minAnimationFrame to the passed value if compatible.
 * calcXStepLength: function, takes in the total ammount of a scroll-animation on the x-axis and
 *                 calculates the how long each animation-step must be in order to target the _minAnimationFrame.
 * calcYStepLength: function, takes in the total ammount of a scroll-animation on the y-axis and
 *                 calculates the how long each animation-step must be in order to target the _minAnimationFrame.
 * getScrollXCalculator: function, takes in a container and returns a function that returns:
 *                       1) The scrollLeft property of the container if it's a DOM element.
 *                       2) The scrollX property of the container if it's the window element.
 * getScrollYCalculator: function, takes in a container and returns a function that returns:
 *                       1) The scrollTop property of the container if it's a DOM element.
 *                       2) The scrollY property of the container if it's the window element.
 * getMaxScrollX: function, takes in a scroll container and returns its highest scroll-reachable x-value.
 * getMaxScrollY: function, takes in a scroll container and returns its highest scroll-reachable y-value.
 * getScrollableParent: function, returns the first scrollable container of the passed element, works with "overflow('',X,Y): hidden" if specified.
 * scrollXTo: function, takes in a number which indicates the position that window.scrollX has to reach and performs a scroll-animation on the x-axis,
 *            after the animation has finished a callback function can be invoked.
 * scrollYTo: function, takes in a number which indicates the position that window.scrollY has to reach and performs a scroll-animation on the y-axis,
 *            after the animation has finished a callback function can be invoked.
 * scrollXBy: function, takes in a number which indicates the number of pixel on the x-axis the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis.
 * scrollYBy: function, takes in a number which indicates the number of pixel on the y-axis the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis.
 * scrollTo: function, a shorthand for calling scrollXTo() and scrollYTo one after another,
 *           performs 2 scroll-animation on the x and y axises based on the passed parameters.
 * scrollBy: function, a shorthand for calling scrollXBy() and scrollYBy one after another,
 *           performs 2 scroll-animation on the x and y axises based on the passed parameters.
 * scrollIntoView: function, scrolls the window and if necessary the container of the passed element in order to
 *                 make it visible on the screen. There are 3 possible allignments: top, bottom, center.
 *                 The allignments can be changed by passing different values of alignToTop and alignToLeft.
 *                 Works with "overflow('',X,Y): hidden" if specified.
 * stopScrollingX: function, stops all the current scroll-animation on the x-axis for the passed container.
 * stopScrollingY: function, stops all the current scroll-animation on the y-axis for the passed container.
 * hrefSetup: function, looks for every <a> DOM element with a href attribute linked to an element on the same page (anchor) and
 *            attaches an eventListener(onclick) to it in order to trigger a smooth-scroll-animation to reach the linked element.
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
  setXStepLengthCalculator: function (newCalculator = undefined, container = window) {if(typeof newCalculator !== "function") return; let remaning = Math.random() * window.innerWidth;  if(typeof newCalculator(remaning, remaning) !== "number") return; uss._xStepLengthCalculator.set(container, newCalculator)},
  setYStepLengthCalculator: function (newCalculator = undefined, container = window) {if(typeof newCalculator !== "function") return; let remaning = Math.random() * window.innerHeight; if(typeof newCalculator(remaning, remaning) !== "number") return; uss._yStepLengthCalculator.set(container, newCalculator)},
  setXStepLength: function (newXStepLength) {if(typeof newXStepLength !== "number") return; if(newXStepLength <= 0) return; uss._xStepLength = newXStepLength;},
  setYStepLength: function (newYStepLength) {if(typeof newYStepLength !== "number") return; if(newYStepLength <= 0) return; uss._yStepLength = newYStepLength;},
  setMinAnimationFrame: function (newMinAnimationFrame) {if(typeof newMinAnimationFrame !== "number") return; if(newMinAnimationFrame <= 0) return; uss._minAnimationFrame = newMinAnimationFrame;},
  calcXStepLength: function (deltaX) {return (deltaX >= (uss._minAnimationFrame - 1) * uss._xStepLength) ? uss._xStepLength : Math.round(deltaX / uss._minAnimationFrame);},
  calcYStepLength: function (deltaY) {return (deltaY >= (uss._minAnimationFrame - 1) * uss._yStepLength) ? uss._yStepLength : Math.round(deltaY / uss._minAnimationFrame);},
  getScrollXCalculator: function (container = window) { return (container instanceof HTMLElement) ? () => {return container.scrollLeft} : () => {return container.scrollX};},
  getScrollYCalculator: function (container = window) { return (container instanceof HTMLElement) ? () => {return container.scrollTop}  : () => {return container.scrollY};},
  getMaxScrollX: function (container = window) {
    let body = document.body;
    let html = document.documentElement;
    return (container instanceof HTMLElement) ?
      container.scrollWidth - container.offsetWidth :
      Math.max(
        body.scrollWidth,
        body.offsetWidth,
        body.clientWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      ) - window.innerWidth; // Subtract viewport width because the x-scroll is done starting by the left
  },
  getMaxScrollY: function (container = window) {
    let body = document.body;
    let html = document.documentElement;
    return (container instanceof HTMLElement) ?
      container.scrollHeight - container.offsetHeight :
      Math.max(
        body.scrollHeight,
        body.offsetHeight,
        body.clientHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      ) - window.innerHeight; // Subtract viewport height because the y-scroll is done starting by the top
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
    } catch(exception) {console.log("USS error: Couldn't get the container of the passed element");}
  },
  scrollXTo: function (finalXPosition, container = window, callback = () => {}, canOverlay = false) {
    if (typeof finalXPosition !== "number") return;

    //If the container cannot be scrolled on the x-axis _maxScrollX will be <= 0 and the function returns.
    //If the finalXPosition is a non-reachable value it gets sets to closest reachable value.
    //If the scroll-limit has already been reached, no scroll-animation is performed.
    const _maxScrollX = uss.getMaxScrollX(container);
    if(_maxScrollX <= 0) return;
    if(finalXPosition < 0) finalXPosition = 0;
    else if(finalXPosition > _maxScrollX) finalXPosition = _maxScrollX;

    const scrollXCalculator = uss.getScrollXCalculator(container);
    const scrollYCalculator = uss.getScrollYCalculator(container);
    let _remaningScrollAmmount = finalXPosition - scrollXCalculator();
    const _direction = Math.sign(_remaningScrollAmmount);
    _remaningScrollAmmount *= _direction;
    if(_remaningScrollAmmount <= 0) {if(typeof callback === "function") setTimeout(callback, 0);return;}

    const _scrollStepLength = uss.calcXStepLength(_remaningScrollAmmount); //Default value for the step length

    //If one or more scroll-animation on the x-axis of the passed component has being scheduled
    //and the current requested scroll-animation cannot be overlayed,
    //all the already-scheduled ones gets cancelled in order to make the new one play.
    if(canOverlay === false) uss.stopScrollingX(container);

    let _scheduledAnimations = uss._xMapContainerAnimationID.get(container);  //List of already scheduled animations' IDs
    if(typeof _scheduledAnimations === "undefined") _scheduledAnimations = [];
    _scheduledAnimations.push(window.requestAnimationFrame(_stepX));
    uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
    const stepCalculator = uss._xStepLengthCalculator.get(container);

    function _stepX (timestamp) {
      _scheduledAnimations = uss._xMapContainerAnimationID.get(container);
      _scheduledAnimations.shift(); //The first _stepX to be executed is the first one which set an id

      _remaningScrollAmmount = Math.abs(finalXPosition - scrollXCalculator());
      let _calculatedScrollStepLength;
      if (typeof stepCalculator !== "function") _calculatedScrollStepLength = _scrollStepLength;
      else {
        _calculatedScrollStepLength = stepCalculator(_remaningScrollAmmount, timestamp);
        if(_calculatedScrollStepLength < 0) _calculatedScrollStepLength = _scrollStepLength;
      }

      if(_remaningScrollAmmount <= _calculatedScrollStepLength) {
        container.scroll(scrollXCalculator() + _remaningScrollAmmount * _direction, scrollYCalculator());
        uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      container.scroll(scrollXCalculator() + _calculatedScrollStepLength * _direction, scrollYCalculator());

      _scheduledAnimations.push(window.requestAnimationFrame(_stepX));
      uss._xMapContainerAnimationID.set(container, _scheduledAnimations);
    }
  },
  scrollYTo: function (finalYPosition, container = window, callback = () => {}, canOverlay = false) {
    if (typeof finalYPosition !== "number") return;

    //If the container cannot be scrolled on the y-axis _maxScrollY will be <= 0 and the function returns.
    //If the finalYPosition is a non-reachable value it gets sets to closest reachable value.
    //If the scroll-limit has already been reached, no scroll-animation is performed.
    const _maxScrollY = uss.getMaxScrollY(container);
    if(_maxScrollY <= 0) return;
    if(finalYPosition < 0) finalYPosition = 0;
    else if(finalYPosition > _maxScrollY) finalYPosition = _maxScrollY;

    const scrollXCalculator = uss.getScrollXCalculator(container);
    const scrollYCalculator = uss.getScrollYCalculator(container);
    let _remaningScrollAmmount = finalYPosition - scrollYCalculator();
    const _direction = Math.sign(_remaningScrollAmmount);
    _remaningScrollAmmount *= _direction;
    if(_remaningScrollAmmount <= 0) {if(typeof callback === "function") setTimeout(callback, 0); return;}

    const _scrollStepLength = uss.calcYStepLength(_remaningScrollAmmount); //Default value for the step length

    //If one or more scroll-animation on the y-axis of the passed component has being scheduled
    //and the current requested scroll-animation cannot be overlayed,
    //all the already-scheduled ones gets cancelled in order to make the new one play.
    if(canOverlay === false) uss.stopScrollingY(container);

    let _scheduledAnimations = uss._yMapContainerAnimationID.get(container);  //List of already scheduled animations' IDs
    if(typeof _scheduledAnimations === "undefined") _scheduledAnimations = [];
    _scheduledAnimations.push(window.requestAnimationFrame(_stepY));
    uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
    const stepCalculator = uss._yStepLengthCalculator.get(container);

    function _stepY (timestamp) {
      _scheduledAnimations = uss._yMapContainerAnimationID.get(container);
      _scheduledAnimations.shift(); //The first _stepY to be executed is the first one which set an id

      _remaningScrollAmmount = Math.abs(finalYPosition - scrollYCalculator());
      let _calculatedScrollStepLength;
      if (typeof stepCalculator !== "function") _calculatedScrollStepLength = _scrollStepLength;
      else {
        _calculatedScrollStepLength = stepCalculator(_remaningScrollAmmount, timestamp);
        if(_calculatedScrollStepLength < 0) _calculatedScrollStepLength = _scrollStepLength;
      }

      if(_remaningScrollAmmount <= _calculatedScrollStepLength) {
        container.scroll(scrollXCalculator(), scrollYCalculator() + _remaningScrollAmmount * _direction);
        uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      container.scroll(scrollXCalculator(), scrollYCalculator() + _calculatedScrollStepLength * _direction);

      _scheduledAnimations.push(window.requestAnimationFrame(_stepY));
      uss._yMapContainerAnimationID.set(container, _scheduledAnimations);
    }
  },
  scrollXBy: function (deltaX, container = window, callback = () => {}, canOverlay = false) {
    if (typeof deltaX !== "number" || deltaX === 0) return;
    uss.scrollXTo(uss.getScrollXCalculator(container)() + deltaX, container, callback, canOverlay);
  },
  scrollYBy: function (deltaY, container = window, callback = () => {}, canOverlay = false) {
    if (typeof deltaY !== "number" || deltaY === 0) return;
    uss.scrollYTo(uss.getScrollYCalculator(container)() + deltaY, container, callback, canOverlay);
  },
  scrollTo: function (finalXPosition, finalYPosition, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false) {
    setTimeout(() => uss.scrollXTo(finalXPosition, xContainer, xCallback, xCanOverlay), 0);//Async so that the browser can paint
    setTimeout(() => uss.scrollYTo(finalYPosition, yContainer, yCallback, yCanOverlay), 0);//Async so that the browser can paint
  },
  scrollBy: function (deltaX, deltaY, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false) {
    setTimeout(() => uss.scrollXBy(deltaX, xContainer, xCallback, xCanOverlay), 0);//Async so that the browser can paint
    setTimeout(() => uss.scrollYBy(deltaY, yContainer, yCallback, yCanOverlay), 0);//Async so that the browser can paint
  },
  scrollIntoView: function (element = window, alignToLeft = true, alignToTop = true, includeHidden = false) {
    if(element === window) return;
    const container = uss.getScrollableParent(element, includeHidden);
    let elementOffsetLeft;
    let elementOffsetTop;
    if(container !== window) {
      const containerOffsetLeft = (alignToLeft === true) ? container.offsetLeft : (alignToLeft === false) ? container.offsetLeft - window.innerWidth  + container.offsetWidth  : container.offsetLeft - window.innerWidth  / 2 + container.offsetWidth  / 2;
      const containerOffsetTop  = (alignToTop  === true) ? container.offsetTop  : (alignToTop  === false) ? container.offsetTop  - window.innerHeight + container.offsetHeight : container.offsetTop  - window.innerHeight / 2 + container.offsetHeight / 2;
      elementOffsetLeft   = (alignToLeft === true) ? element.offsetLeft - containerOffsetLeft : (alignToLeft === false) ? element.offsetLeft - container.offsetLeft - container.offsetWidth  + element.offsetWidth  : element.offsetLeft - container.offsetLeft - container.offsetWidth  / 2 + element.offsetWidth  / 2;
      elementOffsetTop    = (alignToTop  === true) ? element.offsetTop  - containerOffsetTop  : (alignToTop  === false) ? element.offsetTop  - container.offsetTop  - container.offsetHeight + element.offsetHeight : element.offsetTop  - container.offsetTop  - container.offsetHeight / 2 + element.offsetHeight / 2;
      setTimeout(() => uss.scrollXTo(containerOffsetLeft, window, null, false), 0); //Async so that the browser can paint
      setTimeout(() => uss.scrollYTo(containerOffsetTop,  window, null, false), 0); //Async so that the browser can paint
    } else {
      elementOffsetLeft = (alignToLeft === true) ? element.offsetLeft : (alignToLeft === false) ? element.offsetLeft - container.innerWidth  + element.offsetWidth  : element.offsetLeft - container.innerWidth  / 2 + element.offsetWidth  / 2;
      elementOffsetTop  = (alignToTop  === true) ? element.offsetTop  : (alignToTop  === false) ? element.offsetTop  - container.innerHeight + element.offsetHeight : element.offsetTop  - container.innerHeight / 2 + element.offsetHeight / 2;
    }
    setTimeout(() => uss.scrollXTo(elementOffsetLeft, container, null, false), 0); //Async so that the browser can paint
    setTimeout(() => uss.scrollYTo(elementOffsetTop,  container, null, false), 0); //Async so that the browser can paint
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
  hrefSetup: function (includeHidden = false) {
    const pageLinks = document.getElementsByTagName("a");
    for(pageLink of pageLinks) {
      const elementToReach = document.getElementById(pageLink.href.split("#")[1]);
      if(elementToReach instanceof HTMLElement)
        pageLink.addEventListener("click", event => {event.preventDefault(); uss.scrollIntoView(elementToReach, true, true, includeHidden);},{passive:false});
    }
  }
};
