var testSite = Cypress.env("testSite")

function bodyScrollTopShouldToBe(value) {
    cy.get("body")
    .invoke("scrollTop")
    .should("equal", value);
}

describe("getFinalYPosition-Body", function() {
    var uss;
    var finalYPosition;
    it("Checks the getFinalYPosition method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(100, uss.getPageScroller(), resolve);
                    finalYPosition = uss.getFinalYPosition();
                });
            }).then(() => {
                bodyScrollTopShouldToBe(100);
                expect(finalYPosition).to.equal(100);
                expect(finalYPosition).to.equal(uss.getFinalYPosition());
                expect(finalYPosition).to.equal(uss.getScrollYCalculator()());
            })         
    })
})


describe("getScrollYDirection-Body", function() {
    var uss;
    var scrollYDirectionUp, scrollYDirectionDown;
    it("Checks the getFinalYPosition method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(100, uss.getPageScroller(), () => {
                        uss.scrollYTo(50, uss.getPageScroller(), resolve);
                        scrollYDirectionUp = uss.getScrollYDirection();
                    });
                    scrollYDirectionDown = uss.getScrollYDirection();
                });
            }).then(() => {
                expect(scrollYDirectionUp).to.equal(-1);
                expect(scrollYDirectionDown).to.equal(1);
                expect(uss.getScrollYDirection()).to.equal(0);
            })         
    })
})

describe("getYStepLengthCalculator-Body", function() {
    var uss;
    var nonTempTestCalculator = () => 10;
    var tempTestCalculator = r => r / 20 + 1;
    it("Checks the getYStepLengthCalculator method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                expect(uss.getYStepLengthCalculator()).to.be.undefined;
                
                uss.setYStepLengthCalculator(nonTempTestCalculator, uss.getPageScroller(), false, true);
                expect(uss.getYStepLengthCalculator()).to.equal(nonTempTestCalculator);

                uss.setYStepLengthCalculator(tempTestCalculator, uss.getPageScroller(), true, true);
                expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.equal(tempTestCalculator);
              
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(100, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                expect(uss.getYStepLengthCalculator()).to.equal(nonTempTestCalculator);
                expect(uss.getYStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
            })         
    })
})


describe("getYStepLength-Body", function() {
    var uss;
    it("Checks the getYStepLength method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                expect(Number.isFinite(uss.getYStepLength())).to.be.true;
                expect(uss.getYStepLength() > 0).to.be.true;

                uss.setYStepLength(10);
                expect(uss.getYStepLength()).to.equal(10);
              
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(100, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                expect(uss.getYStepLength()).to.equal(10);
            })         
    })
})


describe("getMaxScrollY-Body", function() {
    var uss;
    it("Checks the getYStepLength method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                const _expectedMaxScrollY = uss.getPageScroller().scrollHeight / 2 + uss.getScrollbarsMaxDimension();
                
                expect(Number.isFinite(uss.getMaxScrollY())).to.be.true;
                expect(uss.getMaxScrollY() > 0).to.be.true;
                expect(uss.getMaxScrollY()).to.be.closeTo(_expectedMaxScrollY, 1);

                //test elements that are unscrollable on the y-axis 
                expect(uss.getMaxScrollY(win.document.getElementById("xScroller"))).to.equal(0);
                expect(uss.getMaxScrollY(win.document.getElementById("stopScrollingX"))).to.equal(0);
            })     
    })
})


describe("getYScrollableParent-Body", function() {
    var uss;
    it("Checks the getYScrollableParent method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                //test window, html and body
                expect(uss.getYScrollableParent(win)).to.be.null;  
                expect(uss.getYScrollableParent(win.document.documentElement)).to.be.null;   
                expect(uss.getYScrollableParent(uss.getPageScroller())).to.be.null;
                
                //test element with position:fixed
                expect(uss.getYScrollableParent(win.stopScrollingX)).to.be.null;
                
                //test elements with no constraint 
                expect(uss.getYScrollableParent(win.linear)).to.equal(win.easeFunctionSelectorList);
                expect(uss.getYScrollableParent(win.easeFunctionSelectorList)).to.equal(win.document.body);
                expect(uss.getYScrollableParent(win.document.getElementById("section12"))).to.equal(win.document.getElementById("yScrollerSection"));
            })     
    })
})