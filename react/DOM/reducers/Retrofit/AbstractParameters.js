// libraries
import _ from 'lodash';
// events
import { Retrofit as RetrofitEvents } from '../../events/index';

// reducer creator
export default (defaultState, namespace) => (state = defaultState, event = {}) => {
    // check if listening is for this part of state
    if (!_.has(event, 'payload.path') || !_.startsWith(event.payload.path, namespace)) {
        return state;
    }

    state = _.cloneDeep(state);

    let innerNamespace = _.replace(event.payload.path, new RegExp('^' + namespace), '');
    if (_.size(innerNamespace) > 0) {
        innerNamespace = _.replace(innerNamespace, new RegExp('^.'), '');
    }

    switch (event.type) {

        case RetrofitEvents.Parameters.types.NEW_VALUES:
            {
                _.set(
                    state,
                    innerNamespace + '.parameters.' + event.payload.name + '.values',
                    event.payload.values
                );
            }
            break;

        case RetrofitEvents.Parameters.types.NEW_OPTIONS:
            {
                _.forEach(event.payload.map, (options, key) => {
                    _.set(
                        state,
                        innerNamespace + '.parameters.' + key + '.options',
                        options
                    );
                });
            }
            break;

        case RetrofitEvents.Parameters.types.NEW_AMOUNT:
            {
                _.set(
                    state,
                    innerNamespace + '.amount',
                    event.payload.amount
                );
            }
            break;

        case RetrofitEvents.Parameters.types.PARAMETERS:
            {
                _.set(
                    state,
                    innerNamespace + '.parameters',
                    event.payload.map
                );
            }
            break;

        default:
            break;
    }

    return state;
};
