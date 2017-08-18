import React, { PropTypes } from 'react';
import * as OriginalsByMode from './Original/index';
import Translate from 'react-translate-component';
import Paginator from './../../containers/Paginator';


/**
 * Several components 'Original/Air' or 'Original/Water'
 */
const Originals = ({ deviceMode, originals, originalsModel, onPageChangeHandle }) => {
    let items = [];

    let OriginalInMode = '';
    switch (deviceMode) {
        case 'air':
            OriginalInMode = OriginalsByMode.Air;
            break;
        case 'water':
            OriginalInMode = OriginalsByMode.Water;
            break;
        default:
            return false;
    }

    originals.forEach((original, index) => {
        items.push(
            <OriginalInMode original={original} index={index} key={index} />
        );
    });

    let resultsLabel = 'label.headline.results';
    if (originals.length === 1) {
        resultsLabel = 'label.headline.results-single';
    }

    return (
        <div className="ui container">
            <div className="ui centered vertically padded grid">
                <div className="row">
                    <div
                        className="twelve wide computer fourteen wide tablet sixteen wide mobile column aligned center"
                    >
                        <Translate content={resultsLabel} />
                    </div>
                </div>
                <Paginator
                    model={originalsModel}
                    onPageChangeHandle={onPageChangeHandle}
                />
                <div className="row">
                    <div
                        className="twelve wide computer fourteen wide tablet sixteen wide mobile column aligned center"
                    >
                        {items.length && items}
                    </div>
                </div>
                <Paginator
                    model={originalsModel}
                    onPageChangeHandle={onPageChangeHandle}
                />
            </div>
        </div>
    );
};


Originals.propTypes = {
    deviceMode: PropTypes.string.isRequired,
    originals: PropTypes.array.isRequired,
    originalsModel: PropTypes.object.isRequired,
    onPageChangeHandle: PropTypes.func.isRequired
};

export default Originals;
