import React, { PropTypes } from 'react';
import * as RecommendationComponents from './Recommendation/index';

/**
 * How to display structure with ActuatorsFilter
 */
const Recommendation = (
    { matchingItems, activeMatchingItem, error, flowMax, flowUnit, pressureEffective, pressureUnit, pressureDefinition,
        onChangeActiveMatchingHandler }
) => {
    let ruleset = 0;
    if (activeMatchingItem) {
        ruleset = activeMatchingItem.ruleset;
    }

    return (
        <div className="actuator-filter">
            <div className="ui vertically divided grid">
                <RecommendationComponents.Parameters
                    flowMax={flowMax}
                    flowUnit={flowUnit}
                    pressureEffective={pressureEffective}
                    pressureUnit={pressureUnit}
                    pressureDefinition={pressureDefinition}
                    ruleset={ruleset}
                />
                <RecommendationComponents.DNSelectionSlider
                    matchingItems={matchingItems}
                    activeMatchingItem={activeMatchingItem}
                    error={error}
                    onChangeActiveMatchingHandler={onChangeActiveMatchingHandler}
                    pressureDefinition={pressureDefinition}
                />
            </div>
        </div>
    );
};

Recommendation.propTypes = {
    matchingItems: PropTypes.array.isRequired,
    activeMatchingItem: PropTypes.object.isRequired,
    error: PropTypes.object,
    flowMax: PropTypes.string.isRequired,
    flowUnit: PropTypes.string.isRequired,
    pressureEffective: PropTypes.number.isRequired,
    pressureUnit: PropTypes.string.isRequired,
    pressureDefinition: PropTypes.string.isRequired,
    onChangeActiveMatchingHandler: PropTypes.func.isRequired,
    ruleset: PropTypes.number
};

export default Recommendation;
