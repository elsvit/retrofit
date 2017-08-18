// libraries
import _ from 'lodash';
// events
import { ValveSizer as ValveSizerEvents } from './../../../events/index';

const defaultState = {
    parameters: {
        pressureEffective: 0
    },
    dnSelection: {
        list: [],
        active: {}
    },
    error: null
};

const defaultEvent = {};

// How to change Redux state basing on events
export default (state = defaultState, event = defaultEvent) => {
    let newState = _.cloneDeep(state);

    switch (event.type) {
        case ValveSizerEvents.Recommendation.types.PRESSURE_EFFECTIVE:
            {
                newState.parameters.pressureEffective = event.payload.value;
            }
            break;

        case ValveSizerEvents.Recommendation.types.DN_SELECTION_LIST:
            {
                newState.dnSelection.list = event.payload.list;
            }
            break;

        case ValveSizerEvents.Recommendation.types.DN_SELECTION_ACTIVE:
            {
                newState.dnSelection.active = event.payload.item;
            }
            break;

        case ValveSizerEvents.Recommendation.types.ERROR:
            {
                newState.error = event.payload.error;
            }
            break;

        default:
            break;
    }

    return newState;
};
