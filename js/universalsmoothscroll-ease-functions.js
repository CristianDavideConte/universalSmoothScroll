"use strict";

        var canvas = document.getElementById("myCanvas");
        canvas.style.borderRight="10px solid black";
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var ctx = canvas.getContext("2d");
        var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);


const CUSTOM_CUBIC_SPLINE = (xs, ys, duration = 500, callback, debugString = "CUSTOM_CUBIC_SPLINE") => {
  if(!Array.isArray(xs)) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_SPLINE", "xs to be an array", xs); return;}
  if(!Array.isArray(ys)) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_SPLINE", "ys to be an array", ys); return;}
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER(debugString, "the duration to be a positive number", duration); return;}

  //The control points must be defined at x = 0 and x = 1
  if(xs[0] !== 0) {xs.unshift(0); ys.unshift(0);}
  if(xs[xs.length - 1] !== 1) {xs.push(1); ys.push(1);}
  console.log(xs)
  console.log(ys)

  const _callback = typeof callback === "function" ? callback : () => {};
  const m = xs.length;
  const n = m - 1;
  const l = m - 2;
  const ks = [];
  const A  = []; //(n+1)x(n+2) matrix filled with 0s
    
  let xsCurrMax = null;
  let i, j;
  let h = 0;
  let k = 0;
  
  
  for(i = 0; i < m; i++) {
    if(!Number.isFinite(xs[i]) || xs[i] < 0 || xs[i] > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_SPLINE", "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]); return;}
    if(!Number.isFinite(ys[i]) || ys[i] < 0 || ys[i] > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_SPLINE", "ys[" + i + "] to be a number between 0 and 1 (inclusive)", ys[i]); return;}
    if(!xsCurrMax || xsCurrMax < xs[i]) { //Checks if the xs are sorted
      xsCurrMax = xs[i]; 
    } else {
      DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_SPLINE", "the xs array to be sorted", xs[i].toFixed(2) + " (xs[" + i + "]) after " + xs[i - 1].toFixed(2) +  " (xs[" + (i - 1) + "])"); 
      return;
    }
    A.push([]); 
    for(j = 0; j < m + 1; j++) A[i].push(0);
  } 


  for(i = 1; i < n; i++) { // rows
    A[i][i - 1] = 1 / (xs[i] - xs[i - 1]);
    A[i][i]     = 2 * (1 / (xs[i] - xs[i - 1]) + 1 / (xs[i + 1] - xs[i]));
    A[i][i + 1] = 1 / (xs[i + 1] - xs[i]);
    A[i][m] = 3 * ((ys[i] - ys[i - 1]) / ((xs[i] - xs[i - 1]) * (xs[i] - xs[i - 1])) + (ys[i + 1] - ys[i]) / ((xs[i + 1] - xs[i]) * (xs[i + 1] - xs[i])));
  }

  A[0][0] = 2 / (xs[1] - xs[0]);
  A[0][1] = 1 / (xs[1] - xs[0]);
  A[0][m] = 3 * (ys[1] - ys[0]) / ((xs[1] - xs[0]) * (xs[1] - xs[0]));
  
  A[n][l] = 1 / (xs[n] - xs[l]);
  A[n][n] = 2 / (xs[n] - xs[l]);
  A[n][m] = 3 * (ys[n] - ys[l]) / ((xs[n] - xs[l]) * (xs[n] - xs[l]));

  while(h < m && k <= m) {	// column
    //Pivot for column
    let iMax = 0; 
    let iMaxVal = Number.NEGATIVE_INFINITY;
    for(i = h; i < m; i++) {
      const currVal = Math.abs(A[i][k]);
      if(currVal > iMaxVal) { 
        iMax = i; 
        iMaxVal = currVal;
      }
    }
    
    if(A[iMax][k] === 0) {
      k++;
      continue;
    }

    //Swap rows
    const p = A[h]; 
    A[h] = A[iMax]; 
    A[iMax] = p;
    
    //All the rows below pivot
    for(i = h + 1; i < m; i++) {
			const cf = A[i][k] / A[h][k];
      A[i][k] = 0;
      for(j = k + 1; j <= m; j++) {
        A[i][j] -= A[h][j] * cf;
      }
    }
    h++;
    k++;
  }
  
  for(i = n; i >= 0; i--)	{ // rows = columns
    ks[i] = A[i][i] ? A[i][m] / A[i][i] : 0;
    for(j = i - 1; j >= 0; j--)	{ // rows
      A[j][m] -= A[j][i] * ks[i];
      A[j][i] = 0;
    }
  }		

  function _evalSpline(x) {
    let i = 1;
    while(xs[i] < x) i++;
    
    const t = (x - xs[i-1]) / (xs[i] - xs[i-1]);
    const a = +ks[i - 1] * (xs[i] - xs[i - 1]) - (ys[i] - ys[i - 1]);
    const b = -ks[i]     * (xs[i] - xs[i - 1]) + (ys[i] - ys[i - 1]);
    
    return (1 - t) * ys[i - 1] + t * ys[i] + t * (1 - t) * (a * (1 - t) + b * t);
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.beginPath()
  ctx.moveTo(0,0)
  for(let i = 0; i < 1; i += 0.001) {
    //console.log(i, _evalSpline(i))
    ctx.lineTo(i * canvasWidth, canvasHeight - _evalSpline(i) * canvasHeight);
  }
  ctx.fill();

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : _evalSpline(_progress) * (total - 1);
    //console.log(_progress)
    return Math.ceil(remaning - total + _nextPos);
  }
}


const TEST = (duration = 900, bouncesNumber = 10, callback, debugString = "CUSTOM_CUBIC_BEZIER") => {
  bouncesNumber++;
  
  let _highestAllowedY = 0.99;
  const _heightDecreaseCoeff = 2;

  const _bounceDeltaX = 1 / bouncesNumber;
  const _bounceDeltaXHalf = _bounceDeltaX * 0.5;
  const _bounceCorrectionDeltaX = _bounceDeltaX * (1 - 0.9999);
  
  const _xs = [0];
  const _ys = [0]; 
  let bounceHeight = 1 / _heightDecreaseCoeff;
  let i;
  
  for(i = 1; i < bouncesNumber; i++) {
    const _currentBounceX = _bounceDeltaX * i;
    const _nextHighestY   = _currentBounceX + _bounceDeltaXHalf;
    
    _xs.push(//_currentBounceX - _bounceDeltaXHalf / 2, 
             _currentBounceX,  
             //_currentBounceX + _bounceCorrectionDeltaX, 
             _nextHighestY
             );
    
    _ys.push(//_currentBounceX - _bounceDeltaXHalf,       
             _highestAllowedY, 
            // _highestAllowedY * 0.9999,  
             _nextHighestY,//bounceHeight,
             );

    //bounceHeight = 1 - (1 - bounceHeight) /_heightDecreaseCoeff;
  }
  _xs.push(1);          
  _ys.push(1);

  return CUSTOM_CUBIC_SPLINE(_xs, _ys, duration, callback, debugString);

  /*
  return CUSTOM_CUBIC_SPLINE(
    [0, 0.0883, 0.189, 0.270,   0.364, 0.454, 0.542, 0.636,   0.725, 0.776, 0.820,   0.903, 0.917, 1],
    [0, 0.0589, 0.270, 0.551,   0.990, 0.812, 0.750, 0.812,   0.996, 0.951, 0.937,   0.993, 0.995, 1],
    duration, callback, debugString);
    */
}



const CUSTOM_BEZIER_CURVE = (xs, ys, duration = 500, callback, debugString = "CUSTOM_BEZIER_CURVE") => {
  if(!Array.isArray(xs)) {DEFAULT_ERROR_LOGGER(debugString, "xs to be an array", xs); return;}
  if(!Array.isArray(ys)) {DEFAULT_ERROR_LOGGER(debugString, "ys to be an array", ys); return;}
  if(xs.length !== ys.length) {DEFAULT_ERROR_LOGGER(debugString, "xs and ys to have the same length", "xs.length = " + xs.length + " and ys.length = " + ys.length); return;}
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER(debugString, "the duration to be a positive number", duration); return;}

  const _callback = typeof callback === "function" ? callback : () => {};
  const n = xs.length - 1;
  const nFact = _factorial(n);
  let _isXDefinedIn0 = false;
  let _isXDefinedIn1 = false;

  for(let i = 0; i <= n; i++) {
    if(!Number.isFinite(xs[i]) || xs[i] < 0 || xs[i] > 1) {DEFAULT_ERROR_LOGGER(debugString, "xs[" + i + "] to be a number between 0 and 1 (inclusive)", xs[i]); return;}
    if(!Number.isFinite(ys[i])) {DEFAULT_ERROR_LOGGER(debugString, "ys[" + i + "] to be a number", ys[i]); return;}
    if(!_isXDefinedIn0) _isXDefinedIn0 = xs[i] === 0; 
    if(!_isXDefinedIn1) _isXDefinedIn1 = xs[i] === 1; 
  }

  //The control points must be defined at x = 0 and x = 1
  if(!_isXDefinedIn0) {xs.unshift(0); ys.unshift(0);}
  if(!_isXDefinedIn1) {xs.push(1); ys.push(1);}

  console.log(xs)
  console.log(ys)

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
  
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.beginPath()
  ctx.moveTo(0,0)
  for(let i = 0.00001; i <= 1; i += 0.001) {
    ctx.lineTo(i * canvasWidth, (1 - _newtonRapson(i)) * canvasHeight);
  }
  ctx.fill();

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : _newtonRapson(_progress) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
}






const CUSTOM_CUBIC_BEZIER = (x1 = 0, y1 = 0, x2 = 1, y2 = 1, duration = 500, callback, debugString = "CUSTOM_CUBIC_BEZIER") => {
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER(debugString, "the duration to be a positive number", duration); return;}
  if(!Number.isFinite(x1) || x1 < 0 || x1 > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_BEZIER", "x1 to be a number between 0 and 1 (inclusive)", x1); return;}
  if(!Number.isFinite(y1) || y1 < 0 || y1 > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_BEZIER", "y1 to be a number between 0 and 1 (inclusive)", y1); return;}
  if(!Number.isFinite(x2) || x2 < 0 || x2 > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_BEZIER", "x2 to be a number between 0 and 1 (inclusive)", x2); return;}
  if(!Number.isFinite(y2) || y2 < 0 || y2 > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_BEZIER", "y2 to be a number between 0 and 1 (inclusive)", y2); return;}

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
 * Internally used to get the y (between 0 and 1) of a given x (between 0 and 1)
 * for bounce StepLengthCalculators.
 */
const _CUSTOM_BOUNCE = (progress = 0) => {
  if(!Number.isFinite(progress) || progress < 0 || progress > 1) {DEFAULT_ERROR_LOGGER("_CUSTOM_BOUNCE", "the progress to be a number between 0 and 1 (inclusive)", progress); return;}
  if(progress === 0 || progress === 1) return progress;

  const n1 = 7.5625;
  const d1 = 2.75;

  if (progress < 1 / d1)   return n1 * progress * progress;
  if (progress < 2 / d1)   return n1 * (progress -= 1.5  / d1) * progress + 0.75;
  if (progress < 2.5 / d1) return n1 * (progress -= 2.25 / d1) * progress + 0.9375;

  return n1 * (progress -= 2.625 / d1) * progress + 0.984375;
}

const EASE_IN_BOUNCE = (duration = 900, callback) => {
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER("EASE_IN_BOUNCE", "the duration to be a positive number", duration); return;}
  const _callback = typeof callback === "function" ? callback : () => {};

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : (1 - _CUSTOM_BOUNCE(1 - _progress)) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
}

const EASE_OUT_BOUNCE = (duration = 900, callback) => {
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER("EASE_OUT_BOUNCE", "the duration to be a positive number", duration); return;}
  const _callback = typeof callback === "function" ? callback : () => {};

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : _CUSTOM_BOUNCE(_progress) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
}

const EASE_IN_OUT_BOUNCE = (duration = 1200, callback) => {
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER("EASE_IN_OUT_BOUNCE", "the duration to be a positive number", duration); return;}
  const _callback = typeof callback === "function" ? callback : () => {};

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 :
                      _progress >= 1 ? total :
                      _progress < 0.5 ? 0.5 * (1 - _CUSTOM_BOUNCE(1 - 2 * _progress)) * (total - 1) :
                                        0.5 * (1 + _CUSTOM_BOUNCE(2 * _progress - 1)) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
}

const EASE_ELASTIC_X = (forwardEasing, backwardEasing, elasticPointCalculator = () => {return 50}, debounceTime = 0) => {
  if(typeof forwardEasing  !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "the forwardEasing to be a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "the backwardEasing to be a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "the elasticPointCalculator to be a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "the debounceTime to be a number", debounceTime); return;}

  let _elasticInit = null;
  let _elasticCallback = null;
  let _containerData;
  let _scrollCalculator;
  let _debounceTimeout;

  function _init(originalTimestamp, timestamp, container) {
    _scrollCalculator = forwardEasing;

    //Avoid doing any initialization if the container is not actually scrolling
    if(typeof _containerData[0] !== "number") return;

    const _originalCallback = _containerData[10];
    clearTimeout(_debounceTimeout);

    _elasticInit = () => {
      const _currentPos   = uss.getScrollXCalculator(container)();
      const _newDirection = _containerData[4];
      let _elasticAmount  = elasticPointCalculator(originalTimestamp, timestamp, _currentPos, _newDirection, container);
      if(!Number.isFinite(_elasticAmount)) {
        DEFAULT_WARNING_LOGGER(_elasticAmount, "is not a valid elastic amount");
        _elasticCallback();
        return;
      }
      if(_elasticAmount === 0) {_elasticCallback(); return;}
      if(_elasticAmount > 0) _scrollCalculator = backwardEasing; //The backward easing is used only if we change scroll-direction

      _debounceTimeout = setTimeout(() => uss.scrollXTo(_currentPos - _elasticAmount * _newDirection, container, _elasticCallback),
                                    debounceTime
                                   );
    }

    _elasticCallback = () => {
      _containerData[10] = null;
      if(typeof _originalCallback === "function") _originalCallback();
    }

    _containerData[10] = _elasticInit;
  }

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _containerData = uss._containersData.get(container) || [];
    if(!_elasticInit || !_elasticCallback || (_containerData[10] !== _elasticInit && _containerData[10] !== _elasticCallback)) {
      _init(originalTimestamp, timestamp, container);
    }
    return _scrollCalculator(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);
  }
}

const EASE_ELASTIC_Y = (forwardEasing, backwardEasing, elasticPointCalculator = () => {return 50}, debounceTime = 0) => {
  if(typeof forwardEasing  !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "the forwardEasing to be a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "the backwardEasing to be a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "the elasticPointCalculator to be a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "the debounceTime to be a number", debounceTime); return;}

  let _elasticInit = null;
  let _elasticCallback = null;
  let _containerData;
  let _scrollCalculator;
  let _debounceTimeout;

  function _init(originalTimestamp, timestamp, container) {
    _scrollCalculator = forwardEasing;

    //Avoid doing any initialization if the container is not actually scrolling
    if(typeof _containerData[1] !== "number") return;

    const _originalCallback = _containerData[11];
    clearTimeout(_debounceTimeout);

    _elasticInit = () => {
      const _currentPos   = uss.getScrollYCalculator(container)();
      const _newDirection = _containerData[5];
      let _elasticAmount  = elasticPointCalculator(originalTimestamp, timestamp, _currentPos, _newDirection, container);
      if(!Number.isFinite(_elasticAmount)) {
        DEFAULT_WARNING_LOGGER(_elasticAmount, "is not a valid elastic amount");
        _elasticCallback();
        return;
      }
      if(_elasticAmount === 0) {_elasticCallback(); return;}
      if(_elasticAmount > 0) _scrollCalculator = backwardEasing; //The backward easing is used only if we change scroll-direction

      _debounceTimeout = setTimeout(() => uss.scrollYTo(_currentPos - _elasticAmount * _newDirection, container, _elasticCallback),
                                    debounceTime
                                   );
    }

    _elasticCallback = () => {
      _containerData[11] = null;
      if(typeof _originalCallback === "function") _originalCallback();
    }

    _containerData[11] = _elasticInit;
  }

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _containerData = uss._containersData.get(container) || [];
    if(!_elasticInit || !_elasticCallback || (_containerData[11] !== _elasticInit && _containerData[11] !== _elasticCallback)) {
      _init(originalTimestamp, timestamp, container);
    }
    return _scrollCalculator(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);
  }
}