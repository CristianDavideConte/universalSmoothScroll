const { constants } = require("../support/constants");

describe("getYScrollableParent", function() {
    let uss;
    it("Tests the getYScrollableParent method", function() {
        cy.visit("getYScrollableParent-tests.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
                            
              cy.testFailingValues(uss.getYScrollableParent, {
                0: [constants.failingValuesAll, 
                    [true, false]
                    ]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(res).to.equal(null);
              })
              .then(() => {
                const _bodyParent = win;
                const _htmlParent = win;
                
                const _positionFixedElement = win.document.getElementById("position-fixed-element");

                const _genericElement1 = win.document.getElementById("generic-element-1");
                const _genericElement2 = win.document.getElementById("generic-element-2");
                const _genericElement3 = win.document.getElementById("generic-element-3");
                
                const _genericElementParent1 = win.document.getElementById("generic-element-parent-1");
                const _genericElementParent2 = win.document.getElementById("generic-element-parent-2");
                const _genericElementParent3 = win.document.getElementById("generic-element-parent-3");

                //test window
                expect(uss.getYScrollableParent(win)).to.be.null;  

                //test html and body
                expect(uss.getYScrollableParent(win.document.documentElement)).to.equal(_htmlParent);   
                expect(uss.getYScrollableParent(win.document.body)).to.equal(_bodyParent);
                
                //test element with position:fixed
                expect(uss.getYScrollableParent(_positionFixedElement)).to.be.null;
                
                //test elements with no constraint 
                expect(uss.getYScrollableParent(_genericElement1)).to.equal(_genericElementParent1);
                expect(uss.getYScrollableParent(_genericElement2)).to.equal(_genericElementParent2);
                expect(uss.getYScrollableParent(_genericElement3)).to.equal(_genericElementParent3);
            });
        });     
    });
})