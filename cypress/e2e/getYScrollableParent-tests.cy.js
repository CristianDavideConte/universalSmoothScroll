const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getYScrollableParent-tests.html"); 
})

describe("getYScrollableParent", function() {
    let uss;
    it("Tests the getYScrollableParent method", function() {
        cy.window()
          .then((win) => {
              uss = win.uss;
                            
              cy.testFailingValues(uss.getYScrollableParent, {
                0: [constants.failingValuesAll, 
                    [true, false]
                    ]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(res).to.throw(constants.defaultUssException);
              })
              .then(() => {
                const _htmlParent = null;
                const _bodyParent = null;

                const _body = win.document.body;
                
                const _positionFixedElementDirectBodyChild = win.document.getElementById("position-fixed-element-direct-body-child");
                const _positionAbsoluteElementDirectBodyChild = win.document.getElementById("position-absolute-element-direct-body-child");

                const _positionFixedElement = win.document.getElementById("position-fixed-element");
                const _positionAbsoluteElementA = win.document.getElementById("position-absolute-element-a");
                const _positionAbsoluteElementB = win.document.getElementById("position-absolute-element-b");

                const _genericElement1 = win.document.getElementById("generic-element-1");
                const _genericElement2 = win.document.getElementById("generic-element-2");
                const _genericElement3 = win.document.getElementById("generic-element-3");
                
                const _genericElement4 = win.document.getElementById("generic-element-4");
                const _genericElement5 = win.document.getElementById("generic-element-5");
                
                const _genericElementParent0 = win.document.getElementById("generic-element-parent-0-a");
                const _genericElementParent1 = win.document.getElementById("generic-element-parent-1");
                const _genericElementParent2 = win.document.getElementById("generic-element-parent-2");
                const _genericElementParent3 = win.document.getElementById("generic-element-parent-3");

                const _genericElementParent4 = win.document.getElementById("generic-element-parent-4");
                const _genericElementParent5 = win.document.getElementById("generic-element-parent-5");

                //test window
                expect(uss.getYScrollableParent(win)).to.be.null;  

                //test html and body
                expect(uss.getYScrollableParent(win.document.documentElement)).to.equal(_htmlParent);   
                expect(uss.getYScrollableParent(_body)).to.equal(_bodyParent);
                
                //test element with position:fixed
                expect(uss.getYScrollableParent(_positionFixedElementDirectBodyChild)).to.be.null;
                
                //test element with position:fixed
                expect(uss.getYScrollableParent(_positionFixedElement)).to.be.null;

                //test element with position:absolute which is a direct child of body
                expect(uss.getYScrollableParent(_positionAbsoluteElementDirectBodyChild)).to.be.null;

                //test element with position:absolute which is a child of a position:absolute parent
                expect(uss.getYScrollableParent(_positionAbsoluteElementA)).to.equal(_genericElementParent0);
                
                //test element with position:absolute which is a child of a position:static parent
                expect(uss.getYScrollableParent(_positionAbsoluteElementB)).to.equal(_body);

                //test elements with no constraint 
                expect(uss.getYScrollableParent(_genericElement1)).to.equal(_genericElementParent1);
                expect(uss.getYScrollableParent(_genericElement2)).to.equal(_genericElementParent2);
                expect(uss.getYScrollableParent(_genericElement3)).to.equal(_genericElementParent3);
                
                //test elements that changes their scrollable parent based on the includeHiddenParents parameter
                expect(uss.getYScrollableParent(_genericElement4, false)).to.equal(_body);
                expect(uss.getYScrollableParent(_genericElement4, true)).to.equal(_genericElementParent4);
                expect(uss.getYScrollableParent(_genericElement5, false)).to.equal(_body);
                expect(uss.getYScrollableParent(_genericElement5, true)).to.equal(_body);
            });
        });     
    });
})