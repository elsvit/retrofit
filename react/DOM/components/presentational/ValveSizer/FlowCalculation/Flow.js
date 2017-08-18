import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';
import { FlowReference } from './../../../../models/ValveSizer/Reference/index';

/**
 * Calculating flow component
 */
const Flow = ({ value, unit, handler }) => (
    <div className="field">
        <label>
            <Translate content="valve-sizer.label.flow_calculation.flow" />, {FlowReference.getLabel(unit)}
        </label>
        <input
            type="text"
            placeholder=""
            value={value}
            onChange={(SE) => handler(SE.target.value)}
        />
    </div>
);

Flow.propTypes = {
    value: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired
};

export default Flow;
