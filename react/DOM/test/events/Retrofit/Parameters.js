import { expect } from 'chai';
import { default as ParametersEvents } from './../../../events/Retrofit/Parameters';

describe('Events.Retrofit.Parameters', () => {
    describe('creators', () => {
        it('newValues', () => {
            const path = 'Retrofit.Originals.Parameters.air';
            const name = 'manufacturer';
            const values = ['Honeywell'];
            const expectedAction = {
                type: ParametersEvents.types.NEW_VALUES,
                payload: { path, name, values }
            };
            expect(ParametersEvents.creators.newValues(path, name, values)).to.deep.equal(expectedAction);
        });

        it('newOptions', () => {
            const path = 'Retrofit.Originals.Parameters.air';
            const map = {
                'manufacturer': ['Belimo', 'Elodrive', 'Gruner', 'Honeywell'],
                'nominal_voltage': ['AC/DC 24 V', 'AC 24 V', 'AC 110 V', 'AC 120..230 V']
            };
            const expectedAction = {
                type: ParametersEvents.types.NEW_OPTIONS,
                payload: { path, map }
            };
            expect(ParametersEvents.creators.newOptions(path, map)).to.deep.equal(expectedAction);
        });

        it('newAmount', () => {
            const path = 'Retrofit.Originals.Parameters.air';
            const amount = 12;
            const expectedAction = {
                type: ParametersEvents.types.NEW_AMOUNT,
                payload: { path, amount }
            };
            expect(ParametersEvents.creators.newAmount(path, amount)).to.deep.equal(expectedAction);
        });

        it('parameters', () => {
            const path = 'Retrofit.Originals.Parameters.air';
            const map = {
                torque: {
                    label: 'Torque',
                    values: [],
                    options: []
                },
                running_time: {
                    label: 'Running Time',
                    values: [],
                    options: []
                }
            };
            const expectedAction = {
                type: ParametersEvents.types.PARAMETERS,
                payload: { path, map }
            };
            expect(ParametersEvents.creators.parameters(path, map)).to.deep.equal(expectedAction);
        });
    });
});
