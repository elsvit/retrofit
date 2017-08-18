// libraries
import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
// components
import * as ValveSizerContainers from './ValveSizer/index';

/**
 * Application's direct child component + its own routing
 */
class ValveSizer extends Component {

    static get propTypes() {
        return {
            children: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    static routing(props) {
        return (
            <Route path="valve-sizer" component={ValveSizer}>
                <IndexRoute component={ValveSizerContainers.Properties} />
                <Route path="combinations/:valves(/:actuators)" component={ValveSizerContainers.Combinations} />
                <Route path="flow-pressure(/:back_url)" component={ValveSizerContainers.FlowPressure} />
                <Route path="flow-calculation(/:back_url)" component={ValveSizerContainers.FlowCalculation} />
                <Route path="settings(/:back_url)" component={ValveSizerContainers.Settings} />
                <Route path="series(/:back)" component={ValveSizerContainers.Series} />
                <Route path="products/:series" component={ValveSizerContainers.Products} />
            </Route>
        );
    }

    componentWillMount() {
        // Models
        const routingModel = this.props.modelsFactory.Routing;
        // Saving models for reuse
        this.setState({
            routingModel
        });
    }

    render() {
        return (
            <div className="page">
                <div className="page__content">
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default ValveSizer;
