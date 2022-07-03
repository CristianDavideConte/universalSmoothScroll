describe("getScrollYDirection", function() {
    let uss;
    let scrollYDirectionTop, scrollYDirectionBottom;
    it("Tests the getScrollYDirection method", function() {
      cy.visit("getScrollYDirection-tests.html"); 
      cy.window()
        .then((win) => {
          uss = win.uss;
          const _testElement = win.document.getElementById("scroller");

          cy.testFailingValues(uss.getScrollYDirection, {
            0: [Cypress.env("failingValuesNoUndefined")]
          })
          .then(() => {
            cy.waitForUssCallback(
              (resolve) => {
                uss.scrollYTo(100, _testElement, () => {
                    uss.scrollYTo(50, _testElement, resolve);
                    scrollYDirectionTop = uss.getScrollYDirection(_testElement);
                });
                scrollYDirectionBottom = uss.getScrollYDirection(_testElement);
              }
            ).then(
              () => {
                expect(uss.getScrollYCalculator(_testElement)()).to.equal(50);
                expect(scrollYDirectionBottom).to.equal(1);
                expect(scrollYDirectionTop).to.equal(-1);
                expect(uss.getScrollYDirection(_testElement)).to.equal(0);
              }
            );
          });
        });         
    });
})