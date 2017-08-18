// libraries
import _ from 'lodash';
// events
import { Mixins as MixinsEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Map -> Pagination
 * How map with entities can be split into pages?
 */
class Pagination {
    /**
     * Aggregation constructor
     */
    initializer() {

    }

    // Mixin sign

    /**
     * Sign of Mixin functional
     * @returns {boolean}
     */
    get isPagination() {
        return true;
    }

    /**
     * Sign of Mixin functional
     * @param value {*}
     */
    set isPagination(value) {
        // read-only
    }

    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get amount of entities per page
     * @returns {Number}
     */
    get paginationPerPage() {
        return this.storeDispatch((dispatch, getState) => {
            let perPage = _.get(getState(), this.stateNamespace + '.' + 'paginationPerPage', 10);
            return perPage;
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set amount of entities per page
     * @param {Number} perPage
     */
    set paginationPerPage(perPage) {
        this.storeDispatch((dispatch, getState) => {
            // Update state
            dispatch(MixinsEvents.Pagination.creators.paginationPerPage(this.stateNamespace, perPage));
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get current page number
     * @returns {Number}
     */
    get paginationPage() {
        return this.storeDispatch((dispatch, getState) => {
            let page = _.get(getState(), this.stateNamespace + '.' + 'paginationPage', 1);
            return page;
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set current page number
     * @param {Number} page
     */
    set paginationPage(page) {
        return this.storeDispatch((dispatch, getState) => {
            this.setPaginationPage(page);
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set current page number
     * @param {Number} page
     * @return {Promise}
     */
    setPaginationPage(page) {
        return this.storeDispatch((dispatch, getState) => {
            if (page <= this.paginationPages) {
                // Update state
                dispatch(MixinsEvents.Pagination.creators.paginationPage(this.stateNamespace, page));
                if (this.isLoadableMap) {
                    // load entities on current page if this is a loadable map
                    return this.loadMap();
                }
            }
            return Promise.resolve();
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Amount of pages with entitites
     * @returns {Number}
     */
    get paginationPages() {
        return this.storeDispatch((dispatch, getState) => {
            let rawAmount = Math.ceil(this.mapKeys.length / this.paginationPerPage);
            return (rawAmount === 0) ? 1 : rawAmount;
        });
    }

    /**
     * @param {Number} value
     */
    set paginationPages(value) {
        // read-only
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get only entities from container, that reside on current page
     * @returns {Object|Array}
     * @override Map.mapEntities getter
     */
    get mapEntities() {
        return this.storeDispatch((dispatch, getState) => {
            let allEntities = _.get(getState(), this.stateNamespace + '.' + 'mapEntities', {});
            let pageNumber = this.paginationPage;
            let perPage = this.paginationPerPage;
            let pageEntitiesKeys = _.slice(
                this.mapKeys,
                (pageNumber - 1) * perPage,
                ((pageNumber - 1) * perPage) + perPage
            );
            return _.cloneDeep(_.pick(allEntities, pageEntitiesKeys));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set entities (All) in container
     * @param {Object|Array} entities
     * @override Map.mapEntities setter
     */
    set mapEntities(entities) {
        this.storeDispatch((dispatch, getState) => {
            entities = this.mapHelperInputEntities(entities);
            // Update entities in state
            dispatch(MixinsEvents.Map.creators.mapEntities(this.stateNamespace, entities));
            // Check page number
            let totalPages = this.paginationPages;
            let currentPage = this.paginationPage;
            // if current page now out of range
            if (currentPage > totalPages) {
                // Update page number in state to last one
                this.paginationPage = totalPages;
            }
        });
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Unset entity|entities in map's container by provided key(s)
     * @param {String|String[]} keys
     * @override Map.mapUnset
     */
    mapUnset(keys) {
        this.storeDispatch((dispatch, getState) => {
            keys = this.mapHelperInputKeys(keys);
            // Update entities in state
            dispatch(MixinsEvents.Map.creators.mapEntitiesUnset(this.stateNamespace, keys));
            // Check page number
            let totalPages = this.paginationPages;
            let currentPage = this.paginationPage;
            // if current page now out of range
            if (currentPage > totalPages) {
                // Update page number in state to last one
                this.paginationPage = totalPages;
            }
        });
    }
}

export default Pagination;
