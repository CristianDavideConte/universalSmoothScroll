// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.addAll({
    bodyScrollLeftShouldToBe(value) {
        cy.get("body")
        .should("have.prop", "scrollLeft")
        .and("eq", value);
    },
    bodyScrollTopShouldToBe(value) {
        cy.get("body")
        .should("have.prop", "scrollTop")
        .and("eq", value);
    },
    /**
     * The passed fun parameter should resolve the promise.
     * If it's undefined the promise is resolve after a timeout.
     */
    async waitForUssCallback(fun = (resolve, reject) => setTimeout(resolve, 3500)) {
        const promise = new Promise(
            (resolve, reject) => {
                fun(resolve, reject);
            }
        );
        const resolvedValue = await promise;
        return resolvedValue
    },
    /** 
     * Input parameters structure:
     *  command = uss.nameOfMethod
     *  failingValues = {
     *   0 : [value1, value2..., value7],
     *   1 : [value1, value2],
     *   2 : [],
     *    ...
     *  }
     *  actionAftertest = (res, v1, v2, v3, v4, v5, v6, v7) => {expect(...).to...}
     */
    testFailingValues(command, failingValues = {}, actionAfterTest = (res) => expect(res).to.be.undefined) {  
        function loopThroughFailingValuesArr(failingValueArr, outerIndex = 0, innerIndex = 0, currentFailingValues = []) {
            while(Array.isArray(failingValueArr[outerIndex])) {
                if(failingValueArr[outerIndex].length <= innerIndex) {
                    outerIndex++;
                    innerIndex = 0;
                    continue;
                }
                const newFailingValues = currentFailingValues.slice();
                newFailingValues.push(failingValueArr[outerIndex][innerIndex]);
                loopThroughFailingValuesArr(failingValueArr, outerIndex + 1, 0, newFailingValues);
                innerIndex++;                                  
            }
            if(currentFailingValues.length !== outerIndex) return;

            //Test the current failing values combination
            const [v1, v2, v3, v4, v5, v6, v7] = currentFailingValues;
            let result;
            try {
                actionAfterTest(
                    command(v1, v2, v3, v4, v5, v6, v7),
                    v1, v2, v3, v4, v5, v6, v7
                );
            } catch(error) { 
                //Never throw directly, always wrap the error inside a function
                //so that it can be later analyzed. 
                actionAfterTest(
                    () => {throw error},
                    v1, v2, v3, v4, v5, v6, v7
                );
            }
        }

        for(let [key, failingValueArr] of Object.entries(failingValues)) {
            loopThroughFailingValuesArr(failingValueArr);
        }
    }
});