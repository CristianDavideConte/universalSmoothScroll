const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("setWarningLogger-tests.html"); 
})

describe("setWarningLogger", function() {
  let uss;
  let validLogger1 = (a,b,c) => console.log(a,b,c);
  let validLogger2 = () => console.log("");
  let validLogger3 = () => {}
  it("Tests the setWarningLogger method", function() {
      cy.window()
        .then((win) => {
            uss = win.uss;
            const _originalLogger = uss._warningLogger;

            cy.testFailingValues(uss.setWarningLogger, {
              0: [constants.failingValuesAllNoUndefined]
            }, 
            (res, v1, v2, v3, v4, v5, v6, v7) => {
              expect(res).to.throw(constants.defaultUssException);
              expect(uss._warningLogger).to.equal(_originalLogger);
            })
            .then(() => {
              uss.setWarningLogger(validLogger1);
              expect(uss._warningLogger).to.equal(validLogger1);

              uss.setWarningLogger(validLogger2);
              expect(uss._warningLogger).to.equal(validLogger2);

              uss.setWarningLogger(validLogger3);
              expect(uss._warningLogger).to.equal(validLogger3);
            });      
        });        
  })
})

