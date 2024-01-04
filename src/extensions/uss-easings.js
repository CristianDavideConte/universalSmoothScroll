//TODO: create a website for testing the easing functions + add the links of the easings visualizations into the comments below
//TODO: deprecate EASE_ELASTIC_X and EASE_ELASTIC_Y in favor of the preset-library
//TODO: follow the same spacing styling of common.js
//TODO: order the functions in alphabetical order
//TODO: @ts-check //Use to check for type errors
/**
 * CODE STYLING NOTE:
 * Constans, variables and functions are logically grouped in this file: this helps
 * with organizing code and understanding which variables should be initialized first.
 * The groups are separed by new lines.
 * 
 * New line rules:
 * - 1 newline for entities in the same logical group
 * - 3 newlines between a logical group and another
 */
import {
  FACTORIAL,
  IS_POSITIVE,
  IS_IN_0_1,
} from "../main/math.js"

import {
  CREATE_LOG_OPTIONS,
  IS_FUNCTION,
  DEFAULT_ERROR_PRIMARY_MSG_4,
  DEFAULT_ERROR_PRIMARY_MSG_5,
  DEFAULT_ERROR_PRIMARY_MSG_7,
  DEFAULT_ERROR_PRIMARY_MSG_8
} from "../main/common.js"

import {
  getFramesTime,
  _errorLogger
} from "../main/uss.js"



/**
 * A map containing function names and a partial `options` objects that, 
 * can be used with the uss loggers.
 * Note that these objects (the map entries) are partial and need 
 * to be completed (they only contain known/static log informations). 
 */
const DEFAULT_LOG_OPTIONS = new Map([
  ["CUSTOM_CUBIC_HERMITE_SPLINE", [
    { primaryMsg: "xs" + DEFAULT_ERROR_PRIMARY_MSG_7 },
    { primaryMsg: "ys" + DEFAULT_ERROR_PRIMARY_MSG_7 },
    { primaryMsg: "xs and ys to have the same length" },
    { primaryMsg: "tension" + DEFAULT_ERROR_PRIMARY_MSG_8 },
    { primaryMsg: "duration" + DEFAULT_ERROR_PRIMARY_MSG_4 },
    { primaryMsg: "the numbers in xs to be sorted and unique" },

  ]],
  ["CUSTOM_BEZIER_CURVE", [
    { primaryMsg: "xs" + DEFAULT_ERROR_PRIMARY_MSG_7 },
    { primaryMsg: "ys" + DEFAULT_ERROR_PRIMARY_MSG_7 },
    { primaryMsg: "xs and ys to have the same length" },
    { primaryMsg: "duration" + DEFAULT_ERROR_PRIMARY_MSG_4 },
  ]],
  ["CUSTOM_CUBIC_BEZIER", [
    { primaryMsg: "x1" + DEFAULT_ERROR_PRIMARY_MSG_8 },
    { primaryMsg: "y1" + DEFAULT_ERROR_PRIMARY_MSG_8 },
    { primaryMsg: "x2" + DEFAULT_ERROR_PRIMARY_MSG_8 },
    { primaryMsg: "y2" + DEFAULT_ERROR_PRIMARY_MSG_8 },
    { primaryMsg: "duration" + DEFAULT_ERROR_PRIMARY_MSG_4 },
  ]],
]);



/**
 * Internally used to define and build the standard behavior of a `StepLengthCalculator`.
 * @param {function} easing The `easing pattern` of the scroll-animation. Both its input and output are in [0..1].
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 */
const GET_STEP_LENGTH_CALCULATOR = (easing, duration, callback) => {
  /**
   * The returned stepLengthCalculator can be used by different containers having
   * different starting positions, _startingPosMap is used to keep track of all of them.
   * Note that a starting position can be > 0 if a scroll-animation has been extended but 
   * part of it has already been done.
   */
  const _startingPosMap = new Map();
  const _callback = IS_FUNCTION(callback) ? callback : () => { };

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    let _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration

    if (_progress >= 1) return remaning;
    if (_progress <= 0) {
      /**
       * Since the timestamp === originalTimestamp at the beginning of a scroll-animation,
       * the first step length is always 0.
       * This breaks the scroll-animations on touchpad enabled devices, so the first 
       * elapsed time considered is actually 0.5 * _framesTime.
       */
      _startingPosMap.set(container, 1 - remaning / total);
      _progress = 0.5 * getFramesTime(true) / duration;
    }
    
    /**
     * Note that _nextPos uses (total - 1) so that the scroll-animation duration
     * is strictly followed. Using total instead of (total - 1) will result in shorter durations. 
     */
    const _startingPos = _startingPosMap.get(container);
    const _nextPos = (easing(_progress) * (1 - _startingPos) + _startingPos) * (total - 1);
    const _delta = remaning - total + _nextPos;

    return _delta > 0 ? Math.ceil(_delta) : Math.floor(_delta);
  }
}



/**
 * Internally used by DEFAULT_BOUNCE_CUSTOMIZER.
 * Defines the distribution pattern of the x-coordinates of the control points (same for bounces(mins) and peaks(maxes)).
 * @param {number} x A x-coordinate of a bounce or peak.
 * @returns {number} The eased-version of `x`.
 */
const CALC_BOUNCEX = x => 1 - Math.pow(1 - x, 1.6); //Ease-out-sine pattern

/**
 * Internally used by DEFAULT_BOUNCE_CUSTOMIZER.
 * Defines the distribution pattern of the y-coordinates of the bounce-control-points (mins).
 * @param {number} y A y-coordinate of a bounce.
 * @returns {number} The eased-version of `y`.
 */
const CALC_BOUNCEY = y => y * 0.005 + 0.995; //Almost constant pattern very close to 1

/**
 * Internally used by DEFAULT_BOUNCE_CUSTOMIZER.
 * Defines the distribution pattern of the y-coordinates of the peaks-control-points (maxes).
 * @param {number} y A y-coordinate of a peak.
 * @returns {number} The eased-version of `y`.
 */
const CALC_PEAKY = y => y < 0.6234 ? y * (2 - y) : y * 0.35 + 0.64; //ease-out-sine + linear pattern (from y = 0.6234)

/**
 * Internally used by DEFAULT_BOUNCE_CUSTOMIZER.
 * Number of control points needed for the initial phase of a bounce-type `StepLengthCalculators`.
 */
const CONTROL_POINTS_INIT_NUM = 10;

/**
 * Internally used to setup the control points' arrays for bounce-type `StepLengthCalculators`.
 * @param {number[]} xs An array containing the `x-coordinates` of the `control points`.
 * @param {number[]} ys An array containing the `y-coordinates` of the `control points`.
 * @param {function} arrInserter A function that will insert the passed value into the passed array at the passed index. 
 * @param {number} startBouncesNumber From which bounce should this function start the setup.
 * @param {number} endBouncesNumber At which bounce should this function end the setup.
 */
const DEFAULT_BOUNCE_CUSTOMIZER = (xs, ys, arrInserter, startBouncesNumber, endBouncesNumber) => {
  const _deltaX = 1 / endBouncesNumber; //The non-eased deltaX between two control points
  const _deltaXHalf = _deltaX * 0.5;
  const _deltaXShift = _deltaX * 0.0005; //An infinitesimal shift from the non-eased deltaX
  
  const _arrLen = CONTROL_POINTS_INIT_NUM + (endBouncesNumber - 1) * 5 + 1
  let _arrIndex = 0;

  if (startBouncesNumber !== 1) {
    _arrIndex = CONTROL_POINTS_INIT_NUM + (startBouncesNumber - 1) * 5;
  } else {
    const _deltaXInit = (_deltaX - _deltaXShift) / CONTROL_POINTS_INIT_NUM; //deltaX for the init phase
        
    //Control points at the beginning of the spline (0,0).
    arrInserter(xs, 0, _arrIndex, _arrLen);
    arrInserter(ys, 0, _arrIndex, _arrLen);
    _arrIndex++;

    //From _deltaXInit to _deltaX, CONTROL_POINTS_NUM_INIT control points are inserted with an ease-in pattern.   
    for (let i = startBouncesNumber; i < CONTROL_POINTS_INIT_NUM; i++) {
      const _bounceXNoEasing = _deltaXInit * i;

      arrInserter(xs, CALC_BOUNCEX(_bounceXNoEasing), _arrIndex, _arrLen); //ease-out-sine pattern
      arrInserter(ys, Math.pow(_bounceXNoEasing * endBouncesNumber, 2), _arrIndex, _arrLen); //ease-in pattern
      _arrIndex++;
    }
  }

  //Defines the control points of the spline between the first and the last bounce.
  for (let i = startBouncesNumber; i < endBouncesNumber; i++) {
    const _bounceXNoEasing = _deltaX * i; //_bounceX without the _calcBounceX easing 

    const _bounceX = CALC_BOUNCEX(_bounceXNoEasing);
    const _bounceY = CALC_BOUNCEY(_bounceX);
    const _peakX = CALC_BOUNCEX(_bounceXNoEasing + _deltaXHalf);
    const _peakY = CALC_PEAKY(_peakX);
    const _slopeY = _peakY * 0.65 + _bounceY * 0.35; //The y of a point between the bounce and the peak 

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



/**
 * Creates a `StepLengthCalculator` from the specified [`Cardinal Cubic Hermite Spline`](https://en.wikipedia.org/wiki/Cubic_Hermite_spline) parameters.
 * @param {number[]} xs An ordered array containing the unique `x-coordinates` of the `control points` of the hermite spline.
 * @param {number[]} ys An array containing the `y-coordinates` of the `control points` of the hermite spline.
 * @param {number} tension A number in `[0..1]` which represent the 
 * [`tension`](https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline) of a `Cardinal Cubic Hermite Spline`.
 * The lesser the `tension` value is, the softer the spline will be.
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns A valid `StepLengthCalculator` with the specified easing pattern.
 */
export const CUSTOM_CUBIC_HERMITE_SPLINE = (xs, ys, tension = 0, duration = 500, callback, options) => {
  //Check if xs is an array.
  if (!Array.isArray(xs)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_CUBIC_HERMITE_SPLINE", { secondaryMsg: xs, idx: 0 }, DEFAULT_LOG_OPTIONS));
    return;
  }

  //Check if ys is an array.
  if (!Array.isArray(ys)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_CUBIC_HERMITE_SPLINE", { secondaryMsg: ys, idx: 1 }, DEFAULT_LOG_OPTIONS));
    return;
  }

  //Check if xs and ys have the same number of elements.
  const _xsLen = xs.length;
  if (_xsLen !== ys.length) {
    _errorLogger(
      CREATE_LOG_OPTIONS(
        options,
        "CUSTOM_CUBIC_HERMITE_SPLINE",
        { secondaryMsg: "xs.length = " + _xsLen + " and ys.length = " + ys.length, idx: 2 },
        DEFAULT_LOG_OPTIONS
      )
    );
    return;
  }
  
  //Check if the tension is a number in [0..1].
  if (!IS_IN_0_1(tension)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_CUBIC_HERMITE_SPLINE", { secondaryMsg: tension, idx: 3 }, DEFAULT_LOG_OPTIONS));
    return;
  }

  //Check if the duration is a positive number.
  if (!IS_POSITIVE(duration)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_CUBIC_HERMITE_SPLINE", { secondaryMsg: duration, idx: 4 }, DEFAULT_LOG_OPTIONS));
    return;
  }
  
  //Check if the elements of xs and ys are in [0..1], sorted and unique. 
  for (let i = 0; i < _xsLen; i++) {
    if (!IS_IN_0_1(xs[i])) {
      _errorLogger(
        {
          subject: "CUSTOM_CUBIC_HERMITE_SPLINE",
          primaryMsg: "xs[" + i + "]" + DEFAULT_ERROR_PRIMARY_MSG_8,
          secondaryMsg: xs[i]
        }
      );
      return;
    }

    if (!IS_IN_0_1(ys[i])) {
      _errorLogger(
        {
          subject: "CUSTOM_CUBIC_HERMITE_SPLINE",
          primaryMsg: "ys[" + i + "]" + DEFAULT_ERROR_PRIMARY_MSG_8,
          secondaryMsg: ys[i]
        }
      );
      return;
    }
    
    if (i > 0 && xs[i] <= xs[i - 1]) {
      _errorLogger(
        CREATE_LOG_OPTIONS(
          options,
          "CUSTOM_CUBIC_HERMITE_SPLINE",
          { secondaryMsg: xs[i].toFixed(2) + " (xs[" + i + "]) after " + xs[i - 1].toFixed(2) + " (xs[" + (i - 1) + "])", idx: 5 },
          DEFAULT_LOG_OPTIONS
        )
      );
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

  const _tanCoeff = 1 - tension; // (1 - c)
  const n = xs.length - 1;
  let k = 0; //binary search iteration index

  /**
   * Cubic Hermite-Spline definition:
   * p(x) = h00(t) * p_k   + h10(t) * (x_k+1 - x_k) * m_k + 
   *        h01(t) * p_k+1 + h11(t) * (x_k+1 - x_k) * m_k+1
   * 
   * t = (x - x_k) / (x_k+1 - x_k) on an arbitrary interval (x_k, x_k+1)
   * 
   * Note that consecutive iterations will have similar k, that's why
   * it's defined outside of this function. 
   * 
   * @param {number} x A number in [0..1] indicating the progress of the animation. 
   * @returns The `y` corresponding to the given `x` on the hermite spline.
   */
  function _evalSpline(x) {
    let _binaryMin = 0; //binary search lower bound
    let _binaryMax = n; //binary search upper bound
    let t;

    //Find t corresponding to the given x (binary search).
    //1-6 iterations needed on average.
    do {
      if (x >= xs[k] && x <= xs[k + 1]) {
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
    } while (_binaryMin !== _binaryMax);

    const t_2 = t * t;
    const t_3 = t_2 * t;

    const h_00 = 2 * t_3 - 3 * t_2 + 1;
    const h_10 = t_3 - 2 * t_2 + t;
    const h_01 = -2 * t_3 + 3 * t_2;
    const h_11 = t_3 - t_2;

    const p_k0 = ys[k - 1] || ys[0];
    const p_k1 = ys[k];
    const p_k2 = ys[k + 1];
    const p_k3 = ys[k + 2] || ys[n];

    const x_k0 = xs[k - 1] || xs[0];
    const x_k1 = xs[k];
    const x_k2 = xs[k + 1];
    const x_k3 = xs[k + 2] || xs[n];
    
    // Use the Cardinal Spline m_ks.
    const m_k0 = _tanCoeff * (p_k2 - p_k0) / (x_k2 - x_k0);
    const m_k1 = _tanCoeff * (p_k3 - p_k1) / (x_k3 - x_k1);

    //The y of the Cubic Hermite-Spline at the given x
    return h_00 * p_k1 + h_10 * (x_k2 - x_k1) * m_k0 + h_01 * p_k2 + h_11 * (x_k2 - x_k1) * m_k1;
  }

  return GET_STEP_LENGTH_CALCULATOR(_evalSpline, duration, callback);
}


/**
 * Creates a `StepLengthCalculator` from the specified [`Bezier Curve`](https://en.wikipedia.org/wiki/B%C3%A9zier_curve) parameters.
 * @param {number[]} xs An array containing the `x-coordinates` of the `control points` of the bezier curve.
 * @param {number[]} ys An array containing the `y-coordinates` of the `control points` of the bezier curve.
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns A valid `StepLengthCalculator` with the specified easing pattern.
 */
export const CUSTOM_BEZIER_CURVE = (xs, ys, duration = 500, callback, options) => {
  //Check if xs is an array.
  if (!Array.isArray(xs)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_BEZIER_CURVE", { secondaryMsg: xs, idx: 0 }, DEFAULT_LOG_OPTIONS));
    return;
  }

  //Check if ys is an array.
  if (!Array.isArray(ys)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_BEZIER_CURVE", { secondaryMsg: ys, idx: 1 }, DEFAULT_LOG_OPTIONS));
    return;
  }

  //Check if xs and ys have the same number of elements.
  const _xsLen = xs.length;
  if (_xsLen !== ys.length) {
    _errorLogger(
      CREATE_LOG_OPTIONS(
        options,
        "CUSTOM_BEZIER_CURVE",
        { secondaryMsg: "xs.length = " + _xsLen + " and ys.length = " + ys.length, idx: 2 },
        DEFAULT_LOG_OPTIONS
      )
    );
    return;
  }

  //Check if the duration is a positive number.
  if (!IS_POSITIVE(duration)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_BEZIER_CURVE", { secondaryMsg: duration, idx: 3 }, DEFAULT_LOG_OPTIONS));
    return;
  }

  let _isXDefinedAt0 = false;
  let _isXDefinedAt1 = false;

  //Check if the elements of xs and ys are in [0..1]. 
  for (let i = 0; i < _xsLen; i++) {
    if (!IS_IN_0_1(xs[i])) {
      _errorLogger(
        {
          subject: "CUSTOM_CUBIC_HERMITE_SPLINE",
          primaryMsg: "xs[" + i + "]" + DEFAULT_ERROR_PRIMARY_MSG_8,
          secondaryMsg: xs[i]
        }
      );
      return;
    }

    if (!IS_IN_0_1(ys[i])) {
      _errorLogger(
        {
          subject: "CUSTOM_CUBIC_HERMITE_SPLINE",
          primaryMsg: "ys[" + i + "]" + DEFAULT_ERROR_PRIMARY_MSG_8,
          secondaryMsg: ys[i]
        }
      );
      return;
    }
    
    if (!_isXDefinedAt0) _isXDefinedAt0 = xs[i] === 0;
    if (!_isXDefinedAt1) _isXDefinedAt1 = xs[i] === 1;
  }

  //The control points must be defined at x === 0.
  if (!_isXDefinedAt0) {
    xs.unshift(0);
    ys.unshift(0);
  }

  //The control points must be defined at x === 1.
  if (!_isXDefinedAt1) {
    xs.push(1);
    ys.push(1);
  }

  const n = xs.length - 1;
  const _nFact = FACTORIAL(n);
  const _binomialCoeff = [];
  
  //Precalculate the binomial coefficients used in B(t) and B'(t).
  for (let i = 0; i <= n; i++) {
    _binomialCoeff[i] = _nFact / (FACTORIAL(i) * FACTORIAL(n - i));
  }

  //Returns B'(t): the 1st-order derivative of B(t).
  function _derivativeBt(t) {
    let _derivativeBt = 0;
    for(let i = 0; i <= n; i++) {
      _derivativeBt += _binomialCoeff[i] * xs[i] * Math.pow(1 - t, n - i - 1) * Math.pow(t, i - 1) * (i - n * t) ;
    }
    return _derivativeBt;
  }

  //Returns B(t): the parametric form of a n-th degree bezier curve.
  function _getBt(arr, t) {
    let _Bt = 0;
    for (let i = 0; i <= n; i++) {
      _Bt += _binomialCoeff[i] * arr[i] * Math.pow(1 - t, n - i) * Math.pow(t, i);
    }
    return _Bt;
  }

  /**
   * Given a B(t) (Bernstein Polynomial) and a value of t, a point (x,y) on the bezier curve can be obtained.
   * In this case, only the x is given, so the t must be calculated and then used to get the y of the bezier curve.
   * 
   * Note that consecutive iterations will have similar t, that's why
   * _prev is defined outside of this function.
   * 
   * @param {number} x The `x` coordinate of a point on the bezier curve. 
   * @returns The `y` corresponding to the given `x` on the bezier curve.
   */
  let _prev = 1;
  function _newtonRapson(x) {
    let t = _prev < x ? _prev : x;

    do {
      _prev = t;
      t -= (_getBt(xs, t) - x) / _derivativeBt(t);
    } while (Math.abs(t - _prev) > 0.001); //Precision of 1^(-3)

    //The y given t on the bezier curve.
    return _getBt(ys, t);
  }

  return GET_STEP_LENGTH_CALCULATOR(_newtonRapson, duration, callback);
}

/**
 * Creates a `StepLengthCalculator` from the specified [`Cubic Bezier Curve`](https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves) parameters.
 * 
 * Note that the first and last control point of this curve are fixed at `(0,0)` and `(1,1)`.
 * @param {number} x1 The `x-coordinate` of the `second control point` of the bezier curve.
 * @param {number} y1 The `y-coordinate` of the `second control point` of the bezier curve.
 * @param {number} x2 The `x-coordinate` of the `third control point` of the bezier curve.
 * @param {number} y2 The `y-coordinate` of the `third control point` of the bezier curve.
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns A valid `StepLengthCalculator` with the specified easing pattern.
 */
export const CUSTOM_CUBIC_BEZIER = (x1 = 0, y1 = 0, x2 = 1, y2 = 1, duration = 500, callback, options) => {
  //Check if x1 is a number in [0..1].
  if (!IS_IN_0_1(x1)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_CUBIC_BEZIER", { secondaryMsg: x1, idx: 0 }, DEFAULT_LOG_OPTIONS));
    return;
  }
  
  //Check if y1 is a number in [0..1].
  if (!IS_IN_0_1(y1)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_CUBIC_BEZIER", { secondaryMsg: y1, idx: 1 }, DEFAULT_LOG_OPTIONS));
    return;
  }
  
  //Check if x2 is a number in [0..1].
  if (!IS_IN_0_1(x2)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_CUBIC_BEZIER", { secondaryMsg: x2, idx: 2 }, DEFAULT_LOG_OPTIONS));
    return;
  }
  
  //Check if y2 is a number in [0..1].
  if (!IS_IN_0_1(y2)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_CUBIC_BEZIER", { secondaryMsg: y2, idx: 3 }, DEFAULT_LOG_OPTIONS));
    return;
  }

  //Check if the duration is a positive number.
  if (!IS_POSITIVE(duration)) {
    _errorLogger(CREATE_LOG_OPTIONS(options, "CUSTOM_CUBIC_BEZIER", { secondaryMsg: duration, idx: 4 }, DEFAULT_LOG_OPTIONS));
    return;
  }

  const aX = 1 + 3 * (x1 - x2);
  const aY = 1 + 3 * (y1 - y2);
  const bX = 3 * (x2 - 2 * x1);
  const bY = 3 * (y2 - 2 * y1);
  const cX = 3 * x1;
  const cY = 3 * y1;
  
  /**
   * Given a B(t) (Bernstein Polynomial) and a value of t, a point (x,y) on the bezier curve can be obtained.
   * In this case, only the x is given, so the t must be calculated and then used to get the y of the bezier curve.
   * 
   * Note that consecutive iterations will have similar t, that's why
   * _prev is defined outside of this function.
   *  
   * @param {number} x The `x` coordinate of a point on the bezier curve. 
   * @returns The `y` corresponding to the given `x` on the bezier curve.
   */
  let _prev = 1;
  function _newtonRapson(x) {
    let t = _prev < x ? _prev : x;

    // 1-5 iterations needed on average.
    do {
      _prev = t;
      t -= ((t * (cX + t * (bX + t * aX)) - x) / (cX + t * (2 * bX + 3 * aX * t)));
    } while (Math.abs(t - _prev) > 0.001); //Precision of 1e-3

    //The y given t on the bezier curve.
    return t * (cY + t * (bY + t * aY));
  }

  return GET_STEP_LENGTH_CALCULATOR(_newtonRapson, duration, callback);
}



/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows a [`linear easing pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with a `linear easing pattern`.
 */
export const EASE_LINEAR = (duration, callback) => CUSTOM_CUBIC_BEZIER(0, 0, 1, 1, duration, callback, { subject: "EASE_LINEAR" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-sine pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-sine pattern`.
 */
export const EASE_IN_SINE = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.12, 0, 0.39, 0, duration, callback, { subject: "EASE_IN_SINE" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-quad pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-quad pattern`.
 */
export const EASE_IN_QUAD = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.11, 0, 0.5, 0, duration, callback, { subject: "EASE_IN_QUAD" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-cubic pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-cubic pattern`.
 */
export const EASE_IN_CUBIC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.32, 0, 0.67, 0, duration, callback, { subject: "EASE_IN_CUBIC" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-quart pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-quart pattern`.
 */
export const EASE_IN_QUART = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.5, 0, 0.75, 0, duration, callback, { subject: "EASE_IN_QUART" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-quint pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-quint pattern`.
 */
export const EASE_IN_QUINT = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.64, 0, 0.78, 0, duration, callback, { subject: "EASE_IN_QUINT" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-expo pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-expo pattern`.
 */

export const EASE_IN_EXPO = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.7, 0, 0.84, 0, duration, callback, { subject: "EASE_IN_EXPO" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-circ pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-circ pattern`.
 */
export const EASE_IN_CIRC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.55, 0, 1, 0.45, duration, callback, { subject: "EASE_IN_CIRC" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-out-sine pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-out-sine pattern`.
 */
export const EASE_OUT_SINE = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.61, 1, 0.88, 1, duration, callback, { subject: "EASE_OUT_SINE" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-out-quad pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-out-quad pattern`.
 */
export const EASE_OUT_QUAD = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.5, 1, 0.89, 1, duration, callback, { subject: "EASE_OUT_QUAD" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-out-cubic pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-out-cubic pattern`.
 */
export const EASE_OUT_CUBIC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.33, 1, 0.68, 1, duration, callback, { subject: "EASE_OUT_CUBIC" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-out-quart pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-out-quart pattern`.
 */
export const EASE_OUT_QUART = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.25, 1, 0.5, 1, duration, callback, { subject: "EASE_OUT_QUART" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-out-quint pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-out-quint pattern`.
 */
export const EASE_OUT_QUINT = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.22, 1, 0.36, 1, duration, callback, { subject: "EASE_OUT_QUINT" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-out-expo pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-out-expo pattern`.
 */
export const EASE_OUT_EXPO = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.16, 1, 0.3, 1, duration, callback, { subject: "EASE_OUT_EXPO" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-out-circ pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-out-circ pattern`.
 */
export const EASE_OUT_CIRC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0, 0.55, 0.45, 1, duration, callback, { subject: "EASE_OUT_CIRC" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-out-sine pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-out-sine pattern`.
 */
export const EASE_IN_OUT_SINE = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.37, 0, 0.63, 1, duration, callback, { subject: "EASE_IN_OUT_SINE" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-out-quad pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-out-quad pattern`.
 */
export const EASE_IN_OUT_QUAD = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.45, 0, 0.55, 1, duration, callback, { subject: "EASE_IN_OUT_QUAD" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-out-cubic pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-out-cubic pattern`.
 */
export const EASE_IN_OUT_CUBIC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.65, 0, 0.35, 1, duration, callback, { subject: "EASE_IN_OUT_CUBIC" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-out-quart pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-out-quart pattern`.
 */
export const EASE_IN_OUT_QUART = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.76, 0, 0.24, 1, duration, callback, { subject: "EASE_IN_OUT_QUART" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-out-quint pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-out-quint pattern`.
 */
export const EASE_IN_OUT_QUINT = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.83, 0, 0.17, 1, duration, callback, { subject: "EASE_IN_OUT_QUINT" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-out-expo pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-out-expo pattern`.
 */
export const EASE_IN_OUT_EXPO = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.87, 0, 0.13, 1, duration, callback, { subject: "EASE_IN_OUT_EXPO" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-out-circ pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-out-circ pattern`.
 */
export const EASE_IN_OUT_CIRC = (duration, callback) => CUSTOM_CUBIC_BEZIER(0.85, 0, 0.15, 1, duration, callback, { subject: "EASE_IN_OUT_CIRC" });

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-bounce pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {number} bouncesNumber The number of `bounces` at the start of the scroll-animation.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-bounce pattern`.
 */
export const EASE_IN_BOUNCE = (duration = 900, bouncesNumber = 3, callback) => {
  //Check if the bouncesNumber is a positive number.
  if (!IS_POSITIVE(bouncesNumber)) {
    _errorLogger(
      {
        subject: "EASE_IN_BOUNCE",
        primaryMsg: "bouncesNumber" + DEFAULT_ERROR_PRIMARY_MSG_4,
        secondaryMsg: bouncesNumber
      }
    );
    return;
  }
  
  const _xs = [];
  const _ys = [];
  const _inserter = (arr, el, currI, len) => arr[len - currI - 1] = 1 - el;
  
  DEFAULT_BOUNCE_CUSTOMIZER(_xs, _ys, _inserter, 1, bouncesNumber + 1);
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, { subject: "EASE_IN_BOUNCE" });
}

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-out-bounce pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {number} bouncesNumber The number of `bounces` at the end of the scroll-animation.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-out-bounce pattern`.
 */
export const EASE_OUT_BOUNCE = (duration = 900, bouncesNumber = 3, callback) => {
  //Check if the bouncesNumber is a positive number.
  if (!IS_POSITIVE(bouncesNumber)) {
    _errorLogger(
      {
        subject: "EASE_OUT_BOUNCE",
        primaryMsg: "bouncesNumber" + DEFAULT_ERROR_PRIMARY_MSG_4,
        secondaryMsg: bouncesNumber
      }
    );
    return;
  }

  const _xs = [];
  const _ys = [];
  const _inserter = (arr, el, currI) => arr[currI] = el;
  
  DEFAULT_BOUNCE_CUSTOMIZER(_xs, _ys, _inserter, 1, bouncesNumber + 1);
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, { subject: "EASE_OUT_BOUNCE" });
}

/**
 * Creates a `StepLengthCalculator` with that makes the scroll-animation last `duration` ms 
 * and that follows an [`ease-in-out-bounce pattern`]().
 * @param {number} duration The total amount of `milliseconds` the scroll-animation should last.
 * @param {number} bouncesNumber The total number of `bounces` both at start and end of the scroll-animation.
 * @param {function} callback A `function` that is executed every time the returned `StepLengthCalculator` is invoked.
 * @returns A valid `StepLengthCalculator` with an `ease-in-out-bounce pattern`.
 */
export const EASE_IN_OUT_BOUNCE = (duration = 1200, bouncesNumber = 6, callback) => {
  //Check if the bouncesNumber >= 2.
  if (!Number.isFinite(bouncesNumber) || bouncesNumber <= 1) {
    _errorLogger(
      {
        subject: "EASE_IN_OUT_BOUNCE",
        primaryMsg: "bouncesNumber" + DEFAULT_ERROR_PRIMARY_MSG_5 + " >= 2",
        secondaryMsg: bouncesNumber
      }
    );
    return;
  }

  if (bouncesNumber === 2) {
    return CUSTOM_CUBIC_HERMITE_SPLINE(
      [0, 0.04, 0.14, 0.24, 0.3000, 0.3001, 0.40, 0.60, 0.7000, 0.7001, 0.76, 0.86, 0.96, 1],
      [0, 0.07, 0.13, 0.07, 0.0001, 0.0001, 0.46, 0.64, 0.9999, 0.9999, 0.93, 0.87, 0.93, 1],
      0, duration, callback, { subject: "EASE_IN_OUT_BOUNCE" }
    );
  }

  const _xs = [];
  const _ys = [];
  const _initPointsNum = 10;
  const _startBouncesNumberEaseIn = Math.max(Math.floor(0.5 * (bouncesNumber - 1)), 1);
  const _startBouncesNumberEaseOut = Math.max(Math.floor(0.5 * bouncesNumber), 2);

  const _inserterEaseIn = (arr, el, currI, len) => arr[len - currI - 1] = 1 - el;
  const _inserterEaseOut = (arr, el, currI) => arr[currI - 2] = el;
                                       
  DEFAULT_BOUNCE_CUSTOMIZER(_xs, _ys, _inserterEaseIn, _startBouncesNumberEaseIn, bouncesNumber);
  DEFAULT_BOUNCE_CUSTOMIZER(_xs, _ys, _inserterEaseOut, _startBouncesNumberEaseOut, bouncesNumber);
  
  //Force an ease-in-out transition between ease-in-bounce and the ease-out-bounce.
  const _transitionPoint = _initPointsNum + (_startBouncesNumberEaseOut - 1) * 5 - 3;
  _xs[_transitionPoint - 1] = 0.75 * _xs[_transitionPoint] + 0.25 * _xs[_transitionPoint + 1];
  _xs[_transitionPoint] = 0.25 * _xs[_transitionPoint] + 0.75 * _xs[_transitionPoint + 1];
  _ys[_transitionPoint - 1] = 0.47;
  _ys[_transitionPoint] = 0.63;

  //Remove the duplicate definitions of the control points at (1,1).
  _xs.pop(); _xs.pop();
  _ys.pop(); _ys.pop();
  
  return CUSTOM_CUBIC_HERMITE_SPLINE(_xs, _ys, 0, duration, callback, { subject: "EASE_IN_OUT_BOUNCE" });
}











//TODO: decide what to do with these
/**
export const EASE_ELASTIC_X = (forwardEasing, backwardEasing, elasticPointCalculator = () => 50, debounceTime = 0) => {
  if(typeof forwardEasing  !== "function") {_errorLogger("EASE_ELASTIC_X", "the forwardEasing to be a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {_errorLogger("EASE_ELASTIC_X", "the backwardEasing to be a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {_errorLogger("EASE_ELASTIC_X", "the elasticPointCalculator to be a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {_errorLogger("EASE_ELASTIC_X", "the debounceTime to be a number", debounceTime); return;}

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
        //TODO: use IS_WINDOW()
        const _currentPos    = container === window ? container.scrollX : container.scrollLeft;
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
  if(typeof forwardEasing  !== "function") {_errorLogger("EASE_ELASTIC_Y", "the forwardEasing to be a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {_errorLogger("EASE_ELASTIC_Y", "the backwardEasing to be a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {_errorLogger("EASE_ELASTIC_Y", "the elasticPointCalculator to be a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {_errorLogger("EASE_ELASTIC_Y", "the debounceTime to be a number", debounceTime); return;}

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
        //TODO: use IS_WINDOW()
        const _currentPos    = container === window ? container.scrollY : container.scrollTop;
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
*/
