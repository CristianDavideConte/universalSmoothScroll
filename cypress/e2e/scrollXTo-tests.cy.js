const { constants } = require("../support/constants");

describe("scrollXTo", function() {
    let uss;
    it("Horizontally scrolls the test element to n pixels", function() {
        cy.visit("scrollXTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollXTo, {
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
                            uss.scrollXTo(500, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 500);
                        }
                    );
                });
            });        
    });
})

describe("scrollXTo-immediatelyStoppedScrolling", function() {
    let uss;
    let count = 0;
    it("Tests the scrollXTo method whenever a scroll-animation is immediately stopped", function() {
        cy.visit("scrollXTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(500, _testElement, () => count++);
                        uss.stopScrollingX(_testElement);
                        resolve();
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 0);
                        expect(count).to.equal(0);
                    }
                );
            });         
    });
})

describe("scrollXToBy-immediatelyStoppedScrolling", function() {
    let uss;
    let count = 0;
    it("Tests the scrollXTo method whenever a scroll-animation is immediately stopped and restarted with the scrollXBy method", function() {
        cy.visit("scrollXTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(500, _testElement, () => count++);
                        uss.stopScrollingX(_testElement);
                        uss.scrollXBy(250, _testElement, () => {
                            count++;
                            resolve();
                        });
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 250);
                        expect(count).to.equal(1);
                    }
                );
            });         
    });
})

describe("scrollXToTo-immediatelyStoppedScrolling", function() {
    let uss;
    let count = 0;
    it("Tests the scrollXTo method whenever a scroll-animation is immediately stopped and restarted with the scrollXTo method", function() {
        cy.visit("scrollXTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(500, _testElement, () => count++);
                        uss.stopScrollingX(_testElement);
                        uss.scrollXTo(250, _testElement, () => {
                            count++;
                            resolve();
                        });
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 250);
                        expect(count).to.equal(1);
                    }
                );
            });         
    });
})

describe("scrollXTo-StoppedScrollingWhileAnimating", function() {
    let uss;
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            if(!uss.isXScrolling(container)) return total; //testing phase of the setXStepLengthCalculator
            
            i++;
            if(i < 2) return total / 10;

            uss.stopScrollingX(container, _resolve);
        }
    }
    it("Tests the scrollXTo method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("scrollXTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setXStepLengthCalculator(_testCalculator(), _testElement, false); 

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollXTo(100, _testElement, resolve);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 10);
                    }
                );
            });         
    });
})

describe("scrollXTo-scrollXTo-ReplaceScrollingWhileAnimating", function() {
    let uss;
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if(i === 2) {
                uss.scrollXTo(50, container, _resolve);
                return remaning;
            }
            return total / 10;
        }
    }
    it("Tests if the scrollXTo method can replace the current scroll-animation from inside a stepLengthCalculator", function() {
        cy.visit("scrollXTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setXStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollXTo(100, _testElement);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 50);
                    }
                );
            });         
    });
})