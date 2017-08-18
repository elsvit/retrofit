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
import { Replacements as ReplacementsPresentation } from '../../presentational/Retrofit/index';
// selectors
import { Retrofit as RetrofitSelectors } from '../../../selectors/index';


/**
 * List of "Product + Accessory" with definitions of some handlers
 */
class Replacements extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                deviceMode: PropTypes.string.isRequired,
                original: PropTypes.string.isRequired
            }).isRequired,
            UserState: PropTypes.object.isRequired,
            Original: PropTypes.object.isRequired,
            Products: PropTypes.array.isRequired,
            Parameters: PropTypes.object.isRequired,
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
        this.handleParameterClick = this.handleParameterClick.bind(this);
        this.onPageChangeHandle = this.onPageChangeHandle.bind(this);
        this.handleAddToProject = this.handleAddToProject.bind(this);
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        // Models
        const modesModel = this.props.modelsFactory['Retrofit.Modes'];
        const productsModel = this.props.modelsFactory['Retrofit.Products'];
        const accessoriesModel = this.props.modelsFactory['Retrofit.Accessories'];
        const productsParametersModel = this.props.modelsFactory['Retrofit.ProductsModels.Parameters'];
        const userModel = this.props.modelsFactory.User;
        // Saving models for reuse
        this.setState({
            modesModel,
            productsModel,
            accessoriesModel,
            productsParametersModel,
            userModel
        });
        // getting data for component
        productsModel.init(this.props.params).then(() => {
            this.setState({ isLoading: false });
        });
    }

    onPageChangeHandle(pageNumber) {
        this.setState({ isLoading: true });
        this.state.productsModel.setPaginationPage(pageNumber).then(() => {
            this.setState({ isLoading: false });
        });
    }

    handleParameterClick(name, value) {
        const parameters = _.pickBy(
            this.props.Parameters.water.parameters,
            (parameter) => (parameter && !_.isEmpty(parameter.label))
        );
        const parameter = parameters[name] || null;
        if (parameter) {
            this.setState({ isLoading: true });
            let values = parameter.values;
            if (_.includes(values, value)) {
                values = [];
            } else {
                values = [value];
            }
            this.state.productsParametersModel.setValues(name, values).then(
                () => this.state.productsModel.init(this.props.params)
            ).then(() => {
                this.setState({ isLoading: false });
            });
        }
    }

    handleChangeSupportContacts(code) {
        this.state.userModel.setCurrentSupportContacts(code);
    }

    handleAddToProject(products) {
        this.props.addProductsToProjectBuffer(
            this.state.accessoriesModel,
            this.state.modesModel.deviceMode,
            this.props.params.original,
            products[0]
        );
    }

    render() {
        const parameters = _.pickBy(
            this.props.Parameters.water.parameters,
            (parameter) => (parameter && !_.isEmpty(parameter.label))
        );

        const deviceMode = this.state.modesModel.deviceMode;
        const originalId = this.props.params.original;
        const replacements = this.state.productsModel.originReplacements(
            this.props.Original,
            this.props.Products,
            this.state.accessoriesModel
        );
        log.debug('Replacements.render(), replacements: ', replacements);

        const backUrl = encodeURIComponent(`/retrofit/replacements/${deviceMode}/${originalId}`);

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
                                <Link to={'/retrofit/originals'} className="ui icon button page__back">
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
                            </div>
                        </div>
                    </div>
                </div>
                {(!this.state.isLoading && (!_.isArray(replacements) || _.size(replacements) === 0)) &&
                    <NoDataWithContacts contactsInfoOptions={contactsInfoOptions} />
                }
                {(!this.state.isLoading && (_.isArray(replacements) && _.size(replacements) > 0)) &&
                    <ReplacementsPresentation
                        deviceMode={deviceMode}
                        originalId={originalId}
                        replacements={replacements}
                        parameters={parameters}
                        onChangeParameterValueHandler={this.handleParameterClick}
                        handlerToBuffer={this.handleAddToProject}
                        backUrl={backUrl}
                        productsModel={this.state.productsModel}
                        onPageChangeHandle={this.onPageChangeHandle}
                    />
                }
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ addProductsToProjectBuffer }, dispatch);

export default connect(
    RetrofitSelectors.Products(),
    mapDispatchToProps
)(Replacements);
