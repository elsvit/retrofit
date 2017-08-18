// libraries
import _ from 'lodash';
import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';


/**
 * Simple select with one selected option
 */
const SimpleSelect = ({ label, defaultValue, value, values, changeHandler, translateLabel }) => {
    let options = [];
    let index = 0;
    _.forEach(values, (v, k) => {
        index++;
        options.push(
            <option key={index} value={k}>{v}</option>
        );
    });
    return (
        <div className="ui form">
            <div className="inline field">
                {translateLabel &&
                    <label>
                        <Translate content={translateLabel} />:
                    </label>
                }
                {label &&
                    <label>
                        {label}:
                    </label>
                }
                <select defaultValue={defaultValue} value={value} onChange={changeHandler}>
                    {options}
                </select>
            </div>
        </div>
    );
};

SimpleSelect.propTypes = {
    label: PropTypes.string,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    values: PropTypes.object.isRequired,
    changeHandler: PropTypes.func.isRequired,
    translateLabel: PropTypes.string
};

export default SimpleSelect;
