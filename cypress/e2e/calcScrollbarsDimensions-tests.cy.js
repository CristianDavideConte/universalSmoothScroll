const { constants } = require("../support/constants");

function arraysAreEqual(arr1, arr2) {
    if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if(arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false;
    }
    return true;
}

describe("calcScrollbarsDimensions", function() {
    let uss;
    it("Tests the calcScrollbarsDimensions method", function() {
        cy.visit("calcScrollbarsDimensions-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                
                cy.testFailingValues(uss.calcScrollbarsDimensions, {
                    0: [constants.failingValuesAll]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                })
                .then(() => {
                    const _maxDim = uss.getScrollbarsMaxDimension();
                    
                    const _noScrollbarElement = win.document.getElementById("no-scroller");
                    const _elementWidthScrollbarOnTheYAxis = win.document.getElementById("x-scroller");
                    const _elementWidthScrollbarOnTheXAxis = win.document.getElementById("y-scroller");
                    const _elementWidthScrollbarOnTheXYAxes = win.document.getElementById("xy-scroller");

                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_noScrollbarElement), [0,0])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWidthScrollbarOnTheXAxis), [_maxDim,0])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWidthScrollbarOnTheYAxis), [0,_maxDim])).to.be.true;
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWidthScrollbarOnTheXYAxes), [_maxDim,_maxDim])).to.be.true;

                    uss.setPageScroller(win.document.scrollingElement || win.document.body);
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(uss.getPageScroller()), 
                                          uss.calcScrollbarsDimensions(win))
                    ).to.be.true;
                });
            });        
    });
})

describe("calcScrollbarsDimensions-webkit-scrollbar-modifiers", function() {
    let uss;
    
    //Source: https://stackoverflow.com/questions/7000190/detect-all-firefox-versions-in-js
    function browserIsFirefox(window) {
        return window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    it("Tests the calcScrollbarsDimensions method with elements that have the ::webkit-scrollbar css modifier", function() {
        cy.visit("calcScrollbarsDimensions-tests.html"); 
        cy.window()
            .then((win) => {
                //Firefox doens't support the ::webkit-scrollbar css modifier
                if(browserIsFirefox(win)) return;
                
                uss = win.uss;
                
                cy.testFailingValues(uss.calcScrollbarsDimensions, {
                    0: [constants.failingValuesAll]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                })
                .then(() => {
                    const _maxDim = uss.getScrollbarsMaxDimension();

                    const _elementWidthScrollbarOnTheXYAxes = win.document.getElementById("xy-scroller");
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWidthScrollbarOnTheXYAxes), 
                                          [_maxDim,_maxDim])
                    ).to.be.true;

                    _elementWidthScrollbarOnTheXYAxes.classList.add("no-webkit-scrollbars");

                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWidthScrollbarOnTheXYAxes), 
                                          [0,0])
                    ).to.be.true;

                    _elementWidthScrollbarOnTheXYAxes.classList.remove("no-webkit-scrollbars");
                    _elementWidthScrollbarOnTheXYAxes.classList.add("width-0-scrollbars");
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWidthScrollbarOnTheXYAxes), 
                                          [0,_maxDim])
                    ).to.be.true;
                    
                    _elementWidthScrollbarOnTheXYAxes.classList.remove("width-0-scrollbars");
                    _elementWidthScrollbarOnTheXYAxes.classList.add("height-0-scrollbars");
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWidthScrollbarOnTheXYAxes), 
                                          [_maxDim,0])
                    ).to.be.true;
       
                    _elementWidthScrollbarOnTheXYAxes.classList.remove("height-0-scrollbars");
                    _elementWidthScrollbarOnTheXYAxes.classList.add("width-0-height-0-scrollbars");
                    
                    expect(arraysAreEqual(uss.calcScrollbarsDimensions(_elementWidthScrollbarOnTheXYAxes), 
                                          [0,0])
                    ).to.be.true;
                });
            });        
    });
})