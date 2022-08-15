const { constants } = require("../support/constants");

function arraysAreEqual(arr1, arr2) {
    if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if(arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false;
    }
    return true;
}

beforeEach(() => {
    cy.visit("getOnResizeEndCallbacks-tests.html"); 
})

describe("getOnResizeEndCallbacks", function() {
    let uss;
    it("Tests the getOnResizeEndCallbacks method", function() {
        cy.window()
            .then((win) => {
                uss = win.uss;

                const _testCallback1 = () => console.log("test");
                const _testCallback2 = () => console.log("test");

                expect(arraysAreEqual(
                        uss.getOnResizeEndCallbacks(),
                        []
                        )
                ).to.be.true;

                uss.addOnResizeEndCallback(_testCallback1);
                
                expect(arraysAreEqual(
                    uss.getOnResizeEndCallbacks(),
                    [_testCallback1]
                    )
                ).to.be.true;

                uss.addOnResizeEndCallback(_testCallback2);
                
                expect(arraysAreEqual(
                    uss.getOnResizeEndCallbacks(),
                    [_testCallback1, _testCallback2]
                    )
                ).to.be.true;

                uss.getOnResizeEndCallbacks().splice(0, 1);

                expect(arraysAreEqual(
                    uss.getOnResizeEndCallbacks(),
                    [_testCallback2]
                    )
                ).to.be.true;
            });        
    })
})