const { constants } = require("../support/constants");

describe("getYStepLength", function() {
    let uss;
    it("Tests the getYStepLength method", function() {
        cy.visit("getYStepLength-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                expect(Number.isFinite(uss.getYStepLength())).to.be.true;
                expect(uss.getYStepLength() > 0).to.be.true;    
                uss.setYStepLength(10);
                expect(uss.getYStepLength()).to.equal(10);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(100, _testElement, resolve);
                    }
                ).then(
                    () => {
                        expect(uss.getYStepLength()).to.equal(10);
                    }
                );
            });        
    });
})