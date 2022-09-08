#### <a href = "https://github.com/CristianDavideConte/universalSmoothScroll#table-of-contents"><code>&#8678; Back to Table of Contents</code></a>
<br/>

# Installation
In order to use any script you downloaded in the [`Download`](./Download.md) section, ***you must import it into your project***. <br/>
Look for the `<head>` section of the `index.html` file of your project: this will be the API's entrypoint. <br/>

For example: <br/>
```html
<html>
    <head>
        ...
      <!-- required -->
      <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-min.js"></script>        
      <!-- optional -->       
      <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-ease-functions-min.js" type = "module"></script> 
      <!-- optional -->
      <script src = "YOUR_JAVASCRIPT_FOLDER/universalsmoothscroll-dev-helpers-min.js" type = "module"></script>    
        ...
    </head>
    ...
</html>
```

The `universalsmoothscroll-min.js` script will auto-initialize itself. <br/>
The functions inside the modules will need to be imported before you can use them instead. 

---

### N.B. 
If you're using `Typescript` in your project, you may encounter the `Cannot find name 'yourVariable'` error (or something like that). <br/>
In order to solve this problem, you have to manually declare `yourVariable` by adding:
```typescript
declare var yourVariable: any
``` 
in your Typescript declaration file (the one that ends with `.d.ts`). <br/>

If don't have access to the `index.html` file _(or you simply don't have it)_ another way to import the USS API is to create inside your project _(via javascript or whichever language you're using)_ as many `Script` elements as the files you previously downloaded and link them to their paths. <br/>

<br/>

#### <p align="right"><a href = "./HowItWorks.md"><code>Go to next section &#8680;</code></a></p>
