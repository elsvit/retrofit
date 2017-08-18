import React, { PropTypes } from 'react';
import * as ComparisonsByMode from './Comparison/index';

/**
 * Choice between 'Comparison/Air' or 'Comparison/Water'
 */
const Comparison = ({ deviceMode, original, product, handlerToProject, backUrl }) => {
    let ComparisonInMode = '';
    switch (deviceMode) {
        case 'air':
            ComparisonInMode = ComparisonsByMode.Air;
            break;
        case 'water':
            ComparisonInMode = ComparisonsByMode.Water;
            break;
        default:
            return false;
    }

    return (
        <div className="ui container">
            <ComparisonInMode
                original={original}
                product={product}
                handlerToProject={handlerToProject}
                backUrl={backUrl}
            />
        </div>
    );
};


Comparison.propTypes = {
    deviceMode: PropTypes.string.isRequired,
    original: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
    handlerToProject: PropTypes.func.isRequired,
    backUrl: PropTypes.string.isRequired
};

export default Comparison;
