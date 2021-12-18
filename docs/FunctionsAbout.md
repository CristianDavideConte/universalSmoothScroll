#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Available Functions
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

<table>
 <thead>
  <tr>
   <th>Name</th>
   <th>Input Parameters</th>
   <th>Input Parameters Type</th>
   <th>Input Parameters Description</th>
  </tr>
 </thead>
 <tbody>
  <tr id = "isXScrolling">
   <td rowspan = "1" align = "center">
    <code>isXScrolling</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
   
  </tr>
    <tr id = "isYScrolling">
   <td rowspan = "1" align = "center">
    <code>isYScrolling</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  
  <tr id = "isScrolling">
   <td rowspan = "1" align = "center">
    <code>isYScrolling</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  
  <tr id = "getFinalXPosition">
   <td rowspan = "1" align = "center">
    <code>getFinalXPosition</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  
  <tr id = "getFinalYPosition">
   <td rowspan = "1" align = "center">
    <code>getFinalYPosition</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  
  <tr id = "getXStepLengthCalculator">
   <td rowspan = "2" align = "center">
    <code>getXStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>getTemporary</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code> the returned StepLengthCalculator is the temporary one set for the x-axis of this container, otherwise it's the standard one.
   </td>
  </tr>
   
  <tr id = "getYStepLengthCalculator">
   <td rowspan = "2" align = "center">
    <code>getYStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>getTemporary</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code> the returned StepLengthCalculator is the temporary one set for the y-axis of this container, otherwise it's the standard one.
   </td>
  </tr>
  
  <tr id = "setXStepLengthCalculator">
   <td rowspan = "3" align = "center">
    <code>setXStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>newCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A valid StepLengthCalculator.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>  
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>isTemporary</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code>, <code>newCalculator</code> will control only the next scroll-animation on the x-axis of this container and it will be automatically discarded at the end of it. <br/>
    If <code>false</code> every scroll-animation on the x-axis of this container will be controlled by <code>newCalculator</code>. <br/>
    If a container has both a temporary and non-temporary StepLengthCalculator set for its x-axis, the temporary one will controll the next scroll-animation on the x-axis of the container. <br/>
    Setting a temporary StepLengthCalculator will only overwrite the previous temporary one. <br/>
    Setting a non-temporary StepLengthCalculator will overwrite the previous non-temporary one and discard any temporary one. <br/>
   </td>
  </tr>
  
  <tr id = "setYStepLengthCalculator">
   <td rowspan = "3" align = "center">
    <code>setYStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>newCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A valid StepLengthCalculator.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>  
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>isTemporary</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code>, <code>newCalculator</code> will control only the next scroll-animation on the y-axis of this container and it will be automatically discarded at the end of it. <br/>
    If <code>false</code> every scroll-animation on the y-axis of this container will be controlled by <code>newCalculator</code>. <br/>
    If a container has both a temporary and non-temporary StepLengthCalculator set for its y-axis, the temporary one will controll the next scroll-animation on the y-axis of the container. <br/>
    Setting a temporary StepLengthCalculator will only overwrite the previous temporary one. <br/>
    Setting a non-temporary StepLengthCalculator will overwrite the previous non-temporary one and discard any temporary one. <br/>
   </td>
  </tr> 
  
  <tr id = "setStepLengthCalculator">
   <td rowspan = "3" align = "center">
    <code>setStepLengthCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>newCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A valid StepLengthCalculator.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>  
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>isTemporary</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    If <code>true</code>, <code>newCalculator</code> will control only the next scroll-animation on the x-axis and the next one on the y-axis of this container. <br/>
    It will automatically be discarded separately for each axis whenever the next scroll-animation on an axis is completed. <br/>
    If <code>false</code> every scroll-animation on both the x and y axes of this container will be controlled by <code>newCalculator</code>. <br/>
    If a container has both a temporary and non-temporary StepLengthCalculator, the temporary one will controll the next scroll-animation of the container. <br/>
    Setting a temporary StepLengthCalculator will only overwrite the previous temporary one. <br/>
    Setting a non-temporary StepLengthCalculator will overwrite the previous non-temporary one and discard any temporary one. <br/>
   </td>
  </tr> 
  
  <tr id = "setXStepLength">
   <td rowspan = "1" align = "center">
    <code>setXStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>newXStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A number > 0.
   </td>
  </tr>
  
  <tr id = "setYStepLength">
   <td rowspan = "1" align = "center">
    <code>setYStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>newYStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A number > 0.
   </td>
  </tr>
    
  <tr id = "setStepLength">
   <td rowspan = "1" align = "center">
    <code>setStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>newStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A number > 0.
   </td>
  </tr>
  
  <tr id = "setMinAnimationFrame">
   <td rowspan = "1" align = "center">
    <code>setMinAnimationFrame</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>newMinAnimationFrame</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A number > 0.
   </td>
  </tr>
    
  <tr id = "setPageScroller">
   <td rowspan = "1" align = "center">
    <code>setPageScroller</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>newPageScroller</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A number > 0.
   </td>
  </tr>
    
  <tr id = "setDebugMode">
   <td rowspan = "1" align = "center">
    <code>setDebugMode</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>newDebugMode</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A number > 0.
   </td>
  </tr>
      
  <tr id = "calcXStepLength">
   <td rowspan = "1" align = "center">
    <code>calcXStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>deltaX</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A number > 0.
   </td>
  </tr>
      
  <tr id = "calcYStepLength">
   <td rowspan = "1" align = "center">
    <code>calcYStepLength</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>deltaY</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A number > 0.
   </td>
  </tr>
     
  </tr>
    <tr id = "calcScrollbarsDimensions">
   <td rowspan = "1" align = "center">
    <code>calcScrollbarsDimensions</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>element</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
       
  </tr>
    <tr id = "calcBordersDimensions">
   <td rowspan = "1" align = "center">
    <code>calcBordersDimensions</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>element</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
       
  </tr>
    <tr id = "getScrollXCalculator">
   <td rowspan = "1" align = "center">
    <code>getScrollXCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
         
  </tr>
    <tr id = "getScrollYCalculator">
   <td rowspan = "1" align = "center">
    <code>getScrollYCalculator</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
         
  </tr>
    <tr id = "getMaxScrollX">
   <td rowspan = "1" align = "center">
    <code>getMaxScrollX</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
           
  </tr>
    <tr id = "getMaxScrollY">
   <td rowspan = "1" align = "center">
    <code>getMaxScrollY</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  
  <tr id = "getXScrollableParent">
   <td rowspan = "2" align = "center">
    <code>getXScrollableParent</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>element</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    <code>True</code> if the first scrollable container <i>(on the x-axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-x:hidden</code>, <code>false</code> otherwise.
   </td>
  </tr>
    
  <tr id = "getYScrollableParent">
   <td rowspan = "2" align = "center">
    <code>getYScrollableParent</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>element</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    <code>True</code> if the first scrollable container <i>(on the y-axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-y:hidden</code>, <code>false</code> otherwise.
   </td>
  </tr>
      
  <tr id = "getScrollableParent">
   <td rowspan = "2" align = "center">
    <code>getScrollableParent</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>element</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    <code>True</code> if the first scrollable container <i>(on either the x or y axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-x:hidden</code> or <code>overflow-y:hidden</code>, <code>false</code> otherwise.
   </td>
  </tr>
        
  <tr id = "getAllScrollableParents">
   <td rowspan = "3" align = "center">
    <code>getAllScrollableParents</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>element</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>includeHiddenParents</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    <code>True</code> if the first scrollable container <i>(on either the x or y axis)</i> of <code>element</code> has the css properties <code>overflow:hidden</code> or <code>overflow-x:hidden</code> or <code>overflow-y:hidden</code>, <code>false</code> otherwise.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>callback</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A function which is invoked every time a scrollable parent of <code>element</code> if found. <br/>
    When <code>callback</code> is invoked, it is passed <i>(as an input parameter)</i> the found scrollable parent.
   </td>
  </tr>
          
  <tr id = "scrollXTo">
   <td rowspan = "3" align = "center">
    <code>scrollXTo</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>finalXPosition</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A finite number.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>callback</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
   </td>
  </tr>
  
            
  <tr id = "scrollYTo">
   <td rowspan = "3" align = "center">
    <code>scrollYTo</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>finalYPosition</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A finite number.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>callback</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
   </td>
  </tr>
              
  <tr id = "scrollXBy">
   <td rowspan = "4" align = "center">
    <code>scrollXBy</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>deltaX</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A finite number.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>callback</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>stillStart</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    <code>True</code> if any on-going scroll-animation on the x-axis of <code>container</code> must be stopped before starting this animation. <br/>
    <code>False</code> if any on-going scroll-animation on the x-axis of <code>container</code> should extended by <code>deltaX</code> if possible.
   </td>
  </tr>
              
  <tr id = "scrollYBy">
   <td rowspan = "4" align = "center">
    <code>scrollYBy</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>deltaY</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A finite number.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>callback</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>stillStart</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    <code>True</code> if any on-going scroll-animation on the y-axis of <code>container</code> must be stopped before starting this animation. <br/>
    <code>False</code> if any on-going scroll-animation on the y-axis of <code>container</code> should extended by <code>deltaY</code> if possible.
   </td>
  </tr>
                
  <tr id = "scrollTo">
   <td rowspan = "4" align = "center">
    <code>scrollTo</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>finalXPosition</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A finite number.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>finalYPosition</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A finite number.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>callback</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
   </td>
  </tr>
              
  <tr id = "scrollBy">
   <td rowspan = "5" align = "center">
    <code>scrollBy</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>deltaX</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A finite number.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>deltaY</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Number</code>
   </td>
   <td rowspan = "1" align = "left">
    A finite number.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>container</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Object</code>
   </td>
   <td rowspan = "1" align = "left">
    An HTMLElement or the window element.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>callback</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Function</code>
   </td>
   <td rowspan = "1" align = "left">
    A function which is invoked when this scroll-animation is completed.
   </td>
  </tr>
  <tr>
   <td rowspan = "1" align = "center">
    <code>stillStart</code>
   </td>
   <td rowspan = "1" align = "center">
    <code>Boolean</code>
   </td>
   <td rowspan = "1" align = "left">
    <code>True</code> if any on-going scroll-animation on the y-axis of <code>container</code> must be stopped before starting this animation. <br/>
    <code>False</code> if any on-going scroll-animation on the y-axis of <code>container</code> should extended by <code>deltaY</code> if possible.
   </td>
  </tr> 
  
  
 </tbody>
</table>




# Methods signatures

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
