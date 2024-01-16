import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getXStepLength-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getXStepLength", function () {
    it("Tests the getXStepLength method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");
                const _expectedFinalPos = 10;
                
                expect(Number.isFinite(uss.getXStepLength())).to.be.true;
                expect(uss.getXStepLength() > 0).to.be.true;
                uss.setXStepLength(10);
                expect(uss.getXStepLength()).to.equal(10);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(_expectedFinalPos, _testElement, resolve);
                    }
                ).then(
                    () => {
                        expect(uss.getXStepLength()).to.equal(10);
                    }
                );
            });
    });
});