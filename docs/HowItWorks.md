# How it works
All the API methods are properties of the `uss` object which gets automatically initialized when you import the script into your project.<br/>
The `uss` object is initialized in the global scope of you project so be aware of that !<br/>
The `uss` object has some internal variables which **SHOULD NOT** be directly manipulated: always use the provided getters and setters.<br/>
You will be able to recognize those internal properties because their names begin with an `_` (underscore). <br/>
For istance:
* `uss._xStepLength` is the name of the internal property used by the `uss` object.
* `uss.getXStepLength()` && `uss.setXStepLength()` are the two getter and setter for the `uss._xStepLength` variable.<br/>

There are 3 main scrolling-methods:
* `uss.scrollTo()`
* `uss.scrollBy()`
* `uss.scrollIntoView()`<br/>

There's also 1 handy auto-initializer for anchor links:
* `uss.hrefSetup()`<br/>
<br/>