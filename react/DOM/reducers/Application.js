// libraries
import _ from 'lodash';
// events
import { default as ApplicationEvents } from '../events/Application';

const defaultState = {
    isLoading: false,
    isComponentLoading: false,
    isError: false,
    error: {
        header: '',
        body: ''
    },
};

const defaultEvent = {};

export default (state = defaultState, event = defaultEvent) => {
    state = _.cloneDeep(state);

    switch (event.type) {

        case ApplicationEvents.types.LOAD_STARTED:
            {
                state.isLoading = true;
            }
            break;

        case ApplicationEvents.types.LOAD_FINISHED:
            {
                state.isLoading = false;
            }
            break;

        case ApplicationEvents.types.LOAD_COMPONENT_STARTED:
            {
                state.isComponentLoading = true;
            }
            break;

        case ApplicationEvents.types.LOAD_COMPONENT_FINISHED:
            {
                state.isComponentLoading = false;
            }
            break;

        case ApplicationEvents.types.ERROR_HAPPENED:
            {
                state.isError = event.error;
                state.error.header = event.payload.header || '';
                state.error.body = event.payload.body || '';
                state.error.exceptionValue = event.payload.exceptionValue || '';
            }
            break;

        case ApplicationEvents.types.ERROR_DELIVERED:
            {
                state.isError = false;
                state.error.header = '';
                state.error.body = '';
            }
            break;

        default:
            break;
    }

    return state;
};
