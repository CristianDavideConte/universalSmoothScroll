"use strict";

/**
 * Internally used to define the standard behavior of a stepLengthCalculator.
 * The progressEvaluator parameter defines at which % of the total duration the scroll-animation is at.
 * The duration is the total amount in ms the scroll-animation should last.
 * The callback is a function that is executed every time the stepLengthCalculator is invoked.  
 */
 const DEFAULT_STEP_LENGTH_CALCULATOR = (progressEvaluator, duration, callback) => {
  /**
   * The returned stepLengthCalculator can be used by different containers having
   * different starting positions, _startingPosMap is used to keep track of all of them.
   * A starting position can be >0 if a scroll-animation has been extended but 
   * part of it has already been done.
   */
  const _startingPosMap = new Map(); 
  const _callback = typeof callback === "function" ? callback : () => {};

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    let __progress = (timestamp - originalTimestamp) / duration; //elapsed / duration

    if(__progress >= 1) return remaning;
    if(__progress <= 0) {
      /**
       * Since the timestamp === originalTimestamp at the beginning of a scroll-animation,
       * the first step length is always 0.
       * This breaks the scroll-animations on touchpad enabled devices, so the first 
       * elapsed time considered is actually 0.5 * uss._framesTime.
       */
       _startingPosMap.set(container, 1 - remaning / total);
      __progress = 0.5 * uss.getFramesTime(true) / duration; 
    }
    
    const __startingPos = _startingPosMap.get(container);
    const __nextPos = (progressEvaluator(__progress) * (1 - __startingPos) + __startingPos) * (total - 1);
    const __delta = remaning - total + __nextPos;

    return __delta > 0 ? Math.ceil(__delta) : Math.floor(__delta);
  }
}  

/*
 * Internally used to setup the control points' arrays for bounce-type StepLengthCalculators.
 */
const DEFAULT_BOUNCE_CUSTOMIZER = (xs, ys, arrInserter, startBouncesNumber, endBouncesNumber) => {
  const _bounceDeltaX = 1 / endBouncesNumber;
  const _bounceDeltaXHalf = _bounceDeltaX * 0.5; 
  const _bounceCorrectionDelta = _bounceDeltaX * 0.0005;

  /**
   * These functions define:
   * - The pattern of the control points' x coordinates (same for bounces and peaks)
   * - The pattern of the control points' y coordinates (2 different ones for bounces and peaks)
   */
  const _bounceXCalc = x => 1 - Math.pow(1 - x, 1.6);
  const _bounceYCalc = x => x * 0.005 + 0.995;
  const _peakYCalc   = x => x > 0.6 ? x * 0.35 + 0.64 : 1 - (1 - x) * (1 - x);
  
  const _initPointsNum = 10;
  const _arrLen = _initPointsNum + (endBouncesNumber - 1) * 5 + 1 
  let _arrIndex = 0;
  let _i;

  if(startBouncesNumber !== 1) _arrIndex = _initPointsNum + (startBouncesNumber - 1) * 5;
  else {
    //Force an ease-in pattern for the first initPointsNum control points.
    const _initBounceDeltaX = (_bounceDeltaX - _bounceCorrectionDelta) / _initPointsNum;
    const _closeToBounceDeltaX = _bounceDeltaX - 2 * _bounceCorrectionDelta;
    for (_i = 0; _i < _closeToBounceDeltaX; _i += _initBounceDeltaX) {
      arrInserter(xs, _bounceXCalc(_i), _arrIndex, _arrLen);
      arrInserter(ys,  Math.pow(_i * endBouncesNumber, 2), _arrIndex, _arrLen);
      _arrIndex++;
    }
  }

  //Defines the control points of the spline between the first and the last bounce.
  for(_i = startBouncesNumber; _i < endBouncesNumber; _i++) {
    const _originalBounceX = _bounceDeltaX * _i;
    const _calcBounceX = _bounceXCalc(_originalBounceX);
    const _calcBounceY = _bounceYCalc(_calcBounceX);
    const _nextPeakX   = _bounceXCalc(_originalBounceX + _bounceDeltaXHalf);
    const _nextPeakY   = _peakYCalc(_nextPeakX);
    const _nextSlopeY  = _nextPeakY * 0.65 + 0.35 * _calcBounceY;

    arrInserter(xs, _calcBounceX,                                            _arrIndex,     _arrLen);
    arrInserter(xs, _bounceXCalc(_originalBounceX + _bounceCorrectionDelta), _arrIndex + 1, _arrLen);

    arrInserter(xs, _bounceXCalc(_originalBounceX + _bounceDeltaXHalf * 0.35), _arrIndex + 2, _arrLen);
    arrInserter(xs, _nextPeakX,                                                _arrIndex + 3, _arrLen);
    arrInserter(xs, _bounceXCalc(_originalBounceX + _bounceDeltaXHalf * 1.65), _arrIndex + 4, _arrLen);
    
    arrInserter(ys, _calcBounceY, _arrIndex,     _arrLen); 
    arrInserter(ys, _calcBounceY, _arrIndex + 1, _arrLen); 

    arrInserter(ys, _nextSlopeY, _arrIndex + 2, _arrLen);
    arrInserter(ys, _nextPeakY,  _arrIndex + 3, _arrLen);
    arrInserter(ys, _nextSlopeY, _arrIndex + 4, _arrLen);
    
    _arrIndex += 5;
  }

  //Defines the control points of the spline at (1,1).
  arrInserter(xs, 1, _arrIndex, _arrLen);      
  arrInserter(ys, 1, _arrIndex, _arrLen);    
}

export const CUSTOM_CUBIC_HERMITE_SPLINE = (xs, ys, tension = 0, duration = 500, callback, options = {debugString: "CUSTOM_CUBIC_HERMITE_SPLINE"}) => {
  if(!Array.isArray(xs)) {uss._errorLogger(options.debugString, "xs to be an array", xs); return;}
  if(!Array.isArray(ys)) {uss._errorLogger(options.debugString, "ys to be an array", ys); return;}
  if(xs.length !== ys.length) {uss._errorLogger(options.debugString, "xs and ys to have the same length", "xs.length = " + xs.length + " and ys.length = " + ys.length); return;}
  if(!Number.isFinite(duration) || duration <= 0) {uss._errorLogger(options.debugString, "the duration to be a positive number", duration); return;}
  
  let _isXDefinedIn0 = false;
  let _isXDefinedIn1 = false;
  let _xsCurrMax = null;
  const _xsLen = xs.length;

  for(let i = 0; i < _xsLen; i++) {
    if(!Number.isFinite(xs[i]) || xs[i] < 0 || xs[i] > 1) {uss._errorLogger(options.debugString, "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]); return;}
    if(!Number.isFinite(ys[i]) || ys[i] < 0 || ys[i] > 1) {uss._errorLogger(options.debugString, "ys[" + i + "] to be a number between 0 and 1 (inclusive)", ys[i]); return;}
    
    //Checks if the passed points are sorted.
    if(!_xsCurrMax || _xsCurrMax < xs[i]) {
      _xsCurrMax = xs[i]; 
    } else {
      uss._errorLogger(options.debugString, "the xs array to be sorted", xs[i].toFixed(2) + " (xs[" + i + "]) after " + xs[i - 1].toFixed(2) +  " (xs[" + (i - 1) + "])"); 
      return;
    } 
    if(!_isXDefinedIn0) _isXDefinedIn0 = xs[i] === 0; 
    if(!_isXDefinedIn1) _isXDefinedIn1 = xs[i] === 1; 
  } 

  //The control points must be defined at x = 0 and x = 1.
  if(!_isXDefinedIn0) {xs.unshift(0); ys.unshift(0);}
  if(!_isXDefinedIn1) {xs.push(1);    ys.push(1);}

  const c = 1 - tension;
  const n = xs.length - 1;
  const nHalf = Math.round(0.5 * n);
  
  //Cubic Hermite-Spline definition:
  //p(x) = h00(t) * p_k + h10(t) * (x_k+1 - x_k) * m_k + h01(t) * p_k+1 + h11(t) * (x_k+1 - x_k) * m_k+1 
  function _evalSpline(x) {
    let __binaryMin = 0; //binary search lower bound
    let __binaryMax = n; //binary search upper bound
    let k = nHalf;       //binary search iteration index
    let t; 
    
    //Find t corresponding to the given x (binary search).
    do {
      if(x >= xs[k] && x <= xs[k + 1]) {
        t = (x - xs[k]) / (xs[k + 1] - xs[k]); //t of the given x
        break;
      }
      if(xs[k] > x) {
        __binaryMax = k;
        k = Math.floor((__binaryMin + k) / 2);
      } else {
        __binaryMin = k;
        k = Math.floor((__binaryMax + k) / 2);
      }
    } while(__binaryMin !== __binaryMax);    

    const h_00 = +2 * t * t * t - 3 * t * t + 1;
    const h_10 =      t * t * t - 2 * t * t + t;
    const h_01 = -2 * t * t * t + 3 * t * t;
    const h_11 =      t * t * t -     t * t;

    const p_k0 = ys[k - 1] || ys[0];
    const p_k1 = ys[k];
    const p_k2 = ys[k + 1];
    const p_k3 = ys[k + 2] || ys[n];

    const x_k0 = xs[k - 1] || xs[0];
    const x_k1 = xs[k];
    const x_k2 = xs[k + 1];
    const x_k3 = xs[k + 2] || xs[n];
    
    const m_k0 = c * (p_k2 - p_k0) / (x_k2 - x_k0); 
    const m_k1 = c * (p_k3 - p_k1) / (x_k3 - x_k1); 

    return h_00 * p_k1 + h_10 * (x_k2 - x_k1) * m_k0 + h_01 * p_k2 + h_11 * (x_k2 - x_k1) * m_k1; //The y of the Cubic Hermite-Spline at the given x
  }

  return DEFAULT_STEP_LENGTH_CALCULATOR(_evalSpline, duration, callback);
}

export const CUSTOM_BEZIER_CURVE = (xs, ys, duration = 500, callback, options = {debugString: "CUSTOM_BEZIER_CURVE"}) => {
  if(!Array.isArray(xs)) {uss._errorLogger(options.debugString, "xs to be an array", xs); return;}
  if(!Array.isArray(ys)) {uss._errorLogger(options.debugString, "ys to be an array", ys); return;}
  if(xs.length !== ys.length) {uss._errorLogger(options.debugString, "xs and ys to have the same length", "xs.length = " + xs.length + " and ys.length = " + ys.length); return;}
  if(!Number.isFinite(duration) || duration <= 0) {uss._errorLogger(options.debugString, "the duration to be a positive number", duration); return;}

  let _isXDefinedIn0 = false;
  let _isXDefinedIn1 = false;
  const _xsLen = xs.length;

  for(let i = 0; i < _xsLen; i++) {
    if(!Number.isFinite(xs[i]) || xs[i] < 0 || xs[i] > 1) {uss._errorLogger(options.debugString, "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]); return;}
    if(!Number.isFinite(ys[i]) || ys[i] < 0 || ys[i] > 1) {uss._errorLogger(options.debugString, "ys[" + i + "] to be a number between 0 and 1 (inclusive)", ys[i]); return;}
    if(!_isXDefinedIn0) _isXDefinedIn0 = xs[i] === 0; 
    if(!_isXDefinedIn1) _isXDefinedIn1 = xs[i] === 1; 
  }

  //The control points must be defined at x = 0 and x = 1.
  if(!_isXDefinedIn0) {xs.unshift(0); ys.unshift(0);}
  if(!_isXDefinedIn1) {xs.push(1);    ys.push(1);}
  
  const n = xs.length - 1;
  const nFact = _factorial(n);
  
  function _factorial(num) {
    let __fact = 1;
    for (let i = 1; i <= num; i++) __fact *= i;
    return __fact;
  }

  //Returns B'(t): the first derivative of B(t).
  function _derivativeBt(t) {
    let __derivativeBt = 0;
    for(let i = 0; i <= n; i++) {
      __derivativeBt += nFact / (_factorial(i) * _factorial(n - i)) * xs[i] * Math.pow(1 - t, n - i - 1) * Math.pow(t, i - 1) * (i - n * t) ;
    }
    return __derivativeBt;
  }

  //Returns B(t): the parametric form of a n-th degree bezier curve.
  function _getBt(arr, t) {
    let __Bt = 0;
    for (let i = 0; i <= n; i++) {
      __Bt += nFact / (_factorial(i) * _factorial(n - i)) * arr[i] * Math.pow(1 - t, n - i) * Math.pow(t, i);      
    }
    return __Bt;
  }

  function _newtonRapson(x) {
    let __prev;
    let t = x;
    do {
      __prev = t;
      t -= (_getBt(xs, t) - x) / _derivativeBt(t);
    } while (Math.abs(t - __prev) > 0.001);   //Precision of 1^(-3)
   
    return _getBt(ys, t);
  }

  return DEFAULT_STEP_LENGTH_CALCULATOR(_newtonRapson, duration, callback);
}

export const CUSTOM_CUBIC_BEZIER = (x1 = 0, y1 = 0, x2 = 1, y2 = 1, duration = 500, callback, options = {debugString: "CUSTOM_CUBIC_BEZIER"}) => {
  if(!Number.isFinite(x1) || x1 < 0 || x1 > 1) {uss._errorLogger(options.debugString, "x1 to be a number between 0 and 1 (inclusive)", x1); return;}
  if(!Number.isFinite(y1) || y1 < 0 || y1 > 1) {uss._errorLogger(options.debugString, "y1 to be a number between 0 and 1 (inclusive)", y1); return;}
  if(!Number.isFinite(x2) || x2 < 0 || x2 > 1) {uss._errorLogger(options.debugString, "x2 to be a number between 0 and 1 (inclusive)", x2); return;}
  if(!Number.isFinite(y2) || y2 < 0 || y2 > 1) {uss._errorLogger(options.debugString, "y2 to be a number between 0 and 1 (inclusive)", y2); return;}
  if(!Number.isFinite(duration) || duration <= 0) {uss._errorLogger(options.debugString, "the duration to be a positive number", duration); return;}

  const aX = 1 + 3 * (x1 - x2);
  const aY = 1 + 3 * (y1 - y2);
  const bX = 3 * (x2 - 2 * x1);
  const bY = 3 * (y2 - 2 * y1);
  const cX = 3 * x1;
  const cY = 3 * y1;
  
  function _newtonRapson(x) {
    let __prev;
    let t = x;
    do {
      __prev = t;
      t -= ((t * (cX + t * (bX + t * aX)) - x) / (cX + t * (2 * bX + 3 * aX * t)));
    } while (Math.abs(t - __prev) > 0.001);   //Precision of 1^(-3)

    return t * ( cY + t * ( bY + t * aY )); //This is y given t on the bezier curve (0 <= y <= 1 && 0 <= t <= 1)
  }

  return DEFAULT_STEP_LENGTH_CALCULATOR(_newtonRapson, duration, callback);
}

export const EASE_LINEAR = (duration, callback) => CUSTOM_CUBIC_BEZIER(0, 0, 1, 1, duration, callback, {debugString: "EASE_LINEAR"});

export const EASE_IN_SINE  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.12, 0, 0.39, 0, duration, callback, {debugString: "EASE_IN_SINE"});
export const EASE_IN_QUAD  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.11, 0, 0.5,  0, duration, callback, {debugString: "EASE_IN_QUAD"});
export const EASE_IN_CUBIC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.32, 0, 0.67, 0, duration, callback, {debugString: "EASE_IN_CUBIC"});
export const EASE_IN_QUART = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.5,  0, 0.75, 0, duration, callback, {debugString: "EASE_IN_QUART"});
export const EASE_IN_QUINT = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.64, 0, 0.78, 0, duration, callback, {debugString: "EASE_IN_QUINT"});
export const EASE_IN_EXPO  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.7,  0, 0.84, 0, duration, callback, {debugString: "EASE_IN_EXPO"});
export const EASE_IN_CIRC  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.55, 0, 1, 0.45, duration, callback, {debugString: "EASE_IN_CIRC"});

export const EASE_OUT_SINE  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.61, 1, 0.88, 1, duration, callback, {debugString: "EASE_OUT_SINE"});
export const EASE_OUT_QUAD  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.5,  1, 0.89, 1, duration, callback, {debugString: "EASE_OUT_QUAD"});
export const EASE_OUT_CUBIC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.33, 1, 0.68, 1, duration, callback, {debugString: "EASE_OUT_CUBIC"});
export const EASE_OUT_QUART = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.25, 1, 0.5,  1, duration, callback, {debugString: "EASE_OUT_QUART"});
export const EASE_OUT_QUINT = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.22, 1, 0.36, 1, duration, callback, {debugString: "EASE_OUT_QUINT"});
export const EASE_OUT_EXPO  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.16, 1, 0.3,  1, duration, callback, {debugString: "EASE_OUT_EXPO"});
export const EASE_OUT_CIRC  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0, 0.55, 0.45, 1, duration, callback, {debugString: "EASE_OUT_CIRC"});

export const EASE_IN_OUT_SINE  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.37, 0, 0.63, 1, duration, callback, {debugString: "EASE_IN_OUT_SINE"});
export const EASE_IN_OUT_QUAD  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.45, 0, 0.55, 1, duration, callback, {debugString: "EASE_IN_OUT_QUAD"});
export const EASE_IN_OUT_CUBIC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.65, 0, 0.35, 1, duration, callback, {debugString: "EASE_IN_OUT_CUBIC"});
export const EASE_IN_OUT_QUART = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.76, 0, 0.24, 1, duration, callback, {debugString: "EASE_IN_OUT_QUART"});
export const EASE_IN_OUT_QUINT = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.83, 0, 0.17, 1, duration, callback, {debugString: "EASE_IN_OUT_QUINT"});
export const EASE_IN_OUT_EXPO  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.87, 0, 0.13, 1, duration, callback, {debugString: "EASE_IN_OUT_EXPO"});
export const EASE_IN_OUT_CIRC  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.85, 0, 0.15, 1, duration, callback, {debugString: "EASE_IN_OUT_CIRC"});

export const EASE_IN_BOUNCE = (duration = 900, callback, bouncesNumber = 3) => {
  if(!Number.isFinite(bouncesNumber) || bouncesNumber <= 0) {uss._errorLogger("EASE_IN_BOUNCE", "bouncesNumber to be a positive number", bouncesNumber); return;}
  
  const _xs = [];
  const _ys = [];
  const _inserter = (arr, el, currI, len) => arr[len - currI - 1] = 1 - el;
  
  DEFAULT_BOUNCE_CUSTOMIZER(_xs, _ys, _inserter, 1, bouncesNumber + 1);
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, {debugString: "EASE_IN_BOUNCE"});
}

export const EASE_OUT_BOUNCE = (duration = 900, callback, bouncesNumber = 3) => {
  if(!Number.isFinite(bouncesNumber) || bouncesNumber <= 0) {uss._errorLogger("EASE_OUT_BOUNCE", "bouncesNumber to be a positive number", bouncesNumber); return;}

  const _xs = [];
  const _ys = [];
  const _inserter = (arr, el, currI) => arr[currI] = el;
  
  DEFAULT_BOUNCE_CUSTOMIZER(_xs, _ys, _inserter, 1, bouncesNumber + 1);
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, {debugString: "EASE_OUT_BOUNCE"});
}

export const EASE_IN_OUT_BOUNCE = (duration = 1200, callback, bouncesNumber = 6) => {
  if(!Number.isFinite(bouncesNumber) || bouncesNumber <= 1) {uss._errorLogger("EASE_IN_OUT_BOUNCE", "bouncesNumber to be a number >= 2", bouncesNumber); return;}
  if(bouncesNumber === 2) {
    return CUSTOM_CUBIC_HERMITE_SPLINE(
      [0, 0.04, 0.14, 0.24, 0.3000, 0.3001, 0.40, 0.60, 0.7000, 0.7001, 0.76, 0.86, 0.96, 1], 
      [0, 0.07, 0.13, 0.07, 0.0001, 0.0001, 0.46, 0.64, 0.9999, 0.9999, 0.93, 0.87, 0.93, 1], 
      0, duration, callback, {debugString: "EASE_IN_OUT_BOUNCE"}
    );
  }

  const _xs = [];
  const _ys = [];
  const _initPointsNum = 10;
  const _startBouncesNumberEaseIn  = Math.max(Math.floor(0.5 * (bouncesNumber - 1)), 1);
  const _startBouncesNumberEaseOut = Math.max(Math.floor(0.5 * bouncesNumber), 2);

  const _inserterEaseIn  = (arr, el, currI, len) => arr[len - currI - 1] = 1 - el;
  const _inserterEaseOut = (arr, el, currI)      => arr[currI - 2] = el; 
                                       
  DEFAULT_BOUNCE_CUSTOMIZER(_xs, _ys, _inserterEaseIn,  _startBouncesNumberEaseIn,  bouncesNumber);
  DEFAULT_BOUNCE_CUSTOMIZER(_xs, _ys, _inserterEaseOut, _startBouncesNumberEaseOut, bouncesNumber);
  
  //Force an ease-in-out transition between ease-in-bounce and the ease-out-bounce.
  const _transitionPoint = _initPointsNum + (_startBouncesNumberEaseOut - 1) * 5 - 3;
  _xs[_transitionPoint - 1] = 0.75 * _xs[_transitionPoint] + 0.25 * _xs[_transitionPoint + 1];
  _xs[_transitionPoint]     = 0.25 * _xs[_transitionPoint] + 0.75 * _xs[_transitionPoint + 1];
  _ys[_transitionPoint -1] = 0.47;
  _ys[_transitionPoint]    = 0.63;

  //Remove the duplicate definitions of the control points at (1,1).
  _xs.pop(); _xs.pop();
  _ys.pop(); _ys.pop();
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, {debugString: "EASE_IN_OUT_BOUNCE"});
}












export const EASE_ELASTIC_X = (forwardEasing, backwardEasing, elasticPointCalculator = () => 50, debounceTime = 0) => {
  if(typeof forwardEasing  !== "function") {uss._errorLogger("EASE_ELASTIC_X", "the forwardEasing to be a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {uss._errorLogger("EASE_ELASTIC_X", "the backwardEasing to be a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {uss._errorLogger("EASE_ELASTIC_X", "the elasticPointCalculator to be a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {uss._errorLogger("EASE_ELASTIC_X", "the debounceTime to be a number", debounceTime); return;}

  let _finalXPositionBackwardPhase = null;
  let _scrollCalculator;
  let _debounceTimeout;

  function init(originalTimestamp, timestamp, container) {
    const _oldData = uss._containersData.get(container) || [];

    //The init function has been triggered by the backward phase
    //of this scroll-animation (or by one that has same final position), 
    //no action required.
    if(_finalXPositionBackwardPhase === _oldData[2]) {
      _finalXPositionBackwardPhase = null;
      return;
    }
    
    //Avoid setting up the backward phase if the container is not actually scrolling.
    _scrollCalculator = forwardEasing;
    _finalXPositionBackwardPhase = null;
    if(!_oldData[0]) return;

    //Avoid double-triggering the backward phase.
    clearTimeout(_debounceTimeout);
    
    const _originalCallback = typeof _oldData[10] === "function" ? _oldData[10] : () => {};
    _oldData[10] = () => {
      _debounceTimeout = setTimeout(() => {
        const _currentPos    = container === window ? window.scrollX : container.scrollLeft;
        const _oldDirection  = _oldData[4];
        const _elasticAmount = elasticPointCalculator(originalTimestamp, timestamp, _currentPos, _oldDirection, container);
        
        if(!Number.isFinite(_elasticAmount)) {
          uss._warningLogger(_elasticAmount, "is not a valid elastic amount");
          _originalCallback();
        } else if(_elasticAmount === 0) {
          _originalCallback();
        } else {
          //The backward easing is used only if the new scroll-animations goes backward.
          if(_elasticAmount > 0) _scrollCalculator = backwardEasing; 
          uss.scrollXTo(_currentPos - _elasticAmount * _oldDirection, container, _originalCallback, false);
          _finalXPositionBackwardPhase = uss._containersData.get(container)[2]
        }
      }, debounceTime);
    }
  }

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    if(originalTimestamp === timestamp) init(originalTimestamp, timestamp, container);
    return _scrollCalculator(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);
  }
}

export const EASE_ELASTIC_Y = (forwardEasing, backwardEasing, elasticPointCalculator = () => 50, debounceTime = 0) => {
  if(typeof forwardEasing  !== "function") {uss._errorLogger("EASE_ELASTIC_Y", "the forwardEasing to be a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {uss._errorLogger("EASE_ELASTIC_Y", "the backwardEasing to be a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {uss._errorLogger("EASE_ELASTIC_Y", "the elasticPointCalculator to be a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {uss._errorLogger("EASE_ELASTIC_Y", "the debounceTime to be a number", debounceTime); return;}

  let _finalYPositionBackwardPhase = null;
  let _scrollCalculator;
  let _debounceTimeout;

  function init(originalTimestamp, timestamp, container) {
    const _oldData = uss._containersData.get(container) || [];

    //The init function has been triggered by the backward phase
    //of this scroll-animation (or by one that has same final position), 
    //no action required.
    if(_finalYPositionBackwardPhase === _oldData[3]) {
      _finalYPositionBackwardPhase = null;
      return;
    }
    
    //Avoid setting up the backward phase if the container is not actually scrolling.
    _scrollCalculator = forwardEasing;
    _finalYPositionBackwardPhase = null;
    if(!_oldData[1]) return;

    //Avoid double-triggering the backward phase.
    clearTimeout(_debounceTimeout);
    
    const _originalCallback = typeof _oldData[11] === "function" ? _oldData[11] : () => {};
    _oldData[11] = () => {
      _debounceTimeout = setTimeout(() => {
        const _currentPos    = container === window ? window.scrollY : container.scrollTop;
        const _oldDirection  = _oldData[5];
        const _elasticAmount = elasticPointCalculator(originalTimestamp, timestamp, _currentPos, _oldDirection, container);
        
        if(!Number.isFinite(_elasticAmount)) {
          uss._warningLogger(_elasticAmount, "is not a valid elastic amount");
          _originalCallback();
        } else if(_elasticAmount === 0) {
          _originalCallback();
        } else {
          //The backward easing is used only if the new scroll-animations goes backward.
          if(_elasticAmount > 0) _scrollCalculator = backwardEasing; 
          uss.scrollYTo(_currentPos - _elasticAmount * _oldDirection, container, _originalCallback, false);
          _finalYPositionBackwardPhase = uss._containersData.get(container)[3]
        }
      }, debounceTime);
    }
  }

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    if(originalTimestamp === timestamp) init(originalTimestamp, timestamp, container);
    return _scrollCalculator(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);
  }
}