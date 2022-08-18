#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# How it works
Click the links below to understand how each imported script works: 
* [`universalsmoothscroll-min.js`](./HowItWorks.md#api-script) _(see below)_
* [`universalsmoothscroll-ease-functions-min.js`](./EaseFunctions.md)
* [`universalsmoothscroll-dev-helpers-min.js`](./DevHelpers.md)


## API Script 
The `universalsmoothscroll-min.js` script will declare and initialize the `uss` object ***as a public property of [`Window`](https://developer.mozilla.org/en-US/docs/Web/API/Window)***. <br/>
The `uss` object's properties are the API's functionalities and they can either be: <br/>
* [`variables`](./VariablesAbout.md) _(used internally)_
* [`functions`](./FunctionsAbout.md) _(publicly available)_ <br/>
  
The `uss`'s [`variables`](./VariablesAbout.md) ***SHOULD NOT*** be directly manipulated: always use the provided accessors.<br/>
You will be able to recognize those internal [`variables`](./VariablesAbout.md) because their names begin with an `_` _(underscore)_. <br/>

For instance:
```javascript
//This is the name of the internal variable used by the uss object.
uss._xStepLength

//These are the accessors for the uss._xStepLength variable.
uss.getXStepLength() //Getter
uss.setXStepLength() //Setter
```

The main scrolling [`functions`](./FunctionsAbout.md) are:
* [`scrollXTo`](./FunctionsAbout.md#scrollXToFun),  [`scrollYTo`](./FunctionsAbout.md#scrollYToFun) and [`scrollTo`](./FunctionsAbout.md#scrollToFun)
* [`scrollXBy`](./FunctionsAbout.md#scrollXByFun),  [`scrollYBy`](./FunctionsAbout.md#scrollYByFun) and [`scrollBy`](./FunctionsAbout.md#scrollByFun)
* [`scrollIntoView`](./FunctionsAbout.md#scrollIntoViewFun) and [`scrollIntoViewIfNeeded`](./FunctionsAbout.md#scrollIntoViewIfNeededFun) <br/>

Any scroll-animation can be stopped at any time by using:
* [`stopScrollingX`](./FunctionsAbout.md#stopScrollingXFun)
* [`stopScrollingY`](./FunctionsAbout.md#stopScrollingYFun)
* [`stopScrolling`](./FunctionsAbout.md#stopScrollingFun)

There's also a handy function for anchor's smooth scrolling management:
* [`hrefSetup`](./FunctionsAbout.md#hrefSetupFun)

---

The documentation about the API's functions is available in the [`Available Functions`](./FunctionsAbout.md) section. 

<br/>

#### <p align="right"><a href = "./FunctionsAbout.md"><code>Go to next section &#8680;</code></a></p>
