const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("scrollYTo-tests.html"); 
})

describe("scrollYTo", function() {
    let uss;
    it("Vertically scrolls the test element to n pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollYTo, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss._reducedMotion = true;
                            uss.scrollYTo(10, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollTopShouldBe(_testElement, 10);
                        }
                    );
                });
            });        
    });
})

describe("scrollYTo-containScroll-below-0", function() {
    let uss;
    let finalYPosition;
    it("Vertically scrolls the test element to n pixels where n is lower than 0", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollYTo, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYTo(-100, _testElement, resolve, true);
                            finalYPosition = uss.getFinalYPosition(_testElement);
                        }
                    ).then(
                        () => {
                            cy.elementScrollTopShouldBe(_testElement, 0);
                            expect(finalYPosition).to.equal(0);
                        }
                    );
                });
            });        
    });
})

describe("scrollYTo-containScroll-beyond-maxScrollY", function() {
    let uss;
    let maxScrollY;
    let finalYPosition;
    it("Vertically scrolls the test element to n pixels where n is higher than its maxScrollY", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollYTo, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            maxScrollY = uss.getMaxScrollY(_testElement);
                            uss.scrollYTo(maxScrollY + 100, _testElement, resolve, true);
                            finalYPosition = uss.getFinalYPosition(_testElement);
                        }
                    ).then(
                        () => {
                            cy.elementScrollTopShouldBe(_testElement, maxScrollY);
                            expect(finalYPosition).to.equal(maxScrollY);
                        }
                    );
                });
            });        
    });
})

describe("scrollYTo-immediatelyStoppedScrolling", function() {
    let uss;
    it("Tests the scrollYTo method whenever a scroll-animation is immediately stopped", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.scrollYTo(10, _testElement);
                uss.stopScrollingY(_testElement);
                cy.elementScrollTopShouldBe(_testElement, 0);
            });         
    });
})

describe("scrollYToBy-immediatelyStoppedScrolling", function() {
    let uss;
    it("Tests the scrollYTo method whenever a scroll-animation is immediately stopped and restarted with the scrollYBy method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.scrollYTo(10, _testElement);
                uss.stopScrollingY(_testElement);
                uss.scrollYBy(20, _testElement);
                cy.elementScrollTopShouldBe(_testElement, 20);
            });         
    });
})

describe("scrollYToTo-immediatelyStoppedScrolling", function() {
    let uss;
    it("Tests the scrollYTo method whenever a scroll-animation is immediately stopped and restarted with the scrollYTo method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.scrollYTo(10, _testElement);
                uss.stopScrollingY(_testElement);
                uss.scrollYTo(20, _testElement);
                cy.elementScrollTopShouldBe(_testElement, 20);
            });         
    });
})

describe("scrollYTo-StoppedScrollingWhileAnimating", function() {
    let uss;
    let init = 0;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
        if(init > 1) {
            uss.stopScrollingY(container);
            return 1;
        }

        init++;
        return remaning / 3 + 1;
    }
   
    it("Tests the scrollYTo method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setYStepLengthCalculator(_testCalculator, _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(200, _testElement, resolve);
                        
                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        expect(uss.getScrollYCalculator(_testElement)()).to.be.lessThan(200);
                    }
                );
            });         
    });
})

describe("scrollYTo-scrollYTo-ReplaceScrollingWhileAnimating", function() {
    let uss;
    let init = 0;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
        if(init === 1) {
            uss.scrollYTo(10, container);
            return 1;
        }

        init++;
        return remaning / 3 + 1;
    }

    it("Tests if the scrollYTo method can replace the current scroll-animation from inside a stepLengthCalculator", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setYStepLengthCalculator(_testCalculator, _testElement, false);
                    
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(100, _testElement, resolve);
                        
                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        cy.elementScrollTopShouldBe(_testElement, 10);
                    }
                );
            });         
    });
})