const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getFinalYPosition-tests.html");
})

describe("getFinalYPosition", function() {
    let uss;
    let finalYPosition;
    it("Tests the getFinalYPosition method", function() {
      cy.window()
        .then((win) => {
          uss = win.uss;
          const _testElement = win.document.getElementById("scroller");
          const _expectedFinalPos = 10;                       

          cy.testFailingValues(uss.getFinalYPosition, {
            0: [constants.failingValuesNoUndefined]
          }, 
          (res, v1, v2, v3, v4, v5, v6, v7) => {
            expect(res).to.throw(constants.defaultUssException);
          })
          .then(() => {
            cy.waitForUssCallback(
              (resolve) => {
                uss.scrollYTo(_expectedFinalPos, _testElement, resolve);
                finalYPosition = uss.getFinalYPosition(_testElement);
              }
            ).then(
              () => {
                cy.elementScrollTopShouldBe(_testElement, _expectedFinalPos);
                expect(finalYPosition).to.equal(_expectedFinalPos);
                expect(finalYPosition).to.equal(uss.getFinalYPosition(_testElement));
                expect(finalYPosition).to.equal(uss.getScrollYCalculator(_testElement)());
              }
            );
          });
        });        
    });
})

describe("getFinalYPosition-beyond-maxScrollY", function() {
  let uss;
  let maxScrollY;
  let finalYPosition;
  it("Tests the getFinalYPosition method whenever the containScroll parameter is used to limit to maxScrollY", function() {
    cy.window()
      .then((win) => {
        uss = win.uss;
        const _testElement = win.document.getElementById("scroller");
                    
        cy.testFailingValues(uss.getFinalYPosition, {
          0: [constants.failingValuesNoUndefined]
        }, 
        (res, v1, v2, v3, v4, v5, v6, v7) => {
          expect(res).to.throw(constants.defaultUssException);
        })
        .then(() => {
          cy.waitForUssCallback(
            (resolve) => {
              maxScrollY = uss.getMaxScrollY(_testElement);
              uss.scrollYTo(maxScrollY + 100, _testElement, resolve, true);
              finalYPosition = uss.getFinalYPosition(_testElement);
            }
          ).then(
            () => {
              cy.elementScrollTopShouldBe(_testElement, maxScrollY);
              expect(finalYPosition).to.equal(maxScrollY);
              expect(finalYPosition).to.equal(uss.getFinalYPosition(_testElement));
              expect(finalYPosition).to.equal(uss.getScrollYCalculator(_testElement)());
            }
          );
        });
      });        
  });
})

describe("getFinalYPosition-below-0", function() {
  let uss;
  let finalYPosition;
  it("Tests the getFinalYPosition method whenever the containScroll parameter is used to limit to 0", function() {
    cy.window()
      .then((win) => {
        uss = win.uss;
        const _testElement = win.document.getElementById("scroller");
                    
        cy.testFailingValues(uss.getFinalYPosition, {
          0: [constants.failingValuesNoUndefined]
        }, 
        (res, v1, v2, v3, v4, v5, v6, v7) => {
          expect(res).to.throw(constants.defaultUssException);
        })
        .then(() => {
          cy.waitForUssCallback(
            (resolve) => {
              uss.scrollYTo(-100, _testElement, resolve, true);
              finalYPosition = uss.getFinalYPosition(_testElement);
            }
          ).then(
            () => {
              cy.elementScrollTopShouldBe(_testElement, 0);
              expect(finalYPosition).to.equal(0);
              expect(finalYPosition).to.equal(uss.getFinalYPosition(_testElement));
              expect(finalYPosition).to.equal(uss.getScrollYCalculator(_testElement)());
            }
          );
        });
      });        
  });
})