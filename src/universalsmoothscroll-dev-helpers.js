const DEFAULT_TEST_CALCULATOR_SCROLL_VALUE = 100; //in px
const DEFAULT_TEST_CALCULATOR_DURATION = 10000;    //in ms

async function isValidStepLengthCalculator(stepLengthCalculator, container = uss.getPageScroller()) {
    if(typeof stepLengthCalculator !== "function") {
        uss._errorLogger("isValidStepLengthCalculator", "the stepLengthCalculator to be a function", stepLengthCalculator);
        return false;
    }
    
    const _originalTimestamp = performance.now();
    let _remaningScrollAmount = DEFAULT_TEST_CALCULATOR_SCROLL_VALUE;
    let _exeededTimeLimit = false;
    let _currentTimestamp;

    const _tester = (resolve, reject) => {
        _currentTimestamp = performance.now();
        const _testResult = stepLengthCalculator(
                                _remaningScrollAmount,                                        //remaningScrollAmount
                                _originalTimestamp,                                           //originalTimestamp
                                _currentTimestamp,                                            //currentTimestamp
                                DEFAULT_TEST_CALCULATOR_SCROLL_VALUE,                         //totalScrollAmount
                                DEFAULT_TEST_CALCULATOR_SCROLL_VALUE - _remaningScrollAmount, //currentXPosition
                                DEFAULT_TEST_CALCULATOR_SCROLL_VALUE,                         //finalXPosition
                                container                                                     //container
                            );
                            
        if(!Number.isFinite(_testResult)) {
            reject(_testResult);
            return;
        }

        _remaningScrollAmount -= _testResult;  
        _exeededTimeLimit = _currentTimestamp - _originalTimestamp > DEFAULT_TEST_CALCULATOR_DURATION;

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
                           "didn't complete the test scroll-animation within " + DEFAULT_TEST_CALCULATOR_DURATION + "ms", 
                           false
        );
    }
    
    return true;
}