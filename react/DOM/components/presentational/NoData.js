import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';

/**
 * Draw link with notice about missing data
 * @param {String} fallbackLink
 * @returns ReactElement
 */
const NoData = ({ fallbackLink }) => (
    <div className="ui basic center aligned segment">
        <Translate content="label.nodata.message" />
        <Link to={fallbackLink}><Translate content="label.nodata.link_text" /></Link>.
    </div>
);

NoData.propTypes = {
    fallbackLink: PropTypes.string.isRequired
};

export default NoData;
