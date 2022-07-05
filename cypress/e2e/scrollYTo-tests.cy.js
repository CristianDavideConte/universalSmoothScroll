const { constants } = require("../support/constants");

describe("scrollYTo", function() {
    let uss;
    it("Vertically scrolls the test element to n pixels", function() {
        cy.visit("scrollYTo-tests.html"); 
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
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYTo(500, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollTopShouldBe(_testElement, 500);
                        }
                    );
                });
            });        
    });
})

describe("scrollYTo-immediatelyStoppedScrolling", function() {
    let uss;
    let count = 0;
    it("Tests the scrollYTo method whenever a scroll-animation is immediately stopped", function() {
        cy.visit("scrollYTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(500, _testElement, () => count++);
                        uss.stopScrollingY(_testElement);
                        resolve();
                    }
                ).then(
                    () => {
                        cy.elementScrollTopShouldBe(_testElement, 0);
                        expect(count).to.equal(0);
                    }
                );
            });         
    });
})

describe("scrollYToBy-immediatelyStoppedScrolling", function() {
    let uss;
    let count = 0;
    it("Tests the scrollYTo method whenever a scroll-animation is immediately stopped and restarted with the scrollYBy method", function() {
        cy.visit("scrollYTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(500, _testElement, () => count++);
                        uss.stopScrollingY(_testElement);
                        uss.scrollYBy(250, _testElement, () => {
                            count++;
                            resolve();
                        });
                    }
                ).then(
                    () => {
                        cy.elementScrollTopShouldBe(_testElement, 250);
                        expect(count).to.equal(1);
                    }
                );
            });         
    });
})

describe("scrollYToTo-immediatelyStoppedScrolling", function() {
    let uss;
    let count = 0;
    it("Tests the scrollYTo method whenever a scroll-animation is immediately stopped and restarted with the scrollYTo method", function() {
        cy.visit("scrollYTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(500, _testElement, () => count++);
                        uss.stopScrollingY(_testElement);
                        uss.scrollYTo(250, _testElement, () => {
                            count++;
                            resolve();
                        });
                    }
                ).then(
                    () => {
                        cy.elementScrollTopShouldBe(_testElement, 250);
                        expect(count).to.equal(1);
                    }
                );
            });         
    });
})

describe("scrollYTo-StoppedScrollingWhileAnimating", function() {
    let uss;
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isYScrolling(container)) return total; //testing phase of the setYStepLengthCalculator
            
            i++;
            if(i < 2) return total / 10;

            uss.stopScrollingY(container, _resolve);
        }
    }
    it("Tests the scrollYTo method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("scrollYTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setYStepLengthCalculator(_testCalculator(), _testElement, false); 

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollYTo(100, _testElement, resolve);
                    }
                ).then(
                    () => {
                        cy.elementScrollTopShouldBe(_testElement, 10);
                    }
                );
            });         
    });
})

describe("scrollYTo-scrollYTo-ReplaceScrollingWhileAnimating", function() {
    let uss;
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if(i === 2) {
                uss.scrollYTo(50, container, _resolve);
                return remaning;
            }
            return total / 10;
        }
    }
    it("Tests if the scrollYTo method can replace the current scroll-animation from inside a stepLengthCalculator", function() {
        cy.visit("scrollYTo-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setYStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollYTo(100, _testElement);
                    }
                ).then(
                    () => {
                        cy.elementScrollTopShouldBe(_testElement, 50);
                    }
                );
            });         
    });
})