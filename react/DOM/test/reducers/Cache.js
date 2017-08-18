// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as CacheReducer } from '../../reducers/Cache';
// events
import { default as CacheEvents } from '../../events/Cache';

const defaultState = {};

describe('Reducers.Cache', () => {
    it('should return the initial state', () => {
        expect(
            CacheReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle SET', () => {
        const map = {
            'key2': {
                id:"301542",
                title:"SA1.13"
            }
        };
        expect(
            CacheReducer(defaultState, CacheEvents.creators.set(map))
        ).to.deep.equal(_.defaultsDeep(
            {
                'key2': {
                    id:"301542",
                    title:"SA1.13"
                }
            },
            defaultState
        ));
    });

    it('should handle UNSET', () => {
        const state = {
            'key1': {
                id:"301540",
                title:"SA1.12"
            }
        };
        const keys = ['key1'];
        expect(
            CacheReducer(state, CacheEvents.creators.unset(keys))
        ).to.deep.equal({});
    });
});
