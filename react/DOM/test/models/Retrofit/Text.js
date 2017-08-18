// libraries
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
// models
import { default as TextModel } from '../../../models/Retrofit/Text';
// events
import { Text as TextEvents } from '../../../events/Retrofit/index';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Models.Retrofit.Text', () => {
    describe('value setter', () => {
        it('creates expected events', () => {
            const store = mockStore({ Retrofit: { Text: { value: '' } } });

            const textModel = new TextModel(store.dispatch);

            textModel.value = 'Gesa_DN 65';

            const expectedEvents = [
                { type: TextEvents.types.ENTERED, payload: { text: 'Gesa_DN 65' } },
            ];

            expect(store.getActions()).to.deep.equal(expectedEvents);
        });
    });

    describe('value getter', () => {
        it('reads proper part of state', () => {
            const store = mockStore({ Retrofit: { Text: { value: 'V2BM15' } } });

            const textModel = new TextModel(store.dispatch);

            expect(textModel.value).to.deep.equal('V2BM15');
        });
    });
});
