// libraries
import { default as log } from 'loglevel';
import { aggregation } from '../../utils/index';
// models
import { default as StateNamespace } from '../StateNamespace';
import { default as Map } from '../Mixins/Map';
import { default as Pagination } from '../Mixins/Pagination';
import { default as LoadableMap } from '../Mixins/LoadableMap';
import { default as Filterable } from '../Mixins/Filterable';
import { default as SameFQN } from '../Mixins/SameFQN';

/**
 * Class.
 * Business-logic & State reading/writing for "Actuators" in Retrofit
 */
class Valves extends aggregation(
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
    constructor(dispatch, stateNamespace = 'ValveSizer.Valves') {
        log.debug('Valves.constructor() started');
        super(dispatch, stateNamespace);
        log.debug('Valves.constructor() finished, stateNamespace: ', this.stateNamespace);
    }

    // Business-logic

}

export default Valves;
