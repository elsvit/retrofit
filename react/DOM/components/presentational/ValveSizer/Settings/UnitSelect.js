import React, { PropTypes } from 'react';

/**
 * Unit select
 */
const UnitSelect = ({ options, field }) => {
    const items = options.map((option) => (
        <option key={option.name} value={option.name}>{option.label}</option>
    ));

    return (
        <div className="field">
            <select className="ui dropdown" {...field} value={field.value}>
                {items}
            </select>
        </div>
    );
};


UnitSelect.propTypes = {
    options: PropTypes.array.isRequired,
    field: PropTypes.object.isRequired
};

export default UnitSelect;
