import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import { default as Translate } from 'react-translate-component';
import { NoDataWithContacts } from './../../../components/presentational/index';
import { ContactInfo } from './../../../components/presentational/Common/index';

function shallowRenderNoDataWithContacts(props) {
    return shallow(<NoDataWithContacts {...props} />);
}

describe('Components.NoDataWithContacts', () => {
    describe('<NoDataWithContacts />', () => {
        const props = {
            contactsInfoOptions: {
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
            }
        };

        it('should render text about no results', () => {
            const wrapper = shallowRenderNoDataWithContacts(props);
            expect(wrapper.contains(
                <Translate content={"label.headline.no_results"} />
            )).to.equal(true);
        });

        it('should render select contacts', () => {
            const wrapper = shallowRenderNoDataWithContacts(props);
            expect(wrapper.contains(
                <ContactInfo.SelectContactInfo {...props.contactsInfoOptions} />
            )).to.equal(true);
        });
    });
});
