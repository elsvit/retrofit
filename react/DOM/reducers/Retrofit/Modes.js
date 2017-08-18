// libraries
import _ from 'lodash';
// events
import { Retrofit as RetrofitEvents } from '../../events/index';

const defaultState = {
    device: {
        current: ''
    },
    search: {
        last: ''
    }
};

export default (state = defaultState, event = {}) => {
    state = _.cloneDeep(state);

    switch (event.type) {

        case RetrofitEvents.Modes.types.DEVICE_CHANGED:
            {
                state.device.current = event.payload.deviceMode;
            }
            break;

        case RetrofitEvents.Modes.types.SEARCH_CHANGED:
            {
                state.search.last = event.payload.searchMode;
            }
            break;

        default:
            break;
    }

    return state;
};
