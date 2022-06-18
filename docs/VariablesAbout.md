#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Internal Variables 
Once imported, the [`universalsmoothscroll-min.js`](./Download.md) script will automatically declare and initialize _(in the global scope of your application)_ the `uss` object. <br/>
This object has the below listed properties and they're internally used by the API to control the scroll-animations' behaviors. <br/>
Even though it's _possible_ to directly modify these properties it's ***highly discouraged***: the best way to get/set them is through the provided [`accessors`](./FunctionsAbout.md).

### N.B.
Manually altering the properties listed below may cause the API to not function properly. <br/>
Moreover any one of them can be renamed, deleted and/or repurposed at any time by an update.
<br/>
<br/>

<table>
 <thead>
  <tr>
   <th>Name</th>
   <th>Type</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr id = "_containersData">
   <td rowspan = "1" align = "center">
    <code>_containersData</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Map</code>
   </td>
   <td rowspan = "1" align = "left">
    A Map in which: 
    <ul> 
     <li> The keys are DOM elements internally called <code>container</code>. </li> 
     <li> The values are <a href = "./VariablesAbout.md#the-_containersdata-arrays"><code>arrays of 16 values</code></a>. </li>
    </ul>
   </td>
  </tr>
    <tr id = "_xStepLength">
   <td rowspan = "1" align = "center">
    <code>_xStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    If there's no <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>StepLengthCalculator</code></a> set for a container, this represent the number of pixel scrolled during a single scroll-animation's step on the x-axis of that container.
   </td>
  </tr>
  </tr>
  <tr id = "_yStepLength">
   <td rowspan = "1" align = "center">
    <code>_yStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    If there's no <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>StepLengthCalculator</code></a> set for a container, this represent the number of pixel scrolled during a single scroll-animation's step on the y-axis of that container.
   </td>
  </tr>
  <tr id = "_minAnimationFrame">
   <td rowspan = "1" align = "center">
    <code>_minAnimationFrame</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    If there's no <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>StepLengthCalculator</code></a> set for a container, this represent the minimum number of frames any scroll-animation, on any axis of that container, should last.
   </td>
  </tr>
  <tr id = "_windowHeight">
   <td rowspan = "1" align = "center">
    <code>_windowHeight</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    The current window's inner height <i>(in px)</i>.
   </td>
  </tr>
  <tr id = "_windowWidth">
   <td rowspan = "1" align = "center">
    <code>_windowWidth</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    The current window's inner width <i>(in px)</i>.
   </td>
  </tr>
  <tr id = "_scrollbarsMaxDimension">
   <td rowspan = "1" align = "center">
    <code>_scrollbarsMaxDimension</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    The highest amount of pixels any scrollbar on the page can occupy (it's browser dependent).
   </td>
  </tr>
  <tr id = "_framesTime">
   <td rowspan = "1" align = "center">
    <code>_framesTime</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    The time in milliseconds between two consecutive browser's frame repaints (e.g. at 60fps this is 16.6ms).
   </td>
  </tr>
  <tr id = "_pageScroller">
   <td rowspan = "1" align = "center">
    <code>_pageScroller</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    The value used when an API method requires the <code>container</code> input parameter but nothing is passed: it should be used to tell the USS API which is the element that scrolls the document.
   </td>
  </tr>
  <tr id = "_reducedMotion">
   <td rowspan = "1" align = "center">
    <code>_reducedMotion</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    True if the user has enabled any <code>reduce-motion</code> setting devicewise, false otherwise. <br/> 
    Internally used by the API to follow the user's accessibility preferences, reverting back every scroll-animation to the default <i>jump-to-position</i> behavior. 
   </td>
  </tr>
  <tr id = "_debugMode">
   <td rowspan = "1" align = "center">
    <code>_debugMode</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>String</code>
   </td>
   <td rowspan = "1" align = "left">
   Controls the way the warning and error messages are logged in the browser's console. <br/> 
   If it's set to: 
   <ul> 
    <li> <strong>"disabled"</strong> <i>(case insensitive)</i> the API won't show any warning or error message. </li> 
    <li> <strong>"legacy"</strong> <i>(case insensitive)</i> the API won't style any warning or error message. </li> 
   </ul> 
   Any other value will make the warnings and error messages be displayed with the default API's styling.
   </td>
  </tr>
 </tbody>
</table>

---
<br/>

## The `_containersData` arrays
The `_containersData` variable is a map and its values are 16-cells-long arrays. <br/>
This is what each cell contains: 
<br/>
<br/>

Index | Type | Description
:---: | :--: | -----------
`0` | `Number` | Contains the ID of a requested scroll-animation on the x-axis of this container provided by the [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) method.<br/> It's `null` or `undefined` if no scroll-animation on the x-axis of this container is currently being performed. 
`1` | `Number` | Contains the ID of a requested scroll-animation on the y-axis of this container provided by the [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) method.<br/> It's `null` or `undefined` if no scroll-animation on the y-axis of this container is currently being performed. 
`2` | `Number` | Contains the final position _(in px)_ at which this container will be at the end of the current scroll-animation on the x-axis. 
`3` | `Number` | Contains the final position _(in px_) at which this container will be at the end of the current scroll-animation on the y-axis. 
`4` | `Number` | Contains the direction of the current scroll-animation on the x-axis of this container: <br/> 1 if the scrolling is from right-to-left, -1 otherwise.
`5` | `Number` | Contains the direction of the current scroll-animation on the y-axis of this container: <br/> 1 if the scrolling is from bottom-to-top, -1 otherwise.
`6` | `Number` | Contains the total amount of pixels that have to be scrolled by current scroll-animation on the x-axis of this container. 
`7` | `Number` | Contains the total amount of pixels that have to be scrolled by current scroll-animation on the y-axis of this container. 
`8` | `Number` | Contains the starting time in milliseconds _(as a [`DOMHighResTimeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp))_ of the current scroll-animation on the x-axis of this container. <br/> It's `null` if a scroll-animation on the x-axis of this container has been scheduled but has not been performed yet or if a scroll-animation with [`stillStart = false`](FunctionsAbout.md#scrollXBy) has been requested.
`9` | `Number` | Contains the starting time in milliseconds _(as a [`DOMHighResTimeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp))_ of the current scroll-animation on the y-axis of this container. <br/> It's `null` if a scroll-animation on the y-axis of this container has been scheduled but has not been performed yet or if a scroll-animation with [`stillStart = false`](FunctionsAbout.md#scrollYBy) has been requested.
`10` | `Function` | Contains a callback function that will be executed when the current scroll-animation on the x-axis of this container has been performed.
`11` | `Function` | Contains a callback function that will be executed when the current scroll-animation on the y-axis of this container has been performed.
`12` | `Function` | Contains the [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the scroll-animations on the x-axis of this container. 
`13` | `Function` | Contains the [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the scroll-animations on the y-axis of this container.
`14` | `Function` | Contains the [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the scroll-animations on the x-axis of this container. <br/> If valid, replaces `12` for the current scroll-animation on the x-axis of this container and it's automatically invalidated at the end.
`15` | `Function` | Contains the [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the scroll-animations on the y-axis of this container. <br/> If valid, replaces `13` for the current scroll-animation on the y-axis of this container and it's automatically invalidated at the end.

### N.B.
***"This container"*** refers to the key linked to each array.

<br/>

#### <p align="right"><a href = "./FunctionsAbout.md"><code>Go to next section &#8680;</code></a></p>
