const { constants } = require("../support/constants");

describe("getMaxScrollY", function() {
    let uss;
    it("Tests the getMaxScrollY method", function() {
        cy.visit("getMaxScrollY-tests.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              const _testElement = win.document.getElementById("scroller");
                            
              cy.testFailingValues(uss.getMaxScrollY, {
                0: [constants.failingValuesNoUndefined,
                    [true, false]
                  ]
              })
              .then(() => {
                const _expectedMaxScrollY = 0.5 * _testElement.scrollHeight + uss.getScrollbarsMaxDimension(); 

                expect(Number.isFinite(uss.getMaxScrollY(_testElement), true)).to.be.true;
                expect(Number.isFinite(uss.getMaxScrollY(_testElement), false)).to.be.true;
                expect(uss.getMaxScrollY(_testElement, true) > 0).to.be.true;
                expect(uss.getMaxScrollY(_testElement, false) > 0).to.be.true;
                expect(uss.getMaxScrollY(_testElement, true)).to.be.closeTo(_expectedMaxScrollY, 1);   
                expect(uss.getMaxScrollY(_testElement, false)).to.be.closeTo(_expectedMaxScrollY, 1);   
                
                //test elements that are unscrollable on the x-axis 
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
              });
          });     
    });
})