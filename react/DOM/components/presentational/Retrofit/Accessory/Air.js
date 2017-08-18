import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import Image from '../../Image';
import * as Util from '../../../../utils/util';

/** Accessory data
 *
 > mongo
 > use belimo;
 > db.retrofit_air_accessory.find({}).limit(1).pretty();
 *
 */

const Air = ({ accessory }) => (
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
                                <div className="four wide computer seven wide tablet sixteen wide mobile column">
                                    <div className="product-replacement__img">
                                        <Image
                                            fileName={accessory.product_image}
                                            className="ui fluid image"
                                            alt={accessory.title}
                                        />
                                    </div>
                                </div>
                                <div className="twelve wide computer nine wide tablet sixteen wide mobile column">
                                    <div className="product-replacement__desc">
                                        <div className="product-replacement__title">{accessory.title}</div>


                                        {(accessory.safety_function) && (accessory.safety_function !== '@@no') && (
                                            <div className="product-replacement__safety_function">
                                                <strong>
                                                    <Translate content="label.property.safety_function" />:&nbsp;
                                                </strong>
                                                {Util.specString(accessory.safety_function, 'retrofit_parameter')}<br />
                                            </div>
                                        )}

                                        {(accessory.integrated_switch) && (
                                            <div className="product-replacement__safety_function">
                                                <strong>
                                                    <Translate content="label.property.integrated_switch" />:&nbsp;
                                                </strong>
                                                {Util.specString(accessory.integrated_switch,
                                                    'retrofit_parameter')
                                                }<br />
                                            </div>
                                        )}
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

Air.propTypes = {
    accessory: PropTypes.object.isRequired
};

export default Air;
