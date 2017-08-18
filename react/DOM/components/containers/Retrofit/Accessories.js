// libraries
import { default as log } from 'loglevel';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// components
import { NoDataWithContacts } from '../../presentational/index';
import { Accessories as AccessoriesPresentation } from '../../presentational/Retrofit/index';
// selectors
import { Retrofit as RetrofitSelectors } from '../../../selectors/index';

/**
 * List of "Accessory" with definitions of some handlers
 */
class Accessories extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                deviceMode: PropTypes.string.isRequired,
                original: PropTypes.string.isRequired,
                product: PropTypes.string.isRequired,
                back_url: PropTypes.string
            }).isRequired,
            UserState: PropTypes.object.isRequired,
            originals: PropTypes.array.isRequired,
            accessories: PropTypes.array.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.handleChangeSupportContacts = this.handleChangeSupportContacts.bind(this);
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        // Models
        const modesModel = this.props.modelsFactory['Retrofit.Modes'];
        const accessoriesModel = this.props.modelsFactory['Retrofit.Accessories'];
        const userModel = this.props.modelsFactory.User;
        let backUrl = '/retrofit';
        if (this.props.params.back_url !== undefined && this.props.params.back_url.length > 0) {
            backUrl = this.props.params.back_url;
        }
        // Saving models for reuse
        this.setState({
            modesModel,
            accessoriesModel,
            userModel,
            backUrl
        });
        // getting data for component
        accessoriesModel.init(this.props.params).then(() => {
            this.setState({ isLoading: false });
        });
    }

    handleChangeSupportContacts(code) {
        this.state.userModel.setCurrentSupportContacts(code);
    }

    render() {
        const deviceMode = this.state.modesModel.deviceMode;
        const accessories = this.props.accessories;
        /**/log.debug('Accessories.render(); accessories: ', accessories);/**/
        const contactsInfoOptions = {
            countryContacts: this.state.userModel.supportContactsList,
            selectedCountryCode: (this.props.UserState.supportContacts.code || ''),
            onChangeHandler: this.handleChangeSupportContacts
        };

        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div
                                className={'twelve wide computer fourteen wide tablet ' +
                                'sixteen wide mobile column aligned center'}
                            >
                                <Link to={this.state.backUrl} className="ui icon button page__back">
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
                {(!this.state.isLoading && typeof accessories !== 'object') &&
                    <NoDataWithContacts contactsInfoOptions={contactsInfoOptions} />
                }
                {(!this.state.isLoading && typeof accessories === 'object') &&
                    <AccessoriesPresentation deviceMode={deviceMode} accessories={accessories} />
                }
            </div>
        );
    }
}

export default connect(RetrofitSelectors.Accessories())(Accessories);
