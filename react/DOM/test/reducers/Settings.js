import { assert } from 'chai';
import * as actions from '../../actions/Settings';
import reducer from '../../reducers/Settings';
import TargetMarket from '../../utils/targetMarket';

describe('Reducers.Settings', () => {
    const initialState = {
        targetMarket: {
            region: TargetMarket.DEFAULT_REGION,
            language: TargetMarket.DEFAULT_LANGUAGE
        }
    };

    it('should return the initial state', () => {
        assert.deepEqual(reducer(undefined, { type: 'Test' }), initialState);
    });

    it('should store target market', () => {
        const region = 'test-region';
        const language = 'test-lang';
        assert.deepEqual(reducer(initialState, actions.storeTargetMarket(region, language)),  {
            ...initialState,
            targetMarket: {region, language}
        });
    });
});
