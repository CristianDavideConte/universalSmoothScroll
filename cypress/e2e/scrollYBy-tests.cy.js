const { constants } = require("../support/constants");

describe("scrollYBy", function() {
    let uss;
    it("Vertically scrolls the test element by n pixels", function() {
        cy.visit("scrollYBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollYBy, {
                    0: [constants.failingValuesNoFiniteNumber,
                        constants.failingValuesNoUndefined
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollYBy(100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollTopShouldBe(_testElement, 100);
                        }
                    );
                });
            });         
    });
})

describe("scrollYToBy-StillStart-True", function() {
    let uss;
    let _originalTimestampEqualsTimeStamp, _remaning, _total;
    
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isYScrolling(container)) return total; //testing phase of the setYStepLengthCalculator
            
            if(!_remaning) _remaning = remaning;
            if(!_originalTimestampEqualsTimeStamp) _originalTimestampEqualsTimeStamp = originalTimestamp === currentTimestamp;
            if(!_total) _total = total;
            
            return total / 10;
        }
    }
    it("Vertically scrolls the test element to n1 pixels and then replace that animation with a n2 pixels scroll", function() {
        cy.visit("scrollYBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                uss.setYStepLengthCalculator(_testCalculator(), _testElement, false); 
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(500, _testElement); 
                        uss.scrollYBy(200, _testElement, resolve, true);
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStamp).to.be.true;
                        expect(_remaning).to.equal(200);
                        expect(_total).to.equal(200);
                        cy.elementScrollTopShouldBe(_testElement, 200);
                    }
                );
            });        
    });
})

describe("scrollYToBy-StillStart-False", function() {
    let uss;
    let _secondPhase = false;
    let _originalTimestampEqualsTimeStamp, _remaning, _total;
    
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isYScrolling(container)) return total; //testing phase of the setYStepLengthCalculator
            
            if(_secondPhase) {
                _remaning = remaning;
                _originalTimestampEqualsTimeStamp = originalTimestamp === currentTimestamp;
                _total = total;
                _secondPhase = false;
            }
            
            return total / 10;
        }
    }
    it("Vertically scrolls the test element to n1 pixels and then extends that animation by n2 pixels", function() {
        cy.visit("scrollYBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                uss.setYStepLengthCalculator(_testCalculator(), _testElement, false); 
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollYTo(100, _testElement); 
                        win.requestAnimationFrame(function activateSecondPhase(i = 0) {
                            if(i < 2) win.requestAnimationFrame(() => activateSecondPhase(i + 1));
                            else {
                                _secondPhase = true;
                                uss.scrollYBy(200, _testElement, resolve, false);
                            }
                        });
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStamp).to.be.true;
                        expect(_remaning).to.be.greaterThan(100);
                        expect(_remaning).to.be.lessThan(300);
                        expect(_total).to.equal(300);
                        cy.elementScrollTopShouldBe(_testElement, 300);
                    }
                );
            });        
    });
})

describe("scrollYToBy-StillStart-False-ExtendedScrollingWhileAnimating", function() {
    let uss;
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if(i === 2) uss.scrollYBy(90, container, _resolve, false);
            
            return total / 10;
        }
    }
    it("Tests if the scrollYBy method with stillStart = \"false\" can extend a scroll-animation from inside a stepLengthCalculator", function() {
        cy.visit("scrollYBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setYStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollYTo(100, _testElement);
                    }
                ).then(
                    () => {
                        cy.elementScrollTopShouldBe(_testElement, 190);
                    }
                );
            });         
    });
})