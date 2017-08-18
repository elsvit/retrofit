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
        case MixinsEvents.Map.types.MAP_ENTITIES:
            {
                // entities
                _.set(
                    state,
                    innerNamespace + 'mapEntities',
                    event.payload.entities
                );
                // keys
                _.set(
                    state,
                    innerNamespace + 'mapKeys',
                    (_.keys(_.get(state, innerNamespace + 'mapEntities', {}))).sort((a, b) => (Number(a) - Number(b)))
                );
            }
            break;

        case MixinsEvents.Map.types.MAP_ENTITIES_ASSIGN:
            {
                // entities
                _.set(
                    state,
                    innerNamespace + 'mapEntities',
                    _.defaultsDeep(
                        event.payload.entities,
                        _.get(state, innerNamespace + 'mapEntities', {})
                    )
                );
                // keys
                _.set(
                    state,
                    innerNamespace + 'mapKeys',
                    (_.keys(_.get(state, innerNamespace + 'mapEntities', {}))).sort((a, b) => (Number(a) - Number(b)))
                );
            }
            break;


        case MixinsEvents.Map.types.MAP_ENTITIES_UNSET:
            {
                // entities
                _.forEach(
                    event.payload.keys,
                    key => _.unset(
                        _.get(state, innerNamespace + 'mapEntities', {}),
                        key
                    )
                );
                // keys
                _.set(
                    state,
                    innerNamespace + 'mapKeys',
                    (_.keys(_.get(state, innerNamespace + 'mapEntities', {}))).sort((a, b) => (Number(a) - Number(b)))
                );
            }
            break;

        default:
            break;
    }

    return state;
};
