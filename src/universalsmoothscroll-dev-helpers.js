async function isValidStepLengthCalculator(
    fun, 
    options = {
        container: uss._pageScroller, 
        totalScrollAmount: 100, 
        timeout: 5000, 
        debugString:"isValidStepLengthCalculator"
    }
) {
    //Check if the options parameter is a valid object.
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
        uss._errorLogger("isValidStepLengthCalculator", "the options parameter to be an object", options);
    }

    const _debugString = options.debugString || "isValidStepLengthCalculator";

    //Check if the passed stepLengthCalculator is a function.
    if(typeof fun !== "function") {
        uss._errorLogger(_debugString, "the stepLengthCalculator to be a function", fun);
    }

    //Check if the passed container is valid.
    if(options.container !== window && !(options.container instanceof HTMLElement)) {
        uss._errorLogger(_debugString, "the options parameter to be an object", options);
    }

    //Check if the passed totalScrollAmount is valid.
    if(!Number.isFinite(options.totalScrollAmount) || options.totalScrollAmount < 0) {
        uss._errorLogger(_debugString, "the options.totalScrollAmount parameter to be a positive number", options.totalScrollAmount);
    }

    //Check if the passed timeout is valid.
    if(!Number.isFinite(options.timeout) || options.timeout < 0) {
        uss._errorLogger(_debugString, "the options.timeout parameter to be a positive number", options.timeout);
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
    } catch (error) {
        try {
            uss._errorLogger(_debugString, "the stepLengthCalculator to return a valid step value", error);
        } catch(e){};
        return false;
    }

    //The passed stepLengthCalculator may have entered a loop.
    if(_exeededTimeLimit) {
        uss._warningLogger(fun.name || "the passed calculator", 
                           "didn't complete the test scroll-animation within " + _timeout + "ms", 
                           false
        );
    }
    
    return true;
}