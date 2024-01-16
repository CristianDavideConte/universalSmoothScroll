import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("calcScrollbarsDimensions-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("calcScrollbarsDimensions", function () {
    function _getCurrentScrollPos(el) {
        return [
            uss.getScrollXCalculator(el)(),
            uss.getScrollYCalculator(el)()
        ];
    }
    it("Tests the calcScrollbarsDimensions method", function () {
        cy.window()
            .then((win) => {
                //uss._containersData.clear(); //TODO: The observers should be detached
                //expect(uss._containersData.size).to.equal(0);

                //Test the window's scrollbars. 
                const _windowScrollbarsDimensions = uss.calcScrollbarsDimensions(win, true);
                expect(constants.arraysAreEqual(
                    _windowScrollbarsDimensions,
                    uss.calcScrollbarsDimensions(uss.getWindowScroller(win, true))
                )
                ).to.be.true;
                    
                const _windowScrollbarsCachedDimensions = [
                    uss._containersData.get(win)[constants.K_VSB],
                    uss._containersData.get(win)[constants.K_HSB],
                ];
                expect(constants.arraysAreEqual(
                    _windowScrollbarsDimensions,
                    _windowScrollbarsCachedDimensions
                )
                ).to.be.true;

                cy.testFailingValues(uss.calcScrollbarsDimensions, {
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

                        //Test the scrollbars' dimensions of document.head's elements.
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_head), [0, 0])).to.be.true;
                        Array.from(_head.children).forEach(el => expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(el), [0, 0])).to.be.true);

                        //Test the scrollbars' dimensions.
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(uss.getPageScroller(win)), [_maxDim, 0])).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_noScrollbarElement), [0, 0])).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXAxis), [_maxDim, 0])).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheYAxis), [0, _maxDim])).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes), [_maxDim, _maxDim])).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(uss.getWindowScroller(win)),
                            uss.calcScrollbarsDimensions(win))
                        ).to.be.true;

                        //Test if the scroll positions have changed due to the measuring (they should not).
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(win), _windowOriginalPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_pageScroller), _pageScrollerOriginalPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_noScrollbarElement), _noScrollbarElementOriginalScrollPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXAxis), _elementWithScrollbarOnTheXAxisOriginalScrollPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheYAxis), _elementWithScrollbarOnTheYAxisOriginalScrollPos)).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _elementWithScrollbarOnTheXYAxesOriginalScrollPos)).to.be.true;
                    
                        //Test if the methods that stop one or more scroll-animation/s, actually erase the cached values (they should not).
                        const _dims = uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true);
                        uss.stopScrollingX(_elementWithScrollbarOnTheXYAxes);
                        uss.stopScrollingY(_elementWithScrollbarOnTheXYAxes);
                        uss.stopScrolling(_elementWithScrollbarOnTheXYAxes);
                        uss.stopScrollingAll();
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes), _dims)).to.be.true;
                    });
            });
    });
});

describe("calcScrollbarsDimensions-webkit-scrollbar-modifiers", function () {
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
    it("Tests the calcScrollbarsDimensions method with elements that have the ::webkit-scrollbar css modifier", function () {
        cy.window()
            .then((win) => {
                //Firefox doens't support the ::webkit-scrollbar css modifier
                if (browserIsFirefox(win)) return;
                
                cy.testFailingValues(uss.calcScrollbarsDimensions, {
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
                    
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes),
                            [_maxDim, _maxDim])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                        _elementWithScrollbarOnTheXYAxes.classList.add("no-webkit-scrollbars");
                        _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false),
                            [_maxDim, _maxDim])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true),
                            [0, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;

                        _elementWithScrollbarOnTheXYAxes.classList.remove("no-webkit-scrollbars");
                        _elementWithScrollbarOnTheXYAxes.classList.add("width-0-scrollbars");
                        _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false),
                            [0, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true),
                            [0, _maxDim])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                    
                        _elementWithScrollbarOnTheXYAxes.classList.remove("width-0-scrollbars");
                        _elementWithScrollbarOnTheXYAxes.classList.add("height-0-scrollbars");
                        _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false),
                            [0, _maxDim])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true),
                            [_maxDim, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
       
                        _elementWithScrollbarOnTheXYAxes.classList.remove("height-0-scrollbars");
                        _elementWithScrollbarOnTheXYAxes.classList.add("width-0-height-0-scrollbars");
                        _originalScrollPos = _getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes);
                    
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, false),
                            [_maxDim, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcScrollbarsDimensions(_elementWithScrollbarOnTheXYAxes, true),
                            [0, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(_getCurrentScrollPos(_elementWithScrollbarOnTheXYAxes), _originalScrollPos)).to.be.true;
                    });
            });
    });
});