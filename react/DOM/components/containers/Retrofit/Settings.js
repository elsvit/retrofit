// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// components
import { ContactInfo } from './../../presentational/Common/index';
import { Link } from 'react-router';
// selectors
import { Map as mapSelector } from '../../../selectors/index';
import TargetMarketSelector from '../TargetMarketSelector';

/**
 * Settings
 */
class Settings extends Component {

    static get propTypes() {
        return {
            modelsFactory: PropTypes.object.isRequired,
            userState: PropTypes.object.isRequired,
        };
    }

    constructor(props) {
        super(props);
        this.handleChangeSupportContacts = this.handleChangeSupportContacts.bind(this);
    }

    componentWillMount() {
        // Models
        const userModel = this.props.modelsFactory.User;
        // Saving models for reuse
        this.setState({
            userModel
        });
    }

    handleChangeSupportContacts(code) {
        this.state.userModel.setCurrentSupportContacts(code);
    }

    render() {
        const contactsInfoOptions = {
            countryContacts: this.state.userModel.supportContactsList,
            selectedCountryCode: (this.props.userState.supportContacts.code || ''),
            onChangeHandler: this.handleChangeSupportContacts
        };
        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div className="eight wide computer twelve wide tablet sixteen wide mobile column">
                                <Link to="/retrofit" className="ui right icon button page__back">
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
                <div className="ui container">
                    <div className="ui centered vertically padded grid">
                        <div className="row">
                            <div
                                className={
                                    "eight wide computer twelve wide tablet sixteen wide mobile column aligned center"
                                }
                            >
                                <TargetMarketSelector modelsFactory={this.props.modelsFactory} />
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
    userState: 'User',
}))(Settings);
