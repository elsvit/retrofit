import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';
import _ from 'lodash';
import { Link } from 'react-router';
import NoData from '../../presentational/NoData';
import * as ProductsComponents from './Products/index';

/**
 * How to display structure with products data of the series
 */
const Products = (
    { series, actuators, matchingItems, activeMatchingItem, actuatorsFilterError, flowMax, flowUnit, pressureEffective,
        pressureUnit, onChangeActiveMatchingHandler }
) => {
    let items = [];
    actuators.forEach((item, index) => {
        items.push(
            <ProductsComponents.Actuator actuator={item} index={index} key={index} />
        );
    });

    return (
        <div className="ui container">
            {(!_.isArray(items) || _.size(items) === 0) ? (
                <div className="ui centered vertically padded grid">
                    <div className="row">
                        <div
                            className={'twelve wide computer fourteen wide tablet sixteen wide '
                            + 'mobile column aligned center'}
                        >
                            {(matchingItems.length > 0) &&
                                <Link
                                    to={`/valve-sizer/combinations/${activeMatchingItem.valve_id}`}
                                    className={'ui fluid submit primary button'}
                                >
                                    <Translate content="valve-sizer.label.products.select_valve" />
                                </Link>
                            }
                            {(matchingItems.length === 0) &&
                                <NoData fallbackLink="/valve-sizer/series/back" />
                            }
                        </div>
                    </div>
                </div>
            ) : (
                <div className="ui centered vertically padded grid">
                    <div className="row">
                        <div
                            className={'twelve wide computer fourteen wide tablet sixteen wide '
                                + 'mobile column aligned center'}
                        >
                            <Translate content="valve-sizer.label.headline.products_results" />
                        </div>
                    </div>
                    <div className="row actuators-results product_list">
                        <div
                            className={'twelve wide computer fourteen wide tablet sixteen wide '
                                + 'mobile column aligned center'}
                        >
                            {items}
                        </div>
                    </div>
                </div>
            )}
            <div className="product-bottom">
                <div className="ui container">
                    <div className="ui centered vertically divided grid dn-selector_series">
                        <ProductsComponents.SeriesInfo
                            series={series}
                            optionalTitle={activeMatchingItem.title}
                            optionalActiveMatchingItem={activeMatchingItem}
                        />
                        <div className="row">
                            <div
                                className={
                                    'twelve wide computer fourteen wide tablet sixteen wide '
                                    + 'mobile column aligned center'
                                }
                            >
                                <ProductsComponents.Recommendation
                                    matchingItems={matchingItems}
                                    activeMatchingItem={activeMatchingItem}
                                    error={actuatorsFilterError}
                                    flowMax={flowMax}
                                    flowUnit={flowUnit}
                                    pressureEffective={pressureEffective}
                                    pressureUnit={pressureUnit}
                                    pressureDefinition={series.valve_pressure_def}
                                    onChangeActiveMatchingHandler={onChangeActiveMatchingHandler}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

Products.propTypes = {
    series: PropTypes.object.isRequired,
    actuators: PropTypes.array.isRequired,
    activeMatchingItem: PropTypes.object.isRequired,
    matchingItems: PropTypes.array.isRequired,
    actuatorsFilterError: PropTypes.object,
    onChangeActiveMatchingHandler: PropTypes.func.isRequired,
    flowMax: PropTypes.string.isRequired,
    flowUnit: PropTypes.string.isRequired,
    pressureEffective: PropTypes.number.isRequired,
    pressureUnit: PropTypes.string.isRequired
};

export default Products;
