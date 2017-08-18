// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// components
import { NoDataWithContacts } from '../../presentational/index';
import { Originals as OriginalsPresentation } from '../../presentational/Retrofit/index';
// selectors
import { Retrofit as RetrofitSelectors } from '../../../selectors/index';

/**
 * Pagination with original devices search results of current mode or text input
 */
class Originals extends Component {

    static get propTypes() {
        return {
            ModesState: PropTypes.object.isRequired,
            UserState: PropTypes.object.isRequired,
            originals: PropTypes.array.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.handleChangeSupportContacts = this.handleChangeSupportContacts.bind(this);
        this.onPageChangeHandle = this.onPageChangeHandle.bind(this);
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        // Models
        const modesModel = this.props.modelsFactory['Retrofit.Modes'];
        const userModel = this.props.modelsFactory.User;
        const originalsModel = this.props.modelsFactory['Retrofit.Originals'];
        // Saving models for reuse
        this.setState({
            modesModel,
            userModel,
            originalsModel
        });
        // getting data for component
        originalsModel.init().then(() => {
            this.setState({ isLoading: false });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.ModesState, this.props.ModesState)) {
            this.setState({ isLoading: true });
            this.state.originalsModel.init().then(() => {
                this.setState({ isLoading: false });
            });
        }
    }

    onPageChangeHandle(pageNumber) {
        this.setState({ isLoading: true });
        this.state.originalsModel.setPaginationPage(pageNumber).then(() => {
            this.setState({ isLoading: false });
        });
    }

    hasNoData() {
        const { originals } = this.props;
        return (!_.isArray(originals) || _.size(originals) === 0);
    }

    handleChangeSupportContacts(code) {
        this.state.userModel.setCurrentSupportContacts(code);
    }

    render() {
        const deviceMode = this.state.modesModel.deviceMode;
        const searchMode = this.state.modesModel.searchMode;
        const originals = this.props.originals;
        log.debug('Originals.render() originals:', originals);
        const backButtonLink = (searchMode === 'text') ? '/retrofit' : '/retrofit/originals/parameters';
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
                            <div className="row">
                                <div
                                    className={'twelve wide computer fourteen wide tablet ' +
                                 'sixteen wide mobile column aligned center'}
                                >
                                    <Link to={backButtonLink} className="ui icon button page__back">
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
                {(!this.state.isLoading && (!_.isArray(originals) || _.size(originals) === 0)) &&
                    <NoDataWithContacts contactsInfoOptions={contactsInfoOptions} />
                }
                {(!this.state.isLoading && (_.isArray(originals) && _.size(originals) > 0)) &&
                    <OriginalsPresentation
                        deviceMode={deviceMode}
                        originals={originals}
                        originalsModel={this.state.originalsModel}
                        onPageChangeHandle={this.onPageChangeHandle}
                    />
                }
            </div>
        );
    }
}

export default connect(RetrofitSelectors.Originals())(Originals);
