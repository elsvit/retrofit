// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import { aggregation } from '../../utils/index';
import { push as pushPath } from 'react-router-redux';
// models
import { default as StateNamespace } from '../StateNamespace';
import { default as Map } from '../Mixins/Map';
import { default as LoadableMap } from '../Mixins/LoadableMap';
import { default as Filterable } from '../Mixins/Filterable';
// events
import { Application as ApplicationEvents, ValveSizer as ValveSizerEvents } from '../../events/index';

/**
 * Class.
 * Concrete.
 * Business-logic & State reading/writing for "Products" in ValveSizer
 */
class Products extends aggregation(
    StateNamespace,
    Map,
    LoadableMap,
    Filterable
) {
    constructor(
        dispatch,
        seriesModel,
        comboModel,
        actuatorsModel,
        recommendationModel,
        stateNamespace = 'ValveSizer.Products'
    ) {
        log.debug('Products.constructor() started');
        super(dispatch, stateNamespace);
        this.seriesModel = seriesModel;
        this.comboModel = comboModel;
        this.actuatorsModel = actuatorsModel;
        this.recommendationModel = recommendationModel;
    }

    // Internal functional accessors

    /**
     * @returns {Object}
     */
    get seriesModel() {
        return this._seriesModel;
    }

    /**
     * @param {Object} seriesModel
     */
    set seriesModel(seriesModel) {
        this._seriesModel = seriesModel;
    }

    /**
     * @returns {Object}
     */
    get comboModel() {
        return this._comboModel;
    }

    /**
     * @param {Object} comboModel
     */
    set comboModel(comboModel) {
        this._comboModel = comboModel;
    }

    /**
     * @returns {Object}
     */
    get actuatorsModel() {
        return this._actuatorsModel;
    }

    /**
     * @param {Object} actuatorsModel
     */
    set actuatorsModel(actuatorsModel) {
        this._actuatorsModel = actuatorsModel;
    }

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
     * Self-dispatching thunk.
     * State reader.
     * Get buffered actuators from state.
     * @returns {Object}
     */
    get actuatorsBuffer() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.Result.actuatorsBuffer'
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get result series from state.
     * @returns {Object}
     */
    get series() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.Result.series'
                )
            );
        });
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform initial data load for container
     * @param {Object} routerParams
     * @returns {Promise}
     */
    init(routerParams = {}) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            // @todo refactor
            log.debug('Products.init(' + JSON.stringify(routerParams) + ')');
            const seriesFamily = routerParams.series;
            if (!_.isString(seriesFamily)) {
                // no actions is needed, since there is no projectId
                return;
            }

            return this.seriesModel.init().then(() => {
                const series = this.seriesModel.seriesByFamily(seriesFamily);
                if (!series) {
                    dispatch(pushPath('/valve-sizer/series'));
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }

                this.setSeries(series);

                this.comboModel.stateNamespace = this.stateNamespace + '.Combo';
                this.comboModel.clearNamespace();
                this.actuatorsModel.stateNamespace = this.stateNamespace + '.Actuators';
                this.actuatorsModel.clearNamespace();

                if (_.isEmpty(series.valves)) {
                    log.debug('Products.init: valves of series is empty');
                    return this.recommendationModel.init(series).then(() => {
                        this.resetActuators();
                        const possibleEffectivePressure =
                            this.recommendationModel.findPossibleEffectivePressure(seriesFamily);
                        if (possibleEffectivePressure >= 0) {
                            this.recommendationModel.setError({
                                name: 'validation',
                                message: 'select_possible_differential_pressure_value',
                                firstPossibleValue: possibleEffectivePressure
                            });
                        }
                    }).then(() => {
                        dispatch(ApplicationEvents.creators.loadComponentFinished());
                    });
                }

                return this.recommendationModel.init(series).then(() => {
                    // loading combo
                    log.debug('Combo.loadByValves() loading combo. Combo are: ', this.comboModel);
                    return this.comboModel.loadByValves(series.valves).then(() => {
                        const actuatorsNames = this.comboModel.actuatorsNames;
                        log.debug('Products.init(). ActuatorsNames: ', actuatorsNames);
                        if (_.size(actuatorsNames) === 0) {
                            this.resetActuators();
                        }
                        const actuatorsToValvesMap = this.comboModel.actuatorsToValvesMap;
                        // loading actuators
                        return this.actuatorsModel.loadByNames(actuatorsNames).then((map) => {
                            const actuators = _.cloneDeep(
                                _.map(
                                    _.filter(
                                        map.mapEntities,
                                        entity => !_.isEmpty(_.get(entity, 'entityData', {}))
                                    ),
                                    (value) => {
                                        let actuator = value.entityData;
                                        actuator.valves_ids = (actuatorsToValvesMap[actuator.title] !== undefined)
                                            ? actuatorsToValvesMap[actuator.title]
                                            : [];
                                        return actuator;
                                    }
                                )
                            );
                            log.debug('Products.init(). Actuators buffer: ', actuators);
                            this.setActuatorsBuffer(actuators);

                            return Promise.resolve(this.matchActuators()).then(() => {
                                return dispatch(ApplicationEvents.creators.loadComponentFinished());
                            });
                        });
                    });
                });
            });
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Match actuators from actuators buffer by active matching item.
     * @returns {Promise}
     */
    matchActuators() {
        return this.storeDispatch((dispatch, getState) => {
            const activeMatching = this.recommendationModel.activeMatching;
            const matchedActuators = _.filter(
                _.map(
                    this.actuatorsBuffer,
                    (actuator) => {
                        actuator.valves_ids = _.intersection(actuator.valves_ids, [activeMatching.valve_id]);
                        return actuator;
                    }
                ),
                (actuator) => (
                    _.size(actuator.valves_ids) > 0
                    && this.comboModel.isAvailableByMaxDifferentialPressure(actuator.title, actuator.valves_ids[0])
                )
            );
            return this.setActuators(matchedActuators);
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Change active matching item and update dependencies.
     * @param {Number} index
     * @returns {Promise}
     */
    changeActiveMatchingItem(index) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            return this.recommendationModel.changeActiveMatchingItem(index).then(() => {
                this.matchActuators();
                return dispatch(ApplicationEvents.creators.loadComponentFinished());
            });
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of series family.
     * @param {Object} series
     * @returns {Promise}
     */
    setSeries(series) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Products.creators.series(series));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of actuators.
     * @param {Object} actuators
     * @returns {Promise}
     */
    setActuators(actuators) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Products.creators.actuators(actuators));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Reset of actuators.
     * @returns {Promise}
     */
    resetActuators() {
        return this.storeDispatch((dispatch, getState) => {
           return this.setActuators([]);
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of actuators buffer.
     * @param {Object} actuators
     * @returns {Promise}
     */
    setActuatorsBuffer(actuators) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Products.creators.actuatorsBuffer(actuators));
        });
    }
}

export default Products;
