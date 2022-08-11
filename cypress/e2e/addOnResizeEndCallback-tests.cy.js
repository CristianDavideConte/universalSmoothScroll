const { constants } = require("../support/constants");

function arraysAreEqual(arr1, arr2) {
    if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if(arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false;
    }
    return true;
}

describe("addOnResizeEndCallback", function() {
    let uss;
    it("Tests the addOnResizeEndCallback method", function() {
        cy.visit("addOnResizeEndCallback-tests.html"); 
        cy.window()
          .then((win) => {
              uss = win.uss;

              const _testCallback1 = () => console.log("test");
              const _testCallback2 = () => console.log("test");

              cy.testFailingValues(uss.addOnResizeEndCallback, {
                0: [constants.failingValuesAll]
              }, 
              (res, v1, v2, v3, v4, v5, v6, v7) => {
                expect(arraysAreEqual(
                        uss.getOnResizeEndCallbacks(),
                        []
                        )
                ).to.be.true;
              }).then(() => {
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
              });
          });        
    })
})