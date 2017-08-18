import React, { PropTypes } from 'react';
import * as AccessoriesByMode from './Accessory/index';

/**
 * Several components "Accessory/Air" or "Accessory/Water"
 */
const Accessories = ({ deviceMode, accessories }) => {
    let items = [];

    let AccessoryInMode = '';
    switch (deviceMode) {
        case 'air':
            AccessoryInMode = AccessoriesByMode.Air;
            break;
        case 'water':
            AccessoryInMode = AccessoriesByMode.Water;
            break;
        default:
            return false;
    }

    accessories.forEach((accessory, index) => {
        items.push(
            <AccessoryInMode key={index} index={index} accessory={accessory} />
        );
    });

    return (
        <div className="ui container">
            {items.length ? items : ''}
        </div>
    );
};


Accessories.propTypes = {
    deviceMode: PropTypes.string.isRequired,
    accessories: PropTypes.array.isRequired
};

export default Accessories;
