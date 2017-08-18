// libraries
import _ from 'lodash';
import { FlowReference } from './Reference/index';
// models
import { default as StateNamespace } from '../StateNamespace';
// events
import { ValveSizer as ValveSizerEvents } from '../../events/index';

/**
 * Class.
 * Concrete.
 * Business-logic & State reading/writing for "Units" in ValveSizer
 */
class FlowCalculation extends StateNamespace {
    /**
     * @param {Function} dispatch
     * @param {Object} settingsModel
     * @param {Object} flowPressureModel
     * @param {String} stateNamespace
     */
    constructor(dispatch, settingsModel, flowPressureModel, stateNamespace = 'ValveSizer.FlowCalculation') {
        super(dispatch, stateNamespace);
        this.settingsModel = settingsModel;
        this.flowPressureModel = flowPressureModel;
    }

    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get flow parameter by name from state.
     * @param {String} name
     * @returns {Object}
     */
    flowParameter(name) {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.' + name
                )
            );
        });
    }

    // Business-logic

    /**
     * Self-dispatching thunk.
     * State writer.
     * Init.
     * @returns {Promise}
     */
    init() {
        return this.storeDispatch((dispatch, getState) => {
            let power = this.flowParameter('power');
            let temperatureDifference = this.flowParameter('temperature_difference');
            this.calculateFlowValue(power, temperatureDifference);
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of power value.
     * @param {String} value
     * @returns {Promise}
     */
    setPowerValue(value) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.FlowCalculation.creators.power(value));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of temperature difference value.
     * @param {String} value
     * @returns {Promise}
     */
    setTemperatureDifferenceValue(value) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.FlowCalculation.creators.temperature_difference(value));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of flow value.
     * @param {String} value
     * @returns {Promise}
     */
    setFlowValue(value) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.FlowCalculation.creators.flow(value));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Calculate flow value and set of it.
     * @param {String} value
     * @returns {Promise}
     */
    calculateFlowValue(power, temperatureDifference) {
        return this.storeDispatch((dispatch, getState) => {
            let flowUnitValue = this.settingsModel.flowUnit;
            let value = FlowReference.calculate(power, temperatureDifference, flowUnitValue);
            this.setFlowValue((_.round(value, 3)).toString());
        });
    }
}

export default FlowCalculation;
