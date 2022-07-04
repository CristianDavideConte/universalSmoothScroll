describe("scrollXBy", function() {
    let uss;
    it("Horizontally scrolls the test element by n pixels", function() {
        cy.visit("scrollXBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                cy.testFailingValues(uss.scrollXBy, {
                    0: [Cypress.env("failingValuesNoFiniteNumber"),
                        Cypress.env("failingValuesNoUndefined")
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(uss.isXScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollXBy(100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 100);
                        }
                    );
                });
            });         
    });
})

describe("scrollXToBy-StillStart-True", function() {
    let uss;
    let _originalTimestampEqualsTimeStamp, _remaning, _total;
    
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            if(!uss.isXScrolling(container)) return total; //testing phase of the setXStepLengthCalculator
            
            if(!_remaning) _remaning = remaning;
            if(!_originalTimestampEqualsTimeStamp) _originalTimestampEqualsTimeStamp = originalTimestamp === currentTimestamp;
            if(!_total) _total = total;
            
            return total / 10;
        }
    }
    it("Horizontally scrolls the test element to n1 pixels and then replace that animation with a n2 pixels scroll", function() {
        cy.visit("scrollXBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                uss.setXStepLengthCalculator(_testCalculator(), _testElement, false); 
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(500, _testElement); 
                        uss.scrollXBy(200, _testElement, resolve, true);
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStamp).to.be.true;
                        expect(_remaning).to.equal(200);
                        expect(_total).to.equal(200);
                        cy.elementScrollLeftShouldBe(_testElement, 200);
                    }
                );
            });        
    });
})

describe("scrollXToBy-StillStart-False", function() {
    let uss;
    let _secondPhase = false;
    let _originalTimestampEqualsTimeStamp, _remaning, _total;
    
    const _testCalculator = () => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            if(!uss.isXScrolling(container)) return total; //testing phase of the setXStepLengthCalculator
            
            if(_secondPhase) {
                _remaning = remaning;
                _originalTimestampEqualsTimeStamp = originalTimestamp === currentTimestamp;
                _total = total;
                _secondPhase = false;
            }
            
            return total / 10;
        }
    }
    it("Horizontally scrolls the test element to n1 pixels and then extends that animation by n2 pixels", function() {
        cy.visit("scrollXBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                
                uss.setXStepLengthCalculator(_testCalculator(), _testElement, false); 
                
                cy.waitForUssCallback(
                    (resolve) => {
                        uss.scrollXTo(100, _testElement); 
                        win.requestAnimationFrame(function activateSecondPhase(i = 0) {
                            if(i < 2) win.requestAnimationFrame(() => activateSecondPhase(i + 1));
                            else {
                                _secondPhase = true;
                                uss.scrollXBy(200, _testElement, resolve, false);
                            }
                        });
                    }
                ).then(
                    () => {
                        expect(_originalTimestampEqualsTimeStamp).to.be.true;
                        expect(_remaning).to.be.greaterThan(100);
                        expect(_remaning).to.be.lessThan(300);
                        expect(_total).to.equal(300);
                        cy.elementScrollLeftShouldBe(_testElement, 300);
                    }
                );
            });        
    });
})

describe("scrollXToBy-StillStart-False-ExtendedScrollingWhileAnimating", function() {
    let uss;
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if(i === 2) uss.scrollXBy(90, container, _resolve, false);
            
            return total / 10;
        }
    }
    it("Tests if the scrollYBy method with stillStart = \"false\" can extend a scroll-animation from inside a stepLengthCalculator", function() {
        cy.visit("scrollXBy-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                uss.setXStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollXTo(100, _testElement);
                    }
                ).then(
                    () => {
                        cy.elementScrollLeftShouldBe(_testElement, 190);
                    }
                );
            });         
    });
})