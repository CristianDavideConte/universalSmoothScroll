#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Internal Constants
Once imported, the [`universalsmoothscroll-min.js`](./Download.md) script will automatically declare and initialize _(in the global scope of your application)_ all the variables listed below. <br/>
They are internally used by the USS API for initialization purposes and can normally be ignored. <br/>
They are only useful if you want to reset the `uss` object to its initial state or if you just want to better understand how this API works. <br/>

### N.B.
All the variables listed below are declared with the keywork [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) and therefore they can't be overwritten.
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
  <tr id = "INITIAL_WINDOW_HEIGHT">
   <td rowspan = "1" align = "center">
    <code>INITIAL_WINDOW_HEIGHT</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1">
    The window's inner height <i>(in px)</i> when the page is first loaded.
   </td>
  </tr>
  <tr id = "INITIAL_WINDOW_WIDTH">
   <td rowspan = "1" align = "center">
    <code>INITIAL_WINDOW_WIDTH</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1">
    The window's inner width <i>(in px)</i> when the page is first loaded.
   </td>
  </tr>
  <tr id = "DEFAULT_XSTEP_LENGTH">
   <td rowspan = "1" align = "center">
    <code>DEFAULT_XSTEP_LENGTH</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1">
    The initial value of the <a href = "./VariablesAbout.md#_xStepLength"><code>_xStepLength</code></a> property: it represents the default number of pixels scrolled in a single scroll-animation's step on the x-axis. <br/> 
    It's <strong>16px at 412px</strong> of <i>(initial window's)</i> width and <strong>23px at 1920px</strong> of <i>(initial window's)</i> width.
   </td>
  </tr>
  <tr id = "DEFAULT_YSTEP_LENGTH">
   <td rowspan = "1" align = "center">
    <code>DEFAULT_YSTEP_LENGTH</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1">
    The initial value of the <a href = "./VariablesAbout.md#_yStepLength"><code>_yStepLength</code></a> property: it represents the default number of pixels scrolled in a single scroll-animation's step on the y-axis. <br/> 
    It's <strong>38px at 789px</strong> of <i>(initial window's)</i> height and <strong>22px at 1920px</strong> of <i>(initial window's)</i> height.
   </td>
  </tr>
  <tr id = "DEFAULT_MIN_ANIMATION_FRAMES">
   <td rowspan = "1" align = "center">
    <code>DEFAULT_MIN_ANIMATION_FRAMES</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1">
    The initial value of the <a href = "./VariablesAbout.md#_minAnimationFrame"><code>_minAnimationFrame</code></a> property: it represents the default lowest number of frames any scroll-animation should last if no <a href = "./FAQ.md#q-what-is-a-steplengthcalculator-"><code>StepLengthCalculator</code></a> is set for a container. <br/> 
    It's <strong>51 frames at 929px</strong> of <i>(initial window's)<i> height.
   </td>
  </tr>
  <tr id = "DEFAULT_FRAME_TIME">
   <td rowspan = "1" align = "center">
    <code>DEFAULT_FRAME_TIME</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1">
    The initial value of the <a href = "./VariablesAbout.md#_framesTime"><code>_framesTime</code></a> property: it's <code>16.6ms</code> and it initially assumes that the user's browser/screen is refreshing at 60fps.
   </td>
  </tr>
  <tr id = "DEFAULT_ERROR_LOGGER">
   <td rowspan = "1" align = "center">
    <code>DEFAULT_ERROR_LOGGER</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1">
    The initial value of the <a href = "./VariablesAbout.md#_errorLogger"><code>_errorLogger</code></a> property: it logs the API error messages inside the browser's console.
   </td>
  </tr>
  <tr id = "DEFAULT_WARNING_LOGGER">
   <td rowspan = "1" align = "center">
    <code>DEFAULT_WARNING_LOGGER</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1">
    The initial value of the <a href = "./VariablesAbout.md#_warningLogger"><code>_warningLogger</code></a> property: it logs the API warning messages inside the browser's console.
   </td>
  </tr>
 </tbody>
</table>

<br/>

#### <p align="right"><a href = "./VariablesAbout.md"><code>Go to next section &#8680;</code></a></p>
