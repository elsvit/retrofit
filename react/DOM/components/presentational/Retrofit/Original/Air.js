import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import * as Util from '../../../../utils/util';

/** Original data

 id: "298068",
 title: "AM230",
 voltage: "AC 230 V",
 power_consumption: null,
 connection: null,
 safety_function: null,
 sound_power_level: null,
 torque: "18 Nm",
 running_time: "100...150 s",
 control_type: "2-P; 1-Wire",
 integrated_switch: null,
 integrated_potentiometer: null,
 degree_of_protection: "IP54",
 company: "Belimo"

 *
 */

const Air = ({ original }) => (
    <div className="product-item">

        <table className="ui very basic celled table">
            <tbody>
                <tr>
                    <td colSpan="10">
                        <div className="product-item__manufacture">{original.manufacturer}</div>
                        <div className="product-item__title">
                            <Link to={'/retrofit/replacements/air/' + original.id}>
                                {original.title} <i className="angle right icon"></i>
                            </Link>
                        </div>
                    </td>
                </tr>
                <tr className="table_design_6row">
                    <td width="16%">
                        <div className="product-item__property">
                            <Translate content="label.property.nominal_voltage" />:
                        </div>
                        <div className="product-item__value">{original.nominal_voltage}</div>
                    </td>
                    <td width="16%">
                      {(original.torque) && (
                          <div>
                              <div className="product-item__property">
                                  <Translate content="label.property.torque" />:
                              </div>
                              <div className="product-item__value">{original.torque}</div>
                          </div>
                      )}
                      {(original.stroke) && (
                          <div>
                              <div className="product-item__property">
                                  <Translate content="label.property.stroke" />:
                              </div>
                              <div className="product-item__value">{original.stroke}</div>
                          </div>
                      )}
                    </td>
                    <td width="16%">
                        <div className="product-item__property">
                            <Translate content="label.property.safety_function" />:
                        </div>
                        <div className="product-item__value">
                            {Util.specString(original.safety_function, 'retrofit_parameter')}
                        </div>
                    </td>
                    <td width="16%">
                        <div className="product-item__property">
                            <Translate content="label.property.control_type" />:
                        </div>
                        <div className="product-item__value">
                            {(original.control_type) && (
                                <span>{original.control_type.replace('|', ', ')}</span>
                            )}
                            {(original.is_modulating) && (
                                <span><br />{original.working_range}</span>
                            )}
                        </div>
                    </td>
                    <td width="16%">
                        <div className="product-item__property">
                            <Translate content="label.property.running_time" />:
                        </div>
                        <div className="product-item__value">{original.running_time}</div>
                    </td>
                    <td width="16%">
                        <div className="product-item__property">
                            <Translate content="label.property.integrated_switch" />:
                        </div>
                        <div className="product-item__value">
                            {Util.specString(original.integrated_switch, 'retrofit_parameter')}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);


Air.propTypes = {
    original: PropTypes.object.isRequired
};

export default Air;
