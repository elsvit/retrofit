import { expect } from 'chai';
import { default as PropertiesEvents } from './../../../events/ValveSizer/Properties';

describe('PropertiesEvents', () => {
    describe('creators', () => {
        it('values', () => {
            const section = 'application';
            const values = ['pressure_dependent'];
            const expectedAction = {
                type: PropertiesEvents.types.VALUES,
                payload: { section, values }
            };
            expect(PropertiesEvents.creators.values(section, values)).to.deep.equal(expectedAction);
        });

        it('reset', () => {
            const expectedAction = {
                type: PropertiesEvents.types.RESET,
                payload: {}
            };
            expect(PropertiesEvents.creators.reset()).to.deep.equal(expectedAction);
        });

        it('options', () => {
            const map = {
                application: {
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
            };
            const expectedAction = {
                type: PropertiesEvents.types.OPTIONS,
                payload: { map }
            };
            expect(PropertiesEvents.creators.options(map)).to.deep.equal(expectedAction);
        });

        it('reset filter', () => {
            const expectedAction = {
                type: PropertiesEvents.types.RESET_FILTER,
                payload: {}
            };
            expect(PropertiesEvents.creators.resetFilter()).to.deep.equal(expectedAction);
        });

        it('update filter', () => {
            const filter = {
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
            };
            const expectedAction = {
                type: PropertiesEvents.types.UPDATE_FILTER,
                payload: { filter }
            };
            expect(PropertiesEvents.creators.updateFilter(filter)).to.deep.equal(expectedAction);
        });
    });
});
