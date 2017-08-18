import React, { PropTypes } from 'react';
import TechnicalValue from './../../../Common/TechnicalValue/TechnicalValue';

/**
 * How to display structure with DNSelectionItem
 */
const DNSelectionItem = ({ item, isActive, onClickHandler, flowLabel, domRef }) => {
    const itemKvs = TechnicalValue.getRoundedValue(item.kvs);

    return (
        <div
            className="rule-slider__itm"
            ref={domRef}
        >
            <input
                type="radio"
                id={item.valve_id}
                className="rule__radio"
                name="rule-value"
                checked={isActive}
                onChange={onClickHandler}
            />
            <label className="label-item" htmlFor={item.valve_id}>
                <span className="value__h">DN</span>
                <span className="value__txt dn-value">{item.dn}</span>
                {flowLabel === 'kvs' &&
                    <span className="value__h">k<sub>vs</sub></span>
                }
                {flowLabel === 'vnom' &&
                    <span className="value__h">V<sub>nom</sub></span>
                }
                <span className="value__txt kvs-value">{itemKvs}</span>
            </label>
        </div>
    );
};

DNSelectionItem.propTypes = {
    item: PropTypes.shape({
        recommendedStatus: PropTypes.string.isRequired,
        dn: PropTypes.string.isRequired,
        kvs: PropTypes.number.isRequired
    }).isRequired,
    isActive: PropTypes.bool,
    onClickHandler: PropTypes.func,
    flowLabel: PropTypes.string.isRequired,
    domRef: PropTypes.func.isRequired
};

export default DNSelectionItem;
