// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as ModesReducer } from '../../../reducers/Retrofit/Modes';
// events
import { default as ModesEvents } from '../../../events/Retrofit/Modes';

const defaultState = {
    device: {
        current: ''
    },
    search: {
        last: ''
    }
};

describe('Reducers.Retrofit.Modes', () => {
    it('should return the initial state', () => {
        expect(
            ModesReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle DEVICE_CHANGED', () => {
        const deviceMode = 'water';
        expect(
            ModesReducer(defaultState, ModesEvents.creators.deviceChanged(deviceMode))
        ).to.deep.equal(_.defaultsDeep(
            {
                device: {
                    current: deviceMode
                }
            },
            defaultState
        ));
    });

    it('should handle SEARCH_CHANGED', () => {
        const searchMode = 'text';
        expect(
            ModesReducer(defaultState, ModesEvents.creators.searchChanged(searchMode))
        ).to.deep.equal(_.defaultsDeep(
            {
                search: {
                    last: searchMode
                }
            },
            defaultState
        ));
    });
});
