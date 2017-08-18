import React, { PropTypes } from 'react';
import { default as Row } from './Row';
import { default as Translate } from 'react-translate-component';

/**
 * How to display structure with series list data
 */
const List = ({ seriesList }) => {
    let items = [];

    seriesList.forEach((item, index) => {
        items.push(
            <Row seriesRow={item} index={index} key={index} />
        );
    });

    return (
        <div className="ui centered vertically padded grid">
            <div className="row">
                <div
                    className="twelve wide computer fourteen wide tablet sixteen wide mobile column aligned center"
                >
                    <Translate content="valve-sizer.label.headline.series_results" />
                </div>
            </div>
            <div className="row product_list">
                <div
                    className="twelve wide computer fourteen wide tablet sixteen wide mobile column aligned center"
                >
                    {items.length ? items : ''}
                </div>
            </div>
        </div>
    );
};

List.propTypes = {
    seriesList: PropTypes.array.isRequired
};

export default List;
