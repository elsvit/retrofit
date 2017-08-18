// libraries
import { expect } from 'chai';
// models
import { PressureReference } from './../../../../models/ValveSizer/Reference/index';

describe('Models.ValveSizer.Reference.PressureReference', () => {
    const
        units = [
            { name: 'bar', label: 'bar' },
            { name: 'k_pa', label: 'kPa' }
        ];

    describe('getUnits', () => {
        it('should return certain list', () => {
            expect(
                PressureReference.getUnits()
            ).to.deep.equal(units);
        });
    });

    describe('getLabel', () => {
        it('should return label if unit exists', () => {
            expect(
                PressureReference.getLabel('k_pa')
            ).to.equal('kPa');
        });

        it('should return empty if unit does not exist', () => {
            expect(
                PressureReference.getLabel('l_pascal')
            ).to.equal('');
        });
    });

    describe('convert', () => {
        let tests = [
            // from k_pa
            {
                value: 10.52,
                unitFrom: 'k_pa',
                unitTo: 'bar',
                expectedFlow: 0.1052
            },
            // from bar
            {
                value: 0.1052,
                unitFrom: 'bar',
                unitTo: 'k_pa',
                expectedFlow: 10.52
            },
            // with not valid value
            {
                value: 0,
                unitFrom: 'k_pa',
                unitTo: 'bar',
                expectedFlow: 0
            },
            {
                value: -123,
                unitFrom: 'k_pa',
                unitTo: 'bar',
                expectedFlow: 0
            },
            {
                value: 'asd',
                unitFrom: 'k_pa',
                unitTo: 'bar',
                expectedFlow: 0
            },
            // with not existing units
            {
                value: 10,
                unitFrom: 'k_pascal',
                unitTo: 'bar',
                expectedFlow: 0
            },
            {
                value: 10,
                unitFrom: 'k_pa',
                unitTo: 'barel',
                expectedFlow: 0
            },
        ];

        tests.forEach((test) => {
            it('with value=' + test.value + ', unitFrom=' + test.unitFrom + ' unitTo=' + test.unitTo, () => {
                expect(
                    PressureReference.convert(test.value, test.unitFrom, test.unitTo)
                ).to.equal(test.expectedFlow);
            });
        });
    });
});
