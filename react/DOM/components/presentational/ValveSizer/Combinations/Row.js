import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import { SpecificationButton } from '../../Common';
import Image from '../../Image';

const Row = ({ valveData, actuatorData, handlerToBuffer, backUrl }) => {
    const addToProjectUrl = (backUrl && backUrl.length > 0)
        ? `/valve-sizer/projects/${encodeURIComponent(backUrl)}`
        : '/valve-sizer/projects';
    const connectionsTranslationLabel = 'valve-sizer.label.properties.connections_detail.'
        + valveData.pipe_connector_count;
    const valveTypeTranslationLabel = 'valve-sizer.label.properties.valve_type_detail.'
        + valveData.valve_type;
    const valveConnectionTranslationLabel = 'valve-sizer.label.properties.valve_connection_detail.'
        + valveData.pipe_connector_type_def;

    return (
        <div className="row add-to-project__container product_list">
            <div className="twelve wide computer fourteen wide tablet sixteen wide mobile column aligned center">

                <div className="product-item __with_image">
                    <div className="product-replacement__img">
                        <Image
                            fileName={valveData.product_image}
                            className="ui fluid image"
                            alt={valveData.family}
                        />
                    </div>
                    <table className="ui very basic table">
                        <tbody>
                            <tr>
                                <td colSpan="3">
                                    <div className="product-item__title">{valveData.title}</div>
                                </td>
                            </tr>
                            <tr className="top aligned">
                                <td width="25%">
                                    <div className="product-item__property">
                                        <Translate content="valve-sizer.label.series.connections" />
                                    </div>
                                    <div className="product-item__value">
                                        <Translate content={connectionsTranslationLabel} />
                                    </div>
                                </td>
                                <td width="25%">
                                    <div className="product-item__property">
                                        <Translate content="valve-sizer.label.series.valve_type" />
                                    </div>
                                    <div className="product-item__value">
                                        {valveData.valve_family &&
                                            <span>{valveData.valve_family}</span>
                                        }
                                        {!valveData.valve_family &&
                                            <span><Translate content={valveTypeTranslationLabel} /></span>
                                        }
                                    </div>
                                </td>
                                <td width="25%">
                                    <div className="product-item__property">
                                        <Translate content="valve-sizer.label.series.valve_connection" />
                                    </div>
                                    <div className="product-item__value">
                                        <Translate content={valveConnectionTranslationLabel} />
                                    </div>
                                </td>
                                <td width="25%">
                                    <div className="product-item__property">
                                        <Translate content="valve-sizer.label.series.dn" />:
                                    </div>
                                    <div className="product-item__value">{valveData.dn}</div>
                                </td>
                            </tr>

                            {valveData.data_sheet_file &&
                                <tr>
                                    <td colSpan="4">
                                        <SpecificationButton fileName={valveData.data_sheet_file} />
                                    </td>
                                </tr>
                            }

                        </tbody>
                    </table>
                </div>
            </div>

            {actuatorData &&
                <div className="twelve wide computer fourteen wide tablet sixteen wide mobile column aligned center">

                    <div className="product-item __with_image">
                        <div className="product-replacement__img">
                            <Image
                                fileName={actuatorData.product_image}
                                className="ui fluid image"
                                alt={actuatorData.title}
                            />
                        </div>
                        <table className="ui very basic table">
                            <tbody>
                                <tr>
                                    <td colSpan="5">
                                        <div className="product-item__title">{actuatorData.title}</div>
                                    </td>
                                </tr>
                                <tr className="top aligned">
                                    <td width="16%">
                                        <div className="product-item__property">
                                            <Translate content="valve-sizer.label.actuator.degree_of_protection" />:
                                        </div>
                                        <div className="product-item__value">{actuatorData.degree_of_protection}</div>
                                    </td>

                                    <td width="16%">
                                        <div className="product-item__property">
                                            {(actuatorData.running_time) && (
                                                <span><Translate
                                                    content="valve-sizer.label.actuator.running_time"
                                                />:</span>
                                            )}
                                            {(actuatorData.actuating_time) && (
                                                <span><Translate
                                                    content="valve-sizer.label.actuator.actuating_time"
                                                />:</span>
                                            )}
                                        </div>
                                        <div className="product-item__value">
                                            {(actuatorData.running_time) && (
                                                <span>{actuatorData.running_time}</span>
                                            )}
                                            {(actuatorData.actuating_time) && (
                                                <span>{actuatorData.actuating_time}</span>
                                            )}
                                        </div>
                                    </td>

                                    <td width="16%">
                                        <div className="product-item__property">
                                            {(actuatorData.torque) && (
                                                <span><Translate
                                                    content="valve-sizer.label.actuator.torque"
                                                />:</span>
                                            )}
                                            {(actuatorData.actuating_force) && (
                                                <span><Translate
                                                    content="valve-sizer.label.actuator.actuating_force"
                                                />:</span>
                                            )}
                                        </div>
                                        <div className="product-item__value">
                                            {(actuatorData.torque) && (
                                                <span>{actuatorData.torque}</span>
                                            )}
                                            {(actuatorData.actuating_force) && (
                                                <span>{actuatorData.actuating_force}</span>
                                            )}
                                        </div>
                                    </td>

                                    <td width="16%">
                                        <div className="product-item__property">
                                            <Translate content="valve-sizer.label.actuator.control" />:
                                        </div>
                                        <div className="product-item__value">{actuatorData.control}</div>
                                    </td>

                                    <td width="16%">
                                        <div className="product-item__property">
                                            <Translate content="valve-sizer.label.actuator.nominal_voltage" />:
                                        </div>
                                        <div className="product-item__value">{actuatorData.nominal_voltage}</div>
                                    </td>

                                    <td width="16%">
                                        <div className="product-item__property">
                                            <Translate content="valve-sizer.label.actuator.emergency_function" />:
                                        </div>
                                        <div className="product-item__value">
                                            {(actuatorData.emergency_control_function) && (
                                                <span><Translate
                                                    content="valve-sizer.label.actuator.yes"
                                                />,&nbsp;
                                                    {actuatorData.emergency_control_function}</span>
                                            )}
                                            {(!actuatorData.emergency_control_function) && (
                                                <span><Translate
                                                    content="valve-sizer.label.actuator.no"
                                                /></span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {actuatorData.data_sheet_file &&
                                    <tr>
                                        <td colSpan="4">
                                            <SpecificationButton fileName={actuatorData.data_sheet_file} />
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            }


            <div className="five wide computer five wide tablet sixteen wide mobile column add-to-project__link">
                <Link
                    to={addToProjectUrl}
                    className="ui right labeled primary icon button"
                    onClick={(SE) => handlerToBuffer({
                        valveId: valveData.id,
                        actuatorId: actuatorData ? actuatorData.id : ''
                    })}
                >
                    <i className="right plus icon"></i>
                    <Translate content="action.label.add.project" />
                </Link>
            </div>
        </div>);
};

Row.propTypes = {
    valveData: PropTypes.object.isRequired,
    actuatorData: PropTypes.object,
    handlerToBuffer: PropTypes.func.isRequired,
    backUrl: PropTypes.string
};

export default Row;
