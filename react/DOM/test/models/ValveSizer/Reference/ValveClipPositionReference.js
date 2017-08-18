// libraries
import { expect } from 'chai';
// models
import { ValveClipPositionReference } from './../../../../models/ValveSizer/Reference/index';

describe('Models.ValveSizer.Reference.ValveClipPositionReference', () => {
    describe('getByTitleAndMaxFlow', () => {
        const tests = [
            // test different vMax values from minimum to maximum
            {
                title: 'C215QP-B',
                vMax: 0,
                expectedClipPosition: ''
            },
            {
                title: 'C215QP-B',
                vMax: 10,
                expectedClipPosition: '1'
            },
            {
                title: 'C215QP-B',
                vMax: 24,
                expectedClipPosition: '1'
            },
            {
                title: 'C215QP-B',
                vMax: 25,
                expectedClipPosition: '2'
            },
            {
                title: 'C215QP-B',
                vMax: 26,
                expectedClipPosition: '2'
            },
            {
                title: 'C215QP-B',
                vMax: 35,
                expectedClipPosition: '3'
            },
            {
                title: 'C215QP-B',
                vMax: 42.4,
                expectedClipPosition: '3'
            },
            {
                title: 'C215QP-B',
                vMax: 42.5,
                expectedClipPosition: '3+'
            },
            {
                title: 'C215QP-B',
                vMax: 42.6,
                expectedClipPosition: '3+'
            },
            {
                title: 'C215QP-B',
                vMax: 75,
                expectedClipPosition: '5-'
            },
            {
                title: 'C215QP-B',
                vMax: 120,
                expectedClipPosition: '6-'
            },
            {
                title: 'C215QP-B',
                vMax: 200,
                expectedClipPosition: '0'
            },
            {
                title: 'C215QP-B',
                vMax: 250,
                expectedClipPosition: '0'
            },
            // test patterns
            {
                title: 'C215QPT-B',
                vMax: 99,
                expectedClipPosition: '5+'
            },
            {
                title: 'C215QP-D',
                vMax: 230,
                expectedClipPosition: '5+'
            },
            {
                title: 'C215QPT-D',
                vMax: 230,
                expectedClipPosition: '5+'
            },
            {
                title: 'C220QP-F',
                vMax: 300,
                expectedClipPosition: '4'
            },
            {
                title: 'C220QPT-F',
                vMax: 300,
                expectedClipPosition: '4'
            },
            // test extreme arguments
            {
                title: 'C221',
                vMax: 300,
                expectedClipPosition: ''
            },
            {
                title: '',
                vMax: 300,
                expectedClipPosition: ''
            },
            {
                title: 'C220QPT-F',
                vMax: -1,
                expectedClipPosition: ''
            },
            {
                title: 'C220QPT-F',
                vMax: 'text',
                expectedClipPosition: ''
            }
        ];

        tests.forEach((test) => {
            it('with title=' + test.title + ', vMax=' + test.vMax, () => {
                expect(
                    ValveClipPositionReference.getByTitleAndMaxFlow(test, test.vMax)
                ).to.equal(test.expectedClipPosition);
            });
        });
    });

    describe('get min and max of vMax', () => {
        it('getMinOfVMax', () => {
            expect(
                ValveClipPositionReference.getMinOfVmax()
            ).to.equal(20);
        });

        it('getMaxOfVMax', () => {
            expect(
                ValveClipPositionReference.getMaxOfVmax()
            ).to.equal(5700);
        });
    });
});
