// libraries
import _ from 'lodash';
// events
import { Mixins as MixinsEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Map -> Filterable
 * How map with entities can be formed by parameters
 */
class Filterable {
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
    get isFilterable() {
        return true;
    }

    /**
     * Sign of Mixin functional
     * @param value {*}
     */
    set isFilterable(value) {
        // read-only
    }

    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get amount of entities, that will be produced by applying parameters filtering
     * @returns {Number}
     */
    get filterableAmount() {
        return this.storeDispatch((dispatch, getState) => {
            let amount = _.get(getState(), this.stateNamespace + '.' + 'filterableAmount', 0);
            return amount;
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set amount of entities, that will be produced by applying parameters filtering
     * @param {Number} amount
     */
    set filterableAmount(amount) {
        this.storeDispatch((dispatch, getState) => {
            dispatch(MixinsEvents.Filterable.creators.filterableAmount(this.stateNamespace, amount));
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get parameters, that are used to derive poor entities
     * @returns {Object}
     */
    get filterableParameters() {
        return this.storeDispatch((dispatch, getState) => {
            let parameters = _.get(getState(), this.stateNamespace + '.' + 'filterableParameters', {});
            return _.cloneDeep(parameters);
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set parameters, that are used to derive poor entities
     * @param {Object} parameters
     */
    set filterableParameters(parameters) {
        this.storeDispatch((dispatch, getState) => {
            parameters = _.cloneDeep(parameters);
            dispatch(MixinsEvents.Filterable.creators.filterableParameters(this.stateNamespace, parameters));
        });
    }
}

export default Filterable;
