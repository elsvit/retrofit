// libraries
import _ from 'lodash';
import { SmartPropertiesManager } from './Reference/index';
// models
import { default as StateNamespace } from '../StateNamespace';
// events
import { ValveSizer as ValveSizerEvents } from '../../events/index';

/**
 * Class.
 * Business-logic & State reading/writing for "Properties" in ValveSizer
 */
class Properties extends StateNamespace {
    /**
     * @param {Function} dispatch
     * @param {String} stateNamespace
     */
    constructor(dispatch, stateNamespace = 'ValveSizer.Properties') {
        super(dispatch, stateNamespace);
    }

    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get property object by name from state.
     * @param {String} name
     * @returns {Object}
     */
    property(name) {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.' + name
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get properties from state.
     * @returns {Function} Object after dispatching
     */
    properties() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get properties (with values), that have values
     * @returns {Object}
     */
    propertiesWithValues() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.mapValues(
                    _.pickBy(
                        _.get(
                            getState(),
                            this.stateNamespace
                        ),
                        (property) => (property && property.values && property.values.length > 0)
                    ),
                    (property) => (property && property.values)
                )
            );
        });
    }

    /**
     * Is pressure dependent application with 6 connections according checked options?
     * @returns {Object}
     */
    isSixConnectionFilter() {
        const propertiesWithValues = this.propertiesWithValues();
        if (!propertiesWithValues.hasOwnProperty('connections')
        ) {
            return false;
        }

        return (propertiesWithValues.connections.indexOf('6') >= 0);
    }

    // Business-logic

    /**
     * Set of property values.
     * @param {String} propertyName
     * @param {String} value
     * @param {Boolean} force
     * @returns {Promise}
     */
    selectPropertyValue(propertyName, value, force = false) {
        const propertiesData = this.properties();
        const propertiesManager = new SmartPropertiesManager(propertiesData);
        propertiesManager.selectPropertyValue(propertyName, value, force);
        const updatedPropertiesData = propertiesManager.getPropertiesData();
        this.update(updatedPropertiesData);
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Reset values of properties.
     * @returns {Promise}
     */
    update(filter) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Properties.creators.updateFilter(filter));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Reset values of properties.
     * @returns {Promise}
     */
    reset() {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Properties.creators.resetFilter());
        });
    }
}

export default Properties;
