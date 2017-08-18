// libraries
import _ from 'lodash';
// mixins
import StateNamespace from './StateNamespace';
import * as Mixins from './Mixins/index';

const namespace = 'ProjectProducts';

// How to change Redux state basing on events
export default (state = {}, event = {}) => {
    state = _.cloneDeep(state);

    // StateNamespace
    state = StateNamespace(namespace)(state, event);

    // Map
    state = Mixins.Map(namespace)(state, event);

    // Pagination
    state = Mixins.Pagination(namespace)(state, event);

    // Filterable
    state = Mixins.Filterable(namespace)(state, event);

    // SameFQN
    state = Mixins.SameFQN(namespace)(state, event);

    return state;
};
