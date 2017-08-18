/**
 * What should happen for abstract 'SameFQN' functional somewhere in State
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            SAME_FQN: 'SAME_FQN'
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
            fqn: (path, fqn) => ({
                type: this.types.SAME_FQN,
                payload: { path, fqn }
            })
        };
    }
}
