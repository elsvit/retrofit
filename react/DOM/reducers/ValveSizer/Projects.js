// libraries
import _ from 'lodash';
// mixins
import * as Mixins from '../Mixins/index';

const namespace = 'ValveSizer.Projects';

const defaultState = {};

const defaultEvent = {};

// How to change Redux state basing on events
export default (state = defaultState, event = defaultEvent) => {
    state = _.cloneDeep(state);

    // Map
    state = Mixins.Map(namespace)(state, event);

    // Filterable
    state = Mixins.Filterable(namespace)(state, event);

    return state;
};
