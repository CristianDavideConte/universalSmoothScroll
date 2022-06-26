/**
 * This file contains the tests for the following USS API functions:
 *  - isYScrolling
 *  - scrollYTo
 *  - scrollYBy
 *  - stopScrollingY
 */

describe("isYScrolling-Body", function() {
    var uss;
    var wasYScrolling;
    var isYScrolling;
    it("Tests the isYScrolling method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.isYScrolling, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYTo(100, uss.getPageScroller(), () => {
                                isYScrolling = uss.isYScrolling();
                                resolve();
                            });
                            wasYScrolling = uss.isYScrolling();
                        }
                    ).then(
                        () => {
                            expect(wasYScrolling).to.be.true;
                            expect(isYScrolling).to.be.false;
                        }
                    );
                });
            });         
    });
})

describe("isYScrolling-StoppedScrollingWhileAnimating-Body", function() {
    var uss;
    var wasYScrolling;
    var isYScrolling;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ < 10) return total / 10;
            uss.stopScrollingY(container);
            isYScrolling = uss.isYScrolling(container);
            _resolve();
        }
    }
    it("Tests the isYScrolling method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                expect(uss.isYScrolling()).to.be.false;
                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);


                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollYTo(100, uss.getPageScroller());
                        wasYScrolling = uss.isYScrolling();
                    }
                ).then(
                    () => {
                        expect(wasYScrolling).to.be.true;
                        expect(isYScrolling).to.be.false;
                    }
                );
            });         
    });
})

describe("scrollYTo-Body", function() {
    var uss;
    it("Vertically scrolls the body to n pixels", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.scrollYTo, {
                    0: [[Cypress.env("failingValuesNoUndefined")],
                        [Cypress.env("failingValuesNoUndefined")]
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {                        
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYTo(500, uss.getPageScroller(), resolve);
                        }
                    ).then(
                        () => {
                            cy.bodyScrollTopShouldToBe(500);
                        }
                    );
                });
            });       
    });
})

describe("scrollYTo-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Tests the scrollYTo method whenever a scroll-animation is immediately stopped", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(500, uss.getPageScroller(), () => count++);
                        uss.stopScrollingY(uss.getPageScroller(), resolve);
                    }
                ).then(
                    () => {
                        cy.bodyScrollTopShouldToBe(0);
                        expect(count).to.equal(0);
                    }
                );
            });      
    });
})

describe("scrollYToBy-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Tests the scrollYTo method whenever a scroll-animation is immediately stopped and restarted with the scrollYBy method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
   
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(500, uss.getPageScroller(), () => count++);
                        uss.stopScrollingY(uss.getPageScroller());
                        uss.scrollYBy(250, uss.getPageScroller(), () => {
                            count++;
                            resolve();
                        });
                    }
                ).then(
                    () => {
                        cy.bodyScrollTopShouldToBe(250);
                        expect(count).to.equal(1);
                    }
                );
            });         
    });
})

describe("scrollYToTo-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Tests the scrollYTo method whenever a scroll-animation is immediately stopped and restarted with the scrollYTo method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(500, uss.getPageScroller(), () => count++);
                        uss.stopScrollingY(uss.getPageScroller());
                        uss.scrollYTo(250, uss.getPageScroller(), () => {
                            count++;
                            resolve();
                        });
                    }
                ).then(
                    () => {
                        cy.bodyScrollTopShouldToBe(250);
                        expect(count).to.equal(1);
                    }
                );
            });         
    });
})

describe("scrollYTo-StoppedScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isYScrolling()) return total; //testing phase of the setYStepLengthCalculator
            i++;
            if(i < 10) return total / 10;
            uss.stopScrollingY(container, _resolve);
        }
    }
    it("Tests the scrollYTo method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);   

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollYTo(100, uss.getPageScroller());
                    }
                ).then(
                    () => {
                        cy.bodyScrollTopShouldToBe(90);
                    }
                );
            });         
    });
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
    it("Tests if the scrollYTo method can replace the current scroll-animation from inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);
  
                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollYTo(100, uss.getPageScroller());
                    }
                ).then(
                    () => {
                        cy.bodyScrollTopShouldToBe(50);
                    }
                );
            });         
    });
})

describe("scrollYBy-Body", function() {
    var uss;
    it("Vertically scrolls the body by n pixels", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                cy.testFailingValues(uss.scrollYBy, {
                    0: [[Cypress.env("failingValuesNoUndefined")],
                        [Cypress.env("failingValuesNoUndefined")]
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYBy(100, uss.getPageScroller(), resolve);
                        }
                    ).then(
                        () => {
                            cy.bodyScrollTopShouldToBe(100);
                        }
                    );
                });
            });         
    });
})

describe("scrollYToBy-StillStart-True-Body", function() {
    var uss;
    var _originalTimestampEqualsTimeStamp, _remaning, _total;
    
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isYScrolling()) return total; //testing phase of the setYStepLengthCalculator
            if(!_remaning) _remaning = remaning;
            if(!_originalTimestampEqualsTimeStamp) _originalTimestampEqualsTimeStamp = originalTimestamp === currentTimestamp;
            if(!_total) _total = total;
            return total / 10;
        }
    }
    it("Vertically scrolls the body to n1 pixels and then replace that animation with a n2 pixels scroll", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map(); 
                
                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true); 
                    
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(500, uss.getPageScroller()); 
                        uss.scrollYBy(200, uss.getPageScroller(), resolve, true);
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStamp).to.be.true;
                        expect(_remaning).to.equal(200);
                        expect(_total).to.equal(200);
                        cy.bodyScrollTopShouldToBe(200);
                    }
                );
            });        
    });
})

describe("scrollYToBy-StillStart-False-Body", function() {
    var uss;
    var _secondPhase = false;
    var _originalTimestampEqualsTimeStamp, _remaning, _total;
    
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isYScrolling()) return total; //testing phase of the setYStepLengthCalculator
            if(_secondPhase) {
                _remaning = remaning;
                _originalTimestampEqualsTimeStamp = originalTimestamp === currentTimestamp;
                _total = total;
                _secondPhase = false;
            }
            return total / 10;
        }
    }
    it("Vertically scrolls the body to n1 pixels and then extends that animation by n2 pixels", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map(); 
                
                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);        
                    
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(100, uss.getPageScroller()); 
                        win.requestAnimationFrame(function activateSecondPhase(i = 0) {
                            if(i < 2) win.requestAnimationFrame(() => activateSecondPhase(i + 1));
                            else {
                                _secondPhase = true;
                                uss.scrollYBy(200, uss.getPageScroller(), resolve, false);
                            }
                        });
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStamp).to.be.true;
                        expect(_remaning).to.be.greaterThan(100);
                        expect(_remaning).to.be.lessThan(300);
                        expect(_total).to.equal(300);
                        cy.bodyScrollTopShouldToBe(300);
                    }
                );
            });        
    });
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
    it("Tests if the scrollYBy method with stillStart = \"false\" can extend a scroll-animation from inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                uss.setYStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);
                
                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollYTo(100, uss.getPageScroller());
                    }
                ).then(
                    () => {
                        cy.bodyScrollTopShouldToBe(190);
                    }
                );   
            });   
    });
})

describe("stopScrollingY-Body", function() {
    var uss;
    it("Tests the stopScrollingY method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.stopScrollingY, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    const _elements = Array.from(win.document.getElementsByTagName("*"))
                                            .filter(el => uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop));
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    _elements.forEach(el => {
                        const _randomBetween0and1 = Math.min(Math.random(), 0.5);
                        uss.scrollYTo(_randomBetween0and1 * el.scrollHeight, el); 
                        expect(uss.isYScrolling(el)).to.be.true;
                        win.setTimeout(() => uss.stopScrollingY(el), _randomBetween0and1 * 100);
                    });

                    cy.waitForUssCallback(
                        undefined //default value: resolve after timeout
                    ).then(
                        () => {
                            _elements.forEach(el => {
                                expect(uss.isYScrolling(el)).to.be.false;
                                expect(uss.getScrollYCalculator(el)()).to.be.greaterThan(0);
                            })
                        }
                    );
                });
            });         
    });
})

describe("stopScrollingY-immediatelyStopped-Body", function() {
    var uss;
    it("Initialize a series of scroll-animations on the y-axis of all scrollable containers and immediately stop them", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.stopScrollingY, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    const _elements = Array.from(win.document.getElementsByTagName("*"))
                                            .filter(el => uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop));
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    _elements.forEach(el => {
                        const _randomBetween0and1 = Math.min(Math.random(), 0.5);
                        uss.scrollYTo(_randomBetween0and1 * el.scrollHeight, el); 
                        expect(uss.isYScrolling(el)).to.be.true;
                        uss.stopScrollingY(el);
                        expect(uss.isYScrolling(el)).to.be.false;
                    });
                });
            });         
    });
})