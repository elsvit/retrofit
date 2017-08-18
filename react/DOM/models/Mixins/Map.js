// libraries
import _ from 'lodash';
// events
import { Mixins as MixinsEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Map
 * Map with Entities by their identifiers
 */
class Map {
    /**
     * Aggregation constructor
     */
    initializer() {

    }

    // Mixin sign

    /**
     * Sign of Mixin functional
     * @returns {boolean}
     */
    get isMap() {
        return true;
    }

    /**
     * Sign of Mixin functional
     * @param value {*}
     */
    set isMap(value) {
        // read-only
    }

    // Helpers

    /**
     * Allow different shape of input entities
     * @param {Object|Array} entities
     * @returns {Object}
     */
    mapHelperInputEntities(entities) {
        entities = _.cloneDeep(entities);
        if (entities.isEntity) {
            // single entity
            entities = [entities];
        }
        if (_.isArray(entities)) {
            // plain array of entities
            entities = _.keyBy(entities, 'entityId');
        }
        return entities;
    }

    /**
     * Allow different shape of input keys
     * @param {String|String[]} keys
     * @returns {String[]}
     */
    mapHelperInputKeys(keys) {
        if (!_.isArray(keys)) {
            keys = [keys];
        }
        return keys;
    }

    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get entities from container
     * @returns {Object}
     */
    get mapEntities() {
        return this.storeDispatch((dispatch, getState) => {
            let entities = _.get(getState(), this.stateNamespace + '.' + 'mapEntities', {});
            return _.cloneDeep(entities);
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set entities in container
     * @param {Object} entities
     */
    set mapEntities(entities) {
        this.storeDispatch((dispatch, getState) => {
            entities = this.mapHelperInputEntities(entities);
            // Update entities in state
            dispatch(MixinsEvents.Map.creators.mapEntities(this.stateNamespace, entities));
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get keys of entities
     * @returns {String[]}
     */
    get mapKeys() {
        return this.storeDispatch((dispatch, getState) => {
            let keys = _.get(getState(), this.stateNamespace + '.' + 'mapKeys', []);
            return keys;
        });
    }

    /**
     * @param {String[]} value
     */
    set mapKeys(value) {
        // read-only
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Setup provided entity|entities in map's container
     * @param {Object|Array} entities
     */
    mapAssign(entities) {
        this.storeDispatch((dispatch, getState) => {
            entities = this.mapHelperInputEntities(entities);
            // Update entities in state
            dispatch(MixinsEvents.Map.creators.mapEntitiesAssign(this.stateNamespace, entities));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Unset entity|entities in map's container by provided key(s)
     * @param {String|String[]} keys
     */
    mapUnset(keys) {
        this.storeDispatch((dispatch, getState) => {
            keys = this.mapHelperInputKeys(keys);
            // Update entities in state
            dispatch(MixinsEvents.Map.creators.mapEntitiesUnset(this.stateNamespace, keys));
        });
    }
}

export default Map;
