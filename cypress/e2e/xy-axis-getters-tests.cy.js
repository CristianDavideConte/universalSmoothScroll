/**
 * This file contains the tests for the following USS API functions:
 *  - getScrollableParent
 *  - getAllScrollableParents
 */

describe("getScrollableParent", function() {
    var uss;
    it("Tests the getScrollableParent method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();  
                            
                cy.testFailingValues(uss.getScrollableParent, {
                0: [Cypress.env("failingValuesAll"), 
                    [true, false]
                   ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(res).to.equal(null);
                })
                .then(() => {
                //test window, html and body
                expect(uss.getScrollableParent(win)).to.be.null;  
                expect(uss.getScrollableParent(win.document.documentElement)).to.be.null;   
                expect(uss.getScrollableParent(uss.getPageScroller())).to.be.null;
                
                //test element with position:fixed
                expect(uss.getScrollableParent(win.stopScrollingX)).to.be.null;
                
                //test elements with no constraint 
                expect(uss.getScrollableParent(win.document.getElementById("linear"))).to.equal(win.document.getElementById("easeFunctionSelectorList"));
                expect(uss.getScrollableParent(win.document.getElementById("easeFunctionSelectorList"))).to.equal(win.document.body);
                expect(uss.getScrollableParent(win.document.getElementById("section11"))).to.equal(win.document.getElementById("xScrollerSection"));
                expect(uss.getScrollableParent(win.document.getElementById("section12"))).to.equal(win.document.getElementById("yScrollerSection"));
            });
        });     
    });
})


describe("getAllScrollableParents", function() {
    var uss;
    function arraysAreEqual(arr1, arr2) {
        if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        if(arr1.length !== arr2.length) return false;
        for(let i = 0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    it("Tests the getAllScrollableParents method", function() {
        cy.visit("index.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                uss._containersData = new Map();  
                            
                cy.testFailingValues(uss.getAllScrollableParents, {
                0: [Cypress.env("failingValuesAll"), 
                    [true, false],
                    Cypress.env("failingValuesAll")
                    ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(Array.isArray(res)).to.be.true;
                    expect(res.length).to.equal(0);
                })
                .then(() => {
                    //test window, html and body
                    expect(arraysAreEqual(uss.getAllScrollableParents(win), [])).to.be.true;  
                    expect(arraysAreEqual(uss.getAllScrollableParents(win.document.documentElement), [])).to.be.true;   
                    expect(arraysAreEqual(uss.getAllScrollableParents(uss.getPageScroller()), [])).to.be.true;
                    
                    //test element with position:fixed
                    expect(arraysAreEqual(uss.getAllScrollableParents(win.stopScrollingX), 
                                         [])
                    ).to.be.true;
                    
                    //test elements with no constraint 
                    expect(arraysAreEqual(uss.getAllScrollableParents(win.document.getElementById("linear")), 
                                         [win.document.getElementById("easeFunctionSelectorList"), win.document.body])
                    ).to.be.true;
                                         
                    expect(arraysAreEqual(uss.getAllScrollableParents(win.document.getElementById("easeFunctionSelectorList")), 
                                         [win.document.body])
                    ).to.be.true;

                    expect(arraysAreEqual(uss.getAllScrollableParents(win.document.getElementById("section11")), 
                                         [win.document.getElementById("xScrollerSection"), win.document.body])
                    ).to.be.true;
                          
                    expect(arraysAreEqual(uss.getAllScrollableParents(win.document.getElementById("section12")), 
                                         [win.document.getElementById("yScrollerSection"), win.document.body])
                    ).to.be.true;
                });
            });     
    });
})