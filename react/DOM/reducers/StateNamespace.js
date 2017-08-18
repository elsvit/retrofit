// libraries
import _ from 'lodash';
// events
import { StateNamespace as StateNamespaceEvents } from '../events/index';

export default (namespace) => (state = {}, event = {}) => {
    // check if listening is for this part of state
    if (!_.has(event, 'payload.path') || !_.startsWith(event.payload.path, namespace)) {
        return state;
    }

    let innerNamespace = _.replace(event.payload.path, new RegExp('^' + namespace), '');
    if (_.size(innerNamespace) > 0) {
        innerNamespace = _.replace(innerNamespace, new RegExp('^.'), '');
    }

    state = _.cloneDeep(state);

    switch (event.type) {
        case StateNamespaceEvents.types.CLEAR:
            {
                if (_.size(innerNamespace) > 0) {
                    _.set(state, innerNamespace, {});
                } else {
                    state = {};
                }
            }
            break;

        default:
            break;
    }

    return state;
};
