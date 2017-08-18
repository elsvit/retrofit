// libraries
import { expect } from 'chai';
// reducers
import { default as TextReducer } from '../../../reducers/Retrofit/Text';
// events
import { default as TextEvents } from '../../../events/Retrofit/Text';

const defaultState = {
    value: ''
};

describe('Reducers.Retrofit.Text', () => {
    it('should return the initial state', () => {
        expect(
            TextReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle DEVICE_CHANGED', () => {
        const text = 'some text here';
        expect(
            TextReducer(defaultState, TextEvents.creators.entered(text))
        ).to.deep.equal({ value: text });
    });
});
