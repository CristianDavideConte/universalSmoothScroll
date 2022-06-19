/**
 * This file contains the tests for the following USS API functions:
 *  - setMinAnimationFrame
 *  - setPageScroller
 *  - setDebugMode
 */

describe("setMinAnimationFrame-Body", function() {
    var uss;
    it("Tests the setMinAnimationFrame method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              uss.setMinAnimationFrame(10);
              expect(uss.getMinAnimationFrame()).to.equal(10);

              uss.setMinAnimationFrame(Math.pow(2, 30));
              expect(uss.getMinAnimationFrame()).to.equal(Math.pow(2, 30));
   
              cy.testFailingValues(uss.setMinAnimationFrame, {
                0: [Infinity],
                1: [-Infinity],
                2: [true],
                3: [false],
                4: [NaN],
                5: [""],
                6: [-1],
                7: [0],
                8: [null],
                9: [undefined],
                10: [],
                11: [Object]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(uss.getMinAnimationFrame()).to.equal(Math.pow(2, 30));
              });
          });        
    })
})

describe("setPageScroller-Body", function() {
    var uss;
    it("Tests the setPageScroller method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              uss.setPageScroller(win);
              expect(uss.getPageScroller()).to.equal(win);
                            
              cy.testFailingValues(uss.setPageScroller, {
                0: [Infinity],
                1: [-Infinity],
                2: [true],
                3: [false],
                4: [NaN],
                5: [""],
                61: [10],
                62: [-1],
                7: [0],
                8: [null],
                9: [undefined],
                10: [],
                11: [Object]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(uss.getPageScroller()).to.equal(win);
              })
              .then(() => {
                uss.setPageScroller(win.document.documentElement);
                expect(uss.getPageScroller()).to.equal(win.document.documentElement);
                
                uss.setPageScroller(win.document.body);
                expect(uss.getPageScroller()).to.equal(win.document.body);
  
                return new Promise(resolve => {
                  uss.scrollTo(100, 200);
                  setTimeout(() => {
                    expect(uss.getScrollXCalculator(uss.getPageScroller())()).to.equal(100);
                    expect(uss.getScrollYCalculator(uss.getPageScroller())()).to.equal(200);
                    
                    uss.scrollBy(-100, -200);
                    setTimeout(() => {
                      expect(uss.getScrollXCalculator(uss.getPageScroller())()).to.equal(0);
                      expect(uss.getScrollYCalculator(uss.getPageScroller())()).to.equal(0);
                        resolve();
                    }, 1000);
                  }, 1000);
                });
              });
          });        
    })
})

describe("setDebugMode-Body", function() {
    var uss;
    it("Tests the setDebugMode method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              cy.testFailingValues(uss.setDebugMode, {
                0: [Infinity],
                1: [-Infinity],
                2: [true],
                3: [false],
                4: [NaN],
                61: [10],
                62: [-1],
                7: [0],
                8: [null],
                9: [undefined],
                10: [],
                11: [Object],
                12: [win]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(uss.getDebugMode()).to.equal("");
              })
              .then(() => {
                uss.setDebugMode("test");
                expect(uss.getDebugMode()).to.equal("test");
  
                uss.setDebugMode("legacy");
                expect(uss.getDebugMode()).to.equal("legacy");
  
                uss.setDebugMode("disabled");
                expect(uss.getDebugMode()).to.equal("disabled");  
  
                uss.setDebugMode("Disabled");
                expect(uss.getDebugMode()).to.equal("Disabled");     
              });      
          });        
    })
})




