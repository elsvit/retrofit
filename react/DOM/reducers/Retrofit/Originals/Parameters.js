import { AbstractParameters } from '../index';

const defaultState = {
    air: {
        amount: 0,
        parameters: {
            manufacturer: {
                label: 'Manufacturer',
                values: [],
                options: []
            },
            nominal_voltage: {
                label: 'Voltage',
                values: [],
                options: []
            },
            torque: {
                label: 'Torque',
                values: [],
                options: []
            },
            safety_function: {
                label: 'Safety function',
                values: [],
                options: []
            },
            control_type: {
                label: 'Control type',
                values: [],
                options: []
            },
            running_time: {
                label: 'Running Time',
                values: [],
                options: []
            },
            integrated_switch: {
                label: 'Integrated Switch',
                values: [],
                options: []
            }
        }
    },
    water: {
        amount: 0,
        parameters: {
            valve_type: {
                label: 'Valve Type',
                values: [],
                options: []
            },
            manufacturer: {
                label: 'Manufacturer',
                values: [],
                options: []
            },
            series: {
                label: 'Series',
                values: [],
                options: []
            },
            type: {
                label: 'Type',
                values: [],
                options: []
            },
            dn: {
                label: 'DN',
                values: [],
                options: []
            }
        }
    }
};

export default AbstractParameters(defaultState, 'Retrofit.Originals.Parameters');
