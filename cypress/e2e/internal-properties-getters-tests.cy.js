Cypress.config("defaultCommandTimeout", Cypress.env("preferredTimeout"));

function bodyScrollLeftShouldToBe(value) {
    cy.get("body")
      .should("have.prop", "scrollLeft")
      .and("eq", value);
}

function bodyScrollTopShouldToBe(value) {
    cy.get("body")
      .should("have.prop", "scrollTop")
      .and("eq", value);
}

describe("getMinAnimationFrame-Body", function() {
    var uss;
    it("Tests the getMinAnimationFrame method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              //DEFAULT_YSTEP_LENGTH
              const _defaultWinHeight = win.innerHeight; 
              const _defaultYStepLegth = Math.max(1, Math.abs(38 - 20 / 140 * (_defaultWinHeight - 789)));
              const _defaultValue = _defaultWinHeight / _defaultYStepLegth;
              expect(uss.getMinAnimationFrame()).to.equal(_defaultValue); 

              uss.setMinAnimationFrame(10);
              expect(uss.getMinAnimationFrame()).to.equal(10); 
          });        
    })
})

describe("getWindowHeight-Body", function() {
    var uss;
    const resolutions = [[640, 480],
                         [1280, 720], 
                         [1920, 1080], 
                         [2560, 1440]];
    resolutions.forEach(res => {
        it("Tests the getWindowHeight method", function() {
            cy.viewport(res[0], res[1]);
            cy.visit("index.html"); 
            cy.window()
              .then((win) => {
                  uss = win.uss;
                  uss._containersData = new Map();  
    
                  expect(uss.getWindowHeight()).to.equal(win.innerHeight); 
              });        
        });
    });    
})

describe("getWindowWidth-Body", function() {
    var uss;
    const resolutions = [[640, 480],
                         [1280, 720], 
                         [1920, 1080], 
                         [2560, 1440]];
    resolutions.forEach(res => {
        it("Tests the getWindowWidth method", function() {
            cy.viewport(res[0], res[1]);
            cy.visit("index.html"); 
            cy.window()
              .then((win) => {
                  uss = win.uss;
                  uss._containersData = new Map();  
    
                  expect(uss.getWindowWidth()).to.equal(win.innerWidth); 
              });        
        });
    });    
})

describe("getScrollbarsMaxDimension-Body", function() {
    var uss;

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
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              if(browserIsChrome(win)) expect(uss.getScrollbarsMaxDimension()).to.equal(17);
              else if(browserIsEdgeChromium(win)) expect(uss.getScrollbarsMaxDimension()).to.equal(17);
              else if(browserIsFirefox(win)) expect(uss.getScrollbarsMaxDimension()).to.be.oneOf([0,12,15]);
              else if(browserIsSafari(win)) expect(uss.getScrollbarsMaxDimension()).to.equal(0);       
          });        
    });   
})

describe("getPageScroller-Body", function() {
    var uss;
    it("Tests the getPageScroller method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                //Internal initial definition of pageScroller
                uss._pageScroller = document.scrollingElement || win; 

                if(document.scrollingElement) expect(uss.getPageScroller()).to.equal(document.scrollingElement);
                else expect(uss.getPageScroller()).to.equal(win); 

                uss.setPageScroller(win.document.body);
                expect(uss.getPageScroller()).to.equal(win.document.body); 
            });        
    });
})

describe("getReducedMotionState-Body", function() {
    var uss;
    it("Tests the getReducedMotionState method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                //TODO
            });        
    });
})

describe("getDebugMode-Body", function() {
    var uss;
    it("Tests the getDebugMode method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                expect(uss.getDebugMode()).to.equal(""); 

                uss.setDebugMode("legacy");
                expect(uss.getDebugMode()).to.equal("legacy");

                uss.setDebugMode("novalue");
                expect(uss.getDebugMode()).to.equal("novalue");
                
                uss.setDebugMode("disabled");
                expect(uss.getDebugMode()).to.equal("disabled");
                
                uss.setDebugMode(10);
                expect(uss.getDebugMode()).to.equal("disabled");
            });        
    });
})
