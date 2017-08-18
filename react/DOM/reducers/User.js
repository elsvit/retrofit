import _ from 'lodash';
import { User as UserModel } from '../models/index';
import { User as UserEvents } from '../events/index';

const userModel = new UserModel(() => {}, '');

const defaultState = {
    locale: userModel.defaultLocaleID,
    supportContacts: {},
};
const defaultEvent = {};

export default (state = defaultState, event = defaultEvent) => {
    state = _.cloneDeep(state);

    switch (event.type) {

        case UserEvents.types.IDENTIFICATION:
            {
                state.userId = event.payload.identifier;
            }
            break;

        case UserEvents.types.LOCALE:
            {
                state.locale = event.payload.locale;
            }
            break;

        case UserEvents.types.SUPPORT_CONTACTS:
            {
                state.supportContacts = event.payload.supportContacts;
            }
            break;

        default:
            break;
    }

    return state;
};
