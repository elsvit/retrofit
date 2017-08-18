// libraries
import _ from 'lodash';
import { djbTo16 } from '../../utils/index';
// models
import { StateNamespace } from '../index';
// events
import { Mixins as MixinsEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Entity Origin
 * How to identify frontend entity in external storage?
 */
class EntityOrigin extends StateNamespace {
    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Entity Fully Qualified Name in external storage
     * (f.e. MongoDB collection name, or Schema + Table in RDMS, or full path to JSON file on disk)
     * @returns {String|undefined}
     */
    get fqn() {
        return this.storeDispatch((dispatch, getState) => {
            let fqn = _.get(getState(), this.stateNamespace + '.fqn');
            return fqn;
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Entity Fully Qualified Name in external storage
     * (f.e. MongoDB collection name, or Schema + Table in RDMS, or full path to JSON file on disk)
     * @param {String|undefined} fqn
     */
    set fqn(fqn) {
        this.storeDispatch((dispatch, getState) => {
            dispatch(MixinsEvents.EntityOrigin.creators.entityOriginFQN(this.stateNamespace, fqn));
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Entity indentifier under FQN
     * (f.e. MongoDB ObjectId or primary key of table in RDMS, or some key in JSON in single file)
     * (also could be not a PK, but rather some surrogate key, when f.e. key should not be guessable)
     * @returns {String|undefined}
     */
    get id() {
        return this.storeDispatch((dispatch, getState) => {
            let id = _.get(getState(), this.stateNamespace + '.id');
            return id;
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Entity indentifier under FQN
     * (f.e. MongoDB ObjectId or primary key of table in RDMS, or some key in JSON in single file)
     * (also could be not a PK, but rather some surrogate key, when f.e. key should not be guessable)
     * @param {String|undefined} id
     */
    set id(id) {
        this.storeDispatch((dispatch, getState) => {
            dispatch(MixinsEvents.EntityOrigin.creators.entityOriginID(this.stateNamespace, id));
        });
    }

    // Business-logic

    /**
     * Check if there is enough indformation to identify entity in external storage
     * @returns {Boolean}
     */
    get isComplete() {
        return (_.isString(this.fqn) && _.isString(this.id));
    }

    /**
     * Get long string representation of complete Origin
     * @returns {string}
     */
    get full() {
        return (this.id + '@' + this.fqn);
    }

    /**
     * Static helper.
     * @param {Object} data
     * @returns {string}
     */
    static full(data) {
        let { fqn } = data;
        let { id } = data;
        return (id + '@' + fqn);
    }

    /**
     * Static helper.
     * @param {Object} data
     * @returns {boolean}
     */
    static isComplete(data) {
        let { fqn } = data;
        let { id } = data;
        return (_.isString(fqn) && _.isString(id));
    }

    /**
     * Get short string representation of complete Origin
     * @returns {String}
     */
    get short() {
        return djbTo16(this.full);
    }
}

export default EntityOrigin;
