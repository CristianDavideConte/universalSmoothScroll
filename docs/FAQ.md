#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

<h1 align = "center">F.A.Q.</h1>

This section contains a collection of the most asked questions about any aspect of the USS API. <br/>
If the answer you are looking for is not here, you can always [`contact me`](https://github.com/CristianDavideConte/universalSmoothScroll#contact-me).
<br/><br/>

## Q: Can I use the API scrolling methods on containers that have the _`scroll-behavior: smooth`_ CSS property ?
A: No, they won't work on those containers.

---
<br/>

## Q: Can I use the API scrolling methods on containers that have the _`scroll-snap-type`_ CSS property ?
A: No, they won't work on those containers.

---
<br/>

## Q: Can I use the API in a `React` project ?
A: Yes, as described in the [`Installation`](./Installation.md) section, just import the scripts in your `index.html` file and then you can start using the API. <br/>

---
<br/>

## Q: How do I invoke the API methods ?  
A: Every Universal Smooth Scroll API function call has this structure: `uss.NAME_OF_THE_METHOD(ARGUMENTS)`.

---
<br/>

## Q: Can I pass a `React.Component` as either the `container` or the `element` value ? 
A: No, you have to pass either an `HTMLElement` or the `window` element. <br/>
This problem can be easily solved by looking for the elements in the DOM with `getElementById`, `getElementsByClassName`, etc... or by using either React's [`Refs`](https://en.reactjs.org/docs/refs-and-the-dom.html) or the [`React.findDOMNode`](https://en.reactjs.org/docs/react-dom.html#finddomnode) method to obtain the `HTMLElement` from your `ReactElements`. <br/>

For istance:
```javascript
/*
 * In this example I want to create a scrollable React Component which
 * has a button that smoothly scrolls the Component when clicked.
 * To get the corresponding HTMLElement I'll use React's ref and the document.getElementById method. 
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
          {/* Option A: retrieve the HTMLElement with the help of the ref */}
          () => uss.scrollYBy(500, {this.myRef.current}); 
          
          {/* Option B: retrieve the HTMLElement with js */}
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
A: Yes, you can create a custom [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) and apply it with:
* `uss.setXStepLengthCalculator()` for the x-axis
* `uss.setYStepLengthCalculator()` for the y-axis. 
* `uss.setStepLengthCalculator()` for both axes. 

For example:<br/>
```javascript
uss.setYStepLengthCalculator(
    (remaning, originalTimestamp, timestamp, total, currentY, finalY, container) => { //A custom StepLengthCalculator
        return remaning / 15 + 1;
    }
);
```
<br/>You can also use the [`default ease-functions`](./EasingFunctions.md) available in the [`universalsmoothscroll-ease-functions`](./Download.md) library.<br/>

For istance:<br/>
```javascript
uss.setStepLengthCalculator(EASE_IN_OUT_CUBIC(), myContainer);
```

---
<br/>

## Q: Can I make my scroll-animation last a certain amount of time?
A: Yes. <br/>
If you try to write a custom [`StepLengthCalculator`](./FAQ.md#q-what-is-a-steplengthcalculator-) you will notice it will be passed both the original timestamp _(relative to the beginning of the scroll-animation)_ and the current timestamp as respectively the second and third arguments.<br/>
You can use them to make the scroll-animations last any amount of time you want.<br/>
_(quick tip: the elapsed time is just `currentTimestap - originalTimestamp`)_.<br/>

You can also use the [`default ease-functions`](./EasingFunctions.md) available in the [`universalsmoothscroll-ease-functions`](./Download.md) library with a specific duration. <br/>

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

## Q: What is a _StepLengthCalculator_ ?
A: It's function that must return a finite number.<br/>

This function will be automatically invoked by the `uss` object every time it has to decide how many pixels should be scrolled on either the x or y axis of a container.<br/>

A StepLengthCalculator is always passed the following input parameters _(in this order)_:
* the `remaningScrollAmount` of current the scroll-animation
* the `originalTimestamp` which indicates the exact time in milliseconds at which the scroll-animation has started
* the `currentTimestamp` which indicates the time in milliseconds at which the StepLengthCalculator is invoked
* the `totalScrollAmount` of the current scroll-animation
* the `currentPosition` of the container's scrollTop/Left (scrollTop/scrollY if the scroll-animation is on the y-axis, scrollLeft/X otherwise)
* the `finalPosition` that the container's scrollTop/Left has to reach (scrollTop/scrollY if the scroll-animation is on the y-axis, scrollLeft/X otherwise)
* the `container` on which the scroll-animation is currently being performed (an HTMLElement that can be scrolled or the window object) <br/>

Imagine that a scroll-animation is like a stair: you know when/from where you started walking up/down the stair, how much time has passed since, how long the the stair is and where you are right now.<br/>
This stair could have many steps and you can decide if you want to rest and don't make any step _(return 0)_, go up _(return a number > 0)_, go down _(return a number < 0)_ by telling the API through the return value of a StepLengthCalculator.<br/>   

This function can be invoked by the API thousands of times during a single scroll-animation and that's why it gets passed all the parameters described above.<br/>

A simple StepLengthCalculator may be:<br/>
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
uss.setYStepLengthCalculator(myStepLengthCalculator, myContainer);
```
<br/>

You don't have to write your own StepLengthCalculator if you don't want to. <br/>
The API will still function even if you don't specify any _(the behavior/easing will be linear)_.<br/>
You can also use the [`default ease-functions`](./EasingFunctions.md) available in the [`universalsmoothscroll-ease-functions`](./Download.md) library to get a StepLengthCalculator.<br/>

For example:<br/>
```javascript
/*
 * This StepLengthCalculator will make our scroll-animations always last 1 second and 
 * it will make sure that they will start as fast as possible and finish as slow as they can.
 */
uss.setXStepLengthCalculator(EASE_OUT_CUBIC(1000), myContainer);
```
<br/>

On [`easings.net`](https://easings.net/) you can find out more about the way the StepLengthCalculators provided by [`universalsmoothscroll-ease-functions`](./Download.md) library will affect your scroll-animations.

---
<br/>

## Q: What is the difference between _`stillStart = true`_ and _`stillStart = false`_ ?
A: They produce 2 completly different kind of scroll-animations' behaviors.<br/>
_`stillStart = true`_ means that before the scroll-animation you requested can be played any other scroll-animation on the same axis of the passed container is cancelled so this type of scroll-animations always start from a no-movement situation in order to be performed.<br/>  
_`stillStart = false`_ means that even if other scroll-animations on the same axis of the passed container are currently being performed they won't be cancelled by default, they will just be extended/reduced by the passed delta.<br/>

This is an example of how different these 2 kind of scroll-animations are:<br/>
```javascript
const ourEaseFunction = (remaning) => {return remaning / 15 + 1;};
uss.setYStepLengthCalculator(ourEaseFunction, myContainer);

//CASE A: stillStart = true
const stillStartTrueBehavior = wheelEvent => {
    wheelEvent.preventDefault();
    wheelEvent.stopPropagation();
    uss.scrollYBy(wheelEvent.deltaY, myContainer, null, true);
}

//CASE B: stillStart = false
const stillStartFalseBehavior = wheelEvent => {
    wheelEvent.preventDefault();
    wheelEvent.stopPropagation();
    uss.scrollYBy(wheelEvent.deltaY, myContainer, null, false);
}

//Uncomment one line at a time and notice the difference
//myContainer.addEventListener("wheel", stillStartTrueBehavior,  {passive:false});
//myContainer.addEventListener("wheel", stillStartFalseBehavior, {passive:false});
```

---
<br/>

## Q: What is the _hrefSetup's_ `init` parameter ?
A: Unlike any other callback parameter of the USS API, this is a function that gets automatically executed by the `uss` object whenever an anchor is clicked but right before any scroll-animation is performed. <br/>

An `init` function is always passed the following input parameters _(in this order)_:
* the anchor that has been clicked
* the element that has to be reached (the HTMLElement that has the same id of the anchors's `href` parameter) <br/>

If the `init` function returns `false` the scroll-animation is prevented. 


For example: <br/>
```javascript
/**
 * In this example, every time an anchor link is clicked 
 * the document.body's background color is randomly changed.
 */
function changeBg() {
  document.body.style.backgroundColor = "rgb(" + Math.random() * 255 + "," + 
                                                 Math.random() * 255 + "," + 
                                                 Math.random() * 255 + ")"; 
  //I don't want to prevent the scroll, 
  //so there's no need to return anything in this case
}
uss.hrefSetup(true, true, changeBg);
```

---
<br/>

## Q: Can I obtain the ***momentum-scrolling*** effect with this API ?
A: Yes, it can be achieved by setting a custom ease-out StepLengthCalculator for the container you want to be _"momentum-scrolled"_. <br/>

For istance: <br/>
```javascript
/**
 * In this example I want to apply the momentum-scroll effect on mousewheel only.
 * myEaseFunction is an ease-out StepLengthCalculator
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

---
<br/>

## Q: What are _`_scrollX()`_ and _`_scrollY()`_ ?
A: They are functions that can only be internally accessed by the API, you won't be able to invoke them. <br/>
They execute all the instructions needed for a single scroll-animation-step on, respectively, the x and y axis.

---
<br/>

## Q: Why there's no setter for the _`_reducedMotion`_ variable ?
A: Because it's up to the final users to decide which accessibility settings they want to enable. <br/>
Ignoring user preferences is not suggested.   

---
<br/>

## Q: Why is it allowed to directly modify internal variables ?
A: It is allowed _(but highly discouraged)_ because there may be a bug that prevents you from setting a variable to a right value _(very uncommon)_. <br/>
If that's the case don't hesitate to [`contact me`](https://github.com/CristianDavideConte/universalSmoothScroll#contact-me).

---
<br/>

<h3 align = "center">More coming soon...</h3><br/><br/>
