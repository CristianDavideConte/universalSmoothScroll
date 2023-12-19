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
