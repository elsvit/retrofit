// mixins
import { default as StateNamespace } from '../StateNamespace';
import * as Mixins from '../Mixins/index';
// reducers
import * as OriginalsReducers from './Originals/index';

const namespace = 'Retrofit.Originals';

const defaultState = {};

const defaultEvent = {};

// How to change Redux state basing on events
export default (state = defaultState, event = defaultEvent) => {
    // StateNamespace
    state = StateNamespace(namespace)(state, event);

    // Map
    state = Mixins.Map(namespace)(state, event);

    // Pagination
    state = Mixins.Pagination(namespace)(state, event);

    // SameFQN
    state = Mixins.SameFQN(namespace)(state, event);

    // Filterable
    state = Mixins.Filterable(namespace)(state, event);

    return {
        ...state,
        Parameters: OriginalsReducers.Parameters(state.Parameters, event)
    };
};
