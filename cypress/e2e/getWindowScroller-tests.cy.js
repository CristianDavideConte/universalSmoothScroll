const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getWindowScroller-tests.html"); 
})

describe("getWindowScroller", function() {
    let uss;
    it("Tests the getWindowScroller method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                const _html = win.document.documentElement;
                const _body = win.document.body;

                const _hasSameCoordinatesAsWindow = (el) => el.scrollLeft === win.scrollX && el.scrollTop === win.scrollY;

                //Reset the window to a known scroll position.
                win.scroll(0, 0);

                //Scroll the window to a random position to see if the html/body scrolls accordingly.
                win.scroll(100, 100);

                if(_hasSameCoordinatesAsWindow(_html)) {
                    expect(uss.getWindowScroller()).to.equal(_html);
                } else if(_hasSameCoordinatesAsWindow(_body)) {
                    expect(uss.getWindowScroller()).to.equal(_body);
                } else {
                    expect(uss.getWindowScroller()).to.equal(win);
                }
            });        
    });
})