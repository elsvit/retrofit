// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { default as ReactTooltip } from 'react-tooltip';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { default as Translate } from 'react-translate-component';
// components
import { Device as DeviceModes } from './Modes/index';
// selectors
import { Map as MapSelector } from '../../../selectors/index';

/**
 * Input field for search + 'search by params' button
 */
class Start extends Component {

    static get propTypes() {
        return {
            modelsFactory: PropTypes.object.isRequired,
            ModesDevice: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.handleTextSearchForm = this.handleTextSearchForm.bind(this);
        this.handleParametersSearchForm = this.handleParametersSearchForm.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDeviceChange = this.handleDeviceChange.bind(this);
    }

    componentWillMount() {
        log.debug('Retrofit.Start.getInitialState(); modelsFactory: ', this.props.modelsFactory);
        // Models
        const modesModel = this.props.modelsFactory['Retrofit.Modes'];
        const textModel = this.props.modelsFactory['Retrofit.Text'];
        const originalsModel = this.props.modelsFactory['Retrofit.Originals'];
        const productsParametersModel = this.props.modelsFactory['Retrofit.ProductsModels.Parameters'];
        const routingModel = this.props.modelsFactory.Routing;
        // Saving models for reuse
        this.setState({
            modesModel,
            textModel,
            originalsModel,
            productsParametersModel,
            routingModel,
            searchTerm: textModel.value
        });
    }

    handleTextSearchForm(SE) {
        SE.preventDefault();
        this.state.modesModel.searchMode = 'text';
        this.state.textModel.value = this.state.searchTerm;
        this.state.originalsModel.reset();
        this.state.productsParametersModel.reset();
        this.state.routingModel.pushPath('/retrofit/originals');
    }

    handleParametersSearchForm(SE) {
        this.state.modesModel.searchMode = 'parameters';
    }

    handleTextChange(SE) {
        this.setState({ searchTerm: SE.target.value });
        this.state.textModel.value = SE.target.value;
    }

    handleDeviceChange(value) {
        this.setState({ searchTerm: '' });
        this.state.textModel.value = '';
    }

    render() {
        const searchFieldProps = {
            component: 'input',
            type: 'text',
            onChange: this.handleTextChange,
            scope: 'label.form.placeholder',
            attributes: { placeholder: 'search', disabled: _.isEmpty(this.props.ModesDevice.current) ? 'disabled' : '' }
        };

        return (
            <div>
                <div className="page__header">
                    <div className="ui container">
                        <div className="ui one column vertically padded centered grid">
                            <div
                                className={'eight wide computer nine wide tablet ' +
                                'sixteen wide mobile column aligned center'}
                            >
                                <div className="wrap_retrofit_logo">
                                    <Link to="/retrofit" className="page__headerLogo">
                                        <img
                                            src="/images/retro_logo.png?v0.1"
                                            width="285"
                                            className="page__headerLogoImg"
                                            role="presentation"
                                        />
                                    </Link>
                                </div>
                                <Link to="/retrofit" className="page__headerLogo components__start_page">
                                    <img
                                        src="/images/logo_belimo.png?v0.10"
                                        className="page__headerLogoImg main_img"
                                        role="presentation"
                                    />
                                </Link>
                                <Link
                                    to="/retrofit/settings"
                                    className="ui icon button right floated settings_button"
                                >
                                    <i className="icon settings"></i>
                                </Link>
                                <ReactTooltip place="left" type="dark" effect="solid" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui container">
                    <div className="ui centered vertically padded grid">
                        <div className="row select__devices">
                            <div
                                className="main_img_box"
                            >
                                <img
                                    src="/images/retro_home_img_v3.png"
                                    className="ui centered image retro__mainImg" alt=""
                                />
                            </div>
                            <DeviceModes modesModel={this.state.modesModel} onChangeHandler={this.handleDeviceChange} />
                        </div>
                        <div className="row">
                            <div
                                className={'eight wide computer nine wide tablet ' +
                                'sixteen wide mobile column aligned center'}
                            >
                                <form className="ui form" onSubmit={this.handleTextSearchForm}>
                                    <div className="field">
                                        <label>
                                            {(() => (
                                                    _.isEmpty(this.props.ModesDevice.current)
                                                        ? <Translate content="label.headline.mode_select" />
                                                        : <Translate content="label.headline.search" />
                                                )
                                            )()}
                                        </label>
                                        <div className="ui left icon input">
                                            <Translate {...searchFieldProps} value={this.state.searchTerm} />
                                            <i className="search icon"></i>
                                        </div>
                                    </div>
                                    <button
                                        className="ui fluid primary vertical animated button"
                                        tabIndex="0"
                                        type="submit"
                                        disabled={
                                        _.isEmpty(this.props.ModesDevice.current)
                                        ||
                                        _.isEmpty(this.state.searchTerm)
                                        }
                                    >
                                        <div className="visible content">
                                            <Translate content="action.label.search.by.keyword" />
                                        </div>
                                        <div className="hidden content">
                                            <i className="right arrow icon"></i>
                                        </div>
                                    </button>
                                </form>
                                <div className="ui horizontal divider">
                                    <Translate content="label.switch.or" />
                                </div>

                                <Link
                                    to="/retrofit/originals/parameters"
                                    className={
                                        'ui fluid submit primary button'
                                        + (_.isEmpty(this.props.ModesDevice.current) ? ' disabled' : '')
                                    }
                                    onClick={this.handleParametersSearchForm}
                                >
                                    <Translate content="action.label.search.by.parameters" />
                                </Link>

                                <br />

                                <Link
                                    to="/retrofit/projects"
                                    className={'ui fluid submit primary button'}
                                >
                                    <Translate content="action.label.projects" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default connect(MapSelector({
    ModesDevice: 'Retrofit.Modes.device'
}))(Start);
