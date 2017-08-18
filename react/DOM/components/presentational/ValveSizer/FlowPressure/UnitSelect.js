import React, { PropTypes } from 'react';

/**
 * Unit select
 */
const UnitSelect = ({ name, options, value, handler }) => {
    const items = options.map((option) => (
        <option key={option.name} value={option.name}>{option.label}</option>
    ));

    return (
        <div className="field">
            <select className="ui dropdown" defaultValue={value} onChange={(SE) => handler(name, SE.target.value)}>
                {items}
            </select>
        </div>
    );
};


UnitSelect.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired
};

export default UnitSelect;
