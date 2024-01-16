import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("isXScrolling-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("isXScrolling", function () {
    it("Tests the isXScrolling method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.isXScrolling, {
                    0: [constants.failingValuesNoUndefined]
                },
                    (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                        expect(uss.isXScrolling()).to.be.false;
                    })
                    .then(() => {
                        cy.waitForUssCallback(
                            (resolve) => {
                                expect(uss.isXScrolling(_testElement)).to.be.false;
                                uss.scrollXTo(100, _testElement, resolve);
                                expect(uss.isXScrolling(_testElement)).to.be.true;
                            }
                        ).then(
                            () => {
                                expect(uss.isXScrolling(_testElement)).to.be.false;
                            }
                        );
                    });
            });
    });
});

describe("isXScrolling-StoppedScrollingWhileAnimating", function () {
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            i++;
            if (i < 10) return total / 10;

            uss.stopScrollingX(container);
            expect(uss.isXScrolling(container)).to.be.false;
            _resolve();
            return remaning;
        }
    }
    it("Tests the isXScrolling method whenever a scroll-animation is stopped inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                expect(uss.isXScrolling(_testElement)).to.be.false;
                uss.setXStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        expect(_resolve).to.equal(resolve);
                        expect(uss.isXScrolling(_testElement)).to.be.false;
                        uss.scrollXTo(100, _testElement, resolve);
                        expect(uss.isXScrolling(_testElement)).to.be.true;
                    }
                ).then(
                    () => {
                        expect(uss.isXScrolling(_testElement)).to.be.false;
                    }
                );
            });
    });
});