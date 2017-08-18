// libraries
import { expect } from 'chai';
// reducers
import { default as EntityReducer } from '../../../reducers/Mixins/Entity';
// events
import { default as EntityEvents } from '../../../events/Mixins/Entity';

const defaultState = {};

describe('Reducers.Mixins.Entity', () => {
    it('should return the initial state', () => {
        expect(
            EntityReducer('Retrofit.Project')(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle ENTITY_IDENTIFIER', () => {
        const path = 'Retrofit.Project';
        const identifier = 'S1z1FKtQ';
        expect(
            EntityReducer('Retrofit.Project')(defaultState, EntityEvents.creators.entityIdentifier(path, identifier))
        ).to.deep.equal({
            entityId: identifier
        });
    });
});
