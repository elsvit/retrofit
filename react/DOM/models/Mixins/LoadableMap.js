// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
// actions
import { Data as DataActions } from '../../actions/index';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Mixin.
 * State Namespace -> Map -> Loadable Map
 * How entities within map can be bulk-loaded from external storage if they are loadable?
 */
class LoadableMap {
    /**
     * Aggregation constructor
     */
    initializer() {

    }

    /**
     * Sign of Mixin functional
     * @returns {boolean}
     */
    get isLoadableMap() {
        return true;
    }

    /**
     * Sign of Mixin functional
     * @param value {*}
     */
    set isLoadableMap(value) {
        // read-only
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Load entities in map, assuming they are loadable and have complete origin
     * @param {Object} map Object with 'Map' mixin functional
     * @returns {Promise}
     */
    loadMap(map = this) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('LoadableMap.loadMap();');
            map = _.cloneDeep(map);

            if (!map.isMap) {
                let errorBody = JSON.stringify(map);
                dispatch(ApplicationEvents.creators.errorHappened(
                    'LoadableMap error',
                    'Argument is not a Map',
                    errorBody
                ));
                return Promise.reject(errorBody);
            }

            log.debug('LoadableMap.loadMap(); stateNamespace is: ', this.stateNamespace);

            let loadableEntities = map.mapEntities;

            log.debug('LoadableMap.loadMap(); loadableEntities are: ', loadableEntities);

            return dispatch(
                DataActions.enrichEntities(loadableEntities)
            ).then(
                (richEntities) => {
                    log.debug('LoadableMap.loadMap(); DataActions.enrichEntities() richEntities are:', richEntities);
                    if (_.size(loadableEntities) !== _.size(richEntities)) {
                        throw new Error('LoadableMap. Size of loaded entities differs from what expected');
                    }
                    map.mapAssign(richEntities);
                    return map;
                }
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'LoadableMap error',
                        'Loading entities data from storage failed',
                        errorBody
                    ));
                    throw errorBody;
                }
            );
        });
    }
}

export default LoadableMap;
