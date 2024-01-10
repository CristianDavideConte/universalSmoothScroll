import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getDebugMode-tests.html"); 
})

describe("getDebugMode", function () {
    it.only("Tests the getDebugMode method", function () {
        cy.window()
            .then((win) => {
                expect(uss.getDebugMode()).to.equal("");

                uss.setDebugMode("legacy");
                expect(uss.getDebugMode()).to.equal("legacy");

                uss.setDebugMode("novalue");
                expect(uss.getDebugMode()).to.equal("novalue");
                
                uss.setDebugMode("disabled");
                expect(uss.getDebugMode()).to.equal("disabled");
                
                uss.setDebugMode(10);
                expect(uss.getDebugMode()).to.equal("disabled");
            });
    });
});
