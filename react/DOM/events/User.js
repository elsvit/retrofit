/**
 * What should happen for 'User'
 */
export default class {
    /**
     * What happened
     */
    static get types() {
        return {
            IDENTIFICATION: 'USER_IDENTIFICATION',
            LOCALE: 'USER_LOCALE',
            SUPPORT_CONTACTS: 'USER_SUPPORT_CONTACTS'
        };
    }

    /**
     * Flux Standard Action creators
     */
    static get creators() {
        return {
            /**
             * @param {String} identifier
             */
            identification: (identifier) => ({
                type: this.types.IDENTIFICATION,
                payload: { identifier }
            }),

            /**
             * @param {String} locale
             */
            locale: (locale) => ({
                type: this.types.LOCALE,
                payload: { locale }
            }),

            /**
             * @param {Object} supportContacts
             */
            supportContacts: (supportContacts) => ({
                type: this.types.SUPPORT_CONTACTS,
                payload: { supportContacts }
            })
        };
    }
}
