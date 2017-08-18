import React, { PropTypes } from 'react';

const ClipPosition = ({ position }) => {
    const imageName = (position.length > 0 && position !== '0') ? `clip${position}` : 'noclip';

    return (
        <img
            className="ui centered medium bordered image"
            src={`/images/clip_position/${imageName}.png`}
            alt={imageName}
        />
    );
};

ClipPosition.propTypes = {
    position: PropTypes.string.isRequired
};

export default ClipPosition;
