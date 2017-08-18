// libraries
import { expect } from 'chai';
// reducers
import { default as FilterableReducer } from '../../../reducers/Mixins/Filterable';
// events
import { default as FilterableEvents } from '../../../events/Mixins/Filterable';

const defaultState = {};

describe('Reducers.Mixins.Filterable', () => {
    const stateNamespace = 'Retrofit.ProjectItems';

    it('should return the initial state', () => {
        expect(
            FilterableReducer(stateNamespace)(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle FILTERABLE_PARAMETERS', () => {
        const path = 'Retrofit.ProjectItems';
        const parameters = {
            projectId: '574c082a76983'
        };
        expect(
            FilterableReducer(stateNamespace)(defaultState, FilterableEvents.creators.filterableParameters(path, parameters))
        ).to.deep.equal({
            filterableParameters: parameters
        });
    });

    it('should handle FILTERABLE_PARAMETERS', () => {
        const path = 'Retrofit.ProjectItems';
        const amount = 13;
        expect(
            FilterableReducer(stateNamespace)(defaultState, FilterableEvents.creators.filterableAmount(path, amount))
        ).to.deep.equal({
            filterableAmount: amount
        });
    });
});
