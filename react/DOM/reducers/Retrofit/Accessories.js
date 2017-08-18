// libraries
import _ from 'lodash';
// mixins
import { default as StateNamespace } from '../StateNamespace';
import * as Mixins from '../Mixins/index';
// reducers
import * as AccessoriesReducers from './Accessories/index';

const namespace = 'Retrofit.Accessories';

// How to change Redux state basing on events
export default (state = {}, event = {}) => {
    state = _.cloneDeep(state);

    // StateNamespace
    state = StateNamespace(namespace)(state, event);

    // Map
    state = Mixins.Map(namespace)(state, event);

    // Pagination
    state = Mixins.Pagination(namespace)(state, event);

    // SameFQN
    state = Mixins.SameFQN(namespace)(state, event);

    // Original
    state.Original = AccessoriesReducers.Original(state.Original, event);

    return state;
};
