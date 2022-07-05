const { constants } = require("../support/constants");

describe("setDebugMode", function() {
    let uss;
    it("Tests the setDebugMode method", function() {
        cy.visit("setDebugMode-tests.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              
              cy.testFailingValues(uss.setDebugMode, {
                0: [constants.failingValuesNoStringNoUndefined]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(uss.getDebugMode()).to.equal("");
              })
              .then(() => {
                uss.setDebugMode("test");
                expect(uss.getDebugMode()).to.equal("test");
  
                uss.setDebugMode("legacy");
                expect(uss.getDebugMode()).to.equal("legacy");
  
                uss.setDebugMode("disabled");
                expect(uss.getDebugMode()).to.equal("disabled");  
  
                uss.setDebugMode("Disabled");
                expect(uss.getDebugMode()).to.equal("Disabled");     
              });      
          });        
    })
})