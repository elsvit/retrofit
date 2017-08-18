// libraries
import log from 'loglevel';
import _ from 'lodash';
import { aggregation } from '../../utils/index';
import { PressureReference } from './Reference/index';
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
 * Business-logic & State reading/writing for "Combo" in Retrofit
 */
class Combo extends aggregation(
    StateNamespace,
    Map,
    LoadableMap,
    Filterable
) {
    /**
     * @param {Function} dispatch
     * @param {Object} recommendationModel
     * @param {Object} settingsModel
     * @param {String} stateNamespace
     */
    constructor(
        dispatch,
        recommendationModel,
        settingsModel,
        stateNamespace = 'ValveSizer.Combo'
    ) {
        log.debug('Combo.constructor() started');
        super(dispatch, stateNamespace);
        this.recommendationModel = recommendationModel;
        this.settingsModel = settingsModel;
        this.fqn = 'valvesizer.combo';
        log.debug('Combo.constructor() finished, stateNamespace: ', this.stateNamespace);
    }

    // Internal functional accessors

    /**
     * @returns {Object}
     */
    get recommendationModel() {
        return this._recommendationModel;
    }

    /**
     * @param {Object} recommendationModel
     */
    set recommendationModel(recommendationModel) {
        this._recommendationModel = recommendationModel;
    }

    /**
     * @returns {Object}
     */
    get settingsModel() {
        return this._settingsModel;
    }

    /**
     * @param {Object} settingsModel
     */
    set settingsModel(settingsModel) {
        this._settingsModel = settingsModel;
    }

    /**
     * @returns {Array}
     */
    get filteredCombos() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.uniq(
                    _.map(
                        _.filter(
                            _.get(
                                getState(),
                                this.stateNamespace + '.mapEntities'
                            ),
                            entity => (
                                !_.isEmpty(_.get(entity, 'entityData', {}))
                            )
                        ),
                        (value) => (value.entityData)
                    )
                )
            );
        });
    }

    /**
     * @returns {Array}
     */
    get actuatorsNames() {
        return this.storeDispatch((dispatch, getState) => {
            return _.map(
                this.filteredCombos,
                (value) => (value.actuator)
            );
        });
    }

    /**
     * @returns {Array}
     */
    get actuatorsToValvesMap() {
        return this.storeDispatch((dispatch, getState) => {
            const combos = this.filteredCombos;
            let map = {};
            for (const combo of combos) {
                if (map[combo.actuator] === undefined) {
                    const valves = [combo.valve_id];
                    map[combo.actuator] = valves;
                } else {
                    const valves = map[combo.actuator];
                    valves.push(combo.valve_id);
                    map[combo.actuator] = _.uniq(valves);
                }
            }
            return map;
        });
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform initial data load for container
     * @param {Array} valves
     * @returns {Promise}
     */
    loadByValves(valves) {
        return this.storeDispatch((dispatch, getState) => {
            log.debug('Combo.loadByValves()');

            log.debug('Combo.loadByValves() -> parameters : ', valves);
            const inputParameters = { valve: valves };
            log.debug('Combo.loadByValves() -> this.filterableParameters : ', this.filterableParameters);
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
                        log.debug('Combo.loadByValves(); DataActions.identifiers() identifiers are: ', identifiers);
                        log.debug('Combo.loadByValves(); mapKeys are: ', this.mapKeys);
                        // compare keys in map
                        const isKeysDifferent = !_.isEqual(_.sortBy(identifiers), _.sortBy(this.mapKeys));

                        if (isKeysDifferent) {
                            // need to recreate map entities
                            let poorCombos = {};
                            // creating minimal data
                            _(identifiers).forEach((identifier) => {
                                poorCombos[identifier] = {
                                    entityId: identifier,
                                    entityOrigin: {
                                        fqn: this.fqn,
                                        id: identifier
                                    }
                                };
                            });
                            this.mapEntities = poorCombos;
                        }
                        log.debug('Combo.loadByValves(); mapEntities are:', this.mapEntities);
                        return this.loadMap().then().catch((errorBody) => {throw errorBody;});
                    }
                ).catch(
                    (errorBody) => {
                        // Throw event about load error
                        return dispatch(
                            ApplicationEvents.creators.errorHappened(
                                'Combos loading error',
                                'Identifiers loading by parameters for Combos failed',
                                errorBody
                            )
                        );
                    }
                );
            }
        });
    }

    /**
     * Self-dispatching thunk.
     * @param {String} actuatorName
     * @param valveId
     * @returns {Boolean}
     */
    isAvailableByMaxDifferentialPressure(actuatorName, valveId) {
        return this.storeDispatch((dispatch, getState) => {
            return _.filter(
                _.get(getState(), this.stateNamespace + '.mapEntities'),
                entity => (
                    !_.isEmpty(_.get(entity, 'entityData', {}))
                    && _.get(entity, 'entityData.actuator', '') === actuatorName
                    && _.get(entity, 'entityData.valve_id', '') === valveId
                    && _.get(entity, 'entityData.differential_pressure_max', 0) >= this.getDifferentialPressureMax()
                )
            ).length > 0;
        });
    }

    /**
     * Self-dispatching thunk.
     * @return {Number|String}
     */
    getDifferentialPressureMax() {
        return this.storeDispatch((dispatch, getState) => {
            const pressureUnit = this.settingsModel.pressureUnit;
            const pressureValue = this.recommendationModel.pressureEffective;
            return (pressureValue > 0)
                ? PressureReference.convert(
                    pressureValue,
                    pressureUnit
                )
                : pressureValue;
        });
    }
}

export default Combo;
