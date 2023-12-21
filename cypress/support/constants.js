const arraysAreEqual = (arr1, arr2) => {
    if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if(arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false;
    }
    return true;
}

const getChildrenRecursively = (element) => {
    let _children = Array.from(element.children);
    let _newChildren = [];

    for(const child of _children) {
        _newChildren = _newChildren.concat(getChildrenRecursively(child));
    }

    return _children.concat(_newChildren);
}

const unsupportedElement = () => {};
Object.setPrototypeOf(unsupportedElement, Element.prototype);

export const constants = {
    K_IDX:0,   //Key to get the scroll id on the x-axis
    K_IDY:1,   //Key to get the scroll id on the y-axis

    K_FPX:2,   //Key to get the final x position
    K_FPY:3,   //Key to get the final y position

    K_SDX:4,   //Key to get the scroll direction on the x-axis 
    K_SDY:5,   //Key to get the scroll direction on the y-axis

    K_TSAX:6,  //Key to get the total scroll amount on the x-axis
    K_TSAY:7,  //Key to get the total scroll amount on the y-axis

    K_OTSX:8,  //Key to get the original timestamp of the scroll animation on the x-axis
    K_OTSY:9,  //Key to get the original timestamp of the scroll animation on the y-axis

    K_CBX:10,  //Key to get the callback for the scroll animation on the x-axis
    K_CBY:11,  //Key to get the callback for the scroll animation on the y-axis

    K_PSCX: 12, //Key to get the permanent StepLengthCalculator for the scroll animation on the x-axis
    K_PSCY: 13, //Key to get the permanent StepLengthCalculator for the scroll animation on the y-axis

    K_TSCX:14, //Key to get the temporary StepLengthCalculator for the scroll animation on the x-axis
    K_TSCY:15, //Key to get the temporary StepLengthCalculator for the scroll animation on the y-axis

    K_MSX:16,  //Key to get the maxScrollX value 
    K_MSY:17,  //Key to get the maxScrollY value 

    K_VSB:18,  //Key to get the vertical scrollbar's width 
    K_HSB:19,  //Key to get the horizontal scrollbar's height

    K_TB:20,   //Key to get the top border's height
    K_RB:21,   //Key to get the right border's width
    K_BB:22,   //Key to get the bottom border's height
    K_LB:23,   //Key to get the left border's width

    K_SSPX:24, //Key to get the standard scrollable parent on the x-axis (overflow !== "hidden") 
    K_HSPX:25, //Key to get the hidden scrollable parent on the x-axis (overflow === "hidden") 
    K_SSPY:26, //Key to get the standard scrollable parent on the y-axis (overflow !== "hidden") 
    K_HSPY:27, //Key to get the hidden scrollable parent on the y-axis (overflow === "hidden") 

    K_SCX:28,  //Key to get the ScrollXCalculator
    K_SCY:29,  //Key to get the ScrollYCalculator

    K_BRB:30, //Key to get the border box 

    K_RCBQ:31,  //Key to get the resize callbacks queue
    K_MCBQ:32,  //Key to get the mutation callbacks queue

    NO_VAL:undefined, //No value has been calculated yet
    NO_SP:null,       //No scrollable parent has been found
    MAX_MSG_LEN:40,   //The maximum error/warning messages' lengths

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
    arraysAreEqual: arraysAreEqual,
    getChildrenRecursively: getChildrenRecursively,
}