export const constants = {
    defaultUssException: "USS fatal error (execution stopped)",
    failingValuesAll: [Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0, null, undefined],
    failingValuesAllNoUndefined: [Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0, null],
    failingValuesNoString: [Infinity, -Infinity, true, false, NaN, 10, -10, 0, null, undefined],
    failingValuesNoStringNoUndefined: [Infinity, -Infinity, true, false, NaN, 10, -10, 0, null],
    failingValuesNoNull: [Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0, undefined],
    failingValuesNoUndefined: [Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0, null],
    failingValuesNoNullOrUndefined: [Infinity, -Infinity, true, false, NaN, "fail", "", 10, -10, 0],
    failingValuesNoFiniteNumber: [Infinity, -Infinity, true, false, NaN, "fail", "", null, undefined],
    failingValuesNoPositiveNumber: [Infinity, -Infinity, true, false, NaN, "fail", "", -10, 0, null, undefined],
    failingValuesNoPositiveNumberOrUndefined: [Infinity, -Infinity, true, false, NaN, "fail", "", -10, 0, null],
    failingValuesNoPositiveNumberOrZero: [Infinity, -Infinity, true, false, NaN, "fail", "", -10, null, undefined],
}