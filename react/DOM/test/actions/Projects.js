import { expect } from 'chai';
import * as actions from '../../actions/Projects';

describe('Actions.Projects', () => {

    it('should create action to project create', () => {
        expect(actions.projectCreate()).to.deep.equal({
            type: actions.PROJECT_CREATE
        });
    });

    it('should create action to project edit', () => {
        expect(actions.projectEdit()).to.deep.equal({
            type: actions.PROJECT_EDIT
        });
    });

    it('should create action to project delete', () => {
        expect(actions.projectDelete()).to.deep.equal({
            type: actions.PROJECT_DELETE
        });
    });

    it('should create action to project add products to buffer', () => {
        expect(actions.projectAddProductsToBuffer()).to.deep.equal({
            type: actions.PROJECT_ADD_PRODUCTS_TO_BUFFER
        });
    });

    it('should create action to project clear products buffer', () => {
        expect(actions.projectClearProductsBuffer()).to.deep.equal({
            type: actions.PROJECT_CLEAR_PRODUCTS_BUFFER
        });
    });

    it('should create action to project add products', () => {
        expect(actions.projectAddProducts()).to.deep.equal({
            type: actions.PROJECT_ADD_PRODUCTS
        });
    });

    it('should create action to project delete product', () => {
        expect(actions.projectDeleteProduct()).to.deep.equal({
            type: actions.PROJECT_DELETE_PRODUCT
        });
    });

    it('should create action to project change product quantity', () => {
        expect(actions.projectChangeProductQuantity()).to.deep.equal({
            type: actions.PROJECT_CHANGE_PRODUCT_QUANTITY
        });
    });

});
