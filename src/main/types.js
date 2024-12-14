/**
 * The `window` in which the API has been initialized.
 */
export const THIS_WINDOW = window;

/**
 * Checks whether `value` is a positive number (i.e. > 0).
 * @param {*} value The value to check.
 * @returns {boolean} `true` if `value` is a positive number, `false` otherwise.
 */
export const IS_POSITIVE = (value) => {
    return Number.isFinite(value) && value > 0;
};

/**
 * Checks whether `value` is a positive number or 0 (i.e. >= 0).
 * @param {*} value The value to check.
 * @returns {boolean} `true` if `value` is a number >= 0, `false` otherwise.
 */
export const IS_POSITIVE_OR_0 = (value) => {
    return Number.isFinite(value) && value >= 0;
};

/**
 * Checks whether `value` is a number in `[0..1]` (i.e. 0 <= number <= 1).
 * @param {*} value The value to check.
 * @returns {boolean} `true` if value is in `[0..1]`, `false` otherwise.
 */
export const IS_IN_0_1 = (value) => {
    return Number.isFinite(value) && value >= 0 && value <= 1;
};

/**
 * Checks whether `value` is a function.
 * @param {*} value The value to check.
 * @returns {boolean} `true` if `value` is a function, `false` otherwise.
 */
export const IS_FUNCTION = (value) => {
    return typeof value === 'function';
};

/**
 * Checks whether `value` is an object.
 * @param {*} value The value to check.
 * @returns {boolean} `true` if `value` is an object, `false` otherwise.
 */
export const IS_OBJECT = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Checks whether `value` is a window object.
 * Works with iFrames' windows too.
 * @param {*} value The value to check.
 * @returns `true` if `value` is a window object, `false` otherwise.
 */
export const IS_WINDOW = (value) => {
    if (value === THIS_WINDOW) return true;

    /**
     * Inside iFrames the pointer to the window object may be different
     * from the one used in this module, but a window still exists and
     * it can be retrieved by asking for the value.window.
     */
    try {
        return value === value.window;
    } catch (UnsupportedOperation) {
        return false;
    }
};
