describe("setPageScroller", function() {
    let uss;
    it("Tests the setPageScroller method", function() {
        cy.visit("setPageScroller-tests.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;

              uss.setPageScroller(win);
              expect(uss.getPageScroller()).to.equal(win);
                            
              cy.testFailingValues(uss.setPageScroller, {
                0: [Cypress.env("failingValuesAll")]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(uss.getPageScroller()).to.equal(win);
              })
              .then(() => {
                uss.setPageScroller(win.document.documentElement);
                expect(uss.getPageScroller()).to.equal(win.document.documentElement);
                
                uss.setPageScroller(win.document.body);
                expect(uss.getPageScroller()).to.equal(win.document.body);
  
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(100, 200, uss.getPageScroller(), () => {
                            expect(uss.getScrollXCalculator(uss.getPageScroller())()).to.equal(100);
                            expect(uss.getScrollYCalculator(uss.getPageScroller())()).to.equal(200);
                            
                            uss.scrollBy(-100, -200, uss.getPageScroller(), resolve);
                        });
                    }
                ).then(
                    () => {
                        expect(uss.getScrollXCalculator(uss.getPageScroller())()).to.equal(0);
                        expect(uss.getScrollYCalculator(uss.getPageScroller())()).to.equal(0);
                    }
                );
              });
          });        
    })
})