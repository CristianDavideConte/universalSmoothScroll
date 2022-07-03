describe("getXStepLengthCalculator", function() {
    let uss;
    let nonTempTestCalculator = () => 10;
    let tempTestCalculator = r => r / 20 + 1;
    it("Tests the getXStepLengthCalculator method", function() {
      cy.visit("getXStepLengthCalculator-tests.html"); 
      cy.window()
        .then((win) => {
            uss = win.uss;
            const _testElement = win.document.getElementById("scroller");
                                        
            cy.testFailingValues(uss.getXStepLengthCalculator, {
              0: [Cypress.env("failingValuesAll"), 
                  [true, false]
                  ]
            })
            .then(() => {
              uss.setXStepLengthCalculator(nonTempTestCalculator, _testElement, false);
              expect(uss.getXStepLengthCalculator(_testElement)).to.equal(nonTempTestCalculator);  

              uss.setXStepLengthCalculator(tempTestCalculator, _testElement, true);
              expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(tempTestCalculator);
            
              cy.waitForUssCallback(
                (resolve) => {
                  uss.scrollXTo(100, _testElement, resolve);
                }
              ).then(
                () => {
                    expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(nonTempTestCalculator);
                    expect(uss.getXStepLengthCalculator(_testElement, true)).to.be.undefined;
                }
              );
            });
        });        
    });
})