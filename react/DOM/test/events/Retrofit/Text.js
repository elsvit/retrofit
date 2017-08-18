import { expect } from 'chai';
import { default as TextEvents } from './../../../events/Retrofit/Text';

describe('Events.Retrofit.Text', () => {
    describe('creators', () => {
        it('entered', () => {
            const text = 'some text here';
            const expectedAction = {
                type: TextEvents.types.ENTERED,
                payload: { text }
            };
            expect(TextEvents.creators.entered(text)).to.deep.equal(expectedAction);
        });
    });
});
