describe("setYStepLengthCalculator-Body", function() {
    let uss;
    let _testCalculatorValidType1 = () => 10;
    let _testCalculatorValidType2 = () => 5;
    let _testCalculatorValidType3 = () => 0.000001; //Valid but takes more than the default testing timeout
    it("Tests the setYStepLengthCalculator method", function() {
        cy.visit("setYStepLengthCalculator-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.setYStepLengthCalculator, {
                    0: [Cypress.env("failingValuesAll"),
                        [_testElement],
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
                    uss.setYStepLengthCalculator(_testCalculatorValidType1, _testElement, false, true);
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType1);  

                    uss.setYStepLengthCalculator(_testCalculatorValidType2, _testElement, false, true);
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType2);  

                    uss.setYStepLengthCalculator(_testCalculatorValidType3, _testElement, false, true);
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setYStepLengthCalculator(_testCalculatorValidType2, _testElement, true, true);
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2); 

                    uss.stopScrollingY();
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                    
                    uss.setYStepLengthCalculator(_testCalculatorValidType2, _testElement, true, true);
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(_testCalculatorValidType2);
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYTo(100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollTopShouldBe(_testElement, 100);
                            expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(_testCalculatorValidType3);
                        }
                    );
                });
            });     
    });
})