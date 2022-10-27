const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("stopScrolling-tests.html"); 
})

describe("stopScrolling", function() {
    let uss;
    it("Tests the stopScrolling method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrolling, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
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

                                win.setTimeout(() => {
                                    uss.stopScrolling(el);

                                    if(_elements.filter(el => uss.isScrolling(el)).length <= 0) {
                                        resolve();
                                    }
                                }, 100);
                            });
                        }
                    ).then(() => {
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
                    });
                });
            });         
    });
})

describe("stopScrolling-immediatelyStopped", function() {
    let uss;
    it("Initialize a series of scroll-animations on both the x-axis and the y-axis of all scrollable containers and immediately stop them", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrolling, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
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
                   
                    _elements.forEach(el => {  
                        cy.waitForUssCallback(
                            (resolve) => {
                                expect(uss.isScrolling(el)).to.be.false;                      
                                uss.scrollTo(100, 100, el, resolve); 
                                expect(uss.isScrolling(el)).to.be.true;
                                resolve();
                            }
                        ).then(
                            () => {
                                uss.stopScrolling(el);
                                expect(uss.isScrolling(el)).to.be.false;  
                            }
                        );
                    });              
                });
            });         
    });
})

describe("stopScrolling containersData integrity", function() {
    let uss;
    it("Checks if the stopScrolling function cleans the uss._containersData's arrays correctly", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrolling, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    uss._containersData = new Map();

                    const _testCalculatorNonTemporary = () => 10;
                    const _testCalculatorTemporary = () => 20;
                    const _maxScrollX = uss.getMaxScrollX(uss.getPageScroller());
                    const _maxScrollY = uss.getMaxScrollY(uss.getPageScroller());
                    const _xScrollbarSize = uss.calcXScrollbarDimension(uss.getPageScroller());
                    const _yScrollbarSize = uss.calcYScrollbarDimension(uss.getPageScroller());
                    const _bordersSizes = uss.calcBordersDimensions(uss.getPageScroller());
                    const _scrollableParentXNotHidden = uss.getXScrollableParent(uss.getPageScroller(), false);
                    const _scrollableParentXHidden = uss.getXScrollableParent(uss.getPageScroller(), true);
                    const _scrollableParentYNotHidden = uss.getYScrollableParent(uss.getPageScroller(), false);
                    const _scrollableParentYHidden = uss.getYScrollableParent(uss.getPageScroller(), true);
                    const _scrollXCalculator = uss.getScrollXCalculator(uss.getPageScroller());
                    const _scrollYCalculator = uss.getScrollYCalculator(uss.getPageScroller());

                    uss.setXStepLengthCalculator(_testCalculatorNonTemporary, uss.getPageScroller(), false);
                    uss.setXStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(), true);
                    uss.setYStepLengthCalculator(_testCalculatorNonTemporary, uss.getPageScroller(), false);
                    uss.setYStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(), true);

                    uss.stopScrolling(uss.getPageScroller());

                    const _containerData = uss._containersData.get(uss.getPageScroller());
                    
                    //Check if the _containerData doesn't contain unecessary leftover values. 
                    for(let i = 0; i < 12; i++) {
                        expect(_containerData[i]).to.be.undefined;
                    }
                    
                    //Check if the stepLengthCalculators are preserved.
                    expect(_containerData[12]).to.equal(_testCalculatorNonTemporary); //xStepLengthCalculator non temporary
                    expect(_containerData[13]).to.equal(_testCalculatorNonTemporary); //yStepLengthCalculator non temporary
                    expect(_containerData[14]).to.be.undefined;                       //xStepLengthCalculator temporary
                    expect(_containerData[15]).to.be.undefined;                       //yStepLengthCalculator temporary

                    //Check if the cached values are preserved.
                    expect(_containerData[16]).to.equal(_maxScrollX);
                    expect(_containerData[17]).to.equal(_maxScrollY);
                    expect(_containerData[18]).to.equal(_xScrollbarSize);
                    expect(_containerData[19]).to.equal(_yScrollbarSize);
                    expect(_containerData[20]).to.equal(_bordersSizes[0]);
                    expect(_containerData[21]).to.equal(_bordersSizes[1]);
                    expect(_containerData[22]).to.equal(_bordersSizes[2]);
                    expect(_containerData[23]).to.equal(_bordersSizes[3]);
                    expect(_containerData[24]).to.equal(_scrollableParentXNotHidden);
                    expect(_containerData[25]).to.equal(_scrollableParentXHidden);
                    expect(_containerData[26]).to.equal(_scrollableParentYNotHidden);
                    expect(_containerData[27]).to.equal(_scrollableParentYHidden);
                    expect(_containerData[28]).to.equal(_scrollXCalculator);
                    expect(_containerData[29]).to.equal(_scrollYCalculator);
                });
            });         
    });
});