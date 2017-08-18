import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { Collapsed as CollapsedSelect } from '../Select/index';

/**
 * How to display structure with parameters data
 */
const Parameters = ({ routerPath, parameters }) => {
    const selects = _.reduce(parameters, (result, parameter, name) => {
        if (parameter.options.length === 0) {
            return result;
        }

        let translateKeyLabel = 'label.property.' + name;
        let values = parameter.values || [];
        let isHint = false;
        if (parameter.options.length === 1 && parameter.values.length === 0) {
            values = [parameter.options[0]];
            isHint = true;
        }
        return [
            ...result,
            <Link
                to={routerPath + '/' + name}
                className="item select__item"
                tabIndex="0"
                key={name}
            >
                <CollapsedSelect label={translateKeyLabel} values={values} isHint={isHint} />
            </Link>
        ];
    }, []);

    return (
        <div className="ui fluid vertical menu">
            {selects}
        </div>
    );
};

Parameters.propTypes = {
    routerPath: PropTypes.string.isRequired,
    parameters: PropTypes.object.isRequired
};

export default Parameters;
