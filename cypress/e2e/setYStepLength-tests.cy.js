describe("setYStepLength", function() {
    let uss;
    let _testStepInvalidTypeString = "";
    let _testStepInvalidTypeNaN = NaN;
    let _testStepValidType1 = 10;
    let _testStepValidType2 = 5;
    it("Tests the setYStepLength method", function() {
        cy.visit("setYStepLength-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                const _initialStepLength = uss.getYStepLength(); 

                cy.testFailingValues(uss.setYStepLength, {
                    0: [Cypress.env("failingValuesNoPositiveNumberOrUndefined").concat([_testStepInvalidTypeString, _testStepInvalidTypeNaN])],
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.getYStepLength()).to.equal(_initialStepLength);
                })
                .then(() => {
                    //Test valid step lengths
                    uss.setYStepLength(_testStepValidType1);
                    expect(uss.getYStepLength()).to.equal(_testStepValidType1);  

                    uss.setYStepLength(_testStepValidType2);
                    expect(uss.getYStepLength()).to.equal(_testStepValidType2); 

                    uss.stopScrollingY();
                    expect(uss.getYStepLength()).to.equal(_testStepValidType2);
                    
                    uss.setYStepLength(_testStepInvalidTypeString);
                    expect(uss.getYStepLength()).to.equal(_testStepValidType2);
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYTo(100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollTopShouldBe(_testElement, 100);
                            expect(uss.getYStepLength()).to.equal(_testStepValidType2);
                        }
                    );
                });
            });     
    });
})
