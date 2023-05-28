const { constants } = require("../support/constants");

/**
 * Returns the relative position of the element wrt the parent.
 * The position is expressed as an object containing the absolute values of distances
 * between the sides of the element and the ones of the parent.
 */
function getDeltas(uss, win, element, parent) {
    const _bordersDimensions = uss.calcBordersDimensions(parent);
    const _scrollbarsDimensions = uss.calcScrollbarsDimensions(parent);
    
    const _elPos = element.getBoundingClientRect();
    const _containerPos = parent !== win ? parent.getBoundingClientRect() :
                          { top: 0, right: uss.getWindowWidth(), bottom: uss.getWindowHeight(), left: 0 };
      
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
 *         ...
 *         (el) => {
 *             callback();
 *         }
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
 *          ...
 *         (el) => {
 *             callback();
 *         }
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement; 
                                                
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement; 
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement; 
                                                
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement; 
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;

                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement; 

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement; 
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                        ]
                                    },
                                    {
                                        el: _testElement121,
                                        alignLeft: null, //center
                                        alignTop: true,  //top
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;
                                                
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
                                        ]
                                    },
                                    {
                                        el: _testElement122,
                                        alignLeft: null, //center
                                        alignTop: false, //bottom
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement; 
                                                
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement; 
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;

                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be center-top.
                                                const _nextEl = _testElement121;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX() / 2,        uss.getMaxScrollY());
                                                uss.scrollTo(uss.getMaxScrollX(_parent) / 2, 0, _parent);
                                                uss.scrollTo(_container.scrollWidth / 8,     0, _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement121,
                                        alignLeft: "nearest", //center
                                        alignTop: "nearest",  //top
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;
                                                
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be right-top.
                                                const _nextEl = _testElement112;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX(),        uss.getMaxScrollY());
                                                uss.scrollTo(uss.getMaxScrollX(_parent), 0, _parent);
                                                uss.scrollTo(_container.scrollWidth,     0, _container);
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be left-center.
                                                const _nextEl = _testElement111;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(0, uss.getMaxScrollY() / 2);
                                                uss.scrollTo(0, _parent.scrollHeight / 8, _parent);
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;

                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be center-center.
                                                const _nextEl = _testElement111;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX() / 2,        uss.getMaxScrollY() / 2);
                                                uss.scrollTo(uss.getMaxScrollX(_parent) / 2, _parent.scrollHeight / 8, _parent);
                                                uss.scrollTo(_container.scrollWidth / 8,     uss.getMaxScrollY(_container) / 2, _container);
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement;

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement;

                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                            (el) => {                                                
                                                //Set up the scroll position to force the "nearest" alignment to be right-center.
                                                const _nextEl = _testElement112;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX(),        uss.getMaxScrollY() / 2);
                                                uss.scrollTo(uss.getMaxScrollX(_parent), _parent.scrollHeight / 8, _parent);
                                                uss.scrollTo(_container.scrollWidth,     uss.getMaxScrollY(_container) / 2, _container);
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement; 

                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement; 
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(topDelta).to.be.closeTo(bottomDelta, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be left-bottom.
                                                const _nextEl = _testElement121;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(0, 0);
                                                uss.scrollTo(0, _parent.scrollHeight, _parent);
                                                uss.scrollTo(0, uss.getMaxScrollY(_container), _container);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement121,
                                        alignLeft: "nearest", //left
                                        alignTop: "nearest",  //bottom
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement; 
                                                
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement; 
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be center-bottom.
                                                const _nextEl = _testElement122;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX() / 2,        0);
                                                uss.scrollTo(uss.getMaxScrollX(_parent) / 2, _parent.scrollHeight, _parent);
                                                uss.scrollTo(_container.scrollWidth * 5 / 8, uss.getMaxScrollY(_container), _container);
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement; 
                                                
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement; 
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(leftDelta).to.be.closeTo(rightDelta, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => {
                                                //Set up the scroll position to force the "nearest" alignment to be center-bottom.
                                                const _nextEl = _testElement122;
                                                const _container = _nextEl.parentElement;
                                                const _parent = _container.parentElement;
                                                uss.scrollTo(uss.getMaxScrollX(),    0);
                                                uss.scrollTo(_parent.scrollWidth,    _parent.scrollHeight, _parent);
                                                uss.scrollTo(_container.scrollWidth, uss.getMaxScrollY(_container), _container);
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
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                el = el.parentElement; 
                                                
                                                const _container = el.parentElement;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                el = el.parentElement.parentElement; 
                                                
                                                const _container = win;
                                                const { topDelta, rightDelta, bottomDelta, leftDelta } = getDeltas(uss, win, el, _container);

                                                expect(rightDelta).to.be.closeTo(0, 1);
                                                expect(bottomDelta).to.be.closeTo(0, 1);
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