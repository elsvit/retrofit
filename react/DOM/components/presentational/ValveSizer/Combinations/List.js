// libraries
import React, { PropTypes } from 'react';
import _ from 'lodash';
import Translate from 'react-translate-component';
import { ValveClipPositionReference } from './../../../../models/ValveSizer/Reference/index';
// components
import { Combinations as CombinationsPresentation } from './../../../presentational/ValveSizer/index';

/**
 * Possible combinations of valves and actuators
 */
const List = ({ combinationsData, maxFlow, handlerToBuffer, kv }) => {
    const combinations = combinationsData.map((combinationData) => {
        const key = `${combinationData.valveData.id}${
            (combinationData.actuatorData) ? combinationData.actuatorData.id : 0
        }`;
        const backUrl = (combinationData.actuatorData)
            ? `/valve-sizer/combinations/${combinationData.valveData.id}/${combinationData.actuatorData.id}`
            : `/valve-sizer/combinations/${combinationData.valveData.id}`;
        return (
            <CombinationsPresentation.Row
                key={key}
                valveData={combinationData.valveData}
                actuatorData={combinationData.actuatorData}
                handlerToBuffer={handlerToBuffer}
                backUrl={backUrl}
            />
        );
    });
    const headValve = (_.head(combinationsData)).valveData;
    let valveClipPosition = '';

    // Pressure independent calculation (only for rulesets 3 and 4)
    if (headValve.ruleset === 3 || headValve.ruleset === 4) {
        valveClipPosition = ValveClipPositionReference.getByTitleAndMaxFlow(headValve, maxFlow);
    }

    // Pressure dependent clip position calculation (only for ruleset 2)
    if (headValve.ruleset === 2 && kv) {
        const position = ValveClipPositionReference.getByTitleAndKv(headValve, kv);
        valveClipPosition = position ? position.clipPosition : '';
    }

    return (
        <div>
            <div className="ui container">
                <div className="ui centered vertically padded grid">
                    <div className="row">
                        <div
                            className={'twelve wide computer fourteen wide tablet ' +
                                'sixteen wide mobile column aligned center'}
                        >
                            <Translate content="valve-sizer.label.combinations.valve_actuator_list" />:
                        </div>
                    </div>
                    {combinations}
                </div>
            </div>
            <div className="ui container">
                <div className="ui centered vertically padded grid">
                    <div className="row">
                        <div
                            className={'twelve wide computer fourteen wide tablet ' +
                                'sixteen wide mobile column aligned center'}
                        >
                        {(valveClipPosition.length > 0) && (
                            <CombinationsPresentation.ClipPosition
                                position={valveClipPosition}
                            />
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

List.propTypes = {
    combinationsData: PropTypes.array.isRequired,
    maxFlow: PropTypes.number.isRequired,
    handlerToBuffer: PropTypes.func.isRequired,
    kv: PropTypes.number
};

export default List;
