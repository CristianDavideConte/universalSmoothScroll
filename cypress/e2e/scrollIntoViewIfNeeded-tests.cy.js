const { constants } = require("../support/constants");

function _getTotalBorderSize(uss, elements, sizeNum) {
    const _totalBorderSize = elements.reduce(
        (prev, curr) => {
            const _borders = uss.calcBordersDimensions(curr, true);
            prev[0] += _borders[0];
            prev[1] += _borders[1];
            prev[2] += _borders[2];
            prev[3] += _borders[3];
            return prev;
        }, [0,0,0,0]
    )
    return _totalBorderSize[sizeNum];
}

function _getTotalScrollbarsSize(uss, elements, sizeNum) {
    const _totalScrollbarsSize = elements.reduce(
        (prev, curr) => {
            //forceCalculation = false because of a chrome's bug that moves the container when overflows are hidden.
            const _scrollbars = uss.calcScrollbarsDimensions(curr, false); 
            prev[0] += _scrollbars[0];
            prev[1] += _scrollbars[1];
            return prev;
        }, [0,0]
    )    
    return _totalScrollbarsSize[sizeNum];
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
 function _scrollIntoViewIfNeededTester(
    uss, 
    resolve,
    elements = [], 
    i = 0,
) {
    if(i >= elements.length) {
        resolve();
        return;
    }
    
    uss.scrollIntoViewIfNeeded(
        elements[i].el, 
        elements[i].alignCenter, 
        () => {
            //Test the correct alignment of the current element
            for(const test of elements[i].tests) {  
                test(elements[i].el);
            }

            i++;
            _scrollIntoViewIfNeededTester(uss, resolve, elements, i);
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
})

describe("scrollIntoViewIfNeeded-corners-nearest-alignments", function() {
    let uss;
    it.only("Tests the scrollIntoViewIfNeeded method with all the corners/nearest alignments", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._reducedMotion = true;

                const _testElement111 = win.document.getElementById("scroller-content-111");
                const _testElement112 = win.document.getElementById("scroller-content-112");
                const _testElement121 = win.document.getElementById("scroller-content-121");
                const _testElement122 = win.document.getElementById("scroller-content-122");

                const _initialScrollLeft = _testElement111.scrollLeft; 
                const _initialScrollTop = _testElement111.scrollTop; 
 
                cy.testFailingValues(uss.scrollIntoViewIfNeeded, {
                    0: [
                        constants.failingValuesAll,
                        [true, false],
                        [undefined],
                        [true, false],
                       ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);          
                    expect(_testElement111.scrollLeft).to.equal(_initialScrollLeft);
                    expect(_testElement111.scrollTop).to.equal(_initialScrollTop);
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            //Set up the scroll position to force the "nearest" alignment to be left-top.
                            const _container = _testElement111.parentElement;
                            const _parent = _container.parentElement;
                            uss.scrollTo(uss.getMaxScrollX(), uss.getMaxScrollY());
                            uss.scrollTo(uss.getMaxScrollX(_parent), uss.getMaxScrollY(_parent), _parent);
                            uss.scrollTo(uss.getMaxScrollX(_container), uss.getMaxScrollY(_container), _container);

                            _scrollIntoViewIfNeededTester(
                                uss,
                                resolve,
                                [
                                    {
                                        el: _testElement111,
                                        alignCenter: false, //left-top
                                        includeHiddenParents: false, 
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(Math.round(_elPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(_totalLeftBorder + _elPos.width, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(_totalTopBorder + _elPos.height, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(_totalLeftBorder + _containerPos.width, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(_totalTopBorder + _containerPos.height, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(0, 1);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(0 + _parentPos.width, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(0 + _parentPos.height, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(0, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be right-top.
                                                const _nextEl = _testElement121;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(0, uss.getMaxScrollY());
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
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(Math.round(_elPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(_totalTopBorder + _elPos.height, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _elPos.width, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);

                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(_totalTopBorder + _containerPos.height, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _containerPos.width, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(0, 1);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(0 + _parentPos.height, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize - _parentPos.width, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be left-bottom.
                                                const _nextEl = _testElement121;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX(), 0);
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
                                                const _parent = _container.parentElement;

                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(Math.round(_elPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _elPos.height, 1);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(_totalLeftBorder + _elPos.width, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);
                                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1); 

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _containerPos.height, 1);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(_totalLeftBorder + _containerPos.width, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(win.innerHeight - _totalBottomScrollbarSize - _parentPos.height, 1);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(_parentPos.width, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(0, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be right-bottom.
                                                const _nextEl = _testElement122;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(0, 0);
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
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(Math.round(_elPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _elPos.height, 1);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _elPos.width, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0); 
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1); 

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _containerPos.height, 1);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _containerPos.width, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0); 
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(win.innerHeight - _totalBottomScrollbarSize - _parentPos.height, 1);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize - _parentPos.width, 1);
                                            }
                                        ]
                                    }
                                ]
                            );
                        }
                    ).then(
                        () => {}
                    );
                });
        });         
    });
})


/*
//TODO 
describe("scrollIntoViewIfNeeded-center-alignments", function() {
    let uss;
    it.only("Tests the scrollIntoViewIfNeeded method with all the corners/nearest alignments and alignToCenter = true", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._reducedMotion = true;

                const _testElement111 = win.document.getElementById("scroller-content-111");
                const _testElement112 = win.document.getElementById("scroller-content-112");
                const _testElement121 = win.document.getElementById("scroller-content-121");
                const _testElement122 = win.document.getElementById("scroller-content-122");

                const _initialScrollLeft = _testElement111.scrollLeft; 
                const _initialScrollTop = _testElement111.scrollTop; 
 
                cy.testFailingValues(uss.scrollIntoViewIfNeeded, {
                    0: [
                        constants.failingValuesAll,
                        [true, false],
                        [undefined],
                        [true, false],
                       ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);          
                    expect(_testElement111.scrollLeft).to.equal(_initialScrollLeft);
                    expect(_testElement111.scrollTop).to.equal(_initialScrollTop);
                })
                .then(() => {
                    cy.waitForUssCallback(
                        (resolve) => {
                            //Set up the scroll position to force the "nearest" alignment to be left-top.
                            const _container = _testElement111.parentElement;
                            const _parent = _container.parentElement;
                            uss.scrollTo(uss.getMaxScrollX(), uss.getMaxScrollY());
                            uss.scrollTo(uss.getMaxScrollX(_parent), uss.getMaxScrollY(_parent), _parent);
                            uss.scrollTo(uss.getMaxScrollX(_container), uss.getMaxScrollY(_container), _container);

                            _scrollIntoViewIfNeededTester(
                                uss,
                                resolve,
                                [
                                    {
                                        el: _testElement111,
                                        alignCenter: true, //left-top
                                        includeHiddenParents: false, 
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                
                                                const _elHeight = el.getBoundingClientRect().height;
                                                const _elWidth = el.getBoundingClientRect().width;

                                                const _elPosX = uss.getScrollXCalculator(_container)();
                                                const _elPosY = uss.getScrollYCalculator(_container)();

                                                const _elStyle = window.getComputedStyle(el);
                                                const _marginTop = Number.parseFloat(_elStyle.marginTop);
                                                const _marginLeft = Number.parseFloat(_elStyle.marginLeft);

                                                const _containerPos = _container.getBoundingClientRect();
                                                const _containerHeight = _containerPos.height;
                                                const _containerWidth = _containerPos.width;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_container], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_container], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_container], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_container], 3);

                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_container], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_container], 1);

                                                expect(_elPosX).to.be.closeTo(_marginLeft, 2);
                                                expect(_elPosY).to.be.closeTo(_marginTop - (_totalTopBorder + _totalBottomScrollbarSize) * 0.5, 2);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(_totalLeftBorder + _containerPos.width, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(_totalTopBorder + _containerPos.height, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(0, 1);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(0 + _parentPos.width, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(0 + _parentPos.height, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(0, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be right-top.
                                                const _nextEl = _testElement121;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(0, uss.getMaxScrollY());
                                                uss.scrollTo(0, uss.getMaxScrollY(_parent), _parent);
                                                uss.scrollTo(0, uss.getMaxScrollY(_container), _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement112,
                                        alignCenter: true, //right-top
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(Math.round(_elPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(_totalTopBorder + _elPos.height, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _elPos.width, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);

                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(_totalTopBorder + _containerPos.height, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _containerPos.width, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(0, 1);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(0 + _parentPos.height, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize - _parentPos.width, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be left-bottom.
                                                const _nextEl = _testElement121;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX(), 0);
                                                uss.scrollTo(uss.getMaxScrollX(_parent), 0, _parent);
                                                uss.scrollTo(uss.getMaxScrollX(_container), 0, _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement121,
                                        alignCenter: true, //left-bottom
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(Math.round(_elPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _elPos.height, 1);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(_totalLeftBorder + _elPos.width, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);
                                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1); 

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _containerPos.height, 1);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(_totalLeftBorder + _containerPos.width, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(win.innerHeight - _totalBottomScrollbarSize - _parentPos.height, 1);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(_parentPos.width, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(0, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be right-bottom.
                                                const _nextEl = _testElement122;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(0, 0);
                                                uss.scrollTo(0, 0, _parent);
                                                uss.scrollTo(0, 0, _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement122,
                                        alignCenter: true, //right-bottom
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(Math.round(_elPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _elPos.height, 1);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _elPos.width, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0); 
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1); 

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _containerPos.height, 1);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _containerPos.width, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0); 
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(win.innerHeight - _totalBottomScrollbarSize - _parentPos.height, 1);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomScrollbarSize, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize - _parentPos.width, 1);
                                            }
                                        ]
                                    }
                                ]
                            );
                        }
                    ).then(
                        () => {}
                    );
                });
        });         
    });
})
*/