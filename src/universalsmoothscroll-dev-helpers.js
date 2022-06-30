async function isValidStepLengthCalculator(stepLengthCalculator, container = uss._pageScroller, totalScrollAmount = 100, timeout = 5000) {
    if(typeof stepLengthCalculator !== "function") {
        uss._errorLogger("isValidStepLengthCalculator", "the stepLengthCalculator to be a function", stepLengthCalculator);
        return false;
    }
    
    const _originalTimestamp = performance.now();
    let _remaningScrollAmount = totalScrollAmount;
    let _exeededTimeLimit = false;
    let _currentTimestamp;

    const _tester = (resolve, reject) => {
        _currentTimestamp = performance.now();
        const _testResult = stepLengthCalculator(
                                _remaningScrollAmount,                                        //remaningScrollAmount
                                _originalTimestamp,                                           //originalTimestamp
                                _currentTimestamp,                                            //currentTimestamp
                                totalScrollAmount,                         //totalScrollAmount
                                totalScrollAmount - _remaningScrollAmount, //currentXPosition
                                totalScrollAmount,                         //finalXPosition
                                container                                                     //container
                            );
                            
        if(!Number.isFinite(_testResult)) {
            reject(_testResult);
            return;
        }

        _remaningScrollAmount -= _testResult;  
        _exeededTimeLimit = _currentTimestamp - _originalTimestamp > timeout;

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
    } catch (error) {
        uss._errorLogger("isValidStepLengthCalculator", "the stepLengthCalculator to return a valid step value", error);
        return false;
    }

    //The passed stepLengthCalculator may have entered a loop.
    if(_exeededTimeLimit) {
        uss._warningLogger(stepLengthCalculator.name || "the passed calculator", 
                           "didn't complete the test scroll-animation within " + timeout + "ms", 
                           false
        );
    }
    
    return true;
}