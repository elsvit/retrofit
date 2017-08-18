// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { default as Translate } from 'react-translate-component';
// components
import {
    Units as CalculatingUnits,
    FlowPressure as CalculatingFlow,
    DifferentialPressure as CalculatingDifferentialPressure
} from '../../presentational/ValveSizer/index';
// selectors
import { Map as mapSelector } from '../../../selectors/index';

/**
 * Flow Pressure
 */
class FlowPressure extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                back_url: PropTypes.string
            }),
            flowPressureState: PropTypes.object.isRequired,
            settingsState: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.handleChangeUnits = this.handleChangeUnits.bind(this);
        this.handleChangeFlow = this.handleChangeFlow.bind(this);
        this.handleChangeDifferentPressure = this.handleChangeDifferentPressure.bind(this);
        this.handleApplyDifferentialPressure = this.handleApplyDifferentialPressure.bind(this);
    }

    componentWillMount() {
        // Models
        const settingsModel = this.props.modelsFactory['ValveSizer.Settings'];
        const flowPressureModel = this.props.modelsFactory['ValveSizer.FlowPressure'];
        const propertiesModel = this.props.modelsFactory['ValveSizer.Properties'];
        const routingModel = this.props.modelsFactory.Routing;
        let backUrl = '/valve-sizer';
        if (this.props.params.back_url !== undefined && this.props.params.back_url.length > 0) {
            backUrl = this.props.params.back_url;
        }
        // Saving models for reuse
        this.setState({
            settingsModel,
            flowPressureModel,
            propertiesModel,
            routingModel,
            backUrl
        });
    }

    handleChangeUnits(unit, value) {
        switch (unit) {
            case 'flow':
                this.state.settingsModel.flowUnit = value;
                this.state.flowPressureModel.setFlowValue('');
                break;
            case 'differential_pressure':
                this.state.settingsModel.pressureUnit = value;
                this.state.flowPressureModel.setDifferentialPressureValue('');
                break;
            default:
                break;
        }
    }

    handleChangeFlow(value) {
        this.state.flowPressureModel.setFlowValue(value);
    }

    handleChangeDifferentPressure(value) {
        this.state.flowPressureModel.setDifferentialPressureValue(value);
    }

    handleApplyDifferentialPressure(SE) {
        SE.preventDefault();

        const { differential_pressure } = this.props.flowPressureState;

        this.state.flowPressureModel.calculateAndSetKv();
        if (differential_pressure.length > 0) {
            const forceSelect = true;
            this.state.propertiesModel.selectPropertyValue('application', 'pressure_dependent', forceSelect);
        }
        this.state.routingModel.pushPath(this.state.backUrl);
    }

    render() {
        const units = {
            flow: this.props.settingsState.flow.units,
            differential_pressure: this.props.settingsState.pressure.units
        };
        const unitValues = {
            flow: this.props.settingsState.flow.value,
            differential_pressure: this.props.settingsState.pressure.value
        };
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
                            <div className="wide column center aligned">
                                <Translate content="valve-sizer.label.headline.flow_pressure" />
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className={
                                    "eight wide computer twelve wide tablet sixteen wide mobile column aligned center"
                                }
                            >
                                <form className="ui form" onSubmit={this.handleApplyDifferentialPressure}>
                                    <CalculatingUnits
                                        units={units}
                                        values={unitValues}
                                        handler={this.handleChangeUnits}
                                    />
                                    <div className="field">
                                        <div className="two fields">
                                            <CalculatingFlow
                                                value={this.props.flowPressureState.flow}
                                                unit={this.props.settingsState.flow.value}
                                                backUrl={this.state.backUrl}
                                                handler={this.handleChangeFlow}
                                            />
                                            <CalculatingDifferentialPressure
                                                value={this.props.flowPressureState.differential_pressure}
                                                unit={this.props.settingsState.pressure.value}
                                                handler={this.handleChangeDifferentPressure}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className="ui primary vertical animated button"
                                        tabIndex="0"
                                        type="submit"
                                    >
                                        <div className="visible content">
                                            <Translate content="valve-sizer.action.flow_pressure.apply" />
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
    flowPressureState: 'ValveSizer.FlowPressure',
    settingsState: 'ValveSizer.Settings'
}))(FlowPressure);
