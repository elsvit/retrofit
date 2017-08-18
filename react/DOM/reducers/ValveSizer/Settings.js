// libraries
import _ from 'lodash';
// events
import { ValveSizer as ValveSizerEvents } from '../../events/index';
// reference
import { FlowReference, PressureReference } from './../../models/ValveSizer/Reference/index';

const defaultState = {
    flow: {
        units: FlowReference.getUnits(),
        value: 'l_s',
    },
    pressure: {
        units: PressureReference.getUnits(),
        value: 'k_pa',
    }
};

export default (state = defaultState, event = {}) => {
    let newState = _.cloneDeep(state);

    switch (event.type) {
        case ValveSizerEvents.Settings.types.FLOW_UNIT:
            {
                newState.flow.value = event.payload.value;
            }
            break;

        case ValveSizerEvents.Settings.types.PRESSURE_UNIT:
            {
                newState.pressure.value = event.payload.value;
            }
            break;

        default:
            break;
    }

    return newState;
};
