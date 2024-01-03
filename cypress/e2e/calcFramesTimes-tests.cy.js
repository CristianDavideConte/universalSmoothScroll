import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("calcFramesTimes-tests.html"); 
})

describe("calcFramesTimes", function() {
    it("Tests the calcFramesTimes method", function() {
        cy.window()
            .then((win) => {
                //TODO
            });        
    });
})