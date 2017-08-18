// libraries
import _ from 'lodash';
import { createSelector } from '../store/index';

/**
 * Simple selector for certain paths of Redux state
 * @param {Object} stateMap {name1: path1, name2: path2, ...}
 */
export default (stateMap) => {
    stateMap = _.cloneDeep(stateMap);
    let keys = [];
    let inputSelectors = [];
    // stateMap to [inputSelector1, inputSelector1] and [key1, key2]
    _.forEach(
        _.mapValues(
            stateMap,
            path => state => _.get(state, path)
        ),
        (inputSelector, key) => { keys.push(key); inputSelectors.push(inputSelector); }
    );
    // signature of resulting function
    let resultingFunction = (...stateParts) => _.mapValues(
        _.zipObject(keys, stateParts),
        statePart => statePart
    );
    // reselect's selector
    return createSelector(inputSelectors, resultingFunction);
};
