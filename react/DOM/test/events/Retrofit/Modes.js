import { expect } from 'chai';
import { default as ModesEvents } from './../../../events/Retrofit/Modes';

describe('Events.Retrofit.Modes', () => {
    describe('creators', () => {
        it('deviceChanged', () => {
            const deviceMode = 'water';
            const expectedAction = {
                type: ModesEvents.types.DEVICE_CHANGED,
                payload: { deviceMode }
            };
            expect(ModesEvents.creators.deviceChanged(deviceMode)).to.deep.equal(expectedAction);
        });

        it('searchChanged', () => {
            const searchMode = 'text';
            const expectedAction = {
                type: ModesEvents.types.SEARCH_CHANGED,
                payload: { searchMode }
            };
            expect(ModesEvents.creators.searchChanged(searchMode)).to.deep.equal(expectedAction);
        });
    });
});
