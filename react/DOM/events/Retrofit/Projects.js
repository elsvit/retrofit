// libraries
import _ from 'lodash';
// events
import { Map, Filterable } from '../Mixins/index';

/**
 * What events should happen for 'Retrofit Projects'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return _.assign(Map.types, Filterable.types);
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return _.assign(Map.creators, Filterable.creators);
    }
}
