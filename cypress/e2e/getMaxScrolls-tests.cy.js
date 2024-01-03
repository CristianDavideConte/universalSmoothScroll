import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getMaxScrolls-tests.html"); 
})

describe("getMaxScrolls", function() {
    it("Tests the getMaxScrolls method", function() {
        cy.window()
          .then((win) => {
              const _testElement = win.document.getElementById("scroller");
                            
              cy.testFailingValues(uss.getMaxScrolls, {
                0: [constants.failingValuesNoUndefined, 
                    [true, false]
                  ]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                      expect(res).to.throw(constants.defaultUssException);
              })
              .then(() => {
                const _expectedMaxScrollX = 0.5 * _testElement.scrollWidth + uss.getScrollbarsMaxDimension(); 
                const _expectedMaxScrollY = 0.5 * _testElement.scrollHeight + uss.getScrollbarsMaxDimension(); 

                //Test the Window
                expect(uss.getMaxScrolls(win, false)[0]).to.equal(uss.getMaxScrolls(uss.getWindowScroller(), false)[0]);
                expect(uss.getMaxScrolls(win, false)[1]).to.equal(uss.getMaxScrolls(uss.getWindowScroller(), false)[1]);
                expect(uss.getMaxScrolls(win, true)[0]).to.equal(uss.getMaxScrolls(uss.getWindowScroller(), true)[0]);
                expect(uss.getMaxScrolls(win, true)[1]).to.equal(uss.getMaxScrolls(uss.getWindowScroller(), true)[1]);

                expect(Number.isFinite(uss.getMaxScrolls(_testElement, true)[0])).to.be.true;
                expect(Number.isFinite(uss.getMaxScrolls(_testElement, true)[1])).to.be.true;
                expect(Number.isFinite(uss.getMaxScrolls(_testElement, false)[0])).to.be.true;
                expect(Number.isFinite(uss.getMaxScrolls(_testElement, false)[1])).to.be.true;
                expect(uss.getMaxScrolls(_testElement, true)[0] > 0).to.be.true;
                expect(uss.getMaxScrolls(_testElement, true)[1] > 0).to.be.true;
                expect(uss.getMaxScrolls(_testElement, false)[0] > 0).to.be.true;
                expect(uss.getMaxScrolls(_testElement, false)[1] > 0).to.be.true;
                expect(uss.getMaxScrolls(_testElement, true)[0]).to.be.closeTo(_expectedMaxScrollX, 1);   
                expect(uss.getMaxScrolls(_testElement, true)[1]).to.be.closeTo(_expectedMaxScrollY, 1);   
                expect(uss.getMaxScrolls(_testElement, false)[0]).to.be.closeTo(_expectedMaxScrollX, 1);   
                expect(uss.getMaxScrolls(_testElement, false)[1]).to.be.closeTo(_expectedMaxScrollY, 1);   
                
                //Test elements that are unscrollable on the x-axis
                expect(uss.getMaxScrolls(win.document.getElementById("no-scroll-x-1"), true)[0]).to.equal(0);
                expect(uss.getMaxScrolls(win.document.getElementById("no-scroll-x-1"), false)[0]).to.equal(0);
                expect(uss.getMaxScrolls(win.document.getElementById("no-scroll-x-2"), true)[0]).to.equal(0);
                expect(uss.getMaxScrolls(win.document.getElementById("no-scroll-x-2"), false)[0]).to.equal(0);

                //Test elements that are unscrollable on the y-axis 
                expect(uss.getMaxScrolls(win.document.getElementById("no-scroll-y-1"), true)[1]).to.equal(0);
                expect(uss.getMaxScrolls(win.document.getElementById("no-scroll-y-1"), false)[1]).to.equal(0);
                expect(uss.getMaxScrolls(win.document.getElementById("no-scroll-y-2"), true)[1]).to.equal(0);
                expect(uss.getMaxScrolls(win.document.getElementById("no-scroll-y-2"), false)[1]).to.equal(0);
                                                    
                //Test if the methods used for stopping one or more scroll-animation/s erase the cached values (they should not).
                uss.getMaxScrolls(_testElement, true);
                uss.stopScrollingX(_testElement);
                uss.stopScrollingY(_testElement);
                uss.stopScrolling(_testElement);
                uss.stopScrollingAll();
                expect(uss.getMaxScrolls(_testElement, false)[0]).to.be.closeTo(_expectedMaxScrollX, 1);  
                expect(uss.getMaxScrolls(_testElement, false)[1]).to.be.closeTo(_expectedMaxScrollY, 1);  
                expect(uss.getMaxScrolls(win, false)[0]).to.equal(uss.getMaxScrolls(uss.getWindowScroller(), false)[0]);
                expect(uss.getMaxScrolls(win, false)[1]).to.equal(uss.getMaxScrolls(uss.getWindowScroller(), false)[1]);
                expect(uss.getMaxScrolls(win, true)[0]).to.equal(uss.getMaxScrolls(uss.getWindowScroller(), true)[0]);
                expect(uss.getMaxScrolls(win, true)[1]).to.equal(uss.getMaxScrolls(uss.getWindowScroller(), true)[1]);
              });
          });     
    });
})