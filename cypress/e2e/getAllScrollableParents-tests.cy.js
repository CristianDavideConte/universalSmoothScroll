const { constants } = require("../support/constants");

function arraysAreEqual(arr1, arr2) {
    if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if(arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false;
    }
    return true;
}

describe("getAllScrollableParents", function() {
    let uss;
    it("Tests the getAllScrollableParents method", function() {
        cy.visit("getAllScrollableParents-tests.html"); 
        cy.window()
          .then((win) => {
                uss = win.uss;
                            
                cy.testFailingValues(uss.getAllScrollableParents, {
                    0: [constants.failingValuesAll, 
                        [true, false],
                        constants.failingValuesAll
                        ]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                })
                .then(() => {
                    const _bodyParent = win;
                    const _htmlParent = win;
                    
                    const _positionFixedElement = win.document.getElementById("position-fixed-element");

                    const _genericElement1 = win.document.getElementById("generic-element-1");
                    const _genericElement2 = win.document.getElementById("generic-element-2");
                    const _genericElement3 = win.document.getElementById("generic-element-3");
                    const _genericElement4 = win.document.getElementById("generic-element-4");
                    const _genericElement5 = win.document.getElementById("generic-element-5");
                    
                    const _genericElementParent11 = win.document.getElementById("generic-element-parent-11");
                    const _genericElementParent12 = win.document.getElementById("generic-element-parent-12");
                    const _genericElementParent21 = win.document.getElementById("generic-element-parent-21");
                    const _genericElementParent22 = win.document.getElementById("generic-element-parent-22");
                    const _genericElementParent31 = win.document.getElementById("generic-element-parent-31");
                    const _genericElementParent32 = win.document.getElementById("generic-element-parent-32");
                    const _genericElementParent41 = win.document.getElementById("generic-element-parent-41");
                    const _genericElementParent42 = win.document.getElementById("generic-element-parent-42");
                    const _genericElementParent51 = win.document.getElementById("generic-element-parent-51");
                    const _genericElementParent52 = win.document.getElementById("generic-element-parent-52");

                    //test window
                    expect(arraysAreEqual(
                            uss.getAllScrollableParents(win), 
                            []
                            )
                    ).to.be.true;  

                    //test html and body
                    expect(arraysAreEqual(
                            uss.getAllScrollableParents(win.document.documentElement), 
                            [_htmlParent]
                            )
                    ).to.be.true;  
                    expect(arraysAreEqual(
                            uss.getAllScrollableParents(win.document.body), 
                            [_bodyParent]
                            )
                    ).to.be.true;  
                    
                    //test element with position:fixed
                    expect(arraysAreEqual(
                            uss.getAllScrollableParents(_positionFixedElement), 
                            []
                            )
                    ).to.be.true;  
                    
                    //test elements with no constraint 
                    console.log(uss.getAllScrollableParents(_genericElement1))
                    expect(arraysAreEqual(
                            uss.getAllScrollableParents(_genericElement1), 
                            [_genericElementParent11, _genericElementParent12, win.document.body, win]
                            )
                    ).to.be.true;  
                    
                    expect(arraysAreEqual(
                            uss.getAllScrollableParents(_genericElement2), 
                            [_genericElementParent21, _genericElementParent22]
                            )
                    ).to.be.true;  
                    
                    
                    expect(arraysAreEqual(
                            uss.getAllScrollableParents(_genericElement3), 
                            [_genericElementParent31, _genericElementParent32, win.document.body, win]
                            )
                    ).to.be.true;  
                    
                    expect(arraysAreEqual(
                            uss.getAllScrollableParents(_genericElement4), 
                            [_genericElementParent41, _genericElementParent42, win.document.body, win]
                            )
                    ).to.be.true;  
            
                    expect(arraysAreEqual(
                            uss.getAllScrollableParents(_genericElement5), 
                            [_genericElementParent51, _genericElementParent52, win.document.body, win]
                            )
                    ).to.be.true;  
                });
        });     
    });
})