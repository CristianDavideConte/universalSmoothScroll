function arraysAreEqual(arr1, arr2) {
    if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if(arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false;
    }
    return true;
}

describe("calcBordersDimensions", function() {
    let uss;
    it("Tests the calcBordersDimensions method", function() {
        cy.visit("calcBordersDimensions-tests.html"); 
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _maxDim = 10; //See css styles of calcBordersDimensions-tests.html
                
                cy.testFailingValues(uss.calcBordersDimensions, {
                    0: [Cypress.env("failingValuesAll")]
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(Cypress.env("defaultUssException"));
                })
                .then(() => {
                    const _borderedElement = win.document.getElementById("bordered");   

                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,0,0])
                    ).to.be.true;

                    _borderedElement.classList.add("all-border");

                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [_maxDim,_maxDim,_maxDim,_maxDim])
                    ).to.be.true;

                    _borderedElement.classList.remove("all-border");
                    _borderedElement.classList.add("top-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [_maxDim,0,0,0])
                    ).to.be.true;
                    
                    _borderedElement.classList.remove("top-border");
                    _borderedElement.classList.add("right-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,_maxDim,0,0])
                    ).to.be.true;
       
                    _borderedElement.classList.remove("right-border");
                    _borderedElement.classList.add("bottom-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,_maxDim,0])
                    ).to.be.true;

                    _borderedElement.classList.remove("bottom-border");
                    _borderedElement.classList.add("left-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,0,_maxDim])
                    ).to.be.true;
                    
                    _borderedElement.classList.remove("left-border");
                    _borderedElement.classList.add("no-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,0,0])
                    ).to.be.true;

                    _borderedElement.classList.remove("no-border");
                    _borderedElement.classList.add("hidden-border");
                    
                    expect(arraysAreEqual(uss.calcBordersDimensions(_borderedElement), 
                                          [0,0,0,0])
                    ).to.be.true;
                });
            });        
    });
})