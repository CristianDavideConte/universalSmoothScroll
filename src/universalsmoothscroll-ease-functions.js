"use strict";

/**
 * Internally used to define the standard behavior of a stepLengthCalculator.
 * The progressEvaluator parameter defines at which % of the total duration the scroll-animation is at.
 * The duration is the total amount in ms the scroll-animation should last.
 * The callback is a function that is executed every time the stepLengthCalculator is invoked.  
 */
const _DEFAULT_STEP_LENGTH_CALCULATOR = (progressEvaluator, duration, callback) => {
  const _callback = typeof callback === "function" ? callback : () => {};
  let _startingPos = 0;
  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    let _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration

    if(_progress >= 1) return remaning;
    if(_progress <= 0) {
      //The elapsed time of a scroll-animation is always >= uss._frameTime / 2 
      //because the first step length is always 0 at elapsed time = 0 and this would break
      //scroll-animations with stillStart = true on touchpad enabled devices.
      _startingPos = 1 - remaning / total;
      _progress = 0.5 * uss._framesTime / duration; 
    }
    const _nextPos = (progressEvaluator(_progress) * (1 - _startingPos) + _startingPos) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
}  

/*
 * Internally used to setup the control points' arrays for bounce-type StepLengthCalculators.
 * Do not use it directly for setting a StepLengthCalculator.
 */
const _CUSTOM_BOUNCE = (xs, ys, arrInserter, startBouncesNumber, endBouncesNumber) => {
  const _bounceDeltaX = 1 / endBouncesNumber;
  const _bounceDeltaXHalf = _bounceDeltaX * 0.5; 
  const _bounceCorrectionDelta = _bounceDeltaXHalf * 0.001;

  /**
   * These functions define:
   * - The pattern of the control points' x coordinates (same for bounces and peaks)
   * - The pattern of the control points' y coordinates (2 different ones for bounces and peaks)
   */
  const _bounceXCalc = x => 1 - Math.pow(1 - x, 1.6);
  const _bounceYCalc = x => x * 0.005 + 0.995;
  const _peakYCalc   = x => x > 0.6 ? x * 0.35 + 0.64 : 1 - (1 - x) * (1 - x);
  
  const initPointsNum = 10;
  const arrLen = initPointsNum + (endBouncesNumber - 1) * 5 + 1 
  let arrIndex = 0;
  let i;

  if(startBouncesNumber !== 1) arrIndex = initPointsNum + (startBouncesNumber - 1) * 5;
  else {
    //Force an ease-in pattern for the first initPointsNum control points.
    const _initBounceDeltaX = (_bounceDeltaX - _bounceCorrectionDelta) / initPointsNum;
    const _closeToBounceDeltaX = _bounceDeltaX - 2 * _bounceCorrectionDelta;
    for (i = 0; i < _closeToBounceDeltaX; i += _initBounceDeltaX) {
      arrInserter(xs, _bounceXCalc(i),                 arrIndex, arrLen);
      arrInserter(ys,  Math.pow(i * endBouncesNumber, 2), arrIndex, arrLen);
      arrIndex++;
    }
  }

  //Defines the control points of the spline between the first and the last bounce.
  for(i = startBouncesNumber; i < endBouncesNumber; i++) {
    const _originalBounceX = _bounceDeltaX * i;
    const _calcBounceX = _bounceXCalc(_originalBounceX);
    const _calcBounceY = _bounceYCalc(_calcBounceX);
    const _nextPeakX   = _bounceXCalc(_originalBounceX + _bounceDeltaXHalf);
    const _nextPeakY   = _peakYCalc(_nextPeakX);
    const _nextSlopeY  = _nextPeakY * 0.65 + 0.35 * _calcBounceY;

    arrInserter(xs, _calcBounceX,                                            arrIndex,    arrLen);
    arrInserter(xs, _bounceXCalc(_originalBounceX + _bounceCorrectionDelta), arrIndex + 1, arrLen);

    arrInserter(xs, _bounceXCalc(_originalBounceX + _bounceDeltaXHalf * 0.35), arrIndex + 2, arrLen);
    arrInserter(xs, _nextPeakX,                                                arrIndex + 3, arrLen);
    arrInserter(xs, _bounceXCalc(_originalBounceX + _bounceDeltaXHalf * 1.65), arrIndex + 4, arrLen);
    
    arrInserter(ys, _calcBounceY, arrIndex,     arrLen); 
    arrInserter(ys, _calcBounceY, arrIndex + 1, arrLen); 

    arrInserter(ys, _nextSlopeY, arrIndex + 2, arrLen);
    arrInserter(ys, _nextPeakY,  arrIndex + 3, arrLen);
    arrInserter(ys, _nextSlopeY, arrIndex + 4, arrLen);
    
    arrIndex += 5;
  }

  //Defines the control points of the spline at (1,1).
  arrInserter(xs, 1, arrIndex, arrLen);      
  arrInserter(ys, 1, arrIndex, arrLen);    
}

const CUSTOM_CUBIC_HERMITE_SPLINE = (xs, ys, tension = 0, duration = 500, callback, debugString = "CUSTOM_CUBIC_HERMITE_SPLINE") => {
  if(!Array.isArray(xs)) {uss._errorLogger(debugString, "xs to be an array", xs); return;}
  if(!Array.isArray(ys)) {uss._errorLogger(debugString, "ys to be an array", ys); return;}
  if(xs.length !== ys.length) {uss._errorLogger(debugString, "xs and ys to have the same length", "xs.length = " + xs.length + " and ys.length = " + ys.length); return;}
  if(!Number.isFinite(duration) || duration <= 0) {uss._errorLogger(debugString, "the duration to be a positive number", duration); return;}
  
  let _isXDefinedIn0 = false;
  let _isXDefinedIn1 = false;
  let xsCurrMax = null;
  const _xsLen = xs.length;

  for(let i = 0; i < _xsLen; i++) {
    if(!Number.isFinite(xs[i]) || xs[i] < 0 || xs[i] > 1) {uss._errorLogger(debugString, "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]); return;}
    if(!Number.isFinite(ys[i]) || ys[i] < 0 || ys[i] > 1) {uss._errorLogger(debugString, "ys[" + i + "] to be a number between 0 and 1 (inclusive)", ys[i]); return;}
    
    //Checks if the passed points are sorted.
    if(!xsCurrMax || xsCurrMax < xs[i]) xsCurrMax = xs[i]; 
    else {
      uss._errorLogger(debugString, "the xs array to be sorted", xs[i].toFixed(2) + " (xs[" + i + "]) after " + xs[i - 1].toFixed(2) +  " (xs[" + (i - 1) + "])"); 
      return;
    } 
    if(!_isXDefinedIn0) _isXDefinedIn0 = xs[i] === 0; 
    if(!_isXDefinedIn1) _isXDefinedIn1 = xs[i] === 1; 
  } 

  //The control points must be defined at x = 0 and x = 1.
  if(!_isXDefinedIn0) {xs.unshift(0); ys.unshift(0);}
  if(!_isXDefinedIn1) {xs.push(1); ys.push(1);}

  const c = 1 - tension;
  const n = xs.length - 1;
  const nHalf = Math.round(0.5 * n);
  
  //Cubic Hermite-Spline definition:
  //p(x) = h00(t) * p_k + h10(t) * (x_k+1 - x_k) * m_k + h01(t) * p_k+1 + h11(t) * (x_k+1 - x_k) * m_k+1 
  function _evalSpline(x) {
    //if(x === 0) x = 0.5 * uss._framesTime;
    let binaryMin = 0; //binary search lower bound
    let binaryMax = n; //binary search upper bound
    let k = nHalf;     //binary search iteration index
    let t; 
    
    //Find t corresponding to the given x (binary search).
    do {
      if(x >= xs[k] && x <= xs[k + 1]) {
        t = (x - xs[k]) / (xs[k + 1] - xs[k]); //t of the given x
        break;
      }
      if(xs[k] > x) {
        binaryMax = k;
        k = Math.floor((binaryMin + k) / 2);
      } else {
        binaryMin = k;
        k = Math.floor((binaryMax + k) / 2);
      }
    } while(binaryMin !== binaryMax);    

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

  return _DEFAULT_STEP_LENGTH_CALCULATOR(_evalSpline, duration, callback);
}

const CUSTOM_BEZIER_CURVE = (xs, ys, duration = 500, callback, debugString = "CUSTOM_BEZIER_CURVE") => {
  if(!Array.isArray(xs)) {uss._errorLogger(debugString, "xs to be an array", xs); return;}
  if(!Array.isArray(ys)) {uss._errorLogger(debugString, "ys to be an array", ys); return;}
  if(xs.length !== ys.length) {uss._errorLogger(debugString, "xs and ys to have the same length", "xs.length = " + xs.length + " and ys.length = " + ys.length); return;}
  if(!Number.isFinite(duration) || duration <= 0) {uss._errorLogger(debugString, "the duration to be a positive number", duration); return;}

  let _isXDefinedIn0 = false;
  let _isXDefinedIn1 = false;
  const _xsLen = xs.length;

  for(let i = 0; i < _xsLen; i++) {
    if(!Number.isFinite(xs[i]) || xs[i] < 0 || xs[i] > 1) {uss._errorLogger(debugString, "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]); return;}
    if(!Number.isFinite(ys[i]) || ys[i] < 0 || ys[i] > 1) {uss._errorLogger(debugString, "ys[" + i + "] to be a number between 0 and 1 (inclusive)", ys[i]); return;}
    if(!_isXDefinedIn0) _isXDefinedIn0 = xs[i] === 0; 
    if(!_isXDefinedIn1) _isXDefinedIn1 = xs[i] === 1; 
  }

  //The control points must be defined at x = 0 and x = 1.
  if(!_isXDefinedIn0) {xs.unshift(0); ys.unshift(0);}
  if(!_isXDefinedIn1) {xs.push(1); ys.push(1);}
  
  const n = xs.length - 1;
  const nFact = _factorial(n);
  
  function _factorial(num) {
    let fact = 1;
    for (let i = 1; i <= num; i++) fact *= i;
    return fact;
  }

  //Returns B'(t): the first derivative of B(t).
  function _derivativeBt(t) {
    let _derivativeBt = 0;
    for(let i = 0; i <= n; i++) {
      _derivativeBt += nFact / (_factorial(i) * _factorial(n - i)) * xs[i] * Math.pow(1 - t, n - i - 1) * Math.pow(t, i - 1) * (i - n * t) ;
    }
    return _derivativeBt;
  }

  //Returns B(t): the parametric form of a n-th degree bezier curve.
  function _getBt(arr, t) {
    let _Bt = 0;
    for (let i = 0; i <= n; i++) {
      _Bt += nFact / (_factorial(i) * _factorial(n - i)) * arr[i] * Math.pow(1 - t, n - i) * Math.pow(t, i);      
    }
    return _Bt;
  }

  function _newtonRapson(x) {
    //if(x === 0) x = 0.5 * uss._framesTime;
    let prev;
    let t = x;
    do {
      prev = t;
      t -= (_getBt(xs, t) - x) / _derivativeBt(t);
    } while (Math.abs(t - prev) > 0.001);   //Precision of 1^(-3)
   
    return _getBt(ys, t);
  }

  return _DEFAULT_STEP_LENGTH_CALCULATOR(_newtonRapson, duration, callback);
}

const CUSTOM_CUBIC_BEZIER = (x1 = 0, y1 = 0, x2 = 1, y2 = 1, duration = 500, callback, debugString = "CUSTOM_CUBIC_BEZIER") => {
  if(!Number.isFinite(duration) || duration <= 0) {uss._errorLogger(debugString, "the duration to be a positive number", duration); return;}
  if(!Number.isFinite(x1) || x1 < 0 || x1 > 1) {uss._errorLogger(debugString, "x1 to be a number between 0 and 1 (inclusive)", x1); return;}
  if(!Number.isFinite(y1) || y1 < 0 || y1 > 1) {uss._errorLogger(debugString, "y1 to be a number between 0 and 1 (inclusive)", y1); return;}
  if(!Number.isFinite(x2) || x2 < 0 || x2 > 1) {uss._errorLogger(debugString, "x2 to be a number between 0 and 1 (inclusive)", x2); return;}
  if(!Number.isFinite(y2) || y2 < 0 || y2 > 1) {uss._errorLogger(debugString, "y2 to be a number between 0 and 1 (inclusive)", y2); return;}

  const aX = 1 + 3 * (x1 - x2);
  const aY = 1 + 3 * (y1 - y2);
  const bX = 3 * (x2 - 2 * x1);
  const bY = 3 * (y2 - 2 * y1);
  const cX = 3 * x1;
  const cY = 3 * y1;
  
  function _newtonRapson(x) {
    //if(x === 0) x = 0.5 * uss._framesTime;
    let prev;
    let t = x;
    do {
      prev = t;
      t -= ((t * (cX + t * (bX + t * aX)) - x) / (cX + t * (2 * bX + 3 * aX * t)));
    } while (Math.abs(t - prev) > 0.001);   //Precision of 1^(-3)

    return t * ( cY + t * ( bY + t * aY )); //This is y given t on the bezier curve (0 <= y <= 1 && 0 <= t <= 1)
  }

  return _DEFAULT_STEP_LENGTH_CALCULATOR(_newtonRapson, duration, callback);
}

const EASE_LINEAR = (duration, callback) => CUSTOM_CUBIC_BEZIER(0, 0, 1, 1, duration, callback, "EASE_LINEAR");

const EASE_IN_SINE  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.12, 0, 0.39, 0, duration, callback, "EASE_IN_SINE");
const EASE_IN_QUAD  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.11, 0, 0.5,  0, duration, callback, "EASE_IN_QUAD");
const EASE_IN_CUBIC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.32, 0, 0.67, 0, duration, callback, "EASE_IN_CUBIC");
const EASE_IN_QUART = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.5,  0, 0.75, 0, duration, callback, "EASE_IN_QUART");
const EASE_IN_QUINT = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.64, 0, 0.78, 0, duration, callback, "EASE_IN_QUINT");
const EASE_IN_EXPO  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.7,  0, 0.84, 0, duration, callback, "EASE_IN_EXPO");
const EASE_IN_CIRC  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.55, 0, 1, 0.45, duration, callback, "EASE_IN_CIRC");

const EASE_OUT_SINE  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.61, 1, 0.88, 1, duration, callback, "EASE_OUT_SINE");
const EASE_OUT_QUAD  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.5,  1, 0.89, 1, duration, callback, "EASE_OUT_QUAD");
const EASE_OUT_CUBIC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.33, 1, 0.68, 1, duration, callback, "EASE_OUT_CUBIC");
const EASE_OUT_QUART = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.25, 1, 0.5,  1, duration, callback, "EASE_OUT_QUART");
const EASE_OUT_QUINT = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.22, 1, 0.36, 1, duration, callback, "EASE_OUT_QUINT");
const EASE_OUT_EXPO  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.16, 1, 0.3,  1, duration, callback, "EASE_OUT_EXPO");
const EASE_OUT_CIRC  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0, 0.55, 0.45, 1, duration, callback, "EASE_OUT_CIRC");

const EASE_IN_OUT_SINE  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.37, 0, 0.63, 1, duration, callback, "EASE_IN_OUT_SINE");
const EASE_IN_OUT_QUAD  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.45, 0, 0.55, 1, duration, callback, "EASE_IN_OUT_QUAD");
const EASE_IN_OUT_CUBIC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.65, 0, 0.35, 1, duration, callback, "EASE_IN_OUT_CUBIC");
const EASE_IN_OUT_QUART = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.76, 0, 0.24, 1, duration, callback, "EASE_IN_OUT_QUART");
const EASE_IN_OUT_QUINT = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.83, 0, 0.17, 1, duration, callback, "EASE_IN_OUT_QUINT");
const EASE_IN_OUT_EXPO  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.87, 0, 0.13, 1, duration, callback, "EASE_IN_OUT_EXPO");
const EASE_IN_OUT_CIRC  = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.85, 0, 0.15, 1, duration, callback, "EASE_IN_OUT_CIRC");

const EASE_IN_BOUNCE = (duration = 900, callback, bouncesNumber = 3) => {
  if(!Number.isFinite(bouncesNumber) || bouncesNumber <= 0) {uss._errorLogger("EASE_IN_BOUNCE", "bouncesNumber to be a positive number", bouncesNumber); return;}
  
  const _xs = [];
  const _ys = [];
  const _inserter = (arr, el, currI, len) => arr[len - currI - 1] = 1 - el;
  
  _CUSTOM_BOUNCE(_xs, _ys, _inserter, 1, bouncesNumber + 1);
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, "EASE_IN_BOUNCE");
}

const EASE_OUT_BOUNCE = (duration = 900, callback, bouncesNumber = 3) => {
  if(!Number.isFinite(bouncesNumber) || bouncesNumber <= 0) {uss._errorLogger("EASE_OUT_BOUNCE", "bouncesNumber to be a positive number", bouncesNumber); return;}

  const _xs = [];
  const _ys = [];
  const _inserter = (arr, el, currI) => arr[currI] = el;
  
  _CUSTOM_BOUNCE(_xs, _ys, _inserter, 1, bouncesNumber + 1);
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, "EASE_OUT_BOUNCE");
}

const EASE_IN_OUT_BOUNCE = (duration = 1200, callback, bouncesNumber = 6) => {
  if(!Number.isFinite(bouncesNumber) || bouncesNumber <= 1) {uss._errorLogger("EASE_IN_OUT_BOUNCE", "bouncesNumber to be a number >= 2", bouncesNumber); return;}
  if(bouncesNumber === 2) {
    return CUSTOM_CUBIC_HERMITE_SPLINE(
      [0, 0.04, 0.14, 0.24, 0.3000, 0.3001, 0.40, 0.60, 0.7000, 0.7001, 0.76, 0.86, 0.96, 1], 
      [0, 0.07, 0.13, 0.07, 0.0001, 0.0001, 0.46, 0.64, 0.9999, 0.9999, 0.93, 0.87, 0.93, 1], 
      0, duration, callback, "EASE_IN_OUT_BOUNCE"
    );
  }

  const _xs = [];
  const _ys = [];
  const _initPointsNum = 10;
  const _startBouncesNumberEaseIn  = Math.max(Math.floor(0.5 * (bouncesNumber - 1)), 1);
  const _startBouncesNumberEaseOut = Math.max(Math.floor(0.5 * bouncesNumber), 2);

  const _inserterEaseIn  = (arr, el, currI, len) => arr[len - currI - 1] = 1 - el;
  const _inserterEaseOut = (arr, el, currI)      => arr[currI - 2] = el; 
                                       
  _CUSTOM_BOUNCE(_xs, _ys, _inserterEaseIn,  _startBouncesNumberEaseIn,  bouncesNumber);
  _CUSTOM_BOUNCE(_xs, _ys, _inserterEaseOut, _startBouncesNumberEaseOut, bouncesNumber);
  
  //Force an ease-in-out transition between ease-in-bounce and the ease-out-bounce.
  const transitionPoint = _initPointsNum + (_startBouncesNumberEaseOut - 1) * 5 - 3;
  _xs[transitionPoint - 1] = 0.75 * _xs[transitionPoint] + 0.25 * _xs[transitionPoint + 1];
  _xs[transitionPoint]     = 0.25 * _xs[transitionPoint] + 0.75 * _xs[transitionPoint + 1];
  _ys[transitionPoint -1] = 0.47;
  _ys[transitionPoint]    = 0.63;

  //Remove the duplicate definitions of the control points at (1,1).
  _xs.pop(); _xs.pop();
  _ys.pop(); _ys.pop();
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, "EASE_IN_OUT_BOUNCE");
}

const EASE_ELASTIC_X = (forwardEasing, backwardEasing, elasticPointCalculator = () => 50, debounceTime = 0) => {
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
          uss.scrollXTo(_currentPos - _elasticAmount * _oldDirection, container, _originalCallback);
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

const EASE_ELASTIC_Y = (forwardEasing, backwardEasing, elasticPointCalculator = () => 50, debounceTime = 0) => {
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
          uss.scrollYTo(_currentPos - _elasticAmount * _oldDirection, container, _originalCallback);
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