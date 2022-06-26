/**
 * This file contains the tests for the following USS API functions:
 *  - setStepLengthCalculator
 *  - setStepLength
 */

describe("setStepLengthCalculator-Body", function() {
    var uss;
    var _testCalculatorInvalidTypeString = () => "";
    var _testCalculatorInvalidTypeNaN = () => NaN;
    var _testCalculatorValidType1 = () => 10;
    var _testCalculatorValidType2 = () => 5;
    var _testCalculatorValidType3 = () => 0.000001; //Valid but takes more than the default testing timeout
    it("Tests the setStepLengthCalculator method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();  

                cy.testFailingValues(uss.setStepLengthCalculator, {
                    0: [Cypress.env("failingValuesAll").concat([_testCalculatorInvalidTypeString, _testCalculatorInvalidTypeNaN]),
                        [uss.getPageScroller()],
                        [true, false],
                        [true]
                        ],
                    1: [[_testCalculatorValidType1, _testCalculatorValidType2, _testCalculatorValidType3], 
                        Cypress.env("failingValuesAll"),
                        [true, false],
                        [true, false] //shouldBeTested = false is allowed because the second parameter is always invalid
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                  expect(uss.getXStepLengthCalculator()).to.be.undefined;
                  expect(uss.getYStepLengthCalculator()).to.be.undefined;
                })
                .then(() => {
                //test valid stepLengthCalculators
                uss.setStepLengthCalculator(_testCalculatorValidType1, uss.getPageScroller(), false, true);
                expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType1);  
                expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType1);  

                uss.setStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), false, true);
                expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType2);  
                expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType2);  

                uss.setStepLengthCalculator(_testCalculatorValidType3, uss.getPageScroller(), false, true);
                expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                
                uss.setStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
                expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2); 
                expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2); 

                uss.stopScrollingY();
                expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                
                uss.setStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
                expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2);
                expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2);
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(200, 100, uss.getPageScroller(), resolve);
                    },
                    () => {
                        cy.bodyScrollLeftShouldToBe(200);
                        cy.bodyScrollTopShouldToBe(100);
                        expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                        expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
                    }
                );
            });
        });     
    });
})



describe("setStepLength", function() {
    var uss;
    var _testStepInvalidTypeString = "";
    var _testStepInvalidTypeNaN = NaN;
    var _testStepValidType1 = 10;
    var _testStepValidType2 = 5;
    it("Tests the setStepLength method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                const _initialXStepLength = uss.getXStepLength(); 
                const _initialYStepLength = uss.getYStepLength(); 

                cy.testFailingValues(uss.setStepLength, {
                0: [Cypress.env("failingValuesNoPositiveNumber").concat([_testStepInvalidTypeString, _testStepInvalidTypeNaN])],
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.getXStepLength()).to.equal(_initialXStepLength);
                    expect(uss.getYStepLength()).to.equal(_initialYStepLength);
                })
                .then(() => {
                //test valid step lengths
                uss.setStepLength(_testStepValidType1);
                expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType1);  
                expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType1);  

                uss.setStepLength(_testStepValidType2);
                expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2); 
                expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2); 

                uss.stopScrolling();
                expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                
                uss.setStepLength(_testStepInvalidTypeString);
                expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(150, 70, uss.getPageScroller(), resolve);
                    },
                    () => {
                        cy.bodyScrollLeftShouldToBe(150);
                        cy.bodyScrollTopShouldToBe(70);
                        expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                        expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
                    }
                );
            });
        });     
    });
})