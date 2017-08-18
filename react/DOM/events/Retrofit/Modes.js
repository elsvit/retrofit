/**
 * What events should happen for 'Mode'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            DEVICE_CHANGED: 'RETROFIT_MODES_DEVICE_CHANGED',
            SEARCH_CHANGED: 'RETROFIT_MODES_SEARCH_CHANGED'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} deviceMode
             */
            deviceChanged: (deviceMode) => ({
                type: this.types.DEVICE_CHANGED,
                payload: { deviceMode }
            }),

            /**
             * @param {String} searchMode
             */
            searchChanged: (searchMode) => ({
                type: this.types.SEARCH_CHANGED,
                payload: { searchMode }
            }),
        };
    }
}
