import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";
import * as math from "../../src/main/math.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getMinAnimationFrame-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getMinAnimationFrame", function () {
    it("Tests the getMinAnimationFrame method", function () {
        cy.window()
            .then((win) => {
                //Same definition found in uss.js
                const GET_DEFAULT_STEP_LENGTH = math.GET_LINE_FROM_P1_P2(412, 16, 1920, 23);
                const DEFAULT_YSTEP_LENGTH = GET_DEFAULT_STEP_LENGTH(common.INITIAL_WINDOW_HEIGHT);
                const DEFAULT_MIN_ANIMATION_FRAMES = common.INITIAL_WINDOW_HEIGHT / DEFAULT_YSTEP_LENGTH;

                expect(uss.getMinAnimationFrame()).to.equal(DEFAULT_MIN_ANIMATION_FRAMES);

                uss.setMinAnimationFrame(10);
                expect(uss.getMinAnimationFrame()).to.equal(10);
            });
    })
});