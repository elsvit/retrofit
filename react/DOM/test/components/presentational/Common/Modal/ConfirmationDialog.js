import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import { ConfirmationDialog } from './../../../../../components/presentational/Common/Modal/index';

function shallowRenderConfirmationDialog(props) {
    return shallow(<ConfirmationDialog {...props} />);
}

describe('Components.Common.Modal.ConfirmationDialog', () => {
    describe('<ConfirmationDialog />', () => {
        const props = {
            modalOptions: {
                isOpen: true,
                onAfterOpen: sinon.spy(),
                onRequestClose: sinon.spy(),
                closeTimeoutMS: 100,
                style: {}
            },
            MessageNode: 'Do you confirm action?',
            onConfirmHandler: sinon.spy()
        };

        it('should render confirmation message', () => {
            const wrapper = shallowRenderConfirmationDialog(props);
            expect(wrapper.find('h3').text()).to.be.equal(props.MessageNode);
        });

        it('should render cancel button', () => {
            const wrapper = shallowRenderConfirmationDialog(props);
            expect(wrapper.find('.confirmation-cancel-button')).to.have.length(1);
        });

        it('should render accept button', () => {
            const wrapper = shallowRenderConfirmationDialog(props);
            expect(wrapper.find('.confirmation-accept-button')).to.have.length(1);
        });

        it('should call onConfirmHandler with onRequestClose function when it is confirmed', () => {
            const wrapper = shallowRenderConfirmationDialog(props);
            wrapper.find('.confirmation-accept-button').simulate('click');
            expect(props.onConfirmHandler.calledOnce).to.equal(true);
            expect(props.modalOptions.onRequestClose.calledOnce).to.equal(true);
        });
    });
});
