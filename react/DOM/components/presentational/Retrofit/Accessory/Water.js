import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';

/** Accessory data
 *
 > mongo
 > use belimo;
 > db.retrofit_water_accessory.find({}).limit(1).pretty();
 *
 */

const Water = ({ accessory }) => (
    <div className="ui container">
        <div className="ui centered vertically padded grid">
            <div className="row">
                <Translate content="label.headline.accessory" />
            </div>
            <div className="row">
                <div className="twelve wide computer fourteen wide tablet sixteen wide mobile column aligned center">

                    <div className="product-replacement">
                        <div className="ui internally left aligned grid vertically padded">
                            <div className="row">
                                <div className="twelve wide computer nine wide tablet sixteen wide mobile column">
                                    <div className="product-replacement__desc">
                                        <div className="product-replacement__title">{accessory.title}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
);

Water.propTypes = {
    accessory: PropTypes.object.isRequired
};

export default Water;
