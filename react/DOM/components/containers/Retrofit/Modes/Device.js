// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// components
import { Switcher } from '../../../presentational/index';
// selectors
import { Map as MapSelector } from '../../../../selectors/index';

/**
 * What type of devices you are working with
 */
class Device extends Component {

    static get propTypes() {
        return {
            modesModel: PropTypes.object.isRequired,
            ModesDevice: PropTypes.object.isRequired,
            onChangeHandler: PropTypes.func.isRequired
        };
    }

    static get defaultProps() {
        return {
            modesFilter: (mode) => true
        };
    }

    render() {
        const values = this.props.modesModel.deviceModes;

        // no switcher
        if (values.length < 2) {
            return (
                <div>
                    <span className="page__notab" />
                </div>
            );
        }

        // switcher
        const switcherProps = {
            values,
            active: this.props.ModesDevice.current,
            handler: (value) => {
                this.props.modesModel.deviceMode = value;
                this.props.onChangeHandler(value);
            },
            translate: true
        };

        return (
            <div>
                <Switcher {...switcherProps} />
            </div>
        );
    }
}

export default connect(MapSelector({
    ModesDevice: 'Retrofit.Modes.device'
}))(Device);
