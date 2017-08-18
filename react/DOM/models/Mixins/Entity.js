// libraries
import _ from 'lodash';
import shortid from 'shortid';
// events
import { Mixins as MixinsEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Entity
 * Entity in frontend application, that has representation in Redux state
 */
class Entity {
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
    get isEntity() {
        return true;
    }

    /**
     * Sign of Mixin functional
     * @param value {*}
     */
    set isEntity(value) {
        // read-only
    }

    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get indetifier of entity in front-end part of application
     * This is just a random string value, for allowing distinguishing one entity from another in one set
     * @returns {String}
     */
    get entityId() {
        return this.storeDispatch((dispatch, getState) => {
            let id = _.get(getState(), this.stateNamespace + '.' + 'entityId');
            if (_.isUndefined(id)) {
                // no value - generating it
                id = shortid.generate();
                // setting it
                this.entityId = id;
            }
            return id;
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set identifier of entity in front-end part of application
     * This is just a random string value, for allowing distinguishing one entity from another in one set
     * @param {String} id
     */
    set entityId(id) {
        this.storeDispatch((dispatch, getState) => {
            if (!shortid.isValid(id)) {
                // bad value - generating it
                id = shortid.generate();
            }
            // Updating identifier in state
            dispatch(MixinsEvents.Entity.creators.entityIdentifier(this.stateNamespace, id));
        });
    }
}

export default Entity;
