// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import { FlowReference, PressureReference } from './../../../models/ValveSizer/Reference/index';
// components
import NoData from '../../presentational/NoData';
import { Products as ProductsPresentation } from '../../presentational/ValveSizer/index';
// selectors
import { Map as mapSelector } from '../../../selectors/index';
import ValveClipPositionReference from '../../../models/ValveSizer/Reference/ValveClipPositionReference';
import FlowPressureCalculator from '../../../models/ValveSizer/Reference/FlowPressureCalculator'
/**
 * Products container
 */
class Products extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                series: PropTypes.string
            }).isRequired,
            productsState: PropTypes.object.isRequired,
            settingsState: PropTypes.object.isRequired,
            flowPressureState: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.productsModel = this.props.modelsFactory['ValveSizer.Products'];
        this.handleChangeActiveMatchingItemClick = this.handleChangeActiveMatchingItemClick.bind(this);
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        // getting data for component
        this.productsModel.init(this.props.params).then(() => {
            this.setState({ isLoading: false });
        });
    }

    handleChangeActiveMatchingItemClick(index) {
        const matchingItems = this.props.productsState.Recommendation.dnSelection.list;
        const activeMatchingItem = this.props.productsState.Recommendation.dnSelection.active;
        const currentActiveItemIndex = matchingItems.findIndex((matchingItem) => (
            matchingItem.kvs === activeMatchingItem.kvs && matchingItem.dn === activeMatchingItem.dn
        ), activeMatchingItem);
        // sometimes slider can change index to nonexistence number, so there is checking index.
        if (currentActiveItemIndex !== index) {
            if (index < 0) {
                index = 0;
            }
            if (index >= _.size(matchingItems)) {
                index = _.size(matchingItems) - 1;
            }

            this.productsModel.changeActiveMatchingItem(index);
        }
    }

    calcEffectivePressure() {
        const {flowPressureState, settingsState, productsState} = this.props;
        const activeMatchingItem = productsState.Recommendation.dnSelection.active;
        let pressureEffective = productsState.Recommendation.parameters.pressureEffective;

        if (!activeMatchingItem || activeMatchingItem.kvs <= 0) {
            return pressureEffective;
        }

        const kv = FlowReference.convert(flowPressureState.kv, settingsState.flow.value);
        const flow = FlowReference.convert(flowPressureState.flow, settingsState.flow.value);
        const clipPosition = ValveClipPositionReference.getByTitleAndKv(activeMatchingItem, kv);
        if (!clipPosition) {
            return pressureEffective;
        }

        FlowPressureCalculator.setFlowUnit(settingsState.flow.value);
        FlowPressureCalculator.setPressureUnit(settingsState.pressure.value);
        return FlowPressureCalculator.calculateEffectivePressure(flow, clipPosition.kv);
    }

    render() {
        const {flowPressureState, settingsState, productsState} = this.props;
        const series = productsState.Result.series;
        const actuators = productsState.Result.actuators;
        const matchingItems = productsState.Recommendation.dnSelection.list;
        const activeMatchingItem = productsState.Recommendation.dnSelection.active;
        const actuatorsFilterError = productsState.Recommendation.error;
        const flowMax =
            String(flowPressureState[series.ruleset === 1 || series.ruleset === 2 ? 'kv' : 'flow']);
        const flowUnitLabel = FlowReference.getLabel(settingsState.flow.value);
        const pressureUnitLabel = PressureReference.getLabel(settingsState.pressure.value);
        const pressureEffective = this.calcEffectivePressure();

        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div
                                className={'twelve wide computer fourteen wide ' +
                             'tablet sixteen wide mobile column aligned center'}
                            >
                                <Link to="/valve-sizer/series/back" className="ui right icon button page__back">
                                    <i className="left arrow icon"></i>
                                </Link>
                                <Link to="/valve-sizer/" className="page__headerLogo subpages">
                                    <img
                                        src="/images/valvesizer_logo.png"
                                        width="285"
                                        className="page__headerLogoImg"
                                        role="presentation"
                                    />
                                </Link>
                                <div className="page__notab">
                                    <Link
                                        to={
                                            '/valve-sizer/flow-pressure/'
                                            + encodeURIComponent('/valve-sizer/products/' + series.family)
                                        }
                                        className="ui icon button right floated"
                                    >
                                        <i className="icon edit"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {(!this.state.isLoading && !series) &&
                        <NoData fallbackLink="/valve-sizer/series" />
                    }
                    {(!this.state.isLoading && series) &&
                        <ProductsPresentation
                            series={series}
                            actuators={actuators}
                            matchingItems={matchingItems}
                            activeMatchingItem={activeMatchingItem}
                            actuatorsFilterError={actuatorsFilterError}
                            flowMax={flowMax}
                            flowUnit={flowUnitLabel}
                            pressureEffective={pressureEffective}
                            pressureUnit={pressureUnitLabel}
                            onChangeActiveMatchingHandler={this.handleChangeActiveMatchingItemClick}
                        />
                    }
                </div>

            </div>
        );
    }
}

export default connect(mapSelector({
    productsState: 'ValveSizer.Products',
    settingsState: 'ValveSizer.Settings',
    flowPressureState: 'ValveSizer.FlowPressure',
}))(Products);
