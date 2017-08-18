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
        case MixinsEvents.EntityOrigin.types.ENTITY_ORIGIN_FQN:
            {
                _.set(
                    state,
                    innerNamespace + 'fqn',
                    event.payload.fqn
                );
            }
            break;

        case MixinsEvents.EntityOrigin.types.ENTITY_ORIGIN_ID:
            {
                _.set(
                    state,
                    innerNamespace + 'id',
                    event.payload.id
                );
            }
            break;

        case MixinsEvents.ForeignEntity.types.FOREIGN_ENTITY_DATA:
            {
                _.set(
                    state,
                    innerNamespace + 'entityData',
                    event.payload.data
                );
            }
            break;

        default:
            break;
    }

    return state;
};
