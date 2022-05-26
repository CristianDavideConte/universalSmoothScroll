Cypress.config("defaultCommandTimeout", Cypress.env("preferredTimeout"));

function bodyScrollTopShouldToBe(value) {
    cy.get("body")
      .invoke("scrollTop")
      .should("equal", value);
}

describe("setYStepLengthCalculator-Body", function() {
    var uss;
    var _testCalculatorInvalidTypeString = () => {return ""};
    var _testCalculatorInvalidTypeNaN = () => {return NaN};
    var _testCalculatorValidType1 = () => 10;
    var _testCalculatorValidType2 = () => 5;
    var _testCalculatorValidType3 = () => 0.00000001; //valid but takes more than the default testing timeout
    it("Checks the setYStepLengthCalculator method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              //test invalid stepLengthCalculators
              uss.setYStepLengthCalculator(_testCalculatorInvalidTypeString, uss.getPageScroller(), false, true);
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.be.undefined;
              
              uss.setYStepLengthCalculator(_testCalculatorInvalidTypeString, uss.getPageScroller(), true, true);
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
              
              uss.setYStepLengthCalculator(_testCalculatorInvalidTypeNaN, uss.getPageScroller(), false, true);
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.be.undefined;
              
              uss.setYStepLengthCalculator(_testCalculatorInvalidTypeNaN, uss.getPageScroller(), true, true);
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;  

              //test valid stepLengthCalculators
              uss.setYStepLengthCalculator(_testCalculatorValidType1, uss.getPageScroller(), false, true);
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType1);  

              uss.setYStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), false, true);
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType2);  

              uss.setYStepLengthCalculator(_testCalculatorValidType3, uss.getPageScroller(), false, true);
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
              
              uss.setYStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2); 

              uss.stopScrollingY();
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
              
              uss.setYStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
              expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2);
              
              new Cypress.Promise(resolve => {
                  uss.scrollYTo(100, uss.getPageScroller(), resolve);
              }).then(() => {
                  bodyScrollTopShouldToBe(100);
                  expect(uss.getYStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
              });
          });     
    })
})

describe("setYStepLength-Body", function() {
    var uss;
    var _testStepInvalidTypeString = "";
    var _testStepInvalidTypeNaN = NaN;
    var _testStepValidType1 = 10;
    var _testStepValidType2 = 5;
    it("Checks the setYStepLength method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
              const _initialStepLength = uss.getYStepLength();  

              //test invalid step lengths
              uss.setYStepLength(_testStepInvalidTypeString, uss.getPageScroller());
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_initialStepLength);
              
              uss.setYStepLength(_testStepInvalidTypeNaN, uss.getPageScroller());
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_initialStepLength); 

              //test valid step lengths
              uss.setYStepLength(_testStepValidType1, uss.getPageScroller());
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType1);  

              uss.setYStepLength(_testStepValidType2, uss.getPageScroller());
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);  

              uss.stopScrollingY();
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              
              uss.setYStepLength(_testStepInvalidTypeString, uss.getPageScroller());
              expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              
              new Cypress.Promise(resolve => {
                  uss.scrollYTo(100, uss.getPageScroller(), resolve);
              }).then(() => {
                  bodyScrollTopShouldToBe(100);
                  expect(uss.getYStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              });
          });     
    })
})
