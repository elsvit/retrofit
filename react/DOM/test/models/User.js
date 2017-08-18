// libraries
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import shortid from 'shortid';
import _ from 'lodash';
// models
import { default as UserModel } from '../../models/User';
// events
import { User as UserEvents } from '../../events/index';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Models.User', () => {
    describe('user id setter', () => {
        it('creates expected events', () => {
            const store = mockStore({ Retrofit: { User: { } } });
            const userModel = new UserModel(store.dispatch);
            const identifier = shortid.generate();

            userModel.userId = identifier;

            const expectedEvents = [
                { type: UserEvents.types.IDENTIFICATION, payload: { identifier } },
            ];

            expect(store.getActions()).to.deep.equal(expectedEvents);
        });
    });

    describe('locale id setter', () => {
        it('creates expected events', () => {
            const store = mockStore({ Retrofit: { User: { } } });
            const userModel = new UserModel(store.dispatch);
            const locale = _.sample(userModel.localesIDs);

            userModel.locale = locale;

            const expectedEvents = [
                { type: UserEvents.types.LOCALE, payload: { locale } },
            ];

            expect(store.getActions()).to.deep.equal(expectedEvents);
        });
    });

});
