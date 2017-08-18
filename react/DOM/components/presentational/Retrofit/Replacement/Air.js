import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import { SpecificationButton } from '../../Common';
import Image from '../../Image';
import * as Util from '../../../../utils/util';

const Air = ({ originalId, product, accessoriesAmount, handlerToBuffer, backUrl, notes }) => (
    <div className="product-replacement">
        <div className="ui internally left aligned grid vertically padded">
            <div className="row">
                <div className="four wide computer seven wide tablet sixteen wide mobile column">
                    <div className="product-replacement__img">
                        <Image
                            fileName={product.product_image}
                            className="ui fluid image"
                            alt={product.title}
                        />
                    </div>
                </div>
                <div className="twelve wide computer nine wide tablet sixteen wide mobile column">
                    <div className="product-replacement__desc">
                        <div className="product-replacement__company">Belimo</div>
                        <div className="product-replacement__title">{product.title}</div>

                        {notes && notes.length > 0 &&
                            <div className="product-replacement__note">
                                {notes.map((note, i) => (
                                    <span key={i}><i className="ui icon warning sign"></i> {note}<br /></span>
                                ))}
                                <br />
                            </div>
                        }

                        <strong><Translate content="label.property.nominal_voltage" />: </strong>
                        {product.nominal_voltage}<br />

                        {(product.torque) && (
                            <span>
                                <strong><Translate content="label.property.torque" />: </strong>
                                {product.torque}<br />
                            </span>
                        )}
                        {(product.stroke) && (
                            <span>
                                <strong><Translate content="label.property.stroke" />: </strong>
                                {product.stroke}<br />
                            </span>
                        )}

                        <div className="product-replacement__safety_function">
                            <strong><Translate content="label.property.safety_function" />: </strong>
                            {Util.specString(product.safety_function, 'retrofit_parameter')}<br />
                        </div>

                        <strong><Translate content="label.property.running_time" />: </strong>
                        {product.running_time}<br />

                        <strong><Translate content="label.property.control_type" />: </strong>
                        {(product.control_type) && (
                            <span>{product.control_type.replace('|', ', ')}</span>
                        )}
                        {(product.is_modulating) && (
                            <span> ({product.working_range})<br /></span>
                        )}

                        <div className="product-replacement__integrated_switch">
                            <strong><Translate content="label.property.integrated_switch" />: </strong>
                            {Util.specString(product.integrated_switch, 'retrofit_parameter')}<br />
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div className="product-replacement__action">
            <div className="ui internally left aligned grid">
                <div className="row">
                    <div
                        className={
                            'ten wide computer nine wide tablet sixteen wide mobile '
                            + 'column product-replacement__left'
                        }
                    >
                        <Link
                            to={`/retrofit/comparison/air/${originalId}/${product.id}/${backUrl}`}
                            className="ui left labeled grey icon button product-replacement__compare-link"
                        >
                            <i className="list layout icon"></i>
                            <Translate content="action.label.compare" />
                        </Link>

                        {product.datasheet_file && <SpecificationButton fileName={product.datasheet_file} />}

                    </div>
                    <div
                        className={
                            'six wide computer seven wide tablet sixteen wide mobile '
                            + 'column product-replacement__right'
                        }
                    >
                        <Link
                            to={`/retrofit/projects/${backUrl}`}
                            className="ui right labeled primary icon button product-replacement__add-to-project-link"
                            onClick={(SE) => handlerToBuffer()}
                        >
                            <i className="right plus icon"></i>
                            <Translate content="action.label.add.project" />
                        </Link>
                    </div>
                    <div
                        className={
                            'six wide computer seven wide tablet sixteen wide mobile '
                            + 'column product-replacement__accessories'
                        }
                    >
                        {(accessoriesAmount > 0) && (
                            <Link
                                to={`/retrofit/accessories/air/${originalId}/${product.id}/${backUrl}`}
                                className="ui right labeled grey icon button product-replacement__accessories-link"
                            >
                                <i className="right angle icon"></i>
                                <Translate content="action.label.accessories" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>

    </div>
);


Air.propTypes = {
    originalId: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    accessoriesAmount: PropTypes.number.isRequired,
    handlerToBuffer: PropTypes.func.isRequired,
    backUrl: PropTypes.string.isRequired,
    notes: PropTypes.array
};

export default Air;
