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
Copy & paste the script's minified version that you can find [here](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/) in your project's js directory & add the `<script>`. For example:<br>
`<script src = "./js/universalsmoothscroll-min.js"></script>`

# How does it work ? 
All the API's properties are methods of the `uss` object which gets automatically initialized when you import the script in your project.<br>
The `uss` object is initialized in the global scope of you project so be aware of that !<br>
The `uss` object has some internal variables which **SHOULD NOT** be directly manipulated: it's suggested to always use the provided getters and setters.<br>
You will be able to recognize those internal properties because their names begin with and `_` (underscore). <br>
For istance: 
* `uss._xStepLength` is the name of the internal property used by the `uss` objects' methods.
* `uss.getXStepLength()` & `uss.setXStepLength` are the getter and setter's names for the `uss._xStepLength` variable.<br>

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

# Constants list
Constant name | Purpose
------------- | -------
`DEFAULTXSTEPLENGTH` | Default number of pixel scrolled in a single scroll-animation's (on the x-axis) step: 50px steps for a 1920px screen width.
`DEFAULTYSTEPLENGTH` | Default number of pixel scrolled in a single scroll-animation's (on the y-axis) step: 50px steps for a 937px(1080px - urlbar) screen height.
`DEFAULTMINANIMATIONFRAMES` | Default lowest possible number of frames any scroll-animation should last.

# Methods List
Method Name | Purpose
----------- | -------
`isXscrolling` | Return true if a scroll-animation on the x-axis of the passed container is currently being performed, false otherwise.
`isYscrolling` | Return true if a scroll-animation on the y-axis of the passed container is currently being performed, false otherwise.
`getXStepLengthCalculator` | Return the _xStepLengthCalculator function for the passed container.
`getYStepLengthCalculator` | Return the _yStepLengthCalculator function for the passed container.
`getXStepLength` | Return the value of _xStepLength.
`getYStepLength` | Return the value of _yStepLength.
`getMinAnimationFrame` | Return the value of _minAnimationFrame.
`setXStepLengthCalculator` | Sets the _xStepLengthCalculator for the requested container to the passed function if compatible.
`setYStepLengthCalculator` | Sets the _yStepLengthCalculator for the requested container to the passed function if compatible.
`setXStepLength` | Sets the _xStepLength to the passed value if compatible.
`setYStepLength` | Sets the _yStepLength to the passed value if compatible.
`setMinAnimationFrame` | Sets the _minAnimationFrame to the passed value if compatible.
`calcXStepLength` | Takes in the total ammount of a scroll-animation on the x-axis and calculates the how long each animation-step must be in order to target the _minAnimationFrame.
`calcYStepLength` | Takes in the total ammount of a scroll-animation on the y-axis and calculates the how long each animation-step must be in order to target the _minAnimationFrame.
`getScrollXCalculator` | Takes in a container and returns a function that returns:<br> 1) The scrollLeft property of the container if it's a DOM element.<br> 2) The scrollX property of the container if it's the window element.
`getScrollYCalculator` | Takes in a container and returns a function that returns:<br> 1) The scrollTop property of the container if it's a DOM element.<br> 2) The scrollY property of the container if it's the window element.
`getMaxScrollX` | Takes in a scroll container and returns its highest scroll-reachable x-value.
`getMaxScrollY` | Takes in a scroll container and returns its highest scroll-reachable y-value.
`getScrollableParent` | Returns the first scrollable container of the passed element, works with "overflow('',X,Y): hidden" if specified.
`scrollXTo` | Takes in a number which indicates the position that window.scrollX has to reach and performs a scroll-animation on the x-axis, after the animation has finished a callback function can be invoked.
`scrollYTo` | Takes in a number which indicates the position that window.scrollY has to reach and performs a scroll-animation on the y-axis, after the animation has finished a callback function can be invoked.
`scrollXBy` | Takes in a number which indicates the number of pixel on the x-axis the passed container has to be scrolled by and performs a scroll-animation on that axis.
`scrollYBy` | Takes in a number which indicates the number of pixel on the y-axis the passed container has to be scrolled by and performs a scroll-animation on that axis.
`scrollTo` | A shorthand for calling scrollXTo() and scrollYTo one after another, performs 2 scroll-animation on the x and y axises based on the passed parameters.
`scrollBy` | A shorthand for calling scrollXBy() and scrollYBy one after another, performs 2 scroll-animation on the x and y axises based on the passed parameters.
`scrollIntoView` | Scrolls the window and if necessary the container of the passed element in order to make it visible on the screen.<br> There are 3 possible allignments: top, bottom, center.<br> The allignments can be changed by passing different values of alignToTop and alignToLeft.<br> Works with "overflow('',X,Y): hidden" if specified.
`stopScrollingX` | Stops all the current scroll-animation on the x-axis for the passed container.
`stopScrollingY` | Stops all the current scroll-animation on the y-axis for the passed container.
`hrefSetup` | Looks for every <a> DOM element with a href attribute linked to an element on the same page (anchor) and attaches an eventListener(onclick) to it in order to trigger a smooth-scroll-animation to reach the linked element.
  
# Methods' sintaxes
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
#### setXStepLengthCalculator
```javascript
/*
 * @param newCalculator function that defines the length of each step of every scroll-animation on the x-axis for the passed container.
 *        In order for it to work, it has to follow this rules:
 *        1) Has to take in 2 parameters (remaningScrollAmmount, requestAnimationFrame-call's timestamp) 
 *        2) Has to always return a number > 0 (otherwise the return value at runtime will be defaulted to uss._xStepLength)
 *        3) Can use other variables but it will be passed only the 2 mentioned above 
 * @param container window or HTML element
 */
 function setXStepLengthCalculator (newCalculator = undefined, container = window);
```
#### setYStepLengthCalculator
```javascript
/*
 * @param newCalculator function that defines the length of each step of every scroll-animation on the y-axis for the passed container.
 *        In order for it to work, it has to follow this rules:
 *        1) Has to take in 2 parameters (remaningScrollAmmount, requestAnimationFrame-call's timestamp) 
 *        2) Has to always return a number > 0 (otherwise the return value at runtime will be defaulted to uss._yStepLength)
 *        3) Can use other variables but it will be passed only the 2 mentioned above 
 * @param container window or HTML element
 */
 function setYStepLengthCalculator (newCalculator = undefined, container = window);
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
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden.
 *        False otherwise.
 */
 function getScrollableParent (element = window, includeHidden = false);
```
#### scrollXTo
```javascript
/*
 * @param finalXPosition the "scroll-width" you want the top of your container to be, at the end of the scroll-animation.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animation is ended.
 * @param canOverlay true if the animation on the passed container can overlay with other scroll-animations
 *        on the x-axis of the same container, false otherwise.
 *        Passing false will always result in a call to stopScrollingX() for the passed container before the animation takes place.
 */
 function scrollXTo (finalXPosition, container = window, callback = () => {}, canOverlay = false);
```
#### scrollYTo
```javascript
/*
 * @param finalYPosition the "scroll-height" you want the top of your container to be, at the end of the scroll-animation.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animation is ended.
 * @param canOverlay true if the animation on the passed container can overlay with other scroll-animations
 *        on the y-axis of the same container, false otherwise.
 *        Passing false will always result in a call to stopScrollingY() for the passed container before the animation takes place.
 */
 function scrollYTo (finalYPosition, container = window, callback = () => {}, canOverlay = false);
```
#### scrollXBy
```javascript
/*
 * @param deltaX the number of pixels you want the left of your container to scroll.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animation is ended.
 * @param canOverlay true if the animation on the passed container can overlay with other scroll-animations
 *        on the x-axis of the same container, false otherwise.
 *        Passing false will always result in a call to stopScrollingX() for the passed container before the animation takes place.
 */
 function scrollXBy (deltaX, container = window, callback = () => {}, canOverlay = false);
```
#### scrollYBy
```javascript
/*
 * @param deltaY the number of pixels you want the top of your container to scroll.
 * @param container window or HTML element
 * @callback callback the function you want to be executed after the scroll-animation is ended.
 * @param canOverlay true if the animation on the passed container can overlay with other scroll-animations
 *        on the y-axis of the same container, false otherwise.
 *        Passing false will always result in a call to stopScrollingY() for the passed container before the animation takes place.
 */
 function scrollYBy (deltaY, container = window, callback = () => {}, canOverlay = false);
```
#### scrollTo
```javascript
/*
 * @param finalXPosition the "scroll-width" you want the top of your container to be, at the end of the scroll-animation.
 * @param finalYPosition the "scroll-height" you want the top of your container to be, at the end of the scroll-animation.
 * @param xContainer window or HTML element
 * @param yContainer window or HTML element
 * @callback xCallback the function you want to be executed after the scroll-animation on the x-axis is ended.
 * @callback yCallback the function you want to be executed after the scroll-animation on the y-axis is ended.
 * @param xCanOverlay true if the animation on the passed container can overlay with other scroll-animations
 *        on the x-axis of the same container, false otherwise.
 *        Passing false will always result in a call to stopScrollingX() for the passed container before the animation takes place.
 * @param yCanOverlay true if the animation on the passed container can overlay with other scroll-animations
 *        on the y-axis of the same container, false otherwise.
 *        Passing false will always result in a call to stopScrollingY() for the passed container before the animation takes place.
 */
 function scrollTo (finalXPosition, finalYPosition, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false);
```
#### scrollBy
```javascript
/*
 * @param deltaX the number of pixels you want the left of your container to scroll.
 * @param deltaY the number of pixels you want the top of your container to scroll.
 * @param xContainer window or HTML element
 * @param yContainer window or HTML element
 * @callback xCallback the function you want to be executed after the scroll-animation on the x-axis is ended.
 * @callback yCallback the function you want to be executed after the scroll-animation on the y-axis is ended.
 * @param xCanOverlay true if the animation on the passed container can overlay with other scroll-animations
 *        on the x-axis of the same container, false otherwise.
 *        Passing false will always result in a call to stopScrollingX() for the passed container before the animation takes place.
 * @param yCanOverlay true if the animation on the passed container can overlay with other scroll-animations
 *        on the y-axis of the same container, false otherwise.
 *        Passing false will always result in a call to stopScrollingY() for the passed container before the animation takes place.
 */
 function scrollBy (deltaX, deltaY, xContainer = window, yContainer = window, xCallback = () => {}, yCallback = () => {}, xCanOverlay = false, yCanOverlay = false);
```
#### scrollIntoView
```javascript
/*
 * @param element window or HTML element
 * @param alignToLeft true if you want both the passed element and it's container (if available) to be alligned to the left 
 *                    of the container (for the passed element) and of the window (for the element's container);
 *                    false if you want both the passed element and it's container (if available) to be alligned to the right 
 *                    of the container (for the passed element) and of the window (for the element's container);
 *                    anything else if you want both the passed element and it's container (if available) to be alligned to the center 
 *                    of the container (for the passed element) and of the window (for the element's container).
 * @param alignToTop true if you want both the passed element and it's container (if available) to be alligned to the top 
 *                    of the container (for the passed element) and of the window (for the element's container);
 *                    false if you want both the passed element and it's container (if available) to be alligned to the bottom 
 *                    of the container (for the passed element) and of the window (for the element's container);
 *                    anything else if you want both the passed element and it's container (if available) to be alligned to the center 
 *                    of the container (for the passed element) and of the window (for the element's container).
 * @param includeHidden true if the element's first scrollable parent may have the 
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden.
 *        False otherwise.
 */
 function scrollIntoView (element = window, alignToLeft = true, alignToTop = true, includeHidden = false);
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
#### hrefSetup
```javascript
/*
 * @param includeHidden true if the element's first scrollable parent may have the 
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden.
 *        False otherwise.
 */
 function hrefSetup (includeHidden = false);
```
# DEMO 
You can try out some of the API functionalities [HERE](https://cristiandavideconte.github.io/universalSmoothScroll/) !
# FAQ
coming soon...

# Browser Compatibility
* IE (needs the window.requestAnimationFrame polifyll)
* Edge 
* Firefox (not tested)
* Chrome
* Safari
* Opera (not tested)
* Safari for iOS
* Opera mini (not tested)
* Android browser (not tested)
* Opera mobile (not tested)
* Chrome for Android 
* Firefox for Android (not tested)
* UC Browser for Android (not tested)
* Samsung Internet (not tested)
* QQ Browser (not tested)
* Baidu Browser (not tested)
* KaiOS Browser (not tested)
