import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import Image from '../../Image';
import * as Util from '../../../../utils/util';

const Air = ({ original, product, handlerToProject, backUrl }) => (
    <div>
        <div className="ui container compare">
            <div className="ui centered vertically padded grid">
                <div className="row">
                    <div
                        className={'twelve wide computer fourteen wide tablet sixteen ' +
                     'wide mobile column aligned center'}
                    >
                        <p className="container__label">
                            <Translate content="label.comparison.title" />&nbsp;
                            <strong>{original.title}</strong>
                            <br /><Translate content="label.comparison.and" />&nbsp;
                            <strong>{product.title} </strong>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div
                        className={'twelve wide computer fourteen wide tablet sixteen ' +
                     'wide mobile column aligned center'}
                    >
                        <div className="compare-table-mobile__wrapper">
                            <table className="ui very basic unstackable celled table compare-table-mobile">
                                <thead>
                                    <tr>
                                        <th width="50%">
                                            <i><Translate content="label.comparison.original" />:</i>
                                            <br /><br />
                                            {original.manufacturer}
                                            <div className="compare-table__title">{original.title}</div>
                                        </th>
                                        <th width="50%">
                                            <i><Translate content="label.comparison.replacement" />:</i><br /><br />
                                            Belimo
                                            <div className="compare-table__title">{product.title}</div>
                                            <div className="compare-table__img">
                                                <Image
                                                    fileName={product.product_image}
                                                    className="ui fluid image"
                                                    alt={product.title}
                                                />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="2" className="definition">
                                            <Translate content="label.property.nominal_voltage" />:
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{original.nominal_voltage}</td>
                                        <td>{product.nominal_voltage}</td>
                                    </tr>
                                    <tr>
                                        {((original.torque && product.stroke)
                                          || (original.stroke && product.torque)) && (
                                            <td colSpan="2" className="definition">
                                                <Translate content="label.property.stroke" />&nbsp;/&nbsp;
                                                <Translate content="label.property.torque" />:
                                            </td>
                                        )}
                                        {((original.torque && product.torque)) && (
                                            <td colSpan="2" className="definition">
                                                <Translate content="label.property.torque" />:
                                            </td>
                                        )}
                                        {((original.stroke && product.stroke)) && (
                                            <td colSpan="2" className="definition">
                                                <Translate content="label.property.stroke" />:
                                            </td>
                                        )}
                                    </tr>
                                    <tr>
                                        <td>
                                            {((!original.stroke && !original.torque)) && (
                                                <div>
                                                    -
                                                </div>
                                            )}
                                            {(original.stroke) && (
                                                <div>
                                                    {original.stroke}
                                                </div>
                                            )}
                                            {(original.torque) && (
                                                <div>
                                                    {original.torque}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {((!product.stroke && !product.torque)) && (
                                                <div>
                                                    -
                                                </div>
                                            )}
                                            {(product.stroke) && (
                                                <div>
                                                    {product.stroke}
                                                </div>
                                            )}
                                            {(product.torque) && (
                                                <div>
                                                    {product.torque}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="definition">
                                            <Translate content="label.property.safety_function" />:
                                        </td>
                                    </tr>
                                    <tr>

                                        <td>{Util.specString(original.safety_function, 'retrofit_parameter')}</td>
                                        <td>{Util.specString(product.safety_function, 'retrofit_parameter')}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="definition">
                                            <Translate content="label.property.running_time" />:
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{original.running_time}</td>
                                        <td>{product.running_time}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="definition">
                                            <Translate content="label.property.control_type" />:
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {(original.control_type) && (
                                                <div>{original.control_type.replace('|', ', ')}</div>
                                            )}
                                            {(original.is_modulating) && (
                                                <div>{original.working_range}</div>
                                            )}
                                        </td>
                                        <td>
                                            {(product.control_type) && (
                                                <div>{product.control_type.replace('|', ', ')}</div>
                                            )}
                                            {(product.is_modulating) && (
                                                <div>{product.working_range}</div>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="definition">
                                            <Translate content="label.property.integrated_switch" />:
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{Util.specString(original.integrated_switch, 'retrofit_parameter')}</td>
                                        <td>{Util.specString(product.integrated_switch, 'retrofit_parameter')}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <Link
                                                to={`/retrofit/projects/${encodeURIComponent(backUrl)}`}
                                                className="ui right fluid labeled primary icon button"
                                                onClick={(SE) => { handlerToProject(product.id); }}
                                            >
                                                <i className="right plus icon"></i>
                                                <Translate content="action.label.add.project" />
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="compare-table__wrapper">
                            <table className="ui very basic definition table compare-table">
                                <thead>
                                    <tr>
                                        <th width="33%" className="compare-table__empty"></th>
                                        <th width="33%">
                                            <i><Translate content="label.comparison.original" />:</i>
                                            <br /><br />
                                            {original.manufacturer}
                                            <div className="compare-table__title">{original.title}</div>
                                        </th>
                                        <th width="33%">
                                            <i><Translate content="label.comparison.replacement" />:</i><br /><br />
                                            Belimo
                                            <div className="compare-table__title">{product.title}</div>
                                            <div className="compare-table__img">
                                                <Image
                                                    fileName={product.product_image}
                                                    className="ui fluid image"
                                                    alt={product.title}
                                                />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="compare-table__value">
                                            <Translate content="label.property.nominal_voltage" />:
                                        </td>
                                        <td>{original.nominal_voltage}</td>
                                        <td>{product.nominal_voltage}</td>
                                    </tr>
                                    <tr>
                                        {((original.torque && product.stroke)
                                        || (original.stroke && product.torque)) && (
                                            <td className="compare-table__value">
                                                <Translate content="label.property.stroke" />&nbsp;/&nbsp;
                                                <Translate content="label.property.torque" />:
                                            </td>
                                        )}
                                        {((original.torque && product.torque)) && (
                                            <td className="compare-table__value">
                                                <Translate content="label.property.torque" />:
                                            </td>
                                        )}
                                        {((original.stroke && product.stroke)) && (
                                            <td className="compare-table__value">
                                                <Translate content="label.property.stroke" />:
                                            </td>
                                        )}

                                        {((!original.stroke && !original.torque)) && (
                                            <td>
                                                -
                                            </td>
                                        )}
                                        {(original.stroke) && (
                                            <td>
                                                {original.stroke}
                                            </td>
                                        )}
                                        {(original.torque) && (
                                            <td>
                                                {original.torque}
                                            </td>
                                        )}

                                        {((!product.stroke && !product.torque)) && (
                                            <td>
                                                -
                                            </td>
                                        )}
                                        {(product.stroke) && (
                                            <td>
                                                {product.stroke}
                                            </td>
                                        )}
                                        {(product.torque) && (
                                            <td>
                                                {product.torque}
                                            </td>
                                        )}

                                    </tr>
                                    <tr>
                                        <td className="compare-table__value">
                                            <Translate content="label.property.safety_function" />:
                                        </td>
                                        <td>{Util.specString(original.safety_function, 'retrofit_parameter')}</td>
                                        <td>{Util.specString(product.safety_function, 'retrofit_parameter')}</td>
                                    </tr>
                                    <tr>
                                        <td className="compare-table__value">
                                            <Translate content="label.property.running_time" />:
                                        </td>
                                        <td>{original.running_time}</td>
                                        <td>{product.running_time}</td>
                                    </tr>
                                    <tr>
                                        <td className="compare-table__value">
                                            <Translate content="label.property.control_type" />:
                                        </td>
                                        <td>
                                            {(original.control_type) && (
                                                <div>{original.control_type.replace('|', ', ')}</div>
                                            )}
                                            {(original.is_modulating) && (
                                                <div>{original.working_range}</div>
                                            )}
                                        </td>
                                        <td>
                                            {(product.control_type) && (
                                                <div>{product.control_type.replace('|', ', ')}</div>
                                            )}
                                            {(product.is_modulating) && (
                                                <div>{product.working_range}</div>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="compare-table__value">
                                            <Translate content="label.property.integrated_switch" />
                                        </td>
                                        <td>
                                            {Util.specString(original.integrated_switch, 'retrofit_parameter')}
                                        </td>
                                        <td>
                                            {Util.specString(product.integrated_switch, 'retrofit_parameter')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3">
                                            <Link
                                                to={`/retrofit/projects/${encodeURIComponent(backUrl)}`}
                                                className="ui right labeled primary icon button"
                                                onClick={(SE) => { handlerToProject(product.id); }}
                                            >
                                                <i className="right plus icon"></i>
                                                <Translate content="action.label.add.project" />
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
);

Air.propTypes = {
    original: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
    handlerToProject: PropTypes.func.isRequired,
    backUrl: PropTypes.string.isRequired
};

export default Air;
