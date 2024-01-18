import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

//Source: https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
function browserIsChrome(window) {
    const isChromium = window.chrome;
    const winNav = window.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof window.opr !== "undefined";
    const isIEedge = winNav.userAgent.indexOf("Edg") > -1;
    const isIOSChrome = winNav.userAgent.match("CriOS");

    return (isIOSChrome) || (
            isChromium !== null &&
            typeof isChromium !== "undefined" &&
            vendorName === "Google Inc." &&
            isOpera === false &&
            isIEedge === false
    );
}

//Source: https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
function browserIsEdgeChromium(window) {
    const isChromium = window.chrome;
    const winNav = window.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof window.opr !== "undefined";
    const isIEedge = winNav.userAgent.indexOf("Edg") > -1;

    return (
            isChromium !== null &&
            typeof isChromium !== "undefined" &&
            vendorName === "Google Inc." &&
            isOpera === false &&
            isIEedge === true
    );
}

//Source: https://stackoverflow.com/questions/7944460/detect-safari-browser
function browserIsSafari(window) {
    return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
}

//Source: https://stackoverflow.com/questions/7000190/detect-all-firefox-versions-in-js
function browserIsFirefox(window) {
    return window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

beforeEach(() => {
    cy.visit("getScrollbarsMaxDimension-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})
  
describe("getScrollbarsMaxDimension", function () {
    it("Tests the getScrollbarsMaxDimension method", function () {
        cy.window()
            .then((win) => {
                if (browserIsChrome(win)) expect(uss.getScrollbarsMaxDimension()).to.be.oneOf([15, 17]);
                else if (browserIsEdgeChromium(win)) expect(uss.getScrollbarsMaxDimension()).to.equal(15);
                else if (browserIsFirefox(win)) expect(uss.getScrollbarsMaxDimension()).to.be.oneOf([0, 12, 15, 17]);
                else if (browserIsSafari(win)) expect(uss.getScrollbarsMaxDimension()).to.equal(0);
            
                if (browserIsChrome(win)) expect(uss.getScrollbarsMaxDimension(true)).to.be.oneOf([15, 17]);
                else if (browserIsEdgeChromium(win)) expect(uss.getScrollbarsMaxDimension(true)).to.equal(15);
                else if (browserIsFirefox(win)) expect(uss.getScrollbarsMaxDimension(true)).to.be.oneOf([0, 12, 15, 17]);
                else if (browserIsSafari(win)) expect(uss.getScrollbarsMaxDimension(true)).to.equal(0);
            });
    });
});