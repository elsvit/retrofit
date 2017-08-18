// libraries
import { expect } from 'chai';
// models
import { FlowReference } from './../../../../models/ValveSizer/Reference/index';

describe('Models.ValveSizer.Reference.FlowReference', () => {
    const
        units = [
            { name: 'l_h', label: 'l/h' },
            { name: 'l_min', label: 'l/min' },
            { name: 'l_s', label: 'l/s' },
            { name: 'm3_h', label: 'm' + String.fromCharCode(179) + '/h' },
            { name: 'm3_min', label: 'm' + String.fromCharCode(179) + '/min' },
            { name: 'm3_s', label: 'm' + String.fromCharCode(179) + '/s' }
        ];

    describe('getUnits', () => {
        it('should return certain list', () => {
            expect(
                FlowReference.getUnits()
            ).to.deep.equal(units);
        });
    });

    describe('getLabel', () => {
        it('should return label if unit exists', () => {
            expect(
                FlowReference.getLabel('l_min')
            ).to.equal('l/min');
        });

        it('should return empty if unit does not exist', () => {
            expect(
                FlowReference.getLabel('l_minute')
            ).to.equal('');
        });
    });

    describe('calculate', () => {
        let tests = [
            // using base flow unit (m3_h)
            {
                power: 20,
                temperatureDifference: 10,
                flowUnit: '',
                expectedFlow: 1.72
            },
            // using l_h flow unit
            {
                power: 20,
                temperatureDifference: 10,
                flowUnit: 'l_h',
                expectedFlow: 1720
            },
            // using l_min flow unit
            {
                power: 20,
                temperatureDifference: 10,
                flowUnit: 'l_min',
                expectedFlow: 28.66724
            },
            // using l_s flow unit
            {
                power: 20,
                temperatureDifference: 10,
                flowUnit: 'l_s',
                expectedFlow: 0.477816
            },
            // using m3_min flow unit
            {
                power: 20,
                temperatureDifference: 10,
                flowUnit: 'm3_min',
                expectedFlow: 0.0286724
            },
            // using m3_s flow unit
            {
                power: 20,
                temperatureDifference: 10,
                flowUnit: 'm3_s',
                expectedFlow: 0.00477816
            },
            // using m3_s flow unit
            {
                power: 20,
                temperatureDifference: 10,
                flowUnit: 'm3_s',
                expectedFlow: 0.00477816
            },
            // using not existing flow unit
            {
                power: 20,
                temperatureDifference: 10,
                flowUnit: 'm3_second',
                expectedFlow: 0
            },
            // with not valid power
            {
                power: 0,
                temperatureDifference: 10,
                flowUnit: '',
                expectedFlow: 0
            },
            // with not valid power
            {
                power: 20,
                temperatureDifference: -120,
                flowUnit: '',
                expectedFlow: 0
            },
        ];

        tests.forEach((test) => {
            it('with power=' + test.power
                + ', temperatureDifference=' + test.temperatureDifference
                + ' flowUnit=' + test.flowUnit,
                () => {
                    expect(
                        FlowReference.calculate(test.power, test.temperatureDifference, test.flowUnit)
                    ).to.equal(test.expectedFlow);
            });
        });
    });

    describe('convert', () => {
        let tests = [
            // from m3_h
            {
                value: 10,
                unitFrom: 'm3_h',
                unitTo: 'm3_min',
                expectedFlow: 0.1667
            },
            {
                value: 10,
                unitFrom: 'm3_h',
                unitTo: 'm3_s',
                expectedFlow: 0.02778
            },
            {
                value: 10,
                unitFrom: 'm3_h',
                unitTo: 'l_h',
                expectedFlow: 10000
            },
            {
                value: 10,
                unitFrom: 'm3_h',
                unitTo: 'l_min',
                expectedFlow: 166.67
            },
            {
                value: 10,
                unitFrom: 'm3_h',
                unitTo: 'l_s',
                expectedFlow: 2.778
            },
            // from m3_min
            {
                value: 0.1667,
                unitFrom: 'm3_min',
                unitTo: 'm3_h',
                expectedFlow: 10
            },
            {
                value: 0.1667,
                unitFrom: 'm3_min',
                unitTo: 'm3_s',
                expectedFlow: 0.02778
            },
            {
                value: 0.1667,
                unitFrom: 'm3_min',
                unitTo: 'l_h',
                expectedFlow: 10000
            },
            {
                value: 0.1667,
                unitFrom: 'm3_min',
                unitTo: 'l_min',
                expectedFlow: 166.67
            },
            {
                value: 0.1667,
                unitFrom: 'm3_min',
                unitTo: 'l_s',
                expectedFlow: 2.778
            },
            // from m3_s
            {
                value: 0.02778,
                unitFrom: 'm3_s',
                unitTo: 'm3_h',
                expectedFlow: 10
            },
            {
                value: 0.02778,
                unitFrom: 'm3_s',
                unitTo: 'm3_min',
                expectedFlow: 0.1667
            },
            {
                value: 0.02778,
                unitFrom: 'm3_s',
                unitTo: 'l_h',
                expectedFlow: 10000
            },
            {
                value: 0.02778,
                unitFrom: 'm3_s',
                unitTo: 'l_min',
                expectedFlow: 166.67
            },
            {
                value: 0.02778,
                unitFrom: 'm3_s',
                unitTo: 'l_s',
                expectedFlow: 2.778
            },
            // from l_h
            {
                value: 10000,
                unitFrom: 'l_h',
                unitTo: 'm3_h',
                expectedFlow: 10
            },
            {
                value: 10000,
                unitFrom: 'l_h',
                unitTo: 'm3_min',
                expectedFlow: 0.1667
            },
            {
                value: 10000,
                unitFrom: 'l_h',
                unitTo: 'm3_s',
                expectedFlow: 0.02778
            },
            {
                value: 10000,
                unitFrom: 'l_h',
                unitTo: 'l_min',
                expectedFlow: 166.67
            },
            {
                value: 10000,
                unitFrom: 'l_h',
                unitTo: 'l_s',
                expectedFlow: 2.778
            },
            // from l_min
            {
                value: 166.67,
                unitFrom: 'l_min',
                unitTo: 'm3_h',
                expectedFlow: 10
            },
            {
                value: 166.67,
                unitFrom: 'l_min',
                unitTo: 'm3_min',
                expectedFlow: 0.1667
            },
            {
                value: 166.67,
                unitFrom: 'l_min',
                unitTo: 'm3_s',
                expectedFlow: 0.02778
            },
            {
                value: 166.67,
                unitFrom: 'l_min',
                unitTo: 'l_h',
                expectedFlow: 10000
            },
            {
                value: 166.67,
                unitFrom: 'l_min',
                unitTo: 'l_s',
                expectedFlow: 2.778
            },
            // from l_s
            {
                value: 2.778,
                unitFrom: 'l_s',
                unitTo: 'm3_h',
                expectedFlow: 10
            },
            {
                value: 2.778,
                unitFrom: 'l_s',
                unitTo: 'm3_min',
                expectedFlow: 0.1667
            },
            {
                value: 2.778,
                unitFrom: 'l_s',
                unitTo: 'm3_s',
                expectedFlow: 0.02778
            },
            {
                value: 2.778,
                unitFrom: 'l_s',
                unitTo: 'l_h',
                expectedFlow: 10000
            },
            {
                value: 2.778,
                unitFrom: 'l_s',
                unitTo: 'l_min',
                expectedFlow: 166.67
            },
            // with not valid value
            {
                value: 0,
                unitFrom: 'l_s',
                unitTo: 'l_min',
                expectedFlow: 0
            },
            {
                value: -123,
                unitFrom: 'l_s',
                unitTo: 'l_min',
                expectedFlow: 0
            },
            {
                value: 'asd',
                unitFrom: 'l_s',
                unitTo: 'l_min',
                expectedFlow: 0
            },
            // with not existing units
            {
                value: 2.778,
                unitFrom: 'l_s',
                unitTo: 'l_minute',
                expectedFlow: 0
            },
            {
                value: 2.778,
                unitFrom: 'l_second',
                unitTo: 'l_min',
                expectedFlow: 0
            },
        ];

        tests.forEach((test) => {
            it('with value=' + test.value + ', unitFrom=' + test.unitFrom + ' unitTo=' + test.unitTo, () => {
                expect(
                    FlowReference.convert(test.value, test.unitFrom, test.unitTo)
                ).to.equal(test.expectedFlow);
            });
        });
    });
});
