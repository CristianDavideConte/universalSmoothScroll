const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getFramesTime-tests.html"); 
})

describe("getFramesTime", function() {
    let uss;
    it("Tests the getFramesTime method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                if(document.readyState !== "complete") {
                    expect(uss._framesTimes.length).to.equal(0);
                    expect(uss.getFramesTime()).to.equal(16.6);
                } else {
                    expect(uss.getFramesTime()).to.equal(uss._framesTime);
                }
            });        
    });
})