const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getMaxScrollX-tests.html"); 
})

describe("getMaxScrollX", function() {
    let uss;
    it("Tests the getMaxScrollX method", function() {
        cy.window()
          .then((win) => {
              uss = win.uss;
              const _testElement = win.document.getElementById("scroller");
                            
              cy.testFailingValues(uss.getMaxScrollX, {
                0: [constants.failingValuesNoUndefined, 
                    [true, false]
                  ]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                      expect(res).to.throw(constants.defaultUssException);
              })
              .then(() => {
                const _expectedMaxScrollX = 0.5 * _testElement.scrollWidth + uss.getScrollbarsMaxDimension(); 

                //test the Window
                expect(uss.getMaxScrollX(win, false)).to.equal(uss.getMaxScrollX(uss.getWindowScroller(), false));
                expect(uss.getMaxScrollX(win, true)).to.equal(uss.getMaxScrollX(uss.getWindowScroller(), true));

                expect(Number.isFinite(uss.getMaxScrollX(_testElement, true))).to.be.true;
                expect(Number.isFinite(uss.getMaxScrollX(_testElement, false))).to.be.true;
                expect(uss.getMaxScrollX(_testElement, true) > 0).to.be.true;
                expect(uss.getMaxScrollX(_testElement, false) > 0).to.be.true;
                expect(uss.getMaxScrollX(_testElement, true)).to.be.closeTo(_expectedMaxScrollX, 1);   
                expect(uss.getMaxScrollX(_testElement, false)).to.be.closeTo(_expectedMaxScrollX, 1);   
                
                //test elements that are unscrollable on the x-axis 
                expect(uss.getMaxScrollX(win.document.getElementById("no-scroll-x-1"), true)).to.equal(0);
                expect(uss.getMaxScrollX(win.document.getElementById("no-scroll-x-1"), false)).to.equal(0);
                expect(uss.getMaxScrollX(win.document.getElementById("no-scroll-x-2"), true)).to.equal(0);
                expect(uss.getMaxScrollX(win.document.getElementById("no-scroll-x-2"), false)).to.equal(0);
                                                    
                //Test if the methods used for stopping one or more scroll-animation/s erase the cached values (they should not).
                uss.getMaxScrollX(_testElement, true);
                uss.stopScrollingX(_testElement);
                uss.stopScrollingY(_testElement);
                uss.stopScrolling(_testElement);
                uss.stopScrollingAll();
                expect(uss.getMaxScrollX(_testElement, false)).to.be.closeTo(_expectedMaxScrollX, 1);  
                expect(uss.getMaxScrollX(win, false)).to.equal(uss.getMaxScrollX(uss.getWindowScroller(), false));
                expect(uss.getMaxScrollX(win, true)).to.equal(uss.getMaxScrollX(uss.getWindowScroller(), true));
              });
          });     
    });
})