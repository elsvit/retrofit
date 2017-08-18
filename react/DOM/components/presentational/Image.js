import React, { PropTypes } from 'react';

// Choose the one you like more:
// error  Unexpected block statement surrounding arrow body  arrow-body-style
// error  Arrow function used ambiguously with a conditional expression  no-confusing-arrow

/* eslint no-confusing-arrow:0 */

const Image = ({ fileName, alt, className }) =>
    fileName ? <img alt={alt} className={className} src={'/belimo/retrofit/images/' + fileName} /> : <noscript />
;

Image.propTypes = {
    className: PropTypes.string,
    alt: PropTypes.string,
    fileName: PropTypes.string
};

export default Image;
