const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getXStepLength-tests.html"); 
})

describe("getXStepLength", function() {
    let uss;
    it("Tests the getXStepLength method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
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
})