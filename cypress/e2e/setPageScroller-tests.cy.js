const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("setPageScroller-tests.html"); 
})

describe("setPageScroller", function() {
    let uss;
    it("Tests the setPageScroller method", function() {
        cy.window()
          .then((win) => {
              uss = win.uss;

              uss.setPageScroller(win);
              expect(uss.getPageScroller(false)).to.equal(win);
                            
              cy.testFailingValues(uss.setPageScroller, {
                0: [constants.failingValuesAll]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(res).to.throw(constants.defaultUssException);
                expect(uss.getPageScroller()).to.equal(win);
              })
              .then(() => {
                uss.setPageScroller(win.document.documentElement);
                expect(uss.getPageScroller(false)).to.equal(win.document.documentElement);
                
                uss.setPageScroller(win.document.body);
                expect(uss.getPageScroller(false)).to.equal(win.document.body);
              });
          });        
    })
})