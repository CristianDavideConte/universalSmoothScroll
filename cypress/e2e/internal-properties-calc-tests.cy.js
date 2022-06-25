/**
 * This file contains the tests for the following USS API functions:
 *  - calcXStepLength
 *  - calcYStepLength
 *  - calcScrollbarsDimensions
 *  - calcBordersDimensions
 */

describe("calcXStepLength", function() {
    var uss;
    it("Tests the calcXStepLength method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
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
                        if(delta / _minAnimationFrame < 1) expect(_calculatedStepLength).to.equal(delta);
                        if(delta / _minAnimationFrame < _defaultStepLength) expect(_calculatedStepLength).to.be.lessThan(_defaultStepLength);
                        else expect(_calculatedStepLength).to.equal(_defaultStepLength);
                    }
                });
            });        
    });
})

describe("calcYStepLength", function() {
    var uss;
    it("Tests the calcYStepLength method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                cy.testFailingValues(uss.calcYStepLength, {
                    0: [Cypress.env("failingValuesNoPositiveNumberOrZero")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(Cypress.env("defaultUssException"));
                })
                .then(() => {
                    const _minAnimationFrame = uss.getMinAnimationFrame();
                    const _defaultStepLength = uss.getYStepLength();
                    let delta;
                    
                    for(delta = 0; delta < 2 * _minAnimationFrame * _defaultStepLength; delta++) {
                        const _calculatedStepLength = uss.calcYStepLength(delta);
                        if(delta / _minAnimationFrame < 1) expect(_calculatedStepLength).to.equal(delta);
                        if(delta / _minAnimationFrame < _defaultStepLength) expect(_calculatedStepLength).to.be.lessThan(_defaultStepLength);
                        else expect(_calculatedStepLength).to.equal(_defaultStepLength);
                    }
                });
            });        
    });
})

describe("calcScrollbarsDimensions", function() {
    var uss;
    function arraysAreEqual(arr1, arr2) {
        if(!Array.isArray(arr1) || !Array.isArray(arr1)) return false;
        if(arr1.length !== arr2.length) return false;
        for(let i = 0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    it("Tests the calcScrollbarsDimensions method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                cy.testFailingValues(uss.calcScrollbarsDimensions, {
                    0: [Cypress.env("failingValuesAll")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(Cypress.env("defaultUssException"));
                })
                .then(() => {
                    //TODO
                });
            });        
    });
})