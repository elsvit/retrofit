import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';

/**
 * Temperature difference component
 */
const TemperatureDifference = ({ value, handler }) => (
    <div className="field">
        <label>
            <Translate content="valve-sizer.label.flow_calculation.temperature_difference" />, &deg;K
        </label>

        <input
            type="text"
            placeholder=""
            value={value}
            onChange={(SE) => handler(SE.target.value)}
        />
    </div>
);

TemperatureDifference.propTypes = {
    value: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired
};

export default TemperatureDifference;
