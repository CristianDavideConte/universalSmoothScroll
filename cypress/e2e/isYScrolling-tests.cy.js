import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("isYScrolling-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("isYScrolling", function () {
    it("Tests the isYScrolling method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.isYScrolling, {
                    0: [constants.failingValuesNoUndefined]
                },
                    (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                        expect(uss.isYScrolling()).to.be.false;
                    })
                    .then(() => {
                        cy.waitForUssCallback(
                            (resolve) => {
                                expect(uss.isYScrolling(_testElement)).to.be.false;
                                uss.scrollYTo(100, _testElement, resolve);
                                expect(uss.isYScrolling(_testElement)).to.be.true;
                            }
                        ).then(
                            () => {
                                expect(uss.isYScrolling(_testElement)).to.be.false;
                            }
                        );
                    });
            });
    });
});

describe("isYScrolling-StoppedScrollingWhileAnimating", function () {
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if (i < 10) return total / 10;

            uss.stopScrollingY(container);
            expect(uss.isYScrolling(container)).to.be.false;
            _resolve();
            return remaning;
        }
    }
    it("Tests the isYScrolling method whenever a scroll-animation is stopped inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                expect(uss.isYScrolling(_testElement)).to.be.false;
                uss.setYStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        expect(_resolve).to.equal(resolve);
                        expect(uss.isYScrolling(_testElement)).to.be.false;
                        uss.scrollYTo(100, _testElement, resolve);
                        expect(uss.isYScrolling(_testElement)).to.be.true;
                    }
                ).then(
                    () => {
                        expect(uss.isYScrolling(_testElement)).to.be.false;
                    }
                );
            });
    });
});