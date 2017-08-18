// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
// models
import { default as StateNamespace } from '../StateNamespace';
// events
import { Application as ApplicationEvents, Retrofit as RetrofitEvents } from '../../events/index';

/**
 * Abstract Class.
 * Business-logic & some state reading/writing for "Parameters" in Retrofit
 */
class AbstractParameters extends StateNamespace {
    /**
     * @param {Function} dispatch
     * @param {Object} modesModel
     * @param {Function} metadataProvider
     * @param {String} stateNamespace
     */
    constructor(dispatch, modesModel, metadataProvider, stateNamespace) {
        log.debug('AbstractParameters.constructor() started');
        super(dispatch, stateNamespace);
        this.modesModel = modesModel;
        this.metadataProvider = metadataProvider;
        log.debug('AbstractParameters.constructor() finished, stateNamespace: ', this.stateNamespace);
    }

    // Internal functional accessors

    /**
     * @returns {Object}
     */
    get modesModel() {
        return this._modesModel;
    }

    /**
     * @param {Object} modesModel
     */
    set modesModel(modesModel) {
        this._modesModel = modesModel;
    }

    /**
     * @returns {Object}
     */
    get metadataProvider() {
        return this._metadataProvider;
    }

    /**
     * @param {Object} metadataProvider
     */
    set metadataProvider(metadataProvider) {
        this._metadataProvider = metadataProvider;
    }

    // State aceessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Shortcut for device mode accessor
     * @returns {String}
     */
    get deviceMode() {
        return this.storeDispatch((dispatch, getState) => {
            return this.modesModel.deviceMode;
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get parameter object by name
     * @param {String} name
     * @returns {Object}
     */
    get parameters() {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('AbstractParameters.parameters();');
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.' + this.deviceMode + '.parameters'
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get parameter object by name
     * @param {String} name
     * @returns {Object}
     */
    parameter(name) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('AbstractParameters.parameter();');
            return _.get(this.parameters, name);
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get names of all params of current mode from state
     * @returns {String[]}
     */
    get names() {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('AbstractParameters.names();');
            return _.keys(
                _.get(
                    getState(),
                    this.stateNamespace + '.' + this.deviceMode + '.parameters'
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get amount of filtered records as result of applying parameters
     * @returns {Number}
     */
    get amount() {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('AbstractParameters.amount();');
            return _.get(
                getState(),
                this.stateNamespace + '.' + this.deviceMode + '.amount',
                0
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get params (with options) of current mode from state, that have options
     * @returns {Object}
     */
    get paramsWithOptions() {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('AbstractParameters.paramsWithOptions();');
            return _.cloneDeep(
                _.mapValues(
                    _.pickBy(
                        _.get(
                            getState(),
                            this.stateNamespace + '.' + this.deviceMode + '.parameters'
                        ),
                        (parameter) => (parameter.options.length > 0)
                    ),
                    (parameter) => (parameter.options)
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get params (with values) of current mode from state, that have values
     * @returns {Object}
     */
    get paramsWithValues() {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('AbstractParameters.paramsWithValues();');
            return _.cloneDeep(
                _.mapValues(
                    _.pickBy(
                        _.get(
                            getState(),
                            this.stateNamespace + '.' + this.deviceMode + '.parameters'
                        ),
                        (parameter) => (parameter && parameter.values && parameter.values.length > 0)
                    ),
                    (parameter) => (parameter && parameter.values)
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Performs metadata load & updates options of proper parameters under current device mode as well as amount
     * Call it after user has made some selections in parameters
     * @returns {Promise}
     */
    updateOptionsAndAmount() {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            log.debug('AbstractParameters.updateOptionsAndAmount();');
            // what parameters should participate in filtering
            const paramsWithValues = this.paramsWithValues;
            // metadata
            return dispatch(this.metadataProvider(
                this.modesModel,
                paramsWithValues
            )).then(
                (metadata) => {
                    // params, that have values, should not be filled
                    const paramsNamesForOptionsUpdate = _.difference(
                        this.names,
                        _.keys(paramsWithValues)
                    );

                    // making mapping with new options
                    let optionsMap = {};
                    for (let paramName of paramsNamesForOptionsUpdate) {
                        optionsMap[paramName] =
                            metadata.uniqueValues[paramName] ?
                                _.filter(metadata.uniqueValues[paramName], v => !_.isNull(v))
                                : [];
                    }
                    // throw event about new options
                    dispatch(
                        RetrofitEvents.Parameters.creators.newOptions(
                            this.stateNamespace + '.' + this.deviceMode,
                            optionsMap
                        )
                    );
                    // throw event about new amount in collection
                    return dispatch(
                        RetrofitEvents.Parameters.creators.newAmount(
                            this.stateNamespace + '.' + this.deviceMode,
                            metadata.amount
                        )
                    );
                }
            ).then(
                () => {
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Search error',
                        'Setting search parameter in form failed',
                        errorBody
                    ));
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Reset values of parameters
     * @returns {Promise}
     */
    reset() {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('AbstractParameters.reset();');
            // all set in current mode
            let paramsWithValues = this.paramsWithValues;

            // are for reset
            for (let name in paramsWithValues) {
                dispatch(
                    RetrofitEvents.Parameters.creators.newValues(
                        this.stateNamespace + '.' + this.deviceMode, name,
                        []
                    )
                );
            }

            // and that should be followed with options and amount update
            return this.updateOptionsAndAmount();
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform set of search parameter
     * @param {String} name
     * @param {String[]} values
     * @returns {Promise}
     */
    setValues(name, values) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('AbstractParameters.setValues();');
            // set value of parameter
            dispatch(
                RetrofitEvents.Parameters.creators.newValues(
                    this.stateNamespace + '.' + this.deviceMode,
                    name,
                    values
                )
            );

            // that should lead to options and amount update
            return this.updateOptionsAndAmount();
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Load initial options into parameters for current mode
     * @returns {Promise}
     */
    init() {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('AbstractParameters.init();');
            // update selectors and amount of records to show
            return this.updateOptionsAndAmount().then(() => (this.amount));
        });
    }
}

export default AbstractParameters;
