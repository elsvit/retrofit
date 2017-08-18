/**
 * What events should happen for 'FlowCalculation'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            POWER: 'VALVESIZER_FLOW_CALCULATION_POWER',
            TEMPERATURE_DIFFERENCE: 'VALVESIZER_FLOW_CALCULATION_TEMPERATURE_DIFFERENCE',
            FLOW: 'VALVESIZER_FLOW_CALCULATION_FLOW'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} value
             */
            power: (value) => ({
                type: this.types.POWER,
                payload: { value }
            }),

            /**
             * @param {String} value
             */
            temperature_difference: (value) => ({
                type: this.types.TEMPERATURE_DIFFERENCE,
                payload: { value }
            }),

            /**
             * @param {String} value
             */
            flow: (value) => ({
                type: this.types.FLOW,
                payload: { value }
            })
        };
    }
}
