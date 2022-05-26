Cypress.config("defaultCommandTimeout", Cypress.env("preferredTimeout"));
var testSite = Cypress.env("testSite")

function bodyScrollTopShouldToBe(value) {
    cy.get("body")
      .invoke("scrollTop")
      .should("equal", value);
}

describe("scrollYTo-Body", function() {
    var uss;
    it("Vertically scrolls the body to n pixels", function(){
        cy.visit(testSite); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
              new Cypress.Promise(resolve => {
                  uss.scrollYTo(500, uss.getPageScroller(), resolve);
              }).then(() => {
                  bodyScrollTopShouldToBe(500);
              });
          });       
    })
})

describe("scrollYTo-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Checks the scrollYTo method whenever a scroll animation is immediately stopped", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(500, uss.getPageScroller(), () => count++);
                    uss.stopScrollingY(uss.getPageScroller(), resolve);
                });
            }).then(() => {
                bodyScrollTopShouldToBe(0);
                expect(count).to.equal(0);
            })         
    })
})


describe("scrollYToBy-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Checks the scrollYTo method whenever a scroll animation is immediately stopped and restarted with the scrollYBy method", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(500, uss.getPageScroller(), () => count++);
                    uss.stopScrollingY(uss.getPageScroller());
                    uss.scrollYTo(250, uss.getPageScroller(), () => {
                        count++;
                        resolve();
                    });
                });
            }).then(() => {
                bodyScrollTopShouldToBe(250);
                expect(count).to.equal(1);
            })         
    })
})

describe("scrollYTo-StoppedScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isYscrolling()) return total; //testing phase of the setYStepLengthCalculator
            i++;
            if(i < 10) return total / 10;
            uss.stopScrollingY(container, _resolve);
        }
    }
    it("Checks the scrollYTo method whenever a scroll animation is stopped inside a stepLengthCalculator", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
            
                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);   
                return new Cypress.Promise(resolve => {
                    _resolve = resolve;
                    uss.scrollYTo(100, uss.getPageScroller());
                });     
            }).then(() => {
                bodyScrollTopShouldToBe(90);
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
                uss._containersData = new Map();
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
                uss._containersData = new Map();
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
                uss._containersData = new Map();
                return new Cypress.Promise(resolve => {
                    uss.scrollYTo(100);
                    uss.scrollYBy(200, uss.getPageScroller(), resolve, false);
                });
            }).then(() => {
                bodyScrollTopShouldToBe(300);
            })         
    })
})

describe("scrollYToBy-StillStart-False-ExtendedScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ === 10) uss.scrollYBy(90, uss.getPageScroller(), _resolve, false);
            return total / 10;
        }
    }
    it("Checks if the scrollYBy method with stillStart = \"false\" can extend a scroll animation from inside a stepLengthCalculator", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);
                return new Cypress.Promise(resolve => {
                    _resolve = resolve;
                    uss.scrollYTo(100, uss.getPageScroller());
                });
            }).then(() => {
                bodyScrollTopShouldToBe(190);
            })         
    })
})


describe("scrollYTo-scrollYTo-ReplaceScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ === 10) uss.scrollYTo(50, uss.getPageScroller(), _resolve);
            return total / 10;
        }
    }
    it("Checks if the scrollYTo method can replace the current scroll animation from inside a stepLengthCalculator", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);
                return new Cypress.Promise(resolve => {
                    _resolve = resolve;
                    uss.scrollYTo(100, uss.getPageScroller());
                });
            }).then(() => {
                bodyScrollTopShouldToBe(50);
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
                uss._containersData = new Map();
                expect(uss.isYscrolling()).to.be.false;
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

describe("isYScrolling-StoppedScrollingWhileAnimating-Body", function() {
    var uss;
    var wasYScrolling;
    var isYScrolling;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ < 10) return total / 10;
            uss.stopScrollingY();
            isYScrolling = uss.isYscrolling();
            _resolve();
        }
    }
    it("Checks the isYScrolling method whenever a scroll animation is stopped inside a stepLengthCalculator", function(){
        cy.visit(testSite) 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                expect(uss.isYscrolling()).to.be.false;
                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);
                return new Cypress.Promise(resolve => {
                    _resolve = resolve;
                    uss.scrollYTo(100, uss.getPageScroller());
                    wasYScrolling = uss.isYscrolling();
                });
            }).then(() => {
                expect(wasYScrolling).to.be.true;
                expect(isYScrolling).to.be.false;
            })         
    })
})
