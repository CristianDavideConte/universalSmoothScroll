//TODO @ts-check //Use to check for type errors
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
import {
    IS_POSITIVE,
} from "../main/math.js"

import {
    CHECK_INSTANCEOF,
    CREATE_LOG_OPTIONS,
    IS_OBJECT,
    NO_VAL
} from "../main/common.js";

import {
    _pageScroller,
    _framesTimes,
    _errorLogger,
    _warningLogger,
    calcFramesTimes,
    getFramesTime,
} from "../main/uss.js";



/**
 * A map containing function names and a partial `options` objects that, 
 * can be used with the uss loggers.
 * Note that these objects (the map entries) are partial and need 
 * to be completed (they only contain known/static log informations). 
 * Also note that this map is used instead of the common.js one.
 */
const DEFAULT_LOG_OPTIONS = new Map([
    ["isValidStepLengthCalculator", [
        { primaryMsg: "options to be an object" },
        { primaryMsg: "fun to be a function" },
        { primaryMsg: "options.container to be an Element or the Window" },
        { primaryMsg: "options.totalScrollAmount to be a positive number" },
        { primaryMsg: "options.timeout to be a positive number" },
        { primaryMsg: "fun to return a valid stepLength value" }
    ]],
    ["getBrowserRefreshRate", [
        { primaryMsg: "_framesTimes to be an array of numbers" },
        { primaryMsg: "to not throw any exception" },  //TODO: improve error message
    ]],
]);



/**
 * This functions tests if both the `_framesTime` and the `_framesTimes` variable 
 * have not been altered and if then calculates the browser's refresh rate.
 * More specifically, it returns the highest number of times that `requestAnimationFrame` can be called per second.
 * @param {Object} [options] `[Private]` The input object used by the uss loggers.
 * @returns The number of frames per seconds that the browser is refreshing at.
 */
export async function getBrowserRefreshRate(options) {
    //Check if the _framesTimes variable has been altered.
    if (!Array.isArray(_framesTimes)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getBrowserRefreshRate", { secondaryMsg: _framesTimes, idx: 0 }, DEFAULT_LOG_OPTIONS));
        return NaN;
    }

    //Check if the _framesTime variable has already been calculated.
    if (_framesTimes.length > 0) {
        return 1000 / getFramesTime(false, NO_VAL, options);
    }

    let _currentMeasurementsLeft = 60; //Do 60 measurements to establish the initial value

    try {
        _warningLogger(
            {
                subject: "_framesTime",
                primaryMsg: "hasn't been calculated yet at the time of invocation"
            },
        );

        await new Promise((resolve, reject) => {
            const _startMeasuring = () => {
                //Other API components have requested the frames time calculation,
                //the callback will be ignored so it's better to postpone the measurements.
                if (_framesTimes[-1]) {
                    setTimeout(_startMeasuring, 1000);
                    return;
                }

                //Calculate the average frames' time of the user's screen. 
                const _measureFramesTime = () => {
                    if (_currentMeasurementsLeft > 0) {
                        _currentMeasurementsLeft--;
                        calcFramesTimes(NO_VAL, NO_VAL, _measureFramesTime);
                    } else {
                        resolve(NO_VAL);
                    }
                }
                _measureFramesTime();
            }
            _startMeasuring();
        });
    } catch (result) {
        _errorLogger(CREATE_LOG_OPTIONS(options, "getBrowserRefreshRate", { secondaryMsg: result, idx: 1 }, DEFAULT_LOG_OPTIONS));
        return NaN;
    }

    return 1000 / getFramesTime(false, NO_VAL, options);
}

/**
 * This function tests whether `fun` is a valid stepLengthCalculator.
 * No actual scroll-animation takes place, so no scroll events are dispatched.
 * This function is non-blocking/asynchronous.
 * @param {Function} fun The function to test.
 * @param {Object} options An object which contains the testing preferences listed below.
 * @param {*} [options.container=_pageScroller] The container againist which fun should be tested. 
 * @param {Number} [options.totalScrollAmount=100] The total amount of pixels againist which fun should be tested. 
 * @param {Number} [options.timeout=5000] The amount of milliseconds after which the test forcefully returns a result. 
 * @returns `true` if `fun` is a valid stepLengthCalculator, `false` otherwise.
 */
export async function isValidStepLengthCalculator(
    fun,
    options = {
        container: _pageScroller,
        totalScrollAmount: 100,
        timeout: 5000,
    }
) {
    const _functionName = "isValidStepLengthCalculator"

    //Check if the options parameter is a valid object.
    if (!IS_OBJECT(options)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, _functionName, { secondaryMsg: options, idx: 0 }, DEFAULT_LOG_OPTIONS));
        return false;
    }

    //Check if the passed stepLengthCalculator is a function.
    if (typeof fun !== "function") {
        _errorLogger(CREATE_LOG_OPTIONS(options, _functionName, { secondaryMsg: fun, idx: 1 }, DEFAULT_LOG_OPTIONS));
        return false;
    }

    //Check if the passed container is valid.
    if (options.container !== window && !CHECK_INSTANCEOF(options.container)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, _functionName, { secondaryMsg: options.container, idx: 2 }, DEFAULT_LOG_OPTIONS));
        return false;
    }

    //Check if the passed totalScrollAmount is valid.
    if (!IS_POSITIVE(options.totalScrollAmount)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, _functionName, { secondaryMsg: options.totalScrollAmount, idx: 3 }, DEFAULT_LOG_OPTIONS));
        return false;
    }

    //Check if the passed timeout is valid.
    if (!IS_POSITIVE(options.timeout)) {
        _errorLogger(CREATE_LOG_OPTIONS(options, _functionName, { secondaryMsg: options.timeout, idx: 4 }, DEFAULT_LOG_OPTIONS));
        return false;
    }
    
    const _originalTimestamp = performance.now();
    const _totalScrollAmount = options.totalScrollAmount;
    const _timeout = options.timeout;
    
    let _remaningScrollAmount = _totalScrollAmount;
    let _exeededTimeLimit = false;
    let _currentTimestamp;

    const _tester = (resolve, reject) => {
        _currentTimestamp = performance.now();
        const _testResult = fun(
                                 _remaningScrollAmount,                      //remaningScrollAmount
                                 _originalTimestamp,                         //originalTimestamp
                                 _currentTimestamp,                          //currentTimestamp
                                 _totalScrollAmount,                         //totalScrollAmount
                                 _totalScrollAmount - _remaningScrollAmount, //currentXPosition
                                 _totalScrollAmount,                         //finalXPosition
                                 options.container                           //container
                             );
                            
        if(!Number.isFinite(_testResult)) {
            reject(_testResult);
            return;
        }

        _remaningScrollAmount -= _testResult;  
        _exeededTimeLimit = _currentTimestamp - _originalTimestamp > _timeout;
        
        if(_remaningScrollAmount <= 0 || _exeededTimeLimit) {
          resolve();
          return;
        } 

        window.requestAnimationFrame(() => _tester(resolve, reject));       
    }

    try {
        await new Promise((resolve, reject) => {
            window.requestAnimationFrame(() => _tester(resolve, reject));
        });
    } catch(result) {
        _errorLogger(CREATE_LOG_OPTIONS(options, _functionName, { secondaryMsg: result, idx: 5 }, DEFAULT_LOG_OPTIONS));
        return false;
    }

    //The passed stepLengthCalculator may have entered a loop.
    if (_exeededTimeLimit) {
        _warningLogger(
            {
                subject: fun.name || "the passed function",
                primaryMsg: "didn't complete the test scroll-animation within " + _timeout + "ms",
            }
        )
        return false;
    }
    
    return true;
}