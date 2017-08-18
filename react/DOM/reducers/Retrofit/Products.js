// libraries
import _ from 'lodash';
// mixins
import { default as StateNamespace } from '../StateNamespace';
import * as Mixins from '../Mixins/index';
// reducers
import * as ProductsReducers from './Products/index';

const namespace = 'Retrofit.Products';

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

    // Products.Original
    state.Original = ProductsReducers.Original(state.Original, event);

    // Products.Parameters
    state.Parameters = ProductsReducers.Parameters(state.Parameters, event);

    return state;
};
