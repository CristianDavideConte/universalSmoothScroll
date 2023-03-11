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
    cy.visit("calcBordersDimensions-tests.html"); 
})

describe("calcBordersDimensions", function() {
    let uss;
    it("Tests the calcBordersDimensions method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _maxDim = 10; //See css styles of calcBordersDimensions-tests.html
                
                uss._containersData = new Map();
                expect(uss._containersData.size).to.equal(0);

                //Test the window's borders. 
                const _windowBordersDimensions = uss.calcBordersDimensions(win, true);
                expect(arraysAreEqual(
                        _windowBordersDimensions,
                        uss.calcBordersDimensions(uss.getWindowScroller(true))
                        )
                ).to.be.true;

                const _windowBordersCachedDimensions = uss._containersData.get(win).slice(20, 24);
                expect(arraysAreEqual(
                        _windowBordersDimensions,
                        _windowBordersCachedDimensions
                        )
                ).to.be.true;

                /* 
                //TODO: add this case to the failingvaluesAll + variants
                //this should fail
                const _unsupportedTestElement = () => {};
                Object.setPrototypeOf(_unsupportedTestElement, Element.prototype);
                
                expect(arraysAreEqual(uss.calcBordersDimensions(_unsupportedTestElement), 
                                      [0,0,0,0])
                ).to.be.true;
                */

                const _head = win.document.head;
                
                expect(arraysAreEqual(uss.calcBordersDimensions(_head), [0,0,0,0])).to.be.true;
                Array.from(_head.children).forEach(el => expect(arraysAreEqual(uss.calcBordersDimensions(el), [0,0,0,0])).to.be.true);
                
                cy.testFailingValues(uss.calcBordersDimensions, {
                    0: [constants.failingValuesAllNoUndefined,
                        [true, false],
                       ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                })
                .then(() => {
                    const _borderedElement = win.document.getElementById("bordered");   

                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,0,0])
                    ).to.be.true;

                    _borderedElement.classList.add("all-border");

                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false), 
                                          [0,0,0,0])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true), 
                                          [_maxDim,_maxDim,_maxDim,_maxDim])
                    ).to.be.true;

                    _borderedElement.classList.remove("all-border");
                    _borderedElement.classList.add("top-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false), 
                                          [_maxDim,_maxDim,_maxDim,_maxDim])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true), 
                                          [_maxDim,0,0,0])
                    ).to.be.true;
                    
                    _borderedElement.classList.remove("top-border");
                    _borderedElement.classList.add("right-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false), 
                                          [_maxDim,0,0,0])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true), 
                                          [0,_maxDim,0,0])
                    ).to.be.true;
       
                    _borderedElement.classList.remove("right-border");
                    _borderedElement.classList.add("bottom-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false), 
                                          [0,_maxDim,0,0])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true), 
                                          [0,0,_maxDim,0])
                    ).to.be.true;

                    _borderedElement.classList.remove("bottom-border");
                    _borderedElement.classList.add("left-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false), 
                                          [0,0,_maxDim,0])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true), 
                                          [0,0,0,_maxDim])
                    ).to.be.true;
                    
                    _borderedElement.classList.remove("left-border");
                    _borderedElement.classList.add("no-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false), 
                                          [0,0,0,_maxDim])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true), 
                                          [0,0,0,0])
                    ).to.be.true;

                    _borderedElement.classList.remove("no-border");
                    _borderedElement.classList.add("hidden-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false), 
                                          [0,0,0,0])
                    ).to.be.true;
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true), 
                                          [0,0,0,0])
                    ).to.be.true;

                    //Test if the methods used for stopping one or more scroll-animation/s erase the cached values (they should not).
                    const _dims = uss.calcBordersDimensions(_borderedElement, true);
                    uss.stopScrollingX(_borderedElement);
                    uss.stopScrollingY(_borderedElement);
                    uss.stopScrolling(_borderedElement);
                    uss.stopScrollingAll();
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), _dims)).to.be.true;                
                });
            });        
    });
})