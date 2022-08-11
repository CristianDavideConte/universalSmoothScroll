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
            const _scrollbars = uss.calcScrollbarsDimensions(curr, true);
            console.log("scrollbars dimensions", curr, _scrollbars)
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

    uss._containersData = new Map();
    
    uss.scrollIntoView(
        elements[i].el, 
        elements[i].alignLeft, 
        elements[i].alignTop, 
        () => {
            console.log(uss._containersData)
            console.log(uss.getAllScrollableParents(elements[i].el))
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
                uss.setDebugMode("disabled");               //DEBUG ONLY

                const _testElement111 = win.document.getElementById("scroller-content-111");
                const _testElement112 = win.document.getElementById("scroller-content-112");
                const _testElement121 = win.document.getElementById("scroller-content-121");
                const _testElement122 = win.document.getElementById("scroller-content-122");

                const _initialScrollLeft = _testElement111.scrollLeft; 
                const _initialScrollTop = _testElement111.scrollTop; 
 
                cy.testFailingValues(uss.scrollIntoView, {
                    0: [constants.failingValuesAll]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    //expect(res).to.throw(constants.defaultUssException);          //DEBUG ONLY
                    expect(_testElement111.scrollLeft).to.equal(_initialScrollLeft);
                    expect(_testElement111.scrollTop).to.equal(_initialScrollTop);
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


//TODO 
//scrollIntoView tests with the 4 center alignments
//scrollIntoView with nearest alignment

