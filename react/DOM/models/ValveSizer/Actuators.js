// libraries
import { default as log } from 'loglevel';
import { aggregation } from '../../utils/index';
// actions
import { Data as DataActions } from '../../actions/index';
// models
import { default as StateNamespace } from '../StateNamespace';
import { default as Map } from '../Mixins/Map';
import { default as LoadableMap } from '../Mixins/LoadableMap';
import { default as Filterable } from '../Mixins/Filterable';
import { default as SameFQN } from '../Mixins/SameFQN';

/**
 * Class.
 * Business-logic & State reading/writing for "Actuators" in ValveSizer
 */
class Actuators extends aggregation(
    StateNamespace,
    Map,
    LoadableMap,
    Filterable,
    SameFQN
) {
    /**
     * @param {Function} dispatch
     * @param {String} stateNamespace
     */
    constructor(dispatch, stateNamespace = 'ValveSizer.Actuators') {
        log.debug('Actuators.constructor() started');
        super(dispatch, stateNamespace);
        this.fqn = 'valvesizer.actuator';
        log.debug('Actuators.constructor() finished, stateNamespace: ', this.stateNamespace, ', fqn: ', this.fqn);
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform initial data load for container
     * @param {Array} names
     * @returns {Promise}
     */
    loadByNames(names) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('Actuators.loadByNames()');

            log.debug('Actuators.loadByNames() -> names : ', names);
            let inputParameters = { title: names };
            log.debug('Actuators.loadByNames() -> this.filterableParameters : ', this.filterableParameters);
            if (
                !_.isEqual(_.isEmpty(this.filterableParameters) || this.filterableParameters, inputParameters)
            ) {
                log.debug('Will set filtering parameters');
                this.filterableParameters = inputParameters;
                // Loading identifiers
                return dispatch(
                    DataActions.identifiers(this.fqn, inputParameters)
                ).then(
                    (identifiers) => {
                        log.debug('Actuators.loadByNames(); DataActions.identifiers() identifiers are: ', identifiers);
                        log.debug('Actuators.loadByNames(); mapKeys are: ', this.mapKeys);
                        // compare keys in map
                        let isKeysDifferent = !_.isEqual(_.sortBy(identifiers), _.sortBy(this.mapKeys));

                        if (isKeysDifferent) {
                            // need to recreate map entities
                            let poorActuators = {};
                            // creating minimal data
                            _(identifiers).forEach((identifier) => {
                                poorActuators[identifier] = {
                                    entityId: identifier,
                                    entityOrigin: {
                                        fqn: this.fqn,
                                        id: identifier
                                    }
                                };
                            });
                            this.mapEntities = poorActuators;
                        }
                        log.debug('Actuators.loadByNames(); mapEntities are:', this.mapEntities);
                        return this.loadMap().then().catch((errorBody) => {throw errorBody;});
                    }
                ).catch(
                    (errorBody) => {
                        // Throw event about load error
                        return dispatch(
                            ApplicationEvents.creators.errorHappened(
                                'Actuators loading error',
                                'Identifiers loading by parameters for Actuators failed',
                                errorBody
                            )
                        );
                    }
                );
            }
        });
    }
}

export default Actuators;
