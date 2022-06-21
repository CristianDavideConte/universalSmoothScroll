/**
 * This file contains the tests for the following USS API functions:
 *  - setStepLength
 *  - setMinAnimationFrame
 *  - setPageScroller
 *  - setDebugMode
 */

describe("setStepLength", function() {
  var uss;
  var _testStepInvalidTypeString = "";
  var _testStepInvalidTypeNaN = NaN;
  var _testStepValidType1 = 10;
  var _testStepValidType2 = 5;
  it("Tests the setStepLength method", function() {
      cy.visit("index.html"); 
      cy.window()
        .then((win) => {
            uss = win.uss;
            uss._containersData = new Map();
            
            const _initialXStepLength = uss.getXStepLength(); 
            const _initialYStepLength = uss.getYStepLength(); 

            cy.testFailingValues(uss.setStepLength, {
              0: [Cypress.env("failingValuesNoPositiveNumber").concat([_testStepInvalidTypeString, _testStepInvalidTypeNaN])],
            }, 
            (res, v1, v2, v3, v4, v5, v6, v7) => {
              expect(uss.getXStepLength()).to.equal(_initialXStepLength);
              expect(uss.getYStepLength()).to.equal(_initialYStepLength);
            })
            .then(() => {
              //test valid step lengths
              uss.setStepLength(_testStepValidType1);
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType1);  
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType1);  

              uss.setStepLength(_testStepValidType2);
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2); 
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2); 

              uss.stopScrolling();
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              
              uss.setStepLength(_testStepInvalidTypeString);
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              
              return new Cypress.Promise(resolve => {
                  uss.scrollXTo(100, uss.getPageScroller(), resolve);
              }).then(() => {
                  cy.bodyScrollLeftShouldToBe(100);
                  expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                  expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              });
          });
      });     
  });
})

describe("setMinAnimationFrame", function() {
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
                0: [Cypress.env("failingValuesNoPositiveNumber")]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(uss.getMinAnimationFrame()).to.equal(Math.pow(2, 30));
              });
          });        
    })
})

describe("setPageScroller", function() {
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
                0: [Cypress.env("failingValuesAll")]
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

describe("setDebugMode", function() {
    var uss;
    it("Tests the setDebugMode method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              cy.testFailingValues(uss.setDebugMode, {
                0: [Cypress.env("failingValuesNoStringNoUndefined")]
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




