#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Internal Variables 
The [`universalsmoothscroll-min.js`](./Download.md) script will declare and initialize the `uss` object ***as a public property of [`Window`](https://developer.mozilla.org/en-US/docs/Web/API/Window)***. <br/>
This object has the below listed properties and they're internally used to control all the API's scroll-animations. <br/>
These properties are also mentioned in other sections of the documentation so may find this helpful.

### N.B.
Even though it's _possible_ to directly modify these properties it's ***highly discouraged***: the best way to get/set them is through the provided [`accessors`](./FunctionsAbout.md).
Manually altering the properties listed below may cause the API to not function properly. <br/>
Moreover any one of them can be renamed, deleted and/or repurposed at any time by an update.
<br/>
<br/>

<table>
 <thead>
  <tr>
   <th>Name</th>
   <th>Type</th>
   <th>Default value</th>
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
   <td rowspan = "1" align = "center">
    <a href = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map"><code>new Map</code></a>
   </td>
   <td rowspan = "1" align = "left">
    A Map in which: 
    <ul> 
     <li> The keys are an instances of <a href = "https://developer.mozilla.org/en-US/docs/Web/API/Element"><code>Element</code></a> or the <a href = "https://developer.mozilla.org/en-US/docs/Web/API/Window"><code>Window</code></a> and they're internally called <code>containers</code>. </li> 
     <li> The values are <a href = "./VariablesAbout.md#the-_containersdata-arrays"><code>arrays</code></a>. </li>
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
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_XSTEP_LENGTH"><code>DEFAULT_XSTEP_LENGTH</code></a>
   </td>
   <td rowspan = "1" align = "left">
    If there's no <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> set for a container, this represent the number of pixel scrolled during a single scroll-animation's step on the x-axis of that container.
   </td>
  </tr>

  <tr id = "_yStepLength">
   <td rowspan = "1" align = "center">
    <code>_yStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_YSTEP_LENGTH"><code>DEFAULT_YSTEP_LENGTH</code></a>
   </td>
   <td rowspan = "1" align = "left">
    If there's no <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> set for a container, this represent the number of pixel scrolled during a single scroll-animation's step on the y-axis of that container.
   </td>
  </tr>

  <tr id = "_minAnimationFrame">
   <td rowspan = "1" align = "center">
    <code>_minAnimationFrame</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_MIN_ANIMATION_FRAMES"><code>DEFAULT_MIN_ANIMATION_FRAMES</code></a>
   </td>
   <td rowspan = "1" align = "left">
    This represents the lowest number of frames any scroll-animation on a container should last if no <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>stepLengthCalculator</code></a> is set for it. <br/> 
   </td>
  </tr>

  <tr id = "_windowWidth">
   <td rowspan = "1" align = "center">
    <code>_windowWidth</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#INITIAL_WINDOW_WIDTH"><code>INITIAL_WINDOW_WIDTH</code></a>
   </td>
   <td rowspan = "1" align = "left">
    The current Window's inner width <i>(in px)</i>.
   </td>
  </tr>

  <tr id = "_windowHeight">
   <td rowspan = "1" align = "center">
    <code>_windowHeight</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#INITIAL_WINDOW_HEIGHT"><code>INITIAL_WINDOW_HEIGHT</code></a>
   </td>
   <td rowspan = "1" align = "left">
    The current Window's inner height <i>(in px)</i>.
   </td>
  </tr>

  <tr id = "_scrollbarsMaxDimension">
   <td rowspan = "1" align = "center">
    <code>_scrollbarsMaxDimension</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "center">
    Depends on the user's browser
   </td>
   <td rowspan = "1" align = "left">
    The highest number of pixels any scrollbar on the page can occupy <i>(it's browser dependent)</i>.
   </td>
  </tr>

  <tr id = "_framesTime">
   <td rowspan = "1" align = "center">
    <code>_framesTime</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_FRAME_TIME"><code>DEFAULT_FRAME_TIME</code></a>
   </td>
   <td rowspan = "1" align = "left">
    The time in milliseconds between two consecutive browser's frame repaints <i>(e.g. at <code>60</code><sub>fps</sub> this is <code>16.6</code><sub>ms</sub>)</i>.
   </td>
  </tr>
  
  <tr id = "_pageScroller">
   <td rowspan = "1" align = "center">
    <code>_pageScroller</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "center">
    Depends on the webpage style
   </td>
   <td rowspan = "1" align = "left">
    The element that scrolls the document. <br/>
    It's also the value used when an API method requires the <code>container</code> input parameter but nothing is passed.
   </td>
  </tr>

  <tr id = "_reducedMotion">
   <td rowspan = "1" align = "center">
    <code>_reducedMotion</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "center">
    Depends on user's system preference
   </td>
   <td rowspan = "1" align = "left">
    True if the user has enabled any <code>reduce-motion</code> setting devicewise, false otherwise. <br/> 
    Internally used by the API to follow the user's accessibility preferences by reverting back every scroll-animation to the default  <i>jump-to-position</i> behavior. 
   </td>
  </tr>

  <tr id = "_onResizeEndCallbacks">
   <td rowspan = "1" align = "center">
    <code>_onResizeEndCallbacks</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Array</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>[]</code>
   </td>
   <td rowspan = "1" align = "left">
    Contains all the functions that should be executed only once the user has finished resizing the browser's window and has <strong><i>interacted</i></strong> with it. <br/>
    An interaction can be a:
    <ul>
      <li>pointerover event</li>
      <li>pointerdown event</li>
      <li>touchstart event</li>
      <li>mousemove event</li>
      <li>keydown event</li>
      <li>focus event</li>
    </ul>
   </td>
  </tr>

  <tr id = "_debugMode">
   <td rowspan = "1" align = "center">
    <code>_debugMode</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>String</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>""</code>
   </td>
   <td rowspan = "1" align = "left">
   Controls the way the warning and error messages are logged by the default error/warning loggers. <br/> 
   If it's set to: 
   <ul> 
    <li><code>"disabled"</code> <i>(case insensitive)</i> the API won't show any warning or error message. </li> 
    <li><code>"legacy"</code> <i>(case insensitive)</i> the API won't style any warning or error message. </li> 
    <li>Any other <i><strong>string</strong></i> will make the warning/error messages be displayed with the default API's styling. </li>
   </ul> 
    Custom values of the <a href = "./VariablesAbout.md#_errorLogger"><code>_errorLogger</code></a>  and/or <a href = "./VariablesAbout.md#_warningLogger"><code>_warningLogger</code></a> properties should respect this preference.
   </td>
  </tr> 

  <tr id = "_errorLogger">
   <td rowspan = "1" align = "center">
    <code>_errorLogger</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_ERROR_LOGGER"><code>DEFAULT_ERROR_LOGGER</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Logs the API error messages inside the browser's console.
   </td>
  </tr>

  <tr id = "_warningLogger">
   <td rowspan = "1" align = "center">
    <code>_warningLogger</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "center">
    <a href = "./ConstantsAbout.md#DEFAULT_WARNING_LOGGER"><code>DEFAULT_WARNING_LOGGER</code></a>
   </td>
   <td rowspan = "1" align = "left">
    Logs the API warning messages inside the browser's console.
   </td>
  </tr>

 </tbody>
</table>

---
<br/>

## The `_containersData` arrays
The [`_containersData`](./VariablesAbout.md#_containersData) variable is a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and its `values` are arrays. <br/>
This is what each array contains: 
<br/>
<br/>

Index | Type | Description
:---: | :--: | -----------
`0` | `Number` | Contains the ID of a requested scroll-animation on the x-axis of this container provided by the [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) method.<br/> It's `null` or `undefined` if no scroll-animation on the x-axis of this container is currently being performed. 
`1` | `Number` | Contains the ID of a requested scroll-animation on the y-axis of this container provided by the [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) method.<br/> It's `null` or `undefined` if no scroll-animation on the y-axis of this container is currently being performed. 
`2` | `Number` | Contains the final position _(in px)_ at which this container will be at the end of the current scroll-animation on the x-axis. 
`3` | `Number` | Contains the final position _(in px_) at which this container will be at the end of the current scroll-animation on the y-axis. 
`4` | `Number` | Contains the direction of the current scroll-animation on the x-axis of this container: <br/> `1` if the scrolling is from right-to-left, `-1` otherwise.
`5` | `Number` | Contains the direction of the current scroll-animation on the y-axis of this container: <br/> `1` if the scrolling is from bottom-to-top, `-1` otherwise.
`6` | `Number` | Contains the total amount of pixels that have to be scrolled by current scroll-animation on the x-axis of this container. 
`7` | `Number` | Contains the total amount of pixels that have to be scrolled by current scroll-animation on the y-axis of this container. 
`8` | `Number` | Contains the starting time in milliseconds _(as a [`DOMHighResTimeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp))_ of the current scroll-animation on the x-axis of this container. <br/> It's `null` if a scroll-animation on the x-axis of this container has been scheduled but has not been performed yet or if a scroll-animation with [`stillStart = false`](FunctionsAbout.md#scrollXBy) has been requested.
`9` | `Number` | Contains the starting time in milliseconds _(as a [`DOMHighResTimeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp))_ of the current scroll-animation on the y-axis of this container. <br/> It's `null` if a scroll-animation on the y-axis of this container has been scheduled but has not been performed yet or if a scroll-animation with [`stillStart = false`](FunctionsAbout.md#scrollYBy) has been requested.
`10` | `Function` | Contains a callback function that will be executed when the current scroll-animation on the x-axis of this container has been performed.
`11` | `Function` | Contains a callback function that will be executed when the current scroll-animation on the y-axis of this container has been performed.
`12` | `Function` | Contains the [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the scroll-animations on the x-axis of this container. 
`13` | `Function` | Contains the [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the scroll-animations on the y-axis of this container.
`14` | `Function` | Contains the [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the scroll-animations on the x-axis of this container. <br/> If valid, replaces `12` for the current scroll-animation on the x-axis of this container and it's automatically invalidated at the end.
`15` | `Function` | Contains the [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the scroll-animations on the y-axis of this container. <br/> If valid, replaces `13` for the current scroll-animation on the y-axis of this container and it's automatically invalidated at the end.
`16` | `Number` | Contains the cached value of the highest reacheable scrollLeft/scrollX value of this container (its <a href = "./FunctionsAbount.md#getMaxScrollXFun"><code>maxScrollX</code></a>).
`17` | `Number` | Contains the cached value of the highest reacheable scrollTop/scrollY value of this container (its <a href = "./FunctionsAbount.md#getMaxScrollYFun"><code>maxScrollY</code></a>).
`18` | `Number` | Contains the cached value of the vertical scrollbar's width of this container.
`19` | `Number` | Contains the cached value of the horizontal scrollbar's height of this container.
`20` | `Number` | Contains the cached value of the top border's height _(in px)_ of this container.
`21` | `Number` | Contains the cached value of the right border's width _(in px)_ of this container.
`22` | `Number` | Contains the cached value of the bottom border's height _(in px)_ of this container.
`23` | `Number` | Contains the cached value of the left border's width _(in px)_ of this container.

`This container` refers to the `key` linked to each array.

<br/>
