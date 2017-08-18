// libraries
import _ from 'lodash';
import { createSelector } from '../../store/index';

/**
 * Reselect over Originals of current deviceMode
 */
export default () => {
    return createSelector(
        [
            state => state.Retrofit.Products,
            state => state.User
        ],
        (ProductsState, UserState) => ({
            Original: _.cloneDeep(
                _.get(ProductsState, 'Original.entityData', {})
            ),
            Products: _.cloneDeep(
                _.map( // only data of
                    _.filter( // loaded ones
                        _.pick( // on current page
                            _.get(ProductsState, 'mapEntities', {}),
                            _.slice(
                                _.get(ProductsState, 'mapKeys', []),
                                (_.get(ProductsState, 'paginationPage', 1) - 1)
                                *
                                _.get(ProductsState, 'paginationPerPage', 10),
                                _.get(ProductsState, 'paginationPage', 1)
                                *
                                _.get(ProductsState, 'paginationPerPage', 10)
                            )
                        ),
                        product => _.isObject(product.entityData)
                    ),
                    (product) => (product.entityData)
                )
            ),
            Parameters: ProductsState.Parameters,
            UserState
        })
    );
};
