import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { mount } from 'enzyme';
import _ from 'lodash';
import { DNSelectionItem }
    from './../../../../../../components/presentational/ValveSizer/Products/Recommendation/index';

function shallowRenderDNSelectionItem(props) {
    return mount(<DNSelectionItem {...props} />);
}

describe('Components.ValveSizer.Products.Recommendation.DNSelectionItem', () => {
    describe('<DNSelectionItem />', () => {
        const props = {
            isActive: false,
            onClickHandler: sinon.spy(),
            item: {
                recommendedStatus: '',
                dn: '15',
                kvs: 20
            },
            flowLabel: 'kvs'
        };

        it('should render dn value', () => {
            const wrapper = shallowRenderDNSelectionItem(props);
            expect(wrapper.find('.dn-value').text()).to.be.equal(props.item.dn);
        });

        it('should render kvs value', () => {
            const wrapper = shallowRenderDNSelectionItem(props);
            expect(wrapper.find('.kvs-value').text()).to.be.equal(_.toString(props.item.kvs));
        });

        it('should call onClickHandler', () => {
            const wrapper = shallowRenderDNSelectionItem(props);
            wrapper.find('input').simulate('change');
            expect(props.onClickHandler.calledOnce).to.equal(true);
        });
    });
});
