import React, { PropTypes } from 'react';
import _ from 'lodash';
import { default as UnitSelect } from './UnitSelect';
import { default as Translate } from 'react-translate-component';

/**
 * Calculating units component
 */
const Units = ({ units, values }) => {
    const items = _.reduce(units, (result, options, name) => {
        let field = (values[name]) ? values[name] : '';
        return [
            ...result,
            <UnitSelect
                key={name}
                options={options}
                field={field}
            />
        ];
    }, []);

    return (
        <div className="field">
            <label><Translate content="valve-sizer.label.flow_pressure.calculating_units" /></label>
            <div className="ui padded segment">
                <div className="two fields">
                    {items}
                </div>
            </div>
        </div>
    );
};


Units.propTypes = {
    units: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired
};

export default Units;
