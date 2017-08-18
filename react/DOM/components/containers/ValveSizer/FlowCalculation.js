// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { default as Translate } from 'react-translate-component';
// components
import { Power, TemperatureDifference, Flow } from '../../presentational/ValveSizer/index';
// selectors
import { Map as mapSelector } from '../../../selectors/index';

/**
 * Flow calculation
 */
class FlowCalculation extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                back_url: PropTypes.string
            }),
            flowCalculationState: PropTypes.object.isRequired,
            settingsState: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.handleChangePower = this.handleChangePower.bind(this);
        this.handleChangeTemperatureDifference = this.handleChangeTemperatureDifference.bind(this);
        this.handleChangeFlow = this.handleChangeFlow.bind(this);
        this.handleCalculation = this.handleCalculation.bind(this);
    }

    componentWillMount() {
        // Models
        const flowCalculationModel = this.props.modelsFactory['ValveSizer.FlowCalculation'];
        const flowPressureModel = this.props.modelsFactory['ValveSizer.FlowPressure'];
        const routingModel = this.props.modelsFactory.Routing;
        let backUrl = '/valve-sizer/flow-pressure';
        if (this.props.params.back_url !== undefined && this.props.params.back_url.length > 0) {
            backUrl += '/' + encodeURIComponent(this.props.params.back_url);
        }
        // Saving models for reuse
        this.setState({
            flowCalculationModel,
            flowPressureModel,
            routingModel,
            backUrl
        });

        flowCalculationModel.init();
    }

    handleChangePower(value) {
        this.state.flowCalculationModel.setPowerValue(value);

        let { temperature_difference } = this.props.flowCalculationState;
        this.state.flowCalculationModel.calculateFlowValue(value, temperature_difference);
    }

    handleChangeTemperatureDifference(value) {
        this.state.flowCalculationModel.setTemperatureDifferenceValue(value);

        let { power } = this.props.flowCalculationState;
        this.state.flowCalculationModel.calculateFlowValue(power, value);
    }

    handleChangeFlow(value) {
        this.state.flowCalculationModel.setFlowValue(value);
    }

    handleCalculation(SE) {
        SE.preventDefault();
        let { flow } = this.props.flowCalculationState;
        this.state.flowPressureModel.setFlowValue(flow);
        this.state.routingModel.pushPath(this.state.backUrl);
    }

    render() {
        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div
                                className={
                                    'eight wide computer twelve wide tablet sixteen wide mobile aligned center column'
                                }
                            >
                                <Link to={this.state.backUrl} className="ui right icon button page__back">
                                    <i className="left arrow icon"></i>
                                </Link>
                                <Link to="/valve-sizer/" className="page__headerLogo fl_r">
                                    <img
                                        src="/images/valvesizer_logo.png"
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
                <div className="ui container">
                    <div className="ui centered vertically padded grid">
                        <div className="row">
                            <div className="wide column aligned center">
                                <Translate content="valve-sizer.label.headline.flow_calculation" />
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className={
                                    'eight wide computer twelve wide tablet sixteen wide mobile column aligned center'
                                }
                            >
                                <form className="ui form" onSubmit={this.handleCalculation}>
                                    <div className="field">
                                        <div className="three fields">
                                            <Power
                                                value={this.props.flowCalculationState.power}
                                                handler={this.handleChangePower}
                                            />
                                            <TemperatureDifference
                                                value={this.props.flowCalculationState.temperature_difference}
                                                handler={this.handleChangeTemperatureDifference}
                                            />
                                            <Flow
                                                value={this.props.flowCalculationState.flow}
                                                unit={this.props.settingsState.flow.value}
                                                handler={this.handleChangeFlow}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        className="ui primary vertical animated button"
                                        tabIndex="0"
                                        type="submit"
                                    >
                                        <div className="visible content">
                                            <Translate content="valve-sizer.action.flow_calculation.take" />
                                        </div>
                                        <div className="hidden content">
                                            <i className="right arrow icon"></i>
                                        </div>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapSelector({
    flowCalculationState: 'ValveSizer.FlowCalculation',
    settingsState: 'ValveSizer.Settings',
}))(FlowCalculation);
