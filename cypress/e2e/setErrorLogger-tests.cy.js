import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("setErrorLogger-tests.html");

  //Speeds up the tests, there's no need to wait for the scroll-animations.
  uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("setErrorLogger", function () {
  let validLogger1 = (a, b, c) => console.log(a, b, c);
  let validLogger2 = () => console.log("");
  let validLogger3 = () => { }
  it("Tests the setErrorLogger method", function () {
    cy.window()
      .then((win) => {
        const _originalLogger = uss._errorLogger;

        cy.testFailingValues(uss.setErrorLogger, {
          0: [constants.failingValuesAllNoUnsupportedNoUndefined]
        },
          (res, v1, v2, v3, v4, v5, v6, v7) => {
            expect(res).to.throw(constants.defaultUssException);
            expect(uss._errorLogger).to.equal(_originalLogger);
          })
          .then(() => {
            uss.setErrorLogger(validLogger1);
            expect(uss._errorLogger).to.equal(validLogger1);

            uss.setErrorLogger(validLogger2);
            expect(uss._errorLogger).to.equal(validLogger2);

            uss.setErrorLogger(validLogger3);
            expect(uss._errorLogger).to.equal(validLogger3);
          });
      });
  })
});
