/**
 * What events should happen for abstract 'Map of Entities' somewhere in State
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            MAP_ENTITIES: 'MAP_ENTITIES',
            MAP_ENTITIES_ASSIGN: 'MAP_ENTITIES_ASSIGN',
            MAP_ENTITIES_UNSET: 'MAP_ENTITIES_UNSET',
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} path
             * @param {Object} entities
             */
            mapEntities: (path, entities) => ({
                type: this.types.MAP_ENTITIES,
                payload: { path, entities }
            }),

            /**
             * @param {String} path
             * @param {Number} entities
             */
            mapEntitiesAssign: (path, entities) => ({
                type: this.types.MAP_ENTITIES_ASSIGN,
                payload: { path, entities }
            }),

            /**
             * @param {String} path
             * @param {Array} keys
             */
            mapEntitiesUnset: (path, keys) => ({
                type: this.types.MAP_ENTITIES_UNSET,
                payload: { path, keys }
            })
        };
    }
}
