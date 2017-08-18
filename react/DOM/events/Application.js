/**
 * What should happen for 'Application'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            LOAD_STARTED: 'APPLICATION_LOAD_STARTED',
            LOAD_FINISHED: 'APPLICATION_LOAD_FINISHED',
            LOAD_COMPONENT_STARTED: 'APPLICATION_LOAD_COMPONENT_STARTED',
            LOAD_COMPONENT_FINISHED: 'APPLICATION_LOAD_COMPONENT_FINISHED',
            ERROR_HAPPENED: 'APPLICATION_ERROR_HAPPENED',
            ERROR_DELIVERED: 'APPLICATION_ERROR_DELIVERED'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            loadStarted: () => ({
                type: this.types.LOAD_STARTED
            }),

            loadFinished: () => ({
                type: this.types.LOAD_FINISHED
            }),

            loadComponentStarted: () => ({
                type: this.types.LOAD_COMPONENT_STARTED
            }),

            loadComponentFinished: () => ({
                type: this.types.LOAD_COMPONENT_FINISHED
            }),

            /**
             * @param {String} header
             * @param {String} body
             * @param {String} exceptionValue
             */
            errorHappened: (header, body, exceptionValue) => ({
                type: this.types.ERROR_HAPPENED,
                error: true,
                payload: { header, body, exceptionValue }
            }),

            errorDelivered: () => ({
                type: this.types.ERROR_DELIVERED,
                error: false,
                payload: {}
            })
        };
    }
}
