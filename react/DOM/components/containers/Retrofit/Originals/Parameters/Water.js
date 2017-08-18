// libraries
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { default as Translate } from 'react-translate-component';
// components
import { Parameters as ParametersPresentation } from '../../../../presentational/Retrofit/index';

/**
 * Parameters for filtering "originals" of "Water" mode
 */
const Water = ({ ParametersState, parametersModel, productsParametersModel, originalsModel }) => {
    const parameters = ParametersState.water.parameters;
    const resetParametersHandler = (SE) => { parametersModel.reset(); };
    const amountOfOriginals = _.get(ParametersState, 'water.amount', 0);

    return (
        <div>
            <p>
                <Translate content="label.headline.water" />
            </p>
            <ParametersPresentation routerPath="/retrofit/originals/parameters/water" parameters={parameters} />
            <p className="help-text">
                <Translate content="label.filter.instructions.water" />
            </p>
            <div className="ui vertically padded grid parameters__buttons">
                <div className="eleven wide computer eight wide tablet sixteen wide mobile column">
                    <Link
                        to="/retrofit/originals"
                        className="ui fluid right labeled icon primary button"
                        onClick={(SE) => { productsParametersModel.reset(); originalsModel.reset(); }}
                    >
                        <Translate resultCount={amountOfOriginals} content="action.label.results" />
                        <i className="right arrow icon"></i>
                    </Link>
                </div>
                <div className="five wide computer eight wide tablet sixteen wide mobile column">
                    <div onClick={resetParametersHandler} className="ui fluid grey button">
                        <Translate content="action.label.resetValues" />
                    </div>
                </div>
            </div>
        </div>
    );
};

Water.propTypes = {
    ParametersState: PropTypes.object.isRequired,
    parametersModel: PropTypes.object.isRequired,
    productsParametersModel: PropTypes.object.isRequired,
    originalsModel: PropTypes.object.isRequired
};

export default Water;
