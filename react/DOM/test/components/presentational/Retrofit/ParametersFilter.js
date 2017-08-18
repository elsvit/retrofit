import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
// import _ from 'lodash';
import Translate from 'react-translate-component';
import { ParametersFilter } from './../../../../components/presentational/Retrofit/index';
import {
    Collapsed as CollapsedSelect,
    Expanded as ExpandedSelect
} from './../../../../components/presentational/Select/index';

function shallowRenderParametersFilter(props) {
    return shallow(<ParametersFilter {...props} />);
}
function shallowRenderParametersFilterWithClickOnParameter(props, parameterIndex) {
    const wrapper = shallow(<ParametersFilter {...props} />);
    wrapper.find('.js-filter-parameters-list a').at(parameterIndex).simulate('click', {});
    return wrapper
}

describe('Components.Retrofit.ParametersFilter', () => {
    describe('<ParametersFilter />', () => {
        const props = {
            parameters: {
                'nominal_voltage': {
                    label: "Nominal Voltage",
                    values: [],
                    options: [
                        "AC/DC 24 V",
                        "AC 24 V",
                        "AC 230 V"
                    ]
                },
                'control_type': {
                    label:"Control Type",
                    values: [
                        "3-point"
                    ],
                    options: [
                        "3-point",
                        "Open-close|3-point",
                        "modulating|communicative"
                    ]
                },
                'fail_safe_function': {
                    label: "Fail-safe function",
                    values: [],
                    options: [
                        "With electrical emergency control function 0...100%"
                    ]
                }
            },
            onChangeParameterValueHandler: sinon.spy()
        };

        describe('in default state', () => {
            it('should have empty activeParameterName in state', () => {
                const wrapper = shallowRenderParametersFilter(props);
                expect(wrapper.state('activeParameterName')).to.equal('');
            });

            it('should render container for filter', () => {
                const wrapper = shallowRenderParametersFilter(props);
                expect(wrapper.find('.js-filter-parameters-list')).to.have.length(1);
            });

            it('should render list of links', () => {
                const wrapper = shallowRenderParametersFilter(props);
                expect(wrapper.find('.js-filter-parameters-list a')).to.have.length(3);
            });

            it('should render list of CollapsedSelect', () => {
                const wrapper = shallowRenderParametersFilter(props);
                expect(wrapper.find(CollapsedSelect)).to.have.length(3);
            });

            it('should render every collapsed select has correct label property', () => {
                const wrapper = shallowRenderParametersFilter(props);
                const parameterNames = Object.keys(props.parameters);
                wrapper.find(CollapsedSelect).forEach((select, index) => {
                    expect(select.prop('label')).to.be.equal('label.property.' + parameterNames[index]);
                });
            });

            it('should render every collapsed select has correct values property', () => {
                const wrapper = shallowRenderParametersFilter(props);
                const parameterNames = Object.keys(props.parameters);
                wrapper.find(CollapsedSelect).forEach((select, index) => {
                    const parameterName = parameterNames[index];
                    const parameter = props.parameters[parameterName];
                    const values = (parameter.options.length === 1 && parameter.values.length === 0)
                        ? [parameter.options[0]]
                        : parameter.values;
                    expect(select.prop('values')).to.be.deep.equal(values);
                });
            });

            it('should render every collapsed select has correct isHint property', () => {
                const wrapper = shallowRenderParametersFilter(props);
                const parameterNames = Object.keys(props.parameters);
                wrapper.find(CollapsedSelect).forEach((select, index) => {
                    const parameterName = parameterNames[index];
                    const parameter = props.parameters[parameterName];
                    const isHint = (parameter.options.length === 1 && parameter.values.length === 0);
                    expect(select.prop('isHint')).to.be.equal(isHint);
                });
            });
        });

        describe('in state with active parameter name', () => {
            it('should change state when click on one parameter', () => {
                const wrapper = shallowRenderParametersFilterWithClickOnParameter(props, 0);
                expect(wrapper.state('activeParameterName')).to.equal('nominal_voltage');
            });

            it('should render container for parameter options of filter', () => {
                const wrapper = shallowRenderParametersFilterWithClickOnParameter(props, 0);
                expect(wrapper.find('.js-filter-parameter-select')).to.have.length(1);
            });

            it('should render container for parameter options of filter', () => {
                const wrapper = shallowRenderParametersFilterWithClickOnParameter(props, 0);
                expect(wrapper.find('.js-filter-parameter-select')).to.have.length(1);
            });

            it('should render correct label for expanded select', () => {
                const wrapper = shallowRenderParametersFilterWithClickOnParameter(props, 0);
                expect(wrapper.contains(
                    <Translate
                        parameterLabel={props.parameters.nominal_voltage.label}
                        content="label.parameter.select.hint"
                    />
                )).to.equal(true);
            });

            it('should render one ExpandedSelect', () => {
                const wrapper = shallowRenderParametersFilterWithClickOnParameter(props, 0);
                expect(wrapper.find(ExpandedSelect)).to.have.length(1);
            });

            it('should render ExpandedSelect with correct properties', () => {
                const wrapper = shallowRenderParametersFilterWithClickOnParameter(props, 0);
                const expandedSelect = wrapper.find(ExpandedSelect);
                const parameter = props.parameters.nominal_voltage;
                expect(expandedSelect.prop('title')).to.be.equal(`SELECT ${parameter.label.toUpperCase()}`);
                expect(expandedSelect.prop('options')).to.be.deep.equal(parameter.options);
                expect(expandedSelect.prop('values')).to.be.deep.equal(parameter.values);
            });
        });
    });
});
