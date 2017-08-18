/**
 * What events should happen for 'Properties'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            VALUES: 'VALVESIZER_PROPERTIES_VALUES',
            RESET: 'VALVESIZER_PROPERTIES_RESET',
            OPTIONS: 'VALVESIZER_PROPERTIES_OPTIONS',
            UPDATE_FILTER: 'VALVESIZER_UPDATE_FILTER',
            RESET_FILTER: 'VALVESIZER_RESET_FILTER'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} section
             * @param {String[]} values
             */
            values: (section, values) => ({
                type: this.types.VALUES,
                payload: { section, values }
            }),

            reset: () => ({
                type: this.types.RESET,
                payload: {}
            }),

            /**
             * @param {String[]} map
             */
            options: (map) => ({
                type: this.types.OPTIONS,
                payload: { map }
            }),

            /**
             * @param {Object} filter
             */
            updateFilter: (filter) => ({
                type: this.types.UPDATE_FILTER,
                payload: { filter }
            }),

            resetFilter: () => ({
                type: this.types.RESET_FILTER,
                payload: {}
            }),
        };
    }
}
