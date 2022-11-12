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
                            uss._reduceMotion = true;
                            uss.scrollBy(10, 20, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 10);
                            cy.elementScrollTopShouldBe(_testElement, 20);
                        }
                    );
                });
            });         
    });
})

describe("scrollToBy-StillStart-True", function() {
    let uss;

    it("Horizontally and vertically scrolls the test element to (n1a,n1b) pixels and then replace that animation with a (n2a,n2b) pixels scroll", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(50, 20, _testElement); 
                        expect(uss.getFinalXPosition(_testElement)).to.equal(50);
                        expect(uss.getFinalYPosition(_testElement)).to.equal(20);
                        uss.scrollBy(10, 40, _testElement, resolve, true);
                        expect(uss.getFinalXPosition(_testElement)).to.equal(10);
                        expect(uss.getFinalYPosition(_testElement)).to.equal(40);
                    }
                ).then(
                    () => {
                        //cy.elementScrollLeftShouldBe(_testElement, 10);
                        //cy.elementScrollTopShouldBe(_testElement, 40);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False", function() {
    let uss;
    
    it("Horizontally and vertically scrolls the test element to (n1a,n1b) pixels and then extends that animation by (n2a,n2b) pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(10, 40, _testElement); 
                        expect(uss.getFinalXPosition(_testElement)).to.equal(10);
                        expect(uss.getFinalYPosition(_testElement)).to.equal(40);
                        uss.scrollBy(10, 40, _testElement, resolve, false);
                        expect(uss.getFinalXPosition(_testElement)).to.equal(20);
                        expect(uss.getFinalYPosition(_testElement)).to.equal(80);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 20);
                        cy.elementScrollTopShouldBe(_testElement, 80);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False-ExtendedScrollingWhileAnimating", function() {
    let uss;
    let init = false;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentPosition, finalPosition, container) => {
        if(!init) {
            uss.scrollBy(10, 20, container, null, false);
            expect(uss.getFinalXPosition(container)).to.equal(20);
            expect(uss.getFinalYPosition(container)).to.equal(40);
            init = true;
        }
        return remaning;
    }

    it("Tests if the scrollBy method with stillStart=false can extend a scroll-animation from inside a stepLengthCalculator", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                uss.setStepLengthCalculator(_testCalculator, _testElement, false);
                expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculator);
                expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculator);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(10, 20, _testElement);
                        expect(uss.getFinalXPosition(_testElement)).to.equal(10);
                        expect(uss.getFinalYPosition(_testElement)).to.equal(20);

                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 20);
                        cy.elementScrollTopShouldBe(_testElement, 40);
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