import { expect } from 'chai';
import { default as EntityEvents } from './../../../events/Mixins/Entity';

describe('Events.Mixins.Entity', () => {
    describe('creators', () => {
        it('entityIdentifier', () => {
            const path = 'Retrofit.Project';
            const identifier = 'S1z1FKtQ';
            const expectedAction = {
                type: EntityEvents.types.ENTITY_IDENTIFIER,
                payload: { path, identifier }
            };
            expect(EntityEvents.creators.entityIdentifier(path, identifier)).to.deep.equal(expectedAction);
        });
    });
});
