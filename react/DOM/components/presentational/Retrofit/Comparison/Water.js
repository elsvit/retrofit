import React, { PropTypes } from 'react';

/**
 * Render Original or Replacement parts depending on tab value
 */
const Water = ({ original, product, handlerToProject, backUrl }) => (
    <div>
        <h1>Comparison.Water</h1>
    </div>
);

Water.propTypes = {
    original: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
    handlerToProject: PropTypes.func.isRequired,
    backUrl: PropTypes.string.isRequired
};

export default Water;
