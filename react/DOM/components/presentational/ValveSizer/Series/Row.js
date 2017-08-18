import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import Image from '../../Image';

/**
 * How to display structure with series row data
 */
const Row = ({ seriesRow }) => {
    const seriesDNRange = (seriesRow.dn.length > 1)
        ? `${_.head(seriesRow.dn)}..${_.last(seriesRow.dn)}`
        : _.head(seriesRow.dn);

    const connectionsTranslationLabel = 'valve-sizer.label.properties.connections_detail.'
        + seriesRow.pipe_connector_count;
    const valveTypeTranslationLabel = 'valve-sizer.label.properties.valve_type_detail.'
        + seriesRow.valve_type;
    const valveConnectionTranslationLabel = 'valve-sizer.label.properties.valve_connection_detail.'
        + seriesRow.pipe_connector_type_def;


    return (
        <Link to={'/valve-sizer/products/' + seriesRow.family} className="product__link">
            <div className="product-item __with_image">
                <div className="hover-layer"> </div>
                <div className="product-replacement__img">
                    <Image
                        fileName={seriesRow.product_image}
                        className="ui fluid image"
                        alt={seriesRow.family}
                    />
                </div>
                <table className="ui very basic table">
                    <tbody>
                        <tr>
                            <td colSpan="4">
                                <div className="product-item__title">{seriesRow.family}</div>
                            </td>
                        </tr>
                        <tr className="top aligned">
                            <td width="20%">
                                <div className="product-item__property">
                                    <Translate content="valve-sizer.label.series.connections" />
                                </div>
                                <div className="product-item__value">
                                    <Translate content={connectionsTranslationLabel} />
                                </div>
                            </td>
                            <td width="20%">
                                <div className="product-item__property">
                                    <Translate content="valve-sizer.label.series.valve_type" />
                                </div>
                                <div className="product-item__value">
                                    {seriesRow.valve_family &&
                                        <span>{seriesRow.valve_family}</span>
                                    }
                                    {!seriesRow.valve_family &&
                                        <Translate content={valveTypeTranslationLabel} />
                                    }
                                </div>
                            </td>
                            <td width="20%">
                                <div className="product-item__property">
                                    <Translate content="valve-sizer.label.series.valve_connection" />
                                </div>
                                <div className="product-item__value">
                                    <Translate content={valveConnectionTranslationLabel} />
                                </div>
                            </td>
                            <td width="16%">
                                <div className="product-item__property">
                                    <Translate content="valve-sizer.label.series.mediumtemp" />:
                                </div>
                                <div className="product-item__value">{seriesRow.medium_temp}</div>
                            </td>
                            <td width="20%">
                                <div className="product-item__property">
                                    <Translate content="valve-sizer.label.series.dn" />:
                                </div>
                                <div className="product-item__value">{seriesDNRange}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Link>
    );
};

Row.propTypes = {
    seriesRow: PropTypes.object.isRequired
};

export default Row;
