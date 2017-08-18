import React, { PropTypes } from 'react';
import _ from 'lodash';
import { default as PressureReference } from './../../../../../models/ValveSizer/Reference/PressureReference';
import { default as TechnicalValue } from './../../../Common/TechnicalValue/TechnicalValue';

/**
 * How to display structure with Parameters of Recommendation Widget
 */
const Parameters = ({ flowMax, flowUnit, pressureEffective, pressureUnit, pressureDefinition, ruleset }) => {
    const showFlowMaxValue = _.toNumber(flowMax) > 0;
    const showPValue = _.toNumber(pressureEffective) > 0;
    let flowMaxValue = _.toNumber(flowMax);
    if (flowMaxValue > 0) {
        flowMaxValue = TechnicalValue.getRoundedValue(flowMaxValue);
    }
    let pressureEffectiveValue = _.toNumber(pressureEffective);
    if (pressureEffectiveValue > 0) {
        pressureEffectiveValue = TechnicalValue.getRoundedValue(pressureEffectiveValue);
    }

    let pMin = 0;
    let pMax = 0;
    let showDefaultRange = false;
    if (ruleset === 3 || ruleset === 4) {
        // Special case handling for rulesets 3 and 4
        pMin = PressureReference.convert(16, 'k_pa', pressureUnit);
        pMax = PressureReference.convert(350, 'k_pa', pressureUnit);
        showDefaultRange = true;
    }

    const pressureLabel = (pressureDefinition === 'pressure_dependent') ? 'simpleP' : 'effectiveP';
    const flowLabel = (pressureDefinition === 'pressure_dependent') ? 'kv' : 'vmax';

    return (
        <div className="two column row">

            {(showFlowMaxValue) && (
                <div className="column">
                    <div className="dn-selector__unit left-aligned">
                        {(flowLabel === 'kv') && (
                            <span>kv&nbsp;</span>
                        )}
                        {(flowLabel === 'vmax') && (
                            <span>V<sub>max</sub>&nbsp;</span>
                        )}
                        <span className="unit"><small>[{flowUnit}]</small></span>:&nbsp;
                        {flowMaxValue}
                    </div>
                </div>
            )}
            {(!showFlowMaxValue) && (
                <div className="column">
                    &nbsp;
                </div>
            )}

            {(showPValue) && (
                <div className="column">
                    <div className="dn-selector__unit right-aligned">
                        {(pressureLabel === 'simpleP') && (
                            <span>
                                <small>&#916;</small>p&nbsp;
                                <span className="unit"><small>[{pressureUnit}]</small></span>:&nbsp;
                                {pressureEffectiveValue}
                            </span>
                        )}
                        {(pressureLabel === 'effectiveP') && !showDefaultRange && (
                            <span>
                                <small>&#916;</small>p<sub>effective</sub>&nbsp;
                                <span className="unit"><small>[{pressureUnit}]</small></span>:&nbsp;
                                {pressureEffectiveValue}
                            </span>
                        )}


                        {(pressureLabel === 'effectiveP') && showDefaultRange && ruleset === 3 && (
                            <span>
                                <small>&#916;</small>p&nbsp;
                                <span className="unit"><small>[{pressureUnit}]</small></span>:&nbsp;
                                {pressureEffectiveValue} - {pMax}
                            </span>
                        )}
                        {(pressureLabel === 'effectiveP') && showDefaultRange && ruleset === 4 && (
                            <span>
                                <small>&#916;</small>p&nbsp;
                                <span className="unit"><small>[{pressureUnit}]</small></span>:&nbsp;
                                {pMin} - {pMax}
                            </span>
                        )}
                    </div>
                </div>
            )}
            {(!showPValue) && (
                <div className="column">
                    &nbsp;
                </div>
            )}

        </div>
    );
};

Parameters.propTypes = {
    flowMax: PropTypes.string.isRequired,
    flowUnit: PropTypes.string.isRequired,
    pressureEffective: PropTypes.number.isRequired,
    pressureUnit: PropTypes.string.isRequired,
    pressureDefinition: PropTypes.string.isRequired,
    ruleset: PropTypes.number
};

export default Parameters;
