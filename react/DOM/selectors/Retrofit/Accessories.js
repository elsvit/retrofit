// libraries
import _ from 'lodash';
import { createSelector } from '../../store/index';

/**
 * Reselect over Originals of current deviceMode
 */
export default () => {
    return createSelector(
        [
            state => state.User,
            state => state.Retrofit.Accessories
        ],
        (UserState, AccessoriesState) => ({
            UserState,
            originals: _.cloneDeep(
                _.map( // only data of
                    _.filter( // loaded one
                        _.pick( // first original
                            _.get(AccessoriesState, 'Originals.mapEntities', {}),
                            _.head(_.get(AccessoriesState, 'Originals.mapKeys', []))
                        ),
                        original => _.isObject(original.entityData)
                    ),
                    (original) => (original.entityData)
                )
            ),
            accessories: _.cloneDeep(
                _.map( // only data of
                    _.filter( // loaded ones
                        _.pick( // on current page
                            _.get(AccessoriesState, 'mapEntities', {}),
                            _.slice(
                                _.get(AccessoriesState, 'mapKeys', []),
                                (_.get(AccessoriesState, 'paginationPage', 1) - 1)
                                *
                                _.get(AccessoriesState, 'paginationPerPage', 10),
                                _.get(AccessoriesState, 'paginationPage', 1)
                                *
                                _.get(AccessoriesState, 'paginationPerPage', 10)
                            )
                        ),
                        accessory => _.isObject(accessory.entityData)
                    ),
                    (accessory) => (accessory.entityData)
                )
            )
        })
    );
};
