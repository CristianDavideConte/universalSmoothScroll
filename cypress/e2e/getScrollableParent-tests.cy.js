const { constants } = require("../support/constants");

describe("getScrollableParent", function() {
    let uss;
    it("Tests the getScrollableParent method", function() {
        cy.visit("getScrollableParent-tests.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;
                            
              cy.testFailingValues(uss.getScrollableParent, {
                0: [constants.failingValuesAll, 
                    [true, false]
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
                
                const _genericElementParent1 = win.document.getElementById("generic-element-parent-1");
                const _genericElementParent2 = win.document.getElementById("generic-element-parent-2");
                const _genericElementParent3 = win.document.getElementById("generic-element-parent-3");
                const _genericElementParent4 = win.document.getElementById("generic-element-parent-4");
                const _genericElementParent5 = win.document.getElementById("generic-element-parent-5");

                //test window
                expect(uss.getScrollableParent(win)).to.be.null;  

                //test html and body
                expect(uss.getScrollableParent(win.document.documentElement)).to.equal(_htmlParent);   
                expect(uss.getScrollableParent(win.document.body)).to.equal(_bodyParent);
                
                //test element with position:fixed
                expect(uss.getScrollableParent(_positionFixedElement)).to.be.null;
                
                //test elements with no constraint 
                expect(uss.getScrollableParent(_genericElement1)).to.equal(_genericElementParent1);
                expect(uss.getScrollableParent(_genericElement2)).to.equal(_genericElementParent2);
                expect(uss.getScrollableParent(_genericElement3)).to.equal(_genericElementParent3);
                expect(uss.getScrollableParent(_genericElement4)).to.equal(_genericElementParent4);
                expect(uss.getScrollableParent(_genericElement5)).to.equal(_genericElementParent5);
            });
        });     
    });
})