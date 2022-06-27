/**
 * This file contains the tests for the following USS API functions:
 *  - setXStepLengthCalculator
 *  - setXStepLength
 */

describe("setXStepLengthCalculator-Body", function() {
    var uss;
    var _testCalculatorValidType1 = () => 10;
    var _testCalculatorValidType2 = () => 5;
    var _testCalculatorValidType3 = () => 0.000001; //Valid but takes more than the default testing timeout
    it("Tests the setXStepLengthCalculator method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();  

                cy.testFailingValues(uss.setXStepLengthCalculator, {
                    0: [Cypress.env("failingValuesAll"),
                        [uss.getPageScroller()],
                        [true, false]
                        ],
                    1: [[_testCalculatorValidType1, _testCalculatorValidType2, _testCalculatorValidType3], 
                        Cypress.env("failingValuesAll"),
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.be.undefined;
                })
                .then(() => {
                    //test valid stepLengthCalculators
                    uss.setXStepLengthCalculator(_testCalculatorValidType1, uss.getPageScroller(), false, true);
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType1);  

                    uss.setXStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), false, true);
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType2);  

                    uss.setXStepLengthCalculator(_testCalculatorValidType3, uss.getPageScroller(), false, true);
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setXStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2); 

                    uss.stopScrollingY();
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setXStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
                    expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2);
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollXTo(100, uss.getPageScroller(), resolve);
                        }
                    ).then(
                        () => {
                            cy.bodyScrollLeftShouldToBe(100);
                            expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                        }
                    );
                });
            });     
    });
})

describe("setXStepLength", function() {
    var uss;
    var _testStepInvalidTypeString = "";
    var _testStepInvalidTypeNaN = NaN;
    var _testStepValidType1 = 10;
    var _testStepValidType2 = 5;
    it("Tests the setXStepLength method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                const _initialStepLength = uss.getXStepLength(); 

                cy.testFailingValues(uss.setXStepLength, {
                    0: [Cypress.env("failingValuesNoPositiveNumber").concat([_testStepInvalidTypeString, _testStepInvalidTypeNaN])],
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(uss.getXStepLength()).to.equal(_initialStepLength);
                })
                .then(() => {
                    //test valid step lengths
                    uss.setXStepLength(_testStepValidType1, uss.getPageScroller());
                    expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType1);  

                    uss.setXStepLength(_testStepValidType2, uss.getPageScroller());
                    expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2); 

                    uss.stopScrollingY();
                    expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                    
                    uss.setXStepLength(_testStepInvalidTypeString, uss.getPageScroller());
                    expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollXTo(100, uss.getPageScroller(), resolve);
                        }
                    ).then(
                        () => {
                            cy.bodyScrollLeftShouldToBe(100);
                            expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                        }
                    );
                });
            });     
    });
})
