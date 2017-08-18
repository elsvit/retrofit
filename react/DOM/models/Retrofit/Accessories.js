// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import { aggregation } from '../../utils/index';
// models
import { default as StateNamespace } from '../StateNamespace';
import { default as Map } from '../Mixins/Map';
import { default as Pagination } from '../Mixins/Pagination';
import { default as LoadableMap } from '../Mixins/LoadableMap';
import { default as SameFQN } from '../Mixins/SameFQN';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Class.
 * Retrofit representation of acccessory devices collection
 */
class Accessories extends aggregation(
    StateNamespace,
    Map,
    Pagination,
    LoadableMap,
    SameFQN
) {
    /**
     * @param {Function} dispatch
     * @param {Object} modesModel
     * @param {Object} originalModel
     * @param {String} stateNamespace
     */
    constructor(dispatch, modesModel, originalModel, stateNamespace = 'Retrofit.Accessories') {
        /**/log.debug('Accessories.constructor() started');/**/
        super(dispatch, stateNamespace);
        this.modesModel = modesModel;
        this.originalModel = originalModel;
        /**/log.debug('Accessories.constructor() finished, stateNamespace: ', this.stateNamespace);/**/
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
     * Helper. Extract identifiers of "Accessory" from "Original", that belongs to "Product" with given identifier
     * @param {Object} original
     * @param {String} productId
     * @return {String[]}
     */
    entityAccessoryIdentifiers(original, productId) {
        let identifiers = [];
        for (let replacement of _.get(original, 'replacements', [])) {
            if ((productId === replacement.product) && _.isArray(replacement.accessories)) {
                identifiers = replacement.accessories;
                break;
            }
        }
        return identifiers;
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * @param identifiers
     * @returns {Promise}
     */
    loadEntities(identifiers) {
        return this.storeDispatch((dispatch, getState) => {
            // create poor entities
            this.populateWithPoorEntities(identifiers);
            // load them
            return this.loadMap();
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform initial data load for container by route params.
     * @param {Object} parameters From route of react-router
     */
    init(parameters) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            log.debug('Accessories.init');
            this.mapEntities = [];
            // switching mode to passed one
            this.modesModel.deviceMode = parameters.deviceMode;
            // now we dealing with accessories from one source
            this.mapFQN = 'retrofit.' + this.modesModel.deviceMode + '.accessory';
            this.originalModel.stateNamespace = this.stateNamespace + '.Original';
            // no previous things
            this.originalModel.clearNamespace();
            this.originalModel.entityOrigin.fqn = 'retrofit.' + this.modesModel.deviceMode + '.original';
            this.originalModel.entityOrigin.id = parameters.original;
            // load original device with model
            return this.originalModel.loadEntity(
            ).then(
                (original) => {
                    /**/log.debug('Accessories.init(); original after loading ', original);/**/
                    // extract identifiers of accessories from original's data
                    let identifiers = this.entityAccessoryIdentifiers(original.entityData, parameters.product);
                    /**/
                    log.debug('Accessories.init(); accessory identifiers after originals loading ', identifiers);
                    /**/
                    // load accessories
                    return (_.size(identifiers) > 0 ? this.loadEntities(identifiers) : Promise.resolve())
                        .then(() => dispatch(ApplicationEvents.creators.loadComponentFinished()))
                }
            ).catch(
                (errorBody) => {
                    // Throw event about load error
                    dispatch(
                        ApplicationEvents.creators.errorHappened(
                            'Error with Accessories',
                            'Fetching original device for accessories needs failed',
                            errorBody
                        )
                    );
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }
            );
        });
    }
}

export default Accessories;
