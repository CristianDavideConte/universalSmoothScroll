describe("getFinalXPosition", function() {
    let uss;
    let finalXPosition;
    it("Tests the getFinalXPosition method", function() {
      cy.visit("getFinalXPosition-tests.html");
      cy.window()
        .then((win) => {
          uss = win.uss;
          const _testElement = win.document.getElementById("scroller");
                      
          cy.testFailingValues(uss.getFinalXPosition, {
            0: [Cypress.env("failingValuesNoUndefined")]
          })
          .then(() => {
            cy.waitForUssCallback(
              (resolve) => {
                uss.scrollXTo(100, _testElement, resolve);
                finalXPosition = uss.getFinalXPosition(_testElement);
              }
            ).then(
              () => {
                cy.elementScrollLeftShouldBe(_testElement, 100);
                expect(finalXPosition).to.equal(100);
                expect(finalXPosition).to.equal(uss.getFinalXPosition(_testElement));
                expect(finalXPosition).to.equal(uss.getScrollXCalculator(_testElement)());
              }
            );
          });
        });        
    });
})
