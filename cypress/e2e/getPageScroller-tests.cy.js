import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getPageScroller-tests.html"); 
})

describe("getPageScroller", function() {
    it("Tests the getPageScroller method", function() {
        cy.window()
            .then((win) => {
                if (!!win.document.scrollingElement) expect(uss.getPageScroller(win)).to.equal(win.document.scrollingElement);
                else expect(uss.getPageScroller(win)).to.equal(win); 

                uss.setPageScroller(win.document.body);
                expect(uss.getPageScroller(win)).to.equal(win.document.body); 
            });        
    });
})