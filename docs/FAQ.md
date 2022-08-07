#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

<h1 align = "center">F.A.Q.</h1>

This section contains a collection of the most asked questions about the UniversalSmoothScroll API. <br/>
If the answer you are looking for is not here, you can always [`contact me`](https://github.com/CristianDavideConte/universalSmoothScroll#contact-me).
<br/><br/>


## Q: Can I use the API in a `React` project ?
A: Yes, as described in the [`Installation`](./Installation.md) section, just import the scripts in your `index.html` file and then you can start using the API. <br/>

---
<br/>

## Q: Can I use the API in a `typescript` project ?
A: Yes, as described in the [`Installation`](./Installation.md) section, just import the scripts in your `index.html` file and then you can start using the API. <br/>
If you encounter the `Cannot find name 'uss'` error (or something like that) you have to manually declare the `uss` object by adding the `declare var uss: any` line in you typescript declaration file (the one that ends with `.d.ts`).

---
<br/>

## Q: Can I use the API scrolling methods on containers that have the _`scroll-behavior: smooth`_ CSS property ?
A: No, they won't work on those containers.

---
<br/>

## Q: Can I use the API scrolling methods on containers that have the _`scroll-snap-type`_ CSS property ?
A: No, they won't work on those containers.

---
<br/>

## Q: How do I invoke the API methods ?  
A: Every Universal Smooth Scroll API function call has this structure: `uss.nameOfTheMethod(param1, param2 ...)`.

---
<br/>

## Q: Can I pass a `React.Component` as either the `container` or the `element` value ? 
A: No, you have to pass either an `HTMLElement`, an `SVGElement` or the `window`. <br/>
This problem can be easily solved by looking for the elements in the DOM with `getElementById`, `getElementsByClassName`, etc... or by using either React's [`Refs`](https://en.reactjs.org/docs/refs-and-the-dom.html) or the [`React.findDOMNode`](https://en.reactjs.org/docs/react-dom.html#finddomnode) method to obtain the `Element` from your `ReactElements`. <br/>

For istance:
```javascript
/*
 * In this example I want to create a scrollable React Component which
 * has a button that smoothly scrolls the Component when clicked.
 * To get the corresponding Element I'll use React's ref and the document.getElementById method. 
 */
class myApp extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef(); //Create the referece to the DOM node
  }
  ... 
  render() {
    return(
      <div id="myID" ref={this.myRef}> { /* I'm using the ref on the container I want to scroll */ }
        <button onClick={
          {/* Option A: retrieve the Element with the help of the ref */}
          () => uss.scrollYBy(500, {this.myRef.current}); 
          
          {/* Option B: retrieve the Element with js */}
          () => uss.scrollYBy(500, document.getElementById("myID"));
        }>
        </button>
        ...
      </div>
    );
  }
}
```

---
<br/>

## Q: Can I apply an easing to the scroll-animations ?
A: Yes, you can create a custom [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) and apply it with:
* [`setXStepLengthCalculator`](./FunctionsAbout.md#setXStepLengthCalculatorFun) for the scroll-animations on the x-axis of your container.
* [`setYStepLengthCalculator`](./FunctionsAbout.md#setYStepLengthCalculatorFun) for the scroll-animations on the y-axis of your container. 
* [`setStepLengthCalculator`](./FunctionsAbout.md#setStepLengthCalculatorFun) for the scroll-animations on both axes of your container. 

For example:<br/>
```javascript
uss.setYStepLengthCalculator(
    //This function is a custom stepLengthCalculator
    (remaning, originalTimestamp, timestamp, total, currentY, finalY, container) => { 
        return remaning / 15 + 1;
    }
);
```
<br/>You can also use the ease-functions available in the [`universalsmoothscroll-ease-functions`](./EaseFunctions.md) library.<br/>

For istance:<br/>
```javascript
uss.setStepLengthCalculator(EASE_IN_OUT_CUBIC(), myContainer);
```

---
<br/>

## Q: Can I make my scroll-animation last a certain amount of time?
A: Yes. <br/>
If you try to write a custom [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) you will notice it will be passed both the original timestamp _(relative to the beginning of the scroll-animation)_ and the current timestamp as respectively the second and third arguments.<br/>
You can use them to make the scroll-animations last any amount of time you want.<br/>
_(quick tip: the elapsed time is just `currentTimestap - originalTimestamp`)_.<br/>

You can also use the ease-functions available in the [`universalsmoothscroll-ease-functions`](./EaseFunctions.md) library with a specific duration.<br/>

For example:<br/>
```javascript
/**
 * In this case I use the EASE_LINEAR function so that
 * every scroll-animation on our container will always last 2 seconds
 * on any screen resolution and refresh rate.
 */
uss.setStepLengthCalculator(EASE_LINEAR(2000), myContainer); 
```

---
<br/>

## Q: What is a _stepLengthCalculator_ ?
A: It's a function that must return a finite number.<br/>

This function will be automatically invoked by the `uss` object every time it has to decide how many pixels should be scrolled on either the x or y axis of a container.<br/>

A stepLengthCalculator is always passed the following input parameters _(in this order)_:
* the `remaningScrollAmount` of current the scroll-animation in px _(always positive)_
* the `originalTimestamp` which indicates the exact time in milliseconds at which the scroll-animation has started
* the `currentTimestamp` which indicates the time in milliseconds at which the stepLengthCalculator is invoked
* the `totalScrollAmount` of the current scroll-animation in px _(always positive)_
* the `currentPosition` of the container's scrollTop/Left (scrollTop/scrollY if the scroll-animation is on the y-axis, scrollLeft/scrollX otherwise)
* the `finalPosition` that the container's scrollTop/Left has to reach (scrollTop/scrollY if the scroll-animation is on the y-axis, scrollLeft/scrollX otherwise)
* the `container` on which the scroll-animation is currently being performed (an Element that can be scrolled or the Window) <br/>

Imagine that a scroll-animation is like a stair: you know when/from where you started walking up/down the stair, how much time has passed since, how long the the stair is and where you are right now.<br/>
This stair could have many steps and you can decide that you want to rest and don't make any step _(return 0)_, go up _(return a number > 0)_ or go down _(return a number < 0)_ by telling the API through the return value of a stepLengthCalculator.<br/>   

This function can be invoked by the API thousands of times during a single scroll-animation and that's why it gets passed all the parameters described above.<br/>

A simple stepLengthCalculator may be:<br/>
```javascript
/*
 * This particular scroll calculator will make the scroll-animation:
 *  1. start slowly           (total = remaning at the beginnig of the scroll-animation)
 *  2. ramp up the speed      (remaning will decrease more and more)
 *  3. arriving at full speed (remaning = 0 at the end of the scroll-animation)   
 */
const myStepLengthCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
    const traveledDistance = total - remaning;
    return traveledDistance + 1; //+1 because at first traveledDistance = 0 and we would never start moving without it
};

//myStepLengthCalculator:
//- will controll only the easing on the y axis of myContainer (first 2 parameters)
//- it won't be discarded after just one animation (3rd parameter)
uss.setYStepLengthCalculator(myStepLengthCalculator, myContainer, false); 
```
<br/>

You don't have to write your own stepLengthCalculator if you don't want to. <br/>
The API will still function even if you don't specify any _(the scroll behavior/easing will be linear)_.<br/>
You can also use the ease-functions available in the [`universalsmoothscroll-ease-functions`](./EaseFunctions.md) library to get a stepLengthCalculator. <br/>

For example:<br/>
```javascript
/*
 * This stepLengthCalculator will make our scroll-animations on the x axis of myContainer 
 * always last 1 second and it will make sure that 
 * they will start as fast as possible and finish as slow as they can.
 */
uss.setXStepLengthCalculator(EASE_OUT_CUBIC(1000), myContainer);
```
<br/>

On [`easings.net`](https://easings.net/) you can find out more about the way the stepLengthCalculators provided by [`universalsmoothscroll-ease-functions`](./Download.md) library will affect your scroll-animations.
<br/><br/>

If you're not sure if your stepLengthCalculator is valid just use the [`isValidStepLengthCalculator`](./DevHelpers.md#isValidStepLengthCalculator) function of the [`Dev-Helpers`](./DevHelpers.md) library. <br/>

E.g.:<br/>
```javascript
/*
 * This stepLengthCalculator won't return a valid stepLength after
 * the value of i is greater than 10.
 * Unfortunately we didn't catch this bug at first. 
 */
const myBrokenCalculator = (i = 0) => {
  if(i++ <= 10) return 50; 
}

/*
 * Suppose we've already imported the Dev-Helpers library.
 * The isValidStepLengthCalculator non-blocking function will create
 * a dummy scroll-animation for the passed container (no actual scroll takes place)
 * to test our stepLengthCalculator.
 */
const isValid = await isValidStepLengthCalculator(myBrokenCalculator, myContainer);
if(!isValid) {
  //Fix the stepLengthCalculator...
}
```
<br/>

---
<br/>

## Q: What is the difference between _`stillStart = true`_ and _`stillStart = false`_ ?
A: They produce 2 completly different kind of scroll-animations' behaviors. <br/>

_`stillStart = true`_ means that before the scroll-animation you requested can be played any other scroll-animation on the same axis of the passed container is stopped so this type of scroll-animations always start from a no-movement _(still start)_ situation in order to be performed.<br/>  
_`stillStart = false`_ means that even if other scroll-animations on the same axis of the passed container are currently being performed they won't be stopped, but they'll just be extended/reduced by the passed delta.<br/>

This is an example of how different these 2 kind of scroll-animations are:<br/>
```javascript
//Suppose we want to scroll the body and we start from (0,0).
uss.setPageScroller(document.body);

//Returns the real-time scrollTop position of the body when invoked.
const getCurrentYPosition = uss.getScrollYCalculator(); 

//We initially tell the API to scroll the body to (0,100).
uss.scrollYTo(100);

//N.B.
//Since no repaint has been done we're still at (0,0). 

//Option A: stillStart = true.
//We expect the final scrollTop position of the body to be 200px.
//This is because we've stopped the previous scroll-animation with 
//stillStart = true, preventing it from scrolling to 100px.
uss.scrollYBy(200, uss.getPageScroller(), () => console.log(getCurrentYPosition()), true);

//Option B: stillStart = false.
//We expect the final scrollTop position of the body to be 300px.
//This is because we've extended the previous scroll-animation with 
//stillStart = false and we've added another 200px to the totalScrollAmount.
uss.scrollYBy(200, uss.getPageScroller(), () => console.log(getCurrentYPosition()), false);
```
 
These are some edge cases you may encounter:
```javascript
//Suppose we want to scroll the body and we start from (0,0).
uss.setPageScroller(document.body);

//We initially tell the API to scroll the body to (0,100).
uss.scrollYTo(100);

//Example A:
//we "invert" the scroll animation's direction going (100 - 150 = -50).
uss.scrollYBy(-150, uss.getPageScroller(), () => console.log("direction inverted"), false);

//Example B:
//we reduce the totalScrollAmount of the scroll-animation to 0 (100 - 100 = 0).
//The callback is executed immediately.
uss.scrollYBy(-100, uss.getPageScroller(), () => console.log("immediately executed"), false);
```

---
<br/>

## Q: What is the _hrefSetup's_ `init` parameter ?
A: Unlike any other callback parameter of the USS API, this is a function that gets automatically executed by the `uss` object whenever an anchor is clicked but right before any scroll-animation is performed. <br/>

This `init` function is always passed the following input parameters _(in this order)_:
* the anchor that has been clicked
* the element that has to be reached (the Element that has the same id of the anchors's `href` parameter) <br/>

If the `init` function returns `false` the scroll-animation is prevented. 


For example: <br/>
```javascript
/**
 * In this example, every time an anchor link is clicked 
 * the document.body's background color is randomly changed.
 */
function changeBackgroundColor(number) {
  //I want to prevent the anchor from scrolling to its linked element
  //if the passed number is higher than 1.
  if(number > 1) return false;

  document.body.style.backgroundColor = "rgb(" + Math.random() * 255 + "," + 
                                                 Math.random() * 255 + "," + 
                                                 Math.random() * 255 + ")"; 
  //No return is needed if you don't want to prevent the scrolling.
}
uss.hrefSetup(true, true, () => changeBackgroundColor(Math.random() * 2));
```

---
<br/>

## Q: Can I obtain the ***momentum-scrolling*** effect with this API ?
A: Yes, it can be achieved by setting a custom ease-out [`stepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) for the container you want to be _"momentum-scrolled"_. <br/>

For istance: <br/>
```javascript
/**
 * In this example I want to apply the momentum-scrolling effect on mousewheel only.
 * myEaseFunction is an ease-out stepLengthCalculator
 * because the returned values will be bigger at the beginning and 
 * smaller at the end of the scroll-animation.
 */
function myEaseFunction(remaning) {
  return 1 + remaning / 20; //Increase the divisor for an even smoother effect
}
uss.setYStepLengthCalculator(myEaseFunction, myContainer); 

myContainer.addEventListener("wheel", event => {
  event.preventDefault(); //Prevent the classic scroll
  uss.scrollYBy(event.deltaY, myContainer, myCallback, false); //StillStart = false, will make the scroll-animation follow the mousewheel speed
}, {passive:false});
```

You can also use the ease-functions available in the [`universalsmoothscroll-ease-functions`](./EaseFunctions.md) library. <br/>

For istance: <br/>
```javascript
uss.setYStepLengthCalculator(EASE_OUT_QUAD(), myContainer);

myContainer.addEventListener("wheel", event => {
  event.preventDefault(); //Prevent the classic scroll
  uss.scrollYBy(event.deltaY, myContainer, myCallback, false); //StillStart = false, will make the scroll-animation follow the mousewheel speed
}, {passive:false});
```

---
<br/>

## Q: What is the difference between a _`scroll-animation's step`_ and a _`scroll-animation's frame`_ ?
A: There's no difference, they are two ways of referring to the same thing. 

---
<br/>

## Q: Why there's no setter for the _`_reducedMotion`_ variable ?
A: Because it's up to the final users to decide which accessibility settings they want to enable. <br/>
Ignoring user preferences is not suggested.   

---
<br/>

## Q: Why is it allowed to directly modify internal variables ?
A: It is allowed _(but highly discouraged)_ because there may be a bug that prevents you from setting a variable to a right value _(very uncommon)_ or maybe you want to implement a custom behavior not yet covered by the API. <br/>
If one of above is your case don't hesitate to [`contact me`](https://github.com/CristianDavideConte/universalSmoothScroll#contact-me).

---
<br/>


<h3 align = "center">More coming soon...</h3><br/><br/>
