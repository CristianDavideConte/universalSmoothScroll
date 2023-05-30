const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("stopScrollingX-tests.html"); 
})

describe("stopScrollingX", function() {
    let uss;
    it("Tests the stopScrollingX method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrollingX, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isXScrolling()).to.be.false;
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
                    ].filter(el => uss.getMaxScrollX(el) > 0);

                    _elements.forEach(el => expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft));
                    expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);
 
                    cy.waitForUssCallback(
                        (resolve) => {
                            _elements.forEach(el => {
                                expect(uss.isXScrolling(el)).to.be.false;
                                uss.scrollXTo(1000, el, resolve); 
                                expect(uss.isXScrolling(el)).to.be.true;

                                win.setTimeout(() => {
                                    uss.stopScrollingX(el);

                                    if(_elements.filter(el => uss.isScrolling(el)).length <= 0) {
                                        resolve();
                                    }
                                }, 100);
                            });
                        }
                    ).then(() => {
                        () => {
                            _elements.forEach(el => {
                                expect(uss.isXScrolling(el)).to.be.false;
                                expect(uss.getScrollXCalculator(el)()).to.be.at.least(0);
                            });
                        }
                    });
                });
            });         
    });
})


describe("stopScrollingX-immediatelyStopped", function() {
    let uss;
    it("Initialize a series of scroll-animations on the x-axis of all scrollable containers and immediately stop them", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrollingX, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isXScrolling()).to.be.false;
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
                    ].filter(el => uss.getMaxScrollX(el) > 0);

                    _elements.forEach(el => expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft));
                    expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);

                    _elements.forEach(el => {  
                        cy.waitForUssCallback(
                            (resolve) => {
                                expect(uss.isXScrolling(el)).to.be.false;                      
                                uss.scrollXTo(100, el, resolve); 
                                expect(uss.isXScrolling(el)).to.be.true;
                                resolve();
                            }
                        ).then(
                            () => {
                                uss.stopScrollingX(el);
                                expect(uss.isXScrolling(el)).to.be.false;  
                            }
                        );
                    }); 
                });
            });         
    });
})

describe("stopScrollingX-containersData-integrity", function() {
    let uss;
    it("Checks if the stopScrollingX function cleans the uss._containersData's arrays correctly", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrollingX, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isXScrolling()).to.be.false;
                })
                .then(() => {
                    uss._containersData = new Map();

                    const _testCallback = () => {};
                    const _testCalculatorFixed = () => 10;
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
                    const _resizeCallbacksQueue = [_testCallback];
                    const _mutationCallbacksQueue = [_testCallback];

                    uss.setXStepLengthCalculator(_testCalculatorFixed, uss.getPageScroller(), false);
                    uss.setXStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(), true);
                    uss.setYStepLengthCalculator(_testCalculatorFixed, uss.getPageScroller(), false);
                    uss.setYStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(), true);

                    uss.addResizeCallback(_testCallback, uss.getPageScroller());
                    uss.addMutationCallback(_testCallback, uss.getPageScroller());

                    uss.stopScrollingX(uss.getPageScroller());

                    const _containerData = uss._containersData.get(uss.getPageScroller());
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
                    
                    //Check if the stepLengthCalculators are preserved.
                    expect(_containerData[constants.K_FSCX]).to.equal(_testCalculatorFixed); //fixed xStepLengthCalculator
                    expect(_containerData[constants.K_FSCY]).to.equal(_testCalculatorFixed); //fixed yStepLengthCalculator
                    expect(_containerData[constants.K_TSCX]).to.be.undefined;                       //temporary xStepLengthCalculator
                    expect(_containerData[constants.K_TSCY]).to.equal(_testCalculatorTemporary);    //temporary yStepLengthCalculator

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
                    expect(constants.arraysAreEqual(_containerData[constants.K_MCBQ], _mutationCallbacksQueue)).to.be.true;
                });
            });         
    });
});

describe("stopScrollingX-containersData-integrity-with-scroll-on-y-axis", function() {
    let uss;
    it("Checks if the stopScrollingX function cleans the uss._containersData's arrays correctly whenever there's a scroll-animation on the y-axis", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                cy.testFailingValues(uss.stopScrollingX, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isXScrolling()).to.be.false;
                })
                .then(() => {
                    uss._containersData = new Map();

                    const _testCallback = () => {};
                    const _testCalculatorFixed = () => 10;
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
                    const _resizeCallbacksQueue = [_testCallback];
                    const _mutationCallbacksQueue = [_testCallback];

                    uss.setXStepLengthCalculator(_testCalculatorFixed, uss.getPageScroller(), false);
                    uss.setXStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(), true);
                    uss.setYStepLengthCalculator(_testCalculatorFixed, uss.getPageScroller(), false);
                    uss.setYStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(), true);

                    uss.addResizeCallback(_testCallback, uss.getPageScroller());
                    uss.addMutationCallback(_testCallback, uss.getPageScroller());

                    uss.scrollYBy(10, uss.getPageScroller(), _testCallback);
                    uss.stopScrollingX(uss.getPageScroller());

                    const _containerData = uss._containersData.get(uss.getPageScroller());
                    const _withValKeys = [
                        constants.K_IDY,
                        constants.K_FPY,
                        constants.K_SDY,
                        constants.K_TSAY,
                        //constants.K_OTSY, //This is set to NO_VAL on purpose by the API.
                        constants.K_CBY,
                    ];
                    const _noValKeys = [
                        constants.K_IDX,
                        constants.K_FPX,
                        constants.K_SDX,
                        constants.K_TSAX,
                        constants.K_OTSX,
                        constants.K_CBX,
                    ];

                    //Check if the _containerData still contains information about the scroll-animation on the y-axis.
                    for(const key of _withValKeys) {
                        expect(_containerData[key]).to.not.equal(constants.NO_VAL);
                    }

                    //Check if the _containerData doesn't contain unecessary leftover values. 
                    for(const key of _noValKeys) {
                        expect(_containerData[key]).to.equal(constants.NO_VAL);
                    }
                    
                    //Check if the stepLengthCalculators are preserved.
                    expect(_containerData[constants.K_FSCX]).to.equal(_testCalculatorFixed); //fixed xStepLengthCalculator
                    expect(_containerData[constants.K_FSCY]).to.equal(_testCalculatorFixed); //fixed yStepLengthCalculator
                    expect(_containerData[constants.K_TSCX]).to.be.undefined;                       //temporary xStepLengthCalculator
                    expect(_containerData[constants.K_TSCY]).to.equal(_testCalculatorTemporary);    //temporary yStepLengthCalculator

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
                    expect(constants.arraysAreEqual(_containerData[constants.K_MCBQ], _mutationCallbacksQueue)).to.be.true;
                });
            });         
    });
});