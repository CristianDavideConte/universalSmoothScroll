import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("calcXScrollbarDimension-tests.html"); 
})

describe("calcXScrollbarDimension", function () {
    function _getCurrentScrollPos(el) {
        return [
            uss.getScrollXCalculator(el)(),
            uss.getScrollYCalculator(el)()
        ];
    }
    it("Tests the calcXScrollbarDimension method", function () {
        cy.window()
            .then((win) => {
                //uss._containersData.clear(); //TODO: The observers should be detached
                //expect(uss._containersData.size).to.equal(0);

                //Test the window's x-scrollbar. 
                const _windowXScrollbarDimension = uss.calcXScrollbarDimension(win, true);
                expect(_windowXScrollbarDimension).to.equal(uss.calcXScrollbarDimension(uss.getWindowScroller(win, true)));

                const _windowXScrollbarCachedDimension = uss._containersData.get(win)[constants.K_VSB];
                expect(_windowXScrollbarDimension).to.equal(_windowXScrollbarCachedDimension);

                cy.testFailingValues(uss.calcXScrollbarDimension, {
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

                        //Test the x-scrollbar's dimension of document.head's elements.
                        expect(uss.calcXScrollbarDimension(_head)).to.equal(0);
                        Array.from(_head.children).forEach(el => expect(uss.calcXScrollbarDimension(el)).to.equal(0));

                        //Test the x-scrollbar's dimension.
                        expect(uss.calcXScrollbarDimension(uss.getPageScroller(win))).to.equal(_maxDim);
                        expect(uss.calcXScrollbarDimension(_noScrollbarElement)).to.equal(0);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXAxis)).to.equal(_maxDim);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheYAxis)).to.equal(0);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes)).to.equal(_maxDim);
                        expect(uss.calcXScrollbarDimension(uss.getWindowScroller(win))).to.equal(uss.calcXScrollbarDimension(win));

                        //Test if the scroll positions have changed due to the measuring (they should not).
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(win), _windowOriginalPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_pageScroller), _pageScrollerOriginalPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_noScrollbarElement), _noScrollbarElementOriginalScrollPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXAxis), _elementWithScrollbarOnTheXAxisOriginalScrollPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheYAxis), _elementWithScrollbarOnTheYAxisOriginalScrollPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _elementWithScrollbarOnTheXYAxesOriginalScrollPos)).to.be.true;

                        //Test if the yielded results are the same as the uss.calcScrollbarsDimensions method
                        expect(uss.calcXScrollbarDimension(_pageScroller)).to.equal(uss.calcScrollbarsDimensions(_pageScroller)[0]);
                        expect(uss.calcXScrollbarDimension(_noScrollbarElement)).to.equal(uss.calcScrollbarsDimensions(_noScrollbarElement)[0]);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXAxis)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXAxis)[0]);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheYAxis)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheYAxis)[0]);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0]);
               
                        //Test if the methods that stop one or more scroll-animation/s, actually erase the cached values (they should not).
                        const _dim = uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true);
                        uss.stopScrollingX(_elementWithScrollbarOnTheXYAxes);
                        uss.stopScrollingY(_elementWithScrollbarOnTheXYAxes);
                        uss.stopScrolling(_elementWithScrollbarOnTheXYAxes);
                        uss.stopScrollingAll();
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_dim);
                    });
            });
    });
});

describe("calcXScrollbarDimension-webkit-scrollbar-modifiers", function () {
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
    it("Tests the calcXScrollbarDimension method with elements that have the ::webkit-scrollbar css modifier", function () {
        cy.window()
            .then((win) => {
                //Firefox doens't support the ::webkit-scrollbar css modifier
                if (browserIsFirefox(win)) return;
                
                cy.testFailingValues(uss.calcXScrollbarDimension, {
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
                    
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(_maxDim);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_maxDim);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], true);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], false);
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                        _elementWithScrollbarOnTheXYAxes.classList.add("no-webkit-scrollbars");
                        _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_maxDim);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(0);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], true);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], false);
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                        _elementWithScrollbarOnTheXYAxes.classList.remove("no-webkit-scrollbars");
                        _elementWithScrollbarOnTheXYAxes.classList.add("width-0-scrollbars");
                        _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(0);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(0);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], true);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], false);
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                    
                        _elementWithScrollbarOnTheXYAxes.classList.remove("width-0-scrollbars");
                        _elementWithScrollbarOnTheXYAxes.classList.add("height-0-scrollbars");
                        _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(0);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(_maxDim);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], true);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], false);
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
       
                        _elementWithScrollbarOnTheXYAxes.classList.remove("height-0-scrollbars");
                        _elementWithScrollbarOnTheXYAxes.classList.add("width-0-height-0-scrollbars");
                        _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(_maxDim);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(0);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, true)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], true);
                        expect(uss.calcXScrollbarDimension(_elementWithScrollbarOnTheXYAxes, false)).to.equal(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes)[0], false);
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                    });
            });
    });
});