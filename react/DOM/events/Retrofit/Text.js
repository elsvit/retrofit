/**
 * What events should happen for 'Text'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            ENTERED: 'RETROFIT_TEXT_ENTERED'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} text
             */
            entered: (text) => ({
                type: this.types.ENTERED,
                payload: { text }
            })
        };
    }
}
