// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as FlowPressureReducer } from './../../../reducers/ValveSizer/FlowPressure';
// events
import { default as FlowPressureEvents } from './../../../events/ValveSizer/FlowPressure';

describe('Reducers.ValveSizer.FlowPressure', () => {
    const defaultState = {
        flow: '',
        differential_pressure: '',
        kv: ''
    };

    it('should return the initial state', () => {
        expect(
            FlowPressureReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle set flow', () => {
        const value = '110';
        expect(
            FlowPressureReducer(defaultState, FlowPressureEvents.creators.flow(value))
        ).to.deep.equal( _.assign({}, defaultState, { flow: value }));
    });

    it('should handle set differential pressure', () => {
        const value = '100';
        expect(
            FlowPressureReducer(defaultState, FlowPressureEvents.creators.differential_pressure(value))
        ).to.deep.equal(_.assign({}, defaultState, { differential_pressure: value }));
    });

    it('should handle set kv', () => {
        const value = '10';
        expect(
            FlowPressureReducer(defaultState, FlowPressureEvents.creators.kv(value))
        ).to.deep.equal( _.assign({}, defaultState, { kv: value }));
    });
});
