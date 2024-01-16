import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getFramesTime-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getFramesTime", function () {
    it("Tests the getFramesTime method", function () {
        cy.window()
            .then((win) => {
                if (document.readyState !== "complete") {
                    expect(uss._framesTimes.length).to.equal(0);
                    expect(uss.getFramesTime()).to.equal(16.6);
                } else {
                    expect(uss.getFramesTime()).to.equal(uss._framesTime);
                }
            });
    });
});