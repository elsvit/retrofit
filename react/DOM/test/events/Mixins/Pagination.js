import { expect } from 'chai';
import { default as PaginationEvents } from './../../../events/Mixins/Pagination';

describe('Events.Mixins.Pagination', () => {
    describe('creators', () => {
        const path = 'Retrofit.Originals.air';

        it('paginationPage', () => {
            const page = 1;
            const expectedAction = {
                type: PaginationEvents.types.PAGINATION_PAGE,
                payload: { path, page }
            };
            expect(PaginationEvents.creators.paginationPage(path, page)).to.deep.equal(expectedAction);
        });

        it('paginationPerPage', () => {
            const perPage = 10;
            const expectedAction = {
                type: PaginationEvents.types.PAGINATION_PER_PAGE,
                payload: { path, perPage }
            };
            expect(PaginationEvents.creators.paginationPerPage(path, perPage)).to.deep.equal(expectedAction);
        });
    });
});
