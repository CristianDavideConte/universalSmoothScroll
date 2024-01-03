import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getReducedMotionState-tests.html"); 
})

describe("getReducedMotionState", function() {
    it("Tests the getReducedMotionState method", function() {
        cy.window()
            .then((win) => {
                if(window.matchMedia("(prefers-reduced-motion)").matches) {
                    expect(uss.getReducedMotionState()).to.be.true;
                } else {
                    expect(uss.getReducedMotionState()).to.be.false;
                }
            });        
    });
})