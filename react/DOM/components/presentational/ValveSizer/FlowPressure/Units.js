import React, { PropTypes } from 'react';
import _ from 'lodash';
import { default as UnitSelect } from './UnitSelect';
import { default as Translate } from 'react-translate-component';

/**
 * Calculating units component
 */
const Units = ({ units, values, handler }) => {
    const items = _.reduce(units, (result, options, name) => {
        let value = (values[name]) ? values[name] : '';
        return [
            ...result,
            <UnitSelect
                key={name}
                name={name}
                options={options}
                value={value}
                handler={handler}
            />
        ];
    }, []);

    return (
        <div className="ui padded segment">
            <div className="field">
                <label><Translate content="valve-sizer.label.flow_pressure.calculating_units" /></label>
                <div className="two fields">
                    {items}
                </div>
            </div>
        </div>
    );
};


Units.propTypes = {
    units: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handler: PropTypes.func.isRequired
};

export default Units;
