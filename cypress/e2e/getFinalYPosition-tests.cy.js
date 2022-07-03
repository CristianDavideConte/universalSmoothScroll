describe("getFinalYPosition", function() {
    let uss;
    let finalYPosition;
    it("Tests the getFinalYPosition method", function() {
      cy.visit("getFinalYPosition-tests.html");
      cy.window()
        .then((win) => {
          uss = win.uss;
          const _testElement = win.document.getElementById("scroller");
                      
          cy.testFailingValues(uss.getFinalYPosition, {
            0: [Cypress.env("failingValuesNoUndefined")]
          })
          .then(() => {
            cy.waitForUssCallback(
              (resolve) => {
                uss.scrollYTo(100, _testElement, resolve);
                finalYPosition = uss.getFinalYPosition(_testElement);
              }
            ).then(
              () => {
                cy.elementScrollTopShouldBe(_testElement, 100);
                expect(finalYPosition).to.equal(100);
                expect(finalYPosition).to.equal(uss.getFinalYPosition(_testElement));
                expect(finalYPosition).to.equal(uss.getScrollYCalculator(_testElement)());
              }
            );
          });
        });        
    });
})
