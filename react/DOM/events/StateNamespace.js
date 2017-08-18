/**
 * What should happen for 'State Namespace'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            CLEAR: 'STATE_NAMESPACE_CLEAR'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} path
             */
            clear: (path) => ({
                type: this.types.CLEAR,
                payload: { path }
            })
        };
    }
}
