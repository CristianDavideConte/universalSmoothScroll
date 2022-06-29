/**
 * This file contains the tests for the following USS API functions:
 *  - setMinAnimationFrame
 *  - setPageScroller
 *  - setDebugMode
 *  - setErrorLogger
 *  - setWarningLogger
 */

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
                0: [Cypress.env("failingValuesNoPositiveNumberOrUndefined")]
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

describe("setErrorLogger", function() {
  var uss;
  var validLogger1 = (a,b,c) => console.log(a,b,c);
  var validLogger2 = () => console.log("");
  var validLogger3 = () => {}
  it("Tests the setErrorLogger method", function() {
      cy.visit("index.html"); 
      cy.window()
        .then((win) => {
            uss = win.uss;
            uss._containersData = new Map();  
            const _originalLogger = uss._errorLogger;

            cy.testFailingValues(uss.setErrorLogger, {
              0: [Cypress.env("failingValuesAllNoUndefined")]
            }, 
            (res, v1, v2, v3, v4, v5, v6, v7) => {
              expect(uss._errorLogger).to.equal(_originalLogger);
            })
            .then(() => {
              uss.setErrorLogger(validLogger1);
              expect(uss._errorLogger).to.equal(validLogger1);

              uss.setErrorLogger(validLogger2);
              expect(uss._errorLogger).to.equal(validLogger2);

              uss.setErrorLogger(validLogger3);
              expect(uss._errorLogger).to.equal(validLogger3);
            });      
        });        
  })
})


describe("setWarningLogger", function() {
  var uss;
  var validLogger1 = (a,b,c) => console.log(a,b,c);
  var validLogger2 = () => console.log("");
  var validLogger3 = () => {}
  it("Tests the setWarningLogger method", function() {
      cy.visit("index.html"); 
      cy.window()
        .then((win) => {
            uss = win.uss;
            uss._containersData = new Map();  
            const _originalLogger = uss._warningLogger;

            cy.testFailingValues(uss.setWarningLogger, {
              0: [Cypress.env("failingValuesAllNoUndefined")]
            }, 
            (res, v1, v2, v3, v4, v5, v6, v7) => {
              expect(uss._warningLogger).to.equal(_originalLogger);
            })
            .then(() => {
              uss.setWarningLogger(validLogger1);
              expect(uss._warningLogger).to.equal(validLogger1);

              uss.setWarningLogger(validLogger2);
              expect(uss._warningLogger).to.equal(validLogger2);

              uss.setWarningLogger(validLogger3);
              expect(uss._warningLogger).to.equal(validLogger3);
            });      
        });        
  })
})




