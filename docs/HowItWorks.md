#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# How it works
Once you've imported a USS API's script, it will automatically do all the needed work for you. <br/>
<br/>
## \#API script 
The `universalsmoothscroll-min.js` script will declare and initialize ***(in the global scope of your application)*** either the API's [`constants`](./ConstantsAbout.md) _(internally used by the API, but available as read-only values)_ and the `uss` object. <br/>

The `uss` object's properties are the API's functionalities and they can either be: <br/>
* [`variables`](./VariablesAbout.md)
* [`functions`](./MethodsAbout.md) <br/>
  
The `uss`'s variables ***SHOULD NOT*** be directly manipulated: always use the provided accessors.<br/>
You will be able to recognize those internal variables because their names begin with an `_` _(underscore)_. <br/>

For istance:
```javascript
//This is the name of the internal variable used by the uss object.
uss._xStepLength

//These are the accessors for the uss._xStepLength variable.
uss.getXStepLength() //Getter
uss.setXStepLength() //Setter
```
<br/>

The main scrolling-functions are:
* [`uss.scrollXTo()`](./FunctionsAbout.md#scrollXToFun),  [`uss.scrollYTo()`](./FunctionsAbout.md#scrollYToFun) and [`uss.scrollTo()`](./FunctionsAbout.md#scrollToFun)
* [`uss.scrollXBy()`](./FunctionsAbout.md#scrollXByFun),  [`uss.scrollYBy()`](./FunctionsAbout.md#scrollYByFun) and [`uss.scrollBy()`](./FunctionsAbout.md#scrollByFun)
* [`uss.scrollIntoView()`](./FunctionsAbout.md#scrollIntoViewFun) and [`uss.scrollIntoViewIfNeeded()`](./FunctionsAbout.md#scrollIntoViewIfNeededFun) <br/>

Any scroll-animation can be stopped at any time by using:
* [`uss.stopScrollingX()`](./FunctionsAbout.md#stopScrollingXFun)
* [`uss.stopScrollingY()`](./FunctionsAbout.md#stopScrollingYFun)
* [`uss.stopScrolling()`](./FunctionsAbout.md#stopScrollingFun)

There's also a handy function for anchor's smooth scrolling management:
* [`uss.hrefSetup()`](./FunctionsAbout.md#hrefSetupFun)

---
<br/>

## \#Easing library 
The `universalsmoothscroll-ease-functions-min.js` script will declare and initialize ***(in the global scope of your application)*** functions that can be invoked to get custom [`stepLengthCalculators`](./FAQ.md#q-what-is-a-steplengthcalculator-) which can be used to control the easing of any USS API's scroll-animation. <br/>

All the functions of this library are read-only and cannot be modified. <br/>

To know which default easings are available visit the [`Available easing functions`](./EasingFunctions.md) section. 

<br/>

#### <p align="right"><a href = "./ConstantsAbout.md"><code>Go to next section &#8680;</code></a></p>
