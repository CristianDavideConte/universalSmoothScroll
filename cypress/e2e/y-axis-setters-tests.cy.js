/**
 * This file contains the tests for the following USS API functions:
 *  - setYStepLengthCalculator
 *  - setYStepLength
 */

describe("setYStepLengthCalculator-Body", function() {
    var uss;
    var _testCalculatorValidType1 = () => 10;
    var _testCalculatorValidType2 = () => 5;
    var _testCalculatorValidType3 = () => 0.000001; //Valid but takes more than the default testing timeout
    it("Tests the setYStepLengthCalculator method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();  
                
                cy.testFailingValues(uss.setYStepLengthCalculator, {
                    0: [Cypress.env("failingValuesAll"),
                        [uss.getPageScroller()],
                        [true, false]
                        ],
                    1: [[_testCalculatorValidType1, _testCalculatorValidType2, _testCalculatorValidType3], 
                        Cypress.env("failingValuesAll"),
                        [true, false]
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.getYStepLengthCalculator()).to.be.undefined;
                })
                .then(() => {
                    //test valid stepLengthCalculators
                    uss.setYStepLengthCalculator(_testCalculatorValidType1, uss.getPageScroller(), false, true);
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType1);  

                    uss.setYStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), false, true);
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType2);  

                    uss.setYStepLengthCalculator(_testCalculatorValidType3, uss.getPageScroller(), false, true);
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setYStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2); 

                    uss.stopScrollingY();
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setYStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
                    expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2);
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYTo(100, uss.getPageScroller(), resolve);
                        }
                    ).then(
                        () => {
                            cy.bodyScrollTopShouldToBe(100);
                            expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                        }
                    );
                });
            });     
    });
})

describe("setYStepLength", function() {
    var uss;
    var _testStepInvalidTypeString = "";
    var _testStepInvalidTypeNaN = NaN;
    var _testStepValidType1 = 10;
    var _testStepValidType2 = 5;
    it("Tests the setYStepLength method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                const _initialStepLength = uss.getYStepLength();  
                
                cy.testFailingValues(uss.setYStepLength, {
                    0: [Cypress.env("failingValuesNoPositiveNumberOrUndefined").concat([_testStepInvalidTypeString, _testStepInvalidTypeNaN])],
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.getYStepLength()).to.equal(_initialStepLength);
                })
                .then(() => {
                    //test valid step lengths
                    uss.setYStepLength(_testStepValidType1, uss.getPageScroller());
                    expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType1);  

                    uss.setYStepLength(_testStepValidType2, uss.getPageScroller());
                    expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);  

                    uss.stopScrollingY();
                    expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                    
                    uss.setYStepLength(_testStepInvalidTypeString, uss.getPageScroller());
                    expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYTo(100, uss.getPageScroller(), resolve);
                        }
                    ).then(
                        () => {
                            cy.bodyScrollTopShouldToBe(100);
                            expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                        }
                    );
                });
            });     
    });
})