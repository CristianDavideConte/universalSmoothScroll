describe("stopScrollingAll", function() {
    let uss;
    it("Tests the stopScrollingAll method", function() {
        cy.visit("stopScrollingAll-tests.html"); 
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
                    ].filter(el => uss.getMaxScrollX(el) > 0 || uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => {
                        expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft);
                        expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop);
                    });
                    expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    cy.waitForUssCallback(
                        (resolve) => {
                            _elements.forEach(el => {
                                expect(uss.isScrolling(el)).to.be.false;
                                uss.scrollTo(1000, 1000, el, resolve); 
                                expect(uss.isScrolling(el)).to.be.true;
                            });
                            win.setTimeout(() => uss.stopScrollingAll(resolve), 100);
                        }
                    ).then(
                        () => {
                            _elements.forEach(el => {
                                expect(uss.isScrolling(el)).to.be.false;

                                const _yPos = uss.getScrollYCalculator(el)();
                                const _xPos = uss.getScrollXCalculator(el)();
                                
                                if(uss.getMaxScrollX(el) < 1 && uss.getMaxScrollY(el) < 1) return;
                                if(uss.getMaxScrollX(el) > 1) {
                                    expect(_xPos).to.be.at.least(0);
                                } else {
                                    expect(_yPos).to.be.at.least(0);
                                }
                            });
                        }
                    );
                });
            });         
    });
})

describe("stopScrollingAll-immediatelyStopped", function() {
    let uss;
    it("Initialize a series of scroll-animations on both the x-axis and the y-axis of all scrollable containers and immediately stop them", function() {
        cy.visit("stopScrollingAll-tests.html"); 
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
                    ].filter(el => uss.getMaxScrollX(el) > 0 || uss.getMaxScrollY(el) > 0);

                    _elements.forEach(el => {
                        expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft);
                        expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop);
                    });
                    expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);
                    expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            _elements.forEach(el => {
                                expect(uss.isScrolling(el)).to.be.false;
                                uss.scrollTo(100, 100, el, resolve); 
                                expect(uss.isScrolling(el)).to.be.true;
                            });
                        }
                    ).then(
                        () => {
                            uss.stopScrollingAll(() => {
                                _elements.forEach(el => expect(uss.isScrolling(el)).to.be.false);
                            });
                        }
                    );
                });
            });         
    });
})