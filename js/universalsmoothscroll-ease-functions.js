"use strict";

const CUSTOM_CUBIC_HERMITE_SPLINE = (xs, ys, tension = 0, duration = 500, callback, debugString = "CUSTOM_CUBIC_HERMITE_SPLINE") => {
  if(!Array.isArray(xs)) {DEFAULT_ERROR_LOGGER(debugString, "xs to be an array", xs); return;}
  if(!Array.isArray(ys)) {DEFAULT_ERROR_LOGGER(debugString, "ys to be an array", ys); return;}
  if(xs.length !== ys.length) {DEFAULT_ERROR_LOGGER(debugString, "xs and ys to have the same length", "xs.length = " + xs.length + " and ys.length = " + ys.length); return;}
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER(debugString, "the duration to be a positive number", duration); return;}
  
  let _isXDefinedIn0 = false;
  let _isXDefinedIn1 = false;
  let xsCurrMax = null;
  const _xsLen = xs.length;

  for(let i = 0; i < _xsLen; i++) {
    if(!Number.isFinite(xs[i]) || xs[i] < 0 || xs[i] > 1) {DEFAULT_ERROR_LOGGER(debugString, "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]); return;}
    if(!Number.isFinite(ys[i]) || ys[i] < 0 || ys[i] > 1) {DEFAULT_ERROR_LOGGER(debugString, "ys[" + i + "] to be a number between 0 and 1 (inclusive)", ys[i]); return;}
    
    //Checks if the passed points are sorted
    if(!xsCurrMax || xsCurrMax < xs[i]) xsCurrMax = xs[i]; 
    else {
      DEFAULT_ERROR_LOGGER(debugString, "the xs array to be sorted", xs[i].toFixed(2) + " (xs[" + i + "]) after " + xs[i - 1].toFixed(2) +  " (xs[" + (i - 1) + "])"); 
      return;
    } 
    if(!_isXDefinedIn0) _isXDefinedIn0 = xs[i] === 0; 
    if(!_isXDefinedIn1) _isXDefinedIn1 = xs[i] === 1; 
  } 

  //The control points must be defined at x = 0 and x = 1
  if(!_isXDefinedIn0) {xs.unshift(0); ys.unshift(0);}
  if(!_isXDefinedIn1) {xs.push(1); ys.push(1);}

  const _callback = typeof callback === "function" ? callback : () => {};
  const c = 1 - tension;
  const n = xs.length - 1;
  const nHalf = Math.round(n / 2);
  
  //Cubic Hermite-Spline definition:
  //p(x) = h00(t) * p_k + h10(t) * (x_k+1 - x_k) * m_k + h01(t) * p_k+1 + h11(t) * (x_k+1 - x_k) * m_k+1 
  function _evalSpline(x) {
    let binaryMin = 0;
    let binaryMax = n;
    let k = nHalf;
    let t; 
    
    //Find t corresponding to the given x (binary search)
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

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : _evalSpline(_progress) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
}

const CUSTOM_BEZIER_CURVE = (xs, ys, duration = 500, callback, debugString = "CUSTOM_BEZIER_CURVE") => {
  if(!Array.isArray(xs)) {DEFAULT_ERROR_LOGGER(debugString, "xs to be an array", xs); return;}
  if(!Array.isArray(ys)) {DEFAULT_ERROR_LOGGER(debugString, "ys to be an array", ys); return;}
  if(xs.length !== ys.length) {DEFAULT_ERROR_LOGGER(debugString, "xs and ys to have the same length", "xs.length = " + xs.length + " and ys.length = " + ys.length); return;}
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER(debugString, "the duration to be a positive number", duration); return;}

  let _isXDefinedIn0 = false;
  let _isXDefinedIn1 = false;
  const _xsLen = xs.length;

  for(let i = 0; i < _xsLen; i++) {
    if(!Number.isFinite(xs[i]) || xs[i] < 0 || xs[i] > 1) {DEFAULT_ERROR_LOGGER(debugString, "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]); return;}
    if(!Number.isFinite(ys[i]) || ys[i] < 0 || ys[i] > 1) {DEFAULT_ERROR_LOGGER(debugString, "ys[" + i + "] to be a number between 0 and 1 (inclusive)", ys[i]); return;}
    if(!_isXDefinedIn0) _isXDefinedIn0 = xs[i] === 0; 
    if(!_isXDefinedIn1) _isXDefinedIn1 = xs[i] === 1; 
  }

  //The control points must be defined at x = 0 and x = 1
  if(!_isXDefinedIn0) {xs.unshift(0); ys.unshift(0);}
  if(!_isXDefinedIn1) {xs.push(1); ys.push(1);}
  
  const _callback = typeof callback === "function" ? callback : () => {};
  const n = xs.length - 1;
  const nFact = _factorial(n);
  
  function _factorial(num) {
    let fact = 1;
    for (let i = 1; i <= num; i++) fact *= i;
    return fact;
  }

  //Returns B'(t): the first derivative of B(t)
  function _derivativeBt(t) {
    let _derivativeBt = 0;
    for(let i = 0; i <= n; i++) {
      _derivativeBt += nFact / (_factorial(i) * _factorial(n - i)) * xs[i] * Math.pow(1 - t, n - i - 1) * Math.pow(t, i - 1) * (i - n * t) ;
    }
    return _derivativeBt;
  }

  //Returns B(t): the parametric form of a n-th degree bezier curve
  function _getBt(arr, t) {
    let _Bt = 0;
    for (let i = 0; i <= n; i++) {
      _Bt += nFact / (_factorial(i) * _factorial(n - i)) * arr[i] * Math.pow(1 - t, n - i) * Math.pow(t, i);      
    }
    return _Bt;
  }

  function _newtonRapson(x) {
    let prev;
    let t = x;
    do {
      prev = t;
      t -= (_getBt(xs, t) - x) / _derivativeBt(t);
    } while (Math.abs(t - prev) > 0.001);   //Precision of 1^(-3)
   
    return _getBt(ys, t);
  }

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : _newtonRapson(_progress) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
}

const CUSTOM_CUBIC_BEZIER = (x1 = 0, y1 = 0, x2 = 1, y2 = 1, duration = 500, callback, debugString = "CUSTOM_CUBIC_BEZIER") => {
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER(debugString, "the duration to be a positive number", duration); return;}
  if(!Number.isFinite(x1) || x1 < 0 || x1 > 1) {DEFAULT_ERROR_LOGGER(debugString, "x1 to be a number between 0 and 1 (inclusive)", x1); return;}
  if(!Number.isFinite(y1) || y1 < 0 || y1 > 1) {DEFAULT_ERROR_LOGGER(debugString, "y1 to be a number between 0 and 1 (inclusive)", y1); return;}
  if(!Number.isFinite(x2) || x2 < 0 || x2 > 1) {DEFAULT_ERROR_LOGGER(debugString, "x2 to be a number between 0 and 1 (inclusive)", x2); return;}
  if(!Number.isFinite(y2) || y2 < 0 || y2 > 1) {DEFAULT_ERROR_LOGGER(debugString, "y2 to be a number between 0 and 1 (inclusive)", y2); return;}

  const _callback = typeof callback === "function" ? callback : () => {};
  const aX = 1 + 3 * (x1 - x2);
  const aY = 1 + 3 * (y1 - y2);
  const bX = 3 * (x2 - 2 * x1);
  const bY = 3 * (y2 - 2 * y1);
  const cX = 3 * x1;
  const cY = 3 * y1;
  
  function _newtonRapson(x) {
    let prev;
    let t = x;
    do {
      prev = t;
      t -= ((t * (cX + t * (bX + t * aX)) - x) / (cX + t * (2 * bX + 3 * aX * t)));
    } while (Math.abs(t - prev) > 0.001);   //Precision of 1^(-3)

    return t * ( cY + t * ( bY + t * aY )); //This is y given t on the bezier curve (0 <= y <= 1 && 0 <= t <= 1)
  }

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : _newtonRapson(_progress) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
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
    //Force an ease-in pattern for the first initPointsNum control points
    const _initBounceDeltaX = (_bounceDeltaX - _bounceCorrectionDelta) / initPointsNum;
    const _closeToBounceDeltaX = _bounceDeltaX - 2 * _bounceCorrectionDelta;
    for (i = 0; i < _closeToBounceDeltaX; i += _initBounceDeltaX) {
      arrInserter(xs, _bounceXCalc(i),                 arrIndex, arrLen);
      arrInserter(ys,  Math.pow(i * endBouncesNumber, 2), arrIndex, arrLen);
      arrIndex++;
    }
  }

  //Defines the control points of the spline between the first and the last bounce
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

  //Defines the control points of the spline at (1,1)
  arrInserter(xs, 1, arrIndex, arrLen);      
  arrInserter(ys, 1, arrIndex, arrLen);    
}

const EASE_IN_BOUNCE = (duration = 900, callback, bouncesNumber = 3) => {
  if(!Number.isFinite(bouncesNumber) || bouncesNumber <= 0) {DEFAULT_ERROR_LOGGER("EASE_IN_BOUNCE", "bouncesNumber to be a positive number", bouncesNumber); return;}
  
  const _xs = [];
  const _ys = [];
  const _inserter = (arr, el, currI, len) => arr[len - currI - 1] = 1 - el;
  
  _CUSTOM_BOUNCE(_xs, _ys, _inserter, 1, bouncesNumber + 1);
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, "EASE_IN_BOUNCE");
}

const EASE_OUT_BOUNCE = (duration = 900, callback, bouncesNumber = 3) => {
  if(!Number.isFinite(bouncesNumber) || bouncesNumber <= 0) {DEFAULT_ERROR_LOGGER("EASE_OUT_BOUNCE", "bouncesNumber to be a positive number", bouncesNumber); return;}

  const _xs = [];
  const _ys = [];
  const _inserter = (arr, el, currI) => arr[currI] = el;
  
  _CUSTOM_BOUNCE(_xs, _ys, _inserter, 1, bouncesNumber + 1);
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, "EASE_OUT_BOUNCE");
}

const EASE_IN_OUT_BOUNCE = (duration = 1200, callback, bouncesNumber = 6) => {
  if(!Number.isFinite(bouncesNumber) || bouncesNumber <= 1) {DEFAULT_ERROR_LOGGER("EASE_IN_OUT_BOUNCE", "bouncesNumber to be a number >= 2", bouncesNumber); return;}
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
  
  //Force an ease-in-out transition between ease-in-bounce and the ease-out-bounce
  const transitionPoint = _initPointsNum + (_startBouncesNumberEaseOut - 1) * 5 - 3;
  _xs[transitionPoint - 1] = 0.75 * _xs[transitionPoint] + 0.25 * _xs[transitionPoint + 1];
  _xs[transitionPoint]     = 0.25 * _xs[transitionPoint] + 0.75 * _xs[transitionPoint + 1];
  _ys[transitionPoint -1] = 0.47;
  _ys[transitionPoint]    = 0.63;

  //Remove the duplicate definitions of the control points at (1,1)
  _xs.pop(); _xs.pop();
  _ys.pop(); _ys.pop();
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, "EASE_IN_OUT_BOUNCE");
}

const EASE_ELASTIC_X = (forwardEasing, backwardEasing, elasticPointCalculator = () => 50, debounceTime = 0) => {
  if(typeof forwardEasing  !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "the forwardEasing to be a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "the backwardEasing to be a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "the elasticPointCalculator to be a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "the debounceTime to be a number", debounceTime); return;}

  let _currentCallback = null;
  let _originalCallback = null;
  let _scrollCalculator;
  let _debounceTimeout;

  function _init(originalTimestamp, timestamp, container, containerData) {
    _scrollCalculator = forwardEasing;
    
    //Avoid doing any initialization if the container is not actually scrolling
    if(typeof containerData[0] !== "number") return;
    clearTimeout(_debounceTimeout);
    
    _originalCallback = typeof containerData[10] === "function" ? containerData[10] : () => {};
    _currentCallback = () => {
      _debounceTimeout = setTimeout(() => {
        const _currentPos    = uss.getScrollXCalculator(container)();
        const _newDirection  = containerData[4];
        const _elasticAmount = elasticPointCalculator(originalTimestamp, timestamp, _currentPos, _newDirection, container);

        if(!Number.isFinite(_elasticAmount)) {
          DEFAULT_WARNING_LOGGER(_elasticAmount, "is not a valid elastic amount");
          _originalCallback();
          return;
        } 
        if(_elasticAmount === 0) _originalCallback();
        else {
            if(_elasticAmount > 0) _scrollCalculator = backwardEasing; //The backward easing is used only if we change scroll-direction
            uss.scrollXTo(_currentPos - _elasticAmount * _newDirection, container, _originalCallback);
        }
      }, debounceTime);
    }
    
    containerData[10] = _currentCallback;
  }

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    const _containerData = uss._containersData.get(container) || [];
    if(_containerData[10] !== _originalCallback && _containerData[10] !== _currentCallback) _init(originalTimestamp, timestamp, container, _containerData);
    return _scrollCalculator(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);
  }
}

const EASE_ELASTIC_Y = (forwardEasing, backwardEasing, elasticPointCalculator = () => 50, debounceTime = 0) => {
  if(typeof forwardEasing  !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "the forwardEasing to be a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "the backwardEasing to be a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "the elasticPointCalculator to be a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "the debounceTime to be a number", debounceTime); return;}

  let _currentCallback = null;
  let _originalCallback = null;
  let _scrollCalculator;
  let _debounceTimeout;

  function _init(originalTimestamp, timestamp, container, containerData) {
    _scrollCalculator = forwardEasing;
    
    //Avoid doing any initialization if the container is not actually scrolling
    if(typeof containerData[1] !== "number") return;
    clearTimeout(_debounceTimeout);
    
    _originalCallback = typeof containerData[11] === "function" ? containerData[11] : () => {};
    _currentCallback = () => {
      _debounceTimeout = setTimeout(() => {
        const _currentPos    = uss.getScrollYCalculator(container)();
        const _newDirection  = containerData[5];
        const _elasticAmount = elasticPointCalculator(originalTimestamp, timestamp, _currentPos, _newDirection, container);

        if(!Number.isFinite(_elasticAmount)) {
          DEFAULT_WARNING_LOGGER(_elasticAmount, "is not a valid elastic amount");
          _originalCallback();
          return;
        } 
        if(_elasticAmount === 0) _originalCallback();
        else {
            if(_elasticAmount > 0) _scrollCalculator = backwardEasing; //The backward easing is used only if we change scroll-direction
            uss.scrollYTo(_currentPos - _elasticAmount * _newDirection, container, _originalCallback);
        }
      }, debounceTime);
    }
    
    containerData[11] = _currentCallback;
  }

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    const _containerData = uss._containersData.get(container) || [];
    if(_containerData[11] !== _originalCallback && _containerData[11] !== _currentCallback) _init(originalTimestamp, timestamp, container, _containerData);
    return _scrollCalculator(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);
  }
}