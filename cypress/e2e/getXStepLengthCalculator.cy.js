import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getXStepLengthCalculator-tests.html");

  //Speeds up the tests, there's no need to wait for the scroll-animations.
  uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getXStepLengthCalculator", function () {
  let nonTempTestCalculator = () => 10;
  let tempTestCalculator = r => r / 20 + 1;
  it("Tests the getXStepLengthCalculator method", function () {
    cy.window()
      .then((win) => {        
        const _testElement = win.document.getElementById("scroller");
                                        
        cy.testFailingValues(uss.getXStepLengthCalculator, {
          0: [constants.failingValuesNoUndefined,
          [true, false]
          ]
        },
          (res, v1, v2, v3, v4, v5, v6, v7) => {
            expect(res).to.throw(constants.defaultUssException);
          })
          .then(() => {
            uss.setXStepLengthCalculator(nonTempTestCalculator, _testElement, false);
            expect(uss.getXStepLengthCalculator(_testElement)).to.equal(nonTempTestCalculator);

            uss.setXStepLengthCalculator(tempTestCalculator, _testElement, true);
            expect(uss.getXStepLengthCalculator(_testElement, true)).to.equal(tempTestCalculator);
            
            cy.waitForUssCallback(
              (resolve) => {
                uss.scrollXTo(100, _testElement, resolve);
              }
            ).then(
              () => {
                expect(uss.getXStepLengthCalculator(_testElement, false)).to.equal(nonTempTestCalculator);
                expect(uss.getXStepLengthCalculator(_testElement, true)).to.be.undefined;
              }
            );
          });
      });
  });
});