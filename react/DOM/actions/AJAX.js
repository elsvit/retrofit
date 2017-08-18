import axios from 'axios';
import URI from 'urijs';
import shortid from 'shortid';
import { AJAX as AJAXEvents, Application as ApplicationEvents } from '../events/index';
import * as SettingsSelectors from '../selectors/Settings';

/**
 * Thunks for AJAX
 */
export default class {
    /**
     * Helper. Some basic axios configuration
     * @returns {Object}
     */
    static get config() {
        return {
            timeout: 5000,
            responseType: 'json'
        };
    }

    /**
     * Thunk. AJAX. HTTP GET expecting JSON result
     * @param {String} url
     * @param {Boolean} dimmer
     * @returns {Function} Promise after dispatching
     */
    static getJSON(url, dimmer = false) {
        return (dispatch, getState) => {
            let id = shortid.generate();
            if (dimmer) {
                dispatch(ApplicationEvents.creators.loadStarted());
            }
            dispatch(
                AJAXEvents.creators.request(id, 'GET', url, Object.assign({}, this.config.headers))
            );
            const uri = new URI(url);
            uri.addSearch({ target: SettingsSelectors.getTargetMarketCode(getState()) });
            return axios
                .create(this.config)
                .get(uri.toString())
                .then(
                    (response) => {
                        dispatch(
                            AJAXEvents.creators.response(id, response.headers, response.data)
                        );
                        if (dimmer) {
                            dispatch(ApplicationEvents.creators.loadFinished());
                        }
                        return response.data;
                    }
                )
                .catch(
                    (response) => {
                        dispatch(
                            AJAXEvents.creators.error(id, response.headers, response.data)
                        );
                        if (dimmer) {
                            dispatch(ApplicationEvents.creators.loadFinished());
                        }
                        throw response.data;
                    }
                );
        };
    }

    /**
     * Thunk. AJAX. HTTP POST expecting JSON result
     * @param {String} url
     * @param {Object} data
     * @param {Boolean} dimmer
     * @returns {Function} Promise after dispatching
     */
    static postJSON(url, data, dimmer = false) {
        return (dispatch, getState) => {
            let id = shortid.generate();
            if (dimmer) {
                dispatch(ApplicationEvents.creators.loadStarted());
            }
            dispatch(
                AJAXEvents.creators.request(id, 'POST', url, Object.assign({}, this.config.headers), data)
            );
            return axios
                .create(this.config)
                .post(url, data)
                .then(
                    (response) => {
                        dispatch(
                            AJAXEvents.creators.response(id, response.headers, response.data)
                        );
                        if (dimmer) {
                            dispatch(ApplicationEvents.creators.loadFinished());
                        }
                        return response.data;
                    }
                )
                .catch(
                    (response) => {
                        dispatch(
                            AJAXEvents.creators.error(id, response.headers, response.data)
                        );
                        if (dimmer) {
                            dispatch(ApplicationEvents.creators.loadFinished());
                        }
                        throw response.data;
                    }
                );
        };
    }
}
