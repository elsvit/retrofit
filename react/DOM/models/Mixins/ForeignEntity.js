// libraries
import _ from 'lodash';
// models
import { EntityOrigin } from './index';
// events
import { Mixins as MixinsEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Entity -> Foreign Entity
 * Entity, that has foreign storage origin
 */
class ForeignEntity {
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
    get isForeignEntity() {
        return true;
    }

    /**
     * Sign of Mixin functional
     * @param value {*}
     */
    set isForeignEntity(value) {
        // read-only
    }

    // State accessors

    /**
     * Get object with information about entity location in external storage from Redux state
     * @returns {Object}
     */
    get entityOrigin() {
        return new EntityOrigin(this.storeDispatch, this.stateNamespace + '.entityOrigin');
    }

    /**
     * @param {Object} origin
     */
    set entityOrigin(origin) {
        this.entityOrigin.fqn = origin.fqn;
        this.entityOrigin.id = origin.id;
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get object with payload information from Redux state
     * @returns {Object}
     */
    get entityData() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(_.get(getState(), this.stateNamespace + '.' + 'entityData', {}));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set object with payload information into Redux state
     * @param {Object} data
     */
    set entityData(data) {
        this.storeDispatch((dispatch, getState) => {
            dispatch(MixinsEvents.ForeignEntity.creators.foreignEntityData(this.stateNamespace, _.cloneDeep(data)));
        });
    }
}

export default ForeignEntity;
