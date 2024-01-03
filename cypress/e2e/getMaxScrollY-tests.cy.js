import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getMaxScrollY-tests.html"); 
})

describe("getMaxScrollY", function() {
    it("Tests the getMaxScrollY method", function() {
        cy.window()
          .then((win) => {
              const _testElement = win.document.getElementById("scroller");
                            
              cy.testFailingValues(uss.getMaxScrollY, {
                0: [constants.failingValuesNoUndefined,
                    [true, false]
                  ]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                      expect(res).to.throw(constants.defaultUssException);
              })
              .then(() => {
                const _expectedMaxScrollY = 0.5 * _testElement.scrollHeight + uss.getScrollbarsMaxDimension(); 

                //Test the Window
                expect(uss.getMaxScrollY(win, false)).to.equal(uss.getMaxScrollY(uss.getWindowScroller(), false));
                expect(uss.getMaxScrollY(win, true)).to.equal(uss.getMaxScrollY(uss.getWindowScroller(), true));

                expect(Number.isFinite(uss.getMaxScrollY(_testElement), true)).to.be.true;
                expect(Number.isFinite(uss.getMaxScrollY(_testElement), false)).to.be.true;
                expect(uss.getMaxScrollY(_testElement, true) > 0).to.be.true;
                expect(uss.getMaxScrollY(_testElement, false) > 0).to.be.true;
                expect(uss.getMaxScrollY(_testElement, true)).to.be.closeTo(_expectedMaxScrollY, 1);   
                expect(uss.getMaxScrollY(_testElement, false)).to.be.closeTo(_expectedMaxScrollY, 1);   
                
                //Test elements that are unscrollable on the y-axis 
                expect(uss.getMaxScrollY(win.document.getElementById("no-scroll-y-1"), true)).to.equal(0);
                expect(uss.getMaxScrollY(win.document.getElementById("no-scroll-y-1"), false)).to.equal(0);
                expect(uss.getMaxScrollY(win.document.getElementById("no-scroll-y-2"), true)).to.equal(0);
                expect(uss.getMaxScrollY(win.document.getElementById("no-scroll-y-2"), false)).to.equal(0);

                //Test if the methods used for stopping one or more scroll-animation/s erase the cached values (they should not).
                uss.getMaxScrollY(_testElement, true);
                uss.stopScrollingX(_testElement);
                uss.stopScrollingY(_testElement);
                uss.stopScrolling(_testElement);
                uss.stopScrollingAll(); 
                expect(uss.getMaxScrollY(_testElement, false)).to.be.closeTo(_expectedMaxScrollY, 1);  
                expect(uss.getMaxScrollY(win, false)).to.equal(uss.getMaxScrollY(uss.getWindowScroller(), false));
                expect(uss.getMaxScrollY(win, true)).to.equal(uss.getMaxScrollY(uss.getWindowScroller(), true));
              });
          });     
    });
})