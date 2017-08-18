import { expect } from 'chai';
import { default as ForeignEntityEvents } from './../../../events/Mixins/ForeignEntity';

describe('Events.Mixins.ForeignEntity', () => {
    describe('creators', () => {
        it('foreignEntityData', () => {
            const path = 'Retrofit.Products.Original';
            const data = {
                id: '298068',
                title: 'AM230',
                manufacturer: 'Belimo'
            };
            const expectedAction = {
                type: ForeignEntityEvents.types.FOREIGN_ENTITY_DATA,
                payload: { path, data }
            };
            expect(ForeignEntityEvents.creators.foreignEntityData(path, data)).to.deep.equal(expectedAction);
        });
    });
});
