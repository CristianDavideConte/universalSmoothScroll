describe("getScrollXDirection", function() {
    let uss;
    let scrollXDirectionLeft, scrollXDirectionRight;
    it("Tests the getScrollXDirection method", function() {
      cy.visit("getScrollXDirection-tests.html"); 
      cy.window()
        .then((win) => {
          uss = win.uss;
          const _testElement = win.document.getElementById("scroller");

          cy.testFailingValues(uss.getScrollXDirection, {
            0: [Cypress.env("failingValuesNoUndefined")]
          })
          .then(() => {
            cy.waitForUssCallback(
              (resolve) => {
                uss.scrollXTo(100, _testElement, () => {
                    uss.scrollXTo(50, _testElement, resolve);
                    expect(uss.getScrollXDirection(_testElement)).to.equal(-1);
                    //scrollXDirectionLeft = uss.getScrollXDirection(_testElement);
                });
                expect(uss.getScrollXDirection(_testElement)).to.equal(1);
                //scrollXDirectionRight = uss.getScrollXDirection(_testElement);
              }
            ).then(
              () => {
                expect(uss.getScrollXCalculator(_testElement)()).to.equal(50);
                //expect(scrollXDirectionRight).to.equal(1);
                //expect(scrollXDirectionLeft).to.equal(-1);
                expect(uss.getScrollXDirection(_testElement)).to.equal(0);
              }
            );
          });
        });         
    });
})