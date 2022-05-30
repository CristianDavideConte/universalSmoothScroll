Cypress.config("defaultCommandTimeout", Cypress.env("preferredTimeout"));

function bodyScrollLeftShouldToBe(value) {
    cy.get("body")
      .invoke("scrollLeft")
      .should("equal", value);
}

describe("setXStepLengthCalculator-Body", function() {
    var uss;
    var _testCalculatorInvalidTypeString = () => {return ""};
    var _testCalculatorInvalidTypeNaN = () => {return NaN};
    var _testCalculatorValidType1 = () => 10;
    var _testCalculatorValidType2 = () => 5;
    var _testCalculatorValidType3 = () => 0.00000001; //valid but takes more than the default testing timeout
    it("Tests the setXStepLengthCalculator method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              //test invalid stepLengthCalculators
              uss.setXStepLengthCalculator(_testCalculatorInvalidTypeString, uss.getPageScroller(), false, true);
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.be.undefined;
              
              uss.setXStepLengthCalculator(_testCalculatorInvalidTypeString, uss.getPageScroller(), true, true);
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
              
              uss.setXStepLengthCalculator(_testCalculatorInvalidTypeNaN, uss.getPageScroller(), false, true);
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.be.undefined;
              
              uss.setXStepLengthCalculator(_testCalculatorInvalidTypeNaN, uss.getPageScroller(), true, true);
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;  

              //test valid stepLengthCalculators
              uss.setXStepLengthCalculator(_testCalculatorValidType1, uss.getPageScroller(), false, true);
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType1);  

              uss.setXStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), false, true);
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType2);  

              uss.setXStepLengthCalculator(_testCalculatorValidType3, uss.getPageScroller(), false, true);
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
              
              uss.setXStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2); 

              uss.stopScrollingY();
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
              
              uss.setXStepLengthCalculator(_testCalculatorValidType2, uss.getPageScroller(), true, true);
              expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.equal(_testCalculatorValidType2);
              
              new Cypress.Promise(resolve => {
                  uss.scrollXTo(100, uss.getPageScroller(), resolve);
              }).then(() => {
                  bodyScrollLeftShouldToBe(100);
                  expect(uss.getXStepLengthCalculator(uss.getPageScroller(), false)).to.equal(_testCalculatorValidType3);
              });
          });     
    });
})

describe("setXStepLength-Body", function() {
    var uss;
    var _testStepInvalidTypeString = "";
    var _testStepInvalidTypeNaN = NaN;
    var _testStepValidType1 = 10;
    var _testStepValidType2 = 5;
    it("Tests the setXStepLength method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
              const _initialStepLength = uss.getXStepLength(); 

              //test invalid step lengths
              uss.setXStepLength(_testStepInvalidTypeString, uss.getPageScroller());
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_initialStepLength);
              
              uss.setXStepLength(_testStepInvalidTypeNaN, uss.getPageScroller());
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_initialStepLength);  

              //test valid step lengths
              uss.setXStepLength(_testStepValidType1, uss.getPageScroller());
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType1);  

              uss.setXStepLength(_testStepValidType2, uss.getPageScroller());
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2); 

              uss.stopScrollingY();
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              
              uss.setXStepLength(_testStepInvalidTypeString, uss.getPageScroller());
              expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              
              new Cypress.Promise(resolve => {
                  uss.scrollXTo(100, uss.getPageScroller(), resolve);
              }).then(() => {
                  bodyScrollLeftShouldToBe(100);
                  expect(uss.getXStepLength(uss.getPageScroller())).to.equal(_testStepValidType2);
              });
          });     
    });
})
