import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import { ProductRow } from './../../../../../components/presentational/Common/Project/index';

function shallowRenderProductRow(props) {
    return shallow(<ProductRow {...props} />);
}

describe('Components.Common.Project.ProductRow', () => {
    describe('<ProductRow />', () => {
        const props = {
            projectData: {
                name: 'test project'
            },
            projectItemData: {
                id: 'a7xi28',
                quantity: 2,
                product: {
                    title: 'BEP-10F1E',
                    product_image: 'product_image.jpg',
                },
                quantityHandler: sinon.spy(),
                detachHandler: sinon.spy()
            }
        };

        it('should render quantity input field', () => {
            const wrapper = shallowRenderProductRow(props);
            const input = wrapper.find('.product-quantity');
            expect(input.is('input')).to.equal(true);
            expect(input.prop('type')).to.be.equal('text');
            expect(input.prop('placeholder')).to.be.equal(props.projectItemData.quantity);
        });

        it('should render quantity increasing button', () => {
            const wrapper = shallowRenderProductRow(props);
            expect(wrapper.find('.product-quantity-increase-btn')).to.have.length(1);
        });

        it('should render quantity decreasing button', () => {
            const wrapper = shallowRenderProductRow(props);
            expect(wrapper.find('.product-quantity-decrease-btn')).to.have.length(1);
        });

        it('should render product removing button', () => {
            const wrapper = shallowRenderProductRow(props);
            expect(wrapper.find('.product-remove-btn')).to.have.length(1);
        });

        it('should render product image', () => {
            const wrapper = shallowRenderProductRow(props);
            expect(wrapper.find('Image')).to.have.length(1);
        });

        it('should render product image with correct src', () => {
            const wrapper = shallowRenderProductRow(props);
            expect(wrapper.find('Image').prop('fileName')).to.be.equal(props.projectItemData.product.product_image);
        });

        it('should render product row content', () => {
            const wrapper = shallowRenderProductRow(props);
            expect(wrapper.find('.product-title').text()).to.be.equal(props.projectItemData.product.title);
        });

        it('should have confirmation dialog', () => {
            const wrapper = shallowRenderProductRow(props);
            expect(wrapper.find('ConfirmationDialog')).to.have.length(1);
            expect(wrapper.state('modalIsOpen')).to.equal(false);
        });

        it('should call quantityHandler on increasing button', () => {
            const wrapper = shallowRenderProductRow(props);
            wrapper.find('.product-quantity-increase-btn').simulate('click');
            expect(props.projectItemData.quantityHandler.calledWith(props.projectItemData.quantity + 1)).to.equal(true);
        });

        it('should call quantityHandler on decreasing button', () => {
            const wrapper = shallowRenderProductRow(props);
            wrapper.find('.product-quantity-decrease-btn').simulate('click');
            expect(props.projectItemData.quantityHandler.calledWith(props.projectItemData.quantity - 1)).to.equal(true);
        });

        it('should change state for confirmation dialog showing on click on remove button', () => {
            const wrapper = shallowRenderProductRow(props);
            wrapper.find('.product-remove-btn').simulate('click');
            expect(wrapper.state('modalIsOpen')).to.equal(true);
        });
    });
});
