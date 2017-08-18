// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as ProductsRecommendationReducer } from './../../../../reducers/ValveSizer/Products/Recommendation';
// events
import { default as RecommendationEvents } from './../../../../events/ValveSizer/Recommendation';

describe('Reducers.ValveSizer.Products.Recommendation', () => {
    const defaultState = {
        parameters: {
            pressureEffective: 0
        },
        dnSelection: {
            list: [],
            active: {}
        },
        error: null
    };

    it('should return the initial state', () => {
        expect(
            ProductsRecommendationReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle set effective pressure', () => {
        const value = 123;
        expect(
            ProductsRecommendationReducer(defaultState, RecommendationEvents.creators.pressureEffective(value))
        ).to.deep.equal(
            _.assign({}, defaultState, { parameters: { pressureEffective: value } })
        );
    });

    it('should handle set dn selection list', () => {
        const list = [
            { dn: '15' },
            { dn: '20' }
        ];
        expect(
            ProductsRecommendationReducer(defaultState, RecommendationEvents.creators.dnSelectionList(list))
        ).to.deep.equal(
            _.assign({}, defaultState, { dnSelection: { list: list, active: {} } })
        );
    });

    it('should handle set dn selection active', () => {
        const item = { dn: '15' };
        expect(
            ProductsRecommendationReducer(defaultState, RecommendationEvents.creators.dnSelectionActive(item))
        ).to.deep.equal(
            _.assign({}, defaultState, { dnSelection: { list: [], active: item } })
        );
    });

    it('should handle set error', () => {
        const error = {
            name: 'error_name',
            message: 'Error message',
        };
        expect(
            ProductsRecommendationReducer(defaultState, RecommendationEvents.creators.error(error))
        ).to.deep.equal(
            _.assign({}, defaultState, { error: error })
        );
    });
});
