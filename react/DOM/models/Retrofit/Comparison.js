// models
import log from 'loglevel';
import StateNamespace from '../StateNamespace';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Class.
 * Retrofit representation of acccessory devices collection
 */
class Comparison extends StateNamespace {
    /**
     * @param {Function} dispatch
     * @param {Object} modesModel
     * @param {String} stateNamespace
     */
    constructor(dispatch, modesModel, originalModel, productModel, stateNamespace = 'Retrofit.Comparison') {
        log.debug('Comparison.constructor() started');
        super(dispatch, stateNamespace);
        this.modesModel = modesModel;
        this.originalModel = originalModel;
        this.productModel = productModel;
        log.debug('Comparison.constructor() finished, stateNamespace: ', this.stateNamespace);
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

    /**
     * @returns {Object}
     */
    get productModel() {
        return this._productModel;
    }

    /**
     * @param {Object} productModel
     */
    set productModel(productModel) {
        this._productModel = productModel;
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform initial data load for container by route params.
     * @param {Object} parameters From route of react-router
     */
    init(parameters) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            // switching to provided mode
            this.modesModel.deviceMode = parameters.deviceMode;

            this.originalModel.stateNamespace = this.stateNamespace + '.Original';
            this.originalModel.entityOrigin.fqn = 'retrofit.' + this.modesModel.deviceMode + '.original';
            this.originalModel.entityOrigin.id = parameters.original;
            this.productModel.stateNamespace = this.stateNamespace + '.Product';
            this.productModel.entityOrigin.fqn = 'retrofit.' + this.modesModel.deviceMode + '.product';
            this.productModel.entityOrigin.id = parameters.product;
            // loading original device
            return this.originalModel.loadEntity().then(() => {
                // loading product device
                return this.productModel.loadEntity();
            }).then(() => {
                return dispatch(ApplicationEvents.creators.loadComponentFinished());
            });
        });
    }
}

export default Comparison;
