// libraries
import _ from 'lodash';
// models
import log from 'loglevel';
import StateNamespace from '../StateNamespace';
import { push as pushPath } from 'react-router-redux';
// events
import { Application as ApplicationEvents } from '../../events/index';

/**
 * Class.
 * ValveSizer collection of valves and actuators
 */
class Combinations extends StateNamespace {
    /**
     * @param {Function} dispatch
     * @param {Object} valvesModel
     * @param {Object} actuatorsModel
     * @param {String} stateNamespace
     */
    constructor(
        dispatch,
        valvesModel,
        actuatorsModel,
        userModel,
        stateNamespace = 'ValveSizer.Combinations'
    ) {
        log.debug('Combinations.constructor() started');
        super(dispatch, stateNamespace);
        this.valvesModel = valvesModel;
        this.actuatorsModel = actuatorsModel;
        this.userModel = userModel;
        log.debug('Combinations.constructor() finished, stateNamespace: ', this.stateNamespace);
    }

    // Internal functional accessors

    /**
     * @returns {Object}
     */
    get valvesModel() {
        return this._valvesModel;
    }

    /**
     * @param {Object} valvesModel
     */
    set valvesModel(valvesModel) {
        this._valvesModel = valvesModel;
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

    valveData(valveId) {
        return this.storeDispatch((dispatch, getState) => {
            return _.head(
                _.map(
                    _.filter(
                        _.get(
                            getState(),
                            this.stateNamespace + '.Valves.mapEntities'
                        ),
                        value => {
                            return (_.isObject(value.entityData) && value.entityData.id == valveId);
                        }
                    ),
                    (value) => (value.entityData)
                )
            );
        });
    }

    valveByCountry(valveId, countryCode) {
        const valve = this.valveData(valveId);
        if (!valve || countryCode != 'GER') {
            return valve;
        }

        // for Germany series of this family must be hidden
        const exceptionFamilyShort = "PIQCV";
        return (valve['family_short'] !== exceptionFamilyShort) ? valve : null;
    }

    userCountryCode() {
        const userCountry = this.userModel.supportContacts;
        return (userCountry.code !== undefined) ? userCountry.code : '';
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Perform initial data load for container by route params.
     * @param {Object} parameters From route of react-router
     */
    init(parameters) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ApplicationEvents.creators.loadComponentStarted());
            log.debug('Combinations.init( ' + JSON.stringify(parameters) + ' )');
            let { valves, actuators } = parameters;
            valves = _.isEmpty(valves) ? [] : _.split(valves, ',');
            actuators = _.isEmpty(actuators) ? [] : _.split(actuators, ',');
            log.debug('Combinations.init(). valves: ' + valves + ' actuators: ' + actuators);
            // loading valves
            log.debug('Combinations.init() loading valves. Valves are: ', this.valvesModel);
            this.valvesModel.stateNamespace = this.stateNamespace + '.Valves';
            this.valvesModel.clearNamespace();
            this.valvesModel.mapFQN = 'valvesizer.valve';
            return this.valvesModel.loadMapByIdentifiers(valves).then(() => {
                const valve = this.valveByCountry(valves, this.userCountryCode());
                if (!valve) {
                    dispatch(pushPath('/valve-sizer/series'));
                    return dispatch(ApplicationEvents.creators.loadComponentFinished());
                }

                // loading actuators
                log.debug('Combinations.init() loading actuators. Actuators are: ', this.actuatorsModel);
                this.actuatorsModel.stateNamespace = this.stateNamespace + '.Actuators';
                this.actuatorsModel.clearNamespace();
                this.actuatorsModel.mapFQN = 'valvesizer.actuator';
                this.actuatorsModel.loadMapByIdentifiers(actuators);
            }).then(() => {
                dispatch(ApplicationEvents.creators.loadComponentFinished());
            });
        });
    }
}

export default Combinations;
