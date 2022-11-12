const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("scrollYBy-tests.html"); 
})

describe("scrollYBy", function() {
    let uss;
    it("Vertically scrolls the test element by n pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollYBy, {
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
                            uss._reduceMotion = true;
                            uss.scrollYBy(10, _testElement, resolve);
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

describe("scrollYToBy-StillStart-True", function() {
    let uss;
    let oldFinalYPosition;
    let finalYPosition;

    it("Vertically scrolls the test element to n1 pixels and then replace that animation with a n2 pixels scroll", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(20, _testElement); 
                        oldFinalYPosition = uss.getFinalYPosition(_testElement);

                        uss.scrollYBy(10, _testElement, resolve, true);
                        finalYPosition = uss.getFinalYPosition(_testElement);
                    }
                ).then(
                    () => {
                        expect(oldFinalYPosition).to.equal(20);
                        expect(finalYPosition).to.equal(10);
                        cy.elementScrollTopShouldBe(_testElement, 10);
                    }
                );
            });        
    });
})

describe("scrollYToBy-StillStart-False", function() {
    let uss;

    it("Vertically scrolls the test element to n1 pixels and then extends that animation by n2 pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(10, _testElement); 
                        expect(uss.getFinalYPosition(_testElement)).to.equal(10);
                        uss.scrollYBy(10, _testElement, resolve, false); 
                        expect(uss.getFinalYPosition(_testElement)).to.equal(20);
                    }
                ).then(
                    () => {
                        cy.elementScrollTopShouldBe(_testElement, 20);
                    }
                );
            });        
    });
})

describe("scrollYToBy-StillStart-False-ExtendedScrollingWhileAnimating", function() {
    let uss;
    let oldFinalYPosition;
    let init = false;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
        if(!init) {
            init = true;
            uss.scrollYBy(10, container, null, false);
            return 1;
        }
        return remaning;
    }

    it("Tests if the scrollXBy method with stillStart=false can extend a scroll-animation from inside a stepLengthCalculator", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setYStepLengthCalculator(_testCalculator, _testElement, false);
                expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculator);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(10, _testElement);
                        oldFinalYPosition = uss.getFinalYPosition(_testElement);
                        
                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        expect(oldFinalYPosition).to.equal(10);
                        cy.elementScrollTopShouldBe(_testElement, 20);
                    }
                );
            });         
    });
})

describe("scrollYBy-containScroll-below-0", function() {
    let uss;
    let finalYPosition;
    it("Vertically scrolls the test element by n pixels obtaining a finalYPosition lower than 0", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollYBy, {
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
                            uss.scrollYBy(-10000, _testElement, resolve, true, true);
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

describe("scrollYBy-containScroll-beyond-maxScrollY", function() {
    let uss;
    let maxScrollY;
    let finalYPosition;
    it("Vertically scrolls the test element by n pixels obtaining a finalYPosition higher than its maxScrollY", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollYBy, {
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
                            uss.scrollYBy(maxScrollY + 100, _testElement, resolve, true, true);
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
