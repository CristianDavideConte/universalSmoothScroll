# Universal Smooth Scroll API ![](https://raw.githubusercontent.com/CristianDavideConte/universalSmoothScroll/master/images/favicon.png)

![GitHub release (latest by date)](https://img.shields.io/github/v/release/CristianDavideConte/universalSmoothScroll?color=rgba%2850%2C200%2C80%29&label=Version&logo=github) 
![npm](https://img.shields.io/npm/v/universalsmoothscroll?color=rgb%28255%2C50%2C50%29&label=%20Version&logo=npm) 
[<img id="donate" src="http://www.imonticelli31.com/wp-content/uploads/2020/04/PayPal-Logo.png" height="50" width="100"/>](https://www.paypal.com/donate?hosted_button_id=9ZH3MVR56C7M8)

The Universal Smooth Scroll API is a **lightweight and very fast javascript library** that provides an enriched version of the standard `scroll-behavior: smooth` CSS property. <br/>
This scroll API is based on and improves upon the 3 main ways to scroll an element in plain js: `scrollTo()`, `scrollBy()`, `scrollIntoView()`.<br/>
**Every scroll-animation** triggered by the API **can be interrupted** at any moment and **supports user-defined custom ease functions.**<br/>
**Multiple scroll-animations** can be played **at the same time** for 1 or more DOM's elements.<br/>

# Demo
You can try most of the API functionalities on [my personal website](https://cristiandavideconte.github.io/myPersonalWebPage/).<br/>
You can also take a look at how single features are implemented on [this playground](https://cristiandavideconte.github.io/universalSmoothScroll/).

# How to install
## NPM:
`npm i universalsmoothscroll`
## HTML tag:
Add this `<script>` to your project's `<head>`: <br/>
`<script src = "https://raw.githack.com/CristianDavideConte/universalSmoothScroll/master/js/universalsmoothscroll-min.js"></script>`<br/>

To include the support for cubic-bezier ease functions, also add this `<script>` to your project's `<head>`:<br/>
`<script src = "https://raw.githack.com/CristianDavideConte/universalSmoothScroll/master/js/universalsmoothscroll-ease-functions-min.js"></script>`

## Local file:
Download the scripts' minified versions that you can find [here](https://github.com/CristianDavideConte/universalSmoothScroll/releases), move it into your project's js directory & add it/them to your project's `<head>`. <br/>
For example:<br/>
```
<head>
    ...
  <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-min.js"></script>
  <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-ease-functions-min.js"></script> <!-- optional -->
    ...
</head>
```
# How does it work ?
All the API properties are methods of the `uss` object which gets automatically initialized when you import the script into your project.<br/>
The `uss` object is initialized in the global scope of you project so be aware of that !<br/>
The `uss` object has some internal variables which **SHOULD NOT** be directly manipulated: it's suggested to always use the provided getters and setters.<br/>
You will be able to recognize those internal properties because their names begin with an `_` (underscore). <br/>
For istance:
* `uss._xStepLength` is the name of the internal property used by the `uss` object's methods.
* `uss.getXStepLength()` & `uss.setXStepLength()` are the getter and setter for the `uss._xStepLength` variable.<br/>

There are 3 main scrolling-methods:
* `uss.scrollTo()`
* `uss.scrollBy()`
* `uss.scrollIntoView()`<br/>

There's also 1 handy auto-initializer for anchor links:
* `uss.hrefSetup()`<br/>

# Internal-Use variables list
Variable name | Purpose
------------- | -------
`_containersData` | A Map <key, value> in which: <br/> 1) A key is a DOM element internally called *"container"*.<br/> 2) A value is an array with 14 values, which are:<br/><ol>**[0]** contains the ID of a request scroll-animation on the x-axis provided by the `requestAnimationFrame` method.<br/>Null if no scroll-animation on the x-axis are currently being performed.<br/>**[1]** contains the ID of a request scroll-animation on the y-axis provided by the `requestAnimationFrame` method.<br/>Null if no scroll-animation on the y-axis are currently being performed.<br/>**[2]** contains the position in pixel at which the container will be at the end of the scroll-animation on the x-axis.<br/>**[3]** contains the position in pixel at which the container will be at the end of the scroll-animation on the y-axis.<br/>**[4]** contains the direction of the current scroll-animation on the x-axis.<br/>1 if the elements inside the container will go from right to left because of the scrolling, -1 otherwise.<br/>**[5]** contains the direction of the current scroll-animation on the y-axis.<br/>1 if the elements inside the container will go from bottom to top because of the scrolling, -1 otherwise.<br/>**[6]** contains the total amount of pixels that have to be scrolled from the start of the current scroll-animation on the x-axis to its end.<br/>**[7]** contains the total amount of pixels that have to be scrolled from the start of the current scroll-animation on the y-axis to its end.<br/>**[8]** contains the starting time in milliseconds (`DOMHighResTimeStamp`) of the current scroll-animation on the x-axis.<br/>**[9]** contains the starting time in milliseconds (`DOMHighResTimeStamp`) of the current scroll-animation on the y-axis.<br/>**[10]** contains a callback function that will be executed when the current scroll-animation on the x-axis has been performed.<br/>**[11]** contains a callback function that will be executed when the current scroll-animation on the y-axis has been performed.<br/>**[12]** contains a user-defined ease functions that will return the length of each individual step of a scroll-animation on the x-axis.<br/>**[13]** contains a user-defined ease functions that will return the length of each individual step of a scroll-animation on the y-axis.<br/></ol>
`_xStepLength` | The number of pixel scrolled on the x-axis in a single scroll-animation's step.
`_yStepLength` | The number of pixel scrolled on the y-axis in a single scroll-animation's step.
`_minAnimationFrame` | The minimum number of frames any scroll-animation, on any axis, should last.
`_windowHeight` | The current window's inner height in pixels.
`_windowWidth` | The current window's inner width in pixels.
`_reducedMotion` | A boolean which is true if the user has enabled any "reduce-motion" setting devicewise, false otherwise. <br/> Internally used to follow the user's accessibility settings reverting back to the browser's default _jump behavior_.  

# Constants list
Constant name | Purpose
------------- | -------
`INITIAL_WINDOW_HEIGHT` | The window's inner height when first loaded.
`INITIAL_WINDOW_WIDTH` | The window's inner width when first loaded.
`DEFAULT_XSTEP_LENGTH` | Default number of pixel scrolled in a single scroll-animation's step on the x-axis: 50px steps for a 1920px screen width.
`DEFAULT_YSTEP_LENGTH` | Default number of pixel scrolled in a single scroll-animation's step on the y-axis: 50px steps for a 937px(1080px - urlbar) screen height.
`DEFAULT_MIN_ANIMATION_FRAMES` | Default lowest possible number of frames any scroll-animation should last.
`DEFAULT_SCROLL_CALCULATOR_TEST_VALUE` | Default number of pixel scrolled when testing a newScrollCalculator.

# Methods List
Method Name | Purpose
----------- | -------
`isXscrolling` | Returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
`isYscrolling` | Returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
`isScrolling` | Returns true if a scroll-animation on any axis of the passed container is currently being performed by this API, false otherwise.
`getXStepLengthCalculator` | Returns the _xStepLengthCalculator ease function for the passed container.
`getYStepLengthCalculator` | Returns the _yStepLengthCalculator ease function for the passed container.
`getXStepLength` | Returns the value of _xStepLength.
`getYStepLength` | Returns the value of _yStepLength.
`getMinAnimationFrame` | Returns the value of _minAnimationFrame.
`getWindowHeight` | Returns the value of _windowHeight.
`getWindowWidth` | Returns the value of _windowWidth.
`getReducedMotionState` | Returns the value of _reducedMotion.
`setXStepLengthCalculator` | Sets the _xStepLengthCalculator for the requested container to the passed ease function if compatible.
`setYStepLengthCalculator` | Sets the _yStepLengthCalculator for the requested container to the passed ease function if compatible.
`setStepLengthCalculator` | Sets both the _xStepLengthCalculator and the _yStepLengthCalculator for the requested container to the passed ease function if compatible.
`setXStepLength` | Sets the _xStepLength to the passed value if compatible.
`setYStepLength` | Sets the _yStepLength to the passed value if compatible.
`setStepLength` | Sets both the _xStepLength and the _yStepLength to the passed value if compatible.
`setMinAnimationFrame` | Sets the _minAnimationFrame to the passed value if compatible.
`calcXStepLength` | Takes in the remaning scroll amount of a scroll-animation on the x-axis and returns how long each scroll-animation-step must be in order to target the _minAnimationFrame.
`calcYStepLength` | Takes in the remaning scroll amount of a scroll-animation on the y-axis and returns how long each scroll-animation-step must be in order to target the _minAnimationFrame.
`getScrollXCalculator` | Takes in a container and returns a function that returns:<br/> 1) The scrollLeft property of the container if it's an instance of HTMLelement.<br/> 2) The scrollX property of the container if it's the window element.
`getScrollYCalculator` | Takes in a container and returns a function that returns:<br/> 1) The scrollTop property of the container if it's an instance of HTMLelement.<br/> 2) The scrollY property of the container if it's the window element.
`getMaxScrollX` | Takes in a scroll container and returns its highest scroll-reachable x-value.
`getMaxScrollY` | Takes in a scroll container and returns its highest scroll-reachable y-value.
`getScrollableParent` | Returns the first scrollable container of the passed element, works with "overflow('',X,Y): hidden" if specified.
`scrollXTo` | Takes in a number which indicates the position that the passed container's "scrollX" (left border's x-coordinate) has to reach and performs a scroll-animation on the x-axis. <br/> After the scroll-animation has finished a callback function can be invoked.
`scrollYTo` | Takes in a number which indicates the position that the passed container's "scrollY" (top border's y-coordinate) has to reach and performs a scroll-animation on the y-axis. <br/> After the scroll-animation has finished a callback function can be invoked.
`scrollXBy` | Takes in a number which indicates the number of pixel on the x-axis that the passed container has to be scrolled by and performs a scroll-animation on that axis. <br/> After the scroll-animation has finished a callback function can be invoked.
`scrollYBy` | Takes in a number which indicates the number of pixel on the y-axis that the passed container has to be scrolled by and performs a scroll-animation on that axis. <br/> After the scroll-animation has finished a callback function can be invoked.
`scrollTo` | Takes in 2 numbers which respectively indicate the position that the passed container's "scrollX" (left border's x-coordinate) and "scrollY" (top border's y-coordinate) have to reach and performs 2 scroll-animations on both the x-axis and the y-axis. <br/> After the scroll-animations have finished a callback function can be invoked.
`scrollBy` | Takes in 2 numbers which respectively indicate the number of pixels on the x-axis and the y-axis that the passed container has to be scrolled by and performs 2 scroll-animations on both the x-axis and the y-axis. <br/> After the scroll-animations have finished a callback function can be invoked.
`scrollIntoView` | Scrolls the window and, if necessary, the container of the passed element in order to make it visible on the screen. <br/> There are 3 possible allignments for both the passed element and it's closest scrollable container: top, bottom, center. <br/> The allignments can be changed by passing different values of alignToTop and alignToLeft.<br/> Works with "overflow('',X,Y): hidden" if specified. <br/> After the scroll-animations have finished a callback function can be invoked.
`stopScrollingX` | Stops all the current scroll-animation on the x-axis of the passed container. <br/> After the animations are stopped a callback function can be invoked.
`stopScrollingY` | Stops all the current scroll-animation on the y-axis of the passed container. <br/> After the animations are stopped a callback function can be invoked.
`stopScrolling` | Stops all the current scroll-animation on both the x-axis and the y-axis of the passed container. <br/> After the animations are stopped a callback function can be invoked.
`hrefSetup` | Looks for every anchor element (`<a>` && `<area>`) with a value for the href attribute linked to an element on the same page and attaches an eventListener(onclick) to it in order to trigger a smooth scroll-animation to reach the linked element (internally uses `scrollIntoView`). <br/> Before the scroll-animations are performed an init function can be invoked. <br/> After the scroll-animations have finished a callback function can be invoked.

# Methods' syntaxes
#### isXscrolling
```javascript
/*
 * @param container window or HTML element
 */
 function isXscrolling (container = window);
```
#### isYscrolling
```javascript
/*
 * @param container window or HTML element
 */
 function isYscrolling (container = window);
```
#### isScrolling
```javascript
/*
 * @param container window or HTML element
 */
 function isScrolling (container = window);
```
#### getXStepLengthCalculator
```javascript
/*
 * @param container window or HTML element
 */
 function getXStepLengthCalculator (container = window);
```
#### getYStepLengthCalculator
```javascript
/*
 * @param container window or HTML element
 */
 function getYStepLengthCalculator (container = window);
```
#### getXStepLength
```javascript
/* No input parameters required */
 function getXStepLength ();
```
#### getYStepLength
```javascript
/* No input parameters required */
 function getYStepLength ();
```
#### getMinAnimationFrame
```javascript
/* No input parameters required */
 function getMinAnimationFrame ();
```
#### getWindowHeight
```javascript
/* No input parameters required */
 function getWindowHeight ();
```
#### getWindowWidth
```javascript
/* No input parameters required */
 function getWindowWidth ();
```
#### getReducedMotionState
```javascript
/* No input parameters required */
 function getReducedMotionState ();
```
#### setXStepLengthCalculator
```javascript
/*
 * @param newCalculator function that returns the length of each step of every scroll-animation on the x-axis for the passed container.
 *        In order for it to work, it has to always return a number >= 0 (otherwise the return value at runtime will be defaulted to uss._xStepLength)
 *        It will be passed the following input parameters:
 *          1) remaningScrollAmount of current the scroll-animation
 *          2) originalTimestamp provided by the first _stepX function call
 *          3) timestamp provided by each _stepX function call
 *          4) totalScrollAmount of the current scroll-animation
 *          5) currentXPosition of the container's left border
 *          6) finalXPosition that the container's left border has to reach
 *          7) container on which the scroll-animation is currently being performed
 * @param container window or HTML element
 */
 function setXStepLengthCalculator (newCalculator = undefined, container = window);
```
#### setYStepLengthCalculator
```javascript
/*
 * @param newCalculator function that returns the length of each step of every scroll-animation on the y-axis for the passed container.
 *        In order for it to work, it has to always return a number >= 0 (otherwise the return value at runtime will be defaulted to uss._yStepLength)
 *        It will be passed the following input parameters:
 *          1) remaningScrollAmount of current the scroll-animation
 *          2) originalTimestamp provided by the first _stepY function call
 *          3) timestamp provided by each _stepY function call
 *          4) totalScrollAmount of the current scroll-animation
 *          5) currentYPosition of the container's top border
 *          6) finalYPosition that the container's top border has to reach
 *          7) container on which the scroll-animation is currently being performed
 * @param container window or HTML element
 */
 function setYStepLengthCalculator (newCalculator = undefined, container = window);
```
#### setStepLengthCalculator
```javascript
/*
 * @param newCalculator function that returns the length of each step of every scroll-animation on both the x-axis and the y-axis for the passed container.
 *        In order for it to work, it has to always return a number >= 0 (otherwise the return value at runtime will be defaulted to uss._(x/y)StepLength)
 *        It will be passed the following input parameters:
 *          1) remaningScrollAmount of current the scroll-animation
 *          2) originalTimestamp provided by the first _stepX/Y function call
 *          3) timestamp provided by each _stepX/Y function call
 *          4) totalScrollAmount of the current scroll-animation
 *          5) currentPosition of the container's top/left border
 *          6) finalPosition that the container's top/left border has to reach
 *          7) container on which the scroll-animation is currently being performed
 * @param container window or HTML element
 */
 function setStepLengthCalculator (newCalculator = undefined, container = window);
```
#### setXStepLength
```javascript
/*
 * @param newXStepLength A number > 0
 */
 function setXStepLength (newXStepLength);
```
#### setYStepLength
```javascript
/*
 * @param newYStepLength A number > 0
 */
 function setYStepLength (newYStepLength);
```
#### setStepLength
```javascript
/*
 * @param newStepLength A number > 0
 */
 function setStepLength (newStepLength);
```
#### setMinAnimationFrame
```javascript
/*
 * @param newMinAnimationFrame A number > 0
 */
 function setMinAnimationFrame (newMinAnimationFrame);
```
#### calcXStepLength
```javascript
/*
 * USED INTERNALLY
 * @param deltaX A number > 0
 */
 function calcXStepLength (deltaX);
```
#### calcYStepLength
```javascript
/*
 * USED INTERNALLY
 * @param deltaY A number > 0
 */
 function calcYStepLength (deltaY);
```
#### getScrollXCalculator
```javascript
/*
 * @param container window or HTML element
 */
 function getScrollXCalculator (container = window);
```
#### getScrollYCalculator
```javascript
/*
 * @param container window or HTML element
 */
 function getScrollYCalculator (container = window);
```
#### getMaxScrollX
```javascript
/*
 * @param container window or HTML element
 */
 function getMaxScrollX (container = window);
```
#### getMaxScrollY
```javascript
/*
 * @param container window or HTML element
 */
 function getMaxScrollY (container = window);
```
#### getScrollableParent
```javascript
/*
 * @param element window or HTML element
 * @param includeHidden true if the element's first scrollable parent may have the
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function getScrollableParent (element = window, includeHidden = false);
```
#### scrollXTo
```javascript
/*
 * @param finalXPosition the x-axis coordinate you want the left border of your container to be at the end of the scroll-animation.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animation has been performed.
 */
 function scrollXTo (finalXPosition, container = window, callback = () => {});
```
#### scrollYTo
```javascript
/*
 * @param finalYPosition the y-axis coordinate you want the top border of your container to be at the end of the scroll-animation.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animation has been performed.
 */
 function scrollYTo (finalYPosition, container = window, callback = () => {});
```
#### scrollXBy
```javascript
/*
 * @param deltaX the number of pixels on the x-axis you want your container to be scrolled by.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animation has been performed.
 * @param stillStart true if any current scroll-animation on the x-axis of the passed container should be stopped before this method starts scrolling.
 *        Passing false would result in extending/reducing the current remaning scroll amount by the passed deltaX.     
 */
 function scrollXBy (deltaX, container = window, callback = () => {}, stillStart = true);
```
#### scrollYBy
```javascript
/*
 * @param deltaY the number of pixels on the y-axis you want your container to be scrolled by.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animation has been performed.
 * @param stillStart true if any current scroll-animation on the y-axis of the passed container should be stopped before this method starts scrolling.
 *        Passing false would result in extending/reducing the current remaning scroll amount by the passed deltaY.  
 */
 function scrollYBy (deltaY, container = window, callback = () => {}, stillStart = true);
```
#### scrollTo
```javascript
/*
 * @param finalXPosition the x-axis coordinate you want the left border of your container to be at the end of the scroll-animation.
 * @param finalYPosition the y-axis coordinate you want the top border of your container to be at the end of the scroll-animation.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animations have been performed.
 */
 function scrollTo (finalXPosition, finalYPosition, container = window, callback = () => {});
```
#### scrollBy
```javascript
/*
 * @param deltaX the number of pixels on the x-axis you want your container to be scrolled by.
 * @param deltaY the number of pixels on the y-axis you want your container to be scrolled by.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animations have been performed.
 * @param stillStart true if any current scroll-animation on both the x-axis and y-axis of the passed container should be stopped before this method starts scrolling.
 *        Passing false would result in extending/reducing the current remaning scroll amount on the x-axis by the passed deltaX and by the passed deltaY on the y-axis.
 */
 function scrollBy (deltaX, deltaY, container = window, callback = () => {}, stillStart = true);
```
#### scrollIntoView
```javascript
/*
 * @param element window or HTML element
 * @param alignToLeft true if you want both the passed element and it's container (if available) to be alligned to the left of:
 *                      1) The container for the passed element
 *                      2) The window for the element's container
 *                    false if you want both the passed element and it's container (if available) to be alligned to the right of:
 *                      1) The container for the passed element
 *                      2) The window for the element's container
 *                    anything else if you want both the passed element and it's container (if available) to be alligned to the center of:
 *                      1) The container for the passed element
 *                      2) The window for the element's container
 * @param alignToTop true if you want both the passed element and it's container (if available) to be alligned to the top of:
 *                      1) The container for the passed element
 *                      2) The window for the element's container
 *                    false if you want both the passed element and it's container (if available) to be alligned to the bottom of:
 *                      1) The container for the passed element
 *                      2) The window for the element's container
 *                    anything else if you want both the passed element and it's container (if available) to be alligned to the center of:
 *                      1) The container for the passed element
 *                      2) The window for the element's container
 * @callback callback the function you want to be executed after the scroll-animations have been performed.
 * @param includeHidden true if the element's first scrollable parent may have the
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function scrollIntoView (element = window, alignToLeft = true, alignToTop = true, callback = () => {}, includeHidden = false);
```
#### stopScrollingX
```javascript
/*
 * @param container window or HTML element
 * @callback callback the function you want to be executed after
 *           all the scroll-animations on the x-axis of the passed container have been stopped.
 */
 function stopScrollingX (container = window, callback = () => {});
```
#### stopScrollingY
```javascript
/*
 * @param container window or HTML element
 * @callback callback the function you want to be executed after
 *           all the scroll-animations on the y-axis of the passed container have been stopped.
 */
 function stopScrollingY (container = window, callback = () => {});
```
#### stopScrolling
```javascript
/*
 * @param container window or HTML element
 * @callback callback the function you want to be executed after
 *           all the scroll-animations on both the x-axis and the y-axis of the passed container have been stopped.
 */
 function stopScrolling (container = window, callback = () => {});
```
#### hrefSetup
```javascript
/*
 * @param alignToLeft true if you want either every valid anchor link's destination element and their containers (if available) to be alligned to the left of:
 *                      1) The container for the anchor link's destination element
 *                      2) The window for the destination elements' containers
 *                    false if you want either every valid anchor link's destination element and their containers (if available) to be alligned to the right of:
 *                      1) The container for the anchor link's destination element
 *                      2) The window for the destination elements' containers
 *                    anything else if you want either every valid anchor link's destination element and their containers (if available) to be alligned to the center of:
 *                      1) The container for the anchor link's destination element
 *                      2) The window for the destination elements' containers
 * @param alignToTop true if you want either every valid anchor link's destination element and their containers (if available) to be alligned to the top of:
 *                      1) The container for the anchor link's destination element
 *                      2) The window for the destination elements' containers
 *                    false if you want either every valid anchor link's destination element and their containers (if available) to be alligned to the bottom of:
 *                      1) The container for the anchor link's destination element
 *                      2) The window for the destination elements' containers
 *                    anything else if you want either every valid anchor link's destination element and their containers (if available) to be alligned to the center of:
 *                      1) The container for the anchor link's destination element
 *                      2) The window for the destination elements' containers
 * @callback init the function you want to be executed before
 *           any scroll-animation of every of the valid anchor link found by this function is performed.
 *           It will be passed the following input parameters:
 *             1) The anchor link element which has been clicked
 *             2) The anchor link's destination element
 *           It can return false to prevent the scroll-animation completly.
 * @callback callback the function you want to be executed after
 *           any scroll-animation of every of the valid anchor link found by this function have been performed.
 * @param includeHidden true if the first scrollable parent of any valid anchor link's destination element found by this function
 *        may have the CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden, false otherwise.
 */
 function hrefSetup (alignToLeft = true, alignToTop = true, init = () => {}, callback = () => {}, includeHidden = false);
```

# F.A.Q.
## Q: Can I use the API scrolling methods on containers that have the _`scroll-behavior: smooth`_ CSS property ?
A: NO! They won't work on those containers.
## Q: Can I use the API scrolling methods on containers that have the _`scroll-snap-type`_ CSS property ?
A: NO! They won't work on those containers.
## Q: How do I invoke the API methods ?  
A: Every Universal Smooth Scroll API function call has this structure: `uss.NAME_OF_THE_METHOD(ARGUMENTS)`.
## Q: Can I modify the way scroll-animation steps are calculated to a non-linear behavior ?
A: YES! <br/>
Just use `uss.setXStepLengthCalculator(YOUR_CUSTOM_EASE_FUNCTION, TARGET_CONTAINER)` for the x-axis and `uss.setYStepLengthCalculator(...)` for the y-axis. <br/>
For example:<br/>
```javascript
uss.setYStepLengthCalculator((remaning, originalTimestamp, timestamp, total, currentY, finalY, container) => {return remaning / 10 + 1;});
```
<br/>You can also use the standard cubic-bezier ease-functions included in the `universalsmoothscroll-ease-functions` library that you can find [here](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/universalsmoothscroll-ease-functions.js).<br/>
For istance:<br/>
```javascript
uss.setStepLengthCalculator(EASE_IN_OUT_CUBIC(), myContainer);
```
## Q: Can I make my scroll-animation last a certain amount of time?
A: YES!<br/>
While setting a custom ease function you will notice it will be passed both the timestamp relative to the beginning of the scroll-animation and the current timestamp as the second and third arguments of your function.<br/>
You can use them to make the scroll-animations last any amount of time you want.<br/><br/>
You can also use the standard cubic-bezier ease-functions included in the `universalsmoothscroll-ease-functions` library that you can find [here](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/universalsmoothscroll-ease-functions.js) which can be used by specifing a duration as the first argument.<br/>
For istance:<br/>
```javascript
uss.setStepLengthCalculator(EASE_LINEAR(2000), myContainer); //Every scroll-animation on our container will last 2 seconds
```
You may find [this](https://developer.mozilla.org/en/docs/Web/API/Window/requestAnimationFrame) helpful.
## Q: What is a _StepLengthCalculator_ ? 
A: It's function that has to always return a number >= 0.<br/>

This function will be invoked by the API every time it has to decide how many pixels should be scrolled on the x/y axis of a container.<br/>
The way the API will invoke this function is by passing it the following input parameters (in this order):
  - RemaningScrollAmount of current the scroll-animation
  - OriginalTimestamp provided by the first \_stepX/Y function call (indicates the exact time in milliseconds at which the scroll-animation has started)
  - Timestamp provided by each \_stepX/Y function call (indicates the time in milliseconds at which the StepLengthCalculator is invoked)
  - TotalScrollAmount of the current scroll-animation
  - CurrentPosition of the container's top/left border (top if the scroll-animation is on the y-axis, left otherwise)
  - FinalPosition that the container's top/left border has to reach (top if the scroll-animation is on the y-axis, left otherwise)
  - Container on which the scroll-animation is currently being performed (a DOM element that can be scrolled)<br/>

Imagine that a scroll-animation is like a stair: you know where/when you started, how long the stair is, how much time has passed and where you are right now.<br/>
This stair could have many steps and you can decide if you want to rest (don't make any step) or go faster (do more than one step at once) by telling the API through a StepLengthCalculator.<br/>   
This function can be invoked by the API 1000s of times during a single scroll-animation and that's why it gets passed all the parameters described above.<br/>

For istance:<br/>
```javascript
/*
 * This particular scroll calculator will make the scroll-animation
 * start slowly (total = remaning at the beginnig of the scroll-animation)
 * ramp up the speed (remaning will decrease more and more)
 * arriving at full speed (remaning = 0 at the end of the scroll-animation)   
 */
const myScrollCalculator = (remaning, originalTimestamp, timestamp, total, currentY, finalY, container) => {
    const traveledDistance = total - remaning; 
    return traveledDistance + 1; //+1 because at first total = remaning and we wouldn't move at all without it
};
uss.setYStepLengthCalculator(myScrollCalculator, myContainer);
```

You don't have to write your own StepLengthCalculator if you don't want to, infact the API will still function even if you don't specify any (the behavior will be linear).<br/>
You can also use the functions of the `universalsmoothscroll-ease-functions` library that you can find [here](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/universalsmoothscroll-ease-functions.js) to get a StepLengthCalculator.<br/>

For example:<br/>
```javascript
/* 
 * Make sure to have imported the universalsmoothscroll-ease-function library in your project 
 * This StepLengthCalculator will make our scroll-animations always last 1 second and will make sure that
 * they will start as fast as possible and finish as slow as they can. 
 */
uss.setXStepLengthCalculator(EASE_OUT_CUBIC(1000), myContainer);
```
[Here](https://easings.net/) you can find out more about the way the StepLengthCalculators provided by `universalsmoothscroll-ease-functions` [library](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/universalsmoothscroll-ease-functions.js) will affect your scroll-animations.
## Q: What is the difference between _`stillStart = true`_ and _`stillStart = false`_ ?
A: They produce 2 completly different kind of scroll-animations' behaviors.<br/>
_`stillStart = true`_ means that before the scroll-animation you requested can be played any other scroll-animation on the same axis of the passed container is cancelled so this type of scroll-animations always start from a no-movement situation in order to be performed.<br/>  
_`stillStart = false`_ means that even if other scroll-animations on the same axis of the passed container are currently being performed they won't be cancelled by default, they will just be extended/reduced by the passed delta.<br/>

This is an example of how different these 2 kind of scroll-animations are:<br/>
```javascript
const ourEaseFunction = (remaning, originalTimestamp, timestamp, total, currentY, finalY, container) => {return remaning / 15 + 1;};
uss.setYStepLengthCalculator(ourEaseFunction, window);

//CASE A: stillStart = true
const stillStartTrueBehavior = wheelEvent => {
    wheelEvent.preventDefault();
    wheelEvent.stopPropagation();
    uss.scrollYBy(wheelEvent.deltaY, window, null, true);
}

//CASE B: stillStart = false
const stillStartFalseBehavior = wheelEvent => {
    wheelEvent.preventDefault();
    wheelEvent.stopPropagation();
    uss.scrollYBy(wheelEvent.deltaY, window, null, false);
}

//Uncomment one or the other and look at the difference
//window.addEventListener("wheel", stillStartTrueBehavior,  {passive:false});
//window.addEventListener("wheel", stillStartFalseBehavior, {passive:false});
```
## Q: What is the _hrefSetup's_ `init` parameter ?
A: Unlike every other callback parameter of this API, this is a function that gets executed right before any scroll-animation is performed. <br/>
You may want to use this function to execute actions that must happen after an anchor link is clicked but before any scroll-animation is performed. <br/>
For example: <br/>
```javascript
let changeBg = () => document.body.style.backgroundColor = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"; //No need to return anything in this case
uss.hrefSetup(true, true, changeBg); //Every time an anchor link is clicked our body's backgroundColor is randomly changed
```
## Q: What are _`_scrollX()`_ and _`_scrollY()`_ ?
A: They are functions that can only be internally accessed by the API, you won't be able to invoke them. <br/>
They execute all the instructions needed for a single scroll-animation-step on respectively the x-axis and the y-axis.
## Q: Why there's no setter for the _`_reducedMotion`_ variable ?
A: Because it's up to the final users to decide which accessibility settings they want to enable. <br/>
Ignoring user preferences is not suggested.   
## Q: Why is it allowed to directly modify internal variables ?
A: It is allowed (but highly discouraged) because there may be a bug that prevents you from setting a variable to a right value (not common). <br/>
If that's the case don't hesitate to contact me !

More coming soon...

# Browser Compatibility
Browser | Support | From Version
:-------: | :-------------: | :------------:
IE | ❌ | ❓❓❓
Edge | ✔️ | ❔
Firefox | ✔️ | ❔
Chrome | ✔️ | ❔
Safari | ✔️ | ❔
Opera | ✔️ | ❔
Safari for iOS | ✔️ | ❔
Opera mini | ✔️ | ❔
Android browser | ✔️ | ❔
Opera mobile | ✔️ | ❔
Chrome for Android | ✔️ | ❔
Firefox for Android | ✔️ | ❔
UC Browser for Android | ✔️ | ❔
Samsung Internet | ✔️ | ❔
QQ Browser | ❔ | ❔
Baidu Browser | ✔️ | ❔
KaiOS Browser | ❔ | ❔

❓❓❓ IE doesn't support neither the ES6 functions' default parameters nor the `() => {}` sintax.

# Support Me
If you want to support my work through a donation, you can use the <a href="#donate">PayPal donate button</a> above.<br/>
Support is appreciated but it's not compulsory in any way nor needed in order to use any of my work!

# Contact Me
If you find a bug, have a suggestion, a feature request, or if you simply want to contact me, use [my website](https://cristiandavideconte.github.io/myPersonalWebPage). <br/>
Feel free to reach out !
