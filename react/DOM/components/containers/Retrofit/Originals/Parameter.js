// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import Translate  from 'react-translate-component';
import trans from 'counterpart';

// components
import { Expanded as ExpandedSelect } from '../../../presentational/Select/index';
// selectors
import { Map as MapSelector } from '../../../../selectors/index';

/**
 * Single expanded search parameter
 */
class Parameter extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                deviceMode: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            }).isRequired,
            ParametersState: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.handleParameterClick = this.handleParameterClick.bind(this);
    }

    componentWillMount() {
        // Models
        const originalsParametersModel = this.props.modelsFactory['Retrofit.OriginalsModels.Parameters'];
        const routingModel = this.props.modelsFactory.Routing;
        // Saving models for reuse
        this.setState({
            originalsParametersModel,
            routingModel
        });
        // getting data for component
        originalsParametersModel.init();
    }

    get name() {
        const { params } = this.props;
        return params.name;
    }

    get parameter() {
        return this.state.originalsParametersModel.parameter(this.name);
    }

    handleParameterClick(name, value) {
        let values = this.parameter.values;
        if (_.includes(values, value)) {
            values = [];
        } else {
            values = [value];
        }
        this.state.originalsParametersModel.setValues(name, values);
        this.state.routingModel.pushPath('/retrofit/originals/parameters');
    }

    render() {
        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div className="eight wide computer twelve wide tablet sixteen wide mobile column">
                                <Link to="/retrofit/originals/parameters" className="ui right icon button page__back">
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
                        <div className="eight wide computer nine wide tablet sixteen wide mobile column aligned center">
                            <p className="container__label">
                                <Translate
                                    parameterLabel={trans('label.property.' + this.name)}
                                    content="label.parameter.select.hint"
                                />
                            </p>
                            <ExpandedSelect
                                name={this.name}
                                title={'SELECT ' + this.parameter.label.toUpperCase()}
                                options={this.parameter.options}
                                values={this.parameter.values}
                                handler={this.handleParameterClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(MapSelector({
    ParametersState: 'Retrofit.Originals.Parameters'
}))(Parameter);
