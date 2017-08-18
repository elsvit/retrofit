// libraries
import _ from 'lodash';
// models
import { default as StateNamespace } from '../StateNamespace';
// events
import { ValveSizer as ValveSizerEvents } from '../../events/index';

/**
 * Class.
 * Business-logic & State reading/writing for "Settings" in ValveSizer
 */
class Settings extends StateNamespace {
    /**
     * @param {Function} dispatch
     * @param {Object} userModel
     * @param {String} stateNamespace
     */
    constructor(dispatch, userModel, stateNamespace = 'ValveSizer.Settings') {
        super(dispatch, stateNamespace);
        this.userModel = userModel;
    }

    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get flow units from state.
     * @returns {Object}
     */
    get flowUnits() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    _.join([this.stateNamespace, 'flow', 'units'], '.')
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get pressure units from state.
     * @returns {Object}
     */
    get pressureUnits() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    _.join([this.stateNamespace, 'pressure', 'units'], '.')
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get flow unit value from state.
     * @returns {String}
     */
    get flowUnit() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    _.join([this.stateNamespace, 'flow', 'value'], '.')
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get pressure unit value from state.
     * @returns {String}
     */
    get pressureUnit() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    _.join([this.stateNamespace, 'pressure', 'value'], '.')
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get of user locale.
     * @return {String} locale
     */
    get locale() {
        return this.storeDispatch((dispatch, getState) => {
            return this.userModel.locale;
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * All locales.
     * @return {Object}
     */
    get locales() {
        return this.storeDispatch((dispatch, getState) => {
            return this.userModel.locales;
        });
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of user locale.
     * @param {String} locale
     */
    set locale(locale) {
        return this.storeDispatch((dispatch, getState) => {
            this.userModel.locale = locale;
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of flow unit.
     * @param {String} value
     */
    set flowUnit(value) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Settings.creators.flow_unit(value));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of pressure unit.
     * @param {String} value
     */
    set pressureUnit(value) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Settings.creators.pressure_unit(value));
        });
    }
}

export default Settings;
