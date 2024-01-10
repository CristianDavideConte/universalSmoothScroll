import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("stopScrollingY-tests.html"); 
})

describe("stopScrollingY", function() {
    it("Tests the stopScrollingY method", function() {
        cy.window()
            .then((win) => {
                cy.testFailingValues(uss.stopScrollingY, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
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
                                expect(uss.isYScrolling(el)).to.be.false;
                                uss.scrollYTo(100, el, resolve); 
                                expect(uss.isYScrolling(el)).to.be.true;

                                win.setTimeout(() => {
                                    uss.stopScrollingY(el);

                                    if(_elements.filter(el => uss.isScrolling(el)).length <= 0) {
                                        resolve();
                                    }
                                }, 20);
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
    it("Initialize a series of scroll-animations on the x-axis of all scrollable containers and immediately stop them", function() {
        cy.window()
            .then((win) => {
                cy.testFailingValues(uss.stopScrollingY, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
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
                        cy.waitForUssCallback(
                            (resolve) => {
                                expect(uss.isYScrolling(el)).to.be.false;                      
                                uss.scrollYTo(100, el, resolve); 
                                expect(uss.isYScrolling(el)).to.be.true;
                                resolve();
                            }
                        ).then(
                            () => {
                                uss.stopScrollingY(el);
                                expect(uss.isYScrolling(el)).to.be.false;  
                            }
                        );
                    }); 
                });
            });         
    });
})

describe("stopScrollingY-containersData-integrity", function() {
    it("Checks if the stopScrollingY function cleans the uss._containersData's arrays correctly", function() {
        cy.window()
            .then((win) => {
                cy.testFailingValues(uss.stopScrollingY, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isYScrolling()).to.be.false;
                })
                .then(() => {
                    uss._containersData.clear();

                    const _testCallback = () => {};
                    const _testCalculatorFixed = () => 10;
                    const _testCalculatorTemporary = () => 20;
                    const _maxScrollX = uss.getMaxScrollX(uss.getPageScroller(win));
                    const _maxScrollY = uss.getMaxScrollY(uss.getPageScroller(win));
                    const _xScrollbarSize = uss.calcXScrollbarDimension(uss.getPageScroller(win));
                    const _yScrollbarSize = uss.calcYScrollbarDimension(uss.getPageScroller(win));
                    const _bordersSizes = uss.calcBordersDimensions(uss.getPageScroller(win));
                    const _scrollableParentXNotHidden = uss.getXScrollableParent(uss.getPageScroller(win), false);
                    const _scrollableParentXHidden = uss.getXScrollableParent(uss.getPageScroller(win), true);
                    const _scrollableParentYNotHidden = uss.getYScrollableParent(uss.getPageScroller(win), false);
                    const _scrollableParentYHidden = uss.getYScrollableParent(uss.getPageScroller(win), true);
                    const _scrollXCalculator = uss.getScrollXCalculator(uss.getPageScroller(win));
                    const _scrollYCalculator = uss.getScrollYCalculator(uss.getPageScroller(win));
                    const _resizeCallbacksQueue = [_testCallback];
                    const _mutationCallbacksQueue = [_testCallback];

                    uss.setXStepLengthCalculator(_testCalculatorFixed, uss.getPageScroller(win), false);
                    uss.setXStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(win), true);
                    uss.setYStepLengthCalculator(_testCalculatorFixed, uss.getPageScroller(win), false);
                    uss.setYStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(win), true);

                    uss.addResizeCallback(_testCallback, uss.getPageScroller(win));
                    uss.addMutationCallback(_testCallback, uss.getPageScroller(win));

                    uss.stopScrollingY(uss.getPageScroller(win));

                    const _containerData = uss._containersData.get(uss.getPageScroller(win));
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
                    expect(_containerData[constants.K_PSCX]).to.equal(_testCalculatorFixed); //fixed xStepLengthCalculator 
                    expect(_containerData[constants.K_PSCY]).to.equal(_testCalculatorFixed); //fixed yStepLengthCalculator
                    expect(_containerData[constants.K_TSCX]).to.equal(_testCalculatorTemporary);    //temporary xStepLengthCalculator 
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
                    expect(constants.arraysAreEqual(_containerData[constants.K_MCBQ], _mutationCallbacksQueue)).to.be.true;
                });
            });         
    });
});

describe("stopScrollingY-containersData-integrity-with-scroll-on-x-axis", function() {
    it("Checks if the stopScrollingY function cleans the uss._containersData's arrays correctly whenever there's a scroll-animation on the x-axis", function() {
        cy.window()
            .then((win) => {
                cy.testFailingValues(uss.stopScrollingX, {
                    0: [constants.failingValuesNoUndefined]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.isXScrolling()).to.be.false;
                })
                .then(() => {
                    uss._containersData.clear();

                    const _testCallback = () => {};
                    const _testCalculatorFixed = () => 10;
                    const _testCalculatorTemporary = () => 20;
                    const _maxScrollX = uss.getMaxScrollX(uss.getPageScroller(win));
                    const _maxScrollY = uss.getMaxScrollY(uss.getPageScroller(win));
                    const _xScrollbarSize = uss.calcXScrollbarDimension(uss.getPageScroller(win));
                    const _yScrollbarSize = uss.calcYScrollbarDimension(uss.getPageScroller(win));
                    const _bordersSizes = uss.calcBordersDimensions(uss.getPageScroller(win));
                    const _scrollableParentXNotHidden = uss.getXScrollableParent(uss.getPageScroller(win), false);
                    const _scrollableParentXHidden = uss.getXScrollableParent(uss.getPageScroller(win), true);
                    const _scrollableParentYNotHidden = uss.getYScrollableParent(uss.getPageScroller(win), false);
                    const _scrollableParentYHidden = uss.getYScrollableParent(uss.getPageScroller(win), true);
                    const _scrollXCalculator = uss.getScrollXCalculator(uss.getPageScroller(win));
                    const _scrollYCalculator = uss.getScrollYCalculator(uss.getPageScroller(win));
                    const _resizeCallbacksQueue = [_testCallback];
                    const _mutationCallbacksQueue = [_testCallback];

                    uss.setXStepLengthCalculator(_testCalculatorFixed, uss.getPageScroller(win), false);
                    uss.setXStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(win), true);
                    uss.setYStepLengthCalculator(_testCalculatorFixed, uss.getPageScroller(win), false);
                    uss.setYStepLengthCalculator(_testCalculatorTemporary, uss.getPageScroller(win), true);

                    uss.addResizeCallback(_testCallback, uss.getPageScroller(win));
                    uss.addMutationCallback(_testCallback, uss.getPageScroller(win));

                    uss.scrollXBy(10, uss.getPageScroller(win), _testCallback);
                    uss.stopScrollingY(uss.getPageScroller(win));

                    const _containerData = uss._containersData.get(uss.getPageScroller(win));
                    const _withValKeys = [
                        constants.K_IDX,
                        constants.K_FPX,
                        constants.K_SDX,
                        constants.K_TSAX,
                        //constants.K_OTSX, //This is set to NO_VAL on purpose by the API.
                        constants.K_CBX,
                    ];
                    const _noValKeys = [
                        constants.K_IDY,
                        constants.K_FPY,
                        constants.K_SDY,
                        constants.K_TSAY,
                        constants.K_OTSY,
                        constants.K_CBY,
                    ];

                    //Check if the _containerData still contains information about the scroll-animation on the x-axis.
                    for(const key of _withValKeys) {
                        expect(_containerData[key]).to.not.equal(constants.NO_VAL);
                    }

                    //Check if the _containerData doesn't contain unecessary leftover values. 
                    for(const key of _noValKeys) {
                        expect(_containerData[key]).to.equal(constants.NO_VAL);
                    }
                    
                    //Check if the stepLengthCalculators are preserved.
                    expect(_containerData[constants.K_PSCX]).to.equal(_testCalculatorFixed); //fixed xStepLengthCalculator
                    expect(_containerData[constants.K_PSCY]).to.equal(_testCalculatorFixed); //fixed yStepLengthCalculator
                    expect(_containerData[constants.K_TSCX]).to.equal(_testCalculatorTemporary);    //temporary xStepLengthCalculator
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
                    expect(constants.arraysAreEqual(_containerData[constants.K_MCBQ], _mutationCallbacksQueue)).to.be.true;
                });
            });         
    });
});