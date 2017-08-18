import { expect } from 'chai';
import { default as ProductsEvents } from './../../../events/ValveSizer/Products';

describe('ProductsEvents', () => {
    describe('creators', () => {
        it('series', () => {
            const series = {
                id: '5107',
                title: 'H411B'
            };
            const expectedAction = {
                type: ProductsEvents.types.SERIES,
                payload: { series }
            };
            expect(ProductsEvents.creators.series(series)).to.deep.equal(expectedAction);
        });

        it('actuatorsBuffer', () => {
            const actuators = [
                {id: '1', title: 'actuator 1'},
                {id: '2', title: 'actuator 2'},
            ];
            const expectedAction = {
                type: ProductsEvents.types.ACTUATORS_BUFFER,
                payload: { actuators }
            };
            expect(ProductsEvents.creators.actuatorsBuffer(actuators)).to.deep.equal(expectedAction);
        });

        it('actuators', () => {
            const actuators = [
                {id: '1', title: 'actuator 1'},
                {id: '2', title: 'actuator 2'},
            ];
            const expectedAction = {
                type: ProductsEvents.types.ACTUATORS,
                payload: { actuators }
            };
            expect(ProductsEvents.creators.actuators(actuators)).to.deep.equal(expectedAction);
        });
    });
});
