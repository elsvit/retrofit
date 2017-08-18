import _ from 'lodash';
import { default as FlowReference } from './FlowReference';
import { default as PressureReference } from './PressureReference';

let FlowPressureCalculator = function () {};

FlowPressureCalculator.prototype = {

    flowUnit: 'm3_h',
    pressureUnit: 'k_pa',

    constructor: FlowPressureCalculator,

    /**
     * Set flowUnit for calculating
     * @param {String} flowUnit
     */
    setFlowUnit: function (flowUnit) {
        this.flowUnit = flowUnit;
    },

    /**
     * Set pressureUnit for calculating
     * @param {String} pressureUnit
     */
    setPressureUnit: function (pressureUnit) {
        this.pressureUnit = pressureUnit;
    },

    /**
     * @param {Number} flow
     * @param {Number} pressure
     * @returns {Number}
     */
    calculateKv: function (flow, pressure) {
        flow = Number(flow);
        pressure = Number(pressure);

        let value = 0;
        const baseFlow = FlowReference.convert(flow, this.flowUnit);
        const basePressure = PressureReference.convert(pressure, this.pressureUnit);
        if (basePressure > 0) {
            const baseValue = baseFlow / Math.sqrt(basePressure / 100);
            value = FlowReference.convert(baseValue, 'm3_h', this.flowUnit);
        }

        return _.round(value, 10);  // round is needed for solving http://floating-point-gui.de/
    },

    /**
     * @param {Number} flow
     * @param {Number} kvs
     * @returns {Number}
     */
    calculateEffectivePressure: function (flow, kvs) {
        flow = Number(flow);
        kvs = Number(kvs);

        let value = 0;
        const baseFlow = FlowReference.convert(flow, this.flowUnit);
        const baseKvs = FlowReference.convert(kvs, this.flowUnit);

        if (baseKvs > 0) {
            const baseValue = Math.pow((baseFlow / baseKvs), 2) * 100;
            value = PressureReference.convert(baseValue, 'k_pa', this.pressureUnit);
        }

        return _.round(value, 10);  // round is needed for solving http://floating-point-gui.de/
    }
};

export default new FlowPressureCalculator();
