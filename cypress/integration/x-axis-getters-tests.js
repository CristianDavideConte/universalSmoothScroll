var testSite = Cypress.env("testSite")

function bodyScrollLeftShouldToBe(value) {
    cy.get("body")
    .invoke("scrollLeft")
    .should("equal", value);
}

describe("getFinalXPosition-Body", function() {
    var uss;
    var finalXPosition;
    it("Checks the getFinalXPosition method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100, uss.getPageScroller(), resolve);
                    finalXPosition = uss.getFinalXPosition();
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(100);
                expect(finalXPosition).to.equal(100);
                expect(finalXPosition).to.equal(uss.getFinalXPosition());
                expect(finalXPosition).to.equal(uss.getScrollXCalculator()());
            })         
    })
})


describe("getScrollXDirection-Body", function() {
    var uss;
    var scrollYDirectionLeft, scrollYDirectionRight;
    it("Checks the getFinalXPosition method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100, uss.getPageScroller(), () => {
                        uss.scrollXTo(50, uss.getPageScroller(), resolve);
                        scrollYDirectionLeft = uss.getScrollXDirection();
                    });
                    scrollYDirectionRight = uss.getScrollXDirection();
                });
            }).then(() => {
                expect(scrollYDirectionLeft).to.equal(-1);
                expect(scrollYDirectionRight).to.equal(1);
                expect(uss.getScrollXDirection()).to.equal(0);
            })         
    })
})

describe("getXStepLengthCalculator-Body", function() {
    var uss;
    var nonTempTestCalculator = () => 10;
    var tempTestCalculator = r => r / 20 + 1;
    it("Checks the getXStepLengthCalculator method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                expect(uss.getXStepLengthCalculator()).to.be.undefined;
                
                uss.setXStepLengthCalculator(nonTempTestCalculator, uss.getPageScroller());
                expect(uss.getXStepLengthCalculator()).to.equal(nonTempTestCalculator);

                uss.setXStepLengthCalculator(tempTestCalculator, uss.getPageScroller(), true);
                expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.equal(tempTestCalculator);
              
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                expect(uss.getXStepLengthCalculator()).to.equal(nonTempTestCalculator);
                expect(uss.getXStepLengthCalculator(uss.getPageScroller(), true)).to.be.undefined;
            })         
    })
})


describe("getXStepLength-Body", function() {
    var uss;
    it("Checks the getXStepLength method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                expect(Number.isFinite(uss.getXStepLength())).to.be.true;
                expect(uss.getXStepLength() > 0).to.be.true;

                uss.setXStepLength(10);
                expect(uss.getXStepLength()).to.equal(10);
              
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                expect(uss.getXStepLength()).to.equal(10);
            })         
    })
})


describe("getMaxScrollX-Body", function() {
    var uss;
    it("Checks the getXStepLength method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                expect(Number.isFinite(uss.getMaxScrollX())).to.be.true;
                expect(uss.getMaxScrollX() > 0).to.be.true;
                expect(uss.getMaxScrollX()).to.equal(uss.getPageScroller().scrollWidth / 2 + uss.getScrollbarsMaxDimension());

                //test elements that are unscrollable on the x-axis 
                expect(uss.getMaxScrollX(win.document.getElementById("yScroller"))).to.equal(0);
                expect(uss.getMaxScrollX(win.document.getElementById("stopScrollingY"))).to.equal(0);
            })     
    })
})


describe("getXScrollableParent-Body", function() {
    var uss;
    it("Checks the getXScrollableParent method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                //test window, html and body
                expect(uss.getXScrollableParent(win)).to.be.null;  
                expect(uss.getXScrollableParent(win.document.documentElement)).to.be.null;   
                expect(uss.getXScrollableParent(uss.getPageScroller())).to.be.null;
                
                //test element with position:fixed
                expect(uss.getXScrollableParent(win.stopScrollingX)).to.be.null;
                
                //test elements with no constraint 
                expect(uss.getXScrollableParent(win.linear)).to.equal(win.document.body);
                expect(uss.getXScrollableParent(win.easeFunctionSelectorList)).to.equal(win.document.body);
                expect(uss.getXScrollableParent(win.document.getElementById("section11"))).to.equal(win.document.getElementById("xScrollerSection"));
            })     
    })
})