import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getMinAnimationFrame-tests.html"); 
})

describe("getMinAnimationFrame", function () {
    it("Tests the getMinAnimationFrame method", function () {
        cy.window()
            .then((win) => {
                //DEFAULT_YSTEP_LENGTH
                const _defaultWinHeight = win.innerHeight;
                const _defaultYStepLegth = Math.max(1, Math.abs(38 - 20 / 140 * (_defaultWinHeight - 789)));
                const _defaultValue = _defaultWinHeight / _defaultYStepLegth;
                expect(uss.getMinAnimationFrame()).to.equal(_defaultValue);

                uss.setMinAnimationFrame(10);
                expect(uss.getMinAnimationFrame()).to.equal(10);
            });
    })
});