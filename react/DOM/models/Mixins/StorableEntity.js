// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
// actions
import { Data as DataActions } from '../../actions/index';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Entity -> Foreign Entity -> Storable Entity
 * Entity, that could be stored to external storage
 */
class StorableEntity {
    /**
     * Aggregation constructor
     */
    initializer() {

    }

    /**
     * Sign of Mixin functional
     * @returns {boolean}
     */
    get isStorableEntity() {
        return true;
    }

    /**
     * Sign of Mixin functional
     * @param value {*}
     */
    set isStorableEntity(value) {
        // read-only
    }

    /**
     * Self-dispatching thunk.
     * Store Entity using its entityOrigin
     * @param {Object} entity
     * @returns {Promise}
     */
    storeEntity(entity = this) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('StorableEntity.storeEntity()');
            entity = _.cloneDeep(entity);

            if (!entity.isForeignEntity) {
                let errorBody = JSON.stringify(entity);
                dispatch(ApplicationEvents.creators.errorHappened(
                    'StorableEntity error',
                    'Argument is not a ForeignEntity',
                    errorBody
                ));
                return Promise.reject(errorBody);
            }
            return dispatch(
                DataActions.save(entity.entityOrigin.fqn, [entity])
            ).then(
                (frontendToBackendMap) => (_.head(_.values(frontendToBackendMap)))
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'StorableEntity error',
                        'Saving entity data to storage failed',
                        errorBody
                    ));
                    throw errorBody;
                }
            );
        });
    }
}

export default StorableEntity;
