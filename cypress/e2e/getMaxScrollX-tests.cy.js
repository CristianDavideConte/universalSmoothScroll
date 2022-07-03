describe("getMaxScrollX", function() {
    let uss;
    it("Tests the getMaxScrollX method", function() {
        cy.visit("getMaxScrollX-tests.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              const _testElement = win.document.getElementById("scroller");
                            
              cy.testFailingValues(uss.getMaxScrollX, {
                0: [Cypress.env("failingValuesNoUndefined"), 
                    [true, false]
                  ]
              })
              .then(() => {
                const _expectedMaxScrollX = 0.5 * _testElement.scrollWidth + uss.getScrollbarsMaxDimension(); 

                expect(Number.isFinite(uss.getMaxScrollX(_testElement))).to.be.true;
                expect(uss.getMaxScrollX(_testElement) > 0).to.be.true;
                expect(uss.getMaxScrollX(_testElement)).to.be.closeTo(_expectedMaxScrollX, 1);   
                
                //test elements that are unscrollable on the x-axis 
                expect(uss.getMaxScrollX(win.document.getElementById("no-scroll-x-1"))).to.equal(0);
                expect(uss.getMaxScrollX(win.document.getElementById("no-scroll-x-2"))).to.equal(0);
              });
          });     
    });
})