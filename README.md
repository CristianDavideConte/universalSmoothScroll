# Universal Smooth Scroll API ![](https://raw.githubusercontent.com/CristianDavideConte/universalSmoothScroll/master/images/favicon.png)
The Universal Smooth Scroll API is a **lightweight javascript piece of code** that enables an enriched version of the standard `scroll-behavior: smooth` CSS property.<br>
This scroll API is based on and improves upon the 3 main ways to scroll an element in plain js: `scrollTo`, `scrollBy`, `scrollIntoView`.<br>
**Every scroll-animation** triggered by the API **can be interrupted** at any moment and **supports custom ease functions.**<br>
**Multiple scroll-animations** can be played **at the same time** on 1 or more DOM's elements.<br>

# Demo
You can try most of the API functionalities on [my personal website](https://cristiandavideconte.github.io/myPersonalWebPage/).<br>
You can also take a look at how the single features are implemented on [this playground](https://cristiandavideconte.github.io/universalSmoothScroll/).

# How to install
## NPM:
`npm i universalsmoothscroll`
## HTML meta tag:
Add one of this `<script>` in your project's `<head>` tag:<br>
#### Stable versions:<br>
`<script src = "https://rawcdn.githack.com/CristianDavideConte/universalSmoothScroll/3ed4511f60dd5e29973f5f32f7bd520fafbd61dd/js/universalsmoothscroll-min.js"></script>`<br>
#### Latest version:<br>
`<script src = "https://raw.githack.com/CristianDavideConte/universalSmoothScroll/master/js/universalsmoothscroll-min.js"></script>`
## Local file:
Copy & paste the script's minified version that you can find [here](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/universalsmoothscroll-min.js) in your project's js directory & add the `<script>`. For example:<br>
```
<head>
    ...
  <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-min.js"></script>
    ...
</head>
```
# How does it work ?
All the API's properties are methods of the `uss` object which gets automatically initialized when you import the script in your project.<br>
The `uss` object is initialized in the global scope of you project so be aware of that !<br>
The `uss` object has some internal variables which **SHOULD NOT** be directly manipulated: it's suggested to always use the provided getters and setters.<br>
You will be able to recognize those internal properties because their names begin with an `_` (underscore). <br>
For istance:
* `uss._xStepLength` is the name of the internal property used by the `uss` objects' methods.
* `uss.getXStepLength()` & `uss.setXStepLength()` are the getter and setter's names for the `uss._xStepLength` variable.<br>

There are 3 main scrolling-methods:
* `uss.scrollTo()`
* `uss.scrollBy()`
* `uss.scrollIntoView()`<br>

There's also 1 handy auto-initializer for anchor links:
* `uss.hrefSetup()`<br>

# Internal-Use variables list
Variable name | Purpose
------------- | -------
`_xMapContainerAnimationID` | A Map <key, value> in which: <br> 1) The keys are the containers on which a scroll-animation on the x-axis has been requested.<br> 2) The values are Array of IDs. This IDs are provided by the requestAnimationFrame() calls and are used internally to keep track of the next scroll-animation's step function call and also by the stopScrollingX() function to stop any scroll-animation on the x-axis for the passed container.
`_yMapContainerAnimationID` | A Map <key, value> in which: <br> 1) The keys are the containers on which a scroll-animation on the y-axis has been requested.<br> 2) The values are Array of IDs. This IDs are provided by the requestAnimationFrame() calls and are used internally to keep track of the next scroll-animation's step function call and also by the stopScrollingY() function to stop any scroll-animation on the y-axis for the passed container.
`_xStepLengthCalculator` | A Map <key, value> in which: <br> 1) The keys are the container on which a scroll-animation on the x-axis has been requested.<br> 2) The values are user-defined functions that can modify the step's length at each _stepX (internal function that executes the instructions for a single scroll-animation's step on the x-axis) call of a scroll-animation.
`_yStepLengthCalculator` | A Map <key, value> in which: <br> 1) The keys are the container on which a scroll-animation on the y-axis has been requested.<br> 2) The values are user-defined functions that can modify the step's length at each _stepY (internal function that executes the instructions for a single scroll-animation's step on the y-axis) call of a scroll-animation.
`_xStepLength` | The number of pixel scrolled on the x-axis in a single scroll-animation's step.
`_yStepLength` | The number of pixel scrolled on the y-axis in a single scroll-animation's step.
`_minAnimationFrame` | The minimum number of frames any scroll-animation, on any axis, should last.

# Constants list
Constant name | Purpose
------------- | -------
`DEFAULTXSTEPLENGTH` | Default number of pixel scrolled in a single scroll-animation's step on the x-axis: 50px steps for a 1920px screen width.
`DEFAULTYSTEPLENGTH` | Default number of pixel scrolled in a single scroll-animation's step on the y-axis: 50px steps for a 937px(1080px - urlbar) screen height.
`DEFAULTMINANIMATIONFRAMES` | Default lowest possible number of frames any scroll-animation should last.

# Methods List
Method Name | Purpose
----------- | -------
`isXscrolling` | Returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
`isYscrolling` | Returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
`getXStepLengthCalculator` | Returns the _xStepLengthCalculator function for the passed container.
`getYStepLengthCalculator` | Returns the _yStepLengthCalculator function for the passed container.
`getXStepLength` | Returns the value of _xStepLength.
`getYStepLength` | Returns the value of _yStepLength.
`getMinAnimationFrame` | Returns the value of _minAnimationFrame.
`setXStepLengthCalculator` | Sets the _xStepLengthCalculator for the requested container to the passed function if compatible.
`setYStepLengthCalculator` | Sets the _yStepLengthCalculator for the requested container to the passed function if compatible.
`setXStepLength` | Sets the _xStepLength to the passed value if compatible.
`setYStepLength` | Sets the _yStepLength to the passed value if compatible.
`setMinAnimationFrame` | Sets the _minAnimationFrame to the passed value if compatible.
`calcXStepLength` | Takes in the remaning scroll amount of a scroll-animation on the x-axis and calculates how long each animation-step must be in order to target the _minAnimationFrame.
`calcYStepLength` | Takes in the remaning scroll amount of a scroll-animation on the y-axis and calculates how long each animation-step must be in order to target the _minAnimationFrame.
`getScrollXCalculator` | Takes in a container and returns a function that returns:<br> 1) The scrollLeft property of the container if it's a DOM element.<br> 2) The scrollX property of the container if it's the window element.
`getScrollYCalculator` | Takes in a container and returns a function that returns:<br> 1) The scrollTop property of the container if it's a DOM element.<br> 2) The scrollY property of the container if it's the window element.
`getMaxScrollX` | Takes in a scroll container and returns its highest scroll-reachable x-value.
`getMaxScrollY` | Takes in a scroll container and returns its highest scroll-reachable y-value.
`getScrollableParent` | Returns the first scrollable container of the passed element, works with "overflow('',X,Y): hidden" if specified.
`scrollXTo` | Takes in a number which indicates the position that the passed container's "scrollX" (the left border's x-coordinate) has to reach and performs a scroll-animation on the x-axis.<br>After the animation has finished a callback function can be invoked.
`scrollYTo` | Takes in a number which indicates the position that the passed container's "scrollY" (the top border's y-coordinate) has to reach and performs a scroll-animation on the y-axis.<br>After the animation has finished a callback function can be invoked.
`scrollXBy` | Takes in a number which indicates the number of pixel on the x-axis the passed container has to be scrolled by and performs a scroll-animation on that axis.<br>After the animation has finished a callback function can be invoked.
`scrollYBy` | Takes in a number which indicates the number of pixel on the y-axis the passed container has to be scrolled by and performs a scroll-animation on that axis.<br>After the animation has finished a callback function can be invoked.
`scrollTo` | A shorthand for calling scrollXTo() and scrollYTo() one after another (the 2 animations are performed at the same time), performs 2 scroll-animation on the x and y axises based on the passed parameters.
`scrollBy` | A shorthand for calling scrollXBy() and scrollYBy() one after another (the 2 animations are performed at the same time), performs 2 scroll-animation on the x and y axises based on the passed parameters.
`scrollIntoView` | Scrolls the window and, if necessary, the container of the passed element in order to make it visible on the screen.<br> There are 3 possible allignments for both the passed element and it's closest scrollable container: top, bottom, center.<br> The allignments can be changed by passing different values of alignToTop and alignToLeft.<br> Works with "overflow('',X,Y): hidden" if specified.
`stopScrollingX` | Stops all the current scroll-animation on the x-axis of the passed container.<br>After the animations are stopped a callback function can be invoked.
`stopScrollingY` | Stops all the current scroll-animation on the y-axis of the passed container.<br>After the animations are stopped a callback function can be invoked.
`hrefSetup` | Looks for every anchor element (`<a>` && `<area>`) with a value for the href attribute linked to an element on the same page and attaches an eventListener(onclick) to it in order to trigger a smooth-scroll-animation to reach the linked element (internally uses scrollIntoView).

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
 *        In order for it to work, it has to always return a number > 0 (otherwise the return value at runtime will be defaulted to uss._xStepLength)
 *        It will be passed 5 readonly input parameters that can be used to do calculations:
 *        1) remaningScrollAmount
 *        2) requestAnimationFrame call's timestamp
 *        3) totalScrollAmount
 *        4) currentXPosition of the container's left border
 *        5) finalXPosition the container's left border has to reach
 * @param container window or HTML element
 */
 function setXStepLengthCalculator (newCalculator = undefined, container = window);
```
#### setYStepLengthCalculator
```javascript
/*
 * @param newCalculator function that defines the length of each step of every scroll-animation on the y-axis for the passed container.
 *        In order for it to work, it has to always return a number > 0 (otherwise the return value at runtime will be defaulted to uss._yStepLength)
 *        It will be passed 5 readonly input parameters that can be used to do calculations:
 *        1) remaningScrollAmount
 *        2) requestAnimationFrame call's timestamp
 *        3) totalScrollAmount
 *        4) currentYPosition of the container's top border
 *        5) finalYPosition the container's top border has to reach
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
 * @param finalXPosition the "scroll-width" you want the left border of your container to be at the end of the scroll-animation.
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
 * @param finalYPosition the "scroll-height" you want the top border of your container to be at the end of the scroll-animation.
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
 * @param deltaX the number of pixels on the x-axis you want your container to scroll by.
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
 * @param deltaY the number of pixels on the y-axis you want your container to scroll by.
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
 * @param finalXPosition the "scroll-width" you want the left border of your container to be at the end of the scroll-animation.
 * @param finalYPosition the "scroll-height" you want the top border of your container to be at the end of the scroll-animation.
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
 * @param deltaX the number of pixels on the x-axis you want your container to scroll.
 * @param deltaY the number of pixels on the y-axis you want your container to scroll.
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
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden, false otherwise.
 */
 function hrefSetup (includeHidden = false);
```

# FAQ
## Q: Do i need to have _`scroll-behavior: smooth`_ in my CSS ?
A: NO! It will break the API.
## Q: How do I invoke the API methods ?  
A: Any Universal Smooth Scroll API function call has this structure: `uss.NAME_OF_THE_METHOD (ARGUMENTS);`
## Q: What is the difference between _`canOverlay = false`_ and _`canOverlay = true`_ ?
A: They produce two completly different kind of scroll-animations.<br>
_`canOverlay = false`_ means that before the scroll-animation you requested can be played any other scroll-animation on the same axis of the passed container is cancelled so this kind of scroll-animations always start from a no movement situation in order to be played.<br>  
_`canOverlay = true`_ means that even if other scroll-animations on the same axis of the requested scroll-animation's container are currently being played they won't be cancelled by default and the new animation will be executed meanwhile the others are still playing.<br>
This is an example of how different these two kind of scroll-animations are:<br>
```javascript
const totalScrollAmount = wheelEvent => {
  const deltaY = (Math.abs(wheelEvent.deltaY) >= 100) ? wheelEvent.deltaY / 100 : wheelEvent.deltaY;
  return deltaY * window.innerHeight / 3;
}
const ourEaseFunction = (remaning, timestamp, total, currentY, finalY) => {return remaning / 10 + 1;};
uss.setYStepLengthCalculator(ourEaseFunction, window);

//CASE A: canOverlay = false
const canOverlayFalseBehaviour = wheelEvent => {
    wheelEvent.preventDefault();
    wheelEvent.stopPropagation();
    uss.scrollYBy(totalScrollAmount(wheelEvent), window, null, false);
}

//CASE B: canOverlay = true
/*
 * Because canOverlay = true now, we keep track of the scrolling direction
 * otherwise multiple scroll-animation may "fight" against each other if
 * the scrolling directions are different.
 */
let previousWindowScrollDirection = undefined;
let currentWindowScrollDirection = undefined;
const canOverlayTrueBehaviour = wheelEvent => {
    wheelEvent.preventDefault();
    wheelEvent.stopPropagation();
    currentWindowScrollDirection = Math.sign(wheelEvent.deltaY);
    if(currentWindowScrollDirection !== previousWindowScrollDirection) {
        previousWindowScrollDirection = currentWindowScrollDirection;
        uss.stopScrollingY(window);
    }
    uss.scrollYBy(totalScrollAmount(wheelEvent), window, null, true);
}

//Uncomment one or the other and look at the difference
//window.addEventListener("wheel", canOverlayFalseBehaviour, {passive: false});
//window.addEventListener("wheel", canOverlayTrueBehaviour,  {passive: false});
```
## Q: Can i modify the way scroll-animation steps are calculated to a non-linear behavior ?
A: YES! <br>
Just use `uss.setXStepLengthCalculator(YOUR_CUSTOM_STEP_CALCULATOR_FUNCTION, THE_TARGET_CONTAINER)` for the x-axis and `uss.setYStepLengthCalculator(...)` for the y-axis. <br>
For example:<br>
```javascript
uss.setYStepLengthCalculator((remaning, timestamp, total, currentY, finalY) => {return remaning / 10 + 1;});
```
## Q: Can I make my scroll-animation last a certain amount of time?
A: YES!<br>
While setting a custom stepLengthCalculator you will notice your function will be passed the timestamp of the window.requestAnimationFrame call as the second argument !<br>
You may find [this](https://developer.mozilla.org/en/docs/Web/API/Window/requestAnimationFrame) useful.
## Q: What's the difference between the _stable_ and the _latest_ API version ?
A: The **_latest_** version gets updated every time a change is made which means that you have all the lastest features and fixes but that some functionality may have some bugs or code leftovers.<br> The **_stable_** version gets updated only when a feature is completly stable and the code is cleaned which lowers the probability of encountering bugs but the newest features may take a while to arrive here.
## Q: Why is it allowed to directly modify internal variables ?
A: It is allowed (but not suggested) because there may be a bug (rare cases) that prevents you from setting a variable to a right value. If that's the case don't hesitate to contact me !

More coming soon...

# Browser Compatibility
* ❌ IE (doesn't support ES6 js default parameters values nor `() => {}` sintax)
* ✔️ Edge (from version ❔)
* ✔️ Firefox (from version ❔)
* ✔️ Chrome (from version ❔)
* ✔️ Safari (from version ❔)
* ✔️ Opera (from version ❔)
* ✔️ Safari for iOS (from version ❔)
* ✔️ Opera mini (from version ❔)
* ❔  Android browser (not tested)
* ✔️ Opera mobile (from version ❔)
* ✔️ Chrome for Android (from version ❔)
* ✔️ Firefox for Android (from version ❔)
* ✔️ UC Browser for Android (from version ❔)
* ✔️ Samsung Internet (from version ❔)
* ❔  QQ Browser (not tested)
* ✔️ Baidu Browser (from version ❔)
* ❔  KaiOS Browser (not tested)

# Contact Me
For any bug  you found, improvement suggestion, feature request, or if you simply need to contact me, use [my website](https://cristiandavideconte.github.io/myPersonalWebPage). <br>
Feel free to reach out !
