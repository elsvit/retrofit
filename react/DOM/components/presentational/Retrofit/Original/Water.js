import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { default as Translate } from 'react-translate-component';

/** Original data

 "id" : "298223",
 "title" : "V3BM40",
 "serie" : null,
 "manufacture" : "Cazzaniga",
 "replacements" : [
    {
        "product" : "101273"
    }
 ]
 */

const Water = ({ original, index }) => (
    <div className="product-item">

        <table className="ui very basic celled table">
            <tbody>
                <tr>
                    <td colSpan="10">
                        <div className="product-item__manufacture">{original.manufacturer}</div>
                        <div className="product-item__title">
                            <Link to={'/retrofit/replacements/water/' + original.id}>
                                {original.title} <i className="angle right icon"></i>
                            </Link>
                        </div>
                    </td>
                </tr>
                <tr className="table_design_4row">
                    <td width="25%">
                        <div className="product-item__property"><Translate content="label.property.series" />:</div>
                        <div className="product-item__value">{original.series}</div>
                    </td>
                    <td width="25%">
                        <div className="product-item__property"><Translate content="label.property.valve_type" />:</div>
                        <div className="product-item__value">{original.valve_type}</div>
                    </td>
                    <td width="25%">
                        <div className="product-item__property"><Translate content="label.property.type" />:</div>
                        <div className="product-item__value">{original.type}</div>
                    </td>
                    <td width="25%">
                        <div className="product-item__property"><Translate content="label.property.dn" />:</div>
                        <div className="product-item__value">{original.dn}</div>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
);


Water.propTypes = {
    original: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

export default Water;
