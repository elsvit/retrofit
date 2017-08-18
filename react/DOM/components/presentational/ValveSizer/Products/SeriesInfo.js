import React, { PropTypes } from 'react';
import _ from 'lodash';
import Translate from 'react-translate-component';
import Image from '../../Image';

/**
 * How to display structure with SeriesInfo
 */
const SeriesInfo = ({ series, optionalTitle, optionalActiveMatchingItem }) => {
    let dnValue = '-';
    if (series.dn.length > 1) {
        dnValue = `${_.head(series.dn)}..${_.last(series.dn)}`;
    } else if (series.dn.length > 0) {
        dnValue = _.head(series.dn);
    }

    if (optionalActiveMatchingItem && optionalActiveMatchingItem.dn) {
        dnValue = optionalActiveMatchingItem.dn;
    }

    const connectionsTranslationLabel = 'valve-sizer.label.properties.connections_detail.'
        + series.pipe_connector_count;
    const valveTypeTranslationLabel = 'valve-sizer.label.properties.valve_type_detail.' + series.valve_type;
    const valveConnectionTranslationLabel = 'valve-sizer.label.properties.valve_connection_detail.'
        + series.pipe_connector_type_def;

    return (
        <div className="row">
            <div className="two wide computer two wide tablet four wide mobile column aligned left">
                <div className="series-info-on-products__img">
                    <Image
                        fileName={series.product_image}
                        className="ui fluid image"
                        alt={series.family}
                    />
                </div>
            </div>
            <div className="ten wide computer twelve wide tablet twelve wide mobile column aligned center">
                <div className="product-item__title">
                    {optionalTitle}
                </div>
                <div className="product-item__parameters">
                    <div className="product-item__parameters--row">
                        <Translate content={connectionsTranslationLabel} />
                        {series.valve_family &&
                            <span>, {series.valve_family}</span>
                        }
                        {!series.valve_family &&
                            <span>, <Translate content={valveTypeTranslationLabel} /></span>
                        }
                        <br />
                        <Translate content={valveConnectionTranslationLabel} /><br />
                    </div>
                    <div className="product-item__parameters--row">
                        <Translate content="valve-sizer.label.series.dn" />:&nbsp;{dnValue}<br />
                        {series.medium_temp}
                    </div>
                </div>
            </div>
        </div>
    );
};

SeriesInfo.propTypes = {
    series: PropTypes.shape({
        dn: PropTypes.array.isRequired,
        pipe_connector_count: PropTypes.string.isRequired,
        valve_type: PropTypes.number.isRequired,
        pipe_connector_type_def: PropTypes.string.isRequired,
        family: PropTypes.string.isRequired,
        product_image: PropTypes.string.isRequired
    }).isRequired,
    optionalTitle: PropTypes.string,
    optionalActiveMatchingItem: PropTypes.object
};

export default SeriesInfo;
