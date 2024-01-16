import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
    cy.visit("calcBordersDimensions-tests.html");
    
    //Speeds up the tests, there's no need to wait for the scroll-animations.
    uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("calcBordersDimensions", function () {
    it("Tests the calcBordersDimensions method", function () {
        cy.window()
            .then((win) => {
                const _maxDim = 10; //See css styles of calcBordersDimensions-tests.html
                
                //uss._containersData.clear(); //TODO: The observers should be detached
                //expect(uss._containersData.size).to.equal(0);

                //Test the window's borders. 
                const _windowBordersDimensions = uss.calcBordersDimensions(win, true);
                expect(constants.arraysAreEqual(
                    _windowBordersDimensions,
                    uss.calcBordersDimensions(uss.getWindowScroller(win, true))
                )
                ).to.be.true;

                const _windowBordersCachedDimensions = [
                    uss._containersData.get(win)[constants.K_TB],
                    uss._containersData.get(win)[constants.K_RB],
                    uss._containersData.get(win)[constants.K_BB],
                    uss._containersData.get(win)[constants.K_LB],
                ];
                expect(constants.arraysAreEqual(
                    _windowBordersDimensions,
                    _windowBordersCachedDimensions
                )
                ).to.be.true;

                const _head = win.document.head;
                expect(constants.arraysAreEqual(uss.calcBordersDimensions(_head), [0, 0, 0, 0])).to.be.true;
                Array.from(_head.children).forEach(el => expect(constants.arraysAreEqual(uss.calcBordersDimensions(el), [0, 0, 0, 0])).to.be.true);
                
                cy.testFailingValues(uss.calcBordersDimensions, {
                    0: [constants.failingValuesAllNoUndefined,
                    [true, false],
                    ]
                },
                    (res, v1, v2, v3, v4, v5, v6, v7) => {
                        expect(res).to.throw(constants.defaultUssException);
                    })
                    .then(() => {
                        const _borderedElement = win.document.getElementById("bordered");

                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement),
                            [0, 0, 0, 0])
                        ).to.be.true;

                        _borderedElement.classList.add("all-border");

                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false),
                            [0, 0, 0, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true),
                            [_maxDim, _maxDim, _maxDim, _maxDim])
                        ).to.be.true;

                        _borderedElement.classList.remove("all-border");
                        _borderedElement.classList.add("top-border");
                    
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false),
                            [_maxDim, _maxDim, _maxDim, _maxDim])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true),
                            [_maxDim, 0, 0, 0])
                        ).to.be.true;
                    
                        _borderedElement.classList.remove("top-border");
                        _borderedElement.classList.add("right-border");
                    
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false),
                            [_maxDim, 0, 0, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true),
                            [0, _maxDim, 0, 0])
                        ).to.be.true;
       
                        _borderedElement.classList.remove("right-border");
                        _borderedElement.classList.add("bottom-border");
                    
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false),
                            [0, _maxDim, 0, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true),
                            [0, 0, _maxDim, 0])
                        ).to.be.true;

                        _borderedElement.classList.remove("bottom-border");
                        _borderedElement.classList.add("left-border");
                    
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false),
                            [0, 0, _maxDim, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true),
                            [0, 0, 0, _maxDim])
                        ).to.be.true;
                    
                        _borderedElement.classList.remove("left-border");
                        _borderedElement.classList.add("no-border");
                    
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false),
                            [0, 0, 0, _maxDim])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true),
                            [0, 0, 0, 0])
                        ).to.be.true;

                        _borderedElement.classList.remove("no-border");
                        _borderedElement.classList.add("hidden-border");
                    
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, false),
                            [0, 0, 0, 0])
                        ).to.be.true;
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement, true),
                            [0, 0, 0, 0])
                        ).to.be.true;
                    
                        //Test if the methods used for stopping one or more scroll-animation/s erase the cached values (they should not).
                        const _dims = uss.calcBordersDimensions(_borderedElement, true);
                        uss.stopScrollingX(_borderedElement);
                        uss.stopScrollingY(_borderedElement);
                        uss.stopScrolling(_borderedElement);
                        uss.stopScrollingAll();
                        expect(constants.arraysAreEqual(uss.calcBordersDimensions(_borderedElement), _dims)).to.be.true;
                    });
            });
    });
});