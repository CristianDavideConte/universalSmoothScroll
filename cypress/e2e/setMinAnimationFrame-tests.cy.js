const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("setMinAnimationFrame-tests.html"); 
})

describe("setMinAnimationFrame", function() {
    let uss;
    it("Tests the setMinAnimationFrame method", function() {
        cy.window()
          .then((win) => {
              uss = win.uss;

              uss.setMinAnimationFrame(10);
              expect(uss.getMinAnimationFrame()).to.equal(10);

              uss.setMinAnimationFrame(Math.pow(2, 30));
              expect(uss.getMinAnimationFrame()).to.equal(Math.pow(2, 30));
   
              cy.testFailingValues(uss.setMinAnimationFrame, {
                0: [constants.failingValuesNoPositiveNumberOrUndefined]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(res).to.throw(constants.defaultUssException);
                expect(uss.getMinAnimationFrame()).to.equal(Math.pow(2, 30));
              });
          });        
    })
})