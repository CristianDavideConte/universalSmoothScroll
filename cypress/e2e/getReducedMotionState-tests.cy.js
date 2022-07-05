const { constants } = require("../support/constants");

describe("getReducedMotionState", function() {
    let uss;
    it("Tests the getReducedMotionState method", function() {
        cy.visit("getReducedMotionState-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                
                //TODO
            });        
    });
})