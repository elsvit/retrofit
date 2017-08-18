import { expect } from 'chai';
import { default as SettingsEvents } from './../../../events/ValveSizer/Settings';

describe('SettingsEvents', () => {
    describe('creators', () => {
        it('flow_unit', () => {
            const value = 'm3_h';
            const expectedAction = {
                type: SettingsEvents.types.FLOW_UNIT,
                payload: { value }
            };
            expect(SettingsEvents.creators.flow_unit(value)).to.deep.equal(expectedAction);
        });

        it('pressure_unit', () => {
            const value = 'bar';
            const expectedAction = {
                type: SettingsEvents.types.PRESSURE_UNIT,
                payload: { value }
            };
            expect(SettingsEvents.creators.pressure_unit(value)).to.deep.equal(expectedAction);
        });
    });
});
