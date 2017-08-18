// libraries
import { expect } from 'chai';
// models
import { FlowPressureCalculator } from './../../../../models/ValveSizer/Reference/index';

describe('Models.ValveSizer.Reference.FlowPressureCalculator', () => {
    const tests = [
        {
            params: {
                flow: 0.86,
                kvs: 8,
                flowUnit: 'm3_h',
                pressure: 12,
                pressureUnit: 'k_pa'
            },
            expected: {
                kv: 2.4826061575,
                effectivePressure: 1.155625
            }
        },
        {
            params: {
                flow: 0.86,
                kvs: 8,
                flowUnit: 'm3_h',
                pressure: 0.12, // = 12 k_pa
                pressureUnit: 'bar'
            },
            expected: {
                kv: 2.4826061575,
                effectivePressure: 0.01155625 // 1.155625 k_pa
            }
        },
        {
            params: {
                flow: 0,
                kvs: 8,
                flowUnit: 'm3_h',
                pressure: 12,
                pressureUnit: 'k_pa'
            },
            expected: {
                kv: 0,
                effectivePressure: 0
            }
        },
        {
            params: {
                flow: 0.86,
                kvs: 0,
                flowUnit: 'm3_h',
                pressure: 0,
                pressureUnit: 'k_pa'
            },
            expected: {
                kv: 0,
                effectivePressure: 0
            }
        },
        {
            params: {
                flow: 0.0143362, // = 0.86 m3_h
                kvs: 0.13336, // = 8 m3_h
                flowUnit: 'm3_min',
                pressure: 12,
                pressureUnit: 'k_pa'
            },
            expected: {
                kv: 0.0413850446, // = 2.4826061575 m3_h
                effectivePressure: 1.155625
            }
        },
        {
            params: {
                flow: 0.00238908, // = 0.86 m3_h
                kvs: 0.022224, // = 8 m3_h
                flowUnit: 'm3_s',
                pressure: 12,
                pressureUnit: 'k_pa'
            },
            expected: {
                kv: 0.0068966799, // = 2.4826061575 m3_h
                effectivePressure: 1.155625
            }
        },
        {
            params: {
                flow: 860, // = 0.86 m3_h
                kvs: 8000, // = 8 m3_h
                flowUnit: 'l_h',
                pressure: 12,
                pressureUnit: 'k_pa'
            },
            expected: {
                kv: 2482.6061575154, // = 2.4826061575 m3_h
                effectivePressure: 1.155625
            }
        },
        {
            params: {
                flow: 14.33362, // = 0.86 m3_h
                kvs: 133.336, // = 8 m3_h
                flowUnit: 'l_min',
                pressure: 12,
                pressureUnit: 'k_pa'
            },
            expected: {
                kv: 41.3775968273, // = 2.4826061575 m3_h
                effectivePressure: 1.155625
            }
        },
        {
            params: {
                flow: 0.238908, // = 0.86 m3_h
                kvs: 2.2224, // = 8 m3_h
                flowUnit: 'l_s',
                pressure: 12,
                pressureUnit: 'k_pa'
            },
            expected: {
                kv: 0.6896679906, // = 2.4826061575 m3_h
                effectivePressure: 1.155625
            }
        },
    ];

    describe('calculateKv', () => {
        tests.forEach((test) => {
            it(`should correct calculate kv with params: ${JSON.stringify(test.params)}`, () => {
                FlowPressureCalculator.setFlowUnit(test.params.flowUnit);
                FlowPressureCalculator.setPressureUnit(test.params.pressureUnit);
                expect(
                    FlowPressureCalculator.calculateKv(test.params.flow, test.params.pressure)
                ).to.equal(test.expected.kv);
            });
        });
    });

    describe('calculateEffectivePressure', () => {
        tests.forEach((test) => {
            it(`should correct calculate effective pressure with params: ${JSON.stringify(test.params)}`, () => {
                FlowPressureCalculator.setFlowUnit(test.params.flowUnit);
                FlowPressureCalculator.setPressureUnit(test.params.pressureUnit);
                expect(
                    FlowPressureCalculator.calculateEffectivePressure(test.params.flow, test.params.kvs)
                ).to.equal(test.expected.effectivePressure);
            });
        });
    });
});
