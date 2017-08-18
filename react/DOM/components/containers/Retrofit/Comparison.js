// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { addProductsToProjectBuffer } from '../../../actions/Retrofit/Projects';
// components
import { NoDataWithContacts } from '../../presentational/index';
import { Comparison as ComparisonPresentation } from '../../presentational/Retrofit/index';
// selectors
import { Map as MapSelector } from '../../../selectors/index';

/**
 * Comparison table of Original (competitor) to Product (Belimo)
 */
class Comparison extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                deviceMode: PropTypes.string.isRequired,
                original: PropTypes.string.isRequired,
                product: PropTypes.string.isRequired,
                back_url: PropTypes.string
            }).isRequired,
            UserState: PropTypes.object.isRequired,
            Original: PropTypes.object.isRequired,
            Product: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired,
            addProductsToProjectBuffer: PropTypes.func.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.handleChangeSupportContacts = this.handleChangeSupportContacts.bind(this);
        this.handleAddToProject = this.handleAddToProject.bind(this);
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        // Models
        const modesModel = this.props.modelsFactory['Retrofit.Modes'];
        const userModel = this.props.modelsFactory.User;

        // Saving models for reuse
        this.setState({
            modesModel,
            userModel
        });
        const comparisonModel = this.props.modelsFactory['Retrofit.Comparison'];
        comparisonModel.init(this.props.params).then(() => {
            this.setState({ isLoading: false });
        });
    }

    handleChangeSupportContacts(code) {
        this.state.userModel.setCurrentSupportContacts(code);
    }

    get backUrl() {
        return (this.props.params.back_url !== undefined && this.props.params.back_url.length > 0)
            ? this.props.params.back_url
            : '/retrofit';
    }

    handleAddToProject() {
        const accessoriesModel = this.props.modelsFactory['Retrofit.Accessories'];
        const product = _.get(this.props.Product, 'entityData');
        this.props.addProductsToProjectBuffer(
            accessoriesModel,
            this.state.modesModel.deviceMode,
            this.props.params.original,
            product
        );
    }

    render() {
        const deviceMode = this.state.modesModel.deviceMode;

        const original = _.get(this.props.Original, 'entityData');
        log.debug('Comparison.render(); original: ', original);

        const product = _.get(this.props.Product, 'entityData');
        log.debug('Comparison.render(); product: ', product);

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
                                className={'twelve wide computer fourteen wide ' +
                                'tablet sixteen wide mobile column aligned center'}
                            >
                                <Link to={this.backUrl} className="ui icon button page__back">
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
                {(!this.state.isLoading && (_.isEmpty(original) || _.isEmpty(product))) &&
                    <NoDataWithContacts contactsInfoOptions={contactsInfoOptions} />
                }
                {(!this.state.isLoading && !_.isEmpty(original) && !_.isEmpty(product)) &&
                    <ComparisonPresentation
                        deviceMode={deviceMode}
                        original={original}
                        product={product}
                        handlerToProject={this.handleAddToProject}
                        backUrl={this.backUrl}
                    />
                }
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ addProductsToProjectBuffer }, dispatch);

export default connect(MapSelector({
    UserState: 'User',
    Original: 'Retrofit.Comparison.Original',
    Product: 'Retrofit.Comparison.Product'
}), mapDispatchToProps)(Comparison);
