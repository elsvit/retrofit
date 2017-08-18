// libraries
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
// models
import { default as ProductsModel } from '../../../models/Retrofit/Products';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Models.Retrofit.Products', () => {
    describe('init()', () => {
        it('will init() product parameters', () => {
            let productsParametersModel = new class { init() { return Promise.resolve(); } };
            let spy = sinon.spy(productsParametersModel, 'init');

            const productsModel = new ProductsModel(
                mockStore({}).dispatch,
                sinon.stub(),
                productsParametersModel,
                sinon.stub(),
                sinon.stub()
            );

            productsModel.init({ deviceMode: 'water', original: '1001' });

            expect(spy.calledOnce).to.equal(true);
        });
    });
});
