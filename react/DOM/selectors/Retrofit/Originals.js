// libraries
import _ from 'lodash';
import { createSelector } from '../../store/index';

/**
 * Reselect over Originals of current deviceMode
 */
export default () => {
    return createSelector(
        [
            state => state.Retrofit.Modes,
            state => state.User,
            state => state.Retrofit.Originals
        ],
        (ModesState, UserState, OriginalsState) => ({
            ModesState,
            UserState,
            originals: _.cloneDeep(
                _.map( // only data of
                    _.filter( // loaded ones
                        _.pick( // on current page
                            _.get(OriginalsState, ModesState.device.current + '.mapEntities', {}),
                            _.slice(
                                _.get(OriginalsState, ModesState.device.current + '.mapKeys', []),
                                (_.get(OriginalsState, ModesState.device.current + '.paginationPage', 1) - 1)
                                *
                                _.get(OriginalsState, ModesState.device.current + '.paginationPerPage', 10),
                                _.get(OriginalsState, ModesState.device.current + '.paginationPage', 1)
                                *
                                _.get(OriginalsState, ModesState.device.current + '.paginationPerPage', 10)

                            )
                        ),
                        original => (original && _.isObject(original.entityData))
                    ),
                    (original) => (original && original.entityData)
                )
            )
        })
    );
};
