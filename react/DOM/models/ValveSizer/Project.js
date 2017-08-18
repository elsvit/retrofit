// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import { aggregation } from '../../utils/index';
// models
import { default as StateNamespace } from '../StateNamespace';
import { default as Entity } from '../Mixins/Entity';
import { default as ForeignEntity } from '../Mixins/ForeignEntity';
import { default as LoadableEntity } from '../Mixins/LoadableEntity';
import { default as StorableEntity } from '../Mixins/StorableEntity';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Class.
 * Business-logic & State reading/writing for "Project" in ValveSizer
 */
class Project extends aggregation(
    StateNamespace,
    Entity,
    ForeignEntity,
    LoadableEntity,
    StorableEntity
) {
    /**
     * @param {Function} dispatch
     * @param {Object} userModel
     * @param {Object} projectsModel
     * @param {String} stateNamespace
     */
    constructor(
        dispatch,
        userModel,
        projectsModel,
        stateNamespace = 'ValveSizer.Project'
    ) {
        super(dispatch, stateNamespace);
        this.clearNamespace();
        this.entityOrigin.fqn = 'valvesizer.project';
        this.userModel = userModel;
        this.projectsModel = projectsModel;
        log.debug('Project.constructor() finished');
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
     * @returns {Object}
     */
    get projectsModel() {
        return this._projectsModel;
    }

    /**
     * @param {Object} projectsModel
     */
    set projectsModel(projectsModel) {
        this._projectsModel = projectsModel;
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State reader/writer.
     * Model initializing for container usage
     * @param {Object} routerParams
     * @returns {Promise}
     */
    init(routerParams = {}) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted())
            log.debug('Project.init(' + JSON.stringify(routerParams) + ')');
            const projectId = routerParams.project;
            if (!_.isString(projectId)) {
                // no actions is needed, since there is no projectId
                dispatch(ApplicationEvents.creators.loadComponentFinished());
                return Promise.resolve();
            }
            // Identifying project
            this.entityOrigin.id = projectId;

            // load by Origin
            return this.loadEntity(
                this
            ).then(
                (project) => {
                    // ok, project loaded from cache or backend, what's next?
                    log.debug('Project.init.loadEntity finished');
                    dispatch(ApplicationEvents.creators.loadComponentFinished());
                    return project;
                }
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Project error',
                        'Loading single project from storage failed',
                        errorBody
                    ));
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Create new project with given name
     * @param {String} projectName
     * @returns {Promise}
     */
    create(projectName) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            log.debug('Project.create(' + projectName + ')');
            // Check for project name length
            if (!_.isString(projectName) || _.size(projectName) < 1) {
                dispatch(ApplicationEvents.creators.errorHappened(
                    'Project error',
                    'Project name is empty',
                    ''
                ));
                return Promise.reject('Project name is empty');
            }
            // check if there is already such project
            this.projectsModel.init();
            let existingProjectsWithName = _.filter(
                _.get(getState(), 'ValveSizer.Projects.mapEntities', {}),
                project => (
                    project.entityData.name === projectName
                )
            );

            log.debug('existing projects with same name : ', existingProjectsWithName);

            if (_.size(existingProjectsWithName) > 0) {
                // old project
                let existingProjectWithName = existingProjectsWithName[0];
                this.entityOrigin.fqn = existingProjectWithName.entityOrigin.fqn;
                this.entityOrigin.id = existingProjectWithName.entityOrigin.id;
                this.entityData = existingProjectWithName.entityData;
                return Promise.resolve();
            } else {
                // new data
                let entityData = {};
                entityData.name = projectName;
                this.entityData = entityData;
                // sync project to storage
                return this.save(this);
            }
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Save current state data to storage
     * @param {Object} project
     * @returns {Promise}
     */
    save(project = this) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('Project.save()');

            // now project owner is current user
            let entityData = project.entityData;
            entityData.userId = this.userModel.userId;
            project.entityData = entityData;

            // Save project to storage
            return this.storeEntity(
                project
            ).then(
                (foreignId) => {
                    if (_.size(foreignId) < 1) {
                        throw new Error('Amount of saved records is not equal to 1');
                    }
                    // update external id in project
                    this.entityOrigin.id = foreignId;
                }
            ).catch(
                (errorBody) => {
                    dispatch(ApplicationEvents.creators.errorHappened(
                        'Project error',
                        'Saving project into storage failed',
                        errorBody
                    ));
                }
            );
        });
    }

}

export default Project;
