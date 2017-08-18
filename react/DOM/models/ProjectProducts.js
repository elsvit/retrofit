import log from 'loglevel';
import StateNamespace from './StateNamespace';
import Map from './Mixins/Map';
import Pagination from './Mixins/Pagination';
import LoadableMap from './Mixins/LoadableMap';
import Filterable from './Mixins/Filterable';
import SameFQN from './Mixins/SameFQN';
import { aggregation } from '../utils/index';

import { Data as DataActions } from '../actions/index';

class ProjectProducts extends aggregation(
    StateNamespace,
    Map,
    Pagination,
    LoadableMap,
    Filterable,
    SameFQN
) {
    /**
     * @param {Function} dispatch
     * @param {String} stateNamespace
     */
    constructor(
        dispatch,
        stateNamespace = 'ProjectProducts'
    ) {
        log.debug('Project products.constructor() started');
        super(dispatch, stateNamespace);
        log.debug('Project products.constructor() finished, stateNamespace: ', this.stateNamespace);
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
                'ProjectProducts.loadEntities(); identifiers: ', identifiers, ' stateNamespace: ', this.stateNamespace
            );
            // create poor entities
            this.populateWithPoorEntities(identifiers);
            // load them
            return this.loadMap();
        });
    }

    fetchProducts(applicationName, ids, type) {
        return this.storeDispatch((dispatch, getState) => {
            this.mapFQN = `${applicationName.replace('-', '')}.${type}`;
            log.debug(`[ProjectProducts - fetchProducts. mapFQN: ${this.mapFQN}, ids: ${ids}`);
            const parameters = { id: ids };
            // Loading identifiers
            return dispatch(
                DataActions.identifiers(this.mapFQN, parameters)
            ).then(
                (identifiers) => {
                    log.debug(`[ProjectProducts - fetchProducts. `
                        + `Loading entities by identifiers: ${identifiers}`);
                    return this.loadEntities(identifiers);
                }
            );
        });
    }
}

export default ProjectProducts;
