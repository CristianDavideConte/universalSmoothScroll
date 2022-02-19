#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Installation
In order to use any script you downloaded in the [`Download`](./Download.md) section, ***you must import it into your project***. <br/>
Most of the time your project will have an `index.html` file which can be used as the API's entrypoint. <br/>
Inside the `index.html`'s `<head>` section create a `<script>` for each file you downloaded and use the `src` attribute to specify its path. <br/>  

For example: <br/>
```html
<html>
    <head>
        ...
      <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-min.js"></script> <!-- always required -->
      <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-ease-functions-min.js"></script> <!-- optional -->
        ...
    </head>
    ...
</html>
```

The scripts will auto-initialize themselves and you can now start using the Universal Smooth Scroll API.

---

### N.B. 
If you're using typescript in your project, you may encounter the `Cannot find name 'uss'` error (or something like that). <br/>
In order to solve it, you have to manually declare the `uss` object by writing `declare var uss: any` in you typescript declaration file (the one that ends with `.d.ts`). <br/>

If don't have access to the `index.html` file _(or you simply don't have it)_ another way to import the USS API is to create inside your project _(via javascript or whichever language you're using)_ as many `Script` elements as the files you previously downloaded and link them to their paths. <br/>

<br/>

#### <p align="right"><a href = "./HowItWorks.md"><code>Go to next section &#8680;</code></a></p>
