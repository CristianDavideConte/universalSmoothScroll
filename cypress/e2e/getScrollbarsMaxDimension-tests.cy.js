describe("getScrollbarsMaxDimension", function() {
    let uss;

    //Source: https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
    function browserIsChrome(window) {
        const isChromium = window.chrome;
        const winNav = window.navigator;
        const vendorName = winNav.vendor;
        const isOpera = typeof window.opr !== "undefined";
        const isIEedge = winNav.userAgent.indexOf("Edg") > -1;
        const isIOSChrome = winNav.userAgent.match("CriOS");

        return (isIOSChrome) || (
                isChromium !== null &&
                typeof isChromium !== "undefined" &&
                vendorName === "Google Inc." &&
                isOpera === false &&
                isIEedge === false
        );
    }

    //Source: https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
    function browserIsEdgeChromium(window) {
        const isChromium = window.chrome;
        const winNav = window.navigator;
        const vendorName = winNav.vendor;
        const isOpera = typeof window.opr !== "undefined";
        const isIEedge = winNav.userAgent.indexOf("Edg") > -1;

        return (
                isChromium !== null &&
                typeof isChromium !== "undefined" &&
                vendorName === "Google Inc." &&
                isOpera === false &&
                isIEedge === true
        );
    }

    //Source: https://stackoverflow.com/questions/7944460/detect-safari-browser
    function browserIsSafari(window) {
        return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    }

    //Source: https://stackoverflow.com/questions/7000190/detect-all-firefox-versions-in-js
    function browserIsFirefox(window) {
        return window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    it("Tests the getScrollbarsMaxDimension method", function() {
        cy.visit("getScrollbarsMaxDimension-tests.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;

              if(browserIsChrome(win)) expect(uss.getScrollbarsMaxDimension()).to.equal(17);
              else if(browserIsEdgeChromium(win)) expect(uss.getScrollbarsMaxDimension()).to.equal(17);
              else if(browserIsFirefox(win)) expect(uss.getScrollbarsMaxDimension()).to.be.oneOf([0,12,15]);
              else if(browserIsSafari(win)) expect(uss.getScrollbarsMaxDimension()).to.equal(0);       
          });        
    });   
})