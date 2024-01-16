import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("scrollXTo-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("scrollXTo", function () {
    it("Horizontally scrolls the test element to n pixels", function () {
        cy.window()
            .then((win) => {                
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
                                uss.scrollXTo(10, _testElement, resolve);
                            }
                        ).then(
                            () => {
                                cy.elementScrollLeftShouldBe(_testElement, 10);
                            }
                        );
                    });
            });
    });
});

describe("scrollXTo-containScroll-below-0", function () {
    let finalXPosition;
    it("Horizontally scrolls the test element to n pixels where n is lower than 0", function () {
        cy.window()
            .then((win) => {
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
                                uss.scrollXTo(-100, _testElement, resolve, true);
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
});

describe("scrollXTo-containScroll-beyond-maxScrollX", function () {
    let maxScrollX;
    let finalXPosition;
    it("Horizontally scrolls the test element to n pixels where n is higher than its maxScrollX", function () {
        cy.window()
            .then((win) => {
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
                                maxScrollX = uss.getMaxScrollX(_testElement);
                                uss.scrollXTo(maxScrollX + 100, _testElement, resolve, true);
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
});

describe("scrollXTo-immediatelyStoppedScrolling", function () {
    it("Tests the scrollXTo method whenever a scroll-animation is immediately stopped", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.scrollXTo(10, _testElement);
                uss.stopScrollingX(_testElement);
                cy.elementScrollLeftShouldBe(_testElement, 0);
            });
    });
});

describe("scrollXToBy-immediatelyStoppedScrolling", function () {
    it("Tests the scrollXTo method whenever a scroll-animation is immediately stopped and restarted with the scrollXBy method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.scrollXTo(10, _testElement);
                uss.stopScrollingX(_testElement);
                uss.scrollXBy(20, _testElement);
                cy.elementScrollLeftShouldBe(_testElement, 20);
            });
    });
});

describe("scrollXToTo-immediatelyStoppedScrolling", function () {
    it("Tests the scrollXTo method whenever a scroll-animation is immediately stopped and restarted with the scrollXTo method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.scrollXTo(10, _testElement);
                uss.stopScrollingX(_testElement);
                uss.scrollXTo(20, _testElement);
                cy.elementScrollLeftShouldBe(_testElement, 20);
            });
    });
})

describe("scrollXTo-StoppedScrollingWhileAnimating", function () {
    let init = 0;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
        if (init > 1) {
            uss.stopScrollingX(container);
            return 1;
        }

        init++;
        return remaning / 3 + 1;
    }

    it("Tests the scrollXTo method whenever a scroll-animation is stopped inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.setXStepLengthCalculator(_testCalculator, _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(200, _testElement, resolve);

                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        expect(uss.getScrollXCalculator(_testElement)()).to.be.lessThan(200);
                    }
                );
            });
    });
});

describe("scrollXTo-scrollXTo-ReplaceScrollingWhileAnimating", function () {
    let init = 0;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
        if (init === 1) {
            uss.scrollXTo(10, container);
            return 1;
        }

        init++;
        return remaning / 3 + 1;
    }

    it("Tests if the scrollXTo method can replace the current scroll-animation from inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.setXStepLengthCalculator(_testCalculator, _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(100, _testElement, resolve);

                        win.setTimeout(resolve, constants.defaultTimeout);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 10);
                    }
                );
            });
    });
});