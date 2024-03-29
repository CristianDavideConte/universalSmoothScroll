const { constants } = require("../support/constants");

function arraysAreEqual(arr1, arr2) {
    if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if(arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false;
    }
    return true;
}

beforeEach(() => {
    cy.visit("calcYScrollbarDimension-tests.html"); 
})

describe("calcYScrollbarDimension", function() {
    let uss;

    function _getCurrentScrollPos(el) {
        return [
            uss.getScrollXCalculator(el)(), 
            uss.getScrollYCalculator(el)()
        ];
    }
    it("Tests the calcYScrollbarDimension method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                
                uss._containersData = new Map();
                expect(uss._containersData.size).to.equal(0);

                //Test if the window's y scrollbar is cached correctly. 
                const _windowYScrollbarDimension = uss.calcYScrollbarDimension(win, true);
                expect(_windowYScrollbarDimension).to.equal(uss.calcYScrollbarDimension(uss.getPageScroller(true)));
                const _windowYScrollbarCachedDimension = uss._containersData.get(win)[19];
                expect(_windowYScrollbarDimension).to.equal(_windowYScrollbarCachedDimension);

                cy.testFailingValues(uss.calcYScrollbarDimension, {
                    0: [constants.failingValuesAll,
                        [true, false],
                       ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                })
                .then(() => {
                    const _maxDim = uss.getScrollbarsMaxDimension();
                    const _pageScroller = win.document.scrollingElement || win.document.body;

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

                    uss.setPageScroller(win.document.scrollingElement || win.document.body);

                    //Test the scrollbars dimensions.
                    expect(uss.calcYScrollbarDimension(_noScrollbarElement)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXAxis)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheYAxis)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(uss.getPageScroller())).to.equal(uss.calcYScrollbarDimension(win));

                    //Test if the scroll positions have changed due to the measuring (they should not).
                    expect(arraysAreEqual(_getCurrentScrollPos(win), _windowOriginalPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_pageScroller), _pageScrollerOriginalPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_noScrollbarElement), _noScrollbarElementOriginalScrollPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXAxis), _elementWithScrollbarOnTheXAxisOriginalScrollPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheYAxis), _elementWithScrollbarOnTheYAxisOriginalScrollPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _elementWithScrollbarOnTheXYAxesOriginalScrollPos)).to.be.true;

                    //Test if the yielded results are the same as the uss.calcScrollbarsDimensions method
                    expect(uss.calcYScrollbarDimension(_pageScroller)).to.equal(uss.calcScrollbarsDimensions(_pageScroller)[1]);
                    expect(uss.calcYScrollbarDimension(_noScrollbarElement)).to.equal(uss.calcScrollbarsDimensions(_noScrollbarElement)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXAxis)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXAxis)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheYAxis)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheYAxis)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[1]);
                                    
                    //Test if the methods used for stopping one or more scroll-animation/s erase the cached values (they should not).
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
    let uss;
    
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
                
                uss = win.uss;
                
                cy.testFailingValues(uss.calcYScrollbarDimension, {
                    0: [constants.failingValuesAll]
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
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                    _elementWithScrollbarOnTheXYAxes.classList.add("no-webkit-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false)[1]);
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                    _elementWithScrollbarOnTheXYAxes.classList.remove("no-webkit-scrollbars");
                    _elementWithScrollbarOnTheXYAxes.classList.add("width-0-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false)[1]);
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                    
                    _elementWithScrollbarOnTheXYAxes.classList.remove("width-0-scrollbars");
                    _elementWithScrollbarOnTheXYAxes.classList.add("height-0-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_maxDim);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false)[1]);
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
       
                    _elementWithScrollbarOnTheXYAxes.classList.remove("height-0-scrollbars");
                    _elementWithScrollbarOnTheXYAxes.classList.add("width-0-height-0-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(0);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true)[1]);
                    expect(uss.calcYScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false)[1]);
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                });
            });        
    });
})