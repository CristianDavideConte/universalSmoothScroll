describe("isYScrolling", function() {
    let uss;
    let wasYScrolling;
    let isYScrolling;
    it("Tests the isYScrolling method", function() {
        cy.visit("isYScrolling-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

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
                            uss.scrollYTo(100, _testElement, () => {
                                isYScrolling = uss.isYScrolling(_testElement);
                                resolve();
                            });
                            wasYScrolling = uss.isYScrolling(_testElement);
                        }, 
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




describe("isYScrolling-StoppedScrollingWhileAnimating", function() {
    let uss;
    let wasYScrolling;
    let isYScrolling;
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentYPosition, finalYPosition, container) => {
            i++;
            if(i < 10) return total / 10;
            
            uss.stopScrollingY(container);
            isYScrolling = uss.isYScrolling(container);
            _resolve();
        }
    }
    it("Tests the isYScrolling method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("isYScrolling-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                expect(uss.isYScrolling(_testElement)).to.be.false;
                uss.setYStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollYTo(100, _testElement);
                        wasYScrolling = uss.isYScrolling(_testElement);
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