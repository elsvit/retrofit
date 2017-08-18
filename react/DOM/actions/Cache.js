import _ from 'lodash';
import { Cache as CacheEvents } from '../events/index';

/**
 * Thunks for Cache operations
 */
export default class {
    /**
     * Thunk.
     * State reader.
     * Check if Cache has certain key
     * @param {String} key
     * @returns {Function} Boolean after dispatching
     */
    static has(key) {
        return (dispatch, getState) => _.has(getState().Cache, key);
    }

    /**
     * Thunk.
     * State reader.
     * Get value from State by given key
     * @param {String[]} keys
     * @returns {Function} {*} after dispatching
     */
    static get(keys) {
        return (dispatch, getState) => _.cloneDeep(_.pick(getState().Cache, keys));
    }

    /**
     * Thunk.
     * State writer.
     * Set {key1: value1, ...} to State
     * @param {Object} map
     * @returns {Function} No result after dispatching
     */
    static set(map) {
        return (dispatch, getState) => dispatch(CacheEvents.creators.set(map));
    }

    /**
     * Thunk.
     * State writer.
     * Unset given key in State
     * @param {String[]} keys
     * @returns {Function} No result after dispatching
     */
    static unset(keys) {
        return (dispatch, getState) => dispatch(CacheEvents.creators.unset(keys));
    }
}
