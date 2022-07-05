const { constants } = require("../support/constants");

describe("getYStepLengthCalculator", function() {
    let uss;
    let nonTempTestCalculator = () => 10;
    let tempTestCalculator = r => r / 20 + 1;
    it("Tests the getYStepLengthCalculator method", function() {
      cy.visit("getYStepLengthCalculator-tests.html"); 
      cy.window()
        .then((win) => {
            uss = win.uss;
            const _testElement = win.document.getElementById("scroller");
                                        
            cy.testFailingValues(uss.getYStepLengthCalculator, {
              0: [constants.failingValuesAll, 
                  [true, false]
                  ]
            })
            .then(() => {
              uss.setYStepLengthCalculator(nonTempTestCalculator, _testElement, false);
              expect(uss.getYStepLengthCalculator(_testElement)).to.equal(nonTempTestCalculator);  

              uss.setYStepLengthCalculator(tempTestCalculator, _testElement, true);
              expect(uss.getYStepLengthCalculator(_testElement, true)).to.equal(tempTestCalculator);
            
              cy.waitForUssCallback(
                (resolve) => {
                  uss.scrollYTo(100, _testElement, resolve);
                }
              ).then(
                () => {
                    expect(uss.getYStepLengthCalculator(_testElement, false)).to.equal(nonTempTestCalculator);
                    expect(uss.getYStepLengthCalculator(_testElement, true)).to.be.undefined;
                }
              );
            });
        });        
    });
})