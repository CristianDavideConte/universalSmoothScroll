/**
 * This file contains the tests for the following USS API functions:
 *  - calcXStepLength
 *  - calcYStepLength
 *  - calcScrollbarsDimensions
 *  - calcBordersDimensions
 */

describe("calcXStepLength", function() {
    var uss;
    it("Tests the calcXStepLength method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                cy.testFailingValues(uss.calcXStepLength, {
                    0: [Cypress.env("failingValuesNoPositiveNumberOrZero")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(Cypress.env("defaultUssException"));
                })
                .then(() => {
                    const _minAnimationFrame = uss.getMinAnimationFrame();
                    const _defaultStepLength = uss.getXStepLength();
                    let delta;
                    
                    for(delta = 0; delta < 2 * _minAnimationFrame * _defaultStepLength; delta++) {
                        const _calculatedStepLength = uss.calcXStepLength(delta);
                        if(delta / _minAnimationFrame < 1) expect(_calculatedStepLength).to.equal(1);
                        if(delta / _minAnimationFrame < _defaultStepLength) expect(_calculatedStepLength).to.be.lessThan(_defaultStepLength);
                        else expect(_calculatedStepLength).to.equal(_defaultStepLength);
                    }
                });
            });        
    });
})

describe("calcYStepLength", function() {
    var uss;
    it("Tests the calcYStepLength method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                cy.testFailingValues(uss.calcYStepLength, {
                    0: [Cypress.env("failingValuesNoPositiveNumberOrZero")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(Cypress.env("defaultUssException"));
                })
                .then(() => {
                    const _minAnimationFrame = uss.getMinAnimationFrame();
                    const _defaultStepLength = uss.getYStepLength();
                    let delta;
                    
                    for(delta = 0; delta < 2 * _minAnimationFrame * _defaultStepLength; delta++) {
                        const _calculatedStepLength = uss.calcYStepLength(delta);
                        if(delta / _minAnimationFrame < 1) expect(_calculatedStepLength).to.equal(1);
                        if(delta / _minAnimationFrame < _defaultStepLength) expect(_calculatedStepLength).to.be.lessThan(_defaultStepLength);
                        else expect(_calculatedStepLength).to.equal(_defaultStepLength);
                    }
                });
            });        
    });
})

describe("calcScrollbarsDimensions", function() {
    var uss;
    function arraysAreEqual(arr1, arr2) {
        if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        if(arr1.length !== arr2.length) return false;
        for(let i = 0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    it("Tests the calcScrollbarsDimensions method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                cy.testFailingValues(uss.calcScrollbarsDimensions, {
                    0: [Cypress.env("failingValuesAll")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(Cypress.env("defaultUssException"));
                })
                .then(() => {
                    const _maxDim = uss.getScrollbarsMaxDimension();
                    
                    const _noScrollbarElement = win.document.getElementById("stopScrollingX");
                    const _xAxisOnlyScrollbarElement = win.document.getElementById("yScrollerSection");
                    const _yAxisOnlyScrollbarElement = win.document.getElementById("xScrollerSection");
                    const _xyAxisScrollbarsElement = win.document.body;

                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_noScrollbarElement), [0,0])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_xAxisOnlyScrollbarElement), [_maxDim,0])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_yAxisOnlyScrollbarElement), [0,_maxDim])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_xyAxisScrollbarsElement), [_maxDim,_maxDim])).to.be.true;

                    uss.setPageScroller(win.document.scrollingElement || win.document.body);
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(uss.getPageScroller()), 
                                          uss.calcScrollbarsDimensions(win))
                    ).to.be.true;
                });
            });        
    });
})

describe("calcScrollbarsDimensions-webkit-scrollbar-modifiers", function() {
    var uss;
    
    //Source: https://stackoverflow.com/questions/7000190/detect-all-firefox-versions-in-js
    function browserIsFirefox(window) {
        return window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    function arraysAreEqual(arr1, arr2) {
        if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        if(arr1.length !== arr2.length) return false;
        for(let i = 0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    it("Tests the calcScrollbarsDimensions method with elements that have the ::webkit-scrollbar css modifier", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                //Firefox doens't support the ::webkit-scrollbar css modifier
                if(browserIsFirefox(win)) return;
                
                uss = win.uss;
                uss._containersData = new Map();
                
                cy.testFailingValues(uss.calcScrollbarsDimensions, {
                    0: [Cypress.env("failingValuesAll")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(Cypress.env("defaultUssException"));
                })
                .then(() => {
                    const _maxDim = uss.getScrollbarsMaxDimension();

                    const _xyScrollbarsElement = win.document.createElement("div");
                    _xyScrollbarsElement.id = "__scrollbarsTest";
                    _xyScrollbarsElement.style = "display:block; width:100px; height:100px; overflow:scroll;"
                    
                    const _hiddenScrollbarsStyleDisplayNone = win.document.createElement("style");
                    const _hiddenScrollbarsStyleWidth0 = win.document.createElement("style");
                    const _hiddenScrollbarsStyleHeight0 = win.document.createElement("style");
                    const _hiddenScrollbarsStyleWidth0Height0 = win.document.createElement("style");

                    _hiddenScrollbarsStyleDisplayNone.appendChild(
                        win.document.createTextNode(
                            "#__scrollbarsTest::-webkit-scrollbar { display:none; }"
                        )
                    );
                    _hiddenScrollbarsStyleWidth0.appendChild(
                        win.document.createTextNode(
                            "#__scrollbarsTest::-webkit-scrollbar { width:0; height:initial; }"
                        )
                    );
                    _hiddenScrollbarsStyleHeight0.appendChild(
                        win.document.createTextNode(
                            "#__scrollbarsTest::-webkit-scrollbar { width:initial; height:0; }"
                        )
                    );
                    _hiddenScrollbarsStyleWidth0Height0.appendChild(
                        win.document.createTextNode(
                            "#__scrollbarsTest::-webkit-scrollbar { width:0; height:0; }"
                        )
                    );

                    win.document.body.appendChild(_xyScrollbarsElement);

                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_xyScrollbarsElement), 
                                          [_maxDim,_maxDim])
                    ).to.be.true;

                    win.document.head.appendChild(_hiddenScrollbarsStyleDisplayNone);

                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_xyScrollbarsElement), 
                                          [0,0])
                    ).to.be.true;

                    win.document.head.removeChild(_hiddenScrollbarsStyleDisplayNone);
                    win.document.head.appendChild(_hiddenScrollbarsStyleWidth0);
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_xyScrollbarsElement), 
                                          [0,_maxDim])
                    ).to.be.true;
                    
                    win.document.head.removeChild(_hiddenScrollbarsStyleWidth0);
                    win.document.head.appendChild(_hiddenScrollbarsStyleHeight0);
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_xyScrollbarsElement), 
                                          [_maxDim,0])
                    ).to.be.true;
       
                    win.document.head.removeChild(_hiddenScrollbarsStyleHeight0);
                    win.document.head.appendChild(_hiddenScrollbarsStyleWidth0Height0);
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_xyScrollbarsElement), 
                                          [0,0])
                    ).to.be.true;
                });
            });        
    });
})

describe("calcBordersDimensions", function() {
    var uss;
    function arraysAreEqual(arr1, arr2) {
        if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        if(arr1.length !== arr2.length) return false;
        for(let i = 0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    it("Tests the calcBordersDimensions method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();
                
                cy.testFailingValues(uss.calcBordersDimensions, {
                    0: [Cypress.env("failingValuesAll")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(Cypress.env("defaultUssException"));
                })
                .then(() => {
                    const _maxDim = 10;
                    const _borderWidth = _maxDim.toString() + "px"; 

                    const _borderedElement = win.document.createElement("div");
                    _borderedElement.id = "__bordersTest";
                    _borderedElement.style = "display:block; width:100px; height:100px;"
                    
                    const _allSidesBorderStyle = win.document.createElement("style");
                    const _topBorderStyle = win.document.createElement("style");
                    const _rightBorderStyle = win.document.createElement("style");
                    const _bottomBorderStyle = win.document.createElement("style");
                    const _leftBorderStyle = win.document.createElement("style");
                    const _noBorderStyle = win.document.createElement("style");
                    const _hiddenBorderStyle = win.document.createElement("style");

                    _allSidesBorderStyle.appendChild(
                        win.document.createTextNode(
                            "#__bordersTest { " + 
                                "border-width:" + _borderWidth + ";" +
                                "border-top-style:dotted;" +  
                                "border-right-style:dashed;" + 
                                "border-bottom-style:solid;" + 
                                "border-left-style:double;" +
                            "}"
                        )
                    );
                    _topBorderStyle.appendChild(
                        win.document.createTextNode(
                            "#__bordersTest { " + 
                                "border-width:" + _borderWidth + ";" +
                                "border-top-style:groove;" +
                            "}"
                        )
                    );
                    _rightBorderStyle.appendChild(
                        win.document.createTextNode(
                            "#__bordersTest { " + 
                                "border-width:" + _borderWidth + ";" +
                                "border-right-style:ridge;" + 
                            "}"
                        )
                    );
                    _bottomBorderStyle.appendChild(
                        win.document.createTextNode(
                            "#__bordersTest { " + 
                                "border-width:" + _borderWidth + ";" +
                                "border-bottom-style:inset;" + 
                            "}"
                        )
                    );
                    _leftBorderStyle.appendChild(
                        win.document.createTextNode(
                            "#__bordersTest { " + 
                                "border-width: " + _borderWidth + ";" +
                                "border-left-style:outset;" + 
                            "}"
                        )
                    );
                    _noBorderStyle.appendChild(
                        win.document.createTextNode(
                            "#__bordersTest { " + 
                                "border-width: " + _borderWidth + ";" +
                                "border-style:none;" + 
                            "}"
                        )
                    );
                    _hiddenBorderStyle.appendChild(
                        win.document.createTextNode(
                            "#__bordersTest { " + 
                                "border-width: " + _borderWidth + ";" +
                                "border-style:hidden;" + 
                            "}"
                        )
                    );

                    win.document.body.appendChild(_borderedElement);

                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,0,0])
                    ).to.be.true;

                    win.document.head.appendChild(_allSidesBorderStyle);

                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [_maxDim,_maxDim,_maxDim,_maxDim])
                    ).to.be.true;

                    win.document.head.removeChild(_allSidesBorderStyle);
                    win.document.head.appendChild(_topBorderStyle);
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [_maxDim,0,0,0])
                    ).to.be.true;
                    
                    win.document.head.removeChild(_topBorderStyle);
                    win.document.head.appendChild(_rightBorderStyle);
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,_maxDim,0,0])
                    ).to.be.true;
       
                    win.document.head.removeChild(_rightBorderStyle);
                    win.document.head.appendChild(_bottomBorderStyle);
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,_maxDim,0])
                    ).to.be.true;

                    win.document.head.removeChild(_bottomBorderStyle);
                    win.document.head.appendChild(_leftBorderStyle);
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,0,_maxDim])
                    ).to.be.true;
                    
                    win.document.head.removeChild(_leftBorderStyle);
                    win.document.head.appendChild(_noBorderStyle);
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,0,0])
                    ).to.be.true;

                    win.document.head.removeChild(_noBorderStyle);
                    win.document.head.appendChild(_hiddenBorderStyle);
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,0,0])
                    ).to.be.true;
                });
            });        
    });
})