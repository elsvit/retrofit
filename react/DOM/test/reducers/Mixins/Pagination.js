// libraries
import { expect } from 'chai';
// reducers
import { default as PaginationReducer } from '../../../reducers/Mixins/Pagination';
// events
import { default as PaginationEvents } from '../../../events/Mixins/Pagination';

const defaultState = {};

describe('Reducers.Mixins.Filterable', () => {
    const stateNamespace = 'Retrofit.Originals.air';
    const path = 'Retrofit.Originals.air';

    it('should return the initial state', () => {
        expect(
            PaginationReducer(stateNamespace)(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle PAGINATION_PAGE', () => {
        const page = 3;
        expect(
            PaginationReducer(stateNamespace)(defaultState, PaginationEvents.creators.paginationPage(path, page))
        ).to.deep.equal({
            paginationPage: page
        });
    });

    it('should handle PAGINATION_PER_PAGE', () => {
        const perPage = 12;
        expect(
            PaginationReducer(stateNamespace)(defaultState, PaginationEvents.creators.paginationPerPage(path, perPage))
        ).to.deep.equal({
            paginationPerPage: perPage
        });
    });
});
