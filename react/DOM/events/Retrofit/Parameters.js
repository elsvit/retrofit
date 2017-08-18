/**
 * What events should happen for 'Parameters'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            NEW_VALUES: 'RETROFIT_PARAMETER_NEW_VALUES',
            NEW_OPTIONS: 'RETROFIT_PARAMETERS_NEW_OPTIONS',
            NEW_AMOUNT: 'RETROFIT_PARAMETERS_NEW_AMOUNT',
            PARAMETERS: 'RETROFIT_PARAMETERS_PARAMETERS'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} path
             * @param {String} name
             * @param {String[]} values
             */
            newValues: (path, name, values) => ({
                type: this.types.NEW_VALUES,
                payload: { path, name, values }
            }),

            /**
             * @param {String} path
             * @param {Object} map
             */
            newOptions: (path, map) => ({
                type: this.types.NEW_OPTIONS,
                payload: { path, map }
            }),

            /**
             * @param {String} path
             * @param {Object} amount
             */
            newAmount: (path, amount) => ({
                type: this.types.NEW_AMOUNT,
                payload: { path, amount }
            }),

            /**
             * @param {String} path
             * @param {Object} map
             */
            parameters: (path, map) => ({
                type: this.types.PARAMETERS,
                payload: { path, map }
            }),
        };
    }
}
