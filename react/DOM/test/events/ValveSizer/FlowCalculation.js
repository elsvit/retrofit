import { expect } from 'chai';
import { default as FlowCalculationEvents } from './../../../events/ValveSizer/FlowCalculation';

describe('FlowCalculationEvents', () => {
    describe('creators', () => {
        it('power', () => {
            const value = '100.50';
            const expectedAction = {
                type: FlowCalculationEvents.types.POWER,
                payload: { value }
            };
            expect(FlowCalculationEvents.creators.power(value)).to.deep.equal(expectedAction);
        });

        it('temperature_difference', () => {
            const value = '35';
            const expectedAction = {
                type: FlowCalculationEvents.types.TEMPERATURE_DIFFERENCE,
                payload: { value }
            };
            expect(FlowCalculationEvents.creators.temperature_difference(value)).to.deep.equal(expectedAction);
        });

        it('flow', () => {
            const value = '55.123';
            const expectedAction = {
                type: FlowCalculationEvents.types.FLOW,
                payload: { value }
            };
            expect(FlowCalculationEvents.creators.flow(value)).to.deep.equal(expectedAction);
        });
    });
});
