/**
 * What events should happen for 'FlowPressure'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            FLOW: 'VALVESIZER_FLOW_PRESSURE_FLOW',
            DIFFERENTIAL_PRESSURE: 'VALVESIZER_FLOW_PRESSURE_DIFFERENTIAL_PRESSURE',
            KV: 'VALVESIZER_FLOW_PRESSURE_KV'
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
            flow: (value) => ({
                type: this.types.FLOW,
                payload: { value }
            }),

            /**
             * @param {String} value
             */
            differential_pressure: (value) => ({
                type: this.types.DIFFERENTIAL_PRESSURE,
                payload: { value }
            }),

            /**
             * @param {Number} value
             */
            kv: (value) => ({
                type: this.types.KV,
                payload: { value }
            })
        };
    }
}
