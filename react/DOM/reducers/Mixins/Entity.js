// libraries
import _ from 'lodash';
// events
import { Mixins as MixinsEvents } from '../../events/index';

export default (namespace) => (state = {}, event = {}) => {
    // check if listening is for this part of state
    if (!_.has(event, 'payload.path') || !_.startsWith(event.payload.path, namespace)) {
        return state;
    }

    state = _.cloneDeep(state);

    let innerNamespace = _.replace(event.payload.path, new RegExp('^' + namespace), '');
    if (_.size(innerNamespace) > 0) {
        innerNamespace = _.replace(innerNamespace, new RegExp('^.'), '');
        innerNamespace += '.';
    }

    switch (event.type) {
        case MixinsEvents.Entity.types.ENTITY_IDENTIFIER:
            {
                _.set(
                    state,
                    innerNamespace + 'entityId',
                    event.payload.identifier
                );
            }
            break;

        default:
            break;
    }

    return state;
};
