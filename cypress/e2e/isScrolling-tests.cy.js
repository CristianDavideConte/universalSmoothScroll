import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("isScrolling-tests.html");
})

describe("isScrolling-scrollXAnimation", function () {
    it("Tests the isScrolling method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.isScrolling, {
                    0: [constants.failingValuesNoUndefined]
                },
                    (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                        expect(uss.isScrolling()).to.be.false;
                    })
                    .then(() => {
                        cy.waitForUssCallback(
                            (resolve) => {
                                expect(uss.isScrolling(_testElement)).to.be.false;
                                uss.scrollXTo(100, _testElement, resolve);
                                expect(uss.isScrolling(_testElement)).to.be.true;
                            }
                        ).then(
                            () => {
                                expect(uss.isScrolling(_testElement)).to.be.false;
                            }
                        );
                    });
            });
    });
});

describe("isScrolling-scrollYAnimation", function () {
    it("Tests the isScrolling method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.isScrolling, {
                    0: [constants.failingValuesNoUndefined]
                },
                    (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                        expect(uss.isScrolling()).to.be.false;
                    })
                    .then(() => {
                        cy.waitForUssCallback(
                            (resolve) => {
                                expect(uss.isScrolling(_testElement)).to.be.false;
                                uss.scrollYTo(100, _testElement, resolve);
                                expect(uss.isScrolling(_testElement)).to.be.true;
                            }
                        ).then(
                            () => {
                                expect(uss.isScrolling(_testElement)).to.be.false;
                            }
                        );
                    });
            });
    });
});

describe("isScrolling-scrollXYAnimation", function () {
    it("Tests the isScrolling method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.isScrolling, {
                    0: [constants.failingValuesNoUndefined]
                },
                    (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                        expect(uss.isScrolling()).to.be.false;
                    })
                    .then(() => {
                        cy.waitForUssCallback(
                            (resolve) => {
                                expect(uss.isScrolling(_testElement)).to.be.false;
                                uss.scrollTo(100, 200, _testElement, resolve);
                                expect(uss.isScrolling(_testElement)).to.be.true;
                            }
                        ).then(
                            () => {
                                expect(uss.isScrolling(_testElement)).to.be.false;
                            }
                        );
                    });
            });
    });
});

describe("isScrolling-StoppedScrollingWhileAnimating-scrollXAnimation", function () {
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if (i < 10) return total / 10;

            uss.stopScrolling(container);
            expect(uss.isScrolling(container)).to.be.false;
            _resolve();
            return remaning;
        }
    }
    it("Tests the isScrolling method whenever a scroll-animation is stopped inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                expect(uss.isScrolling(_testElement)).to.be.false;
                uss.setStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        expect(_resolve).to.equal(resolve);
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        uss.scrollXTo(100, _testElement, resolve);
                        expect(uss.isScrolling(_testElement)).to.be.true;
                    }
                ).then(
                    () => {
                        expect(uss.isScrolling(_testElement)).to.be.false;
                    }
                );
            });
    });
});

describe("isScrolling-StoppedScrollingWhileAnimating-scrollYAnimation", function () {
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if (i < 10) return total / 10;

            uss.stopScrolling(container);
            expect(uss.isScrolling(container)).to.be.false;
            _resolve();
            return remaning;
        }
    }
    it("Tests the isScrolling method whenever a scroll-animation is stopped inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                expect(uss.isScrolling(_testElement)).to.be.false;
                uss.setStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        expect(_resolve).to.equal(resolve);
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        uss.scrollYTo(100, _testElement, resolve);
                        expect(uss.isScrolling(_testElement)).to.be.true;
                    }
                ).then(
                    () => {
                        expect(uss.isScrolling(_testElement)).to.be.false;
                    }
                );
            });
    });
});

describe("isScrolling-StopXAxisScrollingWhileAnimating", function () {
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if (i < 10) return total / 10;

            uss.stopScrollingX(container);
            _resolve();
            return remaning;
        }
    }
    it("Tests the isScrolling method whenever the scroll-animation on the x-axis is stopped inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                expect(uss.isScrolling(_testElement)).to.be.false;
                uss.setStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        expect(_resolve).to.equal(resolve);
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        uss.scrollTo(100, 200, _testElement, resolve);
                        expect(uss.isScrolling(_testElement)).to.be.true;
                    }
                ).then(
                    () => {
                        expect(uss.isXScrolling(_testElement)).to.be.false;
                    }
                );
            });
    });
});

describe("isScrolling-StopYAxisScrollingWhileAnimating", function () {
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if (i < 10) return total / 10;

            uss.stopScrollingY(container);
            _resolve();
            return remaning;
        }
    }
    it("Tests the isScrolling method whenever the scroll-animation on the y-axis is stopped inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                expect(uss.isScrolling(_testElement)).to.be.false;
                uss.setStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        expect(_resolve).to.equal(resolve);
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        uss.scrollTo(100, 200, _testElement, resolve);
                        expect(uss.isScrolling(_testElement)).to.be.true;
                    }
                ).then(
                    () => {
                        expect(uss.isYScrolling(_testElement)).to.be.false;
                    }
                );
            });
    });
});

describe("isScrolling-StopBothAxisScrollingWhileAnimating", function () {
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if (i < 10) return total / 10;

            uss.stopScrolling(container);
            expect(uss.isScrolling(container)).to.be.false;
            _resolve();
            return remaning;
        }
    }
    it("Tests the isScrolling method whenever the scroll-animations on both the x-axis and the y-axis are stopped from inside a stepLengthCalculator", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                expect(uss.isScrolling(_testElement)).to.be.false;
                uss.setStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        expect(_resolve).to.equal(resolve);
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        uss.scrollTo(100, 200, _testElement, resolve);
                        expect(uss.isScrolling(_testElement)).to.be.true;
                    }
                ).then(
                    () => {
                        expect(uss.isScrolling(_testElement)).to.be.false;
                    }
                );
            });
    });
});