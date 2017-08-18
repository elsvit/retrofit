import { default as log } from 'loglevel';
import _ from 'lodash';

export default (oldState, newState, overwriteNodes = []) => {
    log.debug('SimpleAppStateMerger() - run. oldState:',
        oldState, 'newState:', newState, 'overwriteNodes:', overwriteNodes);
    const result = {...oldState};

    for (const key in newState) {
        if (!newState.hasOwnProperty(key)) {
            continue;
        }

        const value = newState[key];

        // Assign if we don't need to merge at all
        if (!result.hasOwnProperty(key)) {
            result[key] = _.isObject(value) && !_.isArray(value)
                ? _.merge({}, value)
                : value;
            continue;
        }

        if (overwriteNodes.length === 0 || _.includes(overwriteNodes, key)) {
            const oldValue = result[key];
            if (_.isObject(value) && !_.isArray(value)) {
                result[key] = _.merge({}, oldValue, value);
            } else {
                result[key] = value;
            }
        }
    }

    log.debug('SimpleAppStateMerger() - complete. result:', result);
    return result;
};
