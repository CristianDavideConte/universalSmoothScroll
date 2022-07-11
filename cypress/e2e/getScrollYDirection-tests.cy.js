const { constants } = require("../support/constants");

describe("getScrollYDirection", function() {
    let uss;
    it("Tests the getScrollYDirection method", function() {
      cy.visit("getScrollYDirection-tests.html"); 
      cy.window()
        .then((win) => {
          uss = win.uss;
          const _testElement = win.document.getElementById("scroller");

          cy.testFailingValues(uss.getScrollYDirection, {
            0: [constants.failingValuesNoUndefined]
          }, 
          (res, v1, v2, v3, v4, v5, v6, v7) => {
            expect(res).to.throw(constants.defaultUssException);
          })
          .then(() => {
            cy.waitForUssCallback(
              (resolve) => {
                expect(uss.getScrollYDirection(_testElement)).to.equal(0);
                uss.scrollYTo(100, _testElement, () => {
                    uss.scrollYTo(50, _testElement, resolve);
                    expect(uss.getScrollYDirection(_testElement)).to.equal(-1);
                });
                expect(uss.getScrollYDirection(_testElement)).to.equal(1);
              }
            ).then(
              () => {
                expect(uss.getScrollYCalculator(_testElement)()).to.equal(50);
                expect(uss.getScrollYDirection(_testElement)).to.equal(0);
              }
            );
          });
        });         
    });
})