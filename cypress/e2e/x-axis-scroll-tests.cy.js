/**
 * This file contains the tests for the following USS API functions:
 *  - isXScrolling
 *  - scrollXTo
 *  - scrollXBy
 */

describe("isXScrolling-Body", function() {
    var uss;
    var wasXScrolling;
    var isXscrolling;
    it("Tests the isXScrolling method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();

              cy.testFailingValues(uss.isXscrolling, {
                0: [Infinity],
                1: [-Infinity],
                2: [true],
                3: [false],
                4: [NaN],
                61: [10],
                62: [-1],
                7: [0],
                8: [null],
                11: [Object]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(res).to.be.undefined;
                expect(uss.isXscrolling()).to.be.false;
              })
              .then(() => {
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(100, uss.getPageScroller(), () => {
                        isXscrolling = uss.isXscrolling();
                        resolve();
                    });
                    wasXScrolling = uss.isXscrolling();
                }).then(() => {
                    expect(wasXScrolling).to.be.true;
                    expect(isXscrolling).to.be.false;
                });
            });
        });         
    });
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
    it("Tests the isXScrolling method whenever a scroll animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();

              expect(uss.isXscrolling()).to.be.false;
              uss.setXStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);

              return new Cypress.Promise(resolve => {
                  _resolve = resolve;
                  uss.scrollXTo(100, uss.getPageScroller());
                  wasXScrolling = uss.isXscrolling();
              }).then(() => {
                  expect(wasXScrolling).to.be.true;
                  expect(isXScrolling).to.be.false;
              });
          });         
    });
})

describe("scrollXTo-Body", function() {
    var uss;
    it("Horizontally scrolls the body to n pixels", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
              
              cy.testFailingValues(uss.scrollXTo, {
                0: [Infinity],
                1: [-Infinity],
                2: [true],
                3: [false],
                4: [NaN],
                8: [null],
                9: [undefined],
                10: [],
                11: [Object],
                12: [10, Infinity],
                12: [10, -Infinity],
                12: [10, true],
                12: [10, false],
                12: [10, NaN],
                12: [10, null],
                12: [10, Object],
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(uss.isXscrolling()).to.be.false;
              })
              .then(() => {
                return new Cypress.Promise(resolve => {
                    uss.scrollXTo(500, uss.getPageScroller(), resolve);
                }).then(() => {
                    cy.bodyScrollLeftShouldToBe(500);
                });
            });
          });        
    });
})

describe("scrollXTo-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Tests the scrollXTo method whenever a scroll animation is immediately stopped", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();

              return new Cypress.Promise(resolve => {
                  uss.scrollXTo(500, uss.getPageScroller(), () => count++);
                  uss.stopScrollingX(uss.getPageScroller(), resolve);
              }).then(() => {
                  cy.bodyScrollLeftShouldToBe(0);
                  expect(count).to.equal(0);
              });
          });         
    });
})

describe("scrollXToBy-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Tests the scrollXTo method whenever a scroll animation is immediately stopped and restarted with the scrollXBy method", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();

              return new Cypress.Promise(resolve => {
                  uss.scrollXTo(500, uss.getPageScroller(), () => count++);
                  uss.stopScrollingX(uss.getPageScroller());
                  uss.scrollXBy(250, uss.getPageScroller(), () => {
                      count++;
                      resolve();
                  });
              }).then(() => {
                  cy.bodyScrollLeftShouldToBe(250);
                  expect(count).to.equal(1);
              });
          });         
    });
})

describe("scrollXToTo-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Tests the scrollXTo method whenever a scroll animation is immediately stopped and restarted with the scrollXTo method", function() {
        cy.visit("index.html"); 
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
              }).then(() => {
                  cy.bodyScrollLeftShouldToBe(250);
                  expect(count).to.equal(1);
              });
          });         
    });
})

describe("scrollXTo-StoppedScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            if(!uss.isXscrolling()) return total; //testing phase of the setXStepLengthCalculator
            i++;
            if(i < 10) return total / 10;
            uss.stopScrollingX(container, _resolve);
        }
    }
    it("Tests the scrollXTo method whenever a scroll animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
          
              uss.setXStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true); 

              return new Cypress.Promise(resolve => {
                  _resolve = resolve;
                  uss.scrollXTo(100, uss.getPageScroller());
              }).then(() => {
                  cy.bodyScrollLeftShouldToBe(90);
              });     
          });         
    });
})

describe("scrollXBy-Body", function() {
    var uss;
    it("Horizontally scrolls the body by n pixels", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();
              
              cy.testFailingValues(uss.scrollXBy, {
                0: [Infinity],
                1: [-Infinity],
                2: [true],
                3: [false],
                4: [NaN],
                8: [null],
                9: [undefined],
                10: [],
                11: [Object],
                12: [10, Infinity],
                12: [10, -Infinity],
                12: [10, true],
                12: [10, false],
                12: [10, NaN],
                12: [10, null],
                12: [10, Object],
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(uss.isXscrolling()).to.be.false;
              })
              .then(() => {
                return new Cypress.Promise(resolve => {
                    uss.scrollXBy(100, uss.getPageScroller(), resolve);
                }).then(() => {
                    cy.bodyScrollLeftShouldToBe(100);
                });
            });
        });         
    });
})

describe("scrollXToBy-StillStart-True-Body", function() {
    var uss;
    var _originalTimestampEqualsTimeStamp, _remaning, _total;
    
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            if(!uss.isXscrolling()) return total; //testing phase of the setXStepLengthCalculator
            if(!_remaning) _remaning = remaning;
            if(!_originalTimestampEqualsTimeStamp) _originalTimestampEqualsTimeStamp = originalTimestamp === currentTimestamp;
            if(!_total) _total = total;
            return total / 10;
        }
    }
    it("Horizontally scrolls the body to n1 pixels and then replace that animation with a n2 pixels scroll", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map(); 
              
              uss.setXStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true); 
              
              return new Cypress.Promise(resolve => {
                  uss.scrollXTo(500, uss.getPageScroller()); 
                  uss.scrollXBy(200, uss.getPageScroller(), resolve, true);
              }).then(() => {
                  expect(_originalTimestampEqualsTimeStamp).to.be.true;
                  expect(_remaning).to.equal(200);
                  expect(_total).to.equal(200);
                  cy.bodyScrollLeftShouldToBe(200);
              });
          });        
    });
})

describe("scrollXToBy-StillStart-False-Body", function() {
    var uss;
    var _secondPhase = false;
    var _originalTimestampEqualsTimeStamp, _remaning, _total;
    
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            if(!uss.isXscrolling()) return total; //testing phase of the setXStepLengthCalculator
            if(_secondPhase) {
                _remaning = remaning;
                _originalTimestampEqualsTimeStamp = originalTimestamp === currentTimestamp;
                _total = total;
                _secondPhase = false;
            }
            return total / 10;
        }
    }
    it("Horizontally scrolls the body to n1 pixels and then extends that animation by n2 pixels", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map(); 
              
              uss.setXStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true); 
              
              return new Cypress.Promise(resolve => {
                  uss.scrollXTo(100, uss.getPageScroller()); 
                  setTimeout(() => {
                    _secondPhase = true;
                    uss.scrollXBy(200, uss.getPageScroller(), resolve, false);
                  }, 10);
              }).then(() => {
                  expect(_originalTimestampEqualsTimeStamp).to.be.true;
                  expect(_remaning).to.be.greaterThan(100);
                  expect(_remaning).to.be.lessThan(300);
                  expect(_total).to.equal(300);
                  cy.bodyScrollLeftShouldToBe(300);
              });
          });        
    });
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
    it("Tests if the scrollYBy method with stillStart = \"false\" can extend a scroll animation from inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();

              uss.setXStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);

              return new Cypress.Promise(resolve => {
                  _resolve = resolve;
                  uss.scrollXTo(100, uss.getPageScroller());
              }).then(() => {
                  cy.bodyScrollLeftShouldToBe(190);
              });
          });         
    });
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
    it("Tests if the scrollXTo method can replace the current scroll animation from inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();

              uss.setXStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);

              return new Cypress.Promise(resolve => {
                  _resolve = resolve;
                  uss.scrollXTo(100, uss.getPageScroller());
              }).then(() => {
                  cy.bodyScrollLeftShouldToBe(50);
              });
          });         
    });
})