#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Methods (public use)
Method Name | Purpose
----------- | -------
`isXscrolling` | Returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
`isYscrolling` | Returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
`isScrolling` | Returns true if a scroll-animation on any axis of the passed container is currently being performed by this API, false otherwise.
`getXStepLengthCalculator` | Returns the _xStepLengthCalculator ease function for the passed container if available.
`getYStepLengthCalculator` | Returns the _yStepLengthCalculator ease function for the passed container if available.
`getXStepLength` | Returns the value of `_xStepLength`.
`getYStepLength` | Returns the value of `_yStepLength`.
`getMinAnimationFrame` | Returns the value of `_minAnimationFrame`.
`getWindowHeight` | Returns the value of `_windowHeight`.
`getWindowWidth` | Returns the value of `_windowWidth`.
`getScrollbarsMaxDimension` | Returns the value of `_scrollbarsMaxDimension`.
`getPageScroller` | Returns the value of `_pageScroller`.
`getReducedMotionState` | Returns the value of `_reducedMotion`.
`setXStepLengthCalculator` | Sets the `_xStepLengthCalculator` for the requested container to the passed ease function if compatible.
`setYStepLengthCalculator` | Sets the `_yStepLengthCalculator` for the requested container to the passed ease function if compatible.
`setStepLengthCalculator` | Sets both the `_xStepLengthCalculator` and the `_yStepLengthCalculator` for the requested container to the passed ease function if compatible.
`setXStepLength` | Sets the `_xStepLength` to the passed value if compatible.
`setYStepLength` | Sets the `_yStepLength` to the passed value if compatible.
`setStepLength` | Sets both the `_xStepLength` and the `_yStepLength` to the passed value if compatible.
`setMinAnimationFrame` | Sets the `_minAnimationFrame` to the passed value if compatible.
`setPageScroller` | Sets the `_pageScroller` to the passed value if compatible.
`calcXStepLength` | Takes in the remaning scroll amount of a scroll-animation on the x-axis and returns how long each scroll-animation-step must be in order to target the `_minAnimationFrame` value.
`calcYStepLength` | Takes in the remaning scroll amount of a scroll-animation on the y-axis and returns how long each scroll-animation-step must be in order to target the `_minAnimationFrame` value.
 `calcScrollbarsDimensions` | Takes in an element and returns an array containing 2 numbers: <br/> <ol> **[0]** contains the vertical scrollbar's width of the passed container. <br/> **[1]** contains the horizontal scrollbar's height of the passed container. </ol>
`getScrollXCalculator` | Takes in a container and returns a function that returns:<br/>  - The scrollLeft property of the container if it's an instance of HTMLElement.<br/>  - The scrollX property of the container if it's the window element.
`getScrollYCalculator` | Takes in a container and returns a function that returns:<br/>  - The scrollTop property of the container if it's an instance of HTMLElement.<br/>  - The scrollY property of the container if it's the window element.
`getMaxScrollX` | Takes in a container and returns its highest scroll-reachable x-value.
`getMaxScrollY` | Takes in a container and returns its highest scroll-reachable y-value.
`getXScrollableParent` | Returns the first scrollable container for the passed element on the x-axis, works with `overflow:hidden`, `overflowX:hidden` and `overflowY:hidden` if specified.
`getYScrollableParent` | Returns the first scrollable container for the passed element on the y-axis, works with `overflow:hidden`, `overflowX:hidden` and `overflowY:hidden` if specified.
`getScrollableParent` | Returns the first scrollable container for the passed element, works with `overflow:hidden`, `overflowX:hidden` and `overflowY:hidden` if specified.
`scrollXTo` | Takes in a number which indicates the position that the passed container's left border's x-coordinate has to reach and performs a scroll-animation on the x-axis. <br/> After the scroll-animation has finished a callback function can be invoked.
`scrollYTo` | Takes in a number which indicates the position that the passed container's top border's y-coordinate has to reach and performs a scroll-animation on the y-axis. <br/> After the scroll-animation has finished a callback function can be invoked.
`scrollXBy` | Takes in a number which indicates the number of pixel on the x-axis that the passed container has to be scrolled by and performs a scroll-animation on that axis. <br/> After the scroll-animation has finished a callback function can be invoked.
`scrollYBy` | Takes in a number which indicates the number of pixel on the y-axis that the passed container has to be scrolled by and performs a scroll-animation on that axis. <br/> After the scroll-animation has finished a callback function can be invoked.
`scrollTo` | Takes in 2 numbers which respectively indicate the position that the passed container's left border's x-coordinate and top border's y-coordinate have to reach and performs 2 scroll-animations on both the x-axis and the y-axis. <br/> After the scroll-animations have been performed a callback function can be invoked.
`scrollBy` | Takes in 2 numbers which respectively indicate the number of pixels on the x-axis and the y-axis that the passed container has to be scrolled by and performs 2 scroll-animations on both the x-axis and the y-axis. <br/> After the scroll-animations have been performed a callback function can be invoked.
`scrollIntoView` | Scrolls all the necessary containers of the passed element in order to make it and its closest scrollable parent visible on the screen. <br/> There are 4 possible alignments for both: top, bottom, center, nearest. <br/> The alignments can be changed by passing different values of alignToTop and alignToLeft. <br/> Works with `overflow:hidden`, `overflowX:hidden` and `overflowY:hidden` if specified. <br/> After the scroll-animations have been performed a callback function can be invoked.
`scrollIntoViewIfNeeded` | Scrolls all the necessary containers of the passed element in order to make it and its closest scrollable parent visible on the screen only if they are not already fully visible. <br/> There are 2 possible alignments for both: center, nearest. <br/> The alignments can be changed by passing different values of alignToCenter. <br/> Works with `overflow:hidden`, `overflowX:hidden` and `overflowY:hidden` if specified. <br/> After the scroll-animations have been performed a callback function can be invoked.
`stopScrollingX` | Stops all the current scroll-animation on the x-axis of the passed container. <br/> After the animations have been stopped a callback function can be invoked.
`stopScrollingY` | Stops all the current scroll-animation on the y-axis of the passed container. <br/> After the animations have been stopped a callback function can be invoked.
`stopScrolling` | Stops all the current scroll-animation on both the x-axis and the y-axis of the passed container. <br/> After the animations have been stopped a callback function can be invoked.
`hrefSetup` | Looks for every anchor element (`<a>` && `<area>`) with a value for the `href` attribute which corresponds to an element on the same page and registers an eventListener for it in order to trigger a smooth scroll-animation to reach the linked element once the anchor is clicked (internally uses `scrollIntoView`). <br/> Before the scroll-animations are performed an init function can be invoked: if this functions returns false, the scroll-animation is prevented. <br/> After the scroll-animations have been performed a callback function can be invoked.
<br/>

# Methods signatures
#### isXscrolling
```javascript
/*
 * @param container window or HTMLElement
 */
 function isXscrolling (container = uss._pageScroller);
```
#### isYscrolling
```javascript
/*
 * @param container window or HTMLElement
 */
 function isYscrolling (container = uss._pageScroller);
```
#### isScrolling
```javascript
/*
 * @param container window or HTMLElement
 */
 function isScrolling (container = uss._pageScroller);
```
#### getXStepLengthCalculator
```javascript
/*
 * @param container window or HTMLElement
 */
 function getXStepLengthCalculator (container = uss._pageScroller);
```
#### getYStepLengthCalculator
```javascript
/*
 * @param container window or HTMLElement
 */
 function getYStepLengthCalculator (container = uss._pageScroller);
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
#### getPageScroller
```javascript
/* No input parameters required */
 function getPageScroller ();
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
 *        In order for it to work, it has to always return a number (otherwise the step length will be defaulted to calcXStepLength(totalScrollAmount) at runtime)
 *        It will be passed the following input parameters:
 *          1) remaningScrollAmount of current the scroll-animation
 *          2) originalTimestamp provided by the first _stepX function call
 *          3) timestamp provided by each _stepX function call
 *          4) totalScrollAmount of the current scroll-animation
 *          5) currentXPosition of the container's left border
 *          6) finalXPosition that the container's left border has to reach
 *          7) container on which the scroll-animation is currently being performed
 * @param container window or HTMLElement
 */
 function setXStepLengthCalculator (newCalculator, container = uss._pageScroller);
```
#### setYStepLengthCalculator
```javascript
/*
 * @param newCalculator function that returns the length of each step of every scroll-animation on the y-axis for the passed container.
 *        In order for it to work, it has to always return a number (otherwise the step length will be defaulted to calcYStepLength(totalScrollAmount) at runtime)
 *        It will be passed the following input parameters:
 *          1) remaningScrollAmount of current the scroll-animation
 *          2) originalTimestamp provided by the first _stepY function call
 *          3) timestamp provided by each _stepY function call
 *          4) totalScrollAmount of the current scroll-animation
 *          5) currentYPosition of the container's top border
 *          6) finalYPosition that the container's top border has to reach
 *          7) container on which the scroll-animation is currently being performed
 * @param container window or HTMLElement
 */
 function setYStepLengthCalculator (newCalculator, container = uss._pageScroller);
```
#### setStepLengthCalculator
```javascript
/*
 * @param newCalculator function that returns the length of each step of every scroll-animation on both the x-axis and the y-axis for the passed container.
 *        In order for it to work, it has to always return a number (otherwise the step length will be defaulted to calc[X/Y]StepLength(totalScrollAmount) at runtime)
 *        It will be passed the following input parameters:
 *          1) remaningScrollAmount of current the scroll-animation
 *          2) originalTimestamp provided by the first _stepX/Y function call
 *          3) timestamp provided by each _stepX/Y function call
 *          4) totalScrollAmount of the current scroll-animation
 *          5) currentPosition of the container's top/left border
 *          6) finalPosition that the container's top/left border has to reach
 *          7) container on which the scroll-animation is currently being performed
 * @param container window or HTMLElement
 */
 function setStepLengthCalculator (newCalculator, container = uss._pageScroller);
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
#### setPageScroller
```javascript
/*
 * @param newPageScroller window or HTMLElement
 */
 function setPageScroller (newPageScroller);
```
#### calcXStepLength
```javascript
/*
 * PUBLIC METHOD BUT USED INTERNALLY
 * @param deltaX A number > 0
 */
 function calcXStepLength (deltaX);
```
#### calcYStepLength
```javascript
/*
 * PUBLIC METHOD BUT USED INTERNALLY
 * @param deltaY A number > 0
 */
 function calcYStepLength (deltaY);
```
#### getScrollXCalculator
```javascript
/*
 * @param container window or HTMLElement
 */
 function getScrollXCalculator (container = uss._pageScroller);
```
#### getScrollYCalculator
```javascript
/*
 * @param container window or HTMLElement
 */
 function getScrollYCalculator (container = uss._pageScroller);
```
#### getMaxScrollX
```javascript
/*
 * @param container window or HTMLElement
 */
 function getMaxScrollX (container = uss._pageScroller);
```
#### getMaxScrollY
```javascript
/*
 * @param container window or HTMLElement
 */
 function getMaxScrollY (container = uss._pageScroller);
```
#### getXScrollableParent
```javascript
/*
 * @param element window or HTMLElement
 * @param includeHidden true if the element's first scrollable parent on the x-axis has
 *        the CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function getXScrollableParent (element, includeHidden = false);
```
#### getYScrollableParent
```javascript
/*
 * @param element window or HTMLElement
 * @param includeHidden true if the element's first scrollable parent on the y-axis has
 *        the CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function getYScrollableParent (element, includeHidden = false);
```
#### getScrollableParent
```javascript
/*
 * @param element window or HTMLElement
 * @param includeHidden true if the element's first scrollable parent has
 *        the CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function getScrollableParent (element, includeHidden = false);
```
#### scrollXTo
```javascript
/*
 * @param finalXPosition the x-axis coordinate you want the left border of your container to be at the end of the scroll-animation.
 * @param container window or HTMLElement
 * @callback the function you want to be executed after the scroll-animation has been performed.
 */
 function scrollXTo (finalXPosition, container = uss._pageScroller, callback = () => {});
```
#### scrollYTo
```javascript
/*
 * @param finalYPosition the y-axis coordinate you want the top border of your container to be at the end of the scroll-animation.
 * @param container window or HTMLElement
 * @callback the function you want to be executed after the scroll-animation has been performed.
 */
 function scrollYTo (finalYPosition, container = uss._pageScroller, callback = () => {});
```
#### scrollXBy
```javascript
/*
 * @param deltaX the number of pixels you want your container to be scrolled by on the x-axis.
 * @param container window or HTMLElement
 * @callback the function you want to be executed after the scroll-animation has been performed.
 * @param stillStart true if any current scroll-animation on the x-axis of the passed container should be stopped before this method starts scrolling.
 *        Passing false would result in extending/reducing the current remaning scroll amount by the passed deltaX.     
 */
 function scrollXBy (deltaX, container = uss._pageScroller, callback = () => {}, stillStart = true);
```
#### scrollYBy
```javascript
/*
 * @param deltaY the number of pixels you want your container to be scrolled by on the y-axis .
 * @param container window or HTMLElement
 * @callback the function you want to be executed after the scroll-animation has been performed.
 * @param stillStart true if any current scroll-animation on the y-axis of the passed container should be stopped before this method starts scrolling.
 *        Passing false would result in extending/reducing the current remaning scroll amount by the passed deltaY.  
 */
 function scrollYBy (deltaY, container = uss._pageScroller, callback = () => {}, stillStart = true);
```
#### scrollTo
```javascript
/*
 * @param finalXPosition the x-axis coordinate you want the left border of your container to be at the end of the scroll-animation.
 * @param finalYPosition the y-axis coordinate you want the top border of your container to be at the end of the scroll-animation.
 * @param container window or HTMLElement
 * @callback the function you want to be executed after the scroll-animations have been performed.
 */
 function scrollTo (finalXPosition, finalYPosition, container = uss._pageScroller, callback = () => {});
```
#### scrollBy
```javascript
/*
 * @param deltaX the number of pixels you want your container to be scrolled by on the x-axis .
 * @param deltaY the number of pixels you want your container to be scrolled by on the y-axis .
 * @param container window or HTMLElement
 * @callback the function you want to be executed after the scroll-animations have been performed.
 * @param stillStart true if any current scroll-animation on both the x-axis and y-axis of the passed container should be stopped before this method starts scrolling.
 *        Passing false would result in extending/reducing the current remaning scroll amount on the x-axis by the passed deltaX and by the passed deltaY on the y-axis.
 */
 function scrollBy (deltaX, deltaY, container = uss._pageScroller, callback = () => {}, stillStart = true);
```
#### scrollIntoView
```javascript
/*
 * @param element window or HTMLElement
 * @param alignToLeft true if you want both the passed element and its first scrollable parent (if available) to be aligned to the left of:
 *                      1) The scrollable parent for the passed element
 *                      2) The window for the element's scrollable parent
 *                    false if you want both the passed element and its first scrollable parent (if available) to be aligned to the right of:
 *                      1) The scrollable parent for the passed element
 *                      2) The window for the element's scrollable parent
 *                    "nearest" if you want:
 *                      1) The element to be dynamically aligned to the closest between the left, the center or the right of its first scrollable parent
 *                      2) The scrollable parent to be dynamically aligned to the closest between the left, the center or the right of the window
 *                    anything else if you want both the passed element and its first scrollable parent (if available) to be aligned to the center of:
 *                      1) The scrollable parent for the passed element
 *                      2) The window for the element's scrollable parent
 * @param alignToTop true if you want both the passed element and its first scrollable parent (if available) to be aligned to the top of:
 *                      1) The scrollable parent for the passed element
 *                      2) The window for the element's scrollable parent
 *                    false if you want both the passed element and its first scrollable parent (if available) to be aligned to the bottom of:
 *                      1) The scrollable parent for the passed element
 *                      2) The window for the element's container
 *                    "nearest" if you want:
 *                      1) The element to be dynamically aligned to the closest between the top, the center or the bottom of its first scrollable parent
 *                      2) The scrollable parent to be dynamically aligned to the closest between the top, the center or the bottom of the window
 *                    anything else if you want both the passed element and its first scrollable parent (if available) to be aligned to the center of:
 *                      1) The scrollable parent for the passed element
 *                      2) The window for the element's scrollable parent
 * @callback the function you want to be executed after the scroll-animations have been performed.
 * @param includeHidden true if the element's first scrollable parent may have the
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function scrollIntoView (element, alignToLeft = true, alignToTop = true, callback = () => {}, includeHidden = false);
```
#### scrollIntoViewIfNeeded
```javascript
/*
 * @param element window or HTMLElement
 * @param alignToCenter true if you want both the passed element and its first scrollable parent (if available) to be aligned to the center of:
 *                        1) The scrollable parent for the passed element
 *                        2) The window for the element's scrollable parent
 *                      anything else if you want:
 *                        1) The element to be dynamically aligned to the closest between:
 *                            - x-axis: the left, the center or the right of its first scrollable parent
 *                            - y-axis: the top, the center or the bottom of its first scrollable parent
 *                        2) The scrollable parent to be dynamically aligned to the closest between:
 *                            - x-axis: the left, the center or the right of the window
 *                            - y-axis: the top, the center or the bottom of the window
 * @callback the function you want to be executed after the scroll-animations have been performed.
 * @param includeHidden true if the element's first scrollable parent may have the
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function scrollIntoViewIfNeeded (element, alignToCenter = true, callback = () => {}, includeHidden = false);
```
#### stopScrollingX
```javascript
/*
 * @param container window or HTMLElement
 * @callback the function you want to be executed after
 *           all the scroll-animations on the x-axis of the passed container have been stopped.
 */
 function stopScrollingX (container = uss._pageScroller, callback = () => {});
```
#### stopScrollingY
```javascript
/*
 * @param container window or HTMLElement
 * @callback the function you want to be executed after
 *           all the scroll-animations on the y-axis of the passed container have been stopped.
 */
 function stopScrollingY (container = uss._pageScroller, callback = () => {});
```
#### stopScrolling
```javascript
/*
 * @param container window or HTMLElement
 * @callback the function you want to be executed after
 *           all the scroll-animations on both the x-axis and the y-axis of the passed container have been stopped.
 */
 function stopScrolling (container = uss._pageScroller, callback = () => {});
```
#### hrefSetup
```javascript
/*
 * @param alignToLeft true if you want either every valid anchor link's destination element and their first scrollable parents (if available) to be aligned to the left of:
 *                      1) The scrollable parent for the anchor link's destination element
 *                      2) The window for the destination elements' scrollable parent
 *                    false if you want either every valid anchor link's destination element and their first scrollable parents (if available) to be aligned to the right of:
 *                      1) The scrollable parent for the anchor link's destination element
 *                      2) The window for the destination elements' scrollable parent
 *                    "nearest" if you want:
 *                      1) The destination element to be dynamically aligned to the closest between the left, the center or the right of its first scrollable parent
 *                      2) The scrollable parent to be dynamically aligned to the closest between the left, the center or the right of the window
 *                    anything else if you want either every valid anchor link's destination element and their first scrollable parents (if available) to be aligned to the center of:
 *                      1) The scrollable parent for the anchor link's destination element
 *                      2) The window for the destination elements' scrollable parent
 * @param alignToTop true if you want either every valid anchor link's destination element and their first scrollable parents (if available) to be aligned to the top of:
 *                      1) The scrollable parent for the anchor link's destination element
 *                      2) The window for the destination elements' scrollable parent
 *                    false if you want either every valid anchor link's destination element and their first scrollable parents (if available) to be aligned to the bottom of:
 *                      1) The scrollable parent for the anchor link's destination element
 *                      2) The window for the destination elements' scrollable parent
 *                    "nearest" if you want:
 *                      1) The destination element to be dynamically aligned to the closest between the top, the center or the bottom of its first scrollable parent
 *                      2) The scrollable parent to be dynamically aligned to the closest between the top, the center or the bottom of the window
 *                    anything else if you want either every valid anchor link's destination element and their first scrollable parents (if available) to be aligned to the center of:
 *                      1) The scrollable parent for the anchor link's destination element
 *                      2) The window for the destination elements' scrollable parent
 * @callback init the function you want to be executed before
 *           any scroll-animation of every of the valid anchor link found by this function is performed.
 *           It will be passed the following input parameters:
 *             1) The anchor link element which has been clicked
 *             2) The anchor link's destination element
 *           It can return false to prevent the scroll-animation completly.
 * @callback the function you want to be executed after
 *           any scroll-animation of every of the valid anchor link found by this function have been performed.
 * @param includeHidden true if the first scrollable parent of any valid anchor link's destination element found by this function
 *        may have the CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden, false otherwise.
 */
 function hrefSetup (alignToLeft = true, alignToTop = true, init = () => {}, callback = () => {}, includeHidden = false);
```

<br/>

#### <p align="right"><a href = "https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/docs/EasingFunctions.md"><code>Go to next section &#8680;</code></a></p>
