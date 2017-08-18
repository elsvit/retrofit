import React, { PropTypes } from 'react';
import { NullPresentation } from '../../../utils/index';
import { default as Translate } from 'react-translate-component';

const SelectCollapsed = (props) => {
    let { label, values, handler, isHint } = props;

    let valueStyle = isHint ? { color: '#CCC' } : {};

    return (
        <div tabIndex="0" onClick={handler}>
            <Translate className="item__name" content={label} />
            <div className="item__vlue" style={valueStyle}>
                {(values.length > 0) ? (NullPresentation(values[0]) + (values.length > 1 ? ', ...' : '')) : ''}
            </div>
            <i className="angle right icon"></i>
        </div>

    );
};


SelectCollapsed.propTypes = {
    label: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    isHint: PropTypes.bool,
    handler: PropTypes.func
};

SelectCollapsed.defaultProps = {
    isHint: false
};

export default SelectCollapsed;
