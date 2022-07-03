describe("calcXStepLength", function() {
    let uss;
    it("Tests the calcXStepLength method", function() {
        cy.visit("calcXStepLength-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                
                cy.testFailingValues(uss.calcXStepLength, {
                    0: [Cypress.env("failingValuesNoPositiveNumberOrZero")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(Cypress.env("defaultUssException"));
                })
                .then(() => {
                    const _minAnimationFrame = uss.getMinAnimationFrame();
                    const _defaultStepLength = uss.getXStepLength();
                    let delta;
                    
                    for(delta = 0; delta < 2 * _minAnimationFrame * _defaultStepLength; delta++) {
                        const _calculatedStepLength = uss.calcXStepLength(delta);
                        if(delta / _minAnimationFrame < 1) expect(_calculatedStepLength).to.equal(1);
                        if(delta / _minAnimationFrame < _defaultStepLength) expect(_calculatedStepLength).to.be.lessThan(_defaultStepLength);
                        else expect(_calculatedStepLength).to.equal(_defaultStepLength);
                    }
                });
            });        
    });
})