import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("getWindowScroller-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getWindowScroller", function () {
    it("Tests the getWindowScroller method", function () {
        cy.window()
            .then((win) => {
                const _html = win.document.documentElement;
                const _body = win.document.body;

                const _hasSameCoordinatesAsWindow = (el) => el.scrollLeft === win.scrollX && el.scrollTop === win.scrollY;

                //Reset the window to a known scroll position.
                win.scroll(0, 0);

                const _htmlResetCorrectly = _hasSameCoordinatesAsWindow(_html);
                const _bodyResetCorrectly = _hasSameCoordinatesAsWindow(_body);

                //Scroll the window to a random position to see if the html/body scrolls accordingly.
                win.scroll(100, 100);

                if (_htmlResetCorrectly && _hasSameCoordinatesAsWindow(_html)) {
                    expect(uss.getWindowScroller(win)).to.equal(_html);
                } else if (_bodyResetCorrectly && _hasSameCoordinatesAsWindow(_body)) {
                    expect(uss.getWindowScroller(win)).to.equal(_body);
                } else {
                    expect(uss.getWindowScroller(win)).to.equal(win);
                }
            });
    });
});