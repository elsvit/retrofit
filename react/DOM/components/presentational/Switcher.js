import React, { PropTypes } from 'react';
import _ from 'lodash';
import { default as Translate } from 'react-translate-component';

const Switcher = (props) => {
    const { values, active, handler, translate } = props;
    const buttons = _.reduce(values, (result, value, key) => (
        [
            ...result,
            <button
                key={key}
                className={'ui' + ((active === value) ? ' active' : ' ') + ' button'}
                value={value}
                onClick={(SE) => handler(value)}
            >
                {translate &&
                    <span><Translate content={'label.switcher.' + value} /></span>
                }

                {!translate &&
                    <span>{value}</span>
                }
            </button>
        ]
    ), []);

    return (
        <div className={'ui buttons'}>
            {buttons}
        </div>
    );
};


Switcher.propTypes = {
    values: PropTypes.array.isRequired,
    active: PropTypes.string,
    handler: PropTypes.func.isRequired,
    translate: PropTypes.bool
};

export default Switcher;
