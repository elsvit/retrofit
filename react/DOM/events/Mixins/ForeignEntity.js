/**
 * What should happen for abstract 'Foreign Entity' functional somewhere in State
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            FOREIGN_ENTITY_DATA: 'FOREIGN_ENTITY_DATA',
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} path
             * @param {Object} data
             */
            foreignEntityData: (path, data) => ({
                type: this.types.FOREIGN_ENTITY_DATA,
                payload: { path, data }
            })
        };
    }
}
