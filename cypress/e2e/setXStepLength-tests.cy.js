const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("setXStepLength-tests.html"); 
})

describe("setXStepLength", function() {
    let uss;
    let _testStepInvalidTypeString = "";
    let _testStepInvalidTypeNaN = NaN;
    let _testStepValidType1 = 10;
    let _testStepValidType2 = 5;
    it("Tests the setXStepLength method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;
                const _testElement = win.document.getElementById("scroller");
                const _initialStepLength = uss.getXStepLength(); 

                cy.testFailingValues(uss.setXStepLength, {
                    0: [constants.failingValuesNoPositiveNumberOrUndefined.concat([_testStepInvalidTypeString, _testStepInvalidTypeNaN])],
                }, 
                (res, v1, v2, v3, v4, v5, v6, v7) => {
                    expect(res).to.throw(constants.defaultUssException);
                    expect(uss.getXStepLength()).to.equal(_initialStepLength);
                })
                .then(() => {
                    //Test valid step lengths
                    uss.setXStepLength(_testStepValidType1);
                    expect(uss.getXStepLength()).to.equal(_testStepValidType1);  

                    uss.setXStepLength(_testStepValidType2);
                    expect(uss.getXStepLength()).to.equal(_testStepValidType2); 

                    uss.stopScrollingY();
                    expect(uss.getXStepLength()).to.equal(_testStepValidType2);
                    
                    try {
                        uss.setXStepLength(_testStepInvalidTypeString);
                    } catch(e) {
                        expect(uss.getXStepLength()).to.equal(_testStepValidType2);
                    }
                    
                    cy.waitForUssCallback(
                        (resolve) => {
                            uss._reducedMotion = true;
                            uss.scrollXTo(100, _testElement, resolve);
                        }
                    ).then(
                        () => {
                            cy.elementScrollLeftShouldBe(_testElement, 100);
                            expect(uss.getXStepLength()).to.equal(_testStepValidType2);
                        }
                    );
                });
            });     
    });
})
