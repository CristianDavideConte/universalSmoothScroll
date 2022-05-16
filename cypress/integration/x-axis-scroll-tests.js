var testSite = Cypress.env("testSite")

function bodyScrollLeftShouldToBe(value) {
    cy.get("body")
    .invoke("scrollLeft")
    .should("equal", value);
}

describe("scrollXTo-Body", function() {
    var uss;
    it("Horizontally scrolls the body to n pixels", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(500, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(500);
            })         
    })
})

describe("scrollXTo-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Checks the scrollXTo method whenever a scroll animation is immediately stopped", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(500, uss.getPageScroller(), () => count++);
                    uss.stopScrollingX(uss.getPageScroller(), resolve);
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(0);
                expect(count).to.equal(0);
            })         
    })
})


describe("scrollXToBy-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Checks the scrollXTo method whenever a scroll animation is immediately stopped and restarted with the scrollXBy method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(500, uss.getPageScroller(), () => count++);
                    uss.stopScrollingX(uss.getPageScroller());
                    uss.scrollXTo(250, uss.getPageScroller(), () => {
                        count++;
                        resolve();
                    });
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(250);
                expect(count).to.equal(1);
            })         
    })
})

describe("scrollXTo-StoppedScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ < 10) return total / 10;
            uss.stopScrollingX();
            _resolve();
        }
    }
    it("Checks the scrollXTo method whenever a scroll animation is stopped inside a stepLengthCalculator", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                uss.setXStepLengthCalculator(_testCalculator());

                return new Cypress.Promise(resolve => {
                    _resolve = resolve;
                    uss.scrollXTo(100, uss.getPageScroller());
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(90);
            })         
    })
})

describe("scrollXBy-Body", function() {
    var uss;
    it("Horizontally scrolls the body by n pixels", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollXBy(100, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(100);
            })         
    })
})

describe("scrollXToBy-StillStart-True-Body", function() {
    var uss;
    it("Horizontally scrolls the body to n1 pixels and then replace that animation with a n2 pixels scroll", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(500);
                    uss.scrollXBy(200, uss.getPageScroller(), resolve);
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(200);
            })         
    })
})


describe("scrollXToBy-StillStart-False-ExtendedScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ === 10) uss.scrollXBy(90, uss.getPageScroller(), _resolve, false);
            return total / 10;
        }
    }
    it("Checks if the scrollYBy method with stillStart = \"false\" can extend a scroll animation from inside a stepLengthCalculator", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                uss.setXStepLengthCalculator(_testCalculator());
                return new Cypress.Promise(resolve => {
                    _resolve = resolve;
                    uss.scrollXTo(100, uss.getPageScroller());
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(190);
            })         
    })
})


describe("scrollXTo-scrollXTo-ReplaceScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ === 10) uss.scrollXTo(50, uss.getPageScroller(), _resolve);
            return total / 10;
        }
    }
    it("Checks if the scrollXTo method can replace the current scroll animation from inside a stepLengthCalculator", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                uss.setXStepLengthCalculator(_testCalculator());
                return new Cypress.Promise(resolve => {
                    _resolve = resolve;
                    uss.scrollXTo(100, uss.getPageScroller());
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(50);
            })         
    })
})

describe("scrollXToBy-StillStart-False-Body", function() {
    var uss;
    it("Horizontally scrolls the body to n1 pixels and then extends that animation by n2 pixels", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100);
                    uss.scrollXBy(200, uss.getPageScroller(), resolve, false);
                });
            }).then(() => {
                bodyScrollLeftShouldToBe(300);
            })         
    })
})

describe("isXScrolling-Body", function() {
    var uss;
    var wasXScrolling;
    var isXscrolling;
    it("Checks the isXScrolling method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                expect(uss.isXscrolling()).to.be.false;
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100, uss.getPageScroller(), () => {
                        isXscrolling = uss.isXscrolling();
                        resolve();
                    });
                    wasXScrolling = uss.isXscrolling();
                });
            }).then(() => {
                expect(wasXScrolling).to.be.true;
                expect(isXscrolling).to.be.false;
            })         
    })
})

describe("isXScrolling-StoppedScrollingWhileAnimating-Body", function() {
    var uss;
    var wasXScrolling;
    var isXScrolling;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ < 10) return total / 10;
            uss.stopScrollingX();
            isXScrolling = uss.isXscrolling();
            _resolve();
        }
    }
    it("Checks the isXScrolling method whenever a scroll animation is stopped inside a stepLengthCalculator", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                expect(uss.isXscrolling()).to.be.false;
                uss.setXStepLengthCalculator(_testCalculator());
                return new Cypress.Promise(resolve => {
                    _resolve = resolve;
                    uss.scrollXTo(100, uss.getPageScroller());
                    wasXScrolling = uss.isXscrolling();
                });
            }).then(() => {
                expect(wasXScrolling).to.be.true;
                expect(isXScrolling).to.be.false;
            })         
    })
})
