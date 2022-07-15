const { constants } = require("../support/constants");

function _getTotalBorderSize(uss, elements, sizeNum) {
    const _totalBorderSize = elements.reduce(
        (prev, curr) => {
            const _borders = uss.calcBordersDimensions(curr);
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
            const _borders = uss.calcScrollbarsDimensions(curr);
            prev[0] += _borders[0];
            prev[1] += _borders[1];
            return prev;
        }, [0,0]
    )
    return _totalScrollbarsSize[sizeNum];
}

/**
 * "elements" is an array of objs. 
 * "elements" structure example: 
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

describe("scrollIntoView", function() {
    let uss;
    it.only("Tests the scrollIntoView method with the 4 corners alignments", function() {
        cy.visit("scrollIntoView-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._reducedMotion = true;

                const _testElement1 = win.document.getElementById("scroller-content-111");
                const _testElement2 = win.document.getElementById("scroller-content-112");
                const _testElement3 = win.document.getElementById("scroller-content-121");
                const _testElement4 = win.document.getElementById("scroller-content-121");

                const _initialScrollLeft = _testElement1.scrollLeft; 
                const _initialScrollTop = _testElement1.scrollTop; 
 
                cy.testFailingValues(uss.scrollIntoView, {
                    0: [constants.failingValuesAll]
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
                                        el: _testElement1,
                                        alignLeft: true,
                                        alignTop: true,
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(_elPos.top).to.equal(_totalTopBorder);
                                                expect(_elPos.right).to.equal(_totalLeftBorder + _elPos.width);
                                                expect(_elPos.bottom).to.equal(_totalTopBorder + _elPos.height);
                                                expect(_elPos.left).to.equal(_totalLeftBorder);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(_containerPos.top).to.equal(_totalTopBorder);
                                                expect(_containerPos.right).to.equal(_totalLeftBorder + _containerPos.width);
                                                expect(_containerPos.bottom).to.equal(_totalTopBorder + _containerPos.height);
                                                expect(_containerPos.left).to.equal(_totalLeftBorder);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(_parentPos.top).to.equal(0);
                                                expect(_parentPos.right).to.equal(0 + _parentPos.width);
                                                expect(_parentPos.bottom).to.equal(0 + _parentPos.height);
                                                expect(_parentPos.left).to.equal(0);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement2,
                                        alignLeft: false,
                                        alignTop: true,
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 1);
                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 0);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(_elPos.top).to.equal(_totalTopBorder);
                                                expect(_elPos.right).to.equal(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize);
                                                expect(_elPos.bottom).to.equal(_totalTopBorder + _elPos.height);
                                                expect(_elPos.left).to.equal(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _elPos.width);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalTopBorder = _getTotalBorderSize(uss, [_parent, win], 0);
                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);

                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0);

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(_containerPos.top).to.equal(_totalTopBorder);
                                                expect(_containerPos.right).to.equal(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize);
                                                expect(_containerPos.bottom).to.equal(_totalTopBorder + _containerPos.height);
                                                expect(_containerPos.left).to.equal(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _containerPos.width);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(_parentPos.top).to.equal(0);
                                                expect(_parentPos.right).to.equal(win.innerWidth - _totalRightScrollbarSize);
                                                expect(_parentPos.bottom).to.equal(0 + _parentPos.height);
                                                expect(_parentPos.left).to.equal(win.innerWidth - _totalRightScrollbarSize - _parentPos.width);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement3,
                                        alignLeft: true,
                                        alignTop: false,
                                        includeHiddenParents: false,
                                        tests: [
                                            (el) => { //Tests the element position
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalBottomBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [el, _container, _parent, win], 3);
                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [el, _container, _parent, win], 1);

                                                const _elPos = el.getBoundingClientRect();
                                                expect(_elPos.top).to.equal(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _elPos.height);
                                                expect(_elPos.right).to.equal(_totalLeftBorder + _elPos.width);
                                                expect(_elPos.bottom).to.equal(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize);
                                                expect(_elPos.left).to.equal(_totalLeftBorder);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                const _totalLeftBorder = _getTotalBorderSize(uss, [_parent, win], 3);
                                                
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1); 

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(_containerPos.top).to.equal(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _containerPos.height);
                                                expect(_containerPos.right).to.equal(_totalLeftBorder + _containerPos.width);
                                                expect(_containerPos.bottom).to.equal(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize);
                                                expect(_containerPos.left).to.equal(_totalLeftBorder);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(_parentPos.top).to.equal(win.innerHeight - _totalBottomScrollbarSize - _parentPos.height);
                                                expect(_parentPos.right).to.equal(_parentPos.width);
                                                expect(_parentPos.bottom).to.equal(win.innerHeight - _totalBottomScrollbarSize);
                                                expect(_parentPos.left).to.equal(0);
                                            }
                                        ]
                                    },
                                    {
                                        el: _testElement4,
                                        alignLeft: false,
                                        alignTop: false,
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
                                                expect(_elPos.top).to.equal(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _elPos.height);
                                                expect(_elPos.right).to.equal(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize);
                                                expect(_elPos.bottom).to.equal(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize);
                                                expect(_elPos.left).to.equal(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _elPos.width);
                                            },
                                            (el) => { //Tests the container position (element's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;

                                                const _totalRightBorder = _getTotalBorderSize(uss, [_parent, win], 1);
                                                const _totalBottomBorder = _getTotalBorderSize(uss, [_parent, win], 2);
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 0); 
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [_parent, win], 1); 

                                                const _containerPos = _container.getBoundingClientRect();
                                                expect(_containerPos.top).to.equal(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize - _containerPos.height);
                                                expect(_containerPos.right).to.equal(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize);
                                                expect(_containerPos.bottom).to.equal(win.innerHeight - _totalBottomBorder - _totalBottomScrollbarSize);
                                                expect(_containerPos.left).to.equal(win.innerWidth - _totalRightBorder - _totalRightScrollbarSize - _containerPos.width);
                                            }, 
                                            (el) => { //Tests the parent position (container's parentElement)
                                                const _container = el.parentElement;
                                                const _parent = _container.parentElement;
                                                
                                                const _totalRightScrollbarSize = _getTotalScrollbarsSize(uss, [win], 0); 
                                                const _totalBottomScrollbarSize = _getTotalScrollbarsSize(uss, [win], 1);
                                                
                                                const _parentPos = _parent.getBoundingClientRect();
                                                expect(_parentPos.top).to.equal(win.innerHeight - _totalBottomScrollbarSize - _parentPos.height);
                                                expect(_parentPos.right).to.equal(win.innerWidth - _totalRightScrollbarSize);
                                                expect(_parentPos.bottom).to.equal(win.innerHeight - _totalBottomScrollbarSize);
                                                expect(_parentPos.left).to.equal(win.innerWidth - _totalRightScrollbarSize - _parentPos.width);
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


//TODO 
//scrollIntoView tests with the 4 center alignments
//scrollIntoView with nearest alignment

