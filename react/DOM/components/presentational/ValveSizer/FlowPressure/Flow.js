import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { default as Translate } from 'react-translate-component';
import { FlowReference } from './../../../../models/ValveSizer/Reference/index';

/**
 * Calculating flow component
 */
const Flow = ({ value, unit, backUrl, handler }) => {
    let urlToCalculation = '/valve-sizer/flow-calculation/';
    if (backUrl) {
        urlToCalculation += encodeURIComponent(backUrl);
    }
    return (
        <div className="field">
            <label>
                <Translate content="valve-sizer.label.flow_pressure.flow_value" />,
                <span> {FlowReference.getLabel(unit)}</span>
            </label>
            <div className="ui action input">
                <input
                    type="text"
                    placeholder=""
                    value={value}
                    onChange={(SE) => handler(SE.target.value)}
                />
                <Link to={urlToCalculation} className="ui icon button">
                    <i className="calculator icon"></i>
                </Link>
            </div>
        </div>
    );
};


Flow.propTypes = {
    value: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    backUrl: PropTypes.string,
    handler: PropTypes.func.isRequired
};

export default Flow;
