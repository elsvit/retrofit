/**
 * Class.
 * Whatever inherits this MAY contain self-dispatching thunks via provided Redux's store.dispatch function
 */
class Thunks {
    /**
     * @param {Function} dispatch
     */
    constructor(dispatch) {
        this.storeDispatch = dispatch;
    }

    /**
     * Get dispatch function
     * @returns {Function}
     */
    get storeDispatch() {
        return this._dispatch;
    }

    /**
     * Set dispatch function
     * @param {Function} dispatch
     */
    set storeDispatch(dispatch) {
        this._dispatch = dispatch;
    }
}

export default Thunks;
