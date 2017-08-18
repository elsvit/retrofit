// libraries
import _ from 'lodash';
// mixins
import { default as StateNamespace } from '../../StateNamespace';
import * as Mixins from '../../Mixins/index';
// events
import { ValveSizer as ValveSizerEvents } from '../../../events/index';

const namespace = 'ValveSizer.Products.Result';

const defaultState = {
    series: {},
    actuatorsBuffer: [],
    actuators: []
};

const defaultEvent = {};

// How to change Redux state basing on events
export default (state = defaultState, event = defaultEvent) => {
    state = _.cloneDeep(state);

    // StateNamespace
    state = StateNamespace(namespace)(state, event);

    // Map
    state = Mixins.Map(namespace)(state, event);

    // SameFQN
    state = Mixins.SameFQN(namespace)(state, event);

    // Filterable
    state = Mixins.Filterable(namespace)(state, event);

    // Other reducers
    switch (event.type) {
        case ValveSizerEvents.Products.types.SERIES:
            {
                state.series = event.payload.series;
            }
            break;

        case ValveSizerEvents.Products.types.ACTUATORS:
            {
                state.actuators = event.payload.actuators;
            }
            break;

        case ValveSizerEvents.Products.types.ACTUATORS_BUFFER:
            {
                state.actuatorsBuffer = event.payload.actuators;
            }
            break;

        default:
            break;
    }

    return state;
};
