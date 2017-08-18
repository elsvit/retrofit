// events
import { ValveSizer as ValveSizerEvents } from '../../../events/index';

const defaultState = {
    list: []
};

const defaultEvent = {};

// How to change Redux state basing on events
export default (state = defaultState, event = defaultEvent) => {
    switch (event.type) {

        case ValveSizerEvents.Series.types.RESULT_LIST:
            return {
                ...state,
                list: event.payload.list
            };

        default:
            break;
    }

    return state;
};
