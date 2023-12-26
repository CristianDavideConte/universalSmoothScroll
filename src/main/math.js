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
 * E.g.
 * - factorials[0] = 0! = 1
 * - factorials[5] = 5! = 120
 * - ...
 */
const _factorials = [
    1, 1, 2, 6, 24, 120, //0!..5!
    720, 5040, 40320, 362880, 3628800, //6!..10!
    39916800, 479001600, 6227020800, 87178291200, 1307674368000, //11!..15!
    20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000 //16!..20!
];

/**
 * Returns the factorial of `value`. If `value > 170`, `Infinity` is returned.
 * 
 * Note that `no type checks` are done on `value`.
 * @param {number} value The number to calculate the factorial of.
 * @returns {number} The factorial of `value`.
 */
export const FACTORIAL = (value) => {
    let _fact = _factorials[value];

    if (!_fact) {
        _fact = value * FACTORIAL(value - 1);
        _factorials[value] = _fact;
    }

    return _fact;
}

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
