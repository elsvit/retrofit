// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
// models
import { AbstractParameters, Products } from '../index';
// actions
import { Data as DataActions } from '../../../actions/index';
// events
import { Application as ApplicationEvents, Retrofit as RetrofitEvents } from '../../../events/index';

/**
 * Class.
 * Business-logic & State reading/writing for "Products" filtering in Retrofit
 */
class Parameters extends AbstractParameters {
    /**
     * @param {Function} dispatch
     * @param {Object} modesModel
     * @param {Object} originalModel
     * @param {String} stateNamespace
     */
    constructor(
        dispatch,
        modesModel,
        originalModel,
        stateNamespace = 'Retrofit.Products.Parameters'
    ) {
        super(
            dispatch,
            modesModel,
            // Thunk creator. Resulting thunk should know how to load metadata for this object
            (innerModesModel, parameters) => innerDispatch => innerDispatch(
                DataActions.metadata(
                    'retrofit.' + innerModesModel.deviceMode + '.product',
                    parameters
                )
            ),
            stateNamespace
        );
        this.originalModel = originalModel;
    }

    // Internal functional accessors

    /**
     * @returns {Object}
     */
    get originalModel() {
        return this._originalModel;
    }

    /**
     * @param {Object} originalModel
     */
    set originalModel(originalModel) {
        this._originalModel = originalModel;
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Reset values of parameters
     * @returns {Promise}
     */
    reset() {
        this.storeDispatch((dispatch, getState) => {
            // all set in current mode
            let paramsWithValues = _.omit(this.paramsWithValues, ['id']);

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
     * Load parameters for filtering results of Originals by react-router parameters
     * @param {Object} parameters
     * @return {Promise}
     */
    init(parameters) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            log.debug('Products.Parameters.init();');
            // switching device mode to provided
            this.modesModel.deviceMode = parameters.deviceMode;
            // orignal device model
            this.originalModel.stateNamespace = 'Retrofit.Products.Original';
            this.originalModel.entityOrigin.fqn = 'retrofit.' + this.modesModel.deviceMode + '.original';
            this.originalModel.entityOrigin.id = parameters.original;
            log.debug('Products.Parameters.init(); will load original model');
            // load original device with model
            return this.originalModel.loadEntity(
            ).then(
                (originalEntity) => {
                    log.debug('Products.Parameters.init(); original after loading ', originalEntity);
                    if (['rotary valve', 'drehventil']
                            .indexOf(_.lowerCase(originalEntity.entityData.valve_type)) >= 0) {
                        // origin device is a 'rotary valve' device
                        if (!_.includes(this.names, 'torque')) {
                            // there is no sign of presence of specific additional parameters - adding them
                            log.debug('Products.Parameters.init(); Will add "rotary valve" parameters');
                            dispatch(
                                RetrofitEvents.Parameters.creators.parameters(
                                    this.stateNamespace + '.' + this.deviceMode,
                                    _.assign(
                                        this.parameters,
                                        {
                                            torque: {
                                                label: 'Torque',
                                                values: [],
                                                options: []
                                            },
                                            running_time: {
                                                label: 'Running Time',
                                                values: [],
                                                options: []
                                            }
                                        }
                                    )
                                )
                            );
                        }
                        // additional parameters already there - do nothing
                    } else {
                        // origin device is NOT a 'rotary valve' device - removing specific additional parameters
                        log.debug('Products.Parameters.init(); Will remove "rotary valve" parameters');
                        dispatch(
                            RetrofitEvents.Parameters.creators.parameters(
                                this.stateNamespace + '.' + this.deviceMode,
                                _.omit(this.parameters, ['torque', 'running_time'])
                            )
                        );
                    }

                    if (['globe valve', 'hubventil'].indexOf(_.lowerCase(originalEntity.entityData.valve_type)) >= 0) {
                        // if origin device is a 'globe valve' device
                        if (!_.includes(this.names, 'actuating_force')) {
                            // there is no sign of presence of specific additional parameters - adding them
                            log.debug('Products.Parameters.init(); Will add "globe valve" parameters');
                            dispatch(
                                RetrofitEvents.Parameters.creators.parameters(
                                    this.stateNamespace + '.' + this.deviceMode,
                                    _.assign(
                                        this.parameters,
                                        {
                                            actuating_force: {
                                                label: 'Actuating Force',
                                                values: [],
                                                options: []
                                            },
                                            actuating_time: {
                                                label: 'Actuating Time',
                                                values: [],
                                                options: []
                                            }
                                        }
                                    )
                                )
                            );
                        }
                        // additional parameters already there - do nothing
                    } else {
                        // origin device is NOT a 'globe valve' device - removing specific additional parameters
                        log.debug('Products.Parameters.init(); Will remove "globe valve" parameters');
                        dispatch(
                            RetrofitEvents.Parameters.creators.parameters(
                                this.stateNamespace + '.' + this.deviceMode,
                                _.omit(this.parameters, ['actuating_force', 'actuating_time'])
                            )
                        );
                    }

                    // extract identifiers of products from original's data
                    const identifiers = Products.entityProductIdentifiers(originalEntity.entityData);
                    log.debug('Products.Parameters.init(); identifiers of products ', identifiers);
                    // identifiers as options for search parameter
                    dispatch(
                        RetrofitEvents.Parameters.creators.parameters(
                            this.stateNamespace + '.' + this.deviceMode,
                            _.assign(
                                this.parameters,
                                {
                                    id: {
                                        // no label = no display
                                        values: identifiers,
                                        options: identifiers
                                    }
                                }
                            )
                        )
                    );
                    // Perform metadata load for the Parameters, because selections were made
                    return this.updateOptionsAndAmount().then(() => (this.amount));
                }
            ).then(() => {
                return dispatch(ApplicationEvents.creators.loadComponentFinished());
            }).catch(
                (errorBody) => {
                    // Throw event about load error
                    dispatch(
                        ApplicationEvents.creators.errorHappened(
                            'Error with Products Parameters',
                            'Fetching original device for product needs failed',
                            errorBody
                        )
                    );
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }
            );
        });
    }
}

export default Parameters;
