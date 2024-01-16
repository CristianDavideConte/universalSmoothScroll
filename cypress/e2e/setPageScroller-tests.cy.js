import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("setPageScroller-tests.html");

  //Speeds up the tests, there's no need to wait for the scroll-animations.
  uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("setPageScroller", function () {
  it("Tests the setPageScroller method", function () {
    cy.window()
      .then((win) => {
        uss.setPageScroller(win);
        expect(uss.getPageScroller(win, false)).to.equal(win);

        cy.testFailingValues(uss.setPageScroller, {
          0: [constants.failingValuesAll]
        },
          (res, v1, v2, v3, v4, v5, v6, v7) => {
            expect(res).to.throw(constants.defaultUssException);
            expect(uss.getPageScroller(win)).to.equal(win);
          })
          .then(() => {
            uss.setPageScroller(win.document.documentElement);
            expect(uss.getPageScroller(win, false)).to.equal(win.document.documentElement);

            uss.setPageScroller(win.document.body);
            expect(uss.getPageScroller(win, false)).to.equal(win.document.body);
          });
      });
  })
});