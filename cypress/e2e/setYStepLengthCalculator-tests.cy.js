const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("setYStepLengthCalculator-tests.html"); 
})

describe("setYStepLengthCalculator", function() {
    let uss;
    let _testCalculatorValidType1 = () => 10;
    let _testCalculatorValidType2 = () => 5;
    let _testCalculatorValidType3 = () => 0.000001; //Valid but takes more than the default testing timeout
    it("Tests the setYStepLengthCalculator method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _noStepLengthCalculator = undefined;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.setYStepLengthCalculator, {
                    0: [constants.failingValuesAllNoUndefined,
                        [_testElement],
                        [true, false]
                        ],
                    1: [[_testCalculatorValidType1, _testCalculatorValidType2, _testCalculatorValidType3], 
                        constants.failingValuesAllNoUndefined,
                        [true, false]
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.be.undefined;
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.be.undefined;
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.be.undefined;
                })
                .then(() => {
                    //test valid stepLengthCalculators
                    uss.setYStepLengthCalculator(_testCalculatorValidType1, _testElement, false);
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType1);  

                    uss.setYStepLengthCalculator(_testCalculatorValidType2, _testElement, false);
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType2);  

                    uss.setYStepLengthCalculator(_testCalculatorValidType3, _testElement, false);
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setYStepLengthCalculator(_testCalculatorValidType2, _testElement, true);
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2); 

                    uss.stopScrollingY();
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setYStepLengthCalculator(_testCalculatorValidType3, _testElement, false);
                    uss.setYStepLengthCalculator(_testCalculatorValidType2, _testElement, true);
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                    uss.setYStepLengthCalculator(undefined, _testElement, false);
                    uss.setYStepLengthCalculator(undefined, _testElement, true);
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_noStepLengthCalculator);
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_noStepLengthCalculator);

                    uss.setYStepLengthCalculator(_testCalculatorValidType3, _testElement, false);
                    uss.setYStepLengthCalculator(_testCalculatorValidType2, _testElement, true);
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss._reducedMotion = true;
                            uss.scrollYTo(100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                            expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_noStepLengthCalculator);
                        }
                    );
                });
            });     
    });
})