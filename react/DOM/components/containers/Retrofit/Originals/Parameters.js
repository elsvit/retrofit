// libraries
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// components
import * as ParametersContainers from './Parameters/index';
// selectors
import { Map as MapSelector } from '../../../../selectors/index';

/**
 * Search parameters
 */
class Parameters extends Component {

    static get propTypes() {
        return {
            ModesState: PropTypes.object.isRequired,
            ParametersState: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        // Models
        const modesModel = this.props.modelsFactory['Retrofit.Modes'];
        const originalsModel = this.props.modelsFactory['Retrofit.Originals'];
        const originalsParametersModel = this.props.modelsFactory['Retrofit.OriginalsModels.Parameters'];
        const productsParametersModel = this.props.modelsFactory['Retrofit.ProductsModels.Parameters'];
        // Saving models for reuse
        this.setState({
            modesModel,
            originalsModel,
            originalsParametersModel,
            productsParametersModel
        });
        // getting data for component
        originalsParametersModel.init().then(() => {
            this.setState({ isLoading: false });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.ModesState, nextProps.ModesState)) {
            this.setState({ isLoading: true });
            this.state.originalsParametersModel.init().then(() => {
                this.setState({ isLoading: false });
            });
        }
    }

    render() {
        let ModeParameters = null;

        switch (this.state.modesModel.deviceMode) {
            case 'air':
                ModeParameters = ParametersContainers.Air;
                break;
            case 'water':
                ModeParameters = ParametersContainers.Water;
                break;
            default:
                return false;
        }

        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div className="row">
                                <div
                                    className={'eight wide computer fourteen wide tablet sixteen' +
                                     ' wide mobile column aligned center'}
                                >
                                    <Link to={'retrofit'} className="ui icon button page__back">
                                        <i className="left arrow icon"></i>
                                    </Link>
                                    <Link to="/retrofit" className="page__headerLogo subpages">
                                        <img
                                            src="/images/retro_logo.png?v0.1"
                                            width="285"
                                            className="page__headerLogoImg"
                                            role="presentation"
                                        />
                                    </Link>
                                    <div className="page__notab"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page__container">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div
                                className={'eight wide computer fourteen wide tablet ' +
                                'sixteen wide mobile column aligned center'}
                            >
                                {!this.state.isLoading &&
                                    <ModeParameters
                                        ParametersState={this.props.ParametersState}
                                        parametersModel={this.state.originalsParametersModel}
                                        productsParametersModel={this.state.productsParametersModel}
                                        originalsModel={this.state.originalsModel}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(MapSelector({
    ModesState: 'Retrofit.Modes',
    ParametersState: 'Retrofit.Originals.Parameters'
}))(Parameters);
