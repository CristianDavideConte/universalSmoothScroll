const unsupportedElement = () => {};
Object.setPrototypeOf(unsupportedElement, Element.prototype);
console.log(unsupportedElement)

export const constants = {
    defaultUssException: "USS fatal error (execution stopped)",
    defaultTimeout: 1000,
    failingValuesAll: [unsupportedElement, Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0, null, undefined],
    failingValuesAllNoUndefined: [unsupportedElement, Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0, null],
    failingValuesAllNoUnsupportedNoUndefined: [Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0, null],
    failingValuesNoString: [unsupportedElement, Infinity, -Infinity, true, false, NaN, 10, -10, 0, null, undefined],
    failingValuesNoStringNoUndefined: [unsupportedElement, Infinity, -Infinity, true, false, NaN, 10, -10, 0, null],
    failingValuesNoNull: [unsupportedElement, Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0, undefined],
    failingValuesNoUndefined: [unsupportedElement, Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0, null],
    failingValuesNoNullOrUndefined: [unsupportedElement, Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0],
    failingValuesNoFiniteNumber: [unsupportedElement, Infinity, -Infinity, true, false, NaN, "fail", "", null, undefined],
    failingValuesNoPositiveNumber: [unsupportedElement, Infinity, -Infinity, true, false, NaN, "fail", "", -10, 0, null, undefined],
    failingValuesNoPositiveNumberOrUndefined: [unsupportedElement, Infinity, -Infinity, true, false, NaN, "fail", "", -10, 0, null],
    failingValuesNoPositiveNumberOrZero: [unsupportedElement, Infinity, -Infinity, true, false, NaN, "fail", "", -10, null, undefined],
}