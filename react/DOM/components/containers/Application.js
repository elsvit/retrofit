// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// events
import { Application as ApplicationEvents } from '../../events/index';
// components
import { Error, Loader } from '../presentational/index';
// selectors
import { Map as MapSelector } from '../../selectors/index';

/**
 * Home button + Part of application
 */
class Application extends Component {
    static get propTypes() {
        return {
            children: PropTypes.object.isRequired,
            ApplicationState: PropTypes.object.isRequired,
            modelsFactory: PropTypes.object.isRequired,
            dispatch: PropTypes.func.isRequired
        };
    }

    componentWillMount() {
        const userModel = this.props.modelsFactory.User;
        userModel.init();
    }

    render() {
        const { children, ApplicationState, dispatch } = this.props;
        let errorDeliverHandler = (SE) => {
            dispatch(ApplicationEvents.creators.errorDelivered());
        };

        let loader = '';

        if (ApplicationState.isLoading || ApplicationState.isComponentLoading) {
            loader = (
                <div>
                    <Loader />
                </div>
            );
        }

        const { header, body, exceptionValue } = ApplicationState.error;
        return (
            <div>
                {(ApplicationState.isError) ?
                    <Error
                        header={header}
                        body={body}
                        exception={exceptionValue}
                        onDeliver={errorDeliverHandler}
                    />
                    : ''
                }
                {loader}
                {children}
            </div>
        );
    }
}

export default connect(MapSelector({
    ApplicationState: 'Application'
}))(Application);
