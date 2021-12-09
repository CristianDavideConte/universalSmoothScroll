# F.A.Q.
## Q: Can I use the API scrolling methods on containers that have the _`scroll-behavior: smooth`_ CSS property ?
A: NO! They won't work on those containers.
## Q: Can I use the API scrolling methods on containers that have the _`scroll-snap-type`_ CSS property ?
A: NO! They won't work on those containers.
## Q: Can I use the API in a `React` project ?
A: YES! Just import the scripts in your `index.html` header and then you can start using the API.  
## Q: How do I invoke the API methods ?  
A: Every Universal Smooth Scroll API function call has this structure: `uss.NAME_OF_THE_METHOD(ARGUMENTS)`.
## Q: Can I pass a `React.Component` as either the `container` or the `element` value ? 
A: NO! You have to pass the API methods either an `HTMLElement` or the `window` element. <br/>
This problem can be easily solved _the Javascript way_ (by looking for the elements in the DOM with `getElementById`, `getElementsByClassName`, etc...) or by using either React's [`Refs`](https://en.reactjs.org/docs/refs-and-the-dom.html) or the [`React.findDOMNode`](https://en.reactjs.org/docs/react-dom.html#finddomnode) method to obtain the `HTMLElement` from your `ReactElements`. <br/>

For istance:
```javascript
/*
 * In this example I want to create a scrollable React Component which
 * has a button which smooothly scrolls the Component when clicked.
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
      <div id="myID" ref={this.myRef}> { /*Use the ref on the element you want to scroll*/ }
        <button onClick={
          () => uss.scrollYBy(500, {this.myRef.current}); { /*We retrieve the HTMLElement with the help of our ref*/ }
          //() => uss.scrollYBy(500, document.getElementById("myID")); { /*This would also work*/ }
        }>
        </button>
        ...
      </div>
    );
  }
}
```
## Q: Can I modify the way scroll-animation steps are calculated to a non-linear behavior ?
A: YES! <br/>
Just use `uss.setXStepLengthCalculator(YOUR_CUSTOM_EASE_FUNCTION, TARGET_CONTAINER)` for the x-axis and `uss.setYStepLengthCalculator(...)` for the y-axis. <br/>
For example:<br/>
```javascript
uss.setYStepLengthCalculator((remaning, originalTimestamp, timestamp, total, currentY, finalY, container) => {return remaning / 10 + 1;});
```
<br/>You can also use the standard cubic-bézier ease-functions included in the `universalsmoothscroll-ease-functions` library that you can find [here](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/universalsmoothscroll-ease-functions.js).<br/>
For istance:<br/>
```javascript
uss.setStepLengthCalculator(EASE_IN_OUT_CUBIC(), myContainer);
```
## Q: Can I make my scroll-animation last a certain amount of time?
A: YES!<br/>
While setting a custom ease function you will notice it will be passed both the timestamp relative to the beginning of the scroll-animation and the current timestamp as the second and third arguments of your function.<br/>
You can use them to make the scroll-animations last any amount of time you want.<br/><br/>
You can also use the standard cubic-bézier ease-functions included in the `universalsmoothscroll-ease-functions` library that you can find [here](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/universalsmoothscroll-ease-functions.js) which can be used by specifing a duration as the first argument.<br/>
For istance:<br/>
```javascript
uss.setStepLengthCalculator(EASE_LINEAR(2000), myContainer); //Every scroll-animation on our container will last 2 seconds
```
You may find [this](https://developer.mozilla.org/en/docs/Web/API/Window/requestAnimationFrame) helpful.
## Q: What is a _StepLengthCalculator_ ?
A: It's function that has to always return a finite number.<br/>

This function will be invoked by the API every time it has to decide how many pixels should be scrolled on the x/y axis of a container.<br/>
The way the API will invoke this function is by passing it the following input parameters (in this order):
  - RemaningScrollAmount of current the scroll-animation
  - OriginalTimestamp provided by the first \_stepX/Y function call (indicates the exact time in milliseconds at which the scroll-animation has started)
  - Timestamp provided by each \_stepX/Y function call (indicates the time in milliseconds at which the StepLengthCalculator is invoked)
  - TotalScrollAmount of the current scroll-animation
  - CurrentPosition of the container's top/left border (top if the scroll-animation is on the y-axis, left otherwise)
  - FinalPosition that the container's top/left border has to reach (top if the scroll-animation is on the y-axis, left otherwise)
  - Container on which the scroll-animation is currently being performed (a DOM element that can be scrolled)<br/>

Imagine that a scroll-animation is like a stair: you know where/when you started, how long the stair is, how much time has passed and where you are right now.<br/>
This stair could have many steps and you can decide if you want to rest and don't make any step (return 0), go up (return a number > 0), go down (return a number < 0) by telling the API through a StepLengthCalculator.<br/>   
This function can be invoked by the API 1000s of times during a single scroll-animation and that's why it gets passed all the parameters described above.<br/>

For istance:<br/>
```javascript
/*
 * This particular scroll calculator will make the scroll-animation
 * start slowly (total = remaning at the beginnig of the scroll-animation)
 * ramp up the speed (remaning will decrease more and more)
 * arriving at full speed (remaning = 0 at the end of the scroll-animation)   
 */
const myStepLengthCalculator = (remaning, originalTimestamp, timestamp, total, currentY, finalY, container) => {
    const traveledDistance = total - remaning;
    return traveledDistance + 1; //+1 because at first total = remaning and we wouldn't move at all without it
};
uss.setYStepLengthCalculator(myStepLengthCalculator, myContainer);
```

You don't have to write your own StepLengthCalculator if you don't want to, infact the API will still function even if you don't specify any (the behavior will be linear).<br/>
You can also use the functions of the `universalsmoothscroll-ease-functions` library that you can find [here](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/universalsmoothscroll-ease-functions.js) to get a StepLengthCalculator.<br/>

For example:<br/>
```javascript
/*
 * Make sure to have imported the universalsmoothscroll-ease-function library in your project
 * This StepLengthCalculator will make our scroll-animations always last 1 second and will make sure that
 * they will start as fast as possible and finish as slow as they can.
 */
uss.setXStepLengthCalculator(EASE_OUT_CUBIC(1000), myContainer);
```
[Here](https://easings.net/) you can find out more about the way the StepLengthCalculators provided by `universalsmoothscroll-ease-functions` [library](https://github.com/CristianDavideConte/universalSmoothScroll/blob/master/js/universalsmoothscroll-ease-functions.js) will affect your scroll-animations.
## Q: What is the difference between _`stillStart = true`_ and _`stillStart = false`_ ?
A: They produce 2 completly different kind of scroll-animations' behaviors.<br/>
_`stillStart = true`_ means that before the scroll-animation you requested can be played any other scroll-animation on the same axis of the passed container is cancelled so this type of scroll-animations always start from a no-movement situation in order to be performed.<br/>  
_`stillStart = false`_ means that even if other scroll-animations on the same axis of the passed container are currently being performed they won't be cancelled by default, they will just be extended/reduced by the passed delta.<br/>

This is an example of how different these 2 kind of scroll-animations are:<br/>
```javascript
const ourEaseFunction = (remaning, originalTimestamp, timestamp, total, currentY, finalY, container) => {return remaning / 15 + 1;};
uss.setYStepLengthCalculator(ourEaseFunction, window);

//CASE A: stillStart = true
const stillStartTrueBehavior = wheelEvent => {
    wheelEvent.preventDefault();
    wheelEvent.stopPropagation();
    uss.scrollYBy(wheelEvent.deltaY, window, null, true);
}

//CASE B: stillStart = false
const stillStartFalseBehavior = wheelEvent => {
    wheelEvent.preventDefault();
    wheelEvent.stopPropagation();
    uss.scrollYBy(wheelEvent.deltaY, window, null, false);
}

//Uncomment one or the other and look at the difference
//window.addEventListener("wheel", stillStartTrueBehavior,  {passive:false});
//window.addEventListener("wheel", stillStartFalseBehavior, {passive:false});
```
## Q: What is the _hrefSetup's_ `init` parameter ?
A: Unlike every other callback parameter of this API, this is a function that gets executed right before any scroll-animation is performed. <br/>
You may want to use this function to execute actions that must happen after an anchor link is clicked but before any scroll-animation is performed. <br/>
For example: <br/>
```javascript
let changeBg = () => document.body.style.backgroundColor = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"; //No need to return anything in this case
uss.hrefSetup(true, true, changeBg); //Every time an anchor link is clicked our body's backgroundColor is randomly changed
```
## Q: Can I obtain the _"momentum-scrolling"_ effect with this API ?
A: YES! <br/>
You can achive it by setting a custom ease-out stepLengthCalculator for the container you want to be _"momentum-scrolled"_. <br/>
For istance: <br/>
```javascript
/**
 * For the sake of semplicity I will use the same ease-out function 
 * I used on my personal web page.
 */
const myEaseFunction = (remaning) => {return 1 + remaning / 20;}; //Increase the divisor for an even smoother effect
myContainer.addEventListener("wheel", event => { //We want the momentum-scroll effect on wheel
    event.preventDefault(); //Prevent the classic scroll
    uss.scrollYBy(event.deltaY, myContainer, myCallback, false); //StillStart = false, will make the scroll-animation follow the mousewheel speed
}, {passive:false});
uss.setYStepLengthCalculator(myEaseFunction, myContainer); //A medium-speed momentum scrolling effect
```
## Q: What are _`_scrollX()`_ and _`_scrollY()`_ ?
A: They are functions that can only be internally accessed by the API, you won't be able to invoke them. <br/>
They execute all the instructions needed for a single scroll-animation-step on respectively the x-axis and the y-axis.
## Q: Why there's no setter for the _`_reducedMotion`_ variable ?
A: Because it's up to the final users to decide which accessibility settings they want to enable. <br/>
Ignoring user preferences is not suggested.   
## Q: Why is it allowed to directly modify internal variables ?
A: It is allowed (but highly discouraged) because there may be a bug that prevents you from setting a variable to a right value (not common). <br/>
If that's the case don't hesitate to contact me !

More coming soon...<br/><br/>
