import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("calcYScrollbarDimension-tests.html"); 
})

describe("calcYScrollbarDimension", function() {
    function _getCurrentScrollPos(el) {
        return [
            uss.getScrollXCalculator(el)(), 
            uss.getScrollYCalculator(el)()
        ];
    }
    it("Tests the calcYScrollbarDimension method", function() {
        cy.window()
            .then((win) => {
                uss._containersData.clear();
                expect(uss._containersData.size).to.equal(0);

                //Test the window's y-scrollbar. 
                const _windowYScrollbarDimension = uss.calcYScrollbarDimension(win, true);
                expect(_windowYScrollbarDimension).to.equal(uss.calcYScrollbarDimension(uss.getWindowScroller(win, true)));

                const _windowYScrollbarCachedDimension = uss._containersData.get(win)[constants.K_HSB];
                expect(_windowYScrollbarDimension).to.equal(_windowYScrollbarCachedDimension);

                cy.testFailingValues(uss.calcYScrollbarDimension, {
                    0: [constants.failingValuesAllNoUndefined,
                        [true, false],
                       ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                })
                .then(() => {
                    const _maxDim = uss.getScrollbarsMaxDimension();
                    const _pageScroller = win.document.scrollingElement || win.document.body;

                    const _head = win.document.head;
                    const _noScrollbarElement = win.document.getElementById("no-scroller");
                    const _elementWithScrollbarOnTheXAxis = win.document.getElementById("y-scroller");
                    const _elementWithScrollbarOnTheYAxis = win.document.getElementById("x-scroller");
                    const _elementWithScrollbarOnTheXYAxes = win.document.getElementById("xy-scroller");

                    const _windowOriginalPos = _getCurrentScrollPos(win);
                    const _pageScrollerOriginalPos = _getCurrentScrollPos(_pageScroller);
                    const _noScrollbarElementOriginalScrollPos = _getCurrentScrollPos(_noScrollbarElement);
                    const _elementWithScrollbarOnTheXAxisOriginalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXAxis);
                    const _elementWithScrollbarOnTheYAxisOriginalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheYAxis);
                    const _elementWithScrollbarOnTheXYAxesOriginalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);

                    uss.setPageScroller(_pageScroller);

                    //Test the y-scrollbar's dimension of document.head's elements.
                    expect(uss.calcYScrollbarDimension(_head)).to.equal(0);
                    Array.from(_head.children).forEach(el => expect(uss.calcYScrollbarDimension(el)).to.equal(0));

                    //Test the y-scrollbar's dimension.
                    expect(uss.calcYScrollbarDimension(uss.getPageScroller())).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_noScrollbarElement)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXAxis)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheYAxis)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(uss.getWindowScroller(win))).to.equal(uss.calcYScrollbarDimension(win));

                    //Test if the scroll positions have changed due to the measuring (they should not).
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(win), _windowOriginalPos)).to.be.true;
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_pageScroller), _pageScrollerOriginalPos)).to.be.true;
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_noScrollbarElement), _noScrollbarElementOriginalScrollPos)).to.be.true;
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXAxis), _elementWithScrollbarOnTheXAxisOriginalScrollPos)).to.be.true;
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheYAxis), _elementWithScrollbarOnTheYAxisOriginalScrollPos)).to.be.true;
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _elementWithScrollbarOnTheXYAxesOriginalScrollPos)).to.be.true;

                    //Test if the yielded results are the same as the uss.calcScrollbarsDimensions method
                    expect(uss.calcYScrollbarDimension(_pageScroller)).to.equal(uss.calcScrollbarsDimensions(_pageScroller)[1]);
                    expect(uss.calcYScrollbarDimension(_noScrollbarElement)).to.equal(uss.calcScrollbarsDimensions(_noScrollbarElement)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXAxis)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXAxis)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheYAxis)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheYAxis)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[1]);
                                    
                    //Test if the methods that stop one or more scroll-animation/s, actually erase the cached values (they should not).
                    const _dim = uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true);
                    uss.stopScrollingX(_elementWithScrollbarOnTheXYAxes);
                    uss.stopScrollingY(_elementWithScrollbarOnTheXYAxes);
                    uss.stopScrolling(_elementWithScrollbarOnTheXYAxes);
                    uss.stopScrollingAll();
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_dim);
                });
            });        
    });
})

describe("calcYScrollbarDimension-webkit-scrollbar-modifiers", function() {
    //Source: https://stackoverflow.com/questions/7000190/detect-all-firefox-versions-in-js
    function browserIsFirefox(window) {
        return window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }
    
    function _getCurrentScrollPos(el) {
        return [
            uss.getScrollXCalculator(el)(), 
            uss.getScrollYCalculator(el)()
        ];
    }
    it("Tests the calcYScrollbarDimension method with elements that have the ::webkit-scrollbar css modifier", function() {
        cy.window()
            .then((win) => {
                //Firefox doens't support the ::webkit-scrollbar css modifier
                if(browserIsFirefox(win)) return;
                
                cy.testFailingValues(uss.calcYScrollbarDimension, {
                    0: [constants.failingValuesAllNoUndefined,
                        [true, false],
                       ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                })
                .then(() => {
                    const _maxDim = uss.getScrollbarsMaxDimension();

                    const _elementWithScrollbarOnTheXYAxes = win.document.getElementById("xy-scroller");
                    let _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false)[1]);
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                    _elementWithScrollbarOnTheXYAxes.classList.add("no-webkit-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false)[1]);
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                    _elementWithScrollbarOnTheXYAxes.classList.remove("no-webkit-scrollbars");
                    _elementWithScrollbarOnTheXYAxes.classList.add("width-0-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false)[1]);
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                    
                    _elementWithScrollbarOnTheXYAxes.classList.remove("width-0-scrollbars");
                    _elementWithScrollbarOnTheXYAxes.classList.add("height-0-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false)[1]);
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
       
                    _elementWithScrollbarOnTheXYAxes.classList.remove("height-0-scrollbars");
                    _elementWithScrollbarOnTheXYAxes.classList.add("width-0-height-0-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false)[1]);
                    expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                });
            });        
    });
})