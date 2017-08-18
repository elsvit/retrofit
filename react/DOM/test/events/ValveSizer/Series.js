import { expect } from 'chai';
import { default as SeriesEvents } from './../../../events/ValveSizer/Series';

describe('SeriesEvents', () => {
    describe('creators', () => {
        it('result_list', () => {
            const list = [
                { title: 'serie 1' },
                { title: 'serie 2' }
            ];
            const expectedAction = {
                type: SeriesEvents.types.RESULT_LIST,
                payload: { list }
            };
            expect(SeriesEvents.creators.result_list(list)).to.deep.equal(expectedAction);
        });
    });
});
