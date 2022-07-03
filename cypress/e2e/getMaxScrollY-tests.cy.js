describe("getMaxScrollY", function() {
    let uss;
    it("Tests the getMaxScrollY method", function() {
        cy.visit("getMaxScrollY-tests.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              const _testElement = win.document.getElementById("scroller");
                            
              cy.testFailingValues(uss.getMaxScrollY, {
                0: [Cypress.env("failingValuesNoUndefined"),
                    [true, false]
                  ]
              })
              .then(() => {
                const _expectedMaxScrollY = 0.5 * _testElement.scrollHeight + uss.getScrollbarsMaxDimension(); 

                expect(Number.isFinite(uss.getMaxScrollY(_testElement))).to.be.true;
                expect(uss.getMaxScrollY(_testElement) > 0).to.be.true;
                expect(uss.getMaxScrollY(_testElement)).to.be.closeTo(_expectedMaxScrollY, 1);   
                
                //test elements that are unscrollable on the x-axis 
                expect(uss.getMaxScrollY(win.document.getElementById("no-scroll-y-1"))).to.equal(0);
                expect(uss.getMaxScrollY(win.document.getElementById("no-scroll-y-2"))).to.equal(0);
              });
          });     
    });
})