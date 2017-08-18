import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import Image from '../../Image';

/**
 * How to display structure with Actuator
 */
const Actuator = ({ actuator }) => (
    <Link
        to={'/valve-sizer/combinations/' + _.head(actuator.valves_ids) + '/' + actuator.id}
        className="product__link"
    >
        <div className="product-item __with_image">
            <div className="hover-layer"> </div>
            <div className="product-replacement__img">
                <Image
                    fileName={actuator.product_image}
                    className="ui fluid image"
                    alt={actuator.title}
                />
            </div>
            <table className="ui very basic table">
                <tbody>
                    <tr>
                        <td colSpan="5">
                            <div className="product-item__title">{actuator.title}</div>
                        </td>
                    </tr>
                    <tr className="top aligned">
                        <td width="16%">
                            <div className="product-item__property">
                                <Translate content="valve-sizer.label.actuator.degree_of_protection" />:
                            </div>
                            <div className="product-item__value">{actuator.degree_of_protection}</div>
                        </td>

                        {(actuator.running_time) && (
                            <td width="16%">
                                <div className="product-item__property">
                                    <Translate content="valve-sizer.label.actuator.running_time" />:
                                </div>
                                <div className="product-item__value">{actuator.running_time}</div>
                            </td>
                        )}
                        {(actuator.actuating_time) && (
                            <td width="16%">
                                <div className="product-item__property">
                                    <Translate content="valve-sizer.label.actuator.actuating_time" />:
                                </div>
                                <div className="product-item__value">{actuator.actuating_time}</div>
                            </td>
                        )}

                        {(actuator.torque) && (
                            <td width="16%">
                                <div className="product-item__property">
                                    <Translate content="valve-sizer.label.actuator.torque" />:
                                </div>
                                <div className="product-item__value">{actuator.torque}</div>
                            </td>
                        )}
                        {(actuator.actuating_force) && (
                            <td width="16%">
                                <div className="product-item__property">
                                    <Translate content="valve-sizer.label.actuator.actuating_force" />:
                                </div>
                                <div className="product-item__value">{actuator.actuating_force}</div>
                            </td>
                        )}

                        <td width="16%">
                            <div className="product-item__property">
                                <Translate content="valve-sizer.label.actuator.control" />:
                            </div>
                            <div className="product-item__value">{actuator.control}</div>
                        </td>

                        <td width="16%">
                            <div className="product-item__property">
                                <Translate content="valve-sizer.label.actuator.nominal_voltage" />:
                            </div>
                            <div className="product-item__value">{actuator.nominal_voltage}</div>
                        </td>

                        <td width="16%">
                            <div className="product-item__property">
                                <Translate content="valve-sizer.label.actuator.emergency_function" />:
                            </div>
                            <div className="product-item__value">
                                {(actuator.emergency_control_function) && (
                                    <span><Translate content="valve-sizer.label.actuator.yes" />,&nbsp;
                                        {actuator.emergency_control_function}
                                    </span>
                                )}
                                {(!actuator.emergency_control_function) && (
                                    <span><Translate content="valve-sizer.label.actuator.no" /></span>
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Link>
);

Actuator.propTypes = {
    actuator: PropTypes.object.isRequired
};

export default Actuator;
