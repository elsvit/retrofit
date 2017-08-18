// libraries
import { expect } from 'chai';
// reducers
import { default as SeriesResultReducer } from './../../../../reducers/ValveSizer/Series/Result';
// events
import { default as SeriesEvents } from './../../../../events/ValveSizer/Series';

describe('Reducers.ValveSizer.Series.Result', () => {
    const defaultState = {
        list: []
    };

    it('should return the initial state', () => {
        expect(
            SeriesResultReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle set result series list', () => {
        const list = [
            { title: 'serie 1' },
            { title: 'serie 2' },
        ];
        expect(
            SeriesResultReducer(defaultState, SeriesEvents.creators.result_list(list))
        ).to.deep.equal(
            {
                list: list
            }
        );
    });
});
