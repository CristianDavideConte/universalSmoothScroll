/**
 * This file contains the tests for the following USS API functions:
 *  - getFinalYPosition
 *  - getScrollYDirection
 *  - getYStepLengthCalculator
 *  - getScrollYCalculator
 *  - getMaxScrollY
 *  - getYScrollableParent
 */

describe("getFinalYPosition-Body", function() {
    var uss;
    var finalYPosition;
    it("Tests the getFinalYPosition method", function() {
      cy.visit("index.html"); 
      cy.window()
        .then((win) => {
            uss = win.uss;
            uss._containersData = new Map();

            cy.testFailingValues(uss.getFinalYPosition, {
              0: [Cypress.env("failingValuesNoUndefined")]
            })
            .then(() => {
              cy.waitForUssCallback(
                (resolve) => {
                    uss.scrollYTo(100, uss.getPageScroller(), resolve);
                    finalYPosition = uss.getFinalYPosition();
                }
              ).then(
                () => {
                  cy.bodyScrollTopShouldToBe(100);
                  expect(finalYPosition).to.equal(100);
                  expect(finalYPosition).to.equal(uss.getFinalYPosition());
                  expect(finalYPosition).to.equal(uss.getScrollYCalculator()());
                }
              );
            });
        });         
    });
})

describe("getScrollYDirection-Body", function() {
    var uss;
    var scrollYDirectionUp, scrollYDirectionDown;
    it("Tests the getScrollYDirection method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
              
            cy.testFailingValues(uss.getScrollYDirection, {
              0: [Cypress.env("failingValuesNoUndefined")]
            })
            .then(() => {
              cy.waitForUssCallback(
                (resolve) => {
                  uss.scrollYTo(100, uss.getPageScroller(), () => {
                      uss.scrollYTo(50, uss.getPageScroller(), resolve);
                      scrollYDirectionUp = uss.getScrollYDirection();
                  });
                  scrollYDirectionDown = uss.getScrollYDirection();
                }
              ).then(
                () => {
                  expect(scrollYDirectionUp).to.equal(-1);
                  expect(scrollYDirectionDown).to.equal(1);
                  expect(uss.getScrollYDirection()).to.equal(0);
                }
              );
            });
          });         
    });
})

describe("getYStepLengthCalculator-Body", function() {
    var uss;
    var nonTempTestCalculator = () => 10;
    var tempTestCalculator = r => r / 20 + 1;
    it("Tests the getYStepLengthCalculator method", function() {
      cy.visit("index.html"); 
      cy.window()
        .then((win) => {
          uss = win.uss;
          uss._containersData = new Map();
                            
          cy.testFailingValues(uss.getYStepLengthCalculator, {
            0: [Cypress.env("failingValuesAll"), 
                [true, false]
                ]
          })
          .then(() => {
            uss.setYStepLengthCalculator(nonTempTestCalculator, uss.getPageScroller(), false, true);
            expect(uss.getYStepLengthCalculator()).to.equal(nonTempTestCalculator);  

            uss.setYStepLengthCalculator(tempTestCalculator, uss.getPageScroller(), true, true);
            expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.equal(tempTestCalculator);
            
            cy.waitForUssCallback(
              (resolve) => {
                uss.scrollYTo(100, uss.getPageScroller(), resolve);
              }
            ).then(
              () => {
                expect(uss.getYStepLengthCalculator()).to.equal(nonTempTestCalculator);
                expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
              }
            );
          });
        });         
    });
})

describe("getScrollYCalculator", function() {
    var uss;
    var result;
    it("Tests the getScrollYCalculator method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();

              cy.testFailingValues(uss.getScrollYCalculator, {
                0: [Cypress.env("failingValuesNoUndefined")]
              },
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(res).to.throw(Cypress.env("defaultUssException"));
              })
              .then(() => {
                const _document = win.document.documentElement;
                const _body = win.document.body;
                const _positionFixedElement = win.document.getElementById("stopScrollingY");
                const divElements = Array.from(win.document.getElementsByTagName("div"))
                                        .filter(el => el !== _positionFixedElement);
                const _randomElement = divElements[Math.round((divElements.length - 1) * Math.random())];

                const _elements = [
                    _document,
                    _body,
                    win.document.getElementById("easeFunctionSelectorList"),
                    _positionFixedElement,
                    _randomElement
                ].concat(divElements);

                _elements.forEach(el => expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop));
                expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                _elements.forEach(el => uss.scrollYTo(Math.random() * el.scrollHeight, 
                                                      el, 
                                                      () => {
                                                        result = uss.getScrollYCalculator(el)() === el.scrollTop;
                                                        if(!result) uss.stopScrollingAll();
                                                      }
                ));

                cy.waitForUssCallback(
                  undefined //default value: resolve after timeout
                ).then(
                  () => {
                    expect(result).to.be.true;
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);
                  }
                );
            });
          });        
    });
})

describe("getMaxScrollY", function() {
    var uss;
    it("Tests the getMaxScrollY method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
                             
              cy.testFailingValues(uss.getMaxScrollY, {
                0: [Cypress.env("failingValuesNoUndefined")]
              })
              .then(() => {
                const _expectedMaxScrollY = uss.getPageScroller().scrollHeight / 2 + uss.getScrollbarsMaxDimension();
                
                expect(Number.isFinite(uss.getMaxScrollY())).to.be.true;
                expect(uss.getMaxScrollY() > 0).to.be.true;
                expect(uss.getMaxScrollY()).to.be.closeTo(_expectedMaxScrollY, 1);  

                //test elements that are unscrollable on the y-axis 
                expect(uss.getMaxScrollY(win.document.getElementById("xScroller"))).to.equal(0);
                expect(uss.getMaxScrollY(win.document.getElementById("stopScrollingX"))).to.equal(0);
              });
          });     
    });
})

describe("getYScrollableParent", function() {
    var uss;
    it("Tests the getYScrollableParent method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              cy.testFailingValues(uss.getYScrollableParent, {
                0: [Cypress.env("failingValuesAll"), 
                    [true, false]
                   ]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(res).to.equal(null);
              })
              .then(() => {
                //test window, html and body
                expect(uss.getYScrollableParent(win)).to.be.null;  
                expect(uss.getYScrollableParent(win.document.documentElement)).to.be.null;   
                expect(uss.getYScrollableParent(uss.getPageScroller())).to.be.null;
                
                //test element with position:fixed
                expect(uss.getYScrollableParent(win.stopScrollingY)).to.be.null;
                
                //test elements with no constraint 
                expect(uss.getYScrollableParent(win.document.getElementById("linear"))).to.equal(win.document.getElementById("easeFunctionSelectorList"));
                expect(uss.getYScrollableParent(win.document.getElementById("easeFunctionSelectorList"))).to.equal(win.document.body);
                expect(uss.getYScrollableParent(win.document.getElementById("section12"))).to.equal(win.document.getElementById("yScrollerSection"));
            });
        })     
    });
})