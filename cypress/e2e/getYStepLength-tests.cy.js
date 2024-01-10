import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getYStepLength-tests.html"); 
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