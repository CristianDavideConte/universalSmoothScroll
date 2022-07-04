describe("stopScrollingY", function() {
    let uss;
    it("Tests the stopScrollingY method", function() {
        cy.visit("stopScrollingY-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrollingY, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    const _document = win.document.documentElement;
                    const _body = win.document.body;
      
                    const _elementScrollableOnYAxis = win.document.getElementById("scrollable-y");
                    const _elementScrollableOnXAxis = win.document.getElementById("scrollable-x");
                    const _positionFixedElement = win.document.getElementById("position-fixed");
                    const _randomElement = win.document.getElementById("random-element");
      
                    const _elements = [
                        _document,
                        _body,
                        _elementScrollableOnYAxis,
                        _elementScrollableOnXAxis,
                        _positionFixedElement,
                        _randomElement
                    ].filter(el => uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop));
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    cy.waitForUssCallback(
                        (resolve) => {
                            _elements.forEach(el => {
                                const _randomBetween0and1 = Math.min(Math.random(), 0.5);
                                expect(uss.isYScrolling(el)).to.be.false;
                                uss.scrollYTo(100, el); 
                                expect(uss.isYScrolling(el)).to.be.true;

                                win.setTimeout(() => {
                                    uss.stopScrollingY(el);

                                    if(_elements.filter(el => uss.isScrolling(el)).length <= 0) {
                                        resolve();
                                    }
                                }, _randomBetween0and1 * 100);
                            });
                        }
                    ).then(() => {
                        () => {
                            _elements.forEach(el => {
                                expect(uss.isYScrolling(el)).to.be.false;
                                expect(uss.getScrollYCalculator(el)()).to.be.greaterThan(0);
                            });
                        }
                    });
                });
            });         
    });
})


describe("stopScrollingY-immediatelyStopped-Body", function() {
    let uss;
    it("Initialize a series of scroll-animations on the x-axis of all scrollable containers and immediately stop them", function() {
        cy.visit("stopScrollingY-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrollingY, {
                    0: [Cypress.env("failingValuesNoUndefined")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    const _document = win.document.documentElement;
                    const _body = win.document.body;
      
                    const _elementScrollableOnYAxis = win.document.getElementById("scrollable-y");
                    const _elementScrollableOnXAxis = win.document.getElementById("scrollable-x");
                    const _positionFixedElement = win.document.getElementById("position-fixed");
                    const _randomElement = win.document.getElementById("random-element");
      
                    const _elements = [
                        _document,
                        _body,
                        _elementScrollableOnYAxis,
                        _elementScrollableOnXAxis,
                        _positionFixedElement,
                        _randomElement
                    ].filter(el => uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop));
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    _elements.forEach(el => {
                        expect(uss.isYScrolling(el)).to.be.false;
                        uss.scrollYTo(100, el); 
                        expect(uss.isYScrolling(el)).to.be.true;
                        
                        uss.stopScrollingY(el);
                        expect(uss.isYScrolling(el)).to.be.false;
                    });
                });
            });         
    });
})