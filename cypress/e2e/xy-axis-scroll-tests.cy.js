/**
 * This file contains the tests for the following USS API functions:
 *  - isScrolling
 *  - scrollTo
 *  - scrollBy
 *  - stopScrolling
 *  - stopScrollingAll
 */

describe("isScrolling-scrollXAnimation-Body", function() {
    var uss;
    var wasScrolling;
    var isScrolling;
    it("Tests the isScrolling method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.isScrolling, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollXTo(100, uss.getPageScroller(), () => {
                                isScrolling = uss.isScrolling();
                                resolve();
                            });
                            wasScrolling = uss.isScrolling();
                        }
                    ).then(
                        () => {
                            expect(wasScrolling).to.be.true;
                            expect(isScrolling).to.be.false;
                        }
                    );
                });
            });         
    });
})

describe("isScrolling-scrollYAnimation-Body", function() {
    var uss;
    var wasScrolling;
    var isScrolling;
    it("Tests the isScrolling method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.isScrolling, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYTo(100, uss.getPageScroller(), () => {
                                isScrolling = uss.isScrolling();
                                resolve();
                            });
                            wasScrolling = uss.isScrolling();
                        }
                    ).then(
                        () => {
                            expect(wasScrolling).to.be.true;
                            expect(isScrolling).to.be.false;
                        }
                    );
                });
            });         
    });
})

describe("isScrolling-scrollXYAnimation-Body", function() {
    var uss;
    var wasScrolling;
    var isScrolling;
    it("Tests the isScrolling method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.isScrolling, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollTo(100, 200, uss.getPageScroller(), () => {
                                isScrolling = uss.isScrolling();
                                resolve();
                            });
                            wasScrolling = uss.isScrolling();
                        }
                    ).then(
                        () => {
                            expect(wasScrolling).to.be.true;
                            expect(isScrolling).to.be.false;
                        }
                    );
                });
            });         
    });
})

describe("isScrolling-StoppedScrollingWhileAnimating-scrollXAnimation-Body", function() {
    var uss;
    var wasScrolling;
    var isScrolling;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ < 10) return total / 10;
            uss.stopScrolling(container);
            isScrolling = uss.isScrolling(container);
            _resolve();
        }
    }
    it("Tests the isScrolling method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                expect(uss.isScrolling()).to.be.false;
                uss.setStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollXTo(100, uss.getPageScroller());
                        wasScrolling = uss.isScrolling();
                    }
                ).then(
                    () => {
                        expect(wasScrolling).to.be.true;
                        expect(isScrolling).to.be.false;
                    }
                );
            });         
    });
})

describe("isScrolling-StoppedScrollingWhileAnimating-scrollYAnimation-Body", function() {
    var uss;
    var wasScrolling;
    var isScrolling;
    var _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ < 10) return total / 10;
            uss.stopScrolling(container);
            isScrolling = uss.isScrolling(container);
            _resolve();
        }
    }
    it("Tests the isScrolling method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
        .then((win) => {
            uss = win.uss;
            uss._containersData = new Map();

            expect(uss.isScrolling()).to.be.false;
            uss.setStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);

            cy.waitForUssCallback(
                (resolve) => {
                    _resolve = resolve;
                    uss.scrollYTo(100, uss.getPageScroller());
                    wasScrolling = uss.isScrolling();
                }
            ).then(
                () => {
                    expect(wasScrolling).to.be.true;
                    expect(isScrolling).to.be.false;
                }
            );
        });         
    });
})

describe("isScrolling-StopXAxisScrollingWhileAnimating-Body", function() {
    var uss;
    var wasScrolling;
    var isScrolling;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ < 10) return total / 10;
            uss.stopScrollingX(container);
            isScrolling = uss.isScrolling(container);
            return remaning;
        }
    }
    it("Tests the isScrolling method whenever the scroll-animation on the x-axis is stopped inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                expect(uss.isScrolling()).to.be.false;
                uss.setStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(100, 200, uss.getPageScroller(), resolve);
                        wasScrolling = uss.isScrolling();
                    }
                ).then(
                    () => {
                        expect(wasScrolling).to.be.true;
                        expect(isScrolling).to.be.true;
                    }
                );
            });         
    });
})

describe("isScrolling-StopYAxisScrollingWhileAnimating-Body", function() {
    var uss;
    var wasScrolling;
    var isScrolling;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ < 10) return total / 10;
            uss.stopScrollingY(container);
            isScrolling = uss.isScrolling(container);
            return remaning;
        }
    }
    it("Tests the isScrolling method whenever the scroll-animation on the y-axis is stopped inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                expect(uss.isScrolling()).to.be.false;
                uss.setStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);
     
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(100, 200, uss.getPageScroller(), resolve);
                        wasScrolling = uss.isScrolling();
                    }
                ).then(
                    () => {
                        expect(wasScrolling).to.be.true;
                        expect(isScrolling).to.be.true;
                    }
                );
            });         
    });
})

describe("isScrolling-StopBothAxisScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    var wasScrolling;
    var isScrolling;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ < 10) return total / 10;
            uss.stopScrolling(container);
            isScrolling = uss.isScrolling(container);
            _resolve();
        }
    }
    it("Tests the isScrolling method whenever the scroll-animations on both the x-axis and the y-axis are stopped from inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                expect(uss.isScrolling()).to.be.false;
                uss.setStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);
 
                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollTo(100, 200, uss.getPageScroller(), resolve);
                        wasScrolling = uss.isScrolling();
                    }
                ).then(
                    () => {
                        expect(wasScrolling).to.be.true;
                        expect(isScrolling).to.be.false;
                    }
                );
            });         
    });
})

describe("scrollTo-Body", function() {
    var uss;
    it("Horizontally and vertically scrolls the body to n1,n2 pixels", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.scrollTo, {
                    0: [[Cypress.env("failingValuesAll")],
                        [Cypress.env("failingValuesAll")]
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollTo(500, 200, uss.getPageScroller(), resolve);
                        }
                    ).then(
                        () => {
                            cy.bodyScrollLeftShouldToBe(500);
                            cy.bodyScrollTopShouldToBe(200);
                        }
                    );
                });
            });       
    });
})

describe("scrollTo-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Tests the scrollTo method whenever a scroll-animation is immediately stopped", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(500, 100, uss.getPageScroller(), () => count++);
                        uss.stopScrolling(uss.getPageScroller(), resolve);
                    }
                ).then(
                    () => {
                        cy.bodyScrollLeftShouldToBe(0); 
                        cy.bodyScrollTopShouldToBe(0);
                        expect(count).to.equal(0);
                    }
                );
            });        
    });
})

describe("scrollToBy-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Tests the scrollTo method whenever a scroll-animation is immediately stopped and restarted with the scrollBy method", function() {
        cy.visit("index.html"); 
        cy.window()
        .then((win) => {
            uss = win.uss;
            uss._containersData = new Map();
            
            cy.waitForUssCallback(
                (resolve) => {
                    uss.scrollTo(300, 200, uss.getPageScroller(), () => count++);
                    uss.stopScrolling(uss.getPageScroller());
                    uss.scrollBy(250, 250, uss.getPageScroller(), () => {
                        count++;
                        resolve();
                    });
                }
            ).then(
                () => {
                    cy.bodyScrollLeftShouldToBe(250);
                    cy.bodyScrollTopShouldToBe(250);
                    expect(count).to.equal(1);
                }
            );
        });         
    });
})

describe("scrollToTo-immediatelyStoppedScrolling-Body", function() {
    var uss;
    var count = 0;
    it("Tests the scrollTo method whenever a scroll-animation is immediately stopped and restarted with the scrollTo method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(100, 50, uss.getPageScroller(), () => count++);
                        uss.stopScrolling(uss.getPageScroller());
                        uss.scrollTo(250, 100, uss.getPageScroller(), () => {
                            count++;
                            resolve();
                        });
                    }
                ).then(
                    () => {
                        cy.bodyScrollLeftShouldToBe(250);
                        cy.bodyScrollTopShouldToBe(100);
                        expect(count).to.equal(1);
                    }
                );
            });         
    });
})

describe("scrollTo-StoppedScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    const _testCalculatorX = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isScrolling()) return total; //testing phase of the setXStepLengthCalculator
            i++;
            if(i < 10) return total / 10;
            uss.stopScrollingX(container, _resolve);
        }
    }
    const _testCalculatorY = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isScrolling()) return total; //testing phase of the setYStepLengthCalculator
            i++;
            if(i < 10) return total / 10;
            uss.stopScrollingY(container, _resolve);
        }
    }
    it("Tests the scrollTo method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                uss.setXStepLengthCalculator(_testCalculatorX(), uss.getPageScroller(), false, true);   
                uss.setYStepLengthCalculator(_testCalculatorY(), uss.getPageScroller(), false, true);   

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollTo(200, 100, uss.getPageScroller());
                    }
                ).then(
                    () => {
                        cy.bodyScrollLeftShouldToBe(180);
                        cy.bodyScrollTopShouldToBe(90);
                    }
                );
            });         
    });
})

describe("scrollTo-scrollTo-ReplaceScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    var i = 0;
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ === 10) uss.scrollTo(50, 75, uss.getPageScroller(), _resolve);
            return total / 10;
        }
    }
    it("Tests if the scrollTo method can replace the current scroll-animation from inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                uss.setStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);
                    
                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollTo(100, 200, uss.getPageScroller());
                    }
                ).then(
                    () => {
                        cy.bodyScrollLeftShouldToBe(50);
                        cy.bodyScrollTopShouldToBe(75);
                    }
                );
            });         
    });
})

describe("scrollBy-Body", function() {
    var uss;
    it("Horizontally and vertically scrolls the body by n1,n2 pixels", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                cy.testFailingValues(uss.scrollYBy, {
                    0: [[Cypress.env("failingValuesAll")],
                        [Cypress.env("failingValuesAll")]
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollBy(150, 100, uss.getPageScroller(), resolve);
                        }
                    ).then(
                        () => {
                            cy.bodyScrollLeftShouldToBe(150);
                            cy.bodyScrollTopShouldToBe(100);
                        }
                    );
                });
            });         
    });
})

describe("scrollToBy-StillStart-True-Body", function() {
    var uss;
    var _originalTimestampEqualsTimeStampX, _originalTimestampEqualsTimeStampY;
    var _remaningX, _remaningY, _totalX, _totalY;
    
    const _testCalculatorX = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isXscrolling()) return total; //testing phase of the setXStepLengthCalculator
            if(!_remaningX) _remaningX = remaning;
            if(!_originalTimestampEqualsTimeStampX) _originalTimestampEqualsTimeStampX = originalTimestamp === currentTimestamp;
            if(!_totalX) _totalX = total;
            return total / 10;
        }
    }
    const _testCalculatorY = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isYscrolling()) return total; //testing phase of the setYStepLengthCalculator
            if(!_remaningY) _remaningY = remaning;
            if(!_originalTimestampEqualsTimeStampY) _originalTimestampEqualsTimeStampY = originalTimestamp === currentTimestamp;
            if(!_totalY) _totalY = total;
            return total / 10;
        }
    }
    it("Horizontally and vertically scrolls the body to n1a, n1b pixels and then replace that animation with a n2a,n2b pixels scroll", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map(); 
                
                uss.setXStepLengthCalculator(_testCalculatorX(), uss.getPageScroller(), false, true); 
                uss.setYStepLengthCalculator(_testCalculatorY(), uss.getPageScroller(), false, true);           
                    
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(500, 200, uss.getPageScroller()); 
                        uss.scrollBy(100, 400, uss.getPageScroller(), resolve, true);
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStampX).to.be.true;
                        expect(_originalTimestampEqualsTimeStampY).to.be.true;
                        expect(_remaningX).to.equal(100);
                        expect(_remaningY).to.equal(400);
                        expect(_totalX).to.equal(100);
                        expect(_totalY).to.equal(400);
                        cy.bodyScrollLeftShouldToBe(100);
                        cy.bodyScrollTopShouldToBe(400);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False-Body", function() {
    var uss;
    var _secondPhaseX = false;
    var _secondPhaseY = false;
    var _originalTimestampEqualsTimeStampX, _remaningX, _totalX;
    var _originalTimestampEqualsTimeStampY, _remaningY, _totalY;
    
    const _testCalculatorX = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isScrolling()) return total; //testing phase of the setStepLengthCalculator
            if(_secondPhaseX) {
                _remaningX = remaning;
                _originalTimestampEqualsTimeStampX = originalTimestamp === currentTimestamp;
                _totalX = total;
                _secondPhaseX = false;
            }
            return total / 10;
        }
    }
    const _testCalculatorY = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isScrolling()) return total; //testing phase of the setStepLengthCalculator
            if(_secondPhaseY) {
                _remaningY = remaning;
                _originalTimestampEqualsTimeStampY = originalTimestamp === currentTimestamp;
                _totalY = total;
                _secondPhaseY = false;
            }
            return total / 10;
        }
    }
    it("Horizontally and vertically scrolls the body to n1a, n1b pixels and then extends that animation by n2a, n2b pixels", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map(); 
                
                uss.setXStepLengthCalculator(_testCalculatorX(), uss.getPageScroller(), false, true); 
                uss.setYStepLengthCalculator(_testCalculatorY(), uss.getPageScroller(), false, true); 
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollTo(170, 100, uss.getPageScroller()); 
                        setTimeout(() => {
                        _secondPhaseX = true;
                        _secondPhaseY = true;
                        uss.scrollBy(130, 200, uss.getPageScroller(), resolve, false);
                        }, 10);
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStampX).to.be.true;
                        expect(_remaningX).to.be.greaterThan(170);
                        expect(_remaningX).to.be.lessThan(300);
                        expect(_remaningY).to.be.greaterThan(100);
                        expect(_remaningY).to.be.lessThan(300);
                        expect(_totalX).to.equal(300);
                        expect(_totalY).to.equal(300);
                        cy.bodyScrollLeftShouldToBe(300);
                        cy.bodyScrollTopShouldToBe(300);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False-ExtendedScrollingWhileAnimating-Body", function() {
    var uss;
    var _resolve;
    var i = 0;
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(i++ === 10) uss.scrollBy(90, 70, uss.getPageScroller(), _resolve, false);
            return total / 10;
        }
    }
    it("Tests if the scrollBy method with stillStart = \"false\" can extend a scroll-animation from inside a stepLengthCalculator", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                uss.setStepLengthCalculator(_testCalculator(), uss.getPageScroller(), false, true);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollTo(100, 100, uss.getPageScroller());
                    }
                ).then(
                    () => {
                        cy.bodyScrollLeftShouldToBe(190);
                        cy.bodyScrollTopShouldToBe(170);
                    }
                );
            });         
    });
})

describe("stopScrolling-Body", function() {
    var uss;
    it("Tests the stopScrolling method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.stopScrolling, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    const _elements = Array.from(win.document.getElementsByTagName("*"))
                                            .filter(el => uss.getMaxScrollX(el) > 0 || uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => {
                        expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft);
                        expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop);
                    });
                    expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    _elements.forEach(el => {
                        const _randomBetween0and1 = Math.min(Math.random(), 0.5);
                        uss.scrollTo(_randomBetween0and1 * el.scrollWidth, _randomBetween0and1 * el.scrollHeight, el); 
                        expect(uss.isScrolling(el)).to.be.true;
                        win.setTimeout(() => uss.stopScrolling(el), _randomBetween0and1 * 100);
                    });

                    cy.waitForUssCallback(
                        undefined //default value: resolve after timeout
                    ).then(
                        () => {
                            _elements.forEach(el => {
                                expect(uss.isScrolling(el)).to.be.false;
                                const _yPos = uss.getScrollYCalculator(el)();
                                const _xPos = uss.getScrollXCalculator(el)();
                                
                                if(_xPos === 0) {
                                    expect(_yPos).to.be.greaterThan(0);
                                } else if(_yPos === 0) {
                                    expect(_xPos).to.be.greaterThan(0);
                                } else {
                                    expect(_xPos).to.be.greaterThan(0);
                                    expect(_yPos).to.be.greaterThan(0);
                                }
                            });
                        }
                    );
                });
            });         
    });
})

describe("stopScrolling-immediatelyStopped-Body", function() {
    var uss;
    it("Initialize a series of scroll-animations on both the x-axis and the y-axis of all scrollable containers and immediately stop them", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.stopScrolling, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    const _elements = Array.from(win.document.getElementsByTagName("*"))
                                            .filter(el => uss.getMaxScrollX(el) > 0 || uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => {
                        expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft);
                        expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop);
                    });
                    expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    _elements.forEach(el => {
                        const _randomBetween0and1 = Math.min(Math.random(), 0.5);
                        uss.scrollTo(_randomBetween0and1 * el.scrollWidth, _randomBetween0and1 * el.scrollHeight, el); 
                        expect(uss.isScrolling(el)).to.be.true;
                        uss.stopScrolling(el);
                        expect(uss.isScrolling(el)).to.be.false;
                    });
                });
            });         
    });
})


describe("stopScrollingAll-Body", function() {
    var uss;
    it("Tests the stopScrollingAll method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.stopScrollingAll, {
                    0: [Cypress.env("failingValuesAll")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    const _elements = Array.from(win.document.getElementsByTagName("*"))
                                            .filter(el => uss.getMaxScrollX(el) > 0 || uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => {
                        expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft);
                        expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop);
                    });
                    expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    const _randomBetween0and1 = Math.min(Math.random(), 0.5);
                    _elements.forEach(el => {
                        uss.scrollTo(_randomBetween0and1 * el.scrollWidth, _randomBetween0and1 * el.scrollHeight, el); 
                        expect(uss.isScrolling(el)).to.be.true;
                    });
                    win.setTimeout(uss.stopScrollingAll, _randomBetween0and1 * 100);

                    cy.waitForUssCallback(
                        undefined //default value: resolve after timeout
                    ).then(
                        () => {
                            _elements.forEach(el => {
                                expect(uss.isScrolling(el)).to.be.false;
                                const _yPos = uss.getScrollYCalculator(el)();
                                const _xPos = uss.getScrollXCalculator(el)();
                                
                                if(_xPos === 0) {
                                    expect(_yPos).to.be.greaterThan(0);
                                } else if(_yPos === 0) {
                                    expect(_xPos).to.be.greaterThan(0);
                                } else {
                                    expect(_xPos).to.be.greaterThan(0);
                                    expect(_yPos).to.be.greaterThan(0);
                                }
                            });
                        }
                    );
                });
            });         
    });
})

describe("stopScrollingAll-immediatelyStopped-Body", function() {
    var uss;
    it("Initialize a series of scroll-animations on both the x-axis and the y-axis of all scrollable containers and immediately stop them", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.stopScrollingAll, {
                    0: [Cypress.env("failingValuesAll")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    const _elements = Array.from(win.document.getElementsByTagName("*"))
                                            .filter(el => uss.getMaxScrollX(el) > 0 || uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => {
                        expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft);
                        expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop);
                    });
                    expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    _elements.forEach(el => {
                        const _randomBetween0and1 = Math.min(Math.random(), 0.5);
                        uss.scrollTo(_randomBetween0and1 * el.scrollWidth, _randomBetween0and1 * el.scrollHeight, el); 
                        expect(uss.isScrolling(el)).to.be.true;
                    });
                    uss.stopScrollingAll();
                    _elements.forEach(el => expect(uss.isScrolling(el)).to.be.false);
                });
            });         
    });
})