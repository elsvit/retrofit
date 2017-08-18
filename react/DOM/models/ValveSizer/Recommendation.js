// libraries
import log from 'loglevel';
import _ from 'lodash';
import {
    FlowReference, PressureReference, FlowPressureCalculator, RecommendationReference, RecommendationReferenceConstants
} from './Reference/index';
// models
import StateNamespace from '../StateNamespace';
// events
import { ValveSizer as ValveSizerEvents } from '../../events/index';

/**
 * Class.
 * Concrete.
 * Business-logic & State reading/writing for "ActuatorsFilter" in ValveSizer
 */
class Recommendation extends StateNamespace {
    constructor(
        dispatch,
        seriesModel,
        settingsModel,
        flowPressureModel,
        stateNamespace = 'ValveSizer.Products.Recommendation'
    ) {
        log.debug('Products.ActuatorsFilter.constructor() started');
        super(dispatch, stateNamespace);
        this.seriesModel = seriesModel;
        this.settingsModel = settingsModel;
        this.flowPressureModel = flowPressureModel;
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
     * @returns {Object}
     */
    get flowPressureModel() {
        return this._flowPressureModel;
    }

    /**
     * @param {Object} flowPressureModel
     */
    set flowPressureModel(flowPressureModel) {
        this._flowPressureModel = flowPressureModel;
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get active matching from state.
     * @returns {Object}
     */
    get activeMatching() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    _.join([this.stateNamespace, 'dnSelection', 'active'], '.')
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get differential pressure from state.
     * @returns {Number}
     */
    get pressureEffective() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    `${this.stateNamespace}.parameters.pressureEffective`
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get matching item from state by index.
     * @returns {Object}
     */
    matchingItemByIndex(index) {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                (_.get(
                    getState(),
                    _.join([this.stateNamespace, 'dnSelection', 'list'], '.')
                ))[index]
            );
        });
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform initial data load for container
     * @param {Object} series
     * @returns {Promise}
     */
    init(series) {
        const matchingList = this.createMatchingList(series);
        this.setMatchingList(matchingList);
        const activeMatching = this.findActiveMatching(matchingList);
        this.setMatching(activeMatching);

        this.updatePressureEffective(activeMatching);

        return Promise.resolve();
    }

    /**
     * Self-dispatching thunk.
     * Calculate matching list sorted in ascending by dn value for actuators filtering.
     * @param {Object} series
     * @returns {Array}
     */
    createMatchingList(series) {
        try {
            const seriesValves = this.seriesModel.seriesFilteredValves(series.family);
            return Recommendation.getMatchingValves(series,
                seriesValves, this.settingsModel.flowUnit, this.flowPressureModel.kv, this.flowPressureModel.flow);
        } catch (e) {
            if (e.name == 'validation') {
                this.setError(e);
            }
            return [];
        }
    }

    static getMatchingValves(series, filteredValves, flowUnit, kv, flow) {
        const list = _.sortBy(_.reduce(filteredValves, (result, valve) => {
            const key = [valve.dn, valve.kvs].join('-');

            let kvst = null;
            if (valve.kvs_theoretical) {
                kvst = _.round(FlowReference.convert(valve.kvs_theoretical, 'm3_h', flowUnit), 3);
            }

            if (!result[key]) {
                result[key] = {
                    dn: valve.dn,
                    kvs: _.round(FlowReference.convert(valve.kvs, 'm3_h', flowUnit), 3),
                    valve_id: valve.id,
                    vNom: valve.vnom,
                    vPosMax1: valve.vpos_max_1,
                    vPosMax2: valve.vpos_max_2,
                    vPosMax3: valve.vpos_max_3,
                    recommendedStatus: "",
                    valveConnection: valve.pipe_connector_count,
                    title: valve.title,
                    medium_temp: valve.medium_temp,
                    kvs_theoretical: kvst,
                    ruleset: valve.ruleset
                };
            }
            return result;
        }, {}), (matchingItem) => (_.toInteger(matchingItem.dn)), ['kvs']);

        return RecommendationReference
            .setRuleSet(series.ruleset)
            .setParameters({
                kv,
                vMax: flow,
                flowUnit: flowUnit,
                valveConnection: _.toInteger(series.pipe_connector_count)
            })
            .apply(list);
    }

    /**
     * @param {Array} matchingList
     * @returns {Object}
     */
    findActiveMatching(matchingList) {
        log.debug('ActuatorsFilter - findActiveMatching. MatchingList:', matchingList);
        if (_.size(matchingList) === 0) {
            return {};
        }
        let recommendedIndex = _.findIndex(matchingList, (item) => {
            return item.recommendedStatus == RecommendationReferenceConstants.RECOMMENDATION_STATUS_ABSOLUTELY;
        });
        return (recommendedIndex >= 0) ? matchingList[recommendedIndex] : _.head(matchingList);
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set effective pressure by active matching item.
     * @param {Object} activeMatching
     * @returns {Promise}
     */
    updatePressureEffective(activeMatching) {
        let pressureEffective = 0;
        if (activeMatching.kvs > 0) {
            const flow = this.flowPressureModel.flow;
            const flowUnit = this.settingsModel.flowUnit;
            const pressureUnit = this.settingsModel.pressureUnit;
            const kvs = activeMatching.kvs;

            FlowPressureCalculator.setFlowUnit(flowUnit);
            FlowPressureCalculator.setPressureUnit(pressureUnit);
            pressureEffective = FlowPressureCalculator.calculateEffectivePressure(flow, kvs);

            if (activeMatching.ruleset === 3 && activeMatching.kvs_theoretical) {
                pressureEffective = FlowPressureCalculator
                    .calculateEffectivePressure(flow, activeMatching.kvs_theoretical);
            }
        }
        this.setPressureEffective(pressureEffective);
    }

    /**
     * Change active matching item and update dependencies.
     * @param {Number} index
     * @returns {Promise}
     */
    changeActiveMatchingItem(index) {
        const newActiveMatchingItem = this.matchingItemByIndex(index);
        this.setMatching(newActiveMatchingItem);
        this.updatePressureEffective(newActiveMatchingItem);
        return Promise.resolve();
    }

    /**
     * @param {String} seriesFamily
     * @returns {Number}
     */
    findPossibleEffectivePressure(seriesFamily) {
        const valves = this.seriesModel.seriesValves(seriesFamily);
        const valveWithMaxEffectivePressure =_.maxBy(valves, (valve) => {
            return (valve.differential_pressure_max) ? valve.differential_pressure_max : 0;
        });
        const pressureUnit = this.settingsModel.pressureUnit;
        const possibleEffectivePressure = (valveWithMaxEffectivePressure) ? valveWithMaxEffectivePressure.differential_pressure_max : 0;
        return PressureReference.convert(possibleEffectivePressure, 'k_pa', pressureUnit);
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of dn selection list.
     * @param {Object} list
     * @returns {Promise}
     */
    setMatchingList(list) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Recommendation.creators.dnSelectionList(list));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of current dn selection item.
     * @param {Object} item
     * @returns {Promise}
     */
    setMatching(item) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Recommendation.creators.dnSelectionActive(item));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of effective pressure.
     * @param {Number} value
     * @returns {Promise}
     */
    setPressureEffective(value) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Recommendation.creators.pressureEffective(value));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of error code.
     * @param {Object} error
     * @returns {Promise}
     */
    setError(error) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Recommendation.creators.error(error));
        });
    }
}

export default Recommendation;
