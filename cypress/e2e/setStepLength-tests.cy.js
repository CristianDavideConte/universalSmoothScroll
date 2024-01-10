import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("setStepLength-tests.html");
})

describe("setStepLength", function () {
    let _testStepInvalidTypeString = "";
    let _testStepInvalidTypeNaN = NaN;
    let _testStepValidType1 = 10;
    let _testStepValidType2 = 5;
    it("Tests the setStepLength method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");

                const _initialXStepLength = uss.getXStepLength();
                const _initialYStepLength = uss.getYStepLength();

                cy.testFailingValues(uss.setStepLength, {
                    0: [constants.failingValuesNoPositiveNumber.concat([_testStepInvalidTypeString, _testStepInvalidTypeNaN])],
                },
                    (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                        expect(uss.getXStepLength()).to.equal(_initialXStepLength);
                        expect(uss.getYStepLength()).to.equal(_initialYStepLength);
                    })
                    .then(() => {
                        //Test valid step lengths
                        uss.setStepLength(_testStepValidType1);
                        expect(uss.getXStepLength()).to.equal(_testStepValidType1);
                        expect(uss.getYStepLength()).to.equal(_testStepValidType1);

                        uss.setStepLength(_testStepValidType2);
                        expect(uss.getXStepLength()).to.equal(_testStepValidType2);
                        expect(uss.getYStepLength()).to.equal(_testStepValidType2);

                        uss.stopScrolling();
                        expect(uss.getXStepLength()).to.equal(_testStepValidType2);
                        expect(uss.getYStepLength()).to.equal(_testStepValidType2);

                        try {
                            uss.setStepLength(_testStepInvalidTypeString);
                        } catch (e) {
                            expect(uss.getXStepLength()).to.equal(_testStepValidType2);
                            expect(uss.getYStepLength()).to.equal(_testStepValidType2);
                        }

                        cy.waitForUssCallback(
                            (resolve) => {
                                uss._reducedMotion = true;
                                uss.scrollTo(150, 70, _testElement, resolve);
                            }
                        ).then(
                            () => {
                                cy.elementScrollLeftShouldBe(_testElement, 150);
                                cy.elementScrollTopShouldBe(_testElement, 70);
                                expect(uss.getXStepLength()).to.equal(_testStepValidType2);
                                expect(uss.getYStepLength()).to.equal(_testStepValidType2);
                            }
                        );
                    });
            });
    });
});