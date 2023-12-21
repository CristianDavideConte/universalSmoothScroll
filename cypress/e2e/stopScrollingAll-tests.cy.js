const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("stopScrollingAll-tests.html"); 
})

describe("stopScrollingAll", function() {
    let uss;
    it("Tests the stopScrollingAll method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.stopScrollingAll, {
                    0: [constants.failingValuesAll]
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
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();

                cy.testFailingValues(uss.stopScrollingAll, {
                    0: [constants.failingValuesAll]
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

describe("stopScrollingAll-containersData-integrity", function() {
    let uss;
    it("Checks if the stopScrollingAll function cleans the uss._containersData's arrays correctly", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrollingAll, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.be.undefined;
                    expect(uss.isScrolling()).to.be.false;
                })
                .then(() => {
                    uss._containersData = new Map();
                    const _elements = [
                        win,
                        win.document.documentElement, 
                        win.document.body
                    ].concat(constants.getChildrenRecursively(document.body));

                    for(const container of _elements) {
                        const _testCallback = () => {};
                        const _testCalculatorFixed = () => 10;
                        const _testCalculatorTemporary = () => 20;
                        const _maxScrollX = uss.getMaxScrollX(container);
                        const _maxScrollY = uss.getMaxScrollY(container);
                        const _xScrollbarSize = uss.calcXScrollbarDimension(container);
                        const _yScrollbarSize = uss.calcYScrollbarDimension(container);
                        const _bordersSizes = uss.calcBordersDimensions(container);
                        const _scrollableParentXNotHidden = uss.getXScrollableParent(container, false);
                        const _scrollableParentXHidden = uss.getXScrollableParent(container, true);
                        const _scrollableParentYNotHidden = uss.getYScrollableParent(container, false);
                        const _scrollableParentYHidden = uss.getYScrollableParent(container, true);
                        const _scrollXCalculator = uss.getScrollXCalculator(container);
                        const _scrollYCalculator = uss.getScrollYCalculator(container);
                        const _resizeCallbacksQueue = [_testCallback];
                        const _mutationCallbacksQueue = [_testCallback];

                        uss.setXStepLengthCalculator(_testCalculatorFixed, container, false);
                        uss.setXStepLengthCalculator(_testCalculatorTemporary, container, true);
                        uss.setYStepLengthCalculator(_testCalculatorFixed, container, false);
                        uss.setYStepLengthCalculator(_testCalculatorTemporary, container, true);

                        uss.addResizeCallback(_testCallback, container);
                        if(container !== win) {
                            uss.addMutationCallback(_testCallback, container);
                        }

                        uss.stopScrollingAll();

                        const _containerData = uss._containersData.get(container);
                        const _noValKeys = [
                            constants.K_IDX,
                            constants.K_IDY,
                            constants.K_FPX,
                            constants.K_FPY,
                            constants.K_SDX,
                            constants.K_SDY,
                            constants.K_TSAX,
                            constants.K_TSAY,
                            constants.K_OTSX,
                            constants.K_OTSY,
                            constants.K_CBX,
                            constants.K_CBY,
                        ];

                        //Check if the _containerData doesn't contain unecessary leftover values. 
                        for(const key of _noValKeys) {
                            expect(_containerData[key]).to.equal(constants.NO_VAL);
                        }
                        
                        console.log(container)

                        //Check if the stepLengthCalculators are preserved.
                        expect(_containerData[constants.K_PSCX]).to.equal(_testCalculatorFixed); //fixed xStepLengthCalculator 
                        expect(_containerData[constants.K_PSCY]).to.equal(_testCalculatorFixed); //fixed yStepLengthCalculator
                        expect(_containerData[constants.K_TSCX]).to.be.undefined;                       //temporary xStepLengthCalculator 
                        expect(_containerData[constants.K_TSCY]).to.be.undefined;                       //temporary yStepLengthCalculator

                        //Check if the cached values are preserved.
                        expect(_containerData[constants.K_MSX]).to.equal(_maxScrollX);
                        expect(_containerData[constants.K_MSY]).to.equal(_maxScrollY);

                        expect(_containerData[constants.K_VSB]).to.equal(_xScrollbarSize);
                        expect(_containerData[constants.K_HSB]).to.equal(_yScrollbarSize);

                        expect(_containerData[constants.K_TB]).to.equal(_bordersSizes[0]);
                        expect(_containerData[constants.K_RB]).to.equal(_bordersSizes[1]);
                        expect(_containerData[constants.K_BB]).to.equal(_bordersSizes[2]);
                        expect(_containerData[constants.K_LB]).to.equal(_bordersSizes[3]);

                        expect(_containerData[constants.K_SSPX]).to.equal(_scrollableParentXNotHidden);
                        expect(_containerData[constants.K_HSPX]).to.equal(_scrollableParentXHidden);
                        expect(_containerData[constants.K_SSPY]).to.equal(_scrollableParentYNotHidden);
                        expect(_containerData[constants.K_HSPY]).to.equal(_scrollableParentYHidden);

                        expect(_containerData[constants.K_SCX]).to.equal(_scrollXCalculator);
                        expect(_containerData[constants.K_SCY]).to.equal(_scrollYCalculator);

                        expect(constants.arraysAreEqual(_containerData[constants.K_RCBQ], _resizeCallbacksQueue)).to.be.true;
                        if(container !== win) {
                            expect(constants.arraysAreEqual(_containerData[constants.K_MCBQ], _mutationCallbacksQueue)).to.be.true;
                        }
                    }
                });
            });         
    });
});