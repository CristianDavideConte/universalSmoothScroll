const { constants } = require("../support/constants");

describe("setStepLengthCalculator", function() {
    let uss;
    let _testCalculatorValidType1 = () => 10;
    let _testCalculatorValidType2 = () => 5;
    let _testCalculatorValidType3 = () => 0.000001; //Valid but takes more than the default testing timeout
    it("Tests the setStepLengthCalculator method", function() {
        cy.visit("setStepLengthCalculator-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.setStepLengthCalculator, {
                    0: [constants.failingValuesAll,
                        [_testElement],
                        [true, false],
                        ],
                    1: [[_testCalculatorValidType1, _testCalculatorValidType2, _testCalculatorValidType3], 
                        constants.failingValuesAllNoUndefined,
                        [true, false],
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.getXStepLengthCalculator(_testElement, true)).to.be.undefined;
                    expect(uss.getXStepLengthCalculator(_testElement, false)).to.be.undefined;
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.be.undefined;
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.be.undefined;
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.be.undefined;
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.be.undefined;
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
                    
                    uss.setStepLengthCalculator(_testCalculatorValidType2, _testElement, true);
                    expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollTo(200, 100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 200);
                            cy.elementScrollTopShouldBe(_testElement, 100);
                            expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                            expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        }
                    );
            });
        });     
    });
})