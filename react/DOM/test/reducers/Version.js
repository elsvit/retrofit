// libraries
import { expect } from 'chai';
// reducers
import { default as VersionReducer } from '../../reducers/Version';

const defaultState = '1.0.0';

describe('Reducers.Version', () => {
    it('should return the initial state', () => {
        expect(
            VersionReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });
});
