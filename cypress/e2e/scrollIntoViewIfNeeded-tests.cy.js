import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

/**
 * Returns the relative position of the element wrt the parent.
 * The position is expressed as an object containing the absolute values of distances
 * between the sides of the element and the ones of the parent.
 */
function getDeltas(element, parent) {
    const _bordersDimensions = uss.calcBordersDimensions(parent);
    const _scrollbarsDimensions = uss.calcScrollbarsDimensions(parent);

    const _elPos = element.getBoundingClientRect();
    const _containerPos = !common.IS_WINDOW(parent) ? parent.getBoundingClientRect() :
        { top: 0, right: parent.innerWidth, bottom: parent.innerHeight, left: 0 };

    const _topDelta = _elPos.top - _containerPos.top - _bordersDimensions[0];
    const _rightDelta = _elPos.right - _containerPos.right + _bordersDimensions[1] + _scrollbarsDimensions[0];
    const _bottomDelta = _elPos.bottom - _containerPos.bottom + _bordersDimensions[2] + _scrollbarsDimensions[1];
    const _leftDelta = _elPos.left - _containerPos.left - _bordersDimensions[3];

    return {
        topDelta: Math.abs(_topDelta),
        rightDelta: Math.abs(_rightDelta),
        bottomDelta: Math.abs(_bottomDelta),
        leftDelta: Math.abs(_leftDelta),
    }
}

/**
 * "elements" is an array of objects. 
 * 
 * This is an example of "elements": 
 * [
 *    {
 *     el:element1, 
 *     alignCenter:true, 
 *     includeHiddenParents: false,
 *     tests: [
 *         (el) => {
 *             expect(el...).to...    
 *         },
 *         (el) => {
 *             expect(el...).to...    
 *         },
 *     ]
 *    },
 *    {
 *     el:element2, 
 *     alignCenter:false, 
 *     includeHiddenParents: true,
 *     tests: [
 *         (el) => {
 *             expect(el...).to...    
 *         },
 *         (el) => {
 *             expect(el...).to...    
 *         },
 *     ]
 *    }
 * ]
 */
function _scrollIntoViewTester(
    resolve,
    elements = [],
    i = 0,
) {
    if (i >= elements.length) {
        resolve();
        return;
    }

    /**
     * Some tests require the containers to scroll before checking the positions.
     * Since the scrolling requires at least one frame, this for-loop forces the
     * _scrollIntoViewTester function to wait for scroll-animations to complete.
     */
    for (const container of uss._containersData.keys()) {
        if (uss.isScrolling(container)) {
            common.TOP_WINDOW.setTimeout(() => _scrollIntoViewTester(resolve, elements, i), 0);
            return;
        }
    }

    uss.scrollIntoViewIfNeeded(
        elements[i].el,
        elements[i].alignCenter,
        () => {
            //Test the correct alignment of the current element
            for (const test of elements[i].tests) {
                test(elements[i].el);
            }

            i++;
            _scrollIntoViewTester(resolve, elements, i);
        },
        elements[i].includeHiddenParents
    );
}

beforeEach(() => {
    //Whenever the page is scaled (perhaps there isn't enough space to respect the default 1000x660 viewport),
    //the number pixels scrolled is inconsistent/may vary.
    //Cypress doesn't correctly report the window.innerWidth/window.innerHeight whenever the page is scaled, 
    //so there's no way to adjust the tests.
    //This is a quick fix: shrink the viewport down so that is unlikely that the page is ever scaled.
    //This trick doens't affect the test results.
    cy.viewport(100, 200);
    cy.visit("scrollIntoViewIfNeeded-tests.html");

    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("scrollIntoViewIfNeeded-corners-nearest-alignments", function () {
    it("Tests the scrollIntoViewIfNeeded method with all the corners/nearest alignments", function () {
        cy.window()
            .then((win) => {
                const _testElement1 = win.document.getElementById("scroller-container-1");

                const _testElement111 = win.document.getElementById("scroller-content-111");
                const _testElement112 = win.document.getElementById("scroller-content-112");
                const _testElement121 = win.document.getElementById("scroller-content-121");
                const _testElement122 = win.document.getElementById("scroller-content-122");

                const _initialScrollLeft = _testElement1.scrollLeft;
                const _initialScrollTop = _testElement1.scrollTop;

                //Since win is an iFrame window, the _pageScroller of uss
                //(default value of API functions) is not the same as the one of win.
                const _pageScrollerOfWin = uss.getPageScroller(win); 

                cy.testFailingValues(uss.scrollIntoViewIfNeeded, {
                    0: [
                        constants.failingValuesAllNoUndefined,
                        [true, false],
                        [undefined],
                        [true, false],
                    ]
                },
                    (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                        expect(_testElement1.scrollLeft).to.equal(_initialScrollLeft);
                        expect(_testElement1.scrollTop).to.equal(_initialScrollTop);
                    })
                    .then(() => {
                        cy.waitForUssCallback(
                            (resolve) => {
                                //Set up the scroll position to force the "nearest" alignment to be left-top.
                                const _container = _testElement111.parentElement;
                                const _parent = _container.parentElement;
                                uss.scrollTo(uss.getMaxScrollX(_pageScrollerOfWin), uss.getMaxScrollY(_pageScrollerOfWin), _pageScrollerOfWin);
                                uss.scrollTo(uss.getMaxScrollX(_parent), uss.getMaxScrollY(_parent), _parent);
                                uss.scrollTo(uss.getMaxScrollX(_container), uss.getMaxScrollY(_container), _container);

                                _scrollIntoViewTester(
                                    resolve,
                                    [
                                        {
                                            el: _testElement111,
                                            alignCenter: false, //left-top
                                            includeHiddenParents: false,
                                            tests: [
                                                (el) => { //Tests the element position
                                                    const _container = el.parentElement;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(leftDelta).to.be.closeTo(0, 1);
                                                    expect(topDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => { //Tests the container position (element's parentElement)
                                                    el = el.parentElement;

                                                    const _container = el.parentElement;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(leftDelta).to.be.closeTo(0, 1);
                                                    expect(topDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => { //Tests the parent position (container's parentElement)
                                                    el = el.parentElement.parentElement;

                                                    const _container = win;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(leftDelta).to.be.closeTo(0, 1);
                                                    expect(topDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => {
                                                    //Set up the scroll position to force the "nearest" alignment to be right-top.
                                                    const _nextEl = _testElement112;
                                                    const _container = _nextEl.parentElement;
                                                    const _parent = _container.parentElement;
                                                    uss.scrollTo(0, uss.getMaxScrollY(_pageScrollerOfWin), _pageScrollerOfWin);
                                                    uss.scrollTo(0, uss.getMaxScrollY(_parent), _parent);
                                                    uss.scrollTo(0, uss.getMaxScrollY(_container), _container);
                                                }
                                            ]
                                        },
                                        {
                                            el: _testElement112,
                                            alignCenter: false, //right-top
                                            includeHiddenParents: false,
                                            tests: [
                                                (el) => { //Tests the element position
                                                    const _container = el.parentElement;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(rightDelta).to.be.closeTo(0, 1);
                                                    expect(topDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => { //Tests the container position (element's parentElement)
                                                    el = el.parentElement;

                                                    const _container = el.parentElement;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(rightDelta).to.be.closeTo(0, 1);
                                                    expect(topDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => { //Tests the parent position (container's parentElement)
                                                    el = el.parentElement.parentElement;

                                                    const _container = win;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(rightDelta).to.be.closeTo(0, 1);
                                                    expect(topDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => {
                                                    //Set up the scroll position to force the "nearest" alignment to be left-bottom.
                                                    const _nextEl = _testElement121;
                                                    const _container = _nextEl.parentElement;
                                                    const _parent = _container.parentElement;
                                                    uss.scrollTo(uss.getMaxScrollX(_pageScrollerOfWin), 0, _pageScrollerOfWin);
                                                    uss.scrollTo(uss.getMaxScrollX(_parent), 0, _parent);
                                                    uss.scrollTo(uss.getMaxScrollX(_container), 0, _container);
                                                }
                                            ]
                                        },
                                        {
                                            el: _testElement121,
                                            alignCenter: false, //left-bottom
                                            includeHiddenParents: false,
                                            tests: [
                                                (el) => { //Tests the element position
                                                    const _container = el.parentElement;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(leftDelta).to.be.closeTo(0, 1);
                                                    expect(bottomDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => { //Tests the container position (element's parentElement)
                                                    el = el.parentElement;

                                                    const _container = el.parentElement;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(leftDelta).to.be.closeTo(0, 1);
                                                    expect(bottomDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => { //Tests the parent position (container's parentElement)
                                                    el = el.parentElement.parentElement;

                                                    const _container = win;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(leftDelta).to.be.closeTo(0, 1);
                                                    expect(bottomDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => {
                                                    //Set up the scroll position to force the "nearest" alignment to be right-bottom.
                                                    const _nextEl = _testElement122;
                                                    const _container = _nextEl.parentElement;
                                                    const _parent = _container.parentElement;
                                                    uss.scrollTo(0, 0, _pageScrollerOfWin);
                                                    uss.scrollTo(0, 0, _parent);
                                                    uss.scrollTo(0, 0, _container);
                                                }
                                            ]
                                        },
                                        {
                                            el: _testElement122,
                                            alignCenter: false, //right-bottom
                                            includeHiddenParents: false,
                                            tests: [
                                                (el) => { //Tests the element position
                                                    const _container = el.parentElement;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(rightDelta).to.be.closeTo(0, 1);
                                                    expect(bottomDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => { //Tests the container position (element's parentElement)
                                                    el = el.parentElement;

                                                    const _container = el.parentElement;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(rightDelta).to.be.closeTo(0, 1);
                                                    expect(bottomDelta).to.be.closeTo(0, 1);
                                                },
                                                (el) => { //Tests the parent position (container's parentElement)
                                                    el = el.parentElement.parentElement;

                                                    const _container = win;
                                                    const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                                    expect(rightDelta).to.be.closeTo(0, 1);
                                                    expect(bottomDelta).to.be.closeTo(0, 1);
                                                }
                                            ]
                                        }
                                    ]
                                );
                            }
                        ).then(
                            () => { }
                        );
                    });
            });
    });
});

describe("scrollIntoViewIfNeeded-center-alignments", function () {
    it("Tests the scrollIntoViewIfNeeded method with all the corners/nearest alignments and alignToCenter = true", function () {
        cy.window()
            .then((win) => {
                const _testElement1 = win.document.getElementById("scroller-container-1");

                const _testElement111 = win.document.getElementById("scroller-content-111");
                const _testElement112 = win.document.getElementById("scroller-content-112");
                const _testElement121 = win.document.getElementById("scroller-content-121");
                const _testElement122 = win.document.getElementById("scroller-content-122");

                const _initialScrollLeft = _testElement1.scrollLeft;
                const _initialScrollTop = _testElement1.scrollTop;

                //Since win is an iFrame window, the _pageScroller of uss
                //(default value of API functions) is not the same as the one of win.
                const _pageScrollerOfWin = uss.getPageScroller(win);

                cy.waitForUssCallback(
                    (resolve) => {
                        //Set up the scroll position to force the "nearest" alignment to be left-top.
                        const _container = _testElement111.parentElement;
                        const _parent = _container.parentElement;
                        uss.scrollTo(uss.getMaxScrollX(_pageScrollerOfWin), uss.getMaxScrollY(_pageScrollerOfWin), _pageScrollerOfWin);
                        uss.scrollTo(uss.getMaxScrollX(_parent), uss.getMaxScrollY(_parent), _parent);
                        uss.scrollTo(uss.getMaxScrollX(_container), uss.getMaxScrollY(_container), _container);

                        _scrollIntoViewTester(
                            resolve,
                            [
                                {
                                    el: _testElement111,
                                    alignCenter: true, //left-top + centered element
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                            expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => {
                                            //Set up the scroll position to force the "nearest" alignment to be right-top.
                                            const _nextEl = _testElement112;
                                            const _container = _nextEl.parentElement;
                                            const _parent = _container.parentElement;
                                            uss.scrollTo(0, uss.getMaxScrollY(_pageScrollerOfWin), _pageScrollerOfWin);
                                            uss.scrollTo(0, uss.getMaxScrollY(_parent), _parent);
                                            uss.scrollTo(0, uss.getMaxScrollY(_container), _container);
                                        }
                                    ]
                                },
                                {
                                    el: _testElement112,
                                    alignCenter: true, //right-top + centered element
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                            expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => {
                                            //Set up the scroll position to force the "nearest" alignment to be left-bottom.
                                            const _nextEl = _testElement121;
                                            const _container = _nextEl.parentElement;
                                            const _parent = _container.parentElement;
                                            uss.scrollTo(uss.getMaxScrollX(_pageScrollerOfWin), 0, _pageScrollerOfWin);
                                            uss.scrollTo(uss.getMaxScrollX(_parent), 0, _parent);
                                            uss.scrollTo(uss.getMaxScrollX(_container), 0, _container);
                                        }
                                    ]
                                },
                                {
                                    el: _testElement121,
                                    alignCenter: true, //left-bottom + centered element
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                            expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => {
                                            //Set up the scroll position to force the "nearest" alignment to be right-bottom.
                                            const _nextEl = _testElement122;
                                            const _container = _nextEl.parentElement;
                                            const _parent = _container.parentElement;
                                            uss.scrollTo(0, 0, _pageScrollerOfWin);
                                            uss.scrollTo(0, 0, _parent);
                                            uss.scrollTo(0, 0, _container);
                                        }
                                    ]
                                },
                                {
                                    el: _testElement122,
                                    alignCenter: true, //right-bottom + centered element
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                            expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        }
                                    ]
                                }
                            ]
                        );
                    }
                ).then(
                    () => { }
                );
            });
    });
});

describe("scrollIntoViewIfNeeded-corners-nearest-alignments-oversized-width", function () {
    it("Tests the scrollIntoViewIfNeeded method with all the corners/nearest alignments but with an element's width that is bigger than the one of its parent", function () {
        cy.window()
            .then((win) => {
                const _testElement3 = win.document.getElementById("scroller-container-3");
                const _testElement131 = win.document.getElementById("scroller-content-131");

                const _initialScrollLeft = _testElement3.scrollLeft;
                const _initialScrollTop = _testElement3.scrollTop;

                //Since win is an iFrame window, the _pageScroller of uss
                //(default value of API functions) is not the same as the one of win.
                const _pageScrollerOfWin = uss.getPageScroller(win);

                cy.waitForUssCallback(
                    (resolve) => {
                        //Set up the scroll position to force the "nearest" alignment to be left-top.
                        const _container = _testElement131.parentElement;
                        const _parent = _container.parentElement;
                        uss.scrollTo(uss.getMaxScrollX(_pageScrollerOfWin), uss.getMaxScrollY(_pageScrollerOfWin), _pageScrollerOfWin);
                        uss.scrollTo(uss.getMaxScrollX(_parent), uss.getMaxScrollY(_parent), _parent);
                        uss.scrollTo(uss.getMaxScrollX(_container), uss.getMaxScrollY(_container), _container);

                        _scrollIntoViewTester(
                            resolve,
                            [
                                {
                                    el: _testElement131,
                                    alignCenter: false, //left-top + oversized width
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(topDelta).to.be.closeTo(0, 1);
                                            expect(_container.scrollLeft).to.equal(uss.getMaxScrollX(_container)); //Didn't move since the last forced position
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => {
                                            //Set up the scroll position to force the "nearest" alignment to be right-top.
                                            const _nextEl = _testElement131;
                                            const _container = _nextEl.parentElement;
                                            const _parent = _container.parentElement;
                                            uss.scrollTo(0, uss.getMaxScrollY(_pageScrollerOfWin), _pageScrollerOfWin);
                                            uss.scrollTo(0, uss.getMaxScrollY(_parent), _parent);
                                            uss.scrollTo(0, uss.getMaxScrollY(_container), _container);
                                        }
                                    ]
                                },
                                {
                                    el: _testElement131,
                                    alignCenter: false, //right-top + oversized width
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(topDelta).to.be.closeTo(0, 1);
                                            expect(_container.scrollLeft).to.equal(0); //Didn't move since the last forced position
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => {
                                            //Set up the scroll position to force the "nearest" alignment to be left-bottom.
                                            const _nextEl = _testElement131;
                                            const _container = _nextEl.parentElement;
                                            const _parent = _container.parentElement;
                                            uss.scrollTo(uss.getMaxScrollX(_pageScrollerOfWin), 0, _pageScrollerOfWin);
                                            uss.scrollTo(uss.getMaxScrollX(_parent), 0, _parent);
                                            uss.scrollTo(uss.getMaxScrollX(_container), 0, _container);
                                        }
                                    ]
                                },
                                {
                                    el: _testElement131,
                                    alignCenter: false, //left-bottom + oversized width
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                            expect(_container.scrollLeft).to.equal(uss.getMaxScrollX(_container)); //Didn't move since the last forced position
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => {
                                            //Set up the scroll position to force the "nearest" alignment to be right-bottom.
                                            const _nextEl = _testElement131;
                                            const _container = _nextEl.parentElement;
                                            const _parent = _container.parentElement;
                                            uss.scrollTo(0, 0, _pageScrollerOfWin);
                                            uss.scrollTo(0, 0, _parent);
                                            uss.scrollTo(0, 0, _container);
                                        }
                                    ]
                                },
                                {
                                    el: _testElement131,
                                    alignCenter: false, //right-bottom + oversized width
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                            expect(_container.scrollLeft).to.equal(0); //Didn't move since the last forced position
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        }
                                    ]
                                }
                            ]
                        );
                    }
                ).then(
                    () => { }
                );
            });
    });
});

describe("scrollIntoViewIfNeeded-corners-nearest-alignments-oversized-height", function () {
    it("Tests the scrollIntoViewIfNeeded method with all the corners/nearest alignments but with an element's height that is bigger than the one of its parent", function () {
        cy.window()
            .then((win) => {
                const _testElement4 = win.document.getElementById("scroller-container-4");
                const _testElement141 = win.document.getElementById("scroller-content-141");

                const _initialScrollLeft = _testElement4.scrollLeft;
                const _initialScrollTop = _testElement4.scrollTop;

                //Since win is an iFrame window, the _pageScroller of uss
                //(default value of API functions) is not the same as the one of win.
                const _pageScrollerOfWin = uss.getPageScroller(win);

                cy.waitForUssCallback(
                    (resolve) => {
                        //Set up the scroll position to force the "nearest" alignment to be left-top.
                        const _container = _testElement141.parentElement;
                        const _parent = _container.parentElement;
                        uss.scrollTo(uss.getMaxScrollX(_pageScrollerOfWin), uss.getMaxScrollY(_pageScrollerOfWin), _pageScrollerOfWin);
                        uss.scrollTo(uss.getMaxScrollX(_parent), uss.getMaxScrollY(_parent), _parent);
                        uss.scrollTo(uss.getMaxScrollX(_container), uss.getMaxScrollY(_container), _container);

                        _scrollIntoViewTester(
                            resolve,
                            [
                                {
                                    el: _testElement141,
                                    alignCenter: false, //left-top + oversized height
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(_container.scrollTop).to.equal(uss.getMaxScrollY(_container)); //Didn't move since the last forced position
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => {
                                            //Set up the scroll position to force the "nearest" alignment to be right-top.
                                            const _nextEl = _testElement141;
                                            const _container = _nextEl.parentElement;
                                            const _parent = _container.parentElement;
                                            uss.scrollTo(0, uss.getMaxScrollY(_pageScrollerOfWin), _pageScrollerOfWin);
                                            uss.scrollTo(0, uss.getMaxScrollY(_parent), _parent);
                                            uss.scrollTo(0, uss.getMaxScrollY(_container), _container);
                                        }
                                    ]
                                },
                                {
                                    el: _testElement141,
                                    alignCenter: false, //right-top + oversized height
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(_container.scrollTop).to.equal(uss.getMaxScrollY(_container)); //Didn't move since the last forced position
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(topDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => {
                                            //Set up the scroll position to force the "nearest" alignment to be left-bottom.
                                            const _nextEl = _testElement141;
                                            const _container = _nextEl.parentElement;
                                            const _parent = _container.parentElement;
                                            uss.scrollTo(uss.getMaxScrollX(_pageScrollerOfWin), 0, _pageScrollerOfWin);
                                            uss.scrollTo(uss.getMaxScrollX(_parent), 0, _parent);
                                            uss.scrollTo(uss.getMaxScrollX(_container), 0, _container);
                                        }
                                    ]
                                },
                                {
                                    el: _testElement141,
                                    alignCenter: false, //left-bottom + oversized height
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(_container.scrollTop).to.equal(0); //Didn't move since the last forced position
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(leftDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => {
                                            //Set up the scroll position to force the "nearest" alignment to be right-bottom.
                                            const _nextEl = _testElement141;
                                            const _container = _nextEl.parentElement;
                                            const _parent = _container.parentElement;
                                            uss.scrollTo(0, 0, _pageScrollerOfWin);
                                            uss.scrollTo(0, 0, _parent);
                                            uss.scrollTo(0, 0, _container);
                                        }
                                    ]
                                },
                                {
                                    el: _testElement141,
                                    alignCenter: false, //right-bottom + oversized height
                                    includeHiddenParents: false,
                                    tests: [
                                        (el) => { //Tests the element position
                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(_container.scrollTop).to.equal(0); //Didn't move since the last forced position
                                        },
                                        (el) => { //Tests the container position (element's parentElement)
                                            el = el.parentElement;

                                            const _container = el.parentElement;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        },
                                        (el) => { //Tests the parent position (container's parentElement)
                                            el = el.parentElement.parentElement;

                                            const _container = win;
                                            const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(el, _container);

                                            expect(rightDelta).to.be.closeTo(0, 1);
                                            expect(bottomDelta).to.be.closeTo(0, 1);
                                        }
                                    ]
                                }
                            ]
                        );
                    }
                ).then(
                    () => { }
                );
            });
    });
});