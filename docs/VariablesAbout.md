#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Variables (internal use only)
Variable name | Purpose
------------- | -------
`_containersData` | A Map <key, value> in which: <br/> 1) A key is a DOM element internally called *"container"*.<br/> 2) A value is an array with 14 values, which are:<br/><ol>**[0]** contains the ID of a requested scroll-animation on the x-axis provided by the `requestAnimationFrame` method.<br/>Null or undefined if no scroll-animation on the x-axis are currently being performed.<br/>**[1]** contains the ID of a requested scroll-animation on the y-axis provided by the `requestAnimationFrame` method.<br/>Null or undefined if no scroll-animation on the y-axis are currently being performed.<br/>**[2]** contains the position in pixel at which the container will be at the end of the current scroll-animation on the x-axis.<br/>**[3]** contains the position in pixel at which the container will be at the end of the current scroll-animation on the y-axis.<br/>**[4]** contains the direction of the current scroll-animation on the x-axis.<br/>1 if the elements inside the container will go from right to left as a consequence of the scrolling, -1 otherwise.<br/>**[5]** contains the direction of the current scroll-animation on the y-axis.<br/>1 if the elements inside the container will go from bottom to top as a consequence of the scrolling, -1 otherwise.<br/>**[6]** contains the total amount of pixels that have to be scrolled from the start of the current scroll-animation on the x-axis to its end.<br/>**[7]** contains the total amount of pixels that have to be scrolled from the start of the current scroll-animation on the y-axis to its end.<br/>**[8]** contains the starting time in milliseconds (as a `DOMHighResTimeStamp`) of the current scroll-animation on the x-axis.<br/>**[9]** contains the starting time in milliseconds (as a `DOMHighResTimeStamp`) of the current scroll-animation on the y-axis.<br/>**[10]** contains a callback function that will be executed when the current scroll-animation on the x-axis has been performed.<br/>**[11]** contains a callback function that will be executed when the current scroll-animation on the y-axis has been performed.<br/>**[12]** contains a user-defined ease functions that will return the length of every single step of all scroll-animations on the x-axis.<br/>**[13]** contains a user-defined ease functions that will return the length of every single step of all scroll-animations on the y-axis.<br/></ol>
`_xStepLength` | The number of pixel scrolled on the x-axis during a single scroll-animation's step.
`_yStepLength` | The number of pixel scrolled on the y-axis during a single scroll-animation's step.
`_minAnimationFrame` | The minimum number of frames any scroll-animation, on any axis, should last if no custom StepLengthCalculator are set for a container.
`_windowHeight` | The current window's inner height in pixels.
`_windowWidth` | The current window's inner width in pixels.
`_scrollbarsMaxDimension` | The highest amount of pixels any scrollbar on the page can occupy (it's browser dependent).
`_pageScroller` | The current default value of the `container` input parameter used by some of the API's methods.
`_reducedMotion` | True if the user has enabled any "reduce-motion" setting devicewise, false otherwise. <br/> Internally used to follow the user's accessibility preferences, reverting back to the browser's default _jump-to-position behavior_ if needed.  

<br/>

#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/docs/MethodsAbout.md"><code>Go to next section &#8680;</code></a>
