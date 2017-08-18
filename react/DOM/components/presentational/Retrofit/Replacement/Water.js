import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import { SpecificationButton } from '../../Common';
import Image from '../../Image';

const Water = ({ originalId, product, accessoriesAmount, handlerToBuffer, backUrl, notes }) => (
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
                            <div className="product-replacement__torque">
                                <strong><Translate content="label.property.torque" />: </strong>
                                {product.torque}<br />
                            </div>
                        )}

                        {(product.actuating_force) && (
                            <div className="product-replacement__actuating_force">
                                <strong><Translate content="label.property.actuating_force" />: </strong>
                                {product.actuating_force}<br />
                            </div>
                        )}

                        <strong><Translate content="label.property.control_type" />: </strong>
                        {product.control_type}<br />


                        {(product.running_time) && (
                            <div className="product-replacement__running_time">
                                <strong><Translate content="label.property.running_time" />: </strong>
                                {product.running_time}<br />
                            </div>
                        )}

                        {(product.actuating_time) && (
                            <div className="product-replacement__actuating_time">
                                <strong><Translate content="label.property.actuating_time" />: </strong>
                                {product.actuating_time}<br />
                            </div>
                        )}

                        {(product.fail_safe_function) && (
                            <div className="product-replacement__fail_safe_function">
                                <strong><Translate content="label.property.fail_safe_function" />: </strong>
                                {product.fail_safe_function}<br />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <div className="product-replacement__action">
            <div className="ui internally left aligned grid">
                <div className="row">
                    <div
                        className={
                            'ten wide computer nine wide tablet sixteen wide '
                            + 'mobile column product-replacement__left'
                        }
                    >
                        {product.datasheet_file && <SpecificationButton fileName={product.datasheet_file} />}

                        {(accessoriesAmount > 0) && (
                            <Link
                                to={`/retrofit/accessories/water/${originalId}/${product.id}/${backUrl}`}
                                className="ui left labeled grey icon button product-replacement__accessories-link"
                            >
                                <i className="right angle icon"></i>
                                <Translate content="action.label.accessories" />
                            </Link>
                        )}

                    </div>

                    <div
                        className={
                            'six wide computer seven wide tablet sixteen wide '
                            + 'mobile column product-replacement__right'
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
                </div>
            </div>
        </div>
    </div>
);


Water.propTypes = {
    originalId: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    accessoriesAmount: PropTypes.number.isRequired,
    handlerToBuffer: PropTypes.func.isRequired,
    backUrl: PropTypes.string.isRequired,
    notes: PropTypes.array
};

export default Water;
