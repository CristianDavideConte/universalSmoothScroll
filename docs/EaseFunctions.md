#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Ease-Functions <sup><code>library</code></sup>
## Import
This library cannot be used without having imported the [`universalsmoothscroll-min.js`](./Installation.md) script in your project first. <br/>
This library is also a [`module`]("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules") so each function you see below must be imported before you can use it.

For example:
```javascript
  //The name of these and more other functions is in the table below.
  import {
    EASE_LINEAR,
    EASE_IN_CIRC,
    EASE_OUT_QUAD,
    EASE_IN_OUT_SINE,
    EASE_OUT_BOUNCE
  } from "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-ease-functions-min.js";

  //From here I can start using the imported functions.
  ...
```

---

## Usage
This library contains functions that can be invoked to get custom [`stepLengthCalculators`](./FAQ.md#q-what-is-a-steplengthcalculator-) which can be used to control the easing of any scroll-animation. <br/>

In order to do that, just pass the returned [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) to either one of these methods: 
* [`setXStepLengthCalculator`](./FunctionsAbout.md#setXStepLengthCalculatorFun) for the scroll-animations on the x-axis of your container.
* [`setYStepLengthCalculator`](./FunctionsAbout.md#setYStepLengthCalculatorFun) for the scroll-animations on the y-axis of your container. 
* [`setStepLengthCalculator`](./FunctionsAbout.md#setStepLengthCalculatorFun) for the scroll-animations on both axes of your container. 

For instance: 
```javascript
  import {
    ...
  } from "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-ease-functions-min.js";

  //Save the returned value (a stepLengthCalculator) to use it later.
  const myCustomStepLengthCalculator = CUSTOM_CUBIC_HERMITE_SPLINE(
    [0, 0.5, 1],
    [0, 0.2, 1]
  );

  //Use the imported functions to customize the easings of your scroll-animatons.
  uss.setXStepLengthCalculator(EASE_OUT_QUAD(300), myContainer, true);
  uss.setYStepLengthCalculator(EASE_OUT_BOUNCE(750), myContainer, true);
  uss.setStepLengthCalculator(myCustomStepLengthCalculator, myContainer);
```

---

<strong>Note:</strong> </br> 
A **bold** input parameter's name means that it's a mandatory input _(its default value is always <code><strong>✗</strong></code>)_. <br/>
An _italic_ input parameter's name means that it's an optional parameter. <br/>

<table>
 <thead>
  <tr>
   <th>Name</th>
   <th>Visualizations</th>
   <th>Input Parameters</th>
   <th>Default values</th>
  </tr>
 </thead>
 <tbody>
  <tr id = "CUSTOM_CUBIC_HERMITE_SPLINE">
   <td rowspan = "4" align = "center">
    <code>CUSTOM_CUBIC_HERMITE_SPLINE</code>
   </td>
   <td rowspan = "4" align = "center">
    <img src = "./easingsGifs/0_CUSTOM_CUBIC_BEZIER/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/0_CUSTOM_CUBIC_BEZIER/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./EaseFunctions.md#the-xs-and-ys-parameters"><code>xs</code></a>, <a href = "./EaseFunctions.md#the-xs-and-ys-parameters"><code>ys</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td> 
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-tension-parameter"><code>tension</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>0</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "CUSTOM_BEZIER_CURVE">
   <td rowspan = "3" align = "center">
    <code>CUSTOM_BEZIER_CURVE</code>
   </td>
   <td rowspan = "3" align = "center">
    <img src = "./easingsGifs/0_CUSTOM_CUBIC_BEZIER/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/0_CUSTOM_CUBIC_BEZIER/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./EaseFunctions.md#the-xs-and-ys-parameters"><code>xs</code></a>, <a href = "./EaseFunctions.md#the-xs-and-ys-parameters"><code>ys</code></a> 
   </strong>
   </td> 
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td> 
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "CUSTOM_CUBIC_BEZIER">
   <td rowspan = "3" align = "center">
    <code>CUSTOM_CUBIC_BEZIER</code>
   </td>
   <td rowspan = "3" align = "center">
    <img src = "./easingsGifs/0_CUSTOM_CUBIC_BEZIER/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/0_CUSTOM_CUBIC_BEZIER/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-x1-y1-x2-and-y2-parameters"><code>x1</code></a>, <a href = "./EaseFunctions.md#the-x1-y1-x2-and-y2-parameters"><code>y1</code></a>, <a href = "./EaseFunctions.md#the-x1-y1-x2-and-y2-parameters"><code>x2</code></a>, <a href = "./EaseFunctions.md#the-x1-y1-x2-and-y2-parameters"><code>y2</code></a>
   </i>
   </td> 
   <td rowspan = "1" align = "center">
    <code>0</code>, <code>0</code>, <code>1</code>, <code>1</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_LINEAR">
   <td rowspan = "2" align = "center">
    <code>EASE_LINEAR</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/1_EASE_LINEAR/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/1_EASE_LINEAR/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_SINE">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_SINE</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/2_EASE_IN_SINE/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/2_EASE_IN_SINE/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_QUAD">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_QUAD</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/3_EASE_IN_QUAD/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/3_EASE_IN_QUAD/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_CUBIC">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_CUBIC</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/4_EASE_IN_CUBIC/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/4_EASE_IN_CUBIC/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_QUART">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_QUART</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/5_EASE_IN_QUART/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/5_EASE_IN_QUART/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_QUINT">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_QUINT</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/6_EASE_IN_QUINT/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/6_EASE_IN_QUINT/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_EXPO">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_EXPO</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/7_EASE_IN_EXPO/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/7_EASE_IN_EXPO/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_CIRC">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_CIRC</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/8_EASE_IN_CIRC/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/8_EASE_IN_CIRC/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_BOUNCE">
   <td rowspan = "3" align = "center">
    <code>EASE_IN_BOUNCE</code>
   </td>
   <td rowspan = "3" align = "center">
    <img src = "./easingsGifs/9_EASE_IN_BOUNCE/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/9_EASE_IN_BOUNCE/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>900</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-bouncesNumber-parameter"><code>bouncesNumber</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>3</code>
   </td>
  </tr>

  <tr id = "EASE_OUT_SINE">
   <td rowspan = "2" align = "center">
    <code>EASE_OUT_SINE</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/10_EASE_OUT_SINE/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/10_EASE_OUT_SINE/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_OUT_QUAD">
   <td rowspan = "2" align = "center">
    <code>EASE_OUT_QUAD</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/11_EASE_OUT_QUAD/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/11_EASE_OUT_QUAD/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_OUT_CUBIC">
   <td rowspan = "2" align = "center">
    <code>EASE_OUT_CUBIC</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/12_EASE_OUT_CUBIC/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/12_EASE_OUT_CUBIC/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_OUT_QUART">
   <td rowspan = "2" align = "center">
    <code>EASE_OUT_QUART</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/13_EASE_OUT_QUART/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/13_EASE_OUT_QUART/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_OUT_QUINT">
   <td rowspan = "2" align = "center">
    <code>EASE_OUT_QUINT</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/14_EASE_OUT_QUINT/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/14_EASE_OUT_QUINT/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_OUT_EXPO">
   <td rowspan = "2" align = "center">
    <code>EASE_OUT_EXPO</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/15_EASE_OUT_EXPO/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/15_EASE_OUT_EXPO/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_OUT_CIRC">
   <td rowspan = "2" align = "center">
    <code>EASE_OUT_CIRC</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/16_EASE_OUT_CIRC/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/16_EASE_OUT_CIRC/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_OUT_BOUNCE">
   <td rowspan = "3" align = "center">
    <code>EASE_OUT_BOUNCE</code>
   </td>
   <td rowspan = "3" align = "center">
    <img src = "./easingsGifs/17_EASE_OUT_BOUNCE/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/17_EASE_OUT_BOUNCE/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>900</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-bouncesNumber-parameter"><code>bouncesNumber</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>3</code>
   </td>
  </tr>

  <tr id = "EASE_IN_OUT_SINE">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_OUT_SINE</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/18_EASE_IN_OUT_SINE/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/18_EASE_IN_OUT_SINE/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_OUT_QUAD">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_OUT_QUAD</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/19_EASE_IN_OUT_QUAD/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/19_EASE_IN_OUT_QUAD/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_OUT_CUBIC">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_OUT_CUBIC</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/20_EASE_IN_OUT_CUBIC/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/20_EASE_IN_OUT_CUBIC/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>

  <tr id = "EASE_IN_OUT_QUART">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_OUT_QUART</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/21_EASE_IN_OUT_QUART/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/21_EASE_IN_OUT_QUART/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
    
  <tr id = "EASE_IN_OUT_QUINT">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_OUT_QUINT</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/22_EASE_IN_OUT_QUINT/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/22_EASE_IN_OUT_QUINT/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
    
  <tr id = "EASE_IN_OUT_EXPO">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_OUT_EXPO</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/23_EASE_IN_OUT_EXPO/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/23_EASE_IN_OUT_EXPO/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
    
  <tr id = "EASE_IN_OUT_CIRC">
   <td rowspan = "2" align = "center">
    <code>EASE_IN_OUT_CIRC</code>
   </td>
   <td rowspan = "2" align = "center">
    <img src = "./easingsGifs/24_EASE_IN_OUT_CIRC/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/24_EASE_IN_OUT_CIRC/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>500</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
    
  <tr id = "EASE_IN_OUT_BOUNCE">
   <td rowspan = "3" align = "center">
    <code>EASE_IN_OUT_BOUNCE</code>
   </td>
   <td rowspan = "3" align = "center">
    <img src = "./easingsGifs/25_EASE_IN_OUT_BOUNCE/X.gif" width = "40px" height = "40px"/> 
    <img src = "./easingsGifs/25_EASE_IN_OUT_BOUNCE/Y.gif" width = "40px" height = "40px"/>
   </td>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-duration-parameter"><code>duration</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>1200</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-callback-parameter"><code>callback</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>undefined</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-bouncesNumber-parameter"><code>bouncesNumber</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>6</code>
   </td>
  </tr>
    
  <tr id = "EASE_ELASTIC_X">
   <td rowspan = "4" align = "center">
    <code>EASE_ELASTIC_X</code>
   </td>
   <td rowspan = "4" align = "center">
    <img src = "./easingsGifs/26_EASE_ELASTIC/X.gif" width = "40px" height = "40px"/> 
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./EaseFunctions.md#the-forwardeasing-parameter"><code>forwardEasing</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <strong>
    <a href = "./EaseFunctions.md#the-backwardeasing-parameter"><code>backwardEasing</code></a>
    </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-elasticpointcalculator-parameter"><code>elasticPointCalculator</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>() => 50</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-debouncetime-parameter"><code>debounceTime</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>0</code>
   </td>
  </tr>   

  <tr id = "EASE_ELASTIC_Y">
   <td rowspan = "4" align = "center">
    <code>EASE_ELASTIC_Y</code>
   </td>
   <td rowspan = "4" align = "center">
    <img src = "./easingsGifs/26_EASE_ELASTIC/Y.gif" width = "40px" height = "40px"/> 
   </td>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./EaseFunctions.md#the-forwardeasing-parameter"><code>forwardEasing</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <strong>
    <a href = "./EaseFunctions.md#the-backwardeasing-parameter"><code>backwardEasing</code></a>
   </strong>
   </td>
   <td rowspan = "1" align = "center">
    <strong>✗</strong>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-elasticpointcalculator-parameter"><code>elasticPointCalculator</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>() => 50</code>
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
   <i>
    <a href = "./EaseFunctions.md#the-debouncetime-parameter"><code>debounceTime</code></a>
   </i>
   </td>
   <td rowspan = "1" align = "center">
    <code>0</code>
   </td>
  </tr>  
 </tbody>
</table>

---

## The `xs` and `ys` parameters
They're 2 arrays containing finite numbers between 0 _(included)_ and 1 _(included)_. <br/>
They must contain the same number of elements. <br/>
Values at the same index will represent a single point <code>(x,y)</code>. <br/>
`xs` and `ys` can both be empty.

For instance: 
```javascript
/**
 * In this example:
 * xs and ys represents the 3 points
 * - (0,0)
 * - (0.50, 0.25)
 * - (1,1)
 */
const xs = [0, 0.50, 1];
const ys = [0, 0.25, 1];
```

In the case of the [`CUSTOM_BEZIER_CURVE`](./CUSTOM_BEZIER_CURVE) easing, the `xs` and `ys`'s values represent the control points of a generic n-th degree bezier curve. <br/>

For example: 
```javascript
/**
 * In this example:
 * xs and ys represents the 4 control points
 * - (0,0)
 * - (0.33, 1.00)
 * - (0.68, 1.00)
 * - (1,1)
 * 
 * N.B. Using 4 control points will give you a cubic bezier curve.
 *      In this case:
 *      CUSTOM_BEZIER_CURVE(xs,ys) === CUSTOM_CUBIC_BEZIER(0.33, 1.00, 0.68, 1.00) 
 */
const xs = [0, 0.33, 0.68, 1];
const ys = [0, 1.00, 1.00, 1];

//This is a non-temporary EASE_OUT_CUBIC-like easing
//which always make the scroll-animation last 1 second.
uss.setStepLengthCalculator(
    CUSTOM_BEZIER_CURVE(xs, ys, 1000),
    myContainer, 
    false
);
```

In the case of the [`CUSTOM_CUBIC_HERMITE_SPLINE`](./CUSTOM_CUBIC_HERMITE_SPLINE) easing, successive `xs`'s values represent the generic interpolation intervals <code>(x<sub>k</sub> , x<sub>k+1</sub>)</code> of a canonical cubic hermite spline and they ***must be sorted***, whereas the `ys`'s values represent the points through which the spline should pass in the specified `xs` intervals. <br/>

For instance: 
```javascript
/**
 * In this example:
 * xs and ys represents the 4 points
 * - (0,0)
 * - (0.40, 0.26)
 * - (0.60, 0.84)
 * - (1,1)
 * N.B. You can add as many points as you want, 
 *      but the API's hermite splines will always be cubic.
 */
const xs = [0, 0.40, 0.60, 1];
const ys = [0, 0.26, 0.84, 1];

//This is a temporary custom EASE_IN_OUT-like easing
//which always make the scroll-animation last 1.2 second.
uss.setStepLengthCalculator(
    CUSTOM_CUBIC_HERMITE_SPLINE(xs, ys, 0, 1200),
    myContainer, 
    true
);
```

---

## The `tension` parameter
It's a number between 0 _(included)_ and 1 _(included)_ which represent the [`tension`](https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline) of a canonical cubic hermite spline. <br/>
The lesser the `tension` value is, the softer the spline will be. 

---

## The `x1`, `y1`, `x2` and `y2` parameters
They're 4 finite numbers between 0 _(included)_ and 1 _(included)_. <br/>
They're the 2<sup>nd</sup> and the 3<sup>rd</sup> control points of a cubic bezier curve (`(x1,y1)` and `(x2,y2)`). <br/>
The 1<sup>st</sup> control point is always fixed to `(0,0)` whilst the 4<sup>th</sup> one is fixed to `(1,1)`. <br/>
They determine the type of easing the returned [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) will have. 

---

## The `duration` parameter
It's a positive number which indicates the time _(in milliseconds)_ every scroll-animation controlled by this [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) will last.

---

## The `callback` parameter
Each one of the above mentioned functions will return a [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) when invoked. <br/>
These [`stepLengthCalculators`](./FAQ.md#q-what-is-a-steplengthcalculator-) are passed _some input parameters_ (see [`here`](./FAQ.md#q-what-is-a-steplengthcalculator-) for more info). <br/> 
The `callback` parameter is a function which will be executed at every scroll-animation step and that is always invoked with _those same input parameters_.

---

## The `bouncesNumber` parameter
It's the number of bounces the returned [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) will do before completing the scroll-animation. <br/>
A _bounce_ occurs when the scroll-animation reaches the highest scrollable value of a container and then goes back.   

---

## EASE_ELASTIC parameters
  #### The `forwardEasing` parameter 
  * It's a [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the easing of the ***forward part*** of the scroll-animation. 
  #### The `backwardEasing` parameter
  * It's a [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the easing of the ***backward part*** of the scroll-animation. 
  #### The `elasticPointCalculator` parameter
  * It's a function which must return the number of pixels that will be scrolled by the backward part of the scroll-animation. <br/>
    If this function returns a negative number, the `forwardEasing` will be used instead of the `backwardEasing` for the backward part of the scroll-animation. <br/>
  
    An ElasticPointCalculator is always passed the following input parameters _(in this order)_: 
    * the `originalTimestamp` which indicates the exact time in milliseconds at which the _(forward part of)_ the scroll-animation has started 
    * the `currentTimestamp` which indicates the time in milliseconds at which this function is invoked 
    * the `currentPosition` of the container's scrollTop/Left (scrollTop/scrollY for EASE_ELASTIC_Y, scrollLeft/scrollX for EASE_ELASTIC_X)
    * the `direction` of the _(forward part of)_ scroll-animation: 1 if the scrolling was from right-to-left/bottom-to-top, -1 otherwise
    * the `container` on which the scroll-animation is currently being performed (an Element that can be scrolled or the Window)
        
  #### The `debounceTime` parameter     
  * It's the time _(in milliseconds)_ that has to elapse after the end of the _(forward part of)_ the scroll-animation in order to start the backward part. 

For example:
```javascript
/**
 * Every scroll-animation on the x-axis of myContainer:
 *  - will scroll by x pixels with an EASE_OUT_QUAD easing for 1 second
 *  - will wait 500ms
 *  - will scroll by 50 pixels in the opposite direction with an EASE_OUT_BOUNCE easing for 700ms
 */
uss.setXStepLengthCalculator(
  EASE_ELASTIC_X(
    EASE_OUT_QUAD(1000),
    EASE_OUT_BOUNCE(700),
    (originalTimestamp, currentTimestamp, currentPosition, direction, container) => 50,
    500
  ), 
  myContainer
);
```

<br/>

#### <p align="right"><a href = "./DevHelpers.md"><code>Go to next section &#8680;</code></a></p>
