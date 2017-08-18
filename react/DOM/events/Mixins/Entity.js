/**
 * What events should happen for abstract 'Entity' somewhere in State
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            ENTITY_IDENTIFIER: 'ENTITY_IDENTIFIER',
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} path
             * @param {String} identifier
             */
            entityIdentifier: (path, identifier) => ({
                type: this.types.ENTITY_IDENTIFIER,
                payload: { path, identifier }
            })
        };
    }
}
