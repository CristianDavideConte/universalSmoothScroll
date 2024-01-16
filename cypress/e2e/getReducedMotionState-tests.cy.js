import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getReducedMotionState-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getReducedMotionState", function () {
    it("Tests the getReducedMotionState method", function () {
        cy.window()
            .then((win) => {
                if (window.matchMedia("(prefers-reduced-motion)").matches) {
                    expect(uss.getReducedMotionState()).to.be.true;
                } else {
                    expect(uss.getReducedMotionState()).to.be.false;
                }
            });
    });
});