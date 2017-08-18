// libraries
import uri from 'urijs';
// actions
import { default as AJAX } from '../actions/AJAX';

/**
 * Provider of data from remote storage by AJAX
 */
export default class {
    /**
     * Get some data about entities by parameters
     * @param {String} entityFQN
     * @param {Object} parameters
     * @returns {Function} Thunk. Promise after dispatching
     */
    static metadata(entityFQN, parameters) {
        entityFQN = entityFQN.toLowerCase();
        return AJAX.getJSON(
            uri('/data/' + entityFQN + '/metadata')
                .search(parameters)
                .toString()
                .replace(/=/g, '[]=')
        );
    }

    /**
     * Get identifiers of entities by parameters
     * @param {String} entityFQN
     * @param {Object} parameters
     * @returns {Function} Thunk. Promise after dispatching
     */
    static identifiers(entityFQN, parameters) {
        entityFQN = entityFQN.toLowerCase();
        return AJAX.getJSON(
            uri('/data/' + entityFQN + '/identifiers')
                .search(parameters)
                .toString()
                .replace(/=/g, '[]=')
        );
    }


    /**
     * Get entities from storage by provided exact value(s)
     * @param {String} entityFQN
     * @param {Object} parameters
     * @returns {Function} Thunk. Promise after dispatching
     */
    static filter(entityFQN, parameters) {
        entityFQN = entityFQN.toLowerCase();
        return AJAX.getJSON(
            uri('/data/' + entityFQN + '/filter')
                .search(parameters)
                .toString()
                .replace(/=/g, '[]='),
            true // dimmer
        );
    }

    /**
     * Get entities from storage by provided queryString for text search
     * @param {String} entityFQN
     * @param {String} queryString
     * @returns {Function} Thunk. Promise after dispatching
     */
    static search(entityFQN, queryString) {
        entityFQN = entityFQN.toLowerCase();
        return AJAX.getJSON(
            uri('/data/' + entityFQN + '/search/' + queryString).toString(),
            true // dimmer
        );
    }
}
