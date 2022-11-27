const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("calcFramesTimes-tests.html"); 
})

describe("calcFramesTimes", function() {
    let uss;
    it("Tests the calcFramesTimes method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                
                //TODO
            });        
    });
})