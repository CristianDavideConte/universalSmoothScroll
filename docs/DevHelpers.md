#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Dev-Helpers <sup><code>library</code></sup>
## Import
This library cannot be used without having imported the [`universalsmoothscroll-min.js`](./Installation.md) script in your project first. <br/>
This library is also a [`module`]("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules") so each function you see below must be imported before you can use it.

For example:
```javascript
  //The name of these and more other functions is in the table below.
  import {
    isValidStepLengthCalculator
  } from "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-dev-helpers-min.js";

  //From here I can start using the imported functions.
  ...
```

---

## Usage
This library contains functions that should help you with the more challenging aspect of the Universal Smooth Scroll API (e.g. how to create a correct [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator)). <br/>
This library is meant to be used during the development phase of your website only and it's not internally used by the API, so it should be removed from the project before the deployment phase (nothing will happens if you forgot to, don't worry).

In this library each function has this structure: `functionName(mandatoryParam1, ... , mandatoryParamN, options)`. <br/>
The `options` parameter must either be completely omitted or fully specified. <br/> 

For instance: 
```javascript
//Here we fully specify the "options" parameter.
let result1 = await isValidStepLengthCalculator(
  myFunction1,
  { //This is the "options" parameter
    container: myContainer,
    totalScrollAmount: 500,
    timeout: 1000
  }
);

//Omitting the options parameter is also valid.
let result2 = await isValidStepLengthCalculator(myFunction1);

if(!result1 || !result2) {
  //Throw error...
  //Fix myFunction1...
}
```

<strong>Note:</strong> </br> 
A **bold** input parameter's name means that it's a mandatory input. <br/>
An _italic_ input parameter's name means that it's an optional parameter. <br/>

<table>
 <thead>
  <tr>
   <th>Name</th>
   <th>Type</th>
   <th colspan = "2" >Input Parameters</th>
   <th>Default values</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr id = "isValidStepLengthCalculatorFun">
   <td rowspan = "4" align = "center">
    <code>isValidStepLengthCalculator</code>
   </td>
   <td rowspan = "4" align = "center">
    <code>async</code>
   </td>
   <td colspan = "2" rowspan = "1" align = "center">
   <strong>
    <a href = "./DevHelpers.md#isValidStepLengthCalculator"><code>fun</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
   <td rowspan = "4" align = "left">
    Tests the passed function by performing a dummy scroll-animation <i>(no actual scroll takes place)</i>. <br/> 
    Errors/warnings will be logged in the console during the testing process. <br/>
    Returns <code>true</code> if the passed function is a valid <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a>. <br/>
    Returns <code>false</code> otherwise.
   </td>
  </tr>

  <tr>
   <td rowspan = "3" align = "center">
   <i>
    <a href = "./DevHelpers.md#isValidStepLengthCalculator"><code>options</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <code>container</code>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>

  <tr>
    <td rowspan = "1" align = "center">
    <strong>
     <code>totalScrollAmount</code>
    </strong>
    </td>
    <td rowspan = "1" align = "center">
     <code>100</code>
    </td>
  </tr>

  <tr>
   <td rowspan = "1" align = "center">
   <strong>
     <code>timeout</code>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
     <code>5000</code>
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
  <th colspan = "2">Parameter Name</th>
  <th>Parameter Type</th>
  <th>Parameter Description</th>
  </tr>
 </thead>
 <tbody>
  <tr id = "isValidStepLengthCalculator">
   <td rowspan = "4" align = "center">
     <a href = "./DevHelpers.md#isValidStepLengthCalculatorFun"><code>isValidStepLengthCalculator</code></a>
   </td>
   <td colspan = "2" rowspan = "1" align = "center">
     <code>fun</code>
   </td>
   <td rowspan = "1" align = "center">
     <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
     A function you want to use as a <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a>.
   </td>
  </tr>

  <tr>
   <td rowspan = "3" align = "center">
    <code>options</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
     <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
     An Element or the Window.
   </td>
  </tr>
  
  <tr>
   <td rowspan = "1" align = "center">
    <code>totalScrollAmount</code>
   </td>
   <td rowspan = "1" align = "center">
     <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    The total amount of pixel to scroll you want the dummy scroll-animation to test your <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> againist. 
   </td>
  </tr>

  <tr>
   <td rowspan = "1" align = "center">
     <code>timeout</code>
   </td>
   <td rowspan = "1" align = "center">
     <code>Number</code>
   </td>
  <td rowspan = "1" align = "left">
    The number of milliseconds after which the test forcefully returns a result.
  </td>
  </tr>
 </tbody>
<table>

<!--
#### <p align="right"><a href = "./FAQ.md"><code>Go to next section &#8680;</code></a></p>
-->