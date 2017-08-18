import React, { Component, PropTypes } from 'react';

class Loader extends Component {
    static get propTypes() {
        return {
            active: PropTypes.bool,
            delay: PropTypes.number
        };
    }

    static get defaultProps() {
        return {
            active: true, // parent component probably want to show this, if mounted this
            delay: 200 // after this ms we should consider application is worth to show some 'Loading' dimmer
        };
    }

    static get getInitialState() {
        return {
            startDelayIsOver: false
        };
    }

    componentWillMount() {
        this.setState({
            startDelayTimeout: setTimeout(() => this.setState({ startDelayIsOver: true }), this.props.delay)
        });
    }

    componentWillUnmount() {
        if (this.state.startDelayTimeout) {
            clearTimeout(this.state.startDelayTimeout);
        }
    }

    render() {
        let active = !!this.props.active;
        let delayIsOver = !!this.state.startDelayIsOver;

        return (
            <div className={(active && delayIsOver) ? 'ui active inverted page dimmer' : ''}>
                <div className="ui text loader">Loading</div>
            </div>
        );
    }

}

export default Loader;
