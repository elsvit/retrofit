// libraries
import { default as log } from 'loglevel';
import { aggregation } from '../../utils/index';
// models
import { default as StateNamespace } from '../StateNamespace';
import { default as Entity } from '../Mixins/Entity';
import { default as ForeignEntity } from '../Mixins/ForeignEntity';
import { default as LoadableEntity } from '../Mixins/LoadableEntity';
import { default as Filterable } from '../Mixins/Filterable';

/**
 * Class.
 * Business-logic & State reading/writing for "Product" in Retrofit
 */
class Product extends aggregation(
    StateNamespace,
    Entity,
    ForeignEntity,
    LoadableEntity,
    Filterable
) {
    /**
     * @param {Function} dispatch
     * @param {String} stateNamespace
     */
    constructor(dispatch, stateNamespace) {
        super(dispatch, stateNamespace);
        this.clearNamespace();
        log.debug('Product.constructor() finished');
    }
}

export default Product;
