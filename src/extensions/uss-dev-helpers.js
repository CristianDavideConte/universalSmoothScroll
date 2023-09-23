//TODO: use the new error/warning loggers
//TODO: import only the variables/functions used by this module instead of everything.

import * as uss from "../main/uss.js";

import {
    IS_OBJECT
} from "../main/common.js";

/**
 * This function tests whether the passed fun is a valid stepLengthCalculator.
 * No actual scroll-animation takes place, so no scroll events are dispatched.
 * This function is non-blocking/asynchronous.
 * @param {Function} fun The function to test.
 * @param {Object} options An object which contains the testing preferences listed below.
 * @param {*} [options.container=uss._pageScroller] The container againist which fun should be tested. 
 * @param {Number} [options.totalScrollAmount=100] The total amount of pixels againist which fun should be tested. 
 * @param {Number} [options.timeout=5000] The amount of milliseconds after which the test forcefully returns a result. 
 * @param {String} [options.debugString="isValidStepLengthCalculator"] A string internally used to log the name of the most upper level function that caused an error/warning.
 * @returns True if the function is a valid stepLengthCalculator, false otherwise.
 */
export async function isValidStepLengthCalculator(
    fun, 
    options = {
        container: uss._pageScroller, 
        totalScrollAmount: 100, 
        timeout: 5000, 
        debugString:"isValidStepLengthCalculator"
    }
) {
    //Check if the options parameter is a valid object.
    if (!IS_OBJECT(options)) {
        uss._errorLogger("isValidStepLengthCalculator", "the options parameter to be an object", options);
        return false;
    }

    options.debugString = options.debugString || "isValidStepLengthCalculator";

    //Check if the passed stepLengthCalculator is a function.
    if(typeof fun !== "function") {
        uss._errorLogger(options.debugString, "the stepLengthCalculator to be a function", fun);
        return false;
    }

    //Check if the passed container is valid.
    if(options.container !== window && !(options.container instanceof Element)) {
        uss._errorLogger(options.debugString, "the options.container parameter to be an Element or the Window", options.container);
        return false;
    }

    //Check if the passed totalScrollAmount is valid.
    if(!Number.isFinite(options.totalScrollAmount) || options.totalScrollAmount < 0) {
        uss._errorLogger(options.debugString, "the options.totalScrollAmount parameter to be a positive number", options.totalScrollAmount);
        return false;
    }

    //Check if the passed timeout is valid.
    if(!Number.isFinite(options.timeout) || options.timeout < 0) {
        uss._errorLogger(options.debugString, "the options.timeout parameter to be a positive number", options.timeout);
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
        try {
            uss._errorLogger(options.debugString, "the stepLengthCalculator to return a valid stepLength value", result);
        } catch(e){} 
        
        return false;
    }

    //The passed stepLengthCalculator may have entered a loop.
    if(_exeededTimeLimit) {
        uss._warningLogger(fun.name || "the passed function", 
                           "didn't complete the test scroll-animation within " + _timeout + "ms", 
                           false
        );
    }
    
    return true;
}

/**
 * This functions tests if both the uss._framesTime and the uss._framesTimes variable 
 * have not been altered and if so calculates the browser's refresh rate.
 * More specifically, it returns the highest number of times that the window.requestAnimationFrame can be called per second.
 * @param {Object} options An object which contains the testing preferences listed below.
 * @param {String} [options.debugString="getBrowserRefreshRate"] A string internally used to log the name of the most upper level function that caused an error/warning.
 * @returns The number of frames per seconds that the browser is refreshing at.
 */
export async function getBrowserRefreshRate(
    options = {
        debugString:"getBrowserRefreshRate"
    }
) {
    //Check if the uss._framesTimes variable has been altered.
    if(!Array.isArray(uss._framesTimes)) {
        uss._errorLogger(options.debugString, "uss._framesTimes to be an array of numbers", uss._framesTimes);
        return NaN;
    }
    
    options.requestPhase = 0;

    //Check if the uss._framesTime variable has already been calculated.
    if(uss._framesTimes.length > 0) {
        return 1000 / uss.getFramesTime(false, null, options);
    }

    let _currentMeasurementsLeft = 60; //Do 60 measurements to establish the initial value

    try {
        uss._warningLogger("uss._framesTime", "hasn't been calculated yet at the time of invocation");

        await new Promise((resolve, reject) => {
            const _startMeasuring = () => {
                //Other API components have requested the frames time calculation,
                //the callback will be ignored so it's better to postpone the measurements.
                if(uss._framesTimes[-1]) {
                    setTimeout(_startMeasuring, 1000);
                    return;
                }

                //Calculate the average frames' time of the user's screen. 
                const _measureFramesTime = () => {
                    if(_currentMeasurementsLeft > 0) {
                        _currentMeasurementsLeft--;
                        uss.calcFramesTimes(undefined, undefined, _measureFramesTime);
                    } else {
                        resolve();
                    }
                }
                _measureFramesTime();
            }
            _startMeasuring();
        });
    } catch(result) {
        try {
            uss._errorLogger(options.debugString, "to not throw any exception", result); //TODO: improve error message
        } catch(e){} 
        
        return NaN;
    }

    return 1000 / uss.getFramesTime(false, null, options);
}