const { constants } = require("../support/constants");

/*
 * sizeNum = 0 -> returns the total top-borders' size
 * sizeNum = 1 -> returns the total right-borders' size
 * sizeNum = 2 -> returns the total bottom-borders' size
 * sizeNum = 3 -> returns the total left-borders' size
 */
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

/*
 * sizeNum = 0 -> returns the total vertical scrollbar's size (the ones on the right of the passed elements) 
 * sizeNum = 1 -> returns the total vertical scrollbar's size (the ones on the bottom of the passed elements) 
 */
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
 *     alignLeft:true, 
 *     alignTop:false, 
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
 *     alignLeft:null, 
 *     alignTop:"nearest", 
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
    uss, 
    resolve,
    elements = [], 
    i = 0,
) {
    if(i >= elements.length) {
        resolve();
        return;
    }
    
    uss.scrollIntoView(
        elements[i].el, 
        elements[i].alignLeft, 
        elements[i].alignTop, 
        () => {
            //Test the correct alignment of the current element
            for(const test of elements[i].tests) {  
                test(elements[i].el);
            }

            i++;
            _scrollIntoViewTester(uss, resolve, elements, i);
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
    cy.visit("scrollIntoView-tests.html"); 
})

describe("scrollIntoView-corners-alignments", function() {
    let uss;
    it("Tests the scrollIntoView method with the 4 corners alignments", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._reducedMotion = true;

                const _testElement1 = win.document.getElementById("scroller-container-1");

                const _testElement111 = win.document.getElementById("scroller-content-111");
                const _testElement112 = win.document.getElementById("scroller-content-112");
                const _testElement121 = win.document.getElementById("scroller-content-121");
                const _testElement122 = win.document.getElementById("scroller-content-122");

                const _initialScrollLeft = _testElement1.scrollLeft; 
                const _initialScrollTop = _testElement1.scrollTop; 
 
                cy.testFailingValues(uss.scrollIntoView, {
                    0: [
                        constants.failingValuesAll,
                        [true, false],
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
                            _scrollIntoViewTester(
                                uss,
                                resolve,
                                [
                                    {
                                        el: _testElement111,
                                        alignLeft: true, //left
                                        alignTop: true,  //top
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
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement112,
                                        alignLeft: false, //right
                                        alignTop: true,   //top
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
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement121,
                                        alignLeft: true, //left
                                        alignTop: false, //bottom
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
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement122,
                                        alignLeft: false, //right
                                        alignTop: false,  //bottom
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


describe("scrollIntoView-center-alignments", function() {
    let uss;
    it("Tests the scrollIntoView method with the 5 center alignments", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._reducedMotion = true;

                const _testElement1 = win.document.getElementById("scroller-container-1");

                const _testElement111 = win.document.getElementById("scroller-content-111");
                const _testElement112 = win.document.getElementById("scroller-content-112");
                const _testElement121 = win.document.getElementById("scroller-content-121");
                const _testElement122 = win.document.getElementById("scroller-content-122");

                const _initialScrollLeft = _testElement1.scrollLeft; 
                const _initialScrollTop = _testElement1.scrollTop; 
 
                cy.testFailingValues(uss.scrollIntoView, {
                    0: [
                        constants.failingValuesAll,
                        [true, false],
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
                            _scrollIntoViewTester(
                                uss,
                                resolve,
                                [
                                    {
                                        el: _testElement111,
                                        alignLeft: true, //left
                                        alignTop: null,  //center
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.center = _elPos.top + _elPos.height * 0.5;
                                                
                                                expect(_elPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(_totalLeftBorder + _elPos.width, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);

                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.center = _containerPos.top + _containerPos.height * 0.5;

                                                expect(_containerPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(_totalLeftBorder + _containerPos.width, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;
                                                
                                                const _totalTopBorder = _getTotalBorderSize(uss, [win], 0);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [win], 2);
                                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);

                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.center = _parentPos.top + _parentPos.height * 0.5;

                                                expect(_parentPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(0 + _parentPos.width, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(0, 1);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement112,
                                        alignLeft: false, //right
                                        alignTop: null,   //center
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.center = _elPos.top + _elPos.height * 0.5;

                                                expect(_elPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _elPos.width, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);

                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.center = _containerPos.top + _containerPos.height * 0.5;

                                                expect(_containerPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _containerPos.width, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [win], 0);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [win], 2);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);
                                                                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.center = _parentPos.top + _parentPos.height * 0.5;
                                                
                                                expect(_parentPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize - _parentPos.width, 1);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement121,
                                        alignLeft: null, //center
                                        alignTop: true, //top
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.center = _elPos.left + _elPos.width * 0.5;

                                                expect(_elPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_elPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(_totalTopBorder + _elPos.height, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.center = _containerPos.left + _containerPos.width * 0.5;

                                                expect(_containerPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(_totalTopBorder + _containerPos.height, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [win], 1);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.center = _parentPos.left + _parentPos.width * 0.5;
                                                
                                                expect(_parentPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(_totalTopBorder + _parentPos.height, 1);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement122,
                                        alignLeft: null, //center
                                        alignTop: false,  //bottom
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.center = _elPos.left + _elPos.width * 0.5;

                                                expect(_elPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_elPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _elPos.height, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.center = _containerPos.left + _containerPos.width * 0.5;

                                                expect(_containerPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _containerPos.height, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [win], 3);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);

                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.center = _parentPos.left + _parentPos.width * 0.5;

                                                expect(_parentPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _parentPos.height, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement111,
                                        alignLeft: null, //center
                                        alignTop: null,  //center
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.centerY = _elPos.top + _elPos.height * 0.5;
                                                _elPos.centerX = _elPos.left + _elPos.width * 0.5;
                                                
                                                expect(_elPos.centerX).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(_elPos.centerY).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.centerY = _containerPos.top + _containerPos.height * 0.5;
                                                _containerPos.centerX = _containerPos.left + _containerPos.width * 0.5;
                                                
                                                expect(_containerPos.centerX).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(_containerPos.centerY).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);

                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.centerY = _parentPos.top + _parentPos.height * 0.5;
                                                _parentPos.centerX = _parentPos.left + _parentPos.width * 0.5;
                                                
                                                expect(_parentPos.centerX).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(_parentPos.centerY).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                            }
                                        ]
                                    },
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


describe("scrollIntoView-nearest-alignments", function() {
    let uss;
    it("Tests the scrollIntoView method with all the nearest alignments", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._reducedMotion = true;

                const _testElement1 = win.document.getElementById("scroller-container-1");

                const _testElement111 = win.document.getElementById("scroller-content-111");
                const _testElement112 = win.document.getElementById("scroller-content-112");
                const _testElement121 = win.document.getElementById("scroller-content-121");
                const _testElement122 = win.document.getElementById("scroller-content-122");

                const _initialScrollLeft = _testElement1.scrollLeft; 
                const _initialScrollTop = _testElement1.scrollTop; 
 
                cy.testFailingValues(uss.scrollIntoView, {
                    0: [
                        constants.failingValuesAll,
                        [true, false],
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
                            uss.scrollTo(0, uss.getMaxScrollY());

                            _scrollIntoViewTester(
                                uss,
                                resolve,
                                [
                                    {
                                        el: _testElement111,
                                        alignLeft: "nearest", //left
                                        alignTop: "nearest",  //top
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
                                                //Set up the scroll position to force the "nearest" alignment to be center-top.
                                                const _nextEl = _testElement121;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX() / 2, uss.getMaxScrollY());
                                                uss.scrollTo(uss.getMaxScrollX(_parent) / 2, 0, _parent);
                                                uss.scrollTo(uss.getMaxScrollX(_container) / 8, 0, _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement121,
                                        alignLeft: "nearest", //center
                                        alignTop: "nearest", //top
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.center = _elPos.left + _elPos.width * 0.5;

                                                expect(_elPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_elPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(_totalTopBorder + _elPos.height, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.center = _containerPos.left + _containerPos.width * 0.5;

                                                expect(_containerPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(_totalTopBorder + _containerPos.height, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [win], 1);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.center = _parentPos.left + _parentPos.width * 0.5;
                                                
                                                expect(_parentPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(_totalTopBorder, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(_totalTopBorder + _parentPos.height, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be right-top.
                                                const _nextEl = _testElement112;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX(), uss.getMaxScrollY());
                                                uss.scrollTo(uss.getMaxScrollX(_parent), 0, _parent);
                                                uss.scrollTo(uss.getMaxScrollX(_container), 0, _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement112,
                                        alignLeft: "nearest", //right
                                        alignTop: "nearest",  //top
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
                                                //Set up the scroll position to force the "nearest" alignment to be left-center.
                                                const _nextEl = _testElement111;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(0, uss.getMaxScrollY() / 2);
                                                uss.scrollTo(0, uss.getMaxScrollY(_parent) / 8, _parent);
                                                uss.scrollTo(0, uss.getMaxScrollY(_container) / 2, _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement111,
                                        alignLeft: "nearest", //left
                                        alignTop: "nearest",  //center
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.center = _elPos.top + _elPos.height * 0.5;
                                                
                                                expect(_elPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(_totalLeftBorder + _elPos.width, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);

                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.center = _containerPos.top + _containerPos.height * 0.5;

                                                expect(_containerPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(_totalLeftBorder + _containerPos.width, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(_totalLeftBorder, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;
                                                
                                                const _totalTopBorder = _getTotalBorderSize(uss, [win], 0);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [win], 2);
                                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);

                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.center = _parentPos.top + _parentPos.height * 0.5;

                                                expect(_parentPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(0 + _parentPos.width, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(0, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be center-center.
                                                const _nextEl = _testElement111;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX() / 2, uss.getMaxScrollY() / 2);
                                                uss.scrollTo(uss.getMaxScrollX(_parent) / 2, uss.getMaxScrollY(_parent) / 8, _parent);
                                                uss.scrollTo(uss.getMaxScrollX(_container) / 8, uss.getMaxScrollY(_container) / 2, _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement111,
                                        alignLeft: "nearest", //center
                                        alignTop: "nearest",  //center
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.centerY = _elPos.top + _elPos.height * 0.5;
                                                _elPos.centerX = _elPos.left + _elPos.width * 0.5;
                                                
                                                expect(_elPos.centerX).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(_elPos.centerY).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.centerY = _containerPos.top + _containerPos.height * 0.5;
                                                _containerPos.centerX = _containerPos.left + _containerPos.width * 0.5;
                                                
                                                expect(_containerPos.centerX).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(_containerPos.centerY).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [win], 3);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);

                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.centerY = _parentPos.top + _parentPos.height * 0.5;
                                                _parentPos.centerX = _parentPos.left + _parentPos.width * 0.5;
                                                
                                                expect(_parentPos.centerX).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(_parentPos.centerY).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be right-center.
                                                const _nextEl = _testElement112;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX(), uss.getMaxScrollY() / 2);
                                                uss.scrollTo(uss.getMaxScrollX(_parent), uss.getMaxScrollY(_parent) / 8, _parent);
                                                uss.scrollTo(uss.getMaxScrollX(_container), uss.getMaxScrollY(_container) / 2, _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement112,
                                        alignLeft: "nearest", //right
                                        alignTop: "nearest",  //center
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.center = _elPos.top + _elPos.height * 0.5;

                                                expect(_elPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_elPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_elPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _elPos.width, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);

                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.center = _containerPos.top + _containerPos.height * 0.5;

                                                expect(_containerPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_containerPos.right)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_containerPos.left)).to.be.closeTo(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _containerPos.width, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [win], 0);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [win], 2);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);
                                                                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.center = _parentPos.top + _parentPos.height * 0.5;
                                                
                                                expect(_parentPos.center).to.be.closeTo((win.innerHeight - _totalBottomBorder + _totalTopBorder - _totalBottomScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_parentPos.right)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize, 1);
                                                expect(Math.round(_parentPos.left)).to.be.closeTo(win.innerWidth - _totalRightScrollbarSize - _parentPos.width, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be left-bottom.
                                                const _nextEl = _testElement121;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(0, 0);
                                                uss.scrollTo(0, uss.getMaxScrollY(_parent), _parent);
                                                uss.scrollTo(0, uss.getMaxScrollY(_container), _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement121,
                                        alignLeft: "nearest", //left
                                        alignTop: "nearest", //bottom
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
                                                //Set up the scroll position to force the "nearest" alignment to be center-bottom.
                                                const _nextEl = _testElement122;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX() / 2, 0);
                                                uss.scrollTo(uss.getMaxScrollX(_parent) / 2, uss.getMaxScrollY(_parent), _parent);
                                                uss.scrollTo(uss.getMaxScrollX(_container) * 3 / 4, uss.getMaxScrollY(_container), _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement122,
                                        alignLeft: "nearest", //center
                                        alignTop: "nearest",  //bottom
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                _elPos.center = _elPos.left + _elPos.width * 0.5;

                                                expect(_elPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_elPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _elPos.height, 1);
                                                expect(Math.round(_elPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1);

                                                const _containerPos = _container.getBoundingClientRect();
                                                _containerPos.center = _containerPos.left + _containerPos.width * 0.5;

                                                expect(_containerPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_containerPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _containerPos.height, 1);
                                                expect(Math.round(_containerPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [win], 3);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);

                                                const _parentPos = _parent.getBoundingClientRect();
                                                _parentPos.center = _parentPos.left + _parentPos.width * 0.5;

                                                expect(_parentPos.center).to.be.closeTo((win.innerWidth - _totalRightBorder + _totalLeftBorder - _totalRightScrollbarSize) * 0.5, 2);
                                                expect(Math.round(_parentPos.top)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _parentPos.height, 1);
                                                expect(Math.round(_parentPos.bottom)).to.be.closeTo(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be center-bottom.
                                                const _nextEl = _testElement122;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX(), 0);
                                                uss.scrollTo(uss.getMaxScrollX(_parent), uss.getMaxScrollY(_parent), _parent);
                                                uss.scrollTo(uss.getMaxScrollX(_container), uss.getMaxScrollY(_container), _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement122,
                                        alignLeft: "nearest", //right
                                        alignTop: "nearest",  //bottom
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