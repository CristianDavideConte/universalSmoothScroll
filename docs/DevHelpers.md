#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Dev-Helpers library
This library contains functions that should help you with the more challenging aspect of the Universal Smooth Scroll API (e.g. how to create a correct [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator)). <br/>
This library is meant to be used during the development phase of your website only and it's not internally used by the API, so it should be removed from the project before the deployment phase (nothing will happen if you leave it there, don't worry).

### N.B.
This library cannot be used without having imported the [`universalsmoothscroll-min.js`](./Installation.md) script in your project first. <br/>
Once imported, the [`universalsmoothscroll-dev-helpers`](./Download.md) library will automatically declare and initialize _(in the global scope of your application)_ all the functions listed below. <br/>
<br/>
<br/>

<table>
 <thead>
  <tr>
   <th>Name</th>
   <th>Type</th>
   <th>Input Parameters</th>
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
   <td rowspan = "1" align = "center">
    <a href = "./DevHelpers.md#isValidStepLengthCalculator"><code>stepLengthCalculator</code></a>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
   <td rowspan = "4" align = "left">
    Tests the passed <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> by performing a dummy scroll-animation <i>(no actual scroll takes place)</i>. <br/> 
    Errors/warnings will be logged in the console during the testing process. <br/>
    Returns <code>true</code> if the passed <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> is valid, <code>false</code> otherwise.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <a href = "./DevHelpers.md#isValidStepLengthCalculator"><code>container</code></a>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./VariablesAbout.md#_pageScroller"><code>_pageScroller</code></a>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <a href = "./DevHelpers.md#isValidStepLengthCalculator"><code>totalScrollAmount</code></a>
   </td>
   <td rowspan = "1" align = "center">
    <code>100</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <a href = "./DevHelpers.md#isValidStepLengthCalculator"><code>timeout</code></a>
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
  <th>Parameter Name</th>
  <th>Parameter Type</th>
  <th>Parameter Description</th>
  </tr>
 </thead>
 <tbody>
  <tr id = "isValidStepLengthCalculator">
  <td rowspan = "4" align = "center">
    <a href = "./DevHelpers.md#isValidStepLengthCalculatorFun"><code>isValidStepLengthCalculator</code></a>
  </td>
  <td rowspan = "1" align = "center">
    <code>stepLengthCalculator</code>
  </td>
  <td rowspan = "1" align = "center">
    <code>Function</code>
  </td>
  <td rowspan = "1" align = "left">
    A function you want to use as a <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a>.
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

#### <p align="right"><a href = "./FAQ.md"><code>Go to next section &#8680;</code></a></p>