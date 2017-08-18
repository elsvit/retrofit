// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import { aggregation } from '../../utils/index';
// actions
import { Data as DataActions } from '../../actions/index';
// models
import { default as StateNamespace } from '../StateNamespace';
import { default as Map } from '../Mixins/Map';
import { default as Pagination } from '../Mixins/Pagination';
import { default as LoadableMap } from '../Mixins/LoadableMap';
import { default as SameFQN } from '../Mixins/SameFQN';
import { default as Filterable } from '../Mixins/Filterable';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Class.
 * Business-logic & State reading/writing for "Originals" in Retrofit
 */
class Originals extends aggregation(
    StateNamespace,
    Map,
    Pagination,
    LoadableMap,
    SameFQN,
    Filterable
) {

    constructor(
        dispatch,
        modesModel,
        textModel,
        originalParametersModel,
        stateNamespace = 'Retrofit.Originals'
    ) {
        log.debug('Originals.constructor() started');
        super(dispatch, stateNamespace + '.' + modesModel.deviceMode);
        this.modesModel = modesModel;
        this.textModel = textModel;
        this.originalParametersModel = originalParametersModel;
        log.debug('Originals.constructor() finished stateNamespace: ', this.stateNamespace, ' mapFQN: ', this.mapFQN);
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
    get textModel() {
        return this._textModel;
    }

    /**
     * @param {Object} textModel
     */
    set textModel(textModel) {
        this._textModel = textModel;
    }

    /**
     * @returns {Object}
     */
    get originalParametersModel() {
        return this._originalParametersModel;
    }

    /**
     * @param {Object} originalParametersModel
     */
    set originalParametersModel(originalParametersModel) {
        this._originalParametersModel = originalParametersModel;
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Start to use certain internal namespace, according to current deviceMode
     */
    acceptDeviceMode() {
        return this.storeDispatch((dispatch, getState) => {
            this.stateNamespace = 'Retrofit.Originals.' + this.modesModel.deviceMode;
            this.mapFQN = 'retrofit.' + this.modesModel.deviceMode + '.original';
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * @param identifiers
     * @returns {Promise}
     */
    loadEntities(identifiers) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('Originals.loadEntities(); identifiers: ', identifiers);
            // create poor entities
            this.populateWithPoorEntities(identifiers);
            // load them
            return this.loadMap();
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform initial data load for container
     * @returns {Function} No result after dispatching
     */
    init() {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            log.debug('Originals.init()');
            log.debug('Originals.init() mode: ', this.modesModel.searchMode);
            this.acceptDeviceMode();
            // what is current search mode?
            switch (this.modesModel.searchMode) {
                case 'text':
                    log.debug('Originals.init() -> text : ', this.textModel.value);
                    return dispatch(
                        DataActions.search(this.mapFQN, this.textModel.value)
                    ).then(
                        (identifiers) => {
                            return this.loadEntities(identifiers);
                        }
                    ).then(
                        () => {
                            return dispatch(ApplicationEvents.creators.loadComponentFinished());
                        }
                    ).catch(
                        (errorBody) => {
                            // Throw event about load error
                            dispatch(
                                ApplicationEvents.creators.errorHappened(
                                    'Devices loading error',
                                    'Identifiers loading by search text for Originals failed',
                                    errorBody
                                )
                            );
                            return dispatch(ApplicationEvents.creators.loadComponentFinished());
                        }
                    );
                    break;
                case 'parameters':
                default:
                    log.debug('Originals.init() -> parameters : ', this.originalParametersModel.paramsWithValues);
                    let inputParameters = this.originalParametersModel.paramsWithValues;
                    log.debug('Originals.init() -> this.filterableParameters : ', this.filterableParameters);
                    if (
                        !_.isEqual(_.isEmpty(this.filterableParameters) || this.filterableParameters, inputParameters)
                    ) {
                        log.debug('Will set filtering parameters');
                        this.filterableParameters = inputParameters;
                    }
                    // Loading identifiers
                    return dispatch(
                        DataActions.identifiers(this.mapFQN, this.filterableParameters)
                    ).then(
                        (identifiers) => {
                            return this.loadEntities(identifiers);
                        }
                    ).then(
                        () => {
                            return dispatch(ApplicationEvents.creators.loadComponentFinished());
                        }
                    ).catch(
                        (errorBody) => {
                            // Throw event about load error
                            dispatch(
                                ApplicationEvents.creators.errorHappened(
                                    'Devices loading error',
                                    'Identifiers loading by parameters for Originals failed',
                                    errorBody
                                )
                            );
                            return dispatch(ApplicationEvents.creators.loadComponentFinished());
                        }
                    );
                    break;
            }
        });
    }

    reset() {
        return this.storeDispatch((dispatch, getState) => {
            this.stateNamespace = 'Retrofit.Originals.' + this.modesModel.deviceMode;
            this.paginationPage = 1;
        });
    }
}

export default Originals;
