import { expect } from 'chai';
import { default as StateNamespaceEvents } from './../../events/StateNamespace';

describe('Events.StateNamespace', () => {
    describe('creators', () => {
        it('clear', () => {
            const path = 'Retrofit.Originals.Parameters.air';
            const expectedAction = {
                type: StateNamespaceEvents.types.CLEAR,
                payload: { path }
            };
            expect(StateNamespaceEvents.creators.clear(path)).to.deep.equal(expectedAction);
        });
    });
});
