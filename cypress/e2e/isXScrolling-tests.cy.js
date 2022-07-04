describe("isXScrolling", function() {
    let uss;
    let wasXScrolling;
    let isXScrolling;
    it("Tests the isXScrolling method", function() {
        cy.visit("isXScrolling-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                cy.testFailingValues(uss.isXScrolling, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isXScrolling()).to.be.false;
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss.scrollXTo(100, _testElement, () => {
                                isXScrolling = uss.isXScrolling(_testElement);
                                resolve();
                            });
                            wasXScrolling = uss.isXScrolling(_testElement);
                        }, 
                    ).then(
                        () => {
                            expect(wasXScrolling).to.be.true;
                            expect(isXScrolling).to.be.false;
                        }
                    );
                });
            });         
    });
})




describe("isXScrolling-StoppedScrollingWhileAnimating", function() {
    let uss;
    let wasXScrolling;
    let isXScrolling;
    let _resolve;
    const _testCalculator = (i = 0) => {
        return (remaning, originalTimestamp, currentTimestamp, total, currentXPosition, finalXPosition, container) => {
            i++;
            if(i < 10) return total / 10;
            
            uss.stopScrollingX(container);
            isXScrolling = uss.isXScrolling(container);
            _resolve();
        }
    }
    it("Tests the isXScrolling method whenever a scroll-animation is stopped inside a stepLengthCalculator", function() {
        cy.visit("isXScrolling-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");

                expect(uss.isXScrolling(_testElement)).to.be.false;
                uss.setXStepLengthCalculator(_testCalculator(), _testElement, false);

                cy.waitForUssCallback(
                    (resolve) => {
                        _resolve = resolve;
                        uss.scrollXTo(100, _testElement);
                        wasXScrolling = uss.isXScrolling(_testElement);
                    }
                ).then(
                    () => {
                        expect(wasXScrolling).to.be.true;
                        expect(isXScrolling).to.be.false;
                    }
                );
            });         
    });
})