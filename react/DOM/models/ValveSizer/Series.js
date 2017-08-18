// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import { aggregation } from '../../utils/index';
import { push as pushPath } from 'react-router-redux';
import { PressureReference, FlowReference, FlowPressureCalculator } from './Reference/index';
// actions
import { Data as DataActions } from '../../actions/index';
// models
import StateNamespace from '../StateNamespace';
import Map from '../Mixins/Map';
import LoadableMap from '../Mixins/LoadableMap';
import Filterable from '../Mixins/Filterable';
import Recommendation from './Recommendation';

// events
import { Application as ApplicationEvents, ValveSizer as ValveSizerEvents } from '../../events/index';

/**
 * Class.
 * Concrete.
 * Business-logic & State reading/writing for "Series" in ValveSizer
 */
class Series extends aggregation(
    StateNamespace,
    Map,
    LoadableMap,
    Filterable
) {
    constructor(
        dispatch,
        propertiesModel,
        flowPressureModel,
        settingsModel,
        userModel,
        stateNamespace = 'ValveSizer.Series'
    ) {
        log.debug('Series.constructor() started');
        super(dispatch, stateNamespace);
        this.propertiesModel = propertiesModel;
        this.flowPressureModel = flowPressureModel;
        this.settingsModel = settingsModel;
        this.userModel = userModel;
        this.fqn = 'valvesizer.valve';
        log.debug('Series.constructor() finished stateNamespace: ', this.stateNamespace, ' fqn: ', this.fqn);
    }

    // Internal functional accessors

    /**
     * @returns {Object}
     */
    get propertiesModel() {
        return this._propertiesModel;
    }

    /**
     * @param {Object} propertiesModel
     */
    set propertiesModel(propertiesModel) {
        this._propertiesModel = propertiesModel;
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
     * @param {String} family
     * @returns {Object}
     */
    seriesByFamily(family) {
        return this.storeDispatch((dispatch, getState) => {
            let series = _.cloneDeep(
                _.head(
                    _.filter(
                        _.get(
                            getState(),
                            this.stateNamespace + '.Result.list'
                        ),
                        (value) => { return value.family == family; }
                    )
                )
            );
            if (!series) {
                series = _.cloneDeep(
                    _.head(
                        _.filter(
                            this.valvesByCountry(this.valves, this.userCountryCode()),
                            (value) => { return value.family == family; }
                        )
                    )
                );
                if (series) {
                    series.valves = [];
                    series.dn = [];
                }
            }
            return series;
        });
    }

    /**
     * @returns {Array}
     */
    get valves() {
        return this.storeDispatch((dispatch, getState) => (
            _.cloneDeep(
                _.map(
                    _.filter(
                        _.get(
                            getState(),
                            this.stateNamespace + '.mapEntities'
                        ),
                        value => _.isObject(value.entityData)
                    ),
                    (value) => (value.entityData)
                )
            )
        ));
    }

    valvesByCountry(valves, countryCode) {
        if (countryCode != 'GER') {
            return valves;
        }

        // for Germany series of this family must be hidden
        const exceptionFamilyShort = "PIQCV";

        return _.filter(
            valves,
            value => !(value.family_short === exceptionFamilyShort)
        );
    }

    userCountryCode() {
        const userCountry = this.userModel.supportContacts;
        return (userCountry.code !== undefined) ? userCountry.code : '';
    }

    /**
     * @returns {Array}
     */
    get filteredValves() {
        return this.storeDispatch((dispatch, getState) => {
            const flowUnit = this.settingsModel.flowUnit;
            const pressureUnit = this.settingsModel.pressureUnit;
            const flow = FlowReference.convert(this.flowPressureModel.flow, flowUnit, 'm3_h');
            const userCountryCode = this.userCountryCode();

            if (!flow || _.toNumber(flow) < 0) {
                return this.valvesByCountry(this.valves, userCountryCode);
            }
            FlowPressureCalculator.setFlowUnit(flowUnit);
            FlowPressureCalculator.setPressureUnit(pressureUnit);

            return this.valvesByCountry(
                _.cloneDeep(
                    _.map(
                        _.filter(
                            _.get(
                                getState(),
                                 this.stateNamespace + '.mapEntities'
                            ),
                            value => {
                                if (!_.isObject(value.entityData)
                                    || value.entityData.kvs === undefined
                                    || value.entityData.differential_pressure_max === undefined
                                ) {
                                    return false;
                                }

                                const pressureEffective
                                    = FlowPressureCalculator.calculateEffectivePressure(flow, value.entityData.kvs);

                                const isPressureIndependent = value.entityData.valve_pressure_def === 'pressure_independent';

                                return (
                                    isPressureIndependent
                                    || value.entityData.differential_pressure_max > pressureEffective
                                    || value.entityData.differential_pressure_max === 0
                                );
                            }
                        ),
                        (value) => (value.entityData)
                    )
                ),
                userCountryCode
            );
        });
    }

    /**
     * @param {String} family
     * @returns {Object}
     */
    seriesValves(family) {
        return _.filter(
            this.valves,
            value => (value.family === family)
        );
    }

    /**
     * @param {String} family
     * @returns {Object}
     */
    seriesFilteredValves(family) {
        return _.filter(
            this.filteredValves,
            value => (value.family === family)
        );
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
            log.debug('Series.init(' + JSON.stringify(routerParams) + ')');
            const back = (routerParams['back'] !== undefined);

            log.debug('Series.init() -> parameters : ', this.propertiesModel.propertiesWithValues());
            const inputParameters = this.propertiesModel.propertiesWithValues();
            log.debug('Series.init() -> this.filterableParameters : ', this.filterableParameters);
            if (
                !_.isEqual(_.isEmpty(this.filterableParameters) || this.filterableParameters, inputParameters)
            ) {
                log.debug('Series.init() -> Will set filtering parameters');
                // @todo mapping
                let mappedInputParameters = {};
                const map = {
                    'application': 'valve_pressure_def',
                    'ventilator': 'valve_def',
                    'valve_connection': 'pipe_connector_type_def',
                    'connections': 'pipe_connector_count',
                    'pn_selections': 'pn',
                };
                for (const property in inputParameters) {
                    if (map.hasOwnProperty(property)) {
                        let values = inputParameters[property];
                        if (property == 'ventilator') {
                            const shutOffIndex = _.indexOf(values, 'shut_off_and_diverter_valve');
                            if (shutOffIndex >= 0) {
                                _.pullAt(values, shutOffIndex);
                                values = _.concat(values, ['change_over_valve', 'shut_off_valve']);
                            }
                        }
                        mappedInputParameters[map[property]] = values;
                    }
                }
                log.debug('Series.init() -> mappedInputParameters', mappedInputParameters);
                this.filterableParameters = mappedInputParameters;
                this.setValues({});
                // Loading identifiers
                return dispatch(
                    DataActions.identifiers(this.fqn, mappedInputParameters)
                ).then(
                    (identifiers) => {
                        log.debug('Series.init(); DataActions.identifiers() identifiers are: ', identifiers);
                        log.debug('Series.init(); mapKeys are: ', this.mapKeys);
                        // compare keys in map
                        const isKeysDifferent = !_.isEqual(_.sortBy(identifiers), _.sortBy(this.mapKeys));

                        if (isKeysDifferent) {
                            // need to recreate map entities
                            let poorSeries = {};
                            // creating minimal data
                            _(identifiers).forEach((identifier) => {
                                poorSeries[identifier] = {
                                    entityId: identifier,
                                    entityOrigin: {
                                        fqn: this.fqn,
                                        id: identifier
                                    }
                                };
                            });
                            this.mapEntities = poorSeries;
                        }
                        log.debug('Series.init(); mapEntities are:', this.mapEntities);
                        return this.loadMap().then(() => {
                            const resultList = this.buildResultingList();
                            this.setValues(resultList);
                            // forward if there is one series row found
                            // @todo it's not suitable place, think about it
                            if (_.size(_.values(resultList)) === 1) {
                                const series = _.head(_.values(resultList));
                                const forwardUrl = (back === false) ? '/valve-sizer/products/' + series.family : '/valve-sizer';
                                dispatch(pushPath(forwardUrl));
                            }
                            return dispatch(ApplicationEvents.creators.loadComponentFinished());
                        }).catch((errorBody) => {throw errorBody;});
                    }
                ).catch(
                    (errorBody) => {
                        // Throw event about load error
                        dispatch(
                            ApplicationEvents.creators.errorHappened(
                                'Series loading error',
                                'Identifiers loading by parameters for Series failed',
                                errorBody
                            )
                        );
                        return dispatch(ApplicationEvents.creators.loadComponentFinished());
                    }
                );
            }
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of series result list.
     * @param {Object} list
     * @returns {Promise}
     */
    setValues(list) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.Series.creators.result_list(list));
        });
    }


    buildResultingList() {
        const result = this.getSeriesListFromEntities();

        const valvesBySeriesName = {};
        this.filteredValves.forEach(valve => {
            if(valvesBySeriesName[valve.family]) {
                valvesBySeriesName[valve.family].push(valve);
            } else {
                valvesBySeriesName[valve.family] = [valve];
            }
        });
        // Filter out series without matching valves
        Object.keys(result).forEach(name => {
            if(!valvesBySeriesName[name]) {
                delete result[name];
                return;
            }
            try {
                const matchingValves = Recommendation.getMatchingValves(
                    result[name],
                    valvesBySeriesName[name],
                    this.settingsModel.flowUnit,
                    this.flowPressureModel.kv,
                    this.flowPressureModel.flow
                );
                if (matchingValves.length === 0) {
                    delete result[name];
                }
            } catch(e) {
                if(e.name === 'validation') {
                    // Current flow/pressure settings in the filter are not applicable to this series
                    delete result[name];
                }
            }
        });

        return result;
    }

    /**
     * @return {Object}
     */
    getSeriesListFromEntities() {
        return _.reduce(
            this.filteredValves,
            (result, value, key) => {
                const family = value.family;
                if (result[family] === undefined) {
                    const series = value;
                    series.dn = [_.toInteger(series.dn)];
                    series.valves = [value.title];
                    result[family] = series;
                } else {
                    const dns = (result[family]).dn;
                    dns.push(_.toInteger(value.dn));
                    (result[family]).dn = (_.uniq(dns)).sort((a, b) => { return (a - b); });
                    const valves = (result[family]).valves;
                    valves.push(value.title);
                    (result[family]).valves = _.uniq(valves);
                }
                return result;
            },
            {}
        );
    }
}

export default Series;
