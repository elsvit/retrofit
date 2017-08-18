// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import shortid from 'shortid';
import { default as Counterpart } from 'counterpart';
import { default as Cookie } from 'react-cookie';
// models
import { default as StateNamespace } from './StateNamespace';
// events
import { User as UserEvents } from '../events/index';

class User extends StateNamespace {

    /**
     * @param {Function} dispatch
     * @param {String} stateNamespace
     */
    constructor(dispatch, stateNamespace = 'User') {
        super(dispatch, stateNamespace);
    }

    /**
     * Possible locales
     * @returns {Object}
     */
    get locales() {
        return {
            en_US: 'English',
            de_CH: 'Deutsch'
            //it_CH: 'Italian'
        };
    }

    /**
     * Possible support contacts list
     * @returns {Array}
     */
    get supportContactsList() {
        return _.toArray(require('json!./Data/supportContactsData.json'));
    }

    /**
     * @param code
     * @returns {Object}
     */
    getSupportContactsByCode(code) {
        return _.head(
            _.filter(
                this.supportContactsList,
                { code: code }
            )
        );
    }

    /**
     * Possible locales identifiers
     * @returns {Array}
     */
    get localesIDs() {
        return _.keys(this.locales);
    }

    /**
     * Get default locale identifier
     * @returns {String}
     */
    get defaultLocaleID() {
        return _.head(this.localesIDs);
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Read user identifier
     * @returns {String|undefined}
     */
    get userId() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(getState().User.userId);
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Use user identifier
     * @param {String|undefined} userId
     */
    set userId(userId) {
        this.storeDispatch((dispatch, getState) => {
            if (shortid.isValid(userId)) {
                // throw event about user identification
                dispatch(UserEvents.creators.identification(userId));
            }
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Read user locale
     * @returns {String} locale
     */
    get locale() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(getState().User.locale);
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Use user locale
     * @param {String} locale
     */
    set locale(locale) {
        this.storeDispatch((dispatch, getState) => {
            if (_.includes(this.localesIDs, locale)) {
                Counterpart.setLocale(locale);
                Cookie.save('language', locale, { path: '/' });
                dispatch(UserEvents.creators.locale(locale));
            }
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Read user support contacts
     * @returns {Object} supportContacts
     */
    get supportContacts() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    `${this.stateNamespace}.supportContacts`
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Use user supportContacts
     * @param {Object} supportContacts
     */
    set supportContacts(supportContacts) {
        this.storeDispatch((dispatch, getState) => {
            dispatch(UserEvents.creators.supportContacts(supportContacts));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set user current support contacts by code
     * @param {String} code
     */
    setCurrentSupportContacts(code) {
        return this.storeDispatch((dispatch, getState) => {
            this.supportContacts = this.getSupportContactsByCode(code);
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform initial data load for container
     * @param {Object} parameters
     */
    init(parameters = {}) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('User.init() with parameters', parameters);
            // user
            if (shortid.isValid(this.userId)) { // user already registered
                if (_.isString(parameters.user)) { // but new user id was explicitly provided
                    this.userId = parameters.user;
                }
            } else {
                this.userId = shortid.generate(); // register new user
            }

            // locale
            if (_.includes(this.localesIDs, this.locale)) { // locale already set
                if (_.isString(parameters.locale)) { // but new locale was explicitly provided
                    this.locale = parameters.locale;
                }
            } else {
                this.locale = _.head(this.localesIDs); // locale should have initial value
            }
        });
    }
}

export default User;
