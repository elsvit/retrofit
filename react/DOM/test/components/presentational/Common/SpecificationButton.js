import React from 'react';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import { SpecificationButton } from '../../../../components/presentational/Common';
import { default as Translate } from 'react-translate-component';

describe('<SpecificationButton/>', () => {
    let wrapper;
    const props = {
        fileName: 'zzz_datasheet.pdf'
    };

    before(() => {
        wrapper = shallow(<SpecificationButton {...props}/>)
    });

    it('should render datasheet file link with correct path', () => {
        assert.equal(
            wrapper.find('.product-replacement__datasheet-link').prop('href'),
            `/belimo/retrofit/specifications/${props.fileName}`
        );

    });

    it('should render datasheet file link with correct text', () => {
        assert.isTrue(
            wrapper
                .find('.product-replacement__datasheet-link')
                .contains(<Translate content="action.label.specification" />)
        );
    });
});
