// libraries
import _ from 'lodash';
// events
import { ValveSizer as ValveSizerEvents } from '../../events/index';

const defaultState = {
    power: '',
    temperature_difference: '',
    flow: ''
};

export default (state = defaultState, event = {}) => {
    let newState = _.cloneDeep(state);

    switch (event.type) {

        case ValveSizerEvents.FlowCalculation.types.POWER:
            {
                newState.power = event.payload.value;
            }
            break;

        case ValveSizerEvents.FlowCalculation.types.TEMPERATURE_DIFFERENCE:
            {
                newState.temperature_difference = event.payload.value;
            }
            break;

        case ValveSizerEvents.FlowCalculation.types.FLOW:
            {
                newState.flow = event.payload.value;
            }
            break;

        default:
            break;
    }

    return newState;
};
