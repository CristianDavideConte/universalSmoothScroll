const DEFAULTSCROLLSTEPX = window.innerWidth * 50 / 1920;//Default number of pixel scrolled in a single scroll-on-X-axis-animation step: 50px steps for a 1920px screen width
const DEFAULTSCROLLSTEPY = window.innerHeight * 50 / 937;//Default number of pixel scrolled in a single scroll-on-Y-axis-animation step: 50px steps for a 937px(1080px - urlbar) screen height
const DEFAULTMINANIMATIONFRAMES = 5;//Default lowest possible number of pixel scrolled in a scroll-animation

/*
 * _xMapContainerAnimationID: Map(Container, Array[idNumber]), a map in which:
 *                            1) The keys are the containers on which a scroll-animation on the x-axis has been requested
 *                            2) The values are lists of ids. This ids are provided by the requestAnimationFrame() calls and
 *                               are used by the stopScrollingX() function any scroll-animation on the x-axis for the passed component
 * _yMapContainerAnimationID: Map(Container, Array[idNumber]), a map in which:
 *                            1) The keys are the container on which a scroll-animation on the y-axis has been requested
 *                            2) The values are lists of ids. This ids are provided by the requestAnimationFrame() calls and
 *                               are used by the stopScrollingY() function any scroll-animation on the y-axis for the passed component
 * _xStepLengthCalculator: Map(Container, stepCalculatorFunction), a map in which:
 *                         1) The keys are the container on which a scroll-animation on the x-axis has been requested
 *                         2) The values are user-defined functions that can modify the step's length at each _stepX call of a scroll-animation on the x-axis
 * _yStepLengthCalculator: Map(Container, stepCalculatorFunction), a map in which:
 *                         1) The keys are the container on which a scroll-animation on the y-axis has been requested
 *                         2) The values are user-defined functions that can modify the step's length at each _stepY call of a scroll-animation on the y-axis
 * _scrollStepX: number, the number of pixel scrolled in a single scroll-on-X-axis-animation step
 * _scrollStepY: number, the number of pixel scrolled in a single scroll-on-Y-axis-animation step
 * _minAnimationFrame: number, minimum number of frames any scroll-animation should last
 *
 * isXscrolling: function, return true if a scroll-animation on the x-axis of the passed container is currently being performed, false otherwise
 * isYscrolling: function, return true if a scroll-animation on the y-axis of the passed container is currently being performed, false otherwise
 * getXStepLengthCalculator: function, return the _xStepLengthCalculator function for the passed container
 * getYStepLengthCalculator: function, return the _yStepLengthCalculator function for the passed container
 * getScrollStepX: function, return the value of _scrollStepX
 * getScrollStepY: function, return the value of _scrollStepY
 * setScrollStepX: function, sets the _scrollStepX to the passed value if compatible
 * setScrollStepY: function, sets the _scrollStepY to the passed value if compatible
 * setMinAnimationFrame: function, sets the _minAnimationFrame to the passed value if compatible
 * calcStepXLenght: function, takes in the total ammount of a scroll-animation and the x-axis and
 *                 calculates the how long each animation step must be in order to target the _minAnimationFrame
 * calcStepYLenght: function, takes in the total ammount of a scroll-animation and the y-axis and
 *                 calculates the how long each animation step must be in order to target the _minAnimationFrame
 * containerScrollingXFunction: function, takes in a container and returns a function that returns:
 *                              1) the scrollLeft property of the container if it's a DOM element
 *                              2) the scrollX property of the container if it's the window element
 * containerScrollingYFunction: function, takes in a container and returns a function that returns:
 *                              1) the scrollTop property of the container if it's a DOM element
 *                              2) the scrollY property of the container if it's the window element
 * containerMaxScrollX: function, takes in a scroll container and returns its highest scroll-reachable x-value
 * containerMaxScrollY: function, takes in a scroll container and returns its highest scroll-reachable y-value
 * scrollXto: function, takes in a number which indicates the position that window.scrollX has to reach and performs a scroll-animation on the x-axis,
 *            after the animation has finished a callback function can be invoked
 * scrollYto: function, takes in a number which indicates the position that window.scrollY has to reach and performs a scroll-animation on the y-axis,
 *            after the animation has finished a callback function can be invoked
 * scrollXby: function, takes in a number which indicates the number of pixel on the x-axis the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis
 * scrollYby: function, takes in a number which indicates the number of pixel on the y-axis the passed container has to be scrolled by and
 *            performs a scroll-animation on that axis
 * scrollTo: function, a shorthand for calling scrollXto() and scrollYto one after another,
 *           performs 2 scroll-animation on the x and y axises based on the passed parameters
 * scrollBy: function, a shorthand for calling scrollXby() and scrollYby one after another,
 *           performs 2 scroll-animation on the x and y axises based on the passed parameters
 * stopScrollingX: function, stops all the current scroll-animation on the x-axis for the passed component
 * stopScrollingY: function, stops all the current scroll-animation on the y-axis for the passed component
 * hrefSetup: function, looks for every <a> DOM element with a href attribute linked to an element on the same page and
 *            attach an eventListener to it, for the "click" event, in order to trigger a smooth-scroll-animation on the y-axis
 */
var universalSmoothScroll = {
  _xMapContainerAnimationID: new Map(),
  _yMapContainerAnimationID: new Map(),
  _xStepLengthCalculator: new Map(),
  _yStepLengthCalculator: new Map(),
  _scrollStepX: DEFAULTSCROLLSTEPX,
  _scrollStepY: DEFAULTSCROLLSTEPY,
  _minAnimationFrame: DEFAULTMINANIMATIONFRAMES,
  isXscrolling: function (container = window) {const _scheduledAnimations = universalSmoothScroll._xMapContainerAnimationID.get(container); return typeof _scheduledAnimations !== "undefined" && _scheduledAnimations.length > 0;},
  isYscrolling: function (container = window) {const _scheduledAnimations = universalSmoothScroll._yMapContainerAnimationID.get(container); return typeof _scheduledAnimations !== "undefined" && _scheduledAnimations.length > 0;},
  getXStepLengthCalculator: function (container = window) {return this._xStepLengthCalculator.get(container)},
  getYStepLengthCalculator: function (container = window) {return this._yStepLengthCalculator.get(container)},
  getScrollStepX: function () {return this._scrollStepX;},
  getScrollStepY: function () {return this._scrollStepY;},
  getMinAnimationFrame: function () {return this._minAnimationFrame;},
  setXStepLengthCalculator: function (newCalculator = undefined, container = window) {if(typeof newCalculator !== "function") return; let remaning = Math.random() * window.innerWidth;  if(typeof newCalculator(remaning) !== "number") return; this._xStepLengthCalculator.set(container, newCalculator)},
  setYStepLengthCalculator: function (newCalculator = undefined, container = window) {if(typeof newCalculator !== "function") return; let remaning = Math.random() * window.innerHeight; if(typeof newCalculator(remaning) !== "number") return; this._yStepLengthCalculator.set(container, newCalculator)},
  setScrollStepX: function (newScrollStepX) {if(typeof newScrollStepX === typeof this._scrollStepX) if(newScrollStepX <= 0) return; this._scrollStepX = newScrollStepX;},
  setScrollStepY: function (newScrollStepY) {if(typeof newScrollStepY === typeof this._scrollStepY) if(newScrollStepY <= 0) return; this._scrollStepY = newScrollStepY;},
  setMinAnimationFrame: function (newMinAnimationFrame) {if(typeof newMinAnimationFrame === typeof this._minAnimationFrame) if(newMinAnimationFrame <= 0) return; this._minAnimationFrame = newMinAnimationFrame;},
  calcStepXLenght: function (deltaX) {return (deltaX >= (this._minAnimationFrame - 1) * this._scrollStepX) ? this._scrollStepX : Math.round(deltaX / this._minAnimationFrame);},
  calcStepYLenght: function (deltaY) {return (deltaY >= (this._minAnimationFrame - 1) * this._scrollStepY) ? this._scrollStepY : Math.round(deltaY / this._minAnimationFrame);},
  containerScrollingXFunction: function (container = window) { return (container instanceof HTMLElement) ? () => {return container.scrollLeft} : () => {return container.scrollX};},
  containerScrollingYFunction: function (container = window) { return (container instanceof HTMLElement) ? () => {return container.scrollTop}  : () => {return container.scrollY};},
  containerMaxScrollX: function (container) {
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
  containerMaxScrollY: function (container) {
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
  scrollXto: function (finalXPosition, container = window, callback = () => {}, canOverlay = false) {
    if (finalXPosition === undefined) return;

    //If the finalXPosition is a non-reachable value it gets sets to closest reachable value
    //If the scroll-limit has already been reached, no scroll-animation is performed
    const _maxScrollX = this.containerMaxScrollX(container);
    if(finalXPosition < 0) finalXPosition = 0;
    else if(finalXPosition > _maxScrollX) finalXPosition = _maxScrollX;

    const scrollingXFunction = this.containerScrollingXFunction(container);
    const scrollingYFunction = this.containerScrollingYFunction(container);
    let _remaningScrollAmmount = finalXPosition - scrollingXFunction();
    const _direction = Math.sign(_remaningScrollAmmount);
    _remaningScrollAmmount *= _direction;
    if(_remaningScrollAmmount <= 0) {if(typeof callback === "function") setTimeout(callback, 0);return;}

    const _scrollStepLenght = this.calcStepXLenght(_remaningScrollAmmount); //Default value for the step lenght

    //If one or more scroll-animation on the x-axis of the passed component has being scheduled
    //and the current requested scroll-animation cannot be overlayed
    //all the already-scheduled ones gets cancelled in order to make the new one play
    if(canOverlay === false) universalSmoothScroll.stopScrollingX(container);

    let _scheduledAnimations = universalSmoothScroll._xMapContainerAnimationID.get(container);  //List of already scheduled animations' IDs
    if(typeof _scheduledAnimations === "undefined") _scheduledAnimations = [];
    _scheduledAnimations.push(window.requestAnimationFrame(_stepX));
    universalSmoothScroll._xMapContainerAnimationID.set(container, _scheduledAnimations);

    function _stepX () {
      _scheduledAnimations = universalSmoothScroll._xMapContainerAnimationID.get(container);
      _scheduledAnimations.shift(); //The first _stepX to be executed is the first one which set an id

      _remaningScrollAmmount = Math.abs(finalXPosition - scrollingXFunction());
      let _calculatedScrollStepLenght;
      if (universalSmoothScroll._xStepLengthCalculator.get(container) === undefined) _calculatedScrollStepLenght = _scrollStepLenght;
      else {
        _calculatedScrollStepLenght = universalSmoothScroll._xStepLengthCalculator.get(container)(_remaningScrollAmmount);
        if(_calculatedScrollStepLenght < 0) _calculatedScrollStepLenght = _scrollStepLenght;
      }

      if(_remaningScrollAmmount <= _calculatedScrollStepLenght) {
        container.scroll(scrollingXFunction() + _remaningScrollAmmount * _direction, scrollingYFunction());
        universalSmoothScroll._xMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      container.scroll(scrollingXFunction() + _calculatedScrollStepLenght * _direction, scrollingYFunction());

      _scheduledAnimations.push(window.requestAnimationFrame(_stepX));
      universalSmoothScroll._xMapContainerAnimationID.set(container, _scheduledAnimations);
    }
  },
  scrollYto: function (finalYPosition, container = window, callback = () => {}, canOverlay = false) {
    if (finalYPosition === undefined) return;

    //If the finalYPosition is a non-reachable value it gets sets to closest reachable value
    //If the scroll-limit has already been reached, no scroll-animation is performed
    const _maxScrollY = this.containerMaxScrollY(container);
    if(finalYPosition < 0) finalYPosition = 0;
    else if(finalYPosition > _maxScrollY) finalYPosition = _maxScrollY;

    const scrollingXFunction = this.containerScrollingXFunction(container);
    const scrollingYFunction = this.containerScrollingYFunction(container);
    let _remaningScrollAmmount = finalYPosition - scrollingYFunction();
    const _direction = Math.sign(_remaningScrollAmmount);
    _remaningScrollAmmount *= _direction;
    if(_remaningScrollAmmount <= 0) {if(typeof callback === "function") setTimeout(callback, 0); return;}

    const _scrollStepLenght = this.calcStepYLenght(_remaningScrollAmmount); //Default value for the step lenght

    //If one or more scroll-animation on the y-axis of the passed component has being scheduled
    //and the current requested scroll-animation cannot be overlayed
    //all the already-scheduled ones gets cancelled in order to make the new one play
    if(canOverlay === false) universalSmoothScroll.stopScrollingY(container);

    let _scheduledAnimations = universalSmoothScroll._yMapContainerAnimationID.get(container);  //List of already scheduled animations' IDs
    if(typeof _scheduledAnimations === "undefined") _scheduledAnimations = [];
    _scheduledAnimations.push(window.requestAnimationFrame(_stepY));
    universalSmoothScroll._yMapContainerAnimationID.set(container, _scheduledAnimations);

    function _stepY () {
      _scheduledAnimations = universalSmoothScroll._yMapContainerAnimationID.get(container);
      _scheduledAnimations.shift(); //The first _stepY to be executed is the first one which set an id

      _remaningScrollAmmount = Math.abs(finalYPosition - scrollingYFunction());
      let _calculatedScrollStepLenght;
      if (universalSmoothScroll._yStepLengthCalculator.get(container) === undefined) _calculatedScrollStepLenght = _scrollStepLenght;
      else {
        _calculatedScrollStepLenght = universalSmoothScroll._yStepLengthCalculator.get(container)(_remaningScrollAmmount);
        if(_calculatedScrollStepLenght < 0) _calculatedScrollStepLenght = _scrollStepLenght;
      }

      if(_remaningScrollAmmount <= _calculatedScrollStepLenght) {
        container.scroll(scrollingXFunction(), scrollingYFunction() + _remaningScrollAmmount * _direction);
        universalSmoothScroll._yMapContainerAnimationID.set(container, _scheduledAnimations);
        if(typeof callback === "function") setTimeout(callback, 0);
        return;
      }

      container.scroll(scrollingXFunction(), scrollingYFunction() + _calculatedScrollStepLenght * _direction);

      _scheduledAnimations.push(window.requestAnimationFrame(_stepY));
      universalSmoothScroll._yMapContainerAnimationID.set(container, _scheduledAnimations);
    }
  },
  scrollXby: function (deltaX, container = window, callback = () => {}, canOverlay = false) {
    if (deltaX === undefined) return;
    const scrollingXFunction = this.containerScrollingXFunction(container);
    this.scrollXto(scrollingXFunction() + deltaX, container, callback, canOverlay);
  },
  scrollYby: function (deltaY, container = window, callback = () => {}, canOverlay = false) {
    if (deltaY === undefined) return;
    const scrollingYFunction = this.containerScrollingYFunction(container);
    this.scrollYto(scrollingYFunction() + deltaY, container, callback, canOverlay);
  },
  scrollTo: function (finalXPosition, finalYPosition, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false,  ifXCancelled = () => {},  ifYCancelled = () => {}) {
    setTimeout(() => this.scrollXto(finalXPosition, xContainer, xCallback, xCanOverlay, ifXCancelled), 0);//Async so that the browser can paint
    setTimeout(() => this.scrollYto(finalYPosition, yContainer, yCallback, yCanOverlay, ifYCancelled), 0);//Async so that the browser can paint
  },
  scrollBy: function (deltaX, deltaY, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false, ifXCancelled = () => {},  ifYCancelled = () => {}) {
    setTimeout(() => this.scrollXby(deltaX, xContainer, xCallback, xCanOverlay, ifXCancelled), 0);//Async so that the browser can paint
    setTimeout(() => this.scrollYby(deltaY, yContainer, yCallback, yCanOverlay, ifYCancelled), 0);//Async so that the browser can paint
  },
  stopScrollingX: function (container = window, callback = () => {}) {
    let _scheduledAnimations = universalSmoothScroll._xMapContainerAnimationID.get(container);
    if(typeof _scheduledAnimations === "undefined" || _scheduledAnimations.length === 0) return;
    _scheduledAnimations.forEach(animationID => window.cancelAnimationFrame(animationID));
    universalSmoothScroll._xMapContainerAnimationID.set(container, []);
    if(typeof callback === "function") setTimeout(callback, 0);
  },
  stopScrollingY: function (container = window, callback = () => {}) {
    let _scheduledAnimations = universalSmoothScroll._yMapContainerAnimationID.get(container);
    if(typeof _scheduledAnimations === "undefined" || _scheduledAnimations.length === 0) return;
    _scheduledAnimations.forEach(animationID => window.cancelAnimationFrame(animationID));
    universalSmoothScroll._yMapContainerAnimationID.set(container, []);
    if(typeof callback === "function") setTimeout(callback, 0);
  },
  hrefSetup: function () {
    const pageLinks = document.getElementsByTagName("a");
    for(pageLink of pageLinks) {
      const elementToReach = document.getElementById(pageLink.href.split("#")[1]);
      if(elementToReach instanceof HTMLElement)
        pageLink.addEventListener("click", event => {event.preventDefault(); universalSmoothScroll.scrollYto(elementToReach.offsetTop, window, null, false);},{passive:false});
    }
  }
};
