import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getPageScroller-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getPageScroller", function () {
    it("Tests the getPageScroller method", function () {
        cy.window()
            .then((win) => {
                if (!!win.document.scrollingElement) expect(uss.getPageScroller(win)).to.equal(win.document.scrollingElement);
                else expect(uss.getPageScroller(win)).to.equal(win);

                uss.setPageScroller(win.document.body);
                expect(uss.getPageScroller(win)).to.equal(win.document.body);
            });
    });
});