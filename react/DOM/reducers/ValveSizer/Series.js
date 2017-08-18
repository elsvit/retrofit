// mixins
import { default as StateNamespace } from '../StateNamespace';
import * as Mixins from '../Mixins/index';
// reducers
import * as ResultReducers from './Series/index';

const namespace = 'ValveSizer.Series';

const defaultState = {};

const defaultEvent = {};

// How to change Redux state basing on events
export default (state = defaultState, event = defaultEvent) => {
    // StateNamespace
    state = StateNamespace(namespace)(state, event);

    // Map
    state = Mixins.Map(namespace)(state, event);

    // SameFQN
    state = Mixins.SameFQN(namespace)(state, event);

    // Filterable
    state = Mixins.Filterable(namespace)(state, event);

    return {
        ...state,
        Result: ResultReducers.Result(state.Result, event)
    };
};
