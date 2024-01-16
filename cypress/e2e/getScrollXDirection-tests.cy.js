import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getScrollXDirection-tests.html");

  //Speeds up the tests, there's no need to wait for the scroll-animations.
  uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getScrollXDirection", function () {
  it("Tests the getScrollXDirection method", function () {
    cy.window()
      .then((win) => {
        const _testElement = win.document.getElementById("scroller");
        const _initialPos = 10;
        const _expectedFinalPos = 5;

        cy.testFailingValues(uss.getScrollXDirection, {
          0: [constants.failingValuesNoUndefined]
        },
          (res, v1, v2, v3, v4, v5, v6, v7) => {
            expect(res).to.throw(constants.defaultUssException);
          })
          .then(() => {
            cy.waitForUssCallback(
              (resolve) => {
                expect(uss.getScrollXDirection(_testElement)).to.equal(0);
                uss.scrollXTo(_initialPos, _testElement, () => {
                  uss.scrollXTo(_expectedFinalPos, _testElement, resolve);
                  expect(uss.getScrollXDirection(_testElement)).to.equal(-1);
                });
                expect(uss.getScrollXDirection(_testElement)).to.equal(1);
              }
            ).then(
              () => {
                expect(uss.getScrollXCalculator(_testElement)()).to.equal(_expectedFinalPos);
                expect(uss.getScrollXDirection(_testElement)).to.equal(0);
              }
            );
          });
      });
  });
});