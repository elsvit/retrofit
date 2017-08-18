import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';

/**
 * Power component
 */
const Power = ({ value, handler }) => (
    <div className="field">
        <label>
            <Translate content="valve-sizer.label.flow_calculation.power" />, kW
        </label>

        <input
            type="text"
            placeholder=""
            value={value}
            onChange={(SE) => handler(SE.target.value)}
        />
    </div>
);

Power.propTypes = {
    value: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired
};

export default Power;
