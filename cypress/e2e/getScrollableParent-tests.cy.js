const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getScrollableParent-tests.html"); 
})

describe("getScrollableParent", function() {
    let uss;
    it("Tests the getScrollableParent method", function() {
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
                
                const _genericElement6 = win.document.getElementById("generic-element-6");
                const _genericElement7 = win.document.getElementById("generic-element-7");
                
                const _genericElementParent0 = win.document.getElementById("generic-element-parent-0-a");
                const _genericElementParent1 = win.document.getElementById("generic-element-parent-1");
                const _genericElementParent2 = win.document.getElementById("generic-element-parent-2");
                const _genericElementParent3 = win.document.getElementById("generic-element-parent-3");
                const _genericElementParent4 = win.document.getElementById("generic-element-parent-4");
                const _genericElementParent5 = win.document.getElementById("generic-element-parent-5");

                const _genericElementParent6 = win.document.getElementById("generic-element-parent-6");
                const _genericElementParent7 = win.document.getElementById("generic-element-parent-7");

                //test window
                expect(uss.getScrollableParent(win)).to.be.null;  

                //test html and body
                expect(uss.getScrollableParent(win.document.documentElement)).to.equal(_htmlParent);   
                expect(uss.getScrollableParent(win.document.body)).to.equal(_bodyParent);
                
                //test element with position:fixed
                expect(uss.getScrollableParent(_positionFixedElementDirectBodyChild)).to.be.null;

                //test element with position:fixed
                expect(uss.getScrollableParent(_positionFixedElement)).to.be.null;
                
                //test element with position:absolute which is a direct child of body
                expect(uss.getScrollableParent(_positionAbsoluteElementDirectBodyChild)).to.be.null;

                //test element with position:absolute which is a child of a position:absolute parent
                expect(uss.getScrollableParent(_positionAbsoluteElementA)).to.equal(_genericElementParent0);

                //test element with position:absolute which is a child of a position:static parent
                expect(uss.getScrollableParent(_positionAbsoluteElementB)).to.equal(_body);

                //test elements with no constraint 
                expect(uss.getScrollableParent(_genericElement1)).to.equal(_genericElementParent1);
                expect(uss.getScrollableParent(_genericElement2)).to.equal(_genericElementParent2);
                expect(uss.getScrollableParent(_genericElement3)).to.equal(_genericElementParent3);
                expect(uss.getScrollableParent(_genericElement4)).to.equal(_genericElementParent4);
                expect(uss.getScrollableParent(_genericElement5)).to.equal(_genericElementParent5);

                //test elements that changes their scrollable parent based on the includeHiddenParents parameter
                expect(uss.getScrollableParent(_genericElement6, false)).to.equal(_body);
                expect(uss.getScrollableParent(_genericElement6, true)).to.equal(_genericElementParent6);
                expect(uss.getScrollableParent(_genericElement7, false)).to.equal(_body);
                expect(uss.getScrollableParent(_genericElement7, true)).to.equal(_genericElementParent7);
            });
        });     
    });
})