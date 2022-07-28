#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Available Functions
Once imported, the [`universalsmoothscroll-min.js`](./Download.md) script will automatically declare and initialize _(in the global scope of your application)_ the `uss` object. <br/>
This object has the below listed properties and they are the core functionalities of the Universal Smooth Scroll API. <br/>
Each one of these functions can be invoked in this way: `uss.nameOfTheFunction(param1, param2, ...)`. <br/>

For instance:
```javascript
/**
 * In this example:
 * - an ease-out stepLengthCalculator is first set to control
 *   the scroll-animations on the y-axis of myContainer.
 * - the API is requested to scroll the y-axis of myContainer to 500px and 
 *   log "dOnE" when finished.
 * - the API is requested to extend the scroll-animation by 50px and 
 *   log "Done" instead of "dOnE" when finished.
 */
uss.setYStepLengthCalculator((r) => {return r / 20 + 1;}, myContainer);
uss.scrollYTo(500, myContainer, () => console.log("dOnE"));             
uss.scrollYBy(50,  myContainer, () => console.log("Done"), false);      
```
<br/>

Note: <br/> 
A **bold** input parameter's name means that it's a mandatory input _(its default value is always a <strong>✗</strong>)_. <br/>
An _italic_ input parameter's name means that it's an optional input.

<table>
 <thead>
  <tr>
   <th>Name</th>
   <th>Input Parameters</th>
   <th>Default values</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr id = "isXScrollingFun">
   <td rowspan = "1" align = "center">
    <code>isXScrolling</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#isXScrolling"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Returns <code>true</code> if a scroll-animation on the x-axis of the passed container is currently being performed by this API,<code>false</code> otherwise.
   </td>
  </tr>

  <tr id = "isYScrollingFun">
   <td rowspan = "1" align = "center">
    <code>isYScrolling</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#isYScrolling"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Returns <code>true</code> if a scroll-animation on the y-axis of the passed container is currently being performed by this API,<code>false</code> otherwise.
   </td>
  </tr>

  <tr id = "isScrollingFun">
   <td rowspan = "1" align = "center">
   <code>isScrolling</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#isScrolling"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Returns <code>true</code> if a scroll-animation on any axis of the passed container is currently being performed by this API,<code>false</code> otherwise.
   </td>
  </tr>

  <tr id = "getFinalXPositionFun">
   <td rowspan = "1" align = "center">
    <code>getFinalXPosition</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getFinalXPosition"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Returns the position <i>(in px)</i> at which the passed container will be at the end of the scroll-animation on the x-axis. <br/>
    The current position is returned if no scroll-animation is in place.
   </td>
  </tr>

  <tr id = "getFinalYPositionFun">
   <td rowspan = "1" align = "center">
    <code>getFinalYPosition</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getFinalYPosition"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Returns the position <i>(in px)</i> at which the passed container will be at the end of the scroll-animation on the y-axis. <br/> 
    The current position is returned if no scroll-animation is in place.
   </td>
  </tr>

  <tr id = "getScrollXDirectionFun">
   <td rowspan = "1" align = "center">
    <code>getScrollXDirection</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getScrollXDirection"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Returns the direction of the current scroll-animation on the x-axis of the passed container:
    <ul>
      <li>1 if its scrollLeft/scrollX will increase.</li>
      <li>-1 if its scrollLeft/scrollX will decrease.</li>
      <li>0 if there's no scroll-animation.</li>
    </ul>
   </td>
  </tr>

  <tr id = "getScrollYDirectionFun">
   <td rowspan = "1" align = "center">
    <code>getScrollYDirection</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getScrollYDirection"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Returns the direction of the current scroll-animation on the y-axis of the passed container:
    <ul>
      <li>1 if its scrollTop/scrollY will increase.</li>
      <li>-1 if its scrollTop/scrollY will decrease.</li>
      <li>0 if there's no scroll-animation.</li>
    </ul>
   </td>
  </tr>

  <tr id = "getXStepLengthCalculatorFun">
   <td rowspan = "2" align = "center">
    <code>getXStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getXStepLengthCalculator"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "2" align = "left">
    Returns the current <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> which controls the animations on the x-axis of the passed container if available.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getXStepLengthCalculator"><code>getTemporary</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
  
  <tr id = "getYStepLengthCalculatorFun">
   <td rowspan = "2" align = "center">
    <code>getYStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getYStepLengthCalculator"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "2" align = "left">
    Returns the current <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> which controls the animations on the y-axis of the passed container if available.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getYStepLengthCalculator"><code>getTemporary</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>

  <tr id = "getXStepLengthFun">
   <td rowspan = "1" align = "center">
    <code>getXStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_xStepLength"><code>_xStepLength</code></a> property.
   </td>
  </tr>   
  
  <tr id = "getYStepLengthFun">
   <td rowspan = "1" align = "center">
    <code>getYStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_yStepLength"><code>_yStepLength</code></a> property.
   </td>
  </tr> 
    
  <tr id = "getMinAnimationFrameFun">
   <td rowspan = "1" align = "center">
    <code>getMinAnimationFrame</code>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_minAnimationFrame"><code>_minAnimationFrame</code></a> property.
   </td>
  </tr> 
      
  <tr id = "getWindowHeightFun">
   <td rowspan = "1" align = "center">
    <code>getWindowHeight</code>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_windowHeight"><code>_windowHeight</code></a> property.
   </td>
  </tr> 
           
  <tr id = "getWindowWidthFun">
   <td rowspan = "1" align = "center">
    <code>getWindowWidth</code>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_windowWidth"><code>_windowWidth</code></a> property.
   </td>
  </tr> 
          
  <tr id = "getScrollbarsMaxDimensionFun">
   <td rowspan = "1" align = "center">
    <code>getScrollbarsMaxDimension</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getScrollbarsMaxDimension"><code>forceCalculation</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_scrollbarsMaxDimension"><code>_scrollbarsMaxDimension</code></a> property.
   </td>
  </tr> 
         
  <tr id = "getPageScrollerFun">
   <td rowspan = "1" align = "center">
    <code>getPageScroller</code>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a> property.
   </td>
  </tr> 
      
  <tr id = "getReducedMotionStateFun">
   <td rowspan = "1" align = "center">
    <code>getReducedMotionState</code>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_reducedMotion"><code>_reducedMotion</code></a> property.
   </td>
  </tr> 
    
  <tr id = "getOnResizeEndCallbacksFun">
   <td rowspan = "1" align = "center">
    <code>getOnResizeEndCallbacks</code>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_onResizeEndCallbacks"><code>_onResizeEndCallbacks</code></a> property.
   </td>
  </tr> 

  <tr id = "getDebugModeFun">
   <td rowspan = "1" align = "center">
    <code>getDebugMode</code>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Returns the value of the <a href = "./VariablesAbout.md#_debugMode"><code>_debugMode</code></a> property.
   </td>
  </tr> 
 
  <tr id = "setXStepLengthCalculatorFun">
   <td rowspan = "3" align = "center">
    <code>setXStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setXStepLengthCalculator"><code>newCalculator</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_XSTEP_LENGTH_CALCULATOR"><code>DEFAULT_XSTEP_LENGTH_CALCULATOR</code></a>
   </td>
   <td rowspan = "3" align = "left">
    Sets the <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> for <i>(the x-axis of)</i> the passed container if compatible.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setXStepLengthCalculator"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setXStepLengthCalculator"><code>isTemporary</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
  
  <tr id = "setYStepLengthCalculatorFun">
   <td rowspan = "3" align = "center">
    <code>setYStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setYStepLengthCalculator"><code>newCalculator</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_YSTEP_LENGTH_CALCULATOR"><code>DEFAULT_YSTEP_LENGTH_CALCULATOR</code></a>
   </td>
   <td rowspan = "3" align = "left">
    Sets the <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> for <i>(the y-axis of)</i> the passed container if compatible.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setYStepLengthCalculator"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setYStepLengthCalculator"><code>isTemporary</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>

  <tr id = "setStepLengthCalculatorFun">
   <td rowspan = "3" align = "center">
    <code>setStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#setStepLengthCalculator"><code>newCalculator</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "3" align = "left">
    Sets the <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> for <i>(both the y and x axes of)</i> the passed container if compatible.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setStepLengthCalculator"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setStepLengthCalculator"><code>isTemporary</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
    
  <tr id = "setXStepLengthFun">
   <td rowspan = "1" align = "center">
    <code>setXStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setXStepLength"><code>newXStepLength</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_XSTEP_LENGTH"><code>DEFAULT_XSTEP_LENGTH</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Sets the <a href = "./VariablesAbout.md#_xStepLength"><code>_xStepLength</code></a> property to the passed value if compatible.
   </td>
  </tr> 
     
  <tr id = "setYStepLengthFun">
   <td rowspan = "1" align = "center">
    <code>setYStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setYStepLength"><code>newYStepLength</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_YSTEP_LENGTH"><code>DEFAULT_YSTEP_LENGTH</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Sets the <a href = "./VariablesAbout.md#_yStepLength"><code>_yStepLength</code></a> property to the passed value if compatible.
   </td>
  </tr> 
       
  <tr id = "setStepLengthFun">
   <td rowspan = "1" align = "center">
    <code>setStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#setStepLength"><code>newStepLength</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Sets both the <a href = "./VariablesAbout.md#_xStepLength"><code>_xStepLength</code></a> and <a href = "./VariablesAbout.md#_yStepLength"><code>_yStepLength</code></a> properties to the passed value if compatible.
   </td>
  </tr> 
        
  <tr id = "setMinAnimationFrameFun">
   <td rowspan = "1" align = "center">
    <code>setMinAnimationFrame</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setMinAnimationFrame"><code>newMinAnimationFrame</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_MIN_ANIMATION_FRAMES"><code>DEFAULT_MIN_ANIMATION_FRAMES</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Sets the <a href = "./VariablesAbout.md#_minAnimationFrame"><code>_minAnimationFrame</code></a> property to the passed value if compatible.
   </td>
  </tr> 
       
  <tr id = "setPageScrollerFun">
   <td rowspan = "1" align = "center">
    <code>setPageScroller</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#setPageScroller"><code>newPageScroller</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Sets the <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a> property to the passed value if compatible.
   </td>
  </tr> 

  <tr id = "addOnResizeEndCallbackFun">
   <td rowspan = "1" align = "center">
    <code>addOnResizeEndCallback</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#addOnResizeEndCallback"><code>newCallback</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "1" align = "left">
    Adds the passed function to the <a href = "./VariablesAbout.md#_onResizeEndCallbacks"><code>_onResizeEndCallbacks</code></a> array. 
   </td>
  </tr> 
       
  <tr id = "setDebugModeFun">
   <td rowspan = "1" align = "center">
    <code>setDebugMode</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setDebugMode"><code>newDebugMode</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>""</code>
   </td>
   <td rowspan = "1" align = "left">
    Sets the <a href = "./VariablesAbout.md#_debugMode"><code>_debugMode</code></a> property to the passed value if compatible.
   </td>
  </tr> 

  <tr id = "setErrorLoggerFun">
   <td rowspan = "1" align = "center">
    <code>setErrorLogger</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setErrorLogger"><code>newErrorLogger</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_ERROR_LOGGER"><code>DEFAULT_ERROR_LOGGER</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Sets the <a href = "./VariablesAbout.md#_errorLogger"><code>_errorLogger</code></a> property to the passed value if compatible.
   </td>
  </tr> 
  
  <tr id = "setWarningLoggerFun">
   <td rowspan = "1" align = "center">
    <code>setWarningLogger</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#setWarningLogger"><code>newWarningLogger</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_WARNING_LOGGER"><code>DEFAULT_WARNING_LOGGER</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Sets the <a href = "./VariablesAbout.md#_warningLogger"><code>_warningLogger</code></a> property to the passed value if compatible.
   </td>
  </tr> 
               
  <tr id = "calcXScrollbarDimensionFun">
   <td rowspan = "2" align = "center">
    <code>calcXScrollbarDimension</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#calcXScrollbarDimension"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "2" align = "left">
    Returns the vertical scrollbar's width <i> (in px) </i> of the passed element. </li>
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#calcXScrollbarDimension"><code>forceCalculation</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>

  <tr id = "calcYScrollbarDimensionFun">
   <td rowspan = "2" align = "center">
    <code>calcYScrollbarDimension</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#calcYScrollbarDimension"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "2" align = "left">
    Returns the horizontal scrollbar's height <i> (in px) </i> of the passed element. </li>
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#calcYScrollbarDimension"><code>forceCalculation</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>

  <tr id = "calcScrollbarsDimensionsFun">
   <td rowspan = "2" align = "center">
    <code>calcScrollbarsDimensions</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#calcScrollbarsDimensions"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "2" align = "left">
    Returns an array containing 2 numbers: 
    <ol start="0">
     <li> Contains the vertical scrollbar's width <i> (in px) </i> of the passed element. </li> 
     <li> Contains the horizontal scrollbar's height <i> (in px) </i> of the passed element. </li> 
    </ol>
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#calcScrollbarsDimensions"><code>forceCalculation</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
           
  <tr id = "calcBordersDimensionsFun">
   <td rowspan = "2" align = "center">
    <code>calcBordersDimensions</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#calcBordersDimensions"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "2" align = "left">
    Returns an array containing 4 numbers: 
    <ol start="0"> 
     <li> Contains the top border's height <i> (in px) </i> of the passed element. </li> 
     <li> Contains the right border's width <i> (in px) </i> of the passed element. </li> 
     <li> Contains the bottom border's height <i> (in px) </i> of the passed element. </li> 
     <li> Contains the left border's width <i> (in px) </i> of the passed element. </li> 
    </ol>
    The returned border sizes don't take into consideration the css <code>transform</code> property's effects.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#calcBordersDimensions"><code>forceCalculation</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
           
  <tr id = "getScrollXCalculatorFun">
   <td rowspan = "1" align = "center">
    <code>getScrollXCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getScrollXCalculator"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Returns a function that when invoked: 
    <ul> 
     <li> Returns the scrollLeft property of the passed container if it's an instance of HTMLElement. </li> 
     <li> Returns the scrollX property of the passed container if it's the window element. </li> 
    </ul>
   </td>
  </tr> 
             
  <tr id = "getScrollYCalculatorFun">
   <td rowspan = "1" align = "center">
    <code>getScrollYCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getScrollYCalculator"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Returns a function that when invoked: 
    <ul> 
     <li> Returns the scrollTop property of the passed container if it's an instance of HTMLElement. </li> 
     <li> Returns the scrollY property of the passed container if it's the window element. </li> 
    </ul>
   </td>
  </tr> 
               
  <tr id = "getMaxScrollXFun">
   <td rowspan = "2" align = "center">
    <code>getMaxScrollX</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getMaxScrollX"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "2" align = "left">
    Returns the highest reacheable scrollLeft/scrollX value of the passed container.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getMaxScrollX"><code>forceCalculation</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
                 
  <tr id = "getMaxScrollYFun">
   <td rowspan = "2" align = "center">
    <code>getMaxScrollY</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getMaxScrollY"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "2" align = "left">
    Returns the highest reacheable scrollTop/scrollY value of the passed container.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getMaxScrollY"><code>forceCalculation</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
                 
  <tr id = "getXScrollableParentFun">
   <td rowspan = "2" align = "center">
    <code>getXScrollableParent</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#getXScrollableParent"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "2" align = "left">
    Returns the first scrollable container <i>(on the x-axis)</i> of the passed element or null if it doesn't have one.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getXScrollableParent"><code>includeHiddenParents</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
                   
  <tr id = "getYScrollableParentFun">
   <td rowspan = "2" align = "center">
    <code>getYScrollableParent</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#getYScrollableParent"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "2" align = "left">
    Returns the first scrollable container <i>(on the y-axis)</i> of the passed element or null if it doesn't have one.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getYScrollableParent"><code>includeHiddenParents</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
                     
  <tr id = "getScrollableParentFun">
   <td rowspan = "2" align = "center">
    <code>getScrollableParent</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#getScrollableParent"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "2" align = "left">
    Returns the first scrollable container <i>(on either the x or y axis)</i> of the passed element or null if it doesn't have one.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getScrollableParent"><code>includeHiddenParents</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
                        
  <tr id = "getAllScrollableParentsFun">
   <td rowspan = "3" align = "center">
    <code>getAllScrollableParents</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#getAllScrollableParents"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "3" align = "left">
    Returns an array of all the scrollable containers <i>(on either the x or y axis)</i> of the passed element.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getAllScrollableParents"><code>includeHiddenParents</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#getAllScrollableParents"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
                        
  <tr id = "scrollXToFun">
   <td rowspan = "3" align = "center">
    <code>scrollXTo</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollXTo"><code>finalXPosition</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "3" align = "left">
    Scrolls the x-axis of the passed container to the specified position <i>(in px)</i> if possible.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollXTo"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollXTo"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
                        
  <tr id = "scrollYToFun">
   <td rowspan = "3" align = "center">
    <code>scrollYTo</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollYTo"><code>finalYPosition</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "3" align = "left">
    Scrolls the y-axis of the passed container to the specified position <i>(in px)</i> if possible.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollYTo"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollYTo"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
                        
  <tr id = "scrollXByFun">
   <td rowspan = "4" align = "center">
    <code>scrollXBy</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollXBy"><code>deltaX</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "4" align = "left">
    Scrolls the x-axis the passed container by the specified amount of pixels if possible.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollXBy"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollXBy"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollXBy"><code>stillStart</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>true</code>
   </td>
  </tr>
                       
  <tr id = "scrollYByFun">
   <td rowspan = "4" align = "center">
    <code>scrollYBy</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollYBy"><code>deltaY</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "4" align = "left">
    Scrolls the y-axis the passed container by the specified amount of pixels if possible.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollYBy"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollYBy"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollYBy"><code>stillStart</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>true</code>
   </td>
  </tr>
                       
  <tr id = "scrollToFun">
   <td rowspan = "4" align = "center">
    <code>scrollTo</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollTo"><code>finalXPosition</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "4" align = "left">
    Scrolls both the x and y axes of the passed container to the specified positions <i>(in px)</i> if possible.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollTo"><code>finalYPosition</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollTo"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollTo"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
                         
  <tr id = "scrollByFun">
   <td rowspan = "5" align = "center">
    <code>scrollBy</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollBy"><code>deltaX</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "5" align = "left">
    Scrolls both the x and y axes of the passed container by the specified amounts of pixels if possible.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollBy"><code>deltaY</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollBy"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollBy"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollBy"><code>stillStart</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>true</code>
   </td>
  </tr>
                         
  <tr id = "scrollIntoViewFun">
   <td rowspan = "5" align = "center">
    <code>scrollIntoView</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollIntoView"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "5" align = "left">
    Scrolls all the scrollable parents of the passed element in order to make it visible on the screen with the specified alignments.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollIntoView"><code>alignToLeft</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>true</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollIntoView"><code>alignToTop</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>true</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollIntoView"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollIntoView"><code>includeHiddenParents</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
                           
  <tr id = "scrollIntoViewIfNeededFun">
   <td rowspan = "4" align = "center">
    <code>scrollIntoViewIfNeeded</code>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./FunctionsAbout.md#scrollIntoViewIfNeeded"><code>element</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "4" align = "left">
    Scrolls all the scrollable parents of the passed element in order to make it visible on the screen with the specified alignment only if it's not already visible.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollIntoViewIfNeeded"><code>alignToCenter</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>true</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollIntoViewIfNeeded"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#scrollIntoViewIfNeeded"><code>includeHiddenParents</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
 
  <tr id = "stopScrollingXFun">
   <td rowspan = "2" align = "center">
    <code>stopScrollingX</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#stopScrollingX"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "2" align = "left">
    Stops the current scroll-animation on the x-axis of the passed container.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#stopScrollingX"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
 
  <tr id = "stopScrollingYFun">
   <td rowspan = "2" align = "center">
    <code>stopScrollingY</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#stopScrollingY"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "2" align = "left">
    Stops the current scroll-animation on the y-axis of the passed container.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#stopScrollingY"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
     
  <tr id = "stopScrollingFun">
   <td rowspan = "2" align = "center">
    <code>stopScrolling</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#stopScrolling"><code>container</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
   <td rowspan = "2" align = "left">
    Stops the current scroll-animations on both the x and y axes of the passed container.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#stopScrolling"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "stopScrollingAllFun">
   <td rowspan = "1" align = "center">
    <code>stopScrollingAll</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#stopScrollingAll"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
   <td rowspan = "1" align = "left">
    Stops all the current scroll-animations on both the x and y axes of all the containers.
   </td>
  </tr>
                        
  <tr id = "hrefSetupFun">
   <td rowspan = "6" align = "center">
    <code>hrefSetup</code>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#hrefSetup"><code>alignToLeft</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>true</code>
   </td>
   <td rowspan = "6" align = "left">
    Automatically binds every valid anchor (<code>&lt;a&gt;</code> and <code>&lt;area&gt;</code> in the DOM) to the corresponding element that should be scrolled into view. <br/>
    Whenever a valid anchor is clicked the passed <code>init</code> function is invoked and if it doesn't return <code>false</code>, a scroll-animation will bring into view the linked element and the browser's history will be updated <i>(if requested)</i>.
   </td>
  </tr> 
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#hrefSetup"><code>alignToTop</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>true</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#hrefSetup"><code>init</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#hrefSetup"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#hrefSetup"><code>includeHiddenParents</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./FunctionsAbout.md#hrefSetup"><code>updateHistory</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>false</code>
   </td>
  </tr>
 </tbody>
</table>

---
<br/>

# Input parameters details
The following table describes every entry of the `Input Parameters` column of the table above.
<br/>
<br/>

<table>
 <thead>
  <tr>
  <th>Name</th>
  <th>Parameter Name</th>
  <th>Parameter Type</th>
  <th>Parameter Description</th>
  </tr>
 </thead>
 <tbody>
  <tr id = "isXScrolling">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#isXScrollingFun"><code>isXScrolling</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  
  </tr>
  <tr id = "isYScrolling">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#isYScrollingFun"><code>isYScrolling</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  
  <tr id = "isScrolling">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#isScrollingFun"><code>isScrolling</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  
  <tr id = "getFinalXPosition">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#getFinalXPositionFun"><code>getFinalXPosition</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  
  <tr id = "getFinalYPosition">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#getFinalYPositionFun"><code>getFinalYPosition</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>

  <tr id = "getScrollXDirection">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#getScrollXDirectionFun"><code>getScrollXDirection</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>

  <tr id = "getScrollYDirection">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#getScrollYDirectionFun"><code>getScrollYDirection</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  
  <tr id = "getXStepLengthCalculator">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#getXStepLengthCalculatorFun"><code>getXStepLengthCalculator</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>getTemporary</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    If <code>true</code> the returned <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> is the temporary one set for the x-axis of this container, otherwise it's the standard one.
  </td>
  </tr>
  
  <tr id = "getYStepLengthCalculator">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#getYStepLengthCalculatorFun"><code>getYStepLengthCalculator</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>getTemporary</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    If <code>true</code> the returned <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> is the temporary one set for the y-axis of this container, otherwise it's the standard one.
  </td>
  </tr>
  
  <tr id = "getScrollbarsMaxDimension">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#getScrollbarsMaxDimensionFun"><code>getScrollbarsMaxDimension</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>forceCalculation</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    If <code>true</code> flushes the internal cache for the <a href = "./VariablesAbout.md#_scrollbarsMaxDimension"><code>_scrollbarsMaxDimension</code></a> variable and forces its recalculation <i>(expensive operation)</i> before returning it. <br/>
    If <code>false</code> the result is returned from cache. 
  </td>
  </tr>

  <tr id = "setXStepLengthCalculator">
  <td rowspan = "3" align = "center">
    <a href = "./FunctionsAbout.md#setXStepLengthCalculatorFun"><code>setXStepLengthCalculator</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newCalculator</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A valid <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a>.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>  
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>isTemporary</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    If <code>true</code>, <code>newCalculator</code> will control only the next scroll-animation on the x-axis of this container and it will be automatically discarded at the end of it. <br/>
    If <code>false</code> every scroll-animation on the x-axis of this container will be controlled by <code>newCalculator</code>. <br/>
    If a container has both a temporary and non-temporary <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> set for its x-axis, the temporary one will controll the next scroll-animation on the x-axis of the container. <br/>
    Setting a temporary <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> will only overwrite the previous temporary one. <br/>
    Setting a non-temporary <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> will overwrite the previous non-temporary one and discard any temporary one. <br/>
  </td>
  </tr>
  
  <tr id = "setYStepLengthCalculator">
  <td rowspan = "3" align = "center">
    <a href = "./FunctionsAbout.md#setYStepLengthCalculatorFun"><code>setYStepLengthCalculator</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newCalculator</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A valid <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a>.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>  
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>isTemporary</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    If <code>true</code>, <code>newCalculator</code> will control only the next scroll-animation on the y-axis of this container and it will be automatically discarded at the end of it. <br/>
    If <code>false</code> every scroll-animation on the y-axis of this container will be controlled by <code>newCalculator</code>. <br/>
    If a container has both a temporary and non-temporary <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> set for its y-axis, the temporary one will controll the next scroll-animation on the y-axis of the container. <br/>
    Setting a temporary <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> will only overwrite the previous temporary one. <br/>
    Setting a non-temporary <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> will overwrite the previous non-temporary one and discard any temporary one. <br/>
  </td>
  </tr> 
  
  <tr id = "setStepLengthCalculator">
  <td rowspan = "3" align = "center">
    <a href = "./FunctionsAbout.md#setStepLengthCalculatorFun"><code>setStepLengthCalculator</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newCalculator</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A valid <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a>.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>  
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>isTemporary</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    If <code>true</code>, <code>newCalculator</code> will control only the next scroll-animation on the x-axis and the next one on the y-axis of this container. <br/>
    It will automatically be discarded separately for each axis whenever the next scroll-animation on an axis is completed. <br/>
    If <code>false</code> every scroll-animation on both the x and y axes of this container will be controlled by <code>newCalculator</code>. <br/>
    If a container has both a temporary and non-temporary <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a>, the temporary one will controll the next scroll-animation of the container. <br/>
    Setting a temporary <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> will only overwrite the previous temporary one. <br/>
    Setting a non-temporary <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> will overwrite the previous non-temporary one and discard any temporary one. <br/>
  </td>
  </tr> 

  <tr id = "setXStepLength">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#setXStepLengthFun"><code>setXStepLength</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newXStepLength</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A number > 0.
  </td>
  </tr>
  
  <tr id = "setYStepLength">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#setYStepLengthFun"><code>setYStepLength</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newYStepLength</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A number > 0.
  </td>
  </tr>
    
  <tr id = "setStepLength">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#setStepLengthFun"><code>setStepLength</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newStepLength</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A number > 0.
  </td>
  </tr>
  
  <tr id = "setMinAnimationFrame">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#setMinAnimationFrameFun"><code>setMinAnimationFrame</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newMinAnimationFrame</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A number > 0.
  </td>
  </tr>
    
  <tr id = "setPageScroller">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#setPageScrollerFun"><code>setPageScroller</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newPageScroller</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A number > 0.
  </td>

  <tr id = "addOnResizeEndCallback">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#addOnResizeEndCallbackFun"><code>addOnResizeEndCallback</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newCallback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function that will be executed only once the user has finished resizing the window and has <a href = "./VariablesAbout.md#_onResizeEndCallbacks"><code><i>interacted</i></code></a> with it.
  </td>
  </tr>
    
  <tr id = "setDebugMode">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#setDebugModeFun"><code>setDebugMode</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newDebugMode</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>String</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>"legacy"</code>, <code>"disabled"</code> or any other <i><strong>string</strong></i>. <br/>
    This function is <i><strong>not</strong></i> case sensitive.
  </td>
  </tr>
  
  <tr id = "setErrorLogger">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#setErrorLoggerFun"><code>setErrorLogger</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newErrorLogger</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function that should log the API's <strong>error messages</strong>. <br/>
    It is always passed the following input parameters <i>(in this order)</i>: 
    <ul>
      <li>The name of the function that has invoked this logger</li>
      <li>What the invoking function was expecting</li>
      <li>What the invoking function received as its input</li>
    </ul>
    The instructions given by the <a href = "./VariablesAbout.md#_debugMode"><code>_debugMode</code></a> property value should be followed.
  </td>
  </tr>
    
  <tr id = "setWarningLogger">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#setWarningLoggerFun"><code>setWarningLogger</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>newWarningLogger</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function that should log the API's <strong>warning messages</strong>. <br/>
    It is always passed the following input parameters <i>(in this order)</i>: 
    <ul>
      <li>The element that caused this function to be invoked</li>
      <li>The warning message</li>
      <li>A boolean that is <code>true</code> if the first parameter is a string and its quotation marks should be displayed, <code>false</code> otherwise.</li>
    </ul>
    The instructions given by the <a href = "./VariablesAbout.md#_debugMode"><code>_debugMode</code></a> property value should be followed.
  </td>
  </tr>
  
  </tr>
    <tr id = "calcXScrollbarDimension">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#calcXScrollbarDimensionFun"><code>calcXScrollbarDimension</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>forceCalculation</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code> flushes the internal cache for the vertical scrollbar's width value of the passed container and forces its recalculation <i>(expensive operation)</i>. <br/>
    If <code>false</code> the result is returned from cache. 
   </td>
  </tr>

  </tr>
    <tr id = "calcYScrollbarDimension">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#calcYScrollbarDimensionFun"><code>calcYScrollbarDimension</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>forceCalculation</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code> flushes the internal cache for the horizontal scrollbar's height value of the passed container and forces its recalculation <i>(expensive operation)</i>. <br/>
    If <code>false</code> the result is returned from cache. 
   </td>
  </tr>

  </tr>
    <tr id = "calcScrollbarsDimensions">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#calcScrollbarsDimensionsFun"><code>calcScrollbarsDimensions</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>forceCalculation</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code> flushes the internal caches for both the vertical scrollbar's width and the horizontal scrollbar's height values of the passed container and forces their recalculation <i>(expensive operation)</i>. <br/>
    If <code>false</code> the result is returned from cache. 
   </td>
  </tr>
      
  </tr>
    <tr id = "calcBordersDimensions">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#calcBordersDimensionsFun"><code>calcBordersDimensions</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>forceCalculation</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code> flushes the internal caches for all borders dimensions of the passed container and forces their recalculation <i>(expensive operation)</i>. <br/>
    If <code>false</code> the result is returned from cache. 
   </td>
  </tr>
      
  </tr>
    <tr id = "getScrollXCalculator">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#getScrollXCalculatorFun"><code>getScrollXCalculator</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
        
  </tr>
    <tr id = "getScrollYCalculator">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#getScrollYCalculatorFun"><code>getScrollYCalculator</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
        
  </tr>
    <tr id = "getMaxScrollX">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#getMaxScrollXFun"><code>getMaxScrollX</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>forceCalculation</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code> flushes the internal cache for the highest reachable scrollLeft/scrollX value of the passed container and forces its recalculation <i>(expensive operation that triggers a <code>scroll</code> event on the passed container)</i>. <br/>
    If <code>false</code> the result is returned from cache. 
   </td>
  </tr>
          
  </tr>
    <tr id = "getMaxScrollY">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#getMaxScrollYFun"><code>getMaxScrollY</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>forceCalculation</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code> flushes the internal cache for the highest reachable scrollTop/scrollY value of the passed container and forces its recalculation <i>(expensive operation that triggers a <code>scroll</code> event on the passed container)</i>. <br/>
    If <code>false</code> the result is returned from cache. 
   </td>
  </tr>
  
  <tr id = "getXScrollableParent">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#getXScrollableParentFun"><code>getXScrollableParent</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if the first scrollable parent <i>(on the x-axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-x:hidden</code>, <code>false</code> otherwise.
  </td>
  </tr>
    
  <tr id = "getYScrollableParent">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#getYScrollableParentFun"><code>getYScrollableParent</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if the first scrollable parent <i>(on the y-axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-y:hidden</code>, <code>false</code> otherwise.
  </td>
  </tr>
      
  <tr id = "getScrollableParent">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#getScrollableParentFun"><code>getScrollableParent</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if the first scrollable parent <i>(on either the x or y axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-x:hidden</code> or <code>overflow-y:hidden</code>, <code>false</code> otherwise.
  </td>
  </tr>
        
  <tr id = "getAllScrollableParents">
  <td rowspan = "3" align = "center">
    <a href = "./FunctionsAbout.md#getAllScrollableParentsFun"><code>getAllScrollableParents</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if any of the scrollable parents <i>(on either the x or y axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-x:hidden</code> or <code>overflow-y:hidden</code>, <code>false</code> otherwise.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked every time a scrollable parent of <code>element</code> is found. <br/>
    When <code>callback</code> is invoked, it is passed <i>(as an input parameter)</i> the scrollable parent found.
  </td>
  </tr>
          
  <tr id = "scrollXTo">
  <td rowspan = "3" align = "center">
    <a href = "./FunctionsAbout.md#scrollXToFun"><code>scrollXTo</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>finalXPosition</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A finite number.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
  </td>
  </tr>
  
            
  <tr id = "scrollYTo">
  <td rowspan = "3" align = "center">
    <a href = "./FunctionsAbout.md#scrollYToFun"><code>scrollYTo</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>finalYPosition</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A finite number.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
  </td>
  </tr>
              
  <tr id = "scrollXBy">
  <td rowspan = "4" align = "center">
    <a href = "./FunctionsAbout.md#scrollXByFun"><code>scrollXBy</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>deltaX</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A finite number.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>stillStart</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if any on-going scroll-animation on the x-axis of <code>container</code> must be stopped before starting this animation. <br/>
    <code>false</code> if any on-going scroll-animation on the x-axis of <code>container</code> should extended by <code>deltaX</code> if possible.
  </td>
  </tr>
              
  <tr id = "scrollYBy">
  <td rowspan = "4" align = "center">
    <a href = "./FunctionsAbout.md#scrollYByFun"><code>scrollYBy</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>deltaY</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A finite number.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>stillStart</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if any on-going scroll-animation on the y-axis of <code>container</code> must be stopped before starting this animation. <br/>
    <code>false</code> if any on-going scroll-animation on the y-axis of <code>container</code> should extended by <code>deltaY</code> if possible.
  </td>
  </tr>
                
  <tr id = "scrollTo">
  <td rowspan = "4" align = "center">
    <a href = "./FunctionsAbout.md#scrollToFun"><code>scrollTo</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>finalXPosition</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A finite number.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>finalYPosition</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A finite number.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed. <br/>
    If one of the two scroll-animations triggered by <a href = "./FunctionsAbout.md#scrollToFun"><code>scrollTo</code></a> (one for each axis) is <strong><i>interrupted/altered</i></strong>, the <code>callback</code> is executed whenever the remaning/unaltered one is completed.
  </td>
  </tr>
              
  <tr id = "scrollBy">
  <td rowspan = "5" align = "center">
    <a href = "./FunctionsAbout.md#scrollByFun"><code>scrollBy</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>deltaX</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A finite number.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>deltaY</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Number</code>
  </td>
  <td rowspan = "1" align = "left">
    A finite number.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed. <br/>
    If one of the two scroll-animations triggered by <a href = "./FunctionsAbout.md#scrollByFun"><code>scrollBy</code></a> (one for each axis) is <strong><i>interrupted/altered</i></strong>, the <code>callback</code> is executed whenever the remaning/unaltered one is completed.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>stillStart</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if any on-going scroll-animation on either the x and y axes of <code>container</code> must be stopped before starting this animation. <br/>
    <code>false</code> if any on-going scroll-animation on either the x and y axes of <code>container</code> should extended by respectively <code>deltaX</code> and <code>deltaY</code> if possible.
  </td>
  </tr> 
                
  <tr id = "scrollIntoView">
  <td rowspan = "5" align = "center">
    <a href = "./FunctionsAbout.md#scrollIntoViewFun"><code>scrollIntoView</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>alignToLeft</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if the alignment <i>(on the x-axis)</i> of <code>element</code> and all its scrollable parents should be to the left. <br/>
    <code>false</code> if the alignment <i>(on the x-axis)</i> of <code>element</code> and all its scrollable parents should be to the right. <br/>
    <code>"nearest"</code> if the alignment <i>(on the x-axis)</i> of <code>element</code> and all its scrollable parents should be to the closest side: the alignment of each container is decided by measuring its position <i>(on the x-axis)</i> relative to its closest scrollable parent. <br/>
    <strong><i>Any other value</i></strong>, if the alignment <i>(on the x-axis)</i> of <code>element</code> and all its scrollable parents should be to the center. <br/>
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>alignToTop</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if the alignment <i>(on the y-axis)</i> of <code>element</code> and all its scrollable parents should be to the left. <br/>
    <code>false</code> if the alignment <i>(on the y-axis)</i> of <code>element</code> and all its scrollable parents should be to the right. <br/>
    <code>"nearest"</code> if the alignment <i>(on the y-axis)</i> of <code>element</code> and all its scrollable parents should be to the closest side: the alignment of each container is decided by measuring its position <i>(on the y-axis)</i> relative to its closest scrollable parent. <br/>
    <strong><i>Any other value</i></strong>, if the alignment <i>(on the y-axis)</i> of <code>element</code> and all its scrollable parents should be to the center. <br/>
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when the passed container is successfully scrolled into view.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if any of the scrollable parents <i>(on either the x or y axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-x:hidden</code> or <code>overflow-y:hidden</code>, <code>false</code> otherwise.
  </td>
  </tr>
                  
  <tr id = "scrollIntoViewIfNeeded">
  <td rowspan = "4" align = "center">
    <a href = "./FunctionsAbout.md#scrollIntoViewIfNeededFun"><code>scrollIntoViewIfNeeded</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>element</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>alignToCenter</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if the alignment <i>(on both the x and y axes)</i> of <code>element</code> should be to the center of its closest scrollable parent. <br/>
    <strong><i>Any other value</i></strong>, if the alignment <i>(on both the x and y axes)</i> of <code>element</code> and all its scrollable parents should be to the closest side (<i>align-to-nearest</i>): the alignment of each container is decided by measuring its position <i>(on either the x and y axis)</i> relative to its closest scrollable parent. <br/>
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when the passed container is successfully scrolled into view.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if any of the scrollable parents <i>(on either the x or y axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-x:hidden</code> or <code>overflow-y:hidden</code>, <code>false</code> otherwise.
  </td>
  </tr>
            
  <tr id = "stopScrollingX">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#stopScrollingXFun"><code>stopScrollingX</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when the current scroll-animation on the x-axis of the passed container has been stopped.
  </td>
  </tr>
              
  <tr id = "stopScrollingY">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#stopScrollingYFun"><code>stopScrollingY</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when the current scroll-animation on the y-axis of the passed container has been stopped.
  </td>
  </tr>
              
  <tr id = "stopScrolling">
  <td rowspan = "2" align = "center">
    <a href = "./FunctionsAbout.md#stopScrollingFun"><code>stopScrolling</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>container</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when the current scroll-animations on both the x and y axes of the passed container have been stopped.
  </td>
  </tr>

  <tr id = "stopScrollingAll">
  <td rowspan = "1" align = "center">
    <a href = "./FunctionsAbout.md#stopScrollingAllFun"><code>stopScrollingAll</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when all the current scroll-animations on both the x and y axes of all the containers have been stopped.
  </td>
  </tr>
  
  <tr id = "hrefSetup">
  <td rowspan = "6" align = "center">
    <a href = "./FunctionsAbout.md#hrefSetupFun"><code>hrefSetup</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>alignToLeft</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if the alignment <i>(on the x-axis)</i> of every anchor's destination and all its scrollable parents should be to the left. <br/>
    <code>false</code> if the alignment <i>(on the x-axis)</i> of every anchor's destination and all its scrollable parents should be to the right. <br/>
    <code>"nearest"</code> if the alignment <i>(on the x-axis)</i> of every anchor's destination and all its scrollable parents should be to the closest side: the alignment of each container is decided by measuring its position <i>(on the x-axis)</i> relative to its closest scrollable parent. <br/>
    <strong><i>Any other value</i></strong>, if the alignment <i>(on the x-axis)</i> of every anchor's destination and all its scrollable parents should be to the center. <br/>
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>alignToTop</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Object</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if the alignment <i>(on the y-axis)</i> of every anchor's destination and all its scrollable parents should be to the left. <br/>
    <code>false</code> if the alignment <i>(on the y-axis)</i> of every anchor's destination and all its scrollable parents should be to the right. <br/>
    <code>"nearest"</code> if the alignment <i>(on the y-axis)</i> of every anchor's destination and all its scrollable parents should be to the closest side: the alignment of each container is decided by measuring its position <i>(on the y-axis)</i> relative to its closest scrollable parent. <br/>
    <strong><i>Any other value</i></strong>, if the alignment <i>(on the y-axis)</i> of every anchor's destination and all its scrollable parents should be to the center. <br/>
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>init</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when any anchor is clicked. <br/>
    If <code>init</code> returns <code>false</code>, the click is ignored. <br/>
    When invoked, <code>init</code> is always passed the following input parameters <i>(in this order)</i>: 
    <ul> 
    <li>The anchor that has been clicked.</li>
    <li>The anchor's destination element.</li>
    </ul>
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>callback</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function which is invoked when any anchor's destination element is successfully scrolled into view.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
  </td> 
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    <code>true</code> if any of the scrollable parents <i>(on either the x or y axis)</i> of any anchor's destination has the css properties <code>overflow:hidden</code> or <code>overflow-x:hidden</code> or <code>overflow-y:hidden</code>, <code>false</code> otherwise.
  </td>
  </tr>
  <tr>
  <td rowspan = "1" align = "center">
    <code>updateHistory</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Boolean</code>
  </td>
  <td rowspan = "1" align = "left">
    If <code>true</code>, the browser's history is updated every time a valid anchor is clicked and navigating through history triggers a smooth scroll-animation to the corresponding fragment.
    If <code>false</code>, the browser's history is never updated by the API and navigating through history produces the default <i>jump-to-position</i> behavior.
  </td>
  </tr>
 </tbody>
</table>

<br/>

#### <p align="right"><a href = "./EaseFunctions.md"><code>Go to next section &#8680;</code></a></p>
