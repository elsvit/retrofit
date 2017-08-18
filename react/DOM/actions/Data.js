// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import { Provider as DataProvider } from '../data/index';
// actions
import { Cache as CacheActions } from './index';
// models
import { EntityOrigin } from '../models/Mixins/index';
// events
import { Application as ApplicationEvents } from '../events/index';

/**
 * Thunks for Data Access
 * Work here is only with serialized data from Redux state or plain JSON objects
 */
export default new class {
    /**
     * @param {Object} Provider
     */
    constructor(Provider) {
        this.Provider = Provider;
    }

    /**
     * @returns {Object}
     */
    get Provider() {
        return this._Provider;
    }

    /**
     * @param {Object} Provider
     */
    set Provider(Provider) {
        this._Provider = Provider;
    }

    /**
     * Thunk. Get some information about entities filtered by given parameters via data Provider
     * @param {String} entityFQN
     * @param {Object} parameters Plain JSON object from Redux state
     * @returns {Function} Promise after dispatching
     */
    metadata(entityFQN, parameters) {
        return (dispatch, getState) =>
            dispatch(
                this.Provider.metadata(entityFQN, parameters)
            ).then(
                (metadata) => (metadata)
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Data error',
                        'Fetching metadata from storage failed',
                        errorBody
                    ));
                    throw errorBody;
                }
            );
    }

    /**
     * Thunk. Get identifiers of entities filtered by given parameters via data Provider
     * @param {String} entityFQN
     * @param {Object} parameters Plain JSON object from Redux state
     * @returns {Function} Promise after dispatching
     */
    identifiers(entityFQN, parameters) {
        return (dispatch, getState) =>
            dispatch(
                this.Provider.identifiers(entityFQN, parameters)
            ).then(
                (identifiers) => (identifiers)
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Data error',
                        'Fetching identifiers from storage failed',
                        errorBody
                    ));
                    throw errorBody;
                }
            );
    }

    /**
     * Thunk.
     * Get identifiers of entities filtered by given parameters via data Provider
     * @param {String} entityFQN
     * @param {String} queryString
     * @returns {Function} Promise after dispatching
     */
    search(entityFQN, queryString) {
        return (dispatch, getState) =>
            dispatch(
                this.Provider.search(entityFQN, queryString)
            ).then(
                (identifiers) => (identifiers)
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Data error',
                        'Searching for identifiers in storage failed',
                        errorBody
                    ));
                    throw errorBody;
                }
            );
    }

    /**
     * Thunk. Get entities by given identifiers from either local Redux state or from data Provider
     * @param {String} entityFQN
     * @param {String[]} identifiers
     * @returns {Function} Promise after dispatching
     */
    entities(entityFQN, identifiers) {
        return (dispatch, getState) => {
            // what identitfiers are already in state?
            let identifiersInCache = _.filter(identifiers, identifier =>
                dispatch(CacheActions.has(EntityOrigin.full({ fqn: entityFQN, id: identifier })))
            );

            // what identifiers from required are missing in state?
            let identifiersToProvide = _.difference(identifiers, identifiersInCache);

            if (identifiersToProvide.length > 0) {
                // fetching missing entities from Provider
                return dispatch(
                    this.Provider.filter(entityFQN, { id: identifiersToProvide })
                ).then(
                    (entitiesData) => {
                        // placing new entities into Cache
                        dispatch(
                            CacheActions.set(
                                _.mapKeys(entitiesData, (entityData, key) =>
                                    EntityOrigin.full({ fqn: entityFQN, id: entityData.id })
                                )
                            )
                        );
                        // retrurning all required entities from State
                        return dispatch(
                            this.fromState(entityFQN, identifiers)
                        );
                    }
                ).catch(
                    (errorBody) => {
                        dispatch(ApplicationEvents.creators.errorHappened(
                            'Data error',
                            'Fetching entities from storage failed',
                            errorBody
                        ));
                        throw errorBody;
                    }
                );
            }
            // no fetching required, just get state entities
            return Promise.resolve(
                dispatch(
                    this.fromState(entityFQN, identifiers)
                )
            );
        };
    }

    /**
     * Thunk. Save provided entities via data Provider
     * @param {Object|Array} entities Plain JSON object from Redux state
     * @returns {Function} Promise after dispatching
     */
    save(entityFQN, entities) {
        return (dispatch, getState) => {
            log.debug('Data.save()');
            // [ entityId => (entityOrigin.id + entityData), ... ]
            let saveMap = _.mapValues(
                _.keyBy(_.values(entities), entity => entity.entityId),
                entity => _.assign({ id: entity.entityOrigin.id }, entity.entityData)
            );

            return dispatch(
                this.Provider.save(entityFQN, saveMap)
            ).then(
                (frontendToBackendMap) => {
                    // If sizes of arrays are the same
                    if (_.size(frontendToBackendMap) === _.size(saveMap)) {
                        // Placing new entities into Cache
                        let backendToFrontendMap = _.invert(frontendToBackendMap);
                        let cacheMap = _.mapValues(
                            backendToFrontendMap,
                            (frontKey, backendKey) => _.assign(saveMap[frontKey], { id: backendKey })
                        );
                        dispatch(
                            CacheActions.set(
                                _.mapKeys(cacheMap, (entity, key) => EntityOrigin.full({ fqn: entityFQN, id: key }))
                            )
                        );
                    }
                    return frontendToBackendMap;
                }
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Data error',
                        'Saving entities to storage failed',
                        errorBody
                    ));
                    throw errorBody;
                }
            );
        };
    }

    /**
     * Thunk. Delete entities by provided identifiers via data Provider
     * @param {String} entityFQN
     * @param {String} userId
     * @param {String[]} identifiers
     * @returns {Function} Promise after dispatching
     */
    delete(entityFQN, userId, identifiers) {
        return (dispatch, getState) => {
            log.debug('Data.delete(); ', entityFQN, userId, identifiers);
            return dispatch(
                this.Provider.delete(
                    entityFQN,
                    _.map(identifiers, identifier => ({ userId, id: identifier }))
                )
            ).then(
                (amount) => {
                    amount = _.toSafeInteger(amount);
                    if (amount === identifiers.length) {
                        dispatch(CacheActions.unset(
                            _.map(identifiers, identifier => EntityOrigin.full({ fqn: entityFQN, id: identifier }))
                        ));
                    }
                    return amount;
                }
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Data error',
                        'Removing entities in storage failed',
                        errorBody
                    ));
                    throw errorBody;
                }
            );
        };
    }

    /**
     * Thunk. Opportunistically get entities from Redux state by given path & keys
     * @param {String} entityFQN
     * @param {Object} identifiers
     * @returns {Function} Array after dispatching
     */
    fromState(entityFQN, identifiers) {
        return (dispatch, getState) =>
            _.values(
                dispatch(
                    CacheActions.get(
                        _.map(identifiers, identifier => EntityOrigin.full({ fqn: entityFQN, id: identifier }))
                    )
                )
            );
    }

    /**
     * Take collection of entities and load their 'entityData' by 'entityOrigin' from remote storage,
     * while maintaining object keys.
     * @param {Object} poorEntities {entityId1: entity1, entityId2: entity2, ...}
     * @returns {Function} Promise after dispatching
     */
    enrichEntities(poorEntities) {
        return (dispatch, getState) => {
            log.debug('Data.enrichEntities();', poorEntities);
            poorEntities = _.cloneDeep(poorEntities);

            // some clean-ups
            poorEntities = _.pickBy(
                poorEntities,
                (entity) => (entity && entity.entityOrigin && EntityOrigin.isComplete(entity.entityOrigin))
            );

            log.debug('Data.enrichEntities(); after clean-ups: ', poorEntities);

            // group entities by origin's fqn
            let groupedByFQN = {};
            _.forEach(poorEntities, (entity) => {
                if (!_.has(groupedByFQN, entity.entityOrigin.fqn)) {
                    groupedByFQN[entity.entityOrigin.fqn] = [];
                }
                groupedByFQN[entity.entityOrigin.fqn].push(entity.entityOrigin.id);
            });

            // making single promise from many
            let fqns = [];
            let promises = [];
            _.forEach(groupedByFQN, (identifiers, entityFQN) => {
                fqns.push(entityFQN);
                promises.push(dispatch(this.entities(entityFQN, identifiers)));
            });

            return Promise.all(
                promises
            ).then(
                (values) => {
                    // combining again and iterating
                    let richEntities = {};
                    _.forEach(_.zipObject(fqns, values), (entityDatas, entityFQN) => {
                        _.forEach(entityDatas, (entityData) => {
                            _.forEach(poorEntities, (poorEntity, poorEntityId) => {
                                if (
                                    poorEntity.entityOrigin.fqn === entityFQN
                                    &&
                                    poorEntity.entityOrigin.id === entityData.id
                                ) {
                                    richEntities[poorEntityId] = _.cloneDeep(poorEntity);
                                    richEntities[poorEntityId].entityData = _.cloneDeep(entityData);
                                }
                            });
                        });
                    });
                    return richEntities;
                }
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Data error',
                        'Enriching entities from storage failed',
                        errorBody
                    ));
                    throw errorBody;
                }
            );
        };
    }

}(DataProvider);
