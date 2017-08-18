// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as UserReducer } from '../../reducers/User';
// events
import { default as UserEvents } from '../../events/User';

const defaultState = {
    locale: 'en_US',
    supportContacts: {}
};

describe('Reducers.User', () => {
    it('should return the initial state', () => {
        expect(
            UserReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle LOCALE', () => {
        const locale = 'de_CH';
        expect(
            UserReducer(defaultState, UserEvents.creators.locale(locale))
        ).to.deep.equal(_.assign({}, defaultState, { locale: locale }));
    });

    it('should handle SUPPORT_CONTACTS', () => {
        const supportContacts = {};
        expect(
            UserReducer(defaultState, UserEvents.creators.supportContacts(supportContacts))
        ).to.deep.equal(_.assign({}, defaultState, { supportContacts: supportContacts }));
    });
});
