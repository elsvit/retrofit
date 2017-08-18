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
import { default as Filterable } from '../Mixins/Filterable';
import { default as SameFQN } from '../Mixins/SameFQN';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Class.
 * Business-logic & State reading/writing for "Products" in Retrofit
 */
class Products extends aggregation(
    StateNamespace,
    Map,
    Pagination,
    LoadableMap,
    Filterable,
    SameFQN
) {
    /**
     * @param {Function} dispatch
     * @param {Object} modesModel
     * @param {Object} productsParametersModel
     * @param {Object} accessoriesModel
     * @param {String} stateNamespace
     */
    constructor(
        dispatch,
        modesModel,
        productsParametersModel,
        accessoriesModel,
        stateNamespace = 'Retrofit.Products'
    ) {
        log.debug('Products.constructor() started');
        super(dispatch, stateNamespace);

        this.modesModel = modesModel;
        this.productsParametersModel = productsParametersModel;
        this.accessoriesModel = accessoriesModel;
        log.debug('Products.constructor() finished, stateNamespace: ', this.stateNamespace);
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
    get productsParametersModel() {
        return this._productsParametersModel;
    }

    /**
     * @param {Object} productsParametersModel
     */
    set productsParametersModel(productsParametersModel) {
        this._productsParametersModel = productsParametersModel;
    }

    /**
     * @returns {Object}
     */
    get accessoriesModel() {
        return this._accessoriesModel;
    }

    /**
     * @param {Object} accessoriesModel
     */
    set accessoriesModel(accessoriesModel) {
        this._accessoriesModel = accessoriesModel;
    }

    // Business-logic

    /**
     * Helper. Extract identifiers of "Product" from "Original"
     * @param {Object} original
     */
    static entityProductIdentifiers(original) {
        let identifiers = [];
        _.get(original, 'replacements', []).forEach((replacement) => { identifiers.push(replacement.product); });
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
            log.debug(
                'Products.loadEntities(); identifiers: ', identifiers, ' stateNamespace: ', this.stateNamespace
            );
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
     * @returns {Promise}
     */
    init(parameters) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            log.debug('Products.init();');
            // switching mode to passed one
            this.modesModel.deviceMode = parameters.deviceMode;
            // now we dealing with products from one source
            this.mapFQN = 'retrofit.' + this.modesModel.deviceMode + '.product';
            // let's setup filtering parameters for products
            // loading filtering parameters by react-router's parameters
            return this.productsParametersModel.init(parameters).then(() => {
                log.debug('Products.init() -> parameters : ', this.productsParametersModel.paramsWithValues);
                const inputParameters = this.productsParametersModel.paramsWithValues;
                log.debug('Products.init(). Current filterableParameters : ', this.filterableParameters);
                log.debug('Products.init(). New filtering parameters: ', inputParameters);
                this.filterableParameters = inputParameters;
                // if there is no parameters for filtering products - means original device has no replacements
                if (_.isEmpty(inputParameters)) {
                    this.loadEntities([]);
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }

                // Loading identifiers
                return dispatch(
                    DataActions.identifiers(this.mapFQN, inputParameters)
                ).then(
                    (identifiers) => {
                        return this.loadEntities(identifiers);
                    }
                ).then(() => {
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }).catch(
                    (errorBody) => {
                        // Throw event about load error
                        dispatch(
                            ApplicationEvents.creators.errorHappened(
                                'Products loading error',
                                'Identifiers loading by parameters for Products failed',
                                errorBody
                            )
                        );
                        return dispatch(ApplicationEvents.creators.loadComponentFinished());
                    }
                );
            });
        });
    }

    /**
     * Helper.
     * Forming data for presentational component
     * @param {Object} OriginalData Original's entityData
     * @param {Array} ProductsData entityData of Products
     * @returns {Array}
     */
    originReplacements(OriginalData, ProductsData) {
        let replacements = [];
        log.debug('Products.replacements(), original: ', OriginalData);
        if (_.isEmpty(OriginalData)) {
            return replacements;
        }

        log.debug('Products.replacements(), products: ', ProductsData);
        ProductsData.forEach((product) => {
            let note = null;
            if (OriginalData.replacements) {
              OriginalData.replacements.forEach((originalReplacement) => {
                  if (originalReplacement.note && (originalReplacement.product === product.id)) {
                      note = originalReplacement.note;
                  }
              });
            }

            replacements.push({
                product,
                accessories: this.accessoriesModel.entityAccessoryIdentifiers(
                    OriginalData,
                    product.id
                ),
                note: note
            });
        });
        return replacements;
    }
}

export default Products;
