import React from 'react';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Image from '../../../components/presentational/Image';


describe('<Image/>', () => {

    it('renders <img> with proper attributes when the file name is not empty', () => {
        const props = {
            fileName: 'a.jpg',
            alt: 'zzz',
            className: 'ccc'
        };
        const wrapper = shallow(<Image {...props} />);
        const img = wrapper.find('img');
        assert.equal(img.length, 1);
        assert.equal(img.prop('alt'), props.alt);
        assert.equal(img.prop('className'), props.className);
        assert.equal(img.prop('src'), '/belimo/retrofit/images/' + props.fileName);
    });

    it('renders <img> without extra attributes when they are not given', () => {
        const props = {
            fileName: 'a.jpg'
        };
        const wrapper = shallow(<Image {...props} />);
        const img = wrapper.find('img');
        assert.equal(img.length, 1);
        assert.isUndefined(img.prop('alt'));
        assert.isUndefined(img.prop('className'));
        assert.equal(img.prop('src'), '/belimo/retrofit/images/' + props.fileName);
    });

    it('renders <noscript> when file name is empty', () => {
        const props = {
            fileName: ''
        };
        const wrapper = shallow(<Image {...props} />);
        assert.equal(wrapper.find('img').length, 0);
        assert.equal(wrapper.find('noscript').length, 1);
    });
});
