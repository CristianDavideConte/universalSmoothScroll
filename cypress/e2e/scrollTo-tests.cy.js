const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("scrollTo-tests.html"); 
})

describe("scrollTo", function() {
    let uss;
    it("Horizontally and vertically scrolls the test element to (n1,n2) pixels", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.scrollTo, {
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
                            uss.scrollTo(500, 200, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 500);
                            cy.elementScrollTopShouldBe(_testElement, 200);
                        }
                    );
                });
            });       
    });
})

describe("scrollTo-containScroll-below-0", function() {
    let uss;
    let finalXPosition;
    let finalYPosition;
    it("Scrolls the test element to (n1,n2) pixels where n1 and n2 are lower than 0", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollTo, {
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
                            uss.scrollTo(-100, -100, _testElement, resolve, true);
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

describe("scrollTo-containScroll-beyond-maxScrollX-and-maxScrollY", function() {
    let uss;
    let maxScrollX;
    let maxScrollY;
    let finalXPosition;
    let finalYPosition;
    it("Scrolls the test element to (n1,n2) pixels where n1 and n2 are higher than its maxScrollX and maxScrollY", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollTo, {
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
                            uss.scrollTo(maxScrollX + 100, maxScrollY + 100, _testElement, resolve, true);
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

describe("scrollTo-immediatelyStoppedScrolling", function() {
    let uss;
    it("Tests the scrollTo method whenever a scroll-animation is immediately stopped", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                let count = 0;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        uss.scrollTo(500, 100, _testElement, () => {count += 1});
                        expect(uss.isScrolling(_testElement)).to.be.true;

                        uss.stopScrolling(_testElement);
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        resolve();
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 0); 
                        cy.elementScrollTopShouldBe(_testElement, 0);
                        expect(count).to.equal(0);
                    }
                );
            });        
    });
})

describe("scrollToBy-immediatelyStoppedScrolling", function() {
    let uss;
    let count = 0;
    it("Tests the scrollTo method whenever a scroll-animation is immediately stopped and restarted with the scrollBy method", function() {
        cy.window()
        .then((win) => {
            uss = win.uss;
            const _testElement = win.document.getElementById("scroller");
            
            cy.waitForUssCallback(
                (resolve) => {
                    uss.scrollTo(300, 200, _testElement, () => count++);
                    uss.stopScrolling(_testElement);
                    uss.scrollBy(250, 250, _testElement, () => {
                        count++;
                        resolve();
                    });
                }
            ).then(
                () => {
                    cy.elementScrollLeftShouldBe(_testElement, 250);
                    cy.elementScrollTopShouldBe(_testElement, 250);
                    expect(count).to.equal(1);
                }
            );
        });         
    });
})

describe("scrollToTo-immediatelyStoppedScrolling", function() {
    let uss;
    let count = 0;
    it("Tests the scrollTo method whenever a scroll-animation is immediately stopped and restarted with the scrollTo method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(100, 50, _testElement, () => count++);
                        uss.stopScrolling(_testElement);
                        uss.scrollTo(250, 100, _testElement, () => {
                            count++;
                            resolve();
                        });
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 250);
                        cy.elementScrollTopShouldBe(_testElement, 100);
                        expect(count).to.equal(1);
                    }
                );
            });         
    });
})

describe("scrollTo-StoppedScrollingWhileAnimating", function() {
    let uss;
    let _resolve;
    const _testCalculatorX = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            if(!uss.isScrolling(container)) return total; //testing phase of the setXStepLengthCalculator
            
            i++;
            if(i < 2) return total / 10;
            
            uss.stopScrollingX(container, _resolve);
        }
    }
    const _testCalculatorY = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isScrolling(container)) return total; //testing phase of the setYStepLengthCalculator
            
            i++;
            if(i < 2) return total / 10;
            
            uss.stopScrollingY(container, _resolve);
        }
    }
    it("Tests the scrollTo method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setXStepLengthCalculator(_testCalculatorX(), _testElement, false);   
                uss.setYStepLengthCalculator(_testCalculatorY(), _testElement, false);   

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollTo(200, 100, _testElement);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 20);
                        cy.elementScrollTopShouldBe(_testElement, 10);
                    }
                );
            });         
    });
})

describe("scrollTo-scrollTo-ReplaceScrollingWhileAnimating", function() {
    let uss;
    let _resolve;
    let i = 0;
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentPosition, finalPosition, container) => {
            i++;
            if(i === 2) uss.scrollTo(50, 75, container, _resolve);
            
            return total / 10;
        }
    }
    it("Tests if the scrollTo method can replace the current scroll-animation from inside a stepLengthCalculator", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setStepLengthCalculator(_testCalculator(), _testElement, false);
                    
                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollTo(100, 200, _testElement);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 50);
                        cy.elementScrollTopShouldBe(_testElement, 75);
                    }
                );
            });         
    });
})