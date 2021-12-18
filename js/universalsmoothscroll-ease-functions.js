"use strict";

const CUSTOM_CUBIC_BEZIER = (x1 = 0, y1 = 0, x2 = 1, y2 = 1, duration = 500, callback, debugString = "CUSTOM_CUBIC_BEZIER") => {
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER(debugString, "a positive number", duration); return;}
  if(!Number.isFinite(x1) || x1 < 0 || x1 > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_BEZIER", "a number between 0 and 1 (inclusive) as x1", x1); return;}
  if(!Number.isFinite(y1) || y1 < 0 || y1 > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_BEZIER", "a number between 0 and 1 (inclusive) as y1", y1); return;}
  if(!Number.isFinite(x2) || x2 < 0 || x2 > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_BEZIER", "a number between 0 and 1 (inclusive) as x2", x2); return;}
  if(!Number.isFinite(y2) || y2 < 0 || y2 > 1) {DEFAULT_ERROR_LOGGER("CUSTOM_CUBIC_BEZIER", "a number between 0 and 1 (inclusive) as y2", y2); return;}

  const _callback = typeof callback === "function" ? callback : () => {};
  const aX = 1 + 3 * (x1 - x2);
  const aY = 1 + 3 * (y1 - y2);
  const bX = 3 * (x2 - 2 * x1);
  const bY = 3 * (y2 - 2 * y1);
  const cX = 3 * x1;
  const cY = 3 * y1;
  
  function newtonRapson(x) {
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
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : newtonRapson(_progress) * (total - 1);
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
  if(!Number.isFinite(progress) || progress < 0 || progress > 1) {DEFAULT_ERROR_LOGGER("_CUSTOM_BOUNCE", "a number between 0 and 1 (inclusive) as the progress", progress); return;}
  if(progress === 0 || progress === 1) return progress;

  const n1 = 7.5625;
  const d1 = 2.75;

  if (progress < 1 / d1)   return n1 * progress * progress;
  if (progress < 2 / d1)   return n1 * (progress -= 1.5  / d1) * progress + 0.75;
  if (progress < 2.5 / d1) return n1 * (progress -= 2.25 / d1) * progress + 0.9375;

  return n1 * (progress -= 2.625 / d1) * progress + 0.984375;
}

const EASE_IN_BOUNCE = (duration = 900, callback) => {
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER("EASE_IN_BOUNCE", "a positive number", duration); return;}
  const _callback = typeof callback === "function" ? callback : () => {};

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : (1 - _CUSTOM_BOUNCE(1 - _progress)) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
}

const EASE_OUT_BOUNCE = (duration = 900, callback) => {
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER("EASE_OUT_BOUNCE", "a positive number", duration); return;}
  const _callback = typeof callback === "function" ? callback : () => {};

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    _callback(remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container);

    const _progress = (timestamp - originalTimestamp) / duration; //elapsed / duration
    const _nextPos  = _progress <= 0 ? 0 : _progress >= 1 ? total : _CUSTOM_BOUNCE(_progress) * (total - 1);
    return Math.ceil(remaning - total + _nextPos);
  }
}

const EASE_IN_OUT_BOUNCE = (duration = 1200, callback) => {
  if(!Number.isFinite(duration) || duration <= 0) {DEFAULT_ERROR_LOGGER("EASE_IN_OUT_BOUNCE", "a positive number", duration); return;}
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
  if(typeof forwardEasing  !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_X", "a number", debounceTime); return;}

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
  if(typeof forwardEasing  !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "a function", forwardEasing);  return;}
  if(typeof backwardEasing !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "a function", backwardEasing); return;}
  if(typeof elasticPointCalculator !== "function") {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "a function", elasticPointCalculator); return;}
  if(!Number.isFinite(debounceTime)) {DEFAULT_ERROR_LOGGER("EASE_ELASTIC_Y", "a number", debounceTime); return;}

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