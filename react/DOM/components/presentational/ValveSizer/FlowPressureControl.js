import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Translate from 'react-translate-component';
import tr from 'counterpart';
import { FlowReference, PressureReference } from '../../../models/ValveSizer/Reference/index';

const FlowPressureControlComponent = ({ flow, flowUnit, pressure, pressureUnit, onClick }) => {
    const isActive = flow.length > 0 || pressure.length > 0;
    const buttonClasses = classNames('ui button', {
        'secondary active': isActive
    });
    const notSet = tr('valve-sizer.label.flow_pressure.not_set');

    return (
        <div className="ui vertically padded grid center aligned">
            <div className="row property">
                <div className="sixteen wide column">
                    <div className="property__value">
                        <Translate content="valve-sizer.label.headline.flow_pressure" />
                    </div>
                </div>
                <div className="property__buttons-column">
                    <div className="ui buttons property__buttons">
                        <button className={buttonClasses} onClick={onClick}>
                            <i className="edit icon" />&nbsp;&nbsp;
                            <Translate content="valve-sizer.label.flow_pressure.flow_value" />:&nbsp;
                            {flow.length > 0 ? flow + ' ' + FlowReference.getLabel(flowUnit) : notSet}
                            ,&nbsp;
                            <Translate content="valve-sizer.label.flow_pressure.differential_pressure_value" />:&nbsp;
                            {pressure.length > 0 ? pressure + ' ' + PressureReference.getLabel(pressureUnit) : notSet}
                            <i className="checkmark icon" style={{ visibility: isActive ? 'visible' : 'hidden' }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

FlowPressureControlComponent.propTypes = {
    flow: PropTypes.string,
    flowUnit: PropTypes.string,
    pressure: PropTypes.string,
    pressureUnit: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

export default FlowPressureControlComponent;
