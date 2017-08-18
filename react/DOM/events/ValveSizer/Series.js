/**
 * What events should happen for 'Series'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            RESULT_LIST: 'VALVESIZER_SERIES_RESULT_LIST'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {Array} list
             */
            result_list: (list) => ({
                type: this.types.RESULT_LIST,
                payload: { list }
            })
        };
    }
}
