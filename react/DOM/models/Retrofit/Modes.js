// libraries
import _ from 'lodash';
// models
import { StateNamespace } from '../index';
// events
import { Retrofit as RetrofitEvents } from '../../events/index';

/**
 * Class.
 * Business-logic & State reading/writing for "Modes" in Retrofit
 */
class Modes extends StateNamespace {
    /**
     * @param {Function} dispatch
     * @param {String} stateNamespace
     */
    constructor(dispatch, stateNamespace = 'Retrofit.Modes') {
        super(dispatch, stateNamespace);
    }

    /**
     * Possible device modes
     * @returns {String[]}
     */
    get deviceModes() {
        return ['air', 'water'];
    }

    /**
     * Possible search modes
     * @returns {String[]}
     */
    get searchModes() {
        return ['text', 'parameters'];
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get current value of device mode
     * @returns {String}
     */
    get deviceMode() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.device.current'
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform switch of current device mode
     * @param {String} mode
     */
    set deviceMode(mode) {
        return this.storeDispatch((dispatch, getState) => {
            if (_.includes(this.deviceModes, mode)) {
                if (mode !== this.deviceMode) {
                    // throwing event
                    dispatch(RetrofitEvents.Modes.creators.deviceChanged(mode));
                }
            }
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get current value of search mode
     * @returns {String}
     */
    get searchMode() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.search.last'
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform switch of current search mode
     * @param {String} mode
     */
    set searchMode(mode) {
        return this.storeDispatch((dispatch, getState) => {
            if (_.includes(this.searchModes, mode)) {
                if (mode !== this.searchMode) {
                    // throwing event
                    dispatch(RetrofitEvents.Modes.creators.searchChanged(mode));
                }
            }
        });
    }
}

export default Modes;
