import { expect } from 'chai';
import { default as FlowPressureEvents } from './../../../events/ValveSizer/FlowPressure';

describe('FlowPressureEvents', () => {
    describe('creators', () => {
        it('flow', () => {
            const value = '55.123';
            const expectedAction = {
                type: FlowPressureEvents.types.FLOW,
                payload: { value }
            };
            expect(FlowPressureEvents.creators.flow(value)).to.deep.equal(expectedAction);
        });

        it('differential_pressure', () => {
            const value = '99.50';
            const expectedAction = {
                type: FlowPressureEvents.types.DIFFERENTIAL_PRESSURE,
                payload: { value }
            };
            expect(FlowPressureEvents.creators.differential_pressure(value)).to.deep.equal(expectedAction);
        });

        it('kv', () => {
            const value = 35.456;
            const expectedAction = {
                type: FlowPressureEvents.types.KV,
                payload: { value }
            };
            expect(FlowPressureEvents.creators.kv(value)).to.deep.equal(expectedAction);
        });
    });
});
