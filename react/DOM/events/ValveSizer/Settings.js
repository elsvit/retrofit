/**
 * What events should happen for 'Settings'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            FLOW_UNIT: 'VALVESIZER_SETTING_FLOW_UNIT',
            PRESSURE_UNIT: 'VALVESIZER_SETTING_PRESSURE_UNIT'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} unit
             * @param {String} value
             */
            flow_unit: (value) => ({
                type: this.types.FLOW_UNIT,
                payload: { value }
            }),

            /**
             * @param {String} unit
             * @param {String} value
             */
            pressure_unit: (value) => ({
                type: this.types.PRESSURE_UNIT,
                payload: { value }
            }),
        };
    }
}
