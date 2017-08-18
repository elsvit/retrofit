// libraries
import { default as log } from 'loglevel';
import { aggregation } from '../../utils/index';
// models
import { default as StateNamespace } from '../StateNamespace';
import { default as Entity } from '../Mixins/Entity';
import { default as ForeignEntity } from '../Mixins/ForeignEntity';
import { default as LoadableEntity } from '../Mixins/LoadableEntity';
/**
 * Class.
 * Business-logic & State reading/writing for "Original" in Retrofit
 */
class Original extends aggregation(
    StateNamespace,
    Entity,
    ForeignEntity,
    LoadableEntity
) {
    /**
     * @param {Function} dispatch
     * @param {String} stateNamespace
     */
    constructor(dispatch, stateNamespace) {
        super(dispatch, stateNamespace);
        this.clearNamespace();
        log.debug('Original.constructor() finished');
    }

}

export default Original;
