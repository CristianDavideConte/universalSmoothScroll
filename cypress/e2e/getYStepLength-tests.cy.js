import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getYStepLength-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})
  
describe("getYStepLength", function () {
    it("Tests the getYStepLength method", function () {
        cy.window()
            .then((win) => {
                const _testElement = win.document.getElementById("scroller");
                const _expectedFinalPos = 10;
                
                expect(Number.isFinite(uss.getYStepLength())).to.be.true;
                expect(uss.getYStepLength() > 0).to.be.true;
                uss.setYStepLength(10);
                expect(uss.getYStepLength()).to.equal(10);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(_expectedFinalPos, _testElement, resolve);
                    }
                ).then(
                    () => {
                        expect(uss.getYStepLength()).to.equal(10);
                    }
                );
            });
    });
});