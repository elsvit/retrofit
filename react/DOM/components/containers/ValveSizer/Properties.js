// libraries
import React, { Component, PropTypes } from 'react';
import { default as ReactTooltip } from 'react-tooltip';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { default as Translate } from 'react-translate-component';
// components
import { Properties as PropertiesPresentation } from '../../presentational/ValveSizer/index';
// selectors
import { Map as mapSelector } from '../../../selectors/index';
import FlowPressureControl from '../../presentational/ValveSizer/FlowPressureControl';

const sixConnectionUrlByLangMap = {
    en_US: 'http://www.belimo.eu/CH/EN/Product/Water/ProductCat.cfm?VCat=W3&TabID=1296&Send=Go',
    de_CH: 'http://www.belimo.eu/CH/DE/Product/Water/ProductCat.cfm?VCat=W3&TabID=1296&Send=Go',
    it_CH: 'http://www.belimo.eu/ch/it/product/water/productcat.cfm?VCat=W3&TabID=1296&Send=Go',
    fr_CH: 'http://www.belimo.eu/ch/fr/product/water/productcat.cfm?VCat=W3&TabID=1296&Send=Go'
};

/**
 * Filter properties
 */
class Properties extends Component {

    static get propTypes() {
        return {
            propertiesState: PropTypes.object.isRequired,
            settings: PropTypes.object.isRequired,
            flowPressure: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.propertiesModel = this.props.modelsFactory['ValveSizer.Properties'];
        this.flowPressureModel = this.props.modelsFactory['ValveSizer.FlowPressure'];
        this.seriesModel = this.props.modelsFactory['ValveSizer.Series'];
        this.routingModel = this.props.modelsFactory.Routing;
        this.settingsModel = this.props.modelsFactory['ValveSizer.Settings'];
        this.handlePropertyClick = this.handlePropertyClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleFlowFilter = this.handleFlowFilter.bind(this);
    }


    handlePropertyClick(propertyName, value, event) {
        event.preventDefault();
        const forceSelect = true;
        this.propertiesModel.selectPropertyValue(propertyName, value, forceSelect);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.propertiesModel.isSixConnectionFilter()) {
            const locale = this.settingsModel.locale;
            const nextUrl = sixConnectionUrlByLangMap[locale];
            if (nextUrl) {
                window.open(nextUrl);
            }
        } else {
            this.routingModel.pushPath('/valve-sizer/series');
        }
    }

    handleReset(event) {
        event.preventDefault();
        this.propertiesModel.reset();
        this.flowPressureModel.reset();
    }

    handleFlowFilter(event) {
        event.preventDefault();
        this.routingModel.pushPath('/valve-sizer/flow-pressure/' + encodeURIComponent('/valve-sizer'));
    }


    render() {
        const { settings, flowPressure } = this.props;
        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div className="eight wide computer twelve wide tablet sixteen wide mobile column">
                                <Link to="/valve-sizer" className="page__headerLogo fl_l">
                                    <img
                                        src="/images/valvesizer_logo.png"
                                        width="285"
                                        className="page__headerLogoImg"
                                        role="presentation"
                                    />
                                </Link>
                                <Link
                                    to="/valve-sizer/settings"
                                    className="ui icon button right floated"
                                >
                                    <i className="icon settings"></i>
                                </Link>
                                <ReactTooltip place="left" type="dark" effect="solid" />
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
                                <form className="ui form" onSubmit={(event) => this.handleSubmit(event)}>

                                    <FlowPressureControl
                                        onClick={this.handleFlowFilter}
                                        flow={flowPressure.flow}
                                        flowUnit={settings.flow.value}
                                        pressure={flowPressure.differential_pressure}
                                        pressureUnit={settings.pressure.value}
                                    />

                                    <PropertiesPresentation
                                        properties={this.props.propertiesState}
                                        handler={this.handlePropertyClick}
                                    />

                                    <div className="ui vertically padded grid parameters__buttons">
                                        <div
                                            className={
                                                'eleven wide computer eight wide tablet sixteen wide mobile column' +
                                                 ' show__button'
                                            }
                                        >
                                            <button
                                                className="ui fluid primary vertical animated button"
                                                tabIndex="0"
                                                type="submit"
                                            >
                                                <div className="visible content">
                                                    <Translate content="valve-sizer.action.properties.show" />
                                                </div>
                                                <div className="hidden content">
                                                    <i className="right arrow icon"></i>
                                                </div>
                                            </button>
                                        </div>
                                        <div
                                            className={
                                            'five wide computer eight wide tablet sixteen wide mobile column' +
                                             ' reset__button'
                                             }
                                        >
                                            <div onClick={this.handleReset} className="ui fluid button">
                                                <Translate content="action.label.resetValues" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ui vertically padded grid projects__button_container">
                                        <div
                                            className={'sixteen wide column projects__button'}
                                        >
                                            <Link
                                                to="/valve-sizer/projects"
                                                className={'ui fluid submit primary button'}
                                            >
                                                <Translate content="action.label.projects" />
                                            </Link>
                                        </div>
                                    </div>
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
    propertiesState: 'ValveSizer.Properties',
    settings: 'ValveSizer.Settings',
    flowPressure: 'ValveSizer.FlowPressure'
}))(Properties);
