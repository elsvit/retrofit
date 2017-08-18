// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as FlowCalculationReducer } from './../../../reducers/ValveSizer/FlowCalculation';
// events
import { default as FlowCalculationEvents } from './../../../events/ValveSizer/FlowCalculation';

describe('Reducers.ValveSizer.FlowCalculation', () => {
    const defaultState = {
        power: '',
        temperature_difference: '',
        flow: ''
    };

    it('should return the initial state', () => {
        expect(
            FlowCalculationReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle set power', () => {
        const value = '100';
        expect(
            FlowCalculationReducer(defaultState, FlowCalculationEvents.creators.power(value))
        ).to.deep.equal(_.assign({}, defaultState, { power: value }));
    });

    it('should handle set temperature difference', () => {
        const value = '10';
        expect(
            FlowCalculationReducer(defaultState, FlowCalculationEvents.creators.temperature_difference(value))
        ).to.deep.equal( _.assign({}, defaultState, { temperature_difference: value }));
    });

    it('should handle set flow', () => {
        const value = '110';
        expect(
            FlowCalculationReducer(defaultState, FlowCalculationEvents.creators.flow(value))
        ).to.deep.equal( _.assign({}, defaultState, { flow: value }));
    });
});
