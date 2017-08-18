import React, { PropTypes } from 'react';
import _ from 'lodash';
import * as ReplacementsByMode from './Replacement/index';
import Translate from 'react-translate-component';
import Paginator from './../../containers/Paginator';
import { ParametersFilter } from './index';
import trans from 'counterpart';

/**
 * Several components 'Replacement/Air' or 'Replacement/Water'
 */
const Replacements = ({
    deviceMode, originalId, replacements, parameters, onChangeParameterValueHandler, handlerToBuffer, backUrl,
    productsModel, onPageChangeHandle
}) => {
    let items = [];

    let Replacement = '';
    switch (deviceMode) {
        case 'air':
            Replacement = ReplacementsByMode.Air;
            break;
        case 'water':
            Replacement = ReplacementsByMode.Water;
            break;
        default:
            return false;
    }

    let resultsLabel = 'label.headline.replacement-results.' + deviceMode;
    if (replacements.length === 1) {
        resultsLabel = 'label.headline.replacement-results-single.' + deviceMode;
    }

    replacements.forEach((replacement, index) => {
        let notes = [];
        if (replacement.note) {
            notes = replacement.note.split('|');
            notes = _.filter(notes,
                (note) => (!_.isEmpty(note))
            );
            notes = notes.map(n => n.match(/^@@/) ? trans('note.' + n) : n);
        }

        items.push(
            <Replacement
                key={index}
                index={index}
                originalId={originalId}
                product={replacement.product}
                accessoriesAmount={replacement.accessories.length}
                handlerToBuffer={() => handlerToBuffer([replacement.product])}
                backUrl={backUrl}
                notes={notes}
            />
        );
    });

    return (
        <div className="ui container">
            <div className="ui centered vertically padded grid">
                <div className="row">
                    <Translate content={resultsLabel} />
                    {(deviceMode === 'water' && !_.isEmpty(replacements)) &&
                        <ParametersFilter
                            parameters={parameters}
                            onChangeParameterValueHandler={onChangeParameterValueHandler}
                            embedMode="replacements"
                        />
                    }
                </div>
                <Paginator
                    model={productsModel}
                    onPageChangeHandle={onPageChangeHandle}
                />
                <div className="row">
                    <div
                        className="twelve wide computer fourteen wide tablet sixteen wide mobile column aligned center"
                    >
                        {items.length ? items : ''}
                    </div>
                </div>
                <Paginator
                    model={productsModel}
                    onPageChangeHandle={onPageChangeHandle}
                />
            </div>
        </div>
    );
};


Replacements.propTypes = {
    deviceMode: PropTypes.string.isRequired,
    originalId: PropTypes.string.isRequired,
    replacements: PropTypes.array.isRequired,
    parameters: PropTypes.object.isRequired,
    onChangeParameterValueHandler: PropTypes.func.isRequired,
    handlerToBuffer: PropTypes.func.isRequired,
    backUrl: PropTypes.string.isRequired,
    productsModel: PropTypes.object.isRequired,
    onPageChangeHandle: PropTypes.func.isRequired
};

export default Replacements;
