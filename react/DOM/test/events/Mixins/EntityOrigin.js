import { expect } from 'chai';
import { default as EntityOriginEvents } from './../../../events/Mixins/EntityOrigin';

describe('Events.Mixins.EntityOrigin', () => {
    describe('creators', () => {
        it('entityOriginFQN', () => {
            const path = 'Retrofit.Project.entityOrigin';
            const fqn = 'retrofit.project';
            const expectedAction = {
                type: EntityOriginEvents.types.ENTITY_ORIGIN_FQN,
                payload: { path, fqn }
            };
            expect(EntityOriginEvents.creators.entityOriginFQN(path, fqn)).to.deep.equal(expectedAction);
        });

        it('entityOriginID', () => {
            const path = 'Retrofit.Project.entityOrigin';
            const id = '574c082a76983';
            const expectedAction = {
                type: EntityOriginEvents.types.ENTITY_ORIGIN_ID,
                payload: { path, id }
            };
            expect(EntityOriginEvents.creators.entityOriginID(path, id)).to.deep.equal(expectedAction);
        });
    });
});
