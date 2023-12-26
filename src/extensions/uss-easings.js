//TODO: use the new error/warning loggers
//TODO: add comments above the functions
//TODO: use the DEFAULT_LOG_OPTIONS map to store the errors and warnings
//TODO: use the math.js library to group some math patterns
//TODO: deprecate EASE_ELASTIC_X and EASE_ELASTIC_Y in favor of the preset-library
//TODO: create a default error message for numbers in [0..1] in the common.js file
//TODO: import only the variables/functions used by this module instead of everything.
//TODO: use the new variable naming convention

import {
  FACTORIAL,
  IS_POSITIVE,
  IS_IN_0_1,
} from "../main/math.js"

import * as uss from "../main/uss.js";

/**
 * Internally used to define the standard behavior of a stepLengthCalculator.
 * The progressEvaluator function defines at which % of the total duration the scroll-animation is at.
 * The duration is the total amount of milliseconds the scroll-animation should last.
 * The callback is a function that is executed every time the returned stepLengthCalculator is invoked.  
 * 
 * TODO: add parameters related comments
 */
//TODO: instead of (total - 1) Math.round and Math.floor could be used depending on the initial value of total
const DEFAULT_STEP_LENGTH_CALCULATOR = (progressEvaluator, duration, callback) => {
  /**
   * The returned stepLengthCalculator can be used by different containers having
   * different starting positions, _startingPosMap is used to keep track of all of them.
   * Note that a starting position can be > 0 if a scroll-animation has been extended but 
   * part of it has already been done.
   */
  const _startingPosMap = new Map();
  const _callback = typeof callback === "function" ? callback : () => { };

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    let _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration

    if (_progress >= 1) return remaning;
    if (_progress <= 0) {
      /**
       * Since the timestamp === originalTimestamp at the beginning of a scroll-animation,
       * the first step length is always 0.
       * This breaks the scroll-animations on touchpad enabled devices, so the first 
       * elapsed time considered is actually 0.5 * uss._framesTime.
       */
      _startingPosMap.set(container, 1 - remaning / total);
      _progress = 0.5 * uss.getFramesTime(true) / duration;
    }
    
    const _startingPos = _startingPosMap.get(container);
    const _nextPos = (progressEvaluator(_progress) * (1 - _startingPos) + _startingPos) * (total - 1);
    const _delta = remaning - total + _nextPos;

    return _delta > 0 ? Math.ceil(_delta) : Math.floor(_delta);
  }
}

/**
 * TODO: separate into 3 comments
 * All the constants below are internally used by DEFAULT_BOUNCE_CUSTOMIZER. 
 * CALC_BOUNCEX: defines the pattern of the x-coordinates of the control points (same for bounces(mins) and peaks(maxes))
 * CALC_BOUNCEY: defines the pattern of the y-coordinates of the bounce(mins) control points
 * CALC_PEAKY: defines the pattern of the y-coordinates of the peaks(maxes) control points
 */
const CALC_BOUNCEX = x => 1 - Math.pow(1 - x, 1.6); //ease-out-sine pattern
const CALC_BOUNCEY = x => x * 0.005 + 0.995; //almost constant pattern very close to 1
const CALC_PEAKY   = x => x < 0.6234 ? x * (2 - x) : x * 0.35 + 0.64; //ease-out-sine then linear patter (they meet at 0.6234)
const CONTROL_POINTS_INIT_NUM = 10;

/**
 * Internally used to setup the control points' arrays for bounce-type `StepLengthCalculators`.
 * 
 * TODO: finish this
 * @param {*} xs 
 * @param {*} ys 
 * @param {*} arrInserter 
 * @param {*} startBouncesNumber 
 * @param {*} endBouncesNumber 
 */
const DEFAULT_BOUNCE_CUSTOMIZER = (xs, ys, arrInserter, startBouncesNumber, endBouncesNumber) => {
  const _deltaX = 1 / endBouncesNumber; //the non-eased deltaX between two control points
  const _deltaXHalf = _deltaX * 0.5; 
  const _deltaXShift = _deltaX * 0.0005; //an infinitesimal shift from the non-eased deltaX
  
  const _arrLen = CONTROL_POINTS_INIT_NUM + (endBouncesNumber - 1) * 5 + 1 
  let _arrIndex = 0;

  if(startBouncesNumber !== 1) {
    _arrIndex = CONTROL_POINTS_INIT_NUM + (startBouncesNumber - 1) * 5;
  } else {
    const _deltaXInit = (_deltaX - _deltaXShift) / CONTROL_POINTS_INIT_NUM; //deltaX for the init phase
        
    //Control points at the beginning of the spline (0,0).
    arrInserter(xs, 0, _arrIndex, _arrLen);
    arrInserter(ys, 0, _arrIndex, _arrLen);
    _arrIndex++;

    //From _deltaXInit to _deltaX, CONTROL_POINTS_NUM_INIT control points are inserted with an ease-in pattern.   
    for(let i = startBouncesNumber; i < CONTROL_POINTS_INIT_NUM; i++) {
      const _bounceXNoEasing = _deltaXInit * i;

      arrInserter(xs, CALC_BOUNCEX(_bounceXNoEasing), _arrIndex, _arrLen); //ease-out-sine pattern
      arrInserter(ys, Math.pow(_bounceXNoEasing * endBouncesNumber, 2), _arrIndex, _arrLen); //ease-in pattern
      _arrIndex++;
    }
  }

  //Defines the control points of the spline between the first and the last bounce.
  for(let i = startBouncesNumber; i < endBouncesNumber; i++) {
    const _bounceXNoEasing = _deltaX * i; //_bounceX without the _calcBounceX easing 

    const _bounceX = CALC_BOUNCEX(_bounceXNoEasing);
    const _bounceY = CALC_BOUNCEY(_bounceX);
    const _peakX   = CALC_BOUNCEX(_bounceXNoEasing + _deltaXHalf);
    const _peakY   = CALC_PEAKY(_peakX);
    const _slopeY  = _peakY * 0.65 + _bounceY * 0.35; //the y of a point between the bounce and the peak 

    //Insert a bounce control point.
    arrInserter(xs, _bounceX, _arrIndex, _arrLen);
    arrInserter(ys, _bounceY, _arrIndex, _arrLen);

    //Insert a control point very close to the bounce one just inserted (hermite spline approximation purposes).
    arrInserter(xs, CALC_BOUNCEX(_bounceXNoEasing + _deltaXShift), _arrIndex + 1, _arrLen);
    arrInserter(ys, _bounceY, _arrIndex + 1, _arrLen); 

    //Insert a control point slighly before the next peak control point (hermite spline approximation purposes).
    arrInserter(xs, CALC_BOUNCEX(_bounceXNoEasing + _deltaXHalf * 0.35), _arrIndex + 2, _arrLen);
    arrInserter(ys, _slopeY, _arrIndex + 2, _arrLen);

    //Instert a peak control point.
    arrInserter(xs, _peakX, _arrIndex + 3, _arrLen);
    arrInserter(ys, _peakY, _arrIndex + 3, _arrLen);

    //Insert a control point slighly after the next peak control point (hermite spline approximation purposes).
    arrInserter(xs, CALC_BOUNCEX(_bounceXNoEasing + _deltaXHalf * 1.65), _arrIndex + 4, _arrLen);
    arrInserter(ys, _slopeY, _arrIndex + 4, _arrLen);
    
    _arrIndex += 5;
  }

  //Control points at the end of the spline (1,1).
  arrInserter(xs, 1, _arrIndex, _arrLen);      
  arrInserter(ys, 1, _arrIndex, _arrLen);    
}

//TODO: in the docs, specify that this is a cubic hermite "cardinal" spline (https://en.wikipedia.org/wiki/Cubic_Hermite_spline).
export const CUSTOM_CUBIC_HERMITE_SPLINE = (xs, ys, tension = 0, duration = 500, callback, options = {debugString: "CUSTOM_CUBIC_HERMITE_SPLINE"}) => {
  //Check if xs is an array.
  if (!Array.isArray(xs)) {
    uss._errorLogger(options.debugString, "xs to be an array", xs);
    return;
  }

  //Check if ys is an array.
  if (!Array.isArray(ys)) {
    uss._errorLogger(options.debugString, "ys to be an array", ys);
    return;
  }

  //Check if xs and ys have the same number of elements.
  const _xsLen = xs.length;
  if (_xsLen !== ys.length) {
    uss._errorLogger(options.debugString, "xs and ys to have the same length", "xs.length = " + _xsLen + " and ys.length = " + ys.length);
    return;
  }
  
  //Check if the tension is a number in [0..1].
  if (!IS_IN_0_1(tension)) {
    uss._errorLogger(options.debugString, "tension to be a number between 0 and 1 (inclusive)", tension);
    return;
  }

  //Check if the duration is a positive number.
  if (!IS_POSITIVE(duration)) {
    uss._errorLogger(options.debugString, "the duration to be a positive number", duration);
    return;
  }
  
  //Check if the elements of xs and ys are in [0..1], sorted and unique. 
  for(let i = 0; i < _xsLen; i++) {
    if (!IS_IN_0_1(xs[i])) {
      uss._errorLogger(options.debugString, "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]);
      return;
    }

    if (!IS_IN_0_1(ys[i])) {
      uss._errorLogger(options.debugString, "ys[" + i + "] to be a number between 0 and 1 (inclusive)", ys[i]);
      return;
    }
    
    if (i > 0 && xs[i] <= xs[i - 1]) {
      uss._errorLogger(options.debugString, "the numbers in xs to be sorted and unique", xs[i].toFixed(2) + " (xs[" + i + "]) after " + xs[i - 1].toFixed(2) + " (xs[" + (i - 1) + "])");
      return;
    }
  } 

  //The control points must be defined at x === 0.
  if (xs[0] !== 0) {
    xs.unshift(0);
    ys.unshift(0);
  }

  //The control points must be defined at x === 1.
  if (xs[_xsLen - 1] !== 1) {
    xs.push(1);
    ys.push(1);
  }

  const tan_coeff = 1 - tension; // (1 - c)
  const n = xs.length - 1;
  const nHalf = Math.round(n * 0.5);
  
  /**
   * Cubic Hermite-Spline definition:
   * p(x) = h00(t) * p_k   + h10(t) * (x_k+1 - x_k) * m_k + 
   *        h01(t) * p_k+1 + h11(t) * (x_k+1 - x_k) * m_k+1
   * 
   * @param {number} x A number in [0..1] indicating the progress of the animation. 
   * @returns 
   */
  function _evalSpline(x) {
    let _binaryMin = 0; //binary search lower bound
    let _binaryMax = n; //binary search upper bound
    let k = nHalf;      //binary search iteration index
    let t; 
    
    //Find t corresponding to the given x (binary search).
    do {
      if(x >= xs[k] && x <= xs[k + 1]) {
        t = (x - xs[k]) / (xs[k + 1] - xs[k]); //t of the given x
        break;
      }
      if (xs[k] > x) {
        _binaryMax = k;
        k = Math.floor((_binaryMin + k) / 2);
      } else {
        _binaryMin = k;
        k = Math.floor((_binaryMax + k) / 2);
      }
    } while(_binaryMin !== _binaryMax);    

    const t_2 = t * t;
    const t_3 = t_2 * t;

    const h_00 =  2 * t_3 - 3 * t_2 +    1;
    const h_10 =      t_3 - 2 * t_2 + t;
    const h_01 = -2 * t_3 + 3 * t_2;
    const h_11 =      t_3 -     t_2;

    const p_k0 = ys[k - 1] || ys[0];
    const p_k1 = ys[k];
    const p_k2 = ys[k + 1];
    const p_k3 = ys[k + 2] || ys[n];

    const x_k0 = xs[k - 1] || xs[0];
    const x_k1 = xs[k];
    const x_k2 = xs[k + 1];
    const x_k3 = xs[k + 2] || xs[n];
    
    // Use the Cardinal Spline m_ks.
    const m_k0 = tan_coeff * (p_k2 - p_k0) / (x_k2 - x_k0); 
    const m_k1 = tan_coeff * (p_k3 - p_k1) / (x_k3 - x_k1); 

    //The y of the Cubic Hermite-Spline at the given x
    return h_00 * p_k1 + h_10 * (x_k2 - x_k1) * m_k0 + h_01 * p_k2 + h_11 * (x_k2 - x_k1) * m_k1; 
  }

  return DEFAULT_STEP_LENGTH_CALCULATOR(_evalSpline, duration, callback);
}

export const CUSTOM_BEZIER_CURVE = (xs, ys, duration = 500, callback, options = {debugString: "CUSTOM_BEZIER_CURVE"}) => {
  //Check if xs is an array.
  if (!Array.isArray(xs)) {
    uss._errorLogger(options.debugString, "xs to be an array", xs);
    return;
  }

  //Check if ys is an array.
  if (!Array.isArray(ys)) {
    uss._errorLogger(options.debugString, "ys to be an array", ys);
    return;
  }

  //Check if xs and ys have the same number of elements.
  const _xsLen = xs.length;
  if (_xsLen !== ys.length) {
    uss._errorLogger(options.debugString, "xs and ys to have the same length", "xs.length = " + _xsLen + " and ys.length = " + ys.length);
    return;
  }

  //Check if the duration is a positive number.
  if (!IS_POSITIVE(duration)) {
    uss._errorLogger(options.debugString, "the duration to be a positive number", duration);
    return;
  }

  let _isXDefinedIn0 = false;
  let _isXDefinedIn1 = false;

  //Check if the elements of xs and ys are in [0..1]. 
  for (let i = 0; i < _xsLen; i++) {
    if (!IS_IN_0_1(xs[i])) {
      uss._errorLogger(options.debugString, "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]);
      return;
    }

    if (!IS_IN_0_1(ys[i])) {
      uss._errorLogger(options.debugString, "ys[" + i + "] to be a number between 0 and 1 (inclusive)", ys[i]);
      return;
    }
    
    if (!_isXDefinedIn0) _isXDefinedIn0 = xs[i] === 0; 
    if (!_isXDefinedIn1) _isXDefinedIn1 = xs[i] === 1;
  }

  //The control points must be defined at x === 0.
  if (!_isXDefinedIn0) {
    xs.unshift(0);
    ys.unshift(0);
  }

  //The control points must be defined at x === 1.
  if (!_isXDefinedIn1) {
    xs.push(1);
    ys.push(1);
  }

  const n = xs.length - 1;
  const nFact = FACTORIAL(n);

  //Returns B'(t): the first derivative of B(t).
  function _derivativeBt(t) {
    let _derivativeBt = 0;
    for(let i = 0; i <= n; i++) {
      _derivativeBt += nFact / (FACTORIAL(i) * FACTORIAL(n - i)) * xs[i] * Math.pow(1 - t, n - i - 1) * Math.pow(t, i - 1) * (i - n * t) ;
    }
    return _derivativeBt;
  }

  //Returns B(t): the parametric form of a n-th degree bezier curve.
  function _getBt(arr, t) {
    let _Bt = 0;
    for (let i = 0; i <= n; i++) {
      _Bt += nFact / (FACTORIAL(i) * FACTORIAL(n - i)) * arr[i] * Math.pow(1 - t, n - i) * Math.pow(t, i);      
    }
    return _Bt;
  }

  function _newtonRapson(x) {
    let _prev;
    let t = x;
    do {
      _prev = t;
      t -= (_getBt(xs, t) - x) / _derivativeBt(t);
    } while (Math.abs(t - _prev) > 0.001); //Precision of 1^(-3)
   
    return _getBt(ys, t);
  }

  return DEFAULT_STEP_LENGTH_CALCULATOR(_newtonRapson, duration, callback);
}

export const CUSTOM_CUBIC_BEZIER = (x1 = 0, y1 = 0, x2 = 1, y2 = 1, duration = 500, callback, options = {debugString: "CUSTOM_CUBIC_BEZIER"}) => {
  if (!IS_IN_0_1(x1)) {uss._errorLogger(options.debugString, "x1 to be a number between 0 and 1 (inclusive)", x1); return;}
  if (!IS_IN_0_1(y1)) {uss._errorLogger(options.debugString, "y1 to be a number between 0 and 1 (inclusive)", y1); return;}
  if (!IS_IN_0_1(x2)) {uss._errorLogger(options.debugString, "x2 to be a number between 0 and 1 (inclusive)", x2); return;}
  if (!IS_IN_0_1(y2)) {uss._errorLogger(options.debugString, "y2 to be a number between 0 and 1 (inclusive)", y2); return;}
  if (!IS_POSITIVE(duration)) {uss._errorLogger(options.debugString, "the duration to be a positive number", duration); return;}

  const aX = 1 + 3 * (x1 - x2);
  const aY = 1 + 3 * (y1 - y2);
  const bX = 3 * (x2 - 2 * x1);
  const bY = 3 * (y2 - 2 * y1);
  const cX = 3 * x1;
  const cY = 3 * y1;
  
  function _newtonRapson(x) {
    let _prev;
    let t = x;
    do {
      _prev = t;
      t -= ((t * (cX + t * (bX + t * aX)) - x) / (cX + t * (2 * bX + 3 * aX * t)));
    } while (Math.abs(t - _prev) > 0.001); //Precision of 1^(-3)

    //The y given t on the bezier curve (0 <= y <= 1 && 0 <= t <= 1)
    return t * ( cY + t * ( bY + t * aY )); 
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
  if (!IS_POSITIVE(bouncesNumber)) {
    uss._errorLogger("EASE_IN_BOUNCE", "bouncesNumber to be a positive number", bouncesNumber);
    return;
  }
  
  const _xs = [];
  const _ys = [];
  const _inserter = (arr, el, currI, len) => arr[len - currI - 1] = 1 - el;
  
  DEFAULT_BOUNCE_CUSTOMIZER(_xs, _ys, _inserter, 1, bouncesNumber + 1);
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, {debugString: "EASE_IN_BOUNCE"});
}

export const EASE_OUT_BOUNCE = (duration = 900, callback, bouncesNumber = 3) => {
  if (!IS_POSITIVE(bouncesNumber)) {
    uss._errorLogger("EASE_OUT_BOUNCE", "bouncesNumber to be a positive number", bouncesNumber);
    return;
  }

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