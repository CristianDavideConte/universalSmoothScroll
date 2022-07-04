describe("setXStepLengthCalculator", function() {
    let uss;
    let _testCalculatorValidType1 = () => 10;
    let _testCalculatorValidType2 = () => 5;
    let _testCalculatorValidType3 = () => 0.000001; //Valid but takes more than the default testing timeout
    it("Tests the setXStepLengthCalculator method", function() {
        cy.visit("setXStepLengthCalculator-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.setXStepLengthCalculator, {
                    0: [Cypress.env("failingValuesAll"),
                        [_testElement],
                        [true, false]
                        ],
                    1: [[_testCalculatorValidType1, _testCalculatorValidType2, _testCalculatorValidType3], 
                        Cypress.env("failingValuesAll"),
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.getXStepLengthCalculator(_testElement, true)).to.be.undefined;
                    expect(uss.getXStepLengthCalculator(_testElement, false)).to.be.undefined;
                })
                .then(() => {
                    //test valid stepLengthCalculators
                    uss.setXStepLengthCalculator(_testCalculatorValidType1, _testElement, false, true);
                    expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType1);  

                    uss.setXStepLengthCalculator(_testCalculatorValidType2, _testElement, false, true);
                    expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType2);  

                    uss.setXStepLengthCalculator(_testCalculatorValidType3, _testElement, false, true);
                    expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setXStepLengthCalculator(_testCalculatorValidType2, _testElement, true, true);
                    expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2); 

                    uss.stopScrollingY();
                    expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setXStepLengthCalculator(_testCalculatorValidType2, _testElement, true, true);
                    expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollXTo(100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 100);
                            expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        }
                    );
                });
            });     
    });
})