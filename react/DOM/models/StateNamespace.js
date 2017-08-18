// libraries
import _ from 'lodash';
// models
import { default as Thunks } from './Thunks';
// events
import { StateNamespace as StateNamespaceEvents } from '../events/index';

/**
 * Class.
 * Whatever inherits this should be in Redux state somewhere under some lodash path
 * For business-logic operations (state reading & writing) in this part of state copy of store.dispatch is used
 */
class StateNamespace extends Thunks {
    /**
     * @param {Function} dispatch
     * @param {String} namespace
     */
    constructor(dispatch, namespace) {
        super(dispatch);
        this.stateNamespace = namespace;
    }

    /**
     * Get value, representing lodash path in Redux state
     * @returns {String}
     */
    get stateNamespace() {
        return this._stateNamespace;
    }

    /**
     * Set value, representing lodash path in Redux state
     * @param {String} namespace
     */
    set stateNamespace(namespace) {
        this._stateNamespace = namespace;
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Clear all data in state namespace under control
     */
    clearNamespace() {
        this.storeDispatch((dispatch, getState) => {
            if (_.size(this.stateNamespace) > 0) {
                // throwing event
                dispatch(StateNamespaceEvents.creators.clear(this.stateNamespace));
            }
        });
    }
}

export default StateNamespace;
