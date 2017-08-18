/**
 * What should happen for 'Cache'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            SET: 'CACHE_SET',
            UNSET: 'CACHE_UNSET',
            PURGE: 'CACHE_PURGE'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {Object} map
             */
            set: (map) => ({
                type: this.types.SET,
                payload: { map }
            }),

            /**
             * @param {String[]} keys
             */
            unset: (keys) => ({
                type: this.types.UNSET,
                payload: { keys }
            }),

            purge: () => ({
                type: this.types.PURGE
            })
        };
    }
}
