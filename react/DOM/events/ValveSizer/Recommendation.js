/**
 * What events should happen for 'Recommendation widget'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            PRESSURE_EFFECTIVE: 'VALVESIZER_PRODUCTS_RECOMMENDATION_PARAMETERS_PRESSURE_EFFECTIVE',
            DN_SELECTION_LIST: 'VALVESIZER_PRODUCTS__RECOMMENDATION_PARAMETERS_DN_SELECTION_LIST',
            DN_SELECTION_ACTIVE: 'VALVESIZER_PRODUCTS__RECOMMENDATION_PARAMETERS_DN_SELECTION_ACTIVE',
            ERROR: 'VALVESIZER_PRODUCTS_ACTUATORS_FILTER_ERROR'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {Number} value
             */
            pressureEffective: (value) => ({
                type: this.types.PRESSURE_EFFECTIVE,
                payload: { value }
            }),
            /**
             * @param {Array} list
             */
            dnSelectionList: (list) => ({
                type: this.types.DN_SELECTION_LIST,
                payload: { list }
            }),
            /**
             * @param {Object} item
             */
            dnSelectionActive: (item) => ({
                type: this.types.DN_SELECTION_ACTIVE,
                payload: { item }
            }),
            /**
             * @param {Object} value
             */
            error: (error) => ({
                type: this.types.ERROR,
                payload: { error }
            })
        };
    }
}
