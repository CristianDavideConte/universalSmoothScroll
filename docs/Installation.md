#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Installation
In order to use any script you downloaded in the [`Download`](./Download.md) section, ***you must import it/them into your project***. <br/>
Most of the time your project will have an `index.html` file which can be used as the API's entrypoint. <br/>
Inside the `index.html`'s `<head>` section create a `<script>` for each file you downloaded and use the `src` attribute to specify its path. <br/>  

For example: <br/>
```html
<html>
    <head>
        ...
      <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-min.js"></script>
      <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-ease-functions-min.js"></script> <!-- optional -->
        ...
    </head>
    ...
</html>
```

Because all the scripts will auto-initialize themselves, you can now start using them without any extra step.

---

### N.B. 
If don't have access to the `index.html` file _(or you simply don't have it)_ another way to import the USS API is to create _(via javascript or whichever language you're using)_ as many `Script` elements as the files you downloaded inside your project and link them to the correct paths. <br/>
