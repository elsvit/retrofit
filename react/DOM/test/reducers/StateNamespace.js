// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as StateNamespaceReducer } from '../../reducers/StateNamespace';
// events
import { default as StateNamespaceEvents } from '../../events/StateNamespace';

const defaultState = {};

describe('Reducers.StateNamespace', () => {
    it('should return the initial state', () => {
        expect(
            StateNamespaceReducer('ValveSizer')(undefined, {})
        ).to.deep.equal(defaultState);
    });

    describe('should handle CLEAR', () => {
        it('all state', () => {
            const state = {
                amount: 5,
                parameters: {
                    manufacturer: {
                        label:"Manufacturer",
                        options: ['Joventa']
                    }
                }
            };
            const path = 'Retrofit.Originals.Parameters.air';
            expect(
                StateNamespaceReducer('Retrofit.Originals.Parameters.air')(state, StateNamespaceEvents.creators.clear(path))
            ).to.deep.equal({});
        });

        it('part of state', () => {
            const state = {
                amount: 100,
                parameters: {
                    manufacturer: {
                        label:"Manufacturer",
                        options: ['Joventa']
                    }
                }
            };
            const path = 'Retrofit.Originals.Parameters.air.amount';
            expect(
                StateNamespaceReducer('Retrofit.Originals.Parameters.air')(state, StateNamespaceEvents.creators.clear(path))
            ).to.deep.equal({
                amount: {},
                parameters: {
                    manufacturer: {
                        label:"Manufacturer",
                        options: ['Joventa']
                    }
                }
            });
        });
    });
});
