// libraries
import _ from 'lodash';
import { createSelector } from '../../store/index';

/**
 * Reselect over Series
 */
export default () => {
    return createSelector(
        [
            state => state.ValveSizer.Series
        ],
        (SeriesState) => ({
            seriesList: _.cloneDeep(
                _.values(SeriesState.Result.list)
            )
        })
    );
};
