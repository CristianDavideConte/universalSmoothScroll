import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("scrollTo-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("scrollTo", function () {
    it("Horizontally and vertically scrolls the test element to (n1,n2) pixels", function () {
        cy.window()
            .then((win) => {                
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
                                uss.scrollTo(10, 20, _testElement, resolve);
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
});

describe("scrollTo-containScroll-below-0", function () {
    let finalXPosition;
    let finalYPosition;
    it("Scrolls the test element to (n1,n2) pixels where n1 and n2 are lower than 0", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

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

describe("scrollTo-containScroll-beyond-maxScrollX-and-maxScrollY", function () {
    let maxScrollX;
    let maxScrollY;
    let finalXPosition;
    let finalYPosition;
    it("Scrolls the test element to (n1,n2) pixels where n1 and n2 are higher than its maxScrollX and maxScrollY", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

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

describe("scrollTo-immediatelyStoppedScrolling", function () {
    it("Tests the scrollTo method whenever a scroll-animation is immediately stopped", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.scrollTo(10, 20, _testElement);
                uss.stopScrolling(_testElement);
                cy.elementScrollLeftShouldBe(_testElement, 0);
                cy.elementScrollTopShouldBe(_testElement, 0);
            });
    });
});

describe("scrollToBy-immediatelyStoppedScrolling", function () {
    it("Tests the scrollTo method whenever a scroll-animation is immediately stopped and restarted with the scrollBy method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.scrollTo(10, 20, _testElement);
                uss.stopScrolling(_testElement);
                uss.scrollBy(20, 40, _testElement);
                cy.elementScrollLeftShouldBe(_testElement, 20);
                cy.elementScrollTopShouldBe(_testElement, 40);
            });
    });
});

describe("scrollToTo-immediatelyStoppedScrolling", function () {
    it("Tests the scrollTo method whenever a scroll-animation is immediately stopped and restarted with the scrollTo method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.scrollTo(10, 20, _testElement);
                uss.stopScrolling(_testElement);
                uss.scrollTo(20, 40, _testElement);
                cy.elementScrollLeftShouldBe(_testElement, 20);
                cy.elementScrollTopShouldBe(_testElement, 40);
            });
    });
});

describe("scrollTo-StoppedScrollingWhileAnimating", function () {
    let _resolve;
    let init = 0;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
        if (init > 1) {
            uss.stopScrolling(container);
            _resolve();
            return 1;
        }

        init++;
        return remaning / 3 + 1;
    }

    it("Tests the scrollTo method whenever a scroll-animation is stopped inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.setStepLengthCalculator(_testCalculator, _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        expect(_resolve).to.equal(resolve);
                        uss.scrollTo(200, 100, _testElement, resolve);
                    }
                ).then(
                    () => {
                        expect(uss.getScrollXCalculator(_testElement)()).to.be.lessThan(200);
                        expect(uss.getScrollYCalculator(_testElement)()).to.be.lessThan(100);
                    }
                );
            });
    });
});

describe("scrollTo-scrollTo-ReplaceScrollingWhileAnimating", function () {
    let _resolve;
    let init = 0;

    const _testCalculator = (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
        if (init === 1) {
            uss.scrollTo(10, 20, container, _resolve);
            return 1;
        }

        init++;
        return remaning / 3 + 1;
    }

    it("Tests if the scrollTo method can replace the current scroll-animation from inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                uss.setStepLengthCalculator(_testCalculator, _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        expect(_resolve).to.equal(resolve);
                        uss.scrollTo(100, 200, _testElement, resolve);
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