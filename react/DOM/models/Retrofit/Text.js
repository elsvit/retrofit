// libraries
import _ from 'lodash';
// models
import { default as StateNamespace } from '../StateNamespace';
// events
import { Retrofit as RetrofitEvents } from '../../events/index';

/**
 * Business-logic & State reading/writing for text search for "Originals" in Retrofit
 */
class Text extends StateNamespace {
    /**
     * @param {Function} dispatch
     * @param {String} stateNamespace
     */
    constructor(dispatch, stateNamespace = 'Retrofit.Text') {
        super(dispatch, stateNamespace);
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set value of search text
     * @param {String} value
     */
    set value(value) {
        return this.storeDispatch((dispatch, getState) => {
            // throwing event
            dispatch(RetrofitEvents.Text.creators.entered(value));
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get value of search text
     * @returns {String}
     */
    get value() {
        return this.storeDispatch((dispatch, getState) => {
            return _.get(
                getState(),
                this.stateNamespace + '.value'
            );
        });
    }
}

export default Text;
