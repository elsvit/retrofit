// libraries
import _ from 'lodash';
import { FlowPressureCalculator } from './Reference/index';
// models
import { default as StateNamespace } from '../StateNamespace';
// events
import { ValveSizer as ValveSizerEvents } from '../../events/index';

/**
 * Class.
 * Concrete.
 * Business-logic & State reading/writing for "FlowPressure" in ValveSizer
 */
class FlowPressure extends StateNamespace {
    /**
     * @param {Function} dispatch
     * @param {Object} settingsModel
     * @param {Object} propertiesModel
     * @param {String} stateNamespace
     */
    constructor(dispatch, settingsModel, propertiesModel, stateNamespace = 'ValveSizer.FlowPressure') {
        super(dispatch, stateNamespace);
        this.settingsModel = settingsModel;
        this.propertiesModel = propertiesModel;
    }

    // State accessors

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get flow from state.
     * @returns {Object}
     */
    get flow() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.flow'
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get differential pressure from state.
     * @returns {Object}
     */
    get differentialPressure() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.differential_pressure'
                )
            );
        });
    }

    /**
     * Self-dispatching thunk.
     * State reader.
     * Get kv value from state.
     * @returns {Object}
     */
    get kv() {
        return this.storeDispatch((dispatch, getState) => {
            return _.cloneDeep(
                _.get(
                    getState(),
                    this.stateNamespace + '.kv'
                )
            );
        });
    }

    // Business-logic

    calculateAndSetKv() {
        return this.storeDispatch((dispatch, getState) => {
            const flowUnit = this.settingsModel.flowUnit;
            const flow = this.flow;
            const pressureUnit = this.settingsModel.pressureUnit;
            const pressure = this.differentialPressure;

            FlowPressureCalculator.setFlowUnit(flowUnit);
            FlowPressureCalculator.setPressureUnit(pressureUnit);
            const kv = FlowPressureCalculator.calculateKv(flow, pressure);
            this.setKvValue(kv);
        });
    }

    reset() {
        return this.storeDispatch((dispatch, getState) => {
            this.setFlowValue('');
            this.setDifferentialPressureValue('');
            this.setKvValue('');
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
            dispatch(ValveSizerEvents.FlowPressure.creators.flow(value));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of differential pressure value.
     * @param {String} value
     * @returns {Promise}
     */
    setDifferentialPressureValue(value) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.FlowPressure.creators.differential_pressure(value));
        });
    }

    /**
     * Self-dispatching thunk.
     * State writer.
     * Set of Kv value.
     * @param {Number} value
     * @returns {Promise}
     */
    setKvValue(value) {
        return this.storeDispatch((dispatch, getState) => {
            dispatch(ValveSizerEvents.FlowPressure.creators.kv(value));
        });
    }
}

export default FlowPressure;
