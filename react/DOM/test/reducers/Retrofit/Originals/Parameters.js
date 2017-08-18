// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as ParametersReducer } from '../../../../reducers/Retrofit/Originals/Parameters';
// events
import { default as ParametersEvents } from '../../../../events/Retrofit/Parameters';

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

describe('Reducers.Retrofit.Originals.Parameters', () => {
    it('should return the initial state', () => {
        expect(
            ParametersReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle NEW_VALUES', () => {
        const
            path = 'Retrofit.Originals.Parameters.air',
            name = 'manufacturer',
            values = ['Honeywell'];
        expect(
            ParametersReducer(defaultState, ParametersEvents.creators.newValues(path, name, values))
        ).to.deep.equal(_.defaultsDeep(
            {
                air: {
                    parameters: {
                        manufacturer: {
                            label: 'Manufacturer',
                            values: ['Honeywell'],
                            options: []
                        }
                    }
                }
            },
            defaultState
        ));
    });

    it('should handle NEW_OPTIONS', () => {
        const
            path = 'Retrofit.Originals.Parameters.air',
            map = {
                'manufacturer': ['Belimo', 'Elodrive', 'Gruner', 'Honeywell'],
                'nominal_voltage': ['AC/DC 24 V', 'AC 24 V', 'AC 110 V', 'AC 120..230 V']
            };
        expect(
            ParametersReducer(defaultState, ParametersEvents.creators.newOptions(path, map))
        ).to.deep.equal(_.defaultsDeep(
            {
                air: {
                    parameters: {
                        manufacturer: {
                            label: 'Manufacturer',
                            values: [],
                            options: ['Belimo', 'Elodrive', 'Gruner', 'Honeywell']
                        },
                        nominal_voltage: {
                            label: 'Voltage',
                            values: [],
                            options: ['AC/DC 24 V', 'AC 24 V', 'AC 110 V', 'AC 120..230 V']
                        }
                    }
                }
            },
            defaultState
        ));
    });

    it('should handle NEW_AMOUNT', () => {
        const
            path = 'Retrofit.Originals.Parameters.air',
            amount = 12;
        expect(
            ParametersReducer(defaultState, ParametersEvents.creators.newAmount(path, amount))
        ).to.deep.equal(_.defaultsDeep(
            {
                air: {
                    amount: amount
                }
            },
            defaultState
        ));
    });

    it('should handle PARAMETERS', () => {
        const
            path = 'Retrofit.Originals.Parameters.air',
            map = {
                torque: {
                    label: 'manufacturer',
                    values: [],
                    options: ['Belimo', 'Honeywell']
                }
            };
        expect(
            ParametersReducer(defaultState, ParametersEvents.creators.parameters(path, map))
        ).to.deep.equal(_.defaultsDeep(
            {
                air: {
                    parameters: map
                }
            },
            defaultState
        ));
    });
});
