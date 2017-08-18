// mixins
import { default as StateNamespace } from '../../StateNamespace';
import * as Mixins from '../../Mixins/index';

const namespace = 'ValveSizer.Products.Combo';

// How to change Redux state basing on events
export default (state = {}, event = {}) => {
    // StateNamespace
    state = StateNamespace(namespace)(state, event);

    // Map
    state = Mixins.Map(namespace)(state, event);

    // SameFQN
    state = Mixins.SameFQN(namespace)(state, event);

    return state;
};
