const DEFAULTSCROLLSTEPX = 50;//Default number of pixel scrolled in a single scroll-on-X-axis-animation step
const DEFAULTSCROLLSTEPY = 50;//Default number of pixel scrolled in a single scroll-on-Y-axis-animation step
const DEFAULTMINANIMATIONFRAMES = 5;//Default lowest possible number of pixel scrolled in a scroll-animation

/*
 * _xScrolling: boolean, true if any scroll-animation on the X axis is currently beign performed, false otherwise
 * _yScrolling: boolean, true if any scroll-animation on the Y axis is currently beign performed, false otherwise
 * _lastScrollXID: number, the id returned by the last window.requestAnimationFrame() triggered by a scroll-animation on the x-axis
 * _lastScrollYID: number, the id returned by the last window.requestAnimationFrame() triggered by a scroll-animation on the y-axis
 * _scrollingXstopped: boolean, true while a scroll-animation on the x-axis has been requested to stop but hasn't yet, false otherwise
 * _scrollingYstopped: boolean, true while a scroll-animation on the y-axis has been requested to stop but hasn't yet, false otherwise
 * _scrollStepX: number, the number of pixel scrolled in a single scroll-on-X-axis-animation step
 * _scrollStepY: number, the number of pixel scrolled in a single scroll-on-Y-axis-animation step
 * _minAnimationFrame: number, minimum number of frames any scroll-animation should last
 *
 * isXscrolling: function, return the value of _xScrolling
 * isYscrolling: function, return the value of _yScrolling
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
 * stopScrollingX: function, stops all the current scroll-animation on the x-axis
 * stopScrollingY: function, stops all the current scroll-animation on the y-axis
 * hrefSetup: function, looks for every <a> DOM element with a href attribute linked to an element on the same page and
 *            attach an eventListener to it, for the "click" event, in order to trigger a smooth-scroll-animation on the y-axis
 */
var universalSmoothScroll = {
  _xScrolling: false,
  _yScrolling: false,
  _lastScrollXID: null,
  _lastScrollYID: null,
  _scrollingXstopped: false,
  _scrollingYstopped: false,
  _scrollStepX: DEFAULTSCROLLSTEPX,
  _scrollStepY: DEFAULTSCROLLSTEPY,
  _minAnimationFrame: DEFAULTMINANIMATIONFRAMES,
  isXscrolling: function () {return this._xScrolling;},
  isYscrolling: function () {return this._yScrolling;},
  getScrollStepX: function () {return this._scrollStepX;},
  getScrollStepY: function () {return this._scrollStepY;},
  getMinAnimationFrame: function () {return this._minAnimationFrame;},
  setScrollStepX: function (newScrollStepX) {if(typeof(newScrollStepX) === typeof(this._scrollStepX)) if(newScrollStepX > 0) {this._scrollStepX = newScrollStepX;}},
  setScrollStepY: function (newScrollStepY) {if(typeof(newScrollStepY) === typeof(this._scrollStepY)) if(newScrollStepY > 0) {this._scrollStepY = newScrollStepY;}},
  setMinAnimationFrame: function (newMinAnimationFrame) {if(typeof(newMinAnimationFrame) === typeof(this._minAnimationFrame)) if(newMinAnimationFrame > 0) {this._minAnimationFrame = newMinAnimationFrame;}},
  calcStepXLenght: function (deltaX) {return (deltaX >= (this._minAnimationFrame - 1) * this._scrollStepX) ? this._scrollStepX : Math.round(deltaX / this._minAnimationFrame);},
  calcStepYLenght: function (deltaY) {return (deltaY >= (this._minAnimationFrame - 1) * this._scrollStepY) ? this._scrollStepY : Math.round(deltaY / this._minAnimationFrame);},
  containerScrollingXFunction: function (container) { return (container instanceof HTMLElement) ? () => {return container.scrollLeft} : () => {return container.scrollX};},
  containerScrollingYFunction: function (container) { return (container instanceof HTMLElement) ? () => {return container.scrollTop}  : () => {return container.scrollY};},
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
    let _maxScrollX = this.containerMaxScrollX(container);
    if(finalXPosition < 0) finalXPosition = 0;
    else if(finalXPosition > _maxScrollX) finalXPosition = _maxScrollX;


    const scrollingXFunction = this.containerScrollingXFunction(container);
    const scrollingYFunction = this.containerScrollingYFunction(container);
    let _totalScrollAmmount = finalXPosition - scrollingXFunction();
    const _direction = Math.sign(_totalScrollAmmount);
    _totalScrollAmmount *= _direction;
    if(_totalScrollAmmount <= 0) return;

    const _scrollStepLenght = this.calcStepXLenght(_totalScrollAmmount) * _direction;
    let _scrolledAmmount = 0;

    //If a scroll-animation on the x-axis was being performed and the current one cannot be overlayed
    //the the former one gets cancelled in order to make the new one play
    if(universalSmoothScroll._xScrolling && canOverlay === false) {
      universalSmoothScroll.stopScrollingX(() => this._lastScrollXID = window.requestAnimationFrame(_stepX));
      return;
    } else {
      universalSmoothScroll._xScrolling = true;
      this._lastScrollXID = window.requestAnimationFrame(_stepX);
    }

    function _stepX () {
      if(universalSmoothScroll._scrollingXstopped === true) {
        window.requestAnimationFrame(() => {
          universalSmoothScroll._scrollingXstopped = false;
          universalSmoothScroll._xScrolling = false;
        });
        return;
      }
      container.scroll(scrollingXFunction() + _scrollStepLenght, scrollingYFunction());
      _scrolledAmmount += _scrollStepLenght * _direction;
      let _remaningScrollAmmount = _totalScrollAmmount - _scrolledAmmount;

      if(_remaningScrollAmmount > 0)
        this._lastScrollXID = (_remaningScrollAmmount > _scrollStepLenght * _direction) ?
                             window.requestAnimationFrame(_stepX) :
                             window.requestAnimationFrame(() => {
                               container.scroll(scrollingXFunction() + _remaningScrollAmmount * _direction, scrollingYFunction());
                               universalSmoothScroll._xScrolling = false;
                               if(typeof callback === "function") window.requestAnimationFrame(callback);
                             });
    }
  },
  scrollYto: function (finalYPosition, container = window, callback = () => {}, canOverlay = false) {
    if (finalYPosition === undefined) return;

    //If the finalYPosition is a non-reachable value it gets sets to closest reachable value
    //If the scroll-limit has already been reached, no scroll-animation is performed
    let _maxScrollY = this.containerMaxScrollY(container);
    if(finalYPosition < 0) finalYPosition = 0;
    else if(finalYPosition > _maxScrollY) finalYPosition = _maxScrollY;

    const scrollingXFunction = this.containerScrollingXFunction(container);
    const scrollingYFunction = this.containerScrollingYFunction(container);
    let _totalScrollAmmount = finalYPosition - scrollingYFunction();
    const _direction = Math.sign(_totalScrollAmmount);
    _totalScrollAmmount *= _direction;
    if(_totalScrollAmmount <= 0) return;

    const _scrollStepLenght = this.calcStepYLenght(_totalScrollAmmount) * _direction;
    let _scrolledAmmount = 0;

    //If a scroll-animation on the y-axis was being performed and the current one cannot be overlayed
    //the the former one gets cancelled in order to make the new one play
    if(universalSmoothScroll._yScrolling && canOverlay === false) {
      universalSmoothScroll.stopScrollingY(() => this._lastScrollYID = window.requestAnimationFrame(_stepY));
      return;
    } else {
      universalSmoothScroll._yScrolling = true;
      this._lastScrollYID = window.requestAnimationFrame(_stepY);
    }

    function _stepY () {
      if(universalSmoothScroll._scrollingYstopped === true) {
        window.requestAnimationFrame(() => {
          universalSmoothScroll._scrollingYstopped = false;
          universalSmoothScroll._yScrolling = false;
        });
        return;
      }
      container.scroll(scrollingXFunction(), scrollingYFunction() + _scrollStepLenght);
      _scrolledAmmount += _scrollStepLenght * _direction;
      let _remaningScrollAmmount = _totalScrollAmmount - _scrolledAmmount;

      if(_remaningScrollAmmount > 0)
        this._lastScrollYID = (_remaningScrollAmmount > _scrollStepLenght * _direction) ?
                             window.requestAnimationFrame(_stepY) :
                             window.requestAnimationFrame(() => {
                               container.scroll(scrollingXFunction(), scrollingYFunction() + _remaningScrollAmmount * _direction);
                               universalSmoothScroll._yScrolling = false;
                               if(typeof callback === "function") window.requestAnimationFrame(callback);
                             });
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
  scrollTo: function (finalXPosition, finalYPosition, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false) {
    setTimeout(() => this.scrollXto(finalXPosition, xContainer, xCallback, xCanOverlay), 0);//Async so that the browser can paint
    setTimeout(() => this.scrollYto(finalYPosition, yContainer, yCallback, yCanOverlay), 0);//Async so that the browser can paint
  },
  scrollBy: function (deltaX, deltaY, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false) {
    setTimeout(() => this.scrollXby(deltaX, xContainer, xCallback, xCanOverlay), 0);//Async so that the browser can paint
    setTimeout(() => this.scrollYby(deltaY, yContainer, yCallback, yCanOverlay), 0);//Async so that the browser can paint
  },
  stopScrollingX: function (callback = () => {}) {
    if(!universalSmoothScroll._xScrolling) return;
    window.cancelAnimationFrame(this._lastScrollXID);
    universalSmoothScroll._scrollingXstopped = true;
    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  stopScrollingY: function (callback = () => {}) {
    if(!universalSmoothScroll._yScrolling) return;
    window.cancelAnimationFrame(this._lastScrollYID);
    universalSmoothScroll._scrollingYstopped = true;
    if(typeof callback === "function") window.requestAnimationFrame(callback);
  },
  hrefSetup: function () {
    const pageLinks = document.getElementsByTagName("a");
    for(pageLink of pageLinks) {
      const elementToReach = document.getElementById(pageLink.href.split("#")[1]);
      if(elementToReach instanceof HTMLElement)
        pageLink.addEventListener("click", event => {event.preventDefault(); universalSmoothScroll.scrollYto(elementToReach.offsetTop)},{passive:false});
    }
  }
};
