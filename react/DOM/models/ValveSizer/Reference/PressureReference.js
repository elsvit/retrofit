// libraries
import { isNumeric } from './../../../utils/index';
import _ from 'lodash';
import { default as log } from 'loglevel';

let PressureReference = (function () {
    const
        units = [
            { name: 'bar', label: 'bar' },
            { name: 'k_pa', label: 'kPa' }
        ],
        mapUnitToCoefficient = {
            'k_pa': 100, // 1
            'bar': 1 // 0.01
        };

    return {
        getUnits: getUnits,
        getLabel: getLabel,
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
     * Convert flow value from one unit to another.
     * @param {Number} value
     * @param {String} unitFrom
     * @param {String} unitTo
     * @returns {number}
     */
    function convert (value, unitFrom, unitTo = 'k_pa') {
        if (unitTo === 'kPa') {
            unitTo = 'k_pa';
        }

        value = Number(value);
        if (unitFrom === unitTo) {
            return value;
        }

        let convertedValue = 0;
        if (!_validatePressure(value)) {
            return convertedValue;
        }

        let coefficientFrom = _unitCoefficient(unitFrom);
        let coefficientTo = _unitCoefficient(unitTo);
        if (coefficientFrom > 0 && coefficientTo > 0) {
            convertedValue = (value / coefficientFrom) * coefficientTo;
        }

        return convertedValue;
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
                throw new Error("Error. Does not map pressure unit coefficient.");
            }
            return map[unit];
        } catch (e) {
            log.debug('Pressure reference error:', e);
            return 0;
        }
    }

    /**
     * @param {Number} flow
     * @returns {Boolean}
     * @private
     */
    function _validatePressure (pressure) {
        return isNumeric(pressure) && pressure > 0;
    }
});

export default PressureReference();
