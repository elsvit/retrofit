import { expect } from 'chai';
import { default as MapEvents } from './../../../events/Mixins/Map';

describe('Events.Mixins.Map', () => {
    describe('creators', () => {
        const path = 'Retrofit.Products';
        const entities = {
            '4725': {
                entityId: '4725',
                entityOrigin: {
                    fqn: 'retrofit.air.product',
                    id: '4725'
                }
            },
            '4726': {
                entityId: '4726',
                entityOrigin: {
                    fqn: 'retrofit.air.product',
                    id: '4726'
                }
            }
        };

        it('mapEntities', () => {
            const expectedAction = {
                type: MapEvents.types.MAP_ENTITIES,
                payload: { path, entities }
            };
            expect(MapEvents.creators.mapEntities(path, entities)).to.deep.equal(expectedAction);
        });

        it('mapEntitiesAssign', () => {
            const expectedAction = {
                type: MapEvents.types.MAP_ENTITIES_ASSIGN,
                payload: { path, entities }
            };
            expect(MapEvents.creators.mapEntitiesAssign(path, entities)).to.deep.equal(expectedAction);
        });

        it('mapEntitiesUnset', () => {
            const path = 'Retrofit.ProjectItems';
            const keys = ['4725'];
            const expectedAction = {
                type: MapEvents.types.MAP_ENTITIES_UNSET,
                payload: { path, keys }
            };
            expect(MapEvents.creators.mapEntitiesUnset(path, keys)).to.deep.equal(expectedAction);
        });
    });
});
