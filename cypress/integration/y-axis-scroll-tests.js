var testSite = Cypress.env("testSite")

function bodyScrollTopShouldToBe(value) {
    cy.get("body")
    .invoke("scrollTop")
    .should("equal", value);
}

describe("scrollYTo-Body", function() {
    var uss;
    it("Vertically scrolls the body to n pixels", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(500, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                bodyScrollTopShouldToBe(500);
            })         
    })
})

describe("scrollYBy-Body", function() {
    var uss;
    it("Vertically scrolls the body by n pixels", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                return new Cypress.Promise(resolve => {
                    uss.scrollYBy(100, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                bodyScrollTopShouldToBe(100);
            })         
    })
})

describe("scrollYToBy-StillStart-True-Body", function() {
    var uss;
    it("Vertically scrolls the body to n1 pixels and then replace that animation with a n2 pixels scroll", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(500);
                    uss.scrollYBy(200, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                bodyScrollTopShouldToBe(200);
            })         
    })
})

describe("scrollYToBy-StillStart-False-Body", function() {
    var uss;
    it("Vertically scrolls the body to n1 pixels and then extends that animation by n2 pixels", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(100);
                    uss.scrollYBy(200, uss.getPageScroller(), resolve, false);
                });
            }).then(() => {
                bodyScrollTopShouldToBe(300);
            })         
    })
})

describe("isYScrolling-Body", function() {
    var uss;
    var wasYScrolling;
    var isYScrolling;
    it("Checks the isYScrolling method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(100, uss.getPageScroller(), () => {
                        isYScrolling = uss.isYscrolling();
                        resolve();
                    });
                    wasYScrolling = uss.isYscrolling();
                });
            }).then(() => {
                expect(wasYScrolling).to.be.true;
                expect(isYScrolling).to.be.false;
            })         
    })
})
