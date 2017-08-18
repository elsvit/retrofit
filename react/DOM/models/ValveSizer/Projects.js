// libraries
import log from 'loglevel';
import _ from 'lodash';
import { aggregation } from '../../utils/index';
// actions
import { Data as DataActions } from '../../actions/index';
// models
import StateNamespace from '../StateNamespace';
import Map from '../Mixins/Map';
import LoadableMap from '../Mixins/LoadableMap';
import Filterable from '../Mixins/Filterable';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Class.
 * Business-logic & State reading/writing for "Projects"
 */
class Projects extends aggregation(
    StateNamespace,
    Map,
    LoadableMap,
    Filterable
) {
    /**
     * @param {Function} dispatch
     * @param {Object} userModel
     * @param {String} stateNamespace
     */
    constructor(
        dispatch,
        userModel,
        stateNamespace = 'ValveSizer.Projects'
    ) {
        log.debug('Projects.constructor()');
        super(dispatch, stateNamespace);
        this.fqn = 'valvesizer.project';
        this.userModel = userModel;
    }

    // Internal functional accessors

    /**
     * @returns {Object}
     */
    get userModel() {
        return this._userModel;
    }

    /**
     * @param {Object} userModel
     */
    set userModel(userModel) {
        this._userModel = userModel;
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Delete project with given id in storage & update state
     * @param {String} projectId
     */
    delete(projectId) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            dispatch(
                DataActions.delete(this.fqn, this.userModel.userId, [projectId])
            ).then(
                (amount) => {
                    if (amount === 1) {
                        this.mapUnset([projectId]);
                    }
                }
            ).then(() => {
                return dispatch(ApplicationEvents.creators.loadComponentFinished());
            }).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Project error',
                        'Deleting project in storage failed',
                        errorBody
                    ));
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * Perform initial data load for container by route params.
     * @returns {Promise}
     */
    init() {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            log.debug('Projects.init();');
            // set filtering parameters as current userId
            this.filterableParameters = { userId: this.userModel.userId };
            // get identifiers by parameters
            return dispatch(
                DataActions.identifiers(this.fqn, this.filterableParameters)
            ).then(
                (identifiers) => {
                    log.debug('Projects.init(); DataActions.identifiers() identifiers are: ', identifiers);
                    log.debug('Project.init(); mapKeys are: ', this.mapKeys);
                    // compare keys in map
                    const isKeysDifferent = !_.isEqual(_.sortBy(identifiers), _.sortBy(this.mapKeys));

                    if (isKeysDifferent) {
                        // need to recreate map entities
                        let poorProjects = {};
                        // creating minimal data
                        _(identifiers).forEach((identifier) => {
                            poorProjects[identifier] = {
                                entityId: identifier,
                                entityOrigin: {
                                    fqn: this.fqn,
                                    id: identifier
                                }
                            };
                        });
                        this.mapEntities = poorProjects;
                    }
                    log.debug('Projects.init(); mapEntities are:', this.mapEntities);
                    return this.loadMap().then(() => {
                        return dispatch(ApplicationEvents.creators.loadComponentFinished());
                    }).catch((errorBody) => {throw errorBody;});
                }
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Projects error',
                        'Loading identifiers of projects from storage failed',
                        errorBody
                    ));
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }
            );
        });
    }
}

export default Projects;
