// libraries
import { expect } from 'chai';
import _ from 'lodash';
// reducers
import { default as PropertiesReducer } from './../../../reducers/ValveSizer/Properties';
// events
import { default as PropertiesEvents } from './../../../events/ValveSizer/Properties';

const defaultState = {
    application: {
        values: [],
        options: [
            {
                name: 'pressure_independent',
                label: 'Druckunabhängig',
                enabled: true
            },
            {
                name: 'pressure_dependent',
                label: 'Druckabhängig',
                enabled: true
            }
        ]
    },
    ventilator: {
        values: [],
        options: [
            {
                name: 'control_valve',
                label: 'Regelventil',
                enabled: true
            },
            {
                name: 'shut_off_and_diverter_valve',
                label: 'Absperr- und Umschaltventil',
                enabled: true
            }
        ]
    },
    valve_connection: {
        values: [],
        options: [
            {
                name: 'internal_thread',
                label: 'Innengewinde',
                enabled: true
            },
            {
                name: 'external_thread',
                label: 'Aussengewinde',
                enabled: true
            },
            {
                name: 'flange',
                label: 'Flansch',
                enabled: true
            }
        ]
    },
    connections: {
        values: [],
        options: [
            {
                name: '2',
                label: '2',
                enabled: true
            },
            {
                name: '3',
                label: '3',
                enabled: true
            },
            {
                name: '6',
                label: '6',
                enabled: true
            }
        ]
    },
    pn_selections: {
        values: [],
        options: [
            {
                name: '6',
                label: '6',
                enabled: true
            },
            {
                name: '10',
                label: '10',
                enabled: true
            },
            {
                name: '16',
                label: '16',
                enabled: true
            },
            {
                name: '25',
                label: '25',
                enabled: true
            },
            {
                name: '40',
                label: '40',
                enabled: true
            }
        ]
    }
};

describe('Reducers.ValveSizer.Properties', () => {
    it('should return the initial state', () => {
        expect(
            PropertiesReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle set values', () => {
        const
            property = 'application',
            values = ['pressure_dependent'];
        expect(
            PropertiesReducer(defaultState, PropertiesEvents.creators.values(property, values))
        ).to.deep.equal(_.assign({}, defaultState, {
            application: { values: values, options: defaultState.application.options }
        }));
    });

    it('should handle reset', () => {
        const changedState = _.assign({}, defaultState, {
            application: { values: ['pressure_dependent'], options: defaultState.application.options }
        })
        expect(
            PropertiesReducer(changedState, PropertiesEvents.creators.reset())
        ).to.deep.equal(defaultState);
    });

    it('should handle update filter', () => {
        const filter = _.defaultsDeep({
            application: {
                values: ['pressure_dependent'],
                options: [
                    {
                        name: 'pressure_independent',
                        label: 'Druckunabhängig',
                        enabled: false
                    },
                    {
                        name: 'pressure_dependent',
                        label: 'Druckabhängig',
                        enabled: true
                    }
                ]
            }
        }, defaultState);
        expect(
            PropertiesReducer(defaultState, PropertiesEvents.creators.updateFilter(filter))
        ).to.deep.equal(filter);
    });

    it('should handle reset filter', () => {
        const changedState = _.defaultsDeep({
            application: {
                values: ['pressure_dependent'],
                options: [
                    {
                        name: 'pressure_independent',
                        label: 'Druckunabhängig',
                        enabled: false
                    },
                    {
                        name: 'pressure_dependent',
                        label: 'Druckabhängig',
                        enabled: true
                    }
                ]
            }
        }, defaultState);
        expect(
            PropertiesReducer(changedState, PropertiesEvents.creators.resetFilter())
        ).to.deep.equal(defaultState);
    });
});
