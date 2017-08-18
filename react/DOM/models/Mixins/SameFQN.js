// libraries
import _ from 'lodash';
// events
import { Mixins as MixinsEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Map -> Loadable Map -> Same FQN
 * How map with foreign entities having same EntityOrigin.fqn should behave?
 */
class SameFQN {
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
    get isSameFQN() {
        return true;
    }

    /**
     * Sign of Mixin functional
     * @param value {*}
     */
    set isSameFQN(value) {
        // read-only
    }

    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get common FQN for EntityOrigin of Map's Entities
     * @returns {String}
     */
    get mapFQN() {
        return this.storeDispatch((dispatch, getState) => {
            return _.get(getState(), this.stateNamespace + '.' + 'mapFQN');
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set value, that will serve as FQN for all entities in map
     * @param {String} value
     */
    set mapFQN(value) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(MixinsEvents.SameFQN.creators.fqn(this.stateNamespace, value));
        });
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Populate map with with poor entities, using only identifiers (FQN will be taken from state)
     * @param {String[]} identifiers
     */
    populateWithPoorEntities(identifiers) {
        return this.storeDispatch((dispatch, getState) => {
            this.mapEntities = _.map(identifiers, id => ({
                entityId: id,
                entityOrigin: { fqn: this.mapFQN, id }
            }));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Populate map with poor entities and load them from external storage
     * @param identifiers
     * @returns {Promise}
     */
    loadMapByIdentifiers(identifiers) {
        return this.storeDispatch((dispatch, getState) => {
            // create poor entities
            this.populateWithPoorEntities(identifiers);
            // load them
            return this.loadMap();
        });
    }
}

export default SameFQN;
