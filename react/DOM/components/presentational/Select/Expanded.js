import React, { PropTypes } from 'react';
import _ from 'lodash';
import Translate from 'react-translate-component';
import { NullPresentation } from '../../../utils/index';

const SelectExpanded = (props) => {
    const { name, options, values, handler, backHandler } = props;

    const items = [];

    if (backHandler) {
        items.push(
            <a
                className="item select__item"
                tabIndex="0"
                key={'back'}
                onClick={backHandler}
            >
                <Translate content="action.label.back" />
                <i className="level up large icon"></i>
            </a>
        );
    }

    for (const option of options) {
        items.push(
            <a
                className="item select__item"
                tabIndex="0"
                key={option}
                onClick={(SE) => handler(name, option)}
            >
                {NullPresentation(option)}
                <i className={(_.includes(values, option) ? 'check ' : '') + 'right icon'}></i>
            </a>
        );
    }

    return (
        <div className="ui fluid vertical menu">
            {items}
        </div>
    );
};


SelectExpanded.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    handler: PropTypes.func.isRequired,
    backHandler: PropTypes.func
};

export default SelectExpanded;
