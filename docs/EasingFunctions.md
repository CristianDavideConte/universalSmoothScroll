#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Included easings
Once imported, the [`universalsmoothscroll-ease-functions`](./Download.md) library will automatically declare and initialize _(in the global scope of your application)_ all the function listed below. <br/>
When invoked, each one of these functions will return a [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that you can use to customize the easing of the scroll-animations on any axis of any container. <br/>

In order to do that, just pass the returned [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) to either one of these methods: 
* `uss.setXStepLengthCalculator()` for the scroll-animations on the x-axis of your container.
* `uss.setYStepLengthCalculator()` for the scroll-animations on the y-axis of your container. 
* `uss.setStepLengthCalculator()` for the scroll-animations on both axes of your container. 

### N.B.
This library cannot be used without having imported the [`universalsmoothscroll-min.js`](./Download.md) script in your project first. 
<br/>
<br/>

Function Name   | Visualization | Input parameters
:-----------: | :-----------: | :-------------:
`CUSTOM_CUBIC_BEZIER` | <img src="./easingsGifs/0_CUSTOM_CUBIC_BEZIER/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/0_CUSTOM_CUBIC_BEZIER/Y.gif" width="40px" height="40px"/> | [`x1`](./EasingFunctions.md#the-x1-x2-x3-and-x4-parameters) , [`x2`](./EasingFunctions.md#the-x1-x2-x3-and-x4-parameters) , [`x3`](./EasingFunctions.md#the-x1-x2-x3-and-x4-parameters) , [`x4`](./EasingFunctions.md#the-x1-x2-x3-and-x4-parameters) <br/> [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_LINEAR` | <img src="./easingsGifs/1_EASE_LINEAR/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/1_EASE_LINEAR/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_SINE` | <img src="./easingsGifs/2_EASE_IN_SINE/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/2_EASE_IN_SINE/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_QUAD` | <img src="./easingsGifs/3_EASE_IN_QUAD/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/3_EASE_IN_QUAD/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_CUBIC` | <img src="./easingsGifs/4_EASE_IN_CUBIC/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/4_EASE_IN_CUBIC/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_QUART` | <img src="./easingsGifs/5_EASE_IN_QUART/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/5_EASE_IN_QUART/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_QUINT` | <img src="./easingsGifs/6_EASE_IN_QUINT/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/6_EASE_IN_QUINT/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_EXPO` | <img src="./easingsGifs/7_EASE_IN_EXPO/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/7_EASE_IN_EXPO/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_CIRC` | <img src="./easingsGifs/8_EASE_IN_CIRC/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/8_EASE_IN_CIRC/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_BOUNCE` | <img src="./easingsGifs/9_EASE_IN_BOUNCE/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/9_EASE_IN_BOUNCE/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_OUT_SINE` | <img src="./easingsGifs/10_EASE_OUT_SINE/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/10_EASE_OUT_SINE/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_OUT_QUAD` | <img src="./easingsGifs/11_EASE_OUT_QUAD/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/11_EASE_OUT_QUAD/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_OUT_CUBIC` | <img src="./easingsGifs/12_EASE_OUT_CUBIC/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/12_EASE_OUT_CUBIC/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_OUT_QUART` | <img src="./easingsGifs/13_EASE_OUT_QUART/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/13_EASE_OUT_QUART/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_OUT_QUINT` | <img src="./easingsGifs/14_EASE_OUT_QUINT/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/14_EASE_OUT_QUINT/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_OUT_EXPO` | <img src="./easingsGifs/15_EASE_OUT_EXPO/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/15_EASE_OUT_EXPO/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_OUT_CIRC` | <img src="./easingsGifs/16_EASE_OUT_CIRC/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/16_EASE_OUT_CIRC/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_OUT_BOUNCE` | <img src="./easingsGifs/17_EASE_OUT_BOUNCE/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/17_EASE_OUT_BOUNCE/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_OUT_SINE` | <img src="./easingsGifs/18_EASE_IN_OUT_SINE/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/18_EASE_IN_OUT_SINE/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_OUT_QUAD` | <img src="./easingsGifs/19_EASE_IN_OUT_QUAD/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/19_EASE_IN_OUT_QUAD/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_OUT_CUBIC` | <img src="./easingsGifs/20_EASE_IN_OUT_CUBIC/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/20_EASE_IN_OUT_CUBIC/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_OUT_QUART` | <img src="./easingsGifs/21_EASE_IN_OUT_QUART/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/21_EASE_IN_OUT_QUART/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_OUT_QUINT` | <img src="./easingsGifs/22_EASE_IN_OUT_QUINT/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/22_EASE_IN_OUT_QUINT/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_OUT_EXPO` | <img src="./easingsGifs/23_EASE_IN_OUT_EXPO/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/23_EASE_IN_OUT_EXPO/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_OUT_CIRC` | <img src="./easingsGifs/24_EASE_IN_OUT_CIRC/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/24_EASE_IN_OUT_CIRC/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_IN_OUT_BOUNCE` | <img src="./easingsGifs/25_EASE_IN_OUT_BOUNCE/X.gif" width="40px" height="40px"/> <img src="./easingsGifs/25_EASE_IN_OUT_BOUNCE/Y.gif" width="40px" height="40px"/> | [`duration`](./EasingFunctions.md#the-duration-parameter) <br/> [`callback`](./EasingFunctions.md#the-callback-parameter)
`EASE_ELASTIC_X` | <img src="./easingsGifs/26_EASE_ELASTIC/X.gif" width="40px" height="40px"/> | [`forward StepLengthCalculator`](./EasingFunctions.md#ease_elastic-parameters) <br/> [`backward StepLengthCalculator`](./EasingFunctions.md#ease_elastic-parameters) <br/> [`ElasticPointCalculator`](./EasingFunctions.md#ease_elastic-parameters) <br/> [`debounce time`](./EasingFunctions.md#ease_elastic-parameters)
`EASE_ELASTIC_Y` | <img src="./easingsGifs/26_EASE_ELASTIC/Y.gif" width="40px" height="40px"/> | [`forward StepLengthCalculator`](./EasingFunctions.md#ease_elastic-parameters) <br/> [`backward StepLengthCalculator`](./EasingFunctions.md#ease_elastic-parameters) <br/> [`ElasticPointCalculator`](./EasingFunctions.md#ease_elastic-parameters) <br/> [`debounce time`](./EasingFunctions.md#ease_elastic-parameters)

---
<br/>

## The `x1`, `x2`, `x3` and `x4` parameters
They're 4 finite numbers between 0 _(included)_ and 1 _(included)_. <br/>
They determine the type of easing the returned [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) will have. 

---

## The `duration` parameter
Is'a positive number which indicates the time _(in milliseconds)_ every scroll-animation controlled by this StepLengthCalculator will last.

---

## The `callback` parameter
Each one of the above mentioned functions will return a [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) when invoked. <br/>
These [`StepLengthCalculators`](./FAQ.md#q-what-is-a-steplengthcalculator-) are passed _some input parameters_. <br/> 
The `callback` is a function which gets executed at every scroll-animation step and that is always invoked with _those same input parameters_.

---

## EASE_ELASTIC parameters
  #### The `forward StepLengthCalculator` parameter 
  * It's a [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the easing of the ***forward part*** of the scroll-animation. 
  #### The `backward StepLengthCalculator` parameter
  * It's a [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) that controls the easing of the ***backward part*** of the scroll-animation.
  #### The `ElasticPointCalculator` parameter
  * It's a function which must return the number of pixels that will be scrolled by the backward part of the scroll-animation. <br/>
    If this function returns a negative number, the [`forward StepLengthCalculator`](./EasingFunctions.md#forward-steplengthcalculator) will be used instead of the [`backward StepLengthCalculator`](./EasingFunctions.md#backward-steplengthcalculator) for the backward part of the scroll-animation. <br/>
  
    An ElasticPointCalculator is always passed the following input parameters _(in this order)_: 
    * the `originalTimestamp` which indicates the exact time in milliseconds at which the _(forward part of)_ the scroll-animation has started 
    * the `currentTimestamp` which indicates the time in milliseconds at which this function is invoked 
    * the `currentPosition` of the container's scrollTop/Left (scrollTop/scrollY for EASE_ELASTIC_Y, scrollLeft/scrollX for EASE_ELASTIC_X)
    * the `direction` of the scroll-animation: 1 if the scrolling is from right-to-left/bottom-to-top, -1 otherwise
    * the `container` on which the scroll-animation is currently being performed (an HTMLElement that can be scrolled or the window object)
        
  #### The `debounce time` parameter     
  * It's the time _(in milliseconds)_ that has to elapse after the end of the _(forward part of)_ the scroll-animation in order to start the backward part.

For example:
```javascript
/**
 * Every scroll-animation on the x-axis of myContainer:
 *  - will scroll by x pixels with an EASE_OUT_QUAD easing for 1 second
 *  - will wait 500ms
 *  - will scroll by 50 pixels in the opposite direction with an EASE_OUT_BOUNCE easing for 700ms
 */
uss.setXStepLengthCalculator(
  EASE_ELASTIC_X(
    EASE_OUT_QUAD(1000),
    EASE_OUT_BOUNCE(700),
    (originalTimestamp, currentTimestamp, currentPosition, direction, container) => {return 50;},
    500
  ), 
  myContainer
);
```

<br/>

#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/docs/FAQ.md"><code>Go to next section &#8680;</code></a>
