const { constants } = require("../support/constants");

beforeEach(() => {
    //Whenever the page is scaled (perhaps there isn't enough space to respect the default 1000x660 viewport),
    //the number pixels scrolled is inconsistent/may vary.
    //Cypress doesn't correctly report the window.innerWidth/window.innerHeight whenever the page is scaled, 
    //so there's no way to adjust the tests.
    //This is a quick fix: shrink the viewport down so that is unlikely that the page is ever scaled.
    //This trick doens't affect the test results.
    cy.viewport(100, 200); 
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
    let oldFinalXPosition, oldFinalYPosition;
    let finalXPosition, finalYPosition;

    it("Horizontally and vertically scrolls the test element to n1 pixels and then replace that animation with a n2 pixels scroll", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                uss.scrollTo(20, 40, _testElement); 
                oldFinalXPosition = uss.getFinalXPosition(_testElement);
                oldFinalYPosition = uss.getFinalYPosition(_testElement);

                uss.scrollBy(10, 20, _testElement, null, true);
                finalXPosition = uss.getFinalXPosition(_testElement);
                finalYPosition = uss.getFinalYPosition(_testElement);

                cy.waitForUssCallback(
                    (resolve) => {
                        expect(oldFinalXPosition).to.equal(20);
                        expect(oldFinalYPosition).to.equal(40);
                        expect(finalXPosition).to.equal(10);
                        expect(finalYPosition).to.equal(20);

                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 10);
                        cy.elementScrollTopShouldBe(_testElement, 20);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False", function() {
    let uss;
    let oldFinalXPosition, oldFinalYPosition;
    let finalXPosition, finalYPosition;
    
    it("Horizontally and vertically scrolls the test element to (n1a,n1b) pixels and then extends that animation by (n2a,n2b) pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(20, 40, _testElement); 
                        oldFinalXPosition = uss.getFinalXPosition(_testElement);
                        oldFinalYPosition = uss.getFinalYPosition(_testElement);

                        uss.scrollBy(10, 20, _testElement, null, false);
                        finalXPosition = uss.getFinalXPosition(_testElement);
                        finalYPosition = uss.getFinalYPosition(_testElement);

                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 30);
                        cy.elementScrollTopShouldBe(_testElement, 60);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False-ExtendedScrollingWhileAnimating", function() {
    let uss;
    let oldFinalXPosition;
    let oldFinalYPosition;
    let init = false;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentPosition, finalPosition, container) => {
        if(!init) {
            init = true;
            uss.scrollBy(10, 20, container, null, false);
            return 1;
        }
        return total;
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
                        oldFinalXPosition = uss.getFinalXPosition(_testElement);
                        oldFinalYPosition = uss.getFinalYPosition(_testElement);

                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        expect(oldFinalXPosition).to.equal(10);
                        expect(oldFinalYPosition).to.equal(20);
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