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

Name | Type | Description
:--: | :--: | -----------
`INITIAL_WINDOW_HEIGHT` | `Number` |The window's inner height _(in px)_ when the page is first loaded.
`INITIAL_WINDOW_WIDTH` | `Number` | The window's inner width _(in px)_ when the page is first loaded.
`DEFAULT_XSTEP_LENGTH` | `Number` | The initial value of the [`_xStepLength`](./VariablesAbout.md#_xStepLength) parameter: it represents the default number of pixels scrolled in a single scroll-animation's step on the x-axis. <br/> It's **16px at 412px** of _(initial window's)_ width and **23px at 1920px** of _(initial window's)_ width.
`DEFAULT_YSTEP_LENGTH` | `Number` | The initial value of the [`_yStepLength`](./VariablesAbout.md#_yStepLength) parameter: it represents the default number of pixels scrolled in a single scroll-animation's step on the y-axis. <br/> It's **38px at 789px** of _(initial window's)_ height and **22px at 1920px** of _(initial window's)_ height.
`DEFAULT_MIN_ANIMATION_FRAMES` | `Number` | The initial value of the [`_minAnimationFrame`](./VariablesAbout.md#_minAnimationFrame) parameter: it represent the default lowest number of frames any scroll-animation should last if no [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) is set for a container. <br/> It's **51 frames at 929px** of _(initial window's)_ height.
`DEFAULT_TEST_CALCULATOR_SCROLL_VALUE` | `Number` | The default number of pixel scrolled when testing a newStepLengthCalculator.
`DEFAULT_TEST_CALCULATOR_DURATION` | `Number` | The default number of milliseconds the test of a newStepLengthCalculator should last.
`DEFAULT_ERROR_LOGGER` | `Function` | A function that logs the API error messages inside the browser's console.
`DEFAULT_WARNING_LOGGER` | `Function` | A function that logs the API warning messages inside the browser's console.

<br/>

#### <p align="right"><a href = "./VariablesAbout.md"><code>Go to next section &#8680;</code></a></p>
