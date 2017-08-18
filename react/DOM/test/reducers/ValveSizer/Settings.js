// libraries
import { expect } from 'chai';
// reference
import { FlowReference, PressureReference } from './../../../models/ValveSizer/Reference/index';
// reducers
import { default as SettingsReducer } from './../../../reducers/ValveSizer/Settings';
// events
import { default as SettingsEvents } from './../../../events/ValveSizer/Settings';

describe('Reducers.ValveSizer.Settings', () => {
    const defaultState = {
        flow: {
            units: FlowReference.getUnits(),
            value: 'l_s'
        },
        pressure: {
            units: PressureReference.getUnits(),
            value: 'k_pa'
        }
    };

    it('should return the initial state', () => {
        expect(
            SettingsReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle set FLOW_UNIT', () => {
        expect(
            SettingsReducer(defaultState, SettingsEvents.creators.flow_unit('m3_h'))
        ).to.deep.equal(
            {
                flow: {
                    units: defaultState.flow.units,
                    value: 'm3_h'
                },
                pressure: defaultState.pressure
            }
        );
    });

    it('should handle set PRESSURE_UNIT', () => {
        expect(
            SettingsReducer(defaultState, SettingsEvents.creators.pressure_unit('bar'))
        ).to.deep.equal(
            {
                flow: defaultState.flow,
                pressure: {
                    units: defaultState.pressure.units,
                    value: 'bar'
                }
            }
        );
    });
});
