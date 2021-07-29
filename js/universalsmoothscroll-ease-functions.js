const CUSTOM_CUBIC_BEZIER = (u0 = 0, u1 = 0, u2 = 1, u3 = 1, duration = 500) => {
  if(!Number.isFinite(duration) || duration <= 0) {console.error("USS Error:", duration, "is not a valid duration"); return;}
  if(!Number.isFinite(u0) || u0 < 0 || u0 > 1) {console.error("USS Error:", u0, "must be a number between 0 and 1 (inclusive)"); return;}
  if(!Number.isFinite(u1) || u1 < 0 || u1 > 1) {console.error("USS Error:", u1, "must be a number between 0 and 1 (inclusive)"); return;}
  if(!Number.isFinite(u2) || u2 < 0 || u2 > 1) {console.error("USS Error:", u2, "must be a number between 0 and 1 (inclusive)"); return;}
  if(!Number.isFinite(u3) || u3 < 0 || u3 > 1) {console.error("USS Error:", u3, "must be a number between 0 and 1 (inclusive)"); return;}

  const aX = 1  + 3 * (u0 - u2);
  const bX = 3 * (u2 - 2 * u0);
  const cX = 3 * u0;
  const aY = 1 + 3 * (u1 - u3);
  const bY = 3 * (u3 - 2 * u1);
  const cY = 3 * u1;

  function newtonRapson(aX, bX, cX, aY, bY, cY, x) {
    let prev;
    let t = x;
    do {
      prev = t;
      t = t - ((t * (cX + t * (bX + t * aX)) - x) / (cX + t * (2 * bX + 3 * aX * t)));
    } while (Math.abs(t - prev) > 1e-4);

    return t * ( cY + t * ( bY + t * aY )); //This is y given t on the bezier curve
  }

  return (remaning, originalTimestamp, timestamp, total, currentPos, finalPos, container) => {
    const _elapsed = timestamp - originalTimestamp;
    const _currentBezierX = _elapsed < 0 ? 0 : _elapsed / duration; // from 0 to 1
    const _nextPos = _currentBezierX === 0 ? 0 : newtonRapson(aX, bX, cX, aY, bY, cY, _currentBezierX) * total;
  	return Math.ceil(remaning - total + _nextPos);
  }
}

const EASE_LINEAR = (duration = 500) => CUSTOM_CUBIC_BEZIER(0, 0, 1, 1, duration);

const EASE_IN_SINE  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.12, 0, 0.39, 0, duration);
const EASE_IN_QUAD  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.11, 0, 0.5,  0, duration);
const EASE_IN_CUBIC = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.32, 0, 0.67, 0, duration);
const EASE_IN_QUART = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.5,  0, 0.75, 0, duration);
const EASE_IN_QUINT = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.64, 0, 0.78, 0, duration);
const EASE_IN_EXPO  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.7,  0, 0.84, 0, duration);
const EASE_IN_CIRC  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.55, 0, 1, 0.45, duration);

const EASE_OUT_SINE  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.61, 1, 0.88, 1, duration);
const EASE_OUT_QUAD  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.5,  1, 0.89, 1, duration);
const EASE_OUT_CUBIC = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.33, 1, 0.68, 1, duration);
const EASE_OUT_QUART = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.25, 1, 0.5,  1, duration);
const EASE_OUT_QUINT = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.22, 1, 0.36, 1, duration);
const EASE_OUT_EXPO  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.16, 1, 0.3,  1, duration);
const EASE_OUT_CIRC  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0, 0.55, 0.45, 1, duration);

const EASE_IN_OUT_SINE  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.37, 0, 0.63, 1, duration);
const EASE_IN_OUT_QUAD  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.45, 0, 0.55, 1, duration);
const EASE_IN_OUT_CUBIC = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.65, 0, 0.35, 1, duration);
const EASE_IN_OUT_QUART = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.76, 0, 0.24, 1, duration);
const EASE_IN_OUT_QUINT = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.83, 0, 0.17, 1, duration);
const EASE_IN_OUT_EXPO  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.87, 0, 0.13, 1, duration);
const EASE_IN_OUT_CIRC  = (duration = 500) => CUSTOM_CUBIC_BEZIER(0.85, 0, 0.15, 1, duration);
