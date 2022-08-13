const { constants } = require("../support/constants");

function arraysAreEqual(arr1, arr2) {
    if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if(arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false;
    }
    return true;
}

describe("calcScrollbarsDimensions", function() {
    let uss;

    function _getCurrentScrollPos(el) {
        return [
            uss.getScrollXCalculator(el)(), 
            uss.getScrollYCalculator(el)()
        ];
    }
    it("Tests the calcScrollbarsDimensions method", function() {
        cy.visit("calcScrollbarsDimensions-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                                
                uss._containersData = new Map();
                expect(uss._containersData.size).to.equal(0);

                //Test if the window's scrollbars are cached correctly. 
                const _windowScrollbarsDimensions = uss.calcScrollbarsDimensions(win, true);
                expect(arraysAreEqual(
                        _windowScrollbarsDimensions,
                        uss.calcScrollbarsDimensions(uss.getPageScroller(true))
                        )
                ).to.be.true;
                const _windowScrollbarsCachedDimensions = uss._containersData.get(win).slice(18, 20);
                expect(arraysAreEqual(
                        _windowScrollbarsDimensions,
                        _windowScrollbarsCachedDimensions
                        )
                ).to.be.true;

                cy.testFailingValues(uss.calcScrollbarsDimensions, {
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
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_noScrollbarElement), [0,0])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXAxis), [_maxDim,0])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheYAxis), [0,_maxDim])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes), [_maxDim,_maxDim])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(uss.getPageScroller()), 
                                          uss.calcScrollbarsDimensions(win))
                    ).to.be.true;

                    //Test if the scroll positions have changed due to the measuring (they should not).
                    expect(arraysAreEqual(_getCurrentScrollPos(win), _windowOriginalPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_pageScroller), _pageScrollerOriginalPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_noScrollbarElement), _noScrollbarElementOriginalScrollPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXAxis), _elementWithScrollbarOnTheXAxisOriginalScrollPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheYAxis), _elementWithScrollbarOnTheYAxisOriginalScrollPos)).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _elementWithScrollbarOnTheXYAxesOriginalScrollPos)).to.be.true;
                
                    //Test if the methods used for stopping one or more scroll-animation/s erase the cached values (they should not).
                    const _dims = uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true);
                    uss.stopScrollingX(_elementWithScrollbarOnTheXYAxes);
                    uss.stopScrollingY(_elementWithScrollbarOnTheXYAxes);
                    uss.stopScrolling(_elementWithScrollbarOnTheXYAxes);
                    uss.stopScrollingAll();
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes), _dims)).to.be.true;
                });
            });        
    });
})

describe("calcScrollbarsDimensions-webkit-scrollbar-modifiers", function() {
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
    it("Tests the calcScrollbarsDimensions method with elements that have the ::webkit-scrollbar css modifier", function() {
        cy.visit("calcScrollbarsDimensions-tests.html"); 
        cy.window()
            .then((win) => {
                //Firefox doens't support the ::webkit-scrollbar css modifier
                if(browserIsFirefox(win)) return;
                
                uss = win.uss;
                
                cy.testFailingValues(uss.calcScrollbarsDimensions, {
                    0: [constants.failingValuesAll]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                })
                .then(() => {
                    const _maxDim = uss.getScrollbarsMaxDimension();

                    const _elementWithScrollbarOnTheXYAxes = win.document.getElementById("xy-scroller");
                    let _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes), 
                                          [_maxDim,_maxDim])
                    ).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                    _elementWithScrollbarOnTheXYAxes.classList.add("no-webkit-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false), 
                                          [_maxDim,_maxDim])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true), 
                                          [0,0])
                    ).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                    _elementWithScrollbarOnTheXYAxes.classList.remove("no-webkit-scrollbars");
                    _elementWithScrollbarOnTheXYAxes.classList.add("width-0-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false), 
                                         [0,0])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true), 
                                          [0,_maxDim])
                    ).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                    
                    _elementWithScrollbarOnTheXYAxes.classList.remove("width-0-scrollbars");
                    _elementWithScrollbarOnTheXYAxes.classList.add("height-0-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false), 
                                         [0,_maxDim])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true), 
                                          [_maxDim,0])
                    ).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
       
                    _elementWithScrollbarOnTheXYAxes.classList.remove("height-0-scrollbars");
                    _elementWithScrollbarOnTheXYAxes.classList.add("width-0-height-0-scrollbars");
                    _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false), 
                                          [_maxDim,0])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true), 
                                          [0,0])
                    ).to.be.true;
                    expect(arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                });
            });        
    });
})