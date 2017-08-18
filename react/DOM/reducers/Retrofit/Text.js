import _ from 'lodash';
import { Text as TextEvents } from '../../events/Retrofit/index';

const defaultState = {
    value: ''
};

const defaultEvent = {};

export default (state = defaultState, event = defaultEvent) => {
    state = _.cloneDeep(state);

    switch (event.type) {

        case TextEvents.types.ENTERED:
            {
                state.value = event.payload.text;
            }
            break;

        default:
            break;
    }

    return state;
};
