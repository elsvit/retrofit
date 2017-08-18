import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';

const SpecificationButton = ({ fileName }) =>
    <a
        href={`/belimo/retrofit/specifications/${fileName}`}
        className="ui left labeled grey icon button product-replacement__datasheet-link"
    >
        <i className="left file pdf outline icon"></i>
        <Translate content="action.label.specification" />
    </a>
;

SpecificationButton.propTypes = {
    fileName: PropTypes.string.isRequired
};

export default SpecificationButton;
