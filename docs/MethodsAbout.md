#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Available Methods (public use)
Name | Input Parameters | Description
:--: | :--------------: | -----------
`isXscrolling` | `container` | Returns true if a scroll-animation on the x-axis of the passed container is currently being performed by this API, false otherwise.
`isYscrolling` | `container` | Returns true if a scroll-animation on the y-axis of the passed container is currently being performed by this API, false otherwise.
`isScrolling` | `container` | Returns true if a scroll-animation on any axis of the passed container is currently being performed by this API, false otherwise.
`getFinalXPosition` | `container` | Returns the position _(in px)_ at which the container will be at the end of the scroll-animation on the x-axis. <br/> The current position is returned if no scroll-animation is in place.
`getFinalYPosition` | `container` | Returns the position _(in px)_ at which the container will be at the end of the scroll-animation on the y-axis. <br/> The current position is returned if no scroll-animation is in place.
`getXStepLengthCalculator` | `container` <br/> `getTemporary` | Returns the current [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) which controls the animations on the x-axis of the passed container if available.
`getYStepLengthCalculator` | `container` <br/> `getTemporary` | Returns the current [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) which controls the animations on the y-axis of the passed container if available.
`getXStepLength` | / | Returns the value of the `_xStepLength` property.
`getYStepLength` | / | Returns the value of the `_yStepLength` property.
`getMinAnimationFrame` | / | Returns the value of the `_minAnimationFrame` property.
`getWindowHeight` | / | Returns the value of the `_windowHeight` property.
`getWindowWidth` | / | Returns the value of the `_windowWidth` property.
`getScrollbarsMaxDimension` | / | Returns the value of the `_scrollbarsMaxDimension` property.
`getPageScroller` | / | Returns the value of the `_pageScroller` property.
`getReducedMotionState` | / | Returns the value of the `_reducedMotion` property.
`getDebugMode` | / | Returns the value of the `_debugMode` property.
`setXStepLengthCalculator` | `newCalculator` <br/> `container` <br/> `isTemporary` | Sets the [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) for _(the x-axis of)_ the passed container if compatible.
`setYStepLengthCalculator` | `newCalculator` <br/> `container` <br/> `isTemporary`  | Sets the [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) for _(the y-axis of)_ the passed container if compatible.
`setStepLengthCalculator` | `newCalculator` <br/> `container` <br/> `isTemporary` | Sets the [`StepLengthCalculators`](./FAQ.md#q-what-is-a-steplengthcalculator-) for _(both the y and x axes of)_ the passed container if compatible.
`setXStepLength` | `newXStepLength` | Sets the `_xStepLength` property to the passed value if compatible.
`setYStepLength` | `newYStepLength` | Sets the `_yStepLength` property to the passed value if compatible.
`setStepLength` | `newStepLength` | Sets both the `_xStepLength` and the `_yStepLength` properties to the passed value if compatible.
`setMinAnimationFrame` | `newMinAnimationFrame` | Sets the `_minAnimationFrame` property to the passed value if compatible.
`setPageScroller` | `newPageScroller` | Sets the `_pageScroller` property to the passed value if compatible.
`setDebugMode` | `newDebugMode` | Sets the `_debugMode` property to the passed value if compatible.
`calcXStepLength` | `deltaX` | Returns how long each animation-step on the x-axis must be in order to target the `_minAnimationFrame` property value. <br/> This function can be considered the default [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) for any scroll-animation on the x-axis of any container.
`calcYStepLength` | `deltaY` | Returns how long each animation-step on the y-axis must be in order to target the `_minAnimationFrame` property value. <br/> This function can be considered the default [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) for any scroll-animation on the y-axis of any container.
`calcScrollbarsDimensions` | `element` | Returns an array containing 2 numbers: <br/> <ol start="0"> <li> Contains the vertical scrollbar's width <i> (in px) </i> of the passed element. </li> <li> Contains the horizontal scrollbar's height <i> (in px) </i> of the passed element. </li> </ol>
`calcBordersDimensions` | `element` | Returns an array containing 4 numbers: <br/> <ol start="0"> <li> Contains the top border's height <i> (in px) </i> of the passed element. </li> <li> Contains the right border's width <i> (in px) </i> of the passed element. </li> <li> Contains the bottom border's height <i> (in px) </i> of the passed element. </li> <li> Contains the left border's width <i> (in px) </i> of the passed element. </li> </ol>
`getScrollXCalculator` | `container` | Returns a function that returns: <ul> <li> The scrollLeft property of the passed container if it's an instance of HTMLElement. </li> <li> The scrollX property of the passed container if it's the window element. </li> </ul>
`getScrollYCalculator` | `container` | Returns a function that returns: <ul> <li> The scrollTop property of the passed container if it's an instance of HTMLElement. </li> <li> The scrollY property of the passed container if it's the window element. </li> </ul>
`getMaxScrollX` | `container` | Returns the highest reacheable scrollLeft/scrollX value of the passed container.
`getMaxScrollY` | `container` | Returns the highest reacheable scrollTop/scrollY value of the passed container.
`getXScrollableParent` | `element` <br/> `includeHiddenParents`| Returns the first scrollable container _(on the x-axis)_ of the passed element or null if it doesn't have one. 
`getYScrollableParent` | `element` <br/>  `includeHiddenParents` | Returns the first scrollable container _(on the y-axis)_ of the passed element or null if it doesn't have one. 
`getScrollableParent` | `element` <br/>  `includeHiddenParents` | Returns the first scrollable container _(on either the x or y axis)_ of the passed element or null if it doesn't have one. 
`getAllScrollableParents` | `element` <br/>  `includeHiddenParents` <br/> `callback` | Returns an array containing all the scrollable containers _(on either the x or y axis)_ of the passed element.
`scrollXTo` | `finalXPosition` <br/> `container` <br/> `callback` | Scrolls the x-axis of the passed container to the specified position _(in px)_ if possible.
`scrollYTo` | `finalYPosition` <br/> `container` <br/> `callback` | Scrolls the y-axis of the passed container to the specified position _(in px)_ if possible.
`scrollXBy` | `deltaX` <br/> `container` <br/> `callback` <br/> `stillStart` | Scrolls the x-axis the passed container by the specified amount of in pixels if possible.
`scrollYBy` | `deltaY` <br/> `container` <br/> `callback` <br/> `stillStart` | Scrolls the y-axis the passed container by the specified amount of in pixels if possible.
`scrollTo` | `finalXPosition` <br/> `finalYPosition` <br/> `container` <br/> `callback` | Scrolls both the x and y axes of the passed container to the specified positions _(in px)_ if possible.
`scrollBy` | `deltaX` <br/> `deltaY` <br/> `container` <br/> `callback` <br/> `stillStart` | Scrolls both the x and y axes of the passed container by the specified amount of in pixels if possible.
`scrollIntoView` | `element` <br/> `alignToLeft` <br/> `alignToTop` <br/> `callback` <br/> `includeHiddenParents` | Scrolls all the scrollable parents of the passed element in order to make it visible on the screen with the specified alignments.
`scrollIntoViewIfNeeded` | `element` <br/> `alignToCenter` <br/> `callback` <br/> `includeHiddenParents` | Scrolls all the scrollable parents of the passed element in order to make it visible on the screen with the specified alignment only if it's not already visible.
`stopScrollingX` | `container` <br/> `callback` | Stops all the current scroll-animation on the x-axis of the passed container.
`stopScrollingY` | `container` <br/> `callback` | Stops all the current scroll-animation on the y-axis of the passed container.
`stopScrolling` | `container` <br/> `callback` | Stops all the current scroll-animation on both the x and y axes of the passed container.
`hrefSetup` | `alignToLeft` <br/> `alignToTop` <br/> `init` <br/> `callback` <br/> `includeHiddenParents` <br/> `updateHistory` | Automatically binds every valid anchor (`<a>` and `<area>` in the DOM) to the corresponding element that should be scrolled into view. <br/> Whenever a valid anchor is clicked the passed init function is invoked and if it doesn't return `false`, a scroll-animation will bring into view the linked element and the browser's history will be updated _(if requested)_.

---
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
#### getScrollbarsMaxDimensions
```javascript
/* No input parameters required */
 function getScrollbarsMaxDimensions ();
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
#### calcScrollbarsDimensions
```javascript
/*
 * @param element window or HTMLElement
 */
 function calcScrollbarsDimensions (element);
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
 * @param includeHiddenParents true if the element's first scrollable parent on the x-axis has
 *        the CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function getXScrollableParent (element, includeHiddenParents = false);
```
#### getYScrollableParent
```javascript
/*
 * @param element window or HTMLElement
 * @param includeHiddenParents true if the element's first scrollable parent on the y-axis has
 *        the CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function getYScrollableParent (element, includeHiddenParents = false);
```
#### getScrollableParent
```javascript
/*
 * @param element window or HTMLElement
 * @param includeHiddenParents true if the element's first scrollable parent has
 *        the CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function getScrollableParent (element, includeHiddenParents = false);
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
 * @param includeHiddenParents true if the element's first scrollable parent may have the
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function scrollIntoView (element, alignToLeft = true, alignToTop = true, callback = () => {}, includeHiddenParents = false);
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
 * @param includeHiddenParents true if the element's first scrollable parent may have the
 *        CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden,
 *        false otherwise.
 */
 function scrollIntoViewIfNeeded (element, alignToCenter = true, callback = () => {}, includeHiddenParents = false);
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
 * @param includeHiddenParents true if the first scrollable parent of any valid anchor link's destination element found by this function
 *        may have the CSS property overflow:hidden or overflow-x:hidden or overflow-y:hidden, false otherwise.
 */
 function hrefSetup (alignToLeft = true, alignToTop = true, init = () => {}, callback = () => {}, includeHiddenParents = false);
```

<br/>

#### <p align="right"><a href = "./EasingFunctions.md"><code>Go to next section &#8680;</code></a></p>
