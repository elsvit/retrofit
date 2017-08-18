/**
 * What should happen for abstract 'Pagination' functional somewhere in State
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            PAGINATION_PAGE: 'PAGINATION_PAGE',
            PAGINATION_PER_PAGE: 'PAGINATION_PER_PAGE'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} path
             * @param {Number} page
             */
            paginationPage: (path, page) => ({
                type: this.types.PAGINATION_PAGE,
                payload: { path, page }
            }),

            /**
             * @param {String} path
             * @param {Number} perPage
             */
            paginationPerPage: (path, perPage) => ({
                type: this.types.PAGINATION_PER_PAGE,
                payload: { path, perPage }
            })
        };
    }
}
