import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getScrollYDirection-tests.html");

  //Speeds up the tests, there's no need to wait for the scroll-animations.
  uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getScrollYDirection", function () {
  it("Tests the getScrollYDirection method", function () {
    cy.window()
      .then((win) => {
        const _testElement = win.document.getElementById("scroller");
        const _initialPos = 10;
        const _expectedFinalPos = 5;

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
                uss.scrollYTo(_initialPos, _testElement, () => {
                  uss.scrollYTo(_expectedFinalPos, _testElement, resolve);
                  expect(uss.getScrollYDirection(_testElement)).to.equal(-1);
                });
                expect(uss.getScrollYDirection(_testElement)).to.equal(1);
              }
            ).then(
              () => {
                expect(uss.getScrollYCalculator(_testElement)()).to.equal(_expectedFinalPos);
                expect(uss.getScrollYDirection(_testElement)).to.equal(0);
              }
            );
          });
      });
  });
});