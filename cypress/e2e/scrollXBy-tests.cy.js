const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("scrollXBy-tests.html"); 
})

describe("scrollXBy", function() {
    let uss;
    it("Horizontally scrolls the test element by n pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollXBy, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isXScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss._reduceMotion = true;
                            uss.scrollXBy(10, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 10);
                        }
                    );
                });
            });         
    });
})

describe("scrollXToBy-StillStart-True", function() {
    let uss;
    let oldFinalXPosition;
    let finalXPosition;

    it("Horizontally scrolls the test element to n1 pixels and then replace that animation with a n2 pixels scroll", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(20, _testElement); 
                        oldFinalXPosition = uss.getFinalXPosition(_testElement);

                        uss.scrollXBy(10, _testElement, null, true);
                        finalXPosition = uss.getFinalXPosition(_testElement);

                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        expect(oldFinalXPosition).to.equal(20);
                        expect(finalXPosition).to.equal(10);
                        cy.elementScrollLeftShouldBe(_testElement, 10);
                    }
                );
            });        
    });
})

describe("scrollXToBy-StillStart-False", function() {
    let uss;
    let oldFinalXPosition;
    let finalXPosition;

    it("Horizontally scrolls the test element to n1 pixels and then extends that animation by n2 pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(20, _testElement); 
                        oldFinalXPosition = uss.getFinalXPosition(_testElement);

                        uss.scrollXBy(10, _testElement, null, false);
                        finalXPosition = uss.getFinalXPosition(_testElement);

                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        expect(oldFinalXPosition).to.equal(20);
                        expect(finalXPosition).to.equal(30);
                        cy.elementScrollLeftShouldBe(_testElement, 30);
                    }
                );
            });        
    });
})

describe("scrollXToBy-StillStart-False-ExtendedScrollingWhileAnimating", function() {
    let uss;
    let oldFinalXPosition;
    let init = false;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
        if(!init) {
            init = true;
            uss.scrollXBy(10, container, null, false);
            return 1;
        }
        return remaning;
    }

    it("Tests if the scrollXBy method with stillStart=false can extend a scroll-animation from inside a stepLengthCalculator", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setXStepLengthCalculator(_testCalculator, _testElement, false);
                expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculator);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(10, _testElement);
                        oldFinalXPosition = uss.getFinalXPosition(_testElement);
                        
                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        expect(oldFinalXPosition).to.equal(10);
                        cy.elementScrollLeftShouldBe(_testElement, 20);
                    }
                );
            });         
    });
})

describe("scrollXBy-containScroll-below-0", function() {
    let uss;
    let finalXPosition;
    it("Horizontally scrolls the test element by n pixels obtaining a finalXPosition lower than 0", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollXBy, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isXScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollXBy(-10000, _testElement, resolve, true, true);
                            finalXPosition = uss.getFinalXPosition(_testElement);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 0);
                            expect(finalXPosition).to.equal(0);
                        }
                    );
                });
            });        
    });
})

describe("scrollXBy-containScroll-beyond-maxScrollX", function() {
    let uss;
    let maxScrollX;
    let finalXPosition;
    it("Horizontally scrolls the test element by n pixels obtaining a finalXPosition higher than its maxScrollX", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollXBy, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isXScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            maxScrollX = uss.getMaxScrollX(_testElement);
                            uss.scrollXBy(maxScrollX + 100, _testElement, resolve, true, true);
                            finalXPosition = uss.getFinalXPosition(_testElement);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, maxScrollX);
                            expect(finalXPosition).to.equal(maxScrollX);
                        }
                    );
                });
            });        
    });
})
