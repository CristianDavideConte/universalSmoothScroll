import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getFinalXPosition-tests.html");

  //Speeds up the tests, there's no need to wait for the scroll-animations.
  uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getFinalXPosition", function () {
  let finalXPosition;
  it("Tests the getFinalXPosition method", function () {
    cy.window()
      .then((win) => {

        const _testElement = win.document.getElementById("scroller");
        const _expectedFinalPos = 10;
                      
        cy.testFailingValues(uss.getFinalXPosition, {
          0: [constants.failingValuesNoUndefined]
        },
          (res, v1, v2, v3, v4, v5, v6, v7) => {
            expect(res).to.throw(constants.defaultUssException);
          })
          .then(() => {
            cy.waitForUssCallback(
              (resolve) => {
                uss.scrollXTo(_expectedFinalPos, _testElement, resolve);
                finalXPosition = uss.getFinalXPosition(_testElement);
              }
            ).then(
              () => {
                cy.elementScrollLeftShouldBe(_testElement, _expectedFinalPos);
                expect(finalXPosition).to.equal(_expectedFinalPos);
                expect(finalXPosition).to.equal(uss.getFinalXPosition(_testElement));
                expect(finalXPosition).to.equal(uss.getScrollXCalculator(_testElement)());
              }
            );
          });
      });
  });
});

describe("getFinalXPosition-beyond-maxScrollX", function () {
  let maxScrollX;
  let finalXPosition;
  it("Tests the getFinalXPosition method whenever the containScroll parameter is used to limit to maxScrollX", function () {
    cy.window()
      .then((win) => {
        const _testElement = win.document.getElementById("scroller");

        cy.waitForUssCallback(
          (resolve) => {
            maxScrollX = uss.getMaxScrollX(_testElement);
            uss.scrollXTo(maxScrollX + 100, _testElement, resolve, true);
            finalXPosition = uss.getFinalXPosition(_testElement);
          }
        ).then(
          () => {
            cy.elementScrollLeftShouldBe(_testElement, maxScrollX);
            expect(finalXPosition).to.equal(maxScrollX);
            expect(finalXPosition).to.equal(uss.getFinalXPosition(_testElement));
            expect(finalXPosition).to.equal(uss.getScrollXCalculator(_testElement)());
          }
        );
      });
  });
});

describe("getFinalXPosition-below-0", function () {
  let finalXPosition;
  it("Tests the getFinalXPosition method whenever the containScroll parameter is used to limit to 0", function () {
    cy.window()
      .then((win) => {
        const _testElement = win.document.getElementById("scroller");

        cy.waitForUssCallback(
          (resolve) => {
            uss.scrollXTo(-100, _testElement, resolve, true);
            finalXPosition = uss.getFinalXPosition(_testElement);
          }
        ).then(
          () => {
            cy.elementScrollLeftShouldBe(_testElement, 0);
            expect(finalXPosition).to.equal(0);
            expect(finalXPosition).to.equal(uss.getFinalXPosition(_testElement));
            expect(finalXPosition).to.equal(uss.getScrollXCalculator(_testElement)());
          }
        );
      });
  });
});
