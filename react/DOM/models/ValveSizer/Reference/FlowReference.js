// libraries
import { isNumeric } from './../../../utils/index';
import _ from 'lodash';
import { default as log } from 'loglevel';

let FlowReference = (function () {
    const
        units = [
            { name: 'l_h', label: 'l/h' },
            { name: 'l_min', label: 'l/min' },
            { name: 'l_s', label: 'l/s' },
            { name: 'm3_h', label: 'm' + String.fromCharCode(179) + '/h' },
            { name: 'm3_min', label: 'm' + String.fromCharCode(179) + '/min' },
            { name: 'm3_s', label: 'm' + String.fromCharCode(179) + '/s' }
        ],
        mapUnitToCoefficient = {
            'm3_h': 1000000000, // 1
            'm3_min': 16670000, // 0.01667
            'm3_s': 2778000, // 0.002778
            'l_h': 1000000000000, // 1000
            'l_min': 16667000000, // 16.667
            'l_s': 277800000 // 0.2778
        };

    return {
        getUnits: getUnits,
        getLabel: getLabel,
        calculate: calculate,
        convert: convert
    };

    /**
     * @returns {Array}
     */
    function getUnits () {
        return units;
    }

    /**
     * Get unit label by name.
     * @param {String} name
     * @returns {String}
     */
    function getLabel (name) {
        let foundUnit = _.head(
            _.filter(units, (unit) => {
                return (unit.name == name);
            })
        );
        return (foundUnit) ? foundUnit.label : '';
    }

    /**
     * Calculate flow value by power and temperature difference.
     * @param {Number} power
     * @param {Number} temperatureDifference
     * @param {String} unit
     * @returns {Number}
     */
    function calculate (power, temperatureDifference, unit = '') {
        power = Number(power);
        temperatureDifference = Number(temperatureDifference);
        let value = 0;
        if (_validatePower(power) && _validateTemperatureDifference(temperatureDifference)) {
            value = ((86 * power) / temperatureDifference) / 100;
            if (unit.length > 0) {
                value = convert(value, 'm3_h', unit);
            }
        }
        return value;
    }

    /**
     * Convert flow value from one unit to another.
     * @param {Number} value
     * @param {String} unitFrom
     * @param {String} unitTo
     * @returns {number}
     */
    function convert (value, unitFrom, unitTo = 'm3_h') {
        value = Number(value);
        if (unitFrom === unitTo) {
            return value;
        }

        let convertedValue = 0;
        if (!_validateFlow(value)) {
            return convertedValue;
        }

        let coefficientFrom = _unitCoefficient(unitFrom);
        let coefficientTo = _unitCoefficient(unitTo);
        if (coefficientFrom > 0 && coefficientTo > 0) {
            convertedValue = (value * coefficientTo) / (coefficientFrom);
        }
        return _.round(convertedValue, 10); // round is needed for solving http://floating-point-gui.de/
    }

    /**
     * @param {String} unit
     * @returns {Number}
     * @private
     */
    function _unitCoefficient (unit) {
        let map = mapUnitToCoefficient;
        try {
            if ((map[unit] === undefined)) {
                throw new Error("Error. Does not map flow unit coefficient.");
            }
            return map[unit];
        } catch (e) {
            log.debug('Flow reference error:', e);
            return 0;
        }
    }

    /**
     * @param {Number} power
     * @returns {Boolean}
     * @private
     */
    function _validatePower (power) {
        return isNumeric(power) && power > 0;
    }

    /**
     * @param {Number} temperatureDifference
     * @returns {Boolean}
     * @private
     */
    function _validateTemperatureDifference (temperatureDifference) {
        return isNumeric(temperatureDifference) && temperatureDifference > 0;
    }

    /**
     * @param {Number} flow
     * @returns {Boolean}
     * @private
     */
    function _validateFlow (flow) {
        return isNumeric(flow) && flow > 0;
    }
});

export default FlowReference();
