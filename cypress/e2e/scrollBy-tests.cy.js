const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("scrollBy-tests.html"); 
})

describe("scrollBy", function() {
    let uss;
    it("Horizontally and vertically scrolls the test element by (n1,n2) pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollYBy, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollBy(150, 100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 150);
                            cy.elementScrollTopShouldBe(_testElement, 100);
                        }
                    );
                });
            });         
    });
})

describe("scrollToBy-StillStart-True", function() {
    let uss;
    
    const _testCalculatorX = (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => { 
        expect(remaning).to.equal(100);
        expect(originalTimestamp).to.equal(currentTimestamp);
        expect(total).to.equal(100);
        
        return total;
    
    }
    const _testCalculatorY = (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
        expect(remaning).to.equal(400);
        expect(originalTimestamp).to.equal(currentTimestamp);
        expect(total).to.equal(400);
        
        return total;
    }
    it("Horizontally and vertically scrolls the test element to (n1a,n1b) pixels and then replace that animation with a (n2a,n2b) pixels scroll", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                const _scroll = () => {
                    uss.scrollTo(500, 200, _testElement); 
                    uss.scrollBy(100, 400, _testElement, null, true);
                }

                uss.setXStepLengthCalculator(_testCalculatorX, _testElement, false); 
                expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorX);
                uss.setYStepLengthCalculator(_testCalculatorY, _testElement, false);   
                expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorY);
                
                expect(uss.isScrolling(_testElement)).to.be.false;
                _scroll();
                expect(uss.isScrolling(_testElement)).to.be.true;
                        
                cy.waitForUssCallback(
                    (resolve) => {
                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 100);
                        cy.elementScrollTopShouldBe(_testElement, 400);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False", function() {
    let uss;
    
    const _testCalculatorX = (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
        expect(remaning).to.be.greaterThan(170);
        expect(originalTimestamp).to.equal(currentTimestamp);
        expect(total).to.equal(300);
        
        return total;
    }
    const _testCalculatorY = (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
        expect(remaning).to.be.greaterThan(100);
        expect(originalTimestamp).to.equal(currentTimestamp);
        expect(total).to.equal(300);
        
        return total;
    }
    it("Horizontally and vertically scrolls the test element to (n1a,n1b) pixels and then extends that animation by (n2a,n2b) pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                const _scroll = (resolve) => {
                    uss.scrollTo(170, 100, _testElement); 
                    uss.scrollBy(130, 200, _testElement, null, false);
                }

                uss.setXStepLengthCalculator(_testCalculatorX, _testElement, false); 
                expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorX);
                uss.setYStepLengthCalculator(_testCalculatorY, _testElement, false); 
                expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorY);
                
                expect(uss.isScrolling(_testElement)).to.be.false;
                _scroll();
                expect(uss.isScrolling(_testElement)).to.be.true;

                cy.waitForUssCallback(
                    (resolve) => {        
                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 300);
                        cy.elementScrollTopShouldBe(_testElement, 300);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False-ExtendedScrollingWhileAnimating", function() {
    let uss;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentPosition, finalPosition, container) => {
        uss.scrollBy(90, 70, container, null, false);
    
        uss.setStepLengthCalculator(_testCalculator2, container, false);
        expect(uss.getXStepLengthCalculator(container, false)).to.equal(_testCalculator2);
        expect(uss.getYStepLengthCalculator(container, false)).to.equal(_testCalculator2);
        
        return remaning;
    }
    const _testCalculator2 = (remaning) => remaning;

    it("Tests if the scrollBy method with stillStart = \"false\" can extend a scroll-animation from inside a stepLengthCalculator", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setStepLengthCalculator(_testCalculator, _testElement, false);
                expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculator);
                expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculator);
                
                expect(uss.isScrolling(_testElement)).to.be.false;
                uss.scrollTo(100, 100, _testElement);
                expect(uss.isScrolling(_testElement)).to.be.true;
                
                cy.waitForUssCallback(
                    (resolve) => {
                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 190);
                        cy.elementScrollTopShouldBe(_testElement, 170);
                    }
                );
            })         
    });
})

describe("scrollBy-containScroll-below-0", function() {
    let uss;
    let finalXPosition;
    let finalYPosition;
    it("Scrolls the test element by (n1,n2) pixels obtaining a finalXPosition and a finalYPosition lower than 0", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollBy, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollBy(-10000, -10000, _testElement, resolve, true, true);
                            finalXPosition = uss.getFinalXPosition(_testElement);
                            finalYPosition = uss.getFinalYPosition(_testElement);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 0);
                            cy.elementScrollTopShouldBe(_testElement, 0);
                            expect(finalXPosition).to.equal(0);
                            expect(finalYPosition).to.equal(0);
                        }
                    );
                });
            });        
    });
})

describe("scrollBy-containScroll-beyond-maxScrollX-and-maxScrollY", function() {
    let uss;
    let maxScrollX;
    let maxScrollY;
    let finalXPosition;
    let finalYPosition;
    it("Scrolls the test element by (n1,n2) pixels obtaining a finalXPosition and a finalYPosition higher than its maxScrollX and maxScrollY", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollBy, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            maxScrollX = uss.getMaxScrollX(_testElement);
                            maxScrollY = uss.getMaxScrollY(_testElement);
                            uss.scrollBy(maxScrollX + 100, maxScrollY + 100, _testElement, resolve, true, true);
                            finalXPosition = uss.getFinalXPosition(_testElement);
                            finalYPosition = uss.getFinalYPosition(_testElement);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, maxScrollX);
                            cy.elementScrollTopShouldBe(_testElement, maxScrollY);
                            expect(finalXPosition).to.equal(maxScrollX);
                            expect(finalYPosition).to.equal(maxScrollY);
                        }
                    );
                });
            });        
    });
})