// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
// actions
import { Data as DataActions } from '../../actions/index';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Entity -> Foreign Entity -> Loadable Entity
 * Entity, that could be loaded from external storage
 */
class LoadableEntity {
    /**
     * Aggregation constructor
     */
    initializer() {

    }

    // Mixin sign

    /**
     * Sign of Mixin functional
     * @returns {boolean}
     */
    get isLoadableEntity() {
        return true;
    }

    /**
     * Sign of Mixin functional
     * @param value {*}
     */
    set isLoadableEntity(value) {
        // read-only
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Load entityData by entityOrigin, assuming it is complete
     * @param {Object} entity object with 'Foreign Entity' functional
     * @returns {Promise}
     */
    loadEntity(entity = this) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('LoadableEntity.loadEntity()');
            entity = _.cloneDeep(entity);

            if (!entity.isForeignEntity) {
                let errorBody = JSON.stringify(entity);
                dispatch(ApplicationEvents.creators.errorHappened(
                    'LoadableEntity error',
                    'Argument is not a ForeignEntity',
                    errorBody
                ));
                return Promise.reject(errorBody);
            }

            let poorEntities = {};
            poorEntities[entity.entityId] = entity;

            log.debug('LoadableEntity.loadEntity() poorEntities: ', poorEntities);

            return dispatch(
                DataActions.enrichEntities(poorEntities)
            ).then(
                (richEntities) => {
                    log.debug('LoadableEntity.loadEntity(); Result of DataActions.enrichEntities() is: ', richEntities);
                    if (!_.has(richEntities, entity.entityId)) {
                        throw new Error('LoadableEntity. Expected entity was not found in between loaded');
                    }
                    // udating entityData in state
                    entity.entityData = richEntities[entity.entityId].entityData;
                    return entity;
                }
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'LoadableEntity error',
                        'Loading entity data from storage failed',
                        errorBody
                    ));
                    throw errorBody;
                }
            );
        });
    }
}

export default LoadableEntity;
