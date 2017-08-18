// libraries
import { expect } from 'chai';
// reducers
import { default as SameFQNReducer } from '../../../reducers/Mixins/SameFQN';
// events
import { default as SameFQNEvents } from '../../../events/Mixins/SameFQN';

const defaultState = {};

describe('Reducers.Mixins.SameFQN', () => {
    const stateNamespace = 'Retrofit.Originals.air';
    const path = 'Retrofit.Originals.air';

    it('should return the initial state', () => {
        expect(
            SameFQNReducer(stateNamespace)(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle SAME_FQN', () => {
        const fqn = 'retrofit.air.original';
        expect(
            SameFQNReducer(stateNamespace)(defaultState, SameFQNEvents.creators.fqn(path, fqn))
        ).to.deep.equal({
            mapFQN: fqn
        });
    });
});
