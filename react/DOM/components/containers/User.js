import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from '../../store/index';

/**
 * User affairs
 */
class User extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                locale: PropTypes.string
            }).isRequired,
            modelsFactory: PropTypes.object.isRequired,
        };
    }

    componentWillMount() {
        const userModel = this.props.modelsFactory.User;
        const routingModel = this.props.modelsFactory.Routing;
        userModel.init(this.props.params);
        routingModel.pushPath('/');
    }

    render() {
        return (<div></div>);
    }
}

export default connect(
    createSelector([], () => ({}))
)(User);
