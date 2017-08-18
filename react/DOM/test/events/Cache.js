import { expect } from 'chai';
import { default as CacheEvents } from '../../events/Cache';

describe('CacheEvents', () => {
    describe('creators', () => {
        describe('set', () => {
            it('should create an action with new cache part as payload', () => {
                const map = {'key1': 'value1', 'key2': 'value2'};
                const expectedAction = {
                    type: CacheEvents.types.SET,
                    payload: {map}
                };
                expect(CacheEvents.creators.set(map)).to.deep.equal(expectedAction)
            });
        });

        describe('unset', () => {
            it('should create an action with keys of cache for removal as payload', () => {
                const keys = ['key3', 'key4'];
                const expectedAction = {
                    type: CacheEvents.types.UNSET,
                    payload: {keys}
                };
                expect(CacheEvents.creators.unset(keys)).to.deep.equal(expectedAction)
            });
        });
    });
});
