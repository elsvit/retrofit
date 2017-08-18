import { expect } from 'chai';
import { default as RecommendationEvents } from './../../../events/ValveSizer/Recommendation';

describe('RecommendationEvents', () => {
    describe('creators', () => {
        it('pressureEffective', () => {
            const value = 123;
            const expectedAction = {
                type: RecommendationEvents.types.PRESSURE_EFFECTIVE,
                payload: { value }
            };
            expect(RecommendationEvents.creators.pressureEffective(value)).to.deep.equal(expectedAction);
        });

        it('dnSelectionList', () => {
            const list = [
                { dn: '15' },
                { dn: '20' }
            ];
            const expectedAction = {
                type: RecommendationEvents.types.DN_SELECTION_LIST,
                payload: { list }
            };
            expect(RecommendationEvents.creators.dnSelectionList(list)).to.deep.equal(expectedAction);
        });

        it('dnSelectionActive', () => {
            const item = { dn: '20' };
            const expectedAction = {
                type: RecommendationEvents.types.DN_SELECTION_ACTIVE,
                payload: { item }
            };
            expect(RecommendationEvents.creators.dnSelectionActive(item)).to.deep.equal(expectedAction);
        });

        it('error', () => {
            const error = {
                name: 'error_name',
                message: 'Error message',
            };
            const expectedAction = {
                type: RecommendationEvents.types.ERROR,
                payload: { error }
            };
            expect(RecommendationEvents.creators.error(error)).to.deep.equal(expectedAction);
        });
    });
});
