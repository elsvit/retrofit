// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as MapReducer } from '../../../reducers/Mixins/Map';
// events
import { default as MapEvents } from '../../../events/Mixins/Map';

const defaultState = {};

describe('Reducers.Mixins.Map', () => {
    const stateNamespace = 'Retrofit.Products';
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

    it('should return the initial state', () => {
        expect(
            MapReducer(stateNamespace)(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle MAP_ENTITIES', () => {
        expect(
            MapReducer(stateNamespace)(defaultState, MapEvents.creators.mapEntities(path, entities))
        ).to.deep.equal({
            mapEntities: entities,
            mapKeys: _.keys(entities)
        });
    });

    it('should handle MAP_ENTITIES_ASSIGN', () => {
        expect(
            MapReducer(stateNamespace)(defaultState, MapEvents.creators.mapEntitiesAssign(path, entities))
        ).to.deep.equal({
            mapEntities: entities,
            mapKeys: _.keys(entities)
        });
    });

    it('should handle MAP_ENTITIES_UNSET', () => {
        const state = {
            mapEntities: entities,
            mapKeys: _.keys(entities)
        };
        const keys = ['4725'];
        expect(
            MapReducer(stateNamespace)(state, MapEvents.creators.mapEntitiesUnset(path, keys))
        ).to.deep.equal({
            mapEntities: {
                '4726': {
                    entityId: '4726',
                    entityOrigin: {
                        fqn: 'retrofit.air.product',
                        id: '4726'
                    }
                }
            },
            mapKeys: [
                '4726'
            ]
        });
    });
});
