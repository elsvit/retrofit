import { default as AJAXEvents } from '../events/AJAX';

const defaultState = {
    isLoading: false,
    isError: false,
    method: '',
    url: '',
    request: {
        headers: {},
        body: {}
    },
    response: {
        headers: {},
        body: {}
    },
};

export default (
    state = defaultState,
    { payload, error: isError, type } = {}
) => {
    const { method, url, headers, body } = payload || {};

    switch (type) {

        case AJAXEvents.types.REQUEST:
            return {
                ...state,
                isLoading: true,
                isError,
                method,
                url,
                request: {
                    headers,
                    body
                }
            };

        case AJAXEvents.types.RESPONSE:
        case AJAXEvents.types.ERROR:
            return {
                ...state,
                isLoading: false,
                isError,
                response: {
                    headers,
                    body
                }
            };

        default:
            return state;
    }
};
