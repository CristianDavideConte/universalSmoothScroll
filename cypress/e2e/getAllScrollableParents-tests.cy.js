import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
        cy.visit("getAllScrollableParents-tests.html"); 
})

describe("getAllScrollableParents", function () {
        it("Tests the getAllScrollableParents method", function () {
                cy.window()
                        .then((win) => {
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
                                                const _htmlParent = win;
                                                const _bodyParent = win;
                        
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
                        
                                                const _genericElementParent00 = win.document.getElementById("generic-element-parent-0-a");
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

                                                const _genericElementParent61 = win.document.getElementById("generic-element-parent-61");
                                                const _genericElementParent71 = win.document.getElementById("generic-element-parent-71");

                        
                                                //test window
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(win),
                                                        []
                                                )
                                                ).to.be.true;


                                                //test html and body
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(win.document.documentElement),
                                                        [_htmlParent]
                                                )
                                                ).to.be.true;
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_body),
                                                        [_bodyParent]
                                                )
                                                ).to.be.true;
                        

                                                //test element with position:fixed
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_positionFixedElementDirectBodyChild),
                                                        []
                                                )
                                                ).to.be.true;


                                                //test element with position:fixed
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_positionFixedElement),
                                                        []
                                                )
                                                ).to.be.true;
                        
                        
                                                //test element with position:absolute which is a direct child of body
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_positionAbsoluteElementDirectBodyChild),
                                                        [_bodyParent]
                                                )
                                                ).to.be.true;


                                                //test element with position:absolute which is a child of a position:absolute parent
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_positionAbsoluteElementA),
                                                        [_genericElementParent00, _body, _bodyParent]
                                                )
                                                ).to.be.true;
                        

                                                //test element with position:absolute which is a child of a position:static parent
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_positionAbsoluteElementB),
                                                        [_htmlParent]
                                                )
                                                ).to.be.true;


                                                //test elements with no constraint 
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_genericElement1),
                                                        [_genericElementParent11, _genericElementParent12, _body, _bodyParent]
                                                )
                                                ).to.be.true;
                        
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_genericElement2),
                                                        [_genericElementParent21, _genericElementParent22]
                                                )
                                                ).to.be.true;
                        
                        
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_genericElement3),
                                                        [_genericElementParent31, _genericElementParent32, _body, _bodyParent]
                                                )
                                                ).to.be.true;
                        
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_genericElement4),
                                                        [_genericElementParent41, _genericElementParent42, _body, _bodyParent]
                                                )
                                                ).to.be.true;
                
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_genericElement5),
                                                        [_genericElementParent51, _genericElementParent52, _body, _bodyParent]
                                                )
                                                ).to.be.true;


                                                //test elements that changes their scrollable parent based on the includeHiddenParents parameter
                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_genericElement6, false),
                                                        [_body, _bodyParent]
                                                )
                                                ).to.be.true;

                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_genericElement6, true),
                                                        [_genericElementParent61, _body, _bodyParent]
                                                )
                                                ).to.be.true;

                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_genericElement7, false),
                                                        [_body, _bodyParent]
                                                )
                                                ).to.be.true;

                                                expect(constants.arraysAreEqual(
                                                        uss.getAllScrollableParents(_genericElement7, true),
                                                        [_genericElementParent71, _body, _bodyParent]
                                                )
                                                ).to.be.true;
                                        });
                        });
        });
});