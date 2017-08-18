import { AbstractParameters } from '../index';

const defaultState = {
    water: {
        amount: 0,
        parameters: {
            nominal_voltage: {
                label: 'Nominal Voltage',
                values: [],
                options: []
            },
            control_type: {
                label: 'Control Type',
                values: [],
                options: []
            },
            fail_safe_function: {
                label: 'Fail-safe function',
                values: [],
                options: []
            }
        }
    }
};

export default AbstractParameters(defaultState, 'Retrofit.Products.Parameters');
