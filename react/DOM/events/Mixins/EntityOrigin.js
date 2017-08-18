/**
 * What should happen for abstract 'Entity Origin' functional somewhere in State
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            ENTITY_ORIGIN_FQN: 'ENTITY_ORIGIN_FQN',
            ENTITY_ORIGIN_ID: 'ENTITY_ORIGIN_ID',
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} path
             * @param {String} fqn
             */
            entityOriginFQN: (path, fqn) => ({
                type: this.types.ENTITY_ORIGIN_FQN,
                payload: { path, fqn }
            }),

            /**
             * @param {String} path
             * @param {String} id
             */
            entityOriginID: (path, id) => ({
                type: this.types.ENTITY_ORIGIN_ID,
                payload: { path, id }
            }),
        };
    }
}
