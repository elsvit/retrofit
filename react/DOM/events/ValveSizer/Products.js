/**
 * What events should happen for 'Products'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            SERIES: 'VALVESIZER_PRODUCTS_SERIES',
            ACTUATORS_BUFFER: 'VALVESIZER_PRODUCTS_ACTUATORS_BUFFER',
            ACTUATORS: 'VALVESIZER_PRODUCTS_ACTUATORS'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {Object} series
             */
            series: (series) => ({
                type: this.types.SERIES,
                payload: { series }
            }),
            /**
             * @param {Array} actuators
             */
            actuatorsBuffer: (actuators) => ({
                type: this.types.ACTUATORS_BUFFER,
                payload: { actuators }
            }),
            /**
             * @param {Array} actuators
             */
            actuators: (actuators) => ({
                type: this.types.ACTUATORS,
                payload: { actuators }
            })
        };
    }
}
