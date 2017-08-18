// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import shortid from 'shortid';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FlowReference } from './../../../models/ValveSizer/Reference/index';
import { projectAddProductsToBuffer } from '../../../actions/Projects';

// components
import { Combinations as CombinationsPresentation } from './../../presentational/ValveSizer/index';
import { default as NoData } from '../../presentational/NoData';
// selectors
import { Map as MapSelector } from '../../../selectors/index';

/**
 * Combinations of actuators & valves
 */
class Combinations extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                valves: PropTypes.string.isRequired,
                actuators: PropTypes.string
            }).isRequired,
            modelsFactory: PropTypes.object.isRequired,
            valves: PropTypes.object.isRequired,
            actuators: PropTypes.object.isRequired,
            flowPressure: PropTypes.object.isRequired,
            settings: PropTypes.object.isRequired,
            addProductsToProjectBuffer: PropTypes.func.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        // Models
        const combinationsModel = this.props.modelsFactory['ValveSizer.Combinations'];
        // Saving models for reuse
        this.setState({
            combinationsModel
        });
        combinationsModel.init(this.props.params).then(() => {
            this.setState({ isLoading: false });
        });
    }

    render() {
        log.debug('ValveSizer. Combination container. render();');
        const combinationsData = [];
        const valves = _.compact(_.map(
            _.values(_.get(this.props.valves, 'mapEntities', {})),
            'entityData'
        ));
        log.debug('ValveSizer. Combination container. render(); valves: ', valves);
        const actuators = _.compact(_.map(
            _.values(_.get(this.props.actuators, 'mapEntities', {})),
            'entityData'
        ));
        log.debug('ValveSizer. Combination container. render(); actuators: ', actuators);
        _.forEach(valves, (valveData) => {
            let data = {
                valveData,
                actuatorData: null
            };
            _.forEach(actuators, (actuatorData) => {
                data.actuatorData = actuatorData;
            });
            combinationsData.push(data);
        });

        const serieName = _.isEmpty(valves) ? '' : valves[0].family;
        log.debug('ValveSizer. Combination container. render(); serieName: ', serieName);

        const handlerToBuffer = this.props.addProductsToProjectBuffer;
        log.debug('ValveSizer. Combination container. render(); combinationsData: ', combinationsData);
        const maxFlow = FlowReference.convert(this.props.flowPressure.flow, this.props.settings.flow.value, 'l_h');
        const kv = FlowReference.convert(this.props.flowPressure.kv, this.props.settings.flow.value);

        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div className="twelve wide computer fourteen wide tablet sixteen wide mobile column">
                                <Link
                                    to={'/valve-sizer/products/' + serieName}
                                    className="ui right icon button page__back"
                                >
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
                                <div className="page__notab"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {(!this.state.isLoading && _.isEmpty(combinationsData)) &&
                        <NoData fallbackLink="valve-sizer" />
                    }
                    {(!this.state.isLoading && !_.isEmpty(combinationsData)) &&
                        <CombinationsPresentation.List
                            combinationsData={combinationsData}
                            maxFlow={maxFlow}
                            handlerToBuffer={handlerToBuffer}
                            kv={kv}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    addProductsToProjectBuffer: (ids) => {
        dispatch((dispatch2, getState) => {
            const entities = MapSelector({
                valves: 'ValveSizer.Combinations.Valves',
                actuators: 'ValveSizer.Combinations.Actuators'
            })(getState());

            const items = [
                {
                    id: shortid.generate(),
                    quantity: 1,
                    type: 'valve',
                    product: entities.valves.mapEntities[ids.valveId].entityData
                }
            ];
            const actuator = entities.actuators.mapEntities[ids.actuatorId];
            if (actuator) {
                items.push({
                    id: shortid.generate(),
                    quantity: 1,
                    type: 'actuator',
                    product: actuator.entityData
                });
            }

            dispatch2(projectAddProductsToBuffer({
                applicationName: 'valve-sizer',
                items
            }));
        });
    }
});

export default connect(MapSelector({
    valves: 'ValveSizer.Combinations.Valves',
    actuators: 'ValveSizer.Combinations.Actuators',
    flowPressure: 'ValveSizer.FlowPressure',
    settings: 'ValveSizer.Settings'
}), mapDispatchToProps)(Combinations);
