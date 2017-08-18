import React from 'react';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import FlowPressureControl from '../../../../components/presentational/ValveSizer/FlowPressureControl';

const setup = (flow, pressure) => {
    const onClick = sinon.spy();
    const wrapper = shallow(<FlowPressureControl
        onClick={onClick}
        flow={String(flow)}
        flowUnit="m3_h"
        pressure={String(pressure)}
        pressureUnit="kPa"
    />);
    return [wrapper, onClick];
};

describe('<FlowPressureControl/>', () => {

    it('renders inactive state when flow and pressure are not set', () => {
        const [wrapper] = setup('', '');
        const button = wrapper.find('button');
        assert.notInclude(button.prop('className'), 'active');
    });

    it('renders active state when flow is set', () => {
        const [wrapper] = setup(5, '');
        const button = wrapper.find('button');
        assert.include(button.prop('className'), 'active');
    });

    it('renders active state when pressure is set', () => {
        const [wrapper] = setup('', 60);
        const button = wrapper.find('button');
        assert.include(button.prop('className'), 'active');
    });

    it('renders flow and pressure', () => {
        const flow = 123;
        const pressure = 654;
        const [wrapper] = setup(flow, pressure);
        const text = wrapper.find('button').text();
        assert.include(text, String(flow), 'flow value is present');
        assert.include(text, String(pressure), 'pressure value is present');
    });

    it('handles clicks', () => {
        const [wrapper, onClick] = setup('', 60);
        wrapper.find('button').prop('onClick')();
        assert.isTrue(onClick.calledOnce);
    });
});
