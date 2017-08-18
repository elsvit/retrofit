// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// components
import { SettingsForm } from '../../presentational/ValveSizer/index';
import { ContactInfo } from './../../presentational/Common/index';
// selectors
import { Map as mapSelector } from '../../../selectors/index';
import TargetMarketSelector from '../TargetMarketSelector';

/**
 * Settings
 */
class Settings extends Component {

    static get propTypes() {
        return {
            settingsState: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired,
            userState: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeSupportContacts = this.handleChangeSupportContacts.bind(this);
        this.settingsModel = this.props.modelsFactory['ValveSizer.Settings'];
        this.routingModel = this.props.modelsFactory.Routing;
        this.userModel = this.props.modelsFactory.User;
    }

    handleSubmit(data) {
        this.settingsModel.flowUnit = data.flowUnit;
        this.settingsModel.pressureUnit = data.pressureUnit;
        this.routingModel.pushPath('/valve-sizer');
    }

    handleChangeSupportContacts(code) {
        this.userModel.setCurrentSupportContacts(code);
    }

    render() {
        const units = {
            flow: this.props.settingsState.flow.units,
            differential_pressure: this.props.settingsState.pressure.units
        };

        const contactsInfoOptions = {
            countryContacts: this.userModel.supportContactsList,
            selectedCountryCode: (this.props.userState.supportContacts.code || ''),
            onChangeHandler: this.handleChangeSupportContacts
        };

        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div className="eight wide computer twelve wide tablet sixteen wide mobile column">
                                <Link to="/valve-sizer" className="ui right icon button page__back">
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
                            <div
                                className={
                                    "eight wide computer twelve wide tablet sixteen wide mobile column aligned center"
                                }
                            >
                                <TargetMarketSelector modelsFactory={this.props.modelsFactory} />&nbsp;
                                <SettingsForm units={units} onSubmit={this.handleSubmit} />
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className={
                                    "eight wide computer twelve wide tablet sixteen wide mobile column aligned center"
                                }
                            >
                                <ContactInfo.SelectContactInfo {...contactsInfoOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapSelector({
    settingsState: 'ValveSizer.Settings',
    userState: 'User'
}))(Settings);
