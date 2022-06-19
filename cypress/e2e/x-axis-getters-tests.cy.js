/**
 * This file contains the tests for the following USS API functions:
 *  - getFinalXPosition
 *  - getScrollXDirection
 *  - getXStepLengthCalculator
 *  - getScrollXCalculator
 *  - getMaxScrollX
 *  - getXScrollableParent
 */

describe("getFinalXPosition-Body", function() {
    var uss;
    var finalXPosition;
    it("Tests the getFinalXPosition method", function() {
        cy.visit("index.html");
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
                            
              cy.testFailingValues(uss.getFinalXPosition, {
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
                11: [Object]
              })
              .then(() => {
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100, uss.getPageScroller(), resolve);
                    finalXPosition = uss.getFinalXPosition();
                }).then(() => {
                    cy.bodyScrollLeftShouldToBe(100);
                    expect(finalXPosition).to.equal(100);
                    expect(finalXPosition).to.equal(uss.getFinalXPosition());
                    expect(finalXPosition).to.equal(uss.getScrollXCalculator()());
                });
              });
          });        
    });
})

describe("getScrollXDirection-Body", function() {
    var uss;
    var scrollYDirectionLeft, scrollYDirectionRight;
    it("Tests the getScrollXDirection method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
            uss = win.uss;
            uss._containersData = new Map();

            cy.testFailingValues(uss.getScrollXDirection, {
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
                11: [Object]
              })
              .then(() => {
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100, uss.getPageScroller(), () => {
                        uss.scrollXTo(50, uss.getPageScroller(), resolve);
                        scrollYDirectionLeft = uss.getScrollXDirection();
                    });
                    scrollYDirectionRight = uss.getScrollXDirection();
                }).then(() => {
                    expect(scrollYDirectionLeft).to.equal(-1);
                    expect(scrollYDirectionRight).to.equal(1);
                    expect(uss.getScrollXDirection()).to.equal(0);
                });
            });
          });         
    });
})

describe("getXStepLengthCalculator-Body", function() {
    var uss;
    var nonTempTestCalculator = () => 10;
    var tempTestCalculator = r => r / 20 + 1;
    it("Tests the getXStepLengthCalculator method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
                                          
              cy.testFailingValues(uss.getXStepLengthCalculator, {
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
              })
              .then(() => {
                uss.setXStepLengthCalculator(nonTempTestCalculator, uss.getPageScroller(), false, true);
                expect(uss.getXStepLengthCalculator()).to.equal(nonTempTestCalculator);  
  
                uss.setXStepLengthCalculator(tempTestCalculator, uss.getPageScroller(), true, true);
                expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.equal(tempTestCalculator);
              
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100, uss.getPageScroller(), resolve);
                }).then(() => {
                    expect(uss.getXStepLengthCalculator()).to.equal(nonTempTestCalculator);
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
                });
            });
          });        
    });
})

describe("getScrollXCalculator-Body", function() {
    var uss;

    //This function is used to make sure that the passed callback is only called
    //once all the scroll-animations have been performed
    function createCallback(callback, requiredSteps) {
        let _currentStep = 0 //Number of the current _callback's calls
        const _callback = typeof callback === "function" ? () => {
        if(_currentStep < requiredSteps - 1) _currentStep++;
        else callback();
        } : null; //No action if no valid callback function is passed
        return _callback;
    }

    it("Tests the getScrollXCalculator method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
                               
              cy.testFailingValues(uss.getScrollXCalculator, {
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
                11: [Object]
              },
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(res).to.throw("USS fatal error (execution stopped)");
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

                _elements.forEach(el => expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft));
                expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);

                return new Cypress.Promise(resolve => {
                    const callback = createCallback(resolve, _elements.length);
                    _elements.forEach(el =>uss.scrollXTo(Math.random() * el.scrollWidth, el, callback));
                }).then(() => {
                    _elements.forEach(el => expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft));
                    expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);
                });
            });
          });        
    });
})

describe("getMaxScrollX-Body", function() {
    var uss;
    it("Tests the getMaxScrollX method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
                            
              cy.testFailingValues(uss.getMaxScrollX, {
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
                11: [Object]
              })
              .then(() => {
                const _expectedMaxScrollX = uss.getPageScroller().scrollWidth / 2 + uss.getScrollbarsMaxDimension(); 

                expect(Number.isFinite(uss.getMaxScrollX())).to.be.true;
                expect(uss.getMaxScrollX() > 0).to.be.true;
                expect(uss.getMaxScrollX()).to.be.closeTo(_expectedMaxScrollX, 1);   
                
                //test elements that are unscrollable on the x-axis 
                expect(uss.getMaxScrollX(win.document.getElementById("yScroller"))).to.equal(0);
                expect(uss.getMaxScrollX(win.document.getElementById("stopScrollingY"))).to.equal(0);
              });
          });     
    });
})

describe("getXScrollableParent-Body", function() {
    var uss;
    it("Tests the getXScrollableParent method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  
                            
              cy.testFailingValues(uss.getXScrollableParent, {
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
                expect(res).to.equal(null);
              })
              .then(() => {
                //test window, html and body
                expect(uss.getXScrollableParent(win)).to.be.null;  
                expect(uss.getXScrollableParent(win.document.documentElement)).to.be.null;   
                expect(uss.getXScrollableParent(uss.getPageScroller())).to.be.null;
                
                //test element with position:fixed
                expect(uss.getXScrollableParent(win.stopScrollingX)).to.be.null;
                
                //test elements with no constraint 
                expect(uss.getXScrollableParent(win.linear)).to.equal(win.document.body);
                expect(uss.getXScrollableParent(win.easeFunctionSelectorList)).to.equal(win.document.body);
                expect(uss.getXScrollableParent(win.document.getElementById("section11"))).to.equal(win.document.getElementById("xScrollerSection"));
            });
        });     
    });
})