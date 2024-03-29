const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getPageScroller-tests.html"); 
})

describe("getPageScroller", function() {
    let uss;
    it("Tests the getPageScroller method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                if(!!win.document.scrollingElement) expect(uss.getPageScroller()).to.equal(win.document.scrollingElement);
                else expect(uss.getPageScroller()).to.equal(win); 

                uss.setPageScroller(win.document.body);
                expect(uss.getPageScroller()).to.equal(win.document.body); 
            });        
    });
})