import { Cache as CacheEvents } from '../events/index';
import _ from 'lodash';

const defaultState = {};
const defaultEvent = {};

export default (state = defaultState, event = defaultEvent) => {
    switch (event.type) {
        case CacheEvents.types.SET:
            state = Object.assign({}, state, event.payload.map);
            break;

        case CacheEvents.types.UNSET:
            state = Object.assign({}, state);
            _.forEach(event.payload.keys, (key) => { delete state[key]; });
            break;

        case CacheEvents.types.PURGE:
            state = defaultState;
            break;

        default:
            break;
    }

    return state;
};
