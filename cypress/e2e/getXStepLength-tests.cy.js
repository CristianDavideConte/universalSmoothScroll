const { constants } = require("../support/constants");

describe("getXStepLength", function() {
    let uss;
    it("Tests the getXStepLength method", function() {
        cy.visit("getXStepLength-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                expect(Number.isFinite(uss.getXStepLength())).to.be.true;
                expect(uss.getXStepLength() > 0).to.be.true;    
                uss.setXStepLength(10);
                expect(uss.getXStepLength()).to.equal(10);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(100, _testElement, resolve);
                    }
                ).then(
                    () => {
                        expect(uss.getXStepLength()).to.equal(10);
                    }
                );
            });        
    });
})