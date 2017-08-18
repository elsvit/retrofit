/**
 * What events should happen for 'Filterable' functional somewhere in State
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            FILTERABLE_PARAMETERS: 'FILTERABLE_PARAMETERS',
            FILTERABLE_AMOUNT: 'FILTERABLE_AMOUNT'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} path
             * @param {Object} parameters
             */
            filterableParameters: (path, parameters) => ({
                type: this.types.FILTERABLE_PARAMETERS,
                payload: { path, parameters }
            }),

            /**
             * @param {String} path
             * @param {Number} amount
             */
            filterableAmount: (path, amount) => ({
                type: this.types.FILTERABLE_AMOUNT,
                payload: { path, amount }
            })
        };
    }
}
