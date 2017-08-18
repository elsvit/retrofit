import React, { PropTypes } from 'react';
import _ from 'lodash';
import { default as Property } from './Property';

/**
 * How to display structure with properties data
 */
const Properties = ({ properties, handler }) => {
    const items = _.reduce(properties, (result, property, propertyName) => {
        if (property.options.length === 0) {
            return result;
        }

        return [
            ...result,
            <Property
                key={propertyName}
                name={propertyName}
                options={property.options}
                values={property.values}
                handler={handler}
            />
        ];
    }, []);

    return (
        <div className="ui vertically padded grid left aligned">
            {items}
        </div>
    );
};

Properties.propTypes = {
    properties: PropTypes.object.isRequired,
    handler: PropTypes.func.isRequired
};

export default Properties;
