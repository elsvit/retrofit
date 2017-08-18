// libraries
import _ from 'lodash';
// events
import { ValveSizer as ValveSizerEvents } from '../../events/index';

const defaultState = {
    flow: '',
    differential_pressure: '',
    kv: ''
};

export default (state = defaultState, event = {}) => {
    let newState = _.cloneDeep(state);

    switch (event.type) {
        case ValveSizerEvents.FlowPressure.types.FLOW:
            {
                newState.flow = event.payload.value;
            }
            break;

        case ValveSizerEvents.FlowPressure.types.DIFFERENTIAL_PRESSURE:
            {
                newState.differential_pressure = event.payload.value;
            }
            break;

        case ValveSizerEvents.FlowPressure.types.KV:
            {
                newState.kv = event.payload.value;
            }
            break;

        default:
            break;
    }

    return newState;
};
