import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';
import { PressureReference } from './../../../../models/ValveSizer/Reference/index';

/**
 * Differential pressure component
 */
const DifferentialPressure = ({ value, unit, handler }) => (
    <div className="field">
        <label>
            <Translate
                content="valve-sizer.label.flow_pressure.differential_pressure_value"
            />, <span>{PressureReference.getLabel(unit)}</span>
        </label>
        <input
            type="text"
            className="ui fluid"
            placeholder=""
            value={value}
            onChange={(SE) => handler(SE.target.value)}
        />
    </div>
);


DifferentialPressure.propTypes = {
    value: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired
};

export default DifferentialPressure;
