// libraries
import { expect } from 'chai';
// models
import {
    RecommendationReference, RecommendationReferenceConstants, RecommendationReferenceExceptions
} from './../../../../../models/ValveSizer/Reference/index';

describe('Models.ValveSizer.Reference.Recommendation', () => {
    beforeEach(() => {
        RecommendationReference.setRuleSet(0);
        RecommendationReference.setParameters({
            kv: null,
            vMax: null,
            flowUnit: 'm3_h',
            valveConnection: null
        });
    });

    it('set ruleset', () => {
        RecommendationReference.setRuleSet(1);
        expect(RecommendationReference.getRuleSet()).to.equal(1);
    });

    describe('set parameters', () => {
        it('with empty parameters', () => {
            let parameters = {};
            let expectedParameters = {
                kv: null,
                vMax: null,
                flowUnit: 'm3_h',
                valveConnection: null
            };
            RecommendationReference.setParameters(parameters);
            expect(RecommendationReference.getParameters()).to.deep.equal(expectedParameters);
        });

        it('with existing properties', () => {
            let parameters = {
                kv: 1,
                vMax: 10,
                flowUnit: 'l_h',
                valveConnection: 2
            };
            RecommendationReference.setParameters(parameters);
            expect(RecommendationReference.getParameters()).to.deep.equal(parameters);
        });

        it('with not existing properties', () => {
            let parameters = {
                param1: 1,
                param2: 10,
                param3: 2
            };
            let expectedParameters = {
                kv: null,
                vMax: null,
                flowUnit: 'm3_h',
                valveConnection: null
            };
            RecommendationReference.setParameters(parameters);
            expect(RecommendationReference.getParameters()).to.deep.equal(expectedParameters);
        });
    });

    describe('applying', () => {
        let tests = [
            // ruleset 1: with empty list of items
            {
                ruleset: 1,
                parameters: {
                    kv: 10
                },
                items: [],
                expectedItems: []
            },
            // ruleset 1: successfully
            {
                ruleset: 1,
                parameters: {
                    kv: 9.5
                },
                items: [
                    {
                        kvs: 5,
                        recommendedStatus: ''
                    },
                    {
                        kvs: 10,
                        recommendedStatus: ''
                    },
                    {
                        kvs: 15,
                        recommendedStatus: ''
                    }
                ],
                expectedItems: [
                    {
                        kvs: 10,
                        recommendedStatus: RecommendationReferenceConstants.RECOMMENDATION_STATUS_ABSOLUTELY
                    },
                    {
                        kvs: 15,
                        recommendedStatus: ''
                    }
                ]
            },
            // ruleset 2: with empty list of items
            {
                ruleset: 2,
                parameters: {
                    kv: 10,
                    valveConnection: 2
                },
                items: [],
                expectedItems: []
            },
            // ruleset 2: successfully with valve connection equaled 2-way
            {
                ruleset: 2,
                parameters: {
                    kv: 7.5,
                    valveConnection: 2
                },
                items: [
                    {
                        kvs: 5,
                        recommendedStatus: ''
                    },
                    {
                        kvs: 10,
                        recommendedStatus: ''
                    },
                    {
                        kvs: 15,
                        recommendedStatus: ''
                    }
                ],
                expectedItems: [
                    {
                        kvs: 5,
                        recommendedStatus: RecommendationReferenceConstants.RECOMMENDATION_STATUS_ABSOLUTELY
                    },
                    {
                        kvs: 10,
                        recommendedStatus: RecommendationReferenceConstants.RECOMMENDATION_STATUS_CONDITIONALLY
                    }
                ]
            },
            // ruleset 2: successfully with valve connection equaled 3-way
            {
                ruleset: 2,
                parameters: {
                    kv: 7.5,
                    valveConnection: 3
                },
                items: [
                    {
                        kvs: 5,
                        recommendedStatus: ''
                    },
                    {
                        kvs: 10,
                        recommendedStatus: ''
                    },
                    {
                        kvs: 15,
                        recommendedStatus: ''
                    }
                ],
                expectedItems: [
                    {
                        kvs: 5,
                        recommendedStatus: RecommendationReferenceConstants.RECOMMENDATION_STATUS_CONDITIONALLY
                    },
                    {
                        kvs: 10,
                        recommendedStatus: RecommendationReferenceConstants.RECOMMENDATION_STATUS_ABSOLUTELY
                    }
                ]
            },
            // ruleset 3: with empty list of items
            //{
            //    ruleset: 3,
            //    parameters: {
            //        vMax: 30.5,
            //        flowUnit: 'm3_h',
            //    },
            //    items: [],
            //    expectedItems: []
            //},
            // ruleset 3: successfully
            {
                ruleset: 3,
                parameters: {
                    vMax: 30.5,
                    flowUnit: 'm3_h',
                },
                items: [
                    {
                        dn: "15",
                        kvs: 10,
                        recommendedStatus: ''
                    },
                    {
                        dn: "20",
                        kvs: 19,
                        recommendedStatus: ''
                    },
                    {
                        dn: "50",
                        kvs: 34,
                        recommendedStatus: ''
                    },
                    {
                        dn: "65",
                        kvs: 55,
                        recommendedStatus: ''
                    },
                    {
                        dn: "150",
                        kvs: 100,
                        recommendedStatus: ''
                    }
                ],
                expectedItems: [
                    {
                        dn: "50",
                        kvs: 34,
                        recommendedStatus: RecommendationReferenceConstants.RECOMMENDATION_STATUS_ABSOLUTELY
                    },
                    {
                        dn: "65",
                        kvs: 55,
                        recommendedStatus: RecommendationReferenceConstants.RECOMMENDATION_STATUS_CONDITIONALLY
                    }
                ]
            },
            // ruleset 3: with not existing necessary extreme dn values
            {
                ruleset: 3,
                parameters: {
                    vMax: 30.5,
                    flowUnit: 'm3_h',
                },
                items: [
                    {
                        dn: "20",
                        kvs: 19,
                        recommendedStatus: ''
                    },
                    {
                        dn: "50",
                        kvs: 34,
                        recommendedStatus: ''
                    },
                    {
                        dn: "65",
                        kvs: 55,
                        recommendedStatus: ''
                    }
                ],
                expectedItems: [
                    {
                        dn: "50",
                        kvs: 34,
                        recommendedStatus: RecommendationReferenceConstants.RECOMMENDATION_STATUS_ABSOLUTELY
                    },
                    {
                        dn: "65",
                        kvs: 55,
                        recommendedStatus: RecommendationReferenceConstants.RECOMMENDATION_STATUS_CONDITIONALLY
                    }
                ]
            }
        ];

        tests.forEach((test) => {
            it ('ruleset ' + test.ruleset + ' with parameters: ' + JSON.stringify(test.parameters)
                + ' and items: ' + JSON.stringify(test.items), () => {
                    let items = test.items;
                    RecommendationReference.setRuleSet(test.ruleset);
                    RecommendationReference.setParameters(test.parameters);
                    let resultItems = RecommendationReference.apply(items);
                    expect(resultItems).to.deep.equal(test.expectedItems);
            });
        });

        it('ruleset 3 with not valid Vmax', () => {
            let items = [
                {
                    dn: "15",
                    kvs: 10,
                    recommendedStatus: ''
                },
                {
                    dn: "20",
                    kvs: 19,
                    recommendedStatus: ''
                },
                {
                    dn: "50",
                    kvs: 34,
                    recommendedStatus: ''
                },
                {
                    dn: "65",
                    kvs: 55,
                    recommendedStatus: ''
                },
                {
                    dn: "150",
                    kvs: 100,
                    recommendedStatus: ''
                }
            ];
            RecommendationReference.setRuleSet(3);
            RecommendationReference.setParameters({
                vMax: 120,
                flowUnit: 'm3_h'
            });
            expect(() => {
                RecommendationReference.apply(items)
            }).to.throw(RecommendationReferenceExceptions.NotValidVMaxForRulesetException(3, 100));
        });

        it('ruleset 4 with not valid Vmax', () => {
            let items = [
                {
                    dn: "15",
                    kvs: 0,
                    vNom: 210,
                    vPosMax1: 20,
                    vPosMax2: 25,
                    vPosMax3: 35,
                    recommendedStatus: ''
                }
            ];
            RecommendationReference.setRuleSet(4);
            RecommendationReference.setParameters({
                vMax: 10,
                flowUnit: 'l_h'
            });
            expect(() => {
                RecommendationReference.apply(items)
            }).to.throw(RecommendationReferenceExceptions.NotValidVMaxForRulesetException(20, 980));
        });
    });
});
