// libraries
import _ from 'lodash';
// mixins
import { default as StateNamespace } from '../../StateNamespace';
import * as Mixins from '../../Mixins/index';

const namespace = 'Retrofit.Comparison.Product';

// How to change Redux state basing on events
export default (state = {}, event = {}) => {
    state = _.cloneDeep(state);

    // StateNamespace
    state = StateNamespace(namespace)(state, event);

    // Entity
    state = Mixins.Entity(namespace)(state, event);

    // ForeignEntity
    state = Mixins.ForeignEntity(namespace)(state, event);

    return state;
};
