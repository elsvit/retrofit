import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import { default as Translate } from 'react-translate-component';
import _ from 'lodash';
import { SelectContactInfo } from './../../../../../components/presentational/Common/ContactInfo/index';

function shallowRenderSelectContactInfo(props) {
    return shallow(<SelectContactInfo {...props} />);
}

describe('Components.Common.ContactInfo.SelectContactInfo', () => {
    describe('<SelectContactInfo />', () => {
        const props = {
            countryContacts: [
                {
                    code: 'ru',
                    country: 'Russia',
                    phone: '+73837776655',
                    email: 'null-russia@xiag.ch'
                },
                {
                    code: 'en',
                    country: 'England',
                    phone: '83837776655',
                    email: 'null-england@xiag.ch',
                    address: 'England, Novosibirsk, Ippodromskaya street, 19'
                }
            ],
            selectedCountryCode: 'en',
            onChangeHandler: sinon.spy()
        };

        describe('select', () => {
            it('should render select label', () => {
                const wrapper = shallowRenderSelectContactInfo(props);
                expect(wrapper.contains(
                    <Translate content={"label.headline.settings.email"} />
                )).to.equal(true);
                expect(wrapper.contains(
                    <Translate content={"label.headline.settings.phone"} />
                )).to.equal(true);
                expect(wrapper.contains(
                    <Translate content={"label.headline.settings.address"} />
                )).to.equal(true);
            });

            it('should render select', () => {
                const wrapper = shallowRenderSelectContactInfo(props);
                expect(wrapper.find('select')).to.have.length(1);
            });

            it('should render select options', () => {
                const wrapper = shallowRenderSelectContactInfo(props);
                expect(wrapper.find('select').children('option')).to.have.length(_.size(props.countryContacts));
            });

            it('should render select with selected option by value', () => {
                const wrapper = shallowRenderSelectContactInfo(props);
                expect(wrapper.find('select').prop('value')).to.be.equal(props.selectedCountryCode);
            });
        });

        describe('contacts info', () => {
            it('should render phone of selected country', () => {
                const wrapper = shallowRenderSelectContactInfo(props);
                expect(wrapper.find('.phone').text()).to.be.equal(props.countryContacts[1].phone);
            });

            it('should render email of selected country', () => {
                const wrapper = shallowRenderSelectContactInfo(props);
                expect(wrapper.find('.email').text()).to.be.equal(props.countryContacts[1].email);
            });

            it('should render address of selected country', () => {
                const wrapper = shallowRenderSelectContactInfo(props);
                expect(wrapper.find('.address').prop('dangerouslySetInnerHTML')).to.be.deep.equal({
                    __html: props.countryContacts[1].address
                });
            });

            it('should not render address of selected country if address is empty', () => {
                const wrapper = shallowRenderSelectContactInfo(_.defaultsDeep(
                    {
                        selectedCountryCode: 'ru'
                    },
                    props
                ));
                expect(wrapper.find('.address')).to.have.length(0);
            });

            it('should not render contact info if contacts is not found', () => {
                const wrapper = shallowRenderSelectContactInfo({});
                expect(wrapper.find('.country-contact-info')).to.have.length(0);
            });
        });

        it('should call onChangeHandler if option changed', () => {
            const wrapper = shallowRenderSelectContactInfo(props);
            const event = {
                target: {
                    value: 'ru'
                }
            };
            wrapper.find('select').simulate('change', event);
            expect(props.onChangeHandler.calledOnce).to.equal(true);
        });
    });
});
