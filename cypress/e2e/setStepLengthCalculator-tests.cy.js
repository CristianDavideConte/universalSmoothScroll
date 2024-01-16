import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("setStepLengthCalculator-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("setStepLengthCalculator", function () {
    let _testCalculatorValidType1 = () => 10;
    let _testCalculatorValidType2 = () => 5;
    let _testCalculatorValidType3 = () => 0.000001; //Valid but takes more than the default testing timeout
    it("Tests the setStepLengthCalculator method", function () {
        cy.window()
            .then((win) => {
                const _noStepLengthCalculator = undefined;
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.setStepLengthCalculator, {
                    0: [constants.failingValuesAllNoUnsupportedNoUndefined,
                    [_testElement],
                    [true, false],
                    ],
                    1: [[_testCalculatorValidType1, _testCalculatorValidType2, _testCalculatorValidType3],
                    constants.failingValuesAllNoUnsupportedNoUndefined,
                    [true, false],
                    ]
                },
                    (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                        expect(uss.getXStepLengthCalculator(_testElement, true)).to.be.undefined;
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.be.undefined;
                        expect(uss.getYStepLengthCalculator(_testElement, true)).to.be.undefined;
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.be.undefined;
                        expect(uss.getXStepLengthCalculator(uss.getPageScroller(win), true)).to.be.undefined;
                        expect(uss.getXStepLengthCalculator(uss.getPageScroller(win), false)).to.be.undefined;
                        expect(uss.getYStepLengthCalculator(uss.getPageScroller(win), true)).to.be.undefined;
                        expect(uss.getYStepLengthCalculator(uss.getPageScroller(win), false)).to.be.undefined;
                    })
                    .then(() => {
                        //test valid stepLengthCalculators
                        uss.setStepLengthCalculator(_testCalculatorValidType1, _testElement, false);
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType1);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType1);

                        uss.setStepLengthCalculator(_testCalculatorValidType2, _testElement, false);
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType2);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType2);

                        uss.setStepLengthCalculator(_testCalculatorValidType3, _testElement, false);
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                    
                        uss.setStepLengthCalculator(_testCalculatorValidType2, _testElement, true);
                        expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                        expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);

                        uss.stopScrollingY();
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                    
                        //try to unset one or more stepLengthCalculators
                        uss.setStepLengthCalculator(_testCalculatorValidType3, _testElement, false);
                        uss.setStepLengthCalculator(_testCalculatorValidType2, _testElement, true);
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                        expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                        uss.setStepLengthCalculator(undefined, _testElement, false);
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_noStepLengthCalculator);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_noStepLengthCalculator);
                        expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                        expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);

                        uss.setStepLengthCalculator(_testCalculatorValidType3, _testElement, false);
                        uss.setStepLengthCalculator(_testCalculatorValidType2, _testElement, true);
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                        expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                        uss.setStepLengthCalculator(undefined, _testElement, true);
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_noStepLengthCalculator);
                        expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_noStepLengthCalculator);
                    
                        uss.setStepLengthCalculator(_testCalculatorValidType3, _testElement, false);
                        uss.setStepLengthCalculator(_testCalculatorValidType2, _testElement, true);
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                        expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                        uss.setStepLengthCalculator(undefined, _testElement, true);
                        uss.setStepLengthCalculator(undefined, _testElement, false);
                        expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_noStepLengthCalculator);
                        expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_noStepLengthCalculator);
                        expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_noStepLengthCalculator);
                        expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_noStepLengthCalculator);

                        uss.setStepLengthCalculator(_testCalculatorValidType3, _testElement, false);
                        uss.setStepLengthCalculator(_testCalculatorValidType2, _testElement, true);
                        expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                        expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                    
                        cy.waitForUssCallback(
                            (resolve) => {
                                uss.scrollTo(100, 100, _testElement, resolve);
                            }
                        ).then(
                            () => {
                                expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                                expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                                expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_noStepLengthCalculator);
                                expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_noStepLengthCalculator);
                            }
                        );
                    });
            });
    });
});