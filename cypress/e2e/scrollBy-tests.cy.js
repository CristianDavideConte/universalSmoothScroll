describe("scrollBy", function() {
    let uss;
    it("Horizontally and vertically scrolls the test element by n1,n2 pixels", function() {
        cy.visit("scrollBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollYBy, {
                    0: [Cypress.env("failingValuesNoFiniteNumber"),
                        Cypress.env("failingValuesNoFiniteNumber"),
                        Cypress.env("failingValuesNoUndefined")
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollBy(150, 100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 150);
                            cy.elementScrollTopShouldBe(_testElement, 100);
                        }
                    );
                });
            });         
    });
})

describe("scrollToBy-StillStart-True", function() {
    let uss;
    let _originalTimestampEqualsTimeStampX, _originalTimestampEqualsTimeStampY;
    let _remaningX, _remaningY, _totalX, _totalY;
    
    const _testCalculatorX = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            if(!uss.isXScrolling(container)) return total; //testing phase of the setXStepLengthCalculator
            
            if(!_remaningX) _remaningX = remaning;
            if(!_originalTimestampEqualsTimeStampX) _originalTimestampEqualsTimeStampX = originalTimestamp === currentTimestamp;
            if(!_totalX) _totalX = total;
            
            return total / 10;
        }
    }
    const _testCalculatorY = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            if(!uss.isYScrolling(container)) return total; //testing phase of the setYStepLengthCalculator
            
            if(!_remaningY) _remaningY = remaning;
            if(!_originalTimestampEqualsTimeStampY) _originalTimestampEqualsTimeStampY = originalTimestamp === currentTimestamp;
            if(!_totalY) _totalY = total;
            
            return total / 10;
        }
    }
    it("Horizontally and vertically scrolls the test element to n1a, n1b pixels and then replace that animation with a n2a,n2b pixels scroll", function() {
        cy.visit("scrollBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                uss.setXStepLengthCalculator(_testCalculatorX(), _testElement, false); 
                uss.setYStepLengthCalculator(_testCalculatorY(), _testElement, false);           
                    
                cy.waitForUssCallback(
                    (resolve) => {
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        uss.scrollTo(500, 200, _testElement, () => {}); 
                        expect(uss.isScrolling(_testElement)).to.be.true;
                        uss.scrollBy(100, 400, _testElement, resolve, true);
                        expect(uss.isScrolling(_testElement)).to.be.true;
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStampX).to.be.true;
                        expect(_originalTimestampEqualsTimeStampY).to.be.true;
                        expect(_remaningX).to.equal(100);
                        expect(_remaningY).to.equal(400);
                        expect(_totalX).to.equal(100);
                        expect(_totalY).to.equal(400);
                        cy.elementScrollLeftShouldBe(_testElement, 100);
                        cy.elementScrollTopShouldBe(_testElement, 400);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False", function() {
    let uss;
    let _secondPhaseX = false;
    let _secondPhaseY = false;
    let _originalTimestampEqualsTimeStampX, _remaningX, _totalX;
    let _originalTimestampEqualsTimeStampY, _remaningY, _totalY;
    
    const _testCalculatorX = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            if(!uss.isScrolling(container)) return total; //testing phase of the setStepLengthCalculator
            
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
            if(!uss.isScrolling(container)) return total; //testing phase of the setStepLengthCalculator
            
            if(_secondPhaseY) {
                _remaningY = remaning;
                _originalTimestampEqualsTimeStampY = originalTimestamp === currentTimestamp;
                _totalY = total;
                _secondPhaseY = false;
            }
            
            return total / 10;
        }
    }
    it("Horizontally and vertically scrolls the test element to n1a, n1b pixels and then extends that animation by n2a, n2b pixels", function() {
        cy.visit("scrollBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                uss.setXStepLengthCalculator(_testCalculatorX(), _testElement, false); 
                uss.setYStepLengthCalculator(_testCalculatorY(), _testElement, false); 
                
                cy.waitForUssCallback(
                    (resolve) => {
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        uss.scrollTo(170, 100, _testElement, () => {}); 
                        expect(uss.isScrolling(_testElement)).to.be.true;

                        win.requestAnimationFrame(function activateSecondPhase(i = 0) {
                            if(i < 2) win.requestAnimationFrame(() => activateSecondPhase(i + 1));
                            else {
                                _secondPhaseX = true;
                                _secondPhaseY = true;
                                uss.scrollBy(130, 200, _testElement, resolve, false);
                            }
                        });
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStampX).to.be.true;
                        expect(_originalTimestampEqualsTimeStampY).to.be.true;
                        expect(_remaningX).to.be.greaterThan(170);
                        expect(_remaningY).to.be.greaterThan(100);
                        expect(_remaningX).to.be.lessThan(300);
                        expect(_remaningY).to.be.lessThan(300);
                        expect(_totalX).to.equal(300);
                        expect(_totalY).to.equal(300);
                        cy.elementScrollLeftShouldBe(_testElement, 300);
                        cy.elementScrollTopShouldBe(_testElement, 300);
                    }
                );
            });        
    });
})

describe("scrollToBy-StillStart-False-ExtendedScrollingWhileAnimating", function() {
    let uss;
    let _resolve;
    let i = 0;
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if(i === 2) {
                uss.scrollBy(90, 70, container, _resolve, false);
            }
            return total / 10;
        }
    }
    it("Tests if the scrollBy method with stillStart = \"false\" can extend a scroll-animation from inside a stepLengthCalculator", function() {
        cy.visit("scrollBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        
                        expect(_resolve).to.equal(resolve);
                        expect(uss.isScrolling(_testElement)).to.be.false;
                        uss.scrollTo(100, 100, _testElement, resolve);
                        expect(uss.isScrolling(_testElement)).to.be.true;
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 190);
                        cy.elementScrollTopShouldBe(_testElement, 170);
                    }
                );
            });         
    });
})
