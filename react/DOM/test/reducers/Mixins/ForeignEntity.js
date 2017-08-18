// libraries
import { expect } from 'chai';
// reducers
import ForeignEntityReducer from '../../../reducers/Mixins/ForeignEntity';
// events
import ForeignEntityEvents from '../../../events/Mixins/ForeignEntity';
import EntityOriginEvents from '../../../events/Mixins/EntityOrigin';

const defaultState = {};

describe('Reducers.Mixins.ForeignEntity', () => {
    const stateNamespace = 'Retrofit.Products.Original';

    it('should return the initial state', () => {
        expect(
            ForeignEntityReducer(stateNamespace)(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle FOREIGN_ENTITY_DATA', () => {
        const path = 'Retrofit.Products.Original';
        const data = {
            id: '298068',
            title: 'AM230',
            manufacturer: 'Belimo'
        };
        expect(
            ForeignEntityReducer(stateNamespace)(defaultState, ForeignEntityEvents.creators.foreignEntityData(path, data))
        ).to.deep.equal({
            entityData: data
        });
    });

    it('should handle ENTITY_ORIGIN_FQN', () => {
        const path = 'Retrofit.Products.Original.entityOrigin';
        const fqn = 'retrofit.air.original';
        expect(
            ForeignEntityReducer(stateNamespace)(defaultState, EntityOriginEvents.creators.entityOriginFQN(path, fqn))
        ).to.deep.equal({
            entityOrigin: {
                fqn: fqn
            }
        });
    });

    it('should handle ENTITY_ORIGIN_ID', () => {
        const path = 'Retrofit.Products.Original.entityOrigin';
        const id = '298068';
        expect(
            ForeignEntityReducer(stateNamespace)(defaultState, EntityOriginEvents.creators.entityOriginID(path, id))
        ).to.deep.equal({
            entityOrigin: {
                id: id
            }
        });
    });
});
