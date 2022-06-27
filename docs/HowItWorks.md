#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# How it works
Once you've imported one or more USS API's scripts, they will automatically do all the initialization work for you. <br/>
<br/>
## \#API script 
The `universalsmoothscroll-min.js` script will declare and initialize ***(in the global scope of your application)*** both the API's [`constants`](./ConstantsAbout.md) _(internally used by the API, but available as read-only values)_ and the `uss` object. <br/>

The `uss` object's properties are the API's functionalities and they can either be: <br/>
* [`variables`](./VariablesAbout.md)
* [`functions`](./FunctionsAbout.md) <br/>
  
The `uss`'s variables ***SHOULD NOT*** be directly manipulated: always use the provided accessors.<br/>
You will be able to recognize those internal variables because their names begin with an `_` _(underscore)_. <br/>

For instance:
```javascript
//This is the name of the internal variable used by the uss object.
uss._xStepLength

//These are the accessors for the uss._xStepLength variable.
uss.getXStepLength() //Getter
uss.setXStepLength() //Setter
```
<br/>

The main scrolling-functions are:
* [`scrollXTo`](./FunctionsAbout.md#scrollXToFun),  [`scrollYTo`](./FunctionsAbout.md#scrollYToFun) and [`scrollTo`](./FunctionsAbout.md#scrollToFun)
* [`scrollXBy`](./FunctionsAbout.md#scrollXByFun),  [`scrollYBy`](./FunctionsAbout.md#scrollYByFun) and [`scrollBy`](./FunctionsAbout.md#scrollByFun)
* [`scrollIntoView`](./FunctionsAbout.md#scrollIntoViewFun) and [`scrollIntoViewIfNeeded`](./FunctionsAbout.md#scrollIntoViewIfNeededFun) <br/>

Any scroll-animation can be stopped at any time by using:
* [`stopScrollingX`](./FunctionsAbout.md#stopScrollingXFun)
* [`stopScrollingY`](./FunctionsAbout.md#stopScrollingYFun)
* [`stopScrolling`](./FunctionsAbout.md#stopScrollingFun)

There's also a handy function for anchor's smooth scrolling management:
* [`hrefSetup`](./FunctionsAbout.md#hrefSetupFun)

<br/>

The documentation about the API's functions is available in the [`Available Functions`](./FunctionsAbout.md) section. 

---
<br/>

## \#Easing library 
The `universalsmoothscroll-ease-functions-min.js` script will declare and initialize ***(in the global scope of your application)*** functions that can be invoked to get custom [`stepLengthCalculators`](./FAQ.md#q-what-is-a-steplengthcalculator-) which can be used to control the easing of any USS API's scroll-animation. <br/>

For example:
```javascript
let animationDuration = 300 //duration in ms

//The EASE_IN_OUT_QUINT function of this library will return a stepLengthCalculator
//which can be used to control the easing of a container's scroll-animations
let myCustomEase = EASE_IN_OUT_QUINT(animationDuration)  

//myCustomEase will control the easing of 
//all the scroll-animations on the y-axis of myContainer
uss.setYStepLengthCalculator(myCustomEase, myContainer)

EASE_IN_OUT_QUINT = ... //this will give you an error because the library is read-only
```

All the functions of this library are read-only and cannot be modified. <br/>
To know which default easings are available visit the [`Included Easings`](./EasingFunctions.md) section. 

<br/>

#### <p align="right"><a href = "./FunctionsAbout.md"><code>Go to next section &#8680;</code></a></p>
