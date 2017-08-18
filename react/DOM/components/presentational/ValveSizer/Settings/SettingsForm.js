// libraries
import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import { reduxForm } from 'redux-form';
// components
import CalculatingUnits from './Units';

/**
 * SettingsForm
 */
const SettingsForm = ({ fields, units, handleSubmit }) => {
    let { flowUnit, pressureUnit } = fields;
    let unitValues = {
        flow: flowUnit,
        differential_pressure: pressureUnit
    };

    return (
        <form className="ui form" onSubmit={handleSubmit}>
            <CalculatingUnits
                units={units}
                values={unitValues}
            />
            <button
                className="ui primary vertical animated button"
                tabIndex="0"
                type="submit"
                onClick={handleSubmit}
            >
                <div className="visible content">
                    <Translate content="valve-sizer.action.settings.save" />
                </div>
                <div className="hidden content">
                    <i className="right arrow icon"></i>
                </div>
            </button>
        </form>
    );
};

SettingsForm.propTypes = {
    fields: PropTypes.object.isRequired,
    units: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
};

const ReduxSettingsForm = reduxForm(
    {
        form: 'ValveSizerSettingsForm',
        fields: ['locale', 'flowUnit', 'pressureUnit']
    },
    state => ({
        initialValues: {
            locale: state.User.locale,
            flowUnit: state.ValveSizer.Settings.flow.value,
            pressureUnit: state.ValveSizer.Settings.pressure.value
        }
    })
)(SettingsForm);

export default ReduxSettingsForm;
