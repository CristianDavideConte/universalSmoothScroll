# Universal Smooth Scroll API
A simple API to **enable an enhanced version of the smooth-scroll behavior** on all browsers.<br>
The Universal Smooth Scroll API is a **lightweight javascript piece of code** that enables an enriched version of the standard `scroll-behavior: smooth` CSS property.<br>
This scroll API is based on and improves upon the 3 main ways to scroll an element in plain js: `scrollTo`, `scrollBy`, `scrollIntoView`.<br>
**Every scroll-animation** triggered by the API **can be interrupted** at any moment and **supports custom ease functions.**<br>

# How to install
## NPM:
coming soon...
## HTML meta tag:
Add this in your project's `<head>` tag:<br>
#### Stable versions:<br>
`<script src = "https://rawcdn.githack.com/CristianDavideConte/universalSmoothScroll/306bdef1839a405e4c2a7d776a82b7500bc537e8/js/universalsmoothscroll-min.js"></script>`<br>
#### Latest beta version:<br>
`<script src = "https://raw.githack.com/CristianDavideConte/universalSmoothScroll/master/js/universalsmoothscroll-min.js"></script>`
## Local file: 
Copy & paste the script's minified version in your project's js directory & add the `<script>`. For example:<br>
`<script src = "./js/universalsmoothscroll-min.js"></script>`

# How does it work ? 
All the API's properties are methods of the `uss` object which gets automatically initialized when you import the script in your project.<br>
The `uss` object is initialized in the global scope of you project so be aware of that !<br>
The `uss` object has some internal variables which **SHOULD NOT** be directly manipulated: it's suggested to always use the provided getters and setters.<br>
You will be able to recognize those internal properties because their names begin with and `_` (underscore). <br>
For istance: 
* `uss._xStepLength` is the name of the internal property used by the `uss` objects' methods.
* `uss.getXStepLength()` & `uss.setXStepLength` are the getter and setter's names for the `uss._sStepLength` variable.<br>

There are 3 main scrolling-methods + 1 handy auto-initializer for anchor links and they are:
* `uss.scrollTo()`
* `uss.scrollBy()`
* `uss.scrollIntoView()`
* `uss.hrefSetup()`<br>

# Internal-Use variables list 
Variable name | Purpose
------------- | -------
`_xMapContainerAnimationID` | A Map (key, value) in which: <br> 1) The keys are the containers on which a scroll-animation on the x-axis has been requested.<br> 2) The values are Array of ids. This ids are provided by the requestAnimationFrame() calls and are used by the stopScrollingX() function any scroll-animation on the x-axis for the passed component.
`_yMapContainerAnimationID` | A Map (key, value) in which: <br> 1) The keys are the containers on which a scroll-animation on the y-axis has been requested.<br> 2) The values are Array of ids. This ids are provided by the requestAnimationFrame() calls and are used by the stopScrollingY() function any scroll-animation on the y-axis for the passed component.
`_xStepLengthCalculator` | A Map (key, value) in which: <br> 1) The keys are the container on which a scroll-animation on the x-axis has been requested.<br> 2) The values are user-defined functions that can modify the step's length at each _stepX call of a scroll-animation on the x-axis.
`_yStepLengthCalculator` | A Map (key, value) in which: <br> 1) The keys are the container on which a scroll-animation on the y-axis has been requested.<br> 2) The values are user-defined functions that can modify the step's length at each _stepY call of a scroll-animation on the y-axis.
`_xStepLength` | The number of pixel scrolled in a single scroll-animation's (on the x-axis) step.
`_yStepLength` | The number of pixel scrolled in a single scroll-animation's (on the y-axis) step.
`_minAnimationFrame` | The minimum number of frames any scroll-animation  (on any axis) should last.

# Methods List
Method Name | Purpose
----------- | -------

