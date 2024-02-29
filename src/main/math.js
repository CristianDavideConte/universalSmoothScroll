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

/**
 * An array containing the currently calculated factorials.
 * 
 * Note that given an index i, `factorials[i] contains i!`.
 * e.g.
 * - factorials[0] = 0! = 1
 * - factorials[5] = 5! = 120
 * - ...
 */
const _factorials = new Array(170);

/**
 * Returns the factorial of `value`. 
 * If `value > 170`, `Infinity` is returned.
 * 
 * Note that `no type checks` are done on `value`.
 * @param {number} value The number to calculate the factorial of.
 * @returns {number} The factorial of `value`.
 */
export const FACTORIAL = (value) => {
    if (_factorials[value]) return _factorials[value];
    if (value > 170) return Infinity;
    if (value == 0) return 1;

    let _fact = 1;
    for (let i = 1; i <= value; i++) {
        _fact *= i;
        _factorials[i] = _fact;
    }
    return _fact;
}
FACTORIAL(170); //Forcefully cache the factorials
Object.seal(_factorials);

/**
 * Checks whether `value` is a positive number (i.e. > 0).
 * @param {*} value The value to check.
 * @returns {boolean} `true` if `value` is a positive number, `false` otherwise.
 */
export const IS_POSITIVE = (value) => {
    return Number.isFinite(value) && value > 0;
}

/**
 * Checks whether `value` is a positive number or 0 (i.e. >= 0).
 * @param {*} value The value to check.
 * @returns {boolean} `true` if `value` is a number >= 0, `false` otherwise.
 */
export const IS_POSITIVE_OR_0 = (value) => {
    return Number.isFinite(value) && value >= 0;
}

/**
 * Checks whether `value` is a number in `[0..1]` (i.e. 0 <= number <= 1).
 * @param {*} value The value to check.
 * @returns {boolean} `true` if value is in `[0..1]`, `false` otherwise.
 */
export const IS_IN_0_1 = (value) => {
    return Number.isFinite(value) && value >= 0 && value <= 1;
}

/**
 * Finds the line passing between a point `P1` and a point `P2`.
 * @param {number} x0 `x` coordinate of `P1`. 
 * @param {number} y0 `y` coordinate of `P1`.
 * @param {number} x1 `x` coordinate of `P2`.
 * @param {number} y1 `y` coordinate of `P2`.
 * @returns {(x: number) => number} A function that calculates the `y` of the line passing for `P1` and `P2` for a given `x` coordinate.
 */
export const GET_LINE_FROM_P1_P2 = (x0, y0, x1, y1) => {
    const _deltaYOverDeltaX = (y1 - y0) / (x1 - x0);
    return (x) => (x - x0) * _deltaYOverDeltaX + y0;
}
