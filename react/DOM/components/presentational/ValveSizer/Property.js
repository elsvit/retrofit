import React, { PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Translate from 'react-translate-component';

/**
 * Property component
 */
const Property = ({ name, options, values, handler }) => {
    const items = [];
    options.forEach((option, index) => {
        const isActive = _.includes(values, option.name);
        const translateKeyOptionLabel = 'valve-sizer.label.properties.' + option.name;

        items.push(
            <button
                key={index}
                className={classNames(
                    'ui button',
                    {
                        btn_disabled: !option.enabled,
                        'secondary active': isActive
                    }
                )}
                onClick={(SE) => handler(name, option.name, SE)}
            >
                <Translate content={translateKeyOptionLabel} /> {isActive && <i className="checkmark icon"></i>}
            </button>
        );
    });

    const translateKeyLabel = 'valve-sizer.label.properties.' + name;

    return (
        <div className="row property">
            <div className="sixteen wide column">
                <div className="property__value">
                    <Translate content={translateKeyLabel} />
                </div>
            </div>
            <div
                className="sixteen wide column property__buttons-column"
            >
                <div className="ui buttons property__buttons">
                    {items}
                </div>
            </div>
        </div>
    );
};


Property.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired,
    handler: PropTypes.func.isRequired
};

export default Property;
