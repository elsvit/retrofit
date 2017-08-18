import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { SeriesInfo } from './../../../../../components/presentational/ValveSizer/Products/index';
import { default as Translate } from 'react-translate-component';

function shallowRenderSeries(series, optionalTitle) {
    return shallow(<SeriesInfo series={series} optionalTitle={optionalTitle} />);
}

describe('Components.ValveSizer.Products.SeriesInfo', () => {
    describe('<SeriesInfo />', () => {
        const series = {
            dn: ['15', '20'],
            pipe_connector_count: '2',
            valve_type: 3,
            pipe_connector_type_def: 'external_thread',
            family: 'H5..B',
            product_image: 'PIC_EU_H5-B-neutral_01_4C.jpg'
        };

        const optionalTitle = "H5..BMVA";

        it('should render one image', () => {
            const wrapper = shallowRenderSeries(series);
            expect(wrapper.find('Image')).to.have.length(1);
        });

        it('should render img with required src', () => {
            const wrapper = shallowRenderSeries(series);
            expect(wrapper.find('Image').prop('fileName')).to.be.equal(series.product_image);
        });

        it('should render title correctly', () => {
            const wrapper = shallowRenderSeries(series, optionalTitle);
            expect(wrapper.find('.product-item__title').text()).to.be.equal(optionalTitle);
        });

        it('should render list of parameters', () => {
            const wrapper = shallowRenderSeries(series);
            expect(wrapper.find(Translate)).to.have.length(4);
        });
    });
});
