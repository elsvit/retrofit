/**
 * What should happen for 'AJAX'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            REQUEST: 'AJAX_REQUEST',
            RESPONSE: 'AJAX_RESPONSE',
            ERROR: 'AJAX_ERROR'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} id
             * @param {String} method
             * @param {String} url
             * @param {Object} headers
             * @param {Object|undefined} body
             */
            request: (id, method, url, headers = {}, body = undefined) => ({
                type: this.types.REQUEST,
                error: false,
                payload: { id, method, url, headers, body }
            }),

            /**
             * @param {String} id
             * @param {Object} headers
             * @param {Object} body
             */
            response: (id, headers, body) => ({
                type: this.types.RESPONSE,
                error: false,
                payload: { id, headers, body }
            }),

            /**
             * @param {String} id
             * @param {Object} headers
             * @param {Object} body
             */
            error: (id, headers, body) => ({
                type: this.types.ERROR,
                error: true,
                payload: { id, headers, body }
            })
        };
    }
}
