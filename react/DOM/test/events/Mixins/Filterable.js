import { expect } from 'chai';
import { default as FilterableEvents } from './../../../events/Mixins/Filterable';

describe('Events.Mixins.Filterable', () => {
    describe('creators', () => {
        it('filterableParameters', () => {
            const path = 'Retrofit.ProjectItems';
            const parameters = {
                projectId: '574c082a76983'
            };
            const expectedAction = {
                type: FilterableEvents.types.FILTERABLE_PARAMETERS,
                payload: { path, parameters }
            };
            expect(FilterableEvents.creators.filterableParameters(path, parameters)).to.deep.equal(expectedAction);
        });

        it('filterableAmount', () => {
            const path = 'Retrofit.ProjectItems';
            const amount = 13;
            const expectedAction = {
                type: FilterableEvents.types.FILTERABLE_AMOUNT,
                payload: { path, amount }
            };
            expect(FilterableEvents.creators.filterableAmount(path, amount)).to.deep.equal(expectedAction);
        });
    });
});
