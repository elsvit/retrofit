import { expect } from 'chai';
import { default as SameFQNEvents } from './../../../events/Mixins/SameFQN';

describe('Events.Mixins.SameFQN', () => {
    describe('creators', () => {
        const path = 'Retrofit.Originals.air';

        it('paginationPage', () => {
            const fqn = 'retrofit.air.original';
            const expectedAction = {
                type: SameFQNEvents.types.SAME_FQN,
                payload: { path, fqn }
            };
            expect(SameFQNEvents.creators.fqn(path, fqn)).to.deep.equal(expectedAction);
        });
    });
});
