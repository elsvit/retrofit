import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { default as Translate } from 'react-translate-component';
import { Water } from './../../../../../components/presentational/Retrofit/Replacement/index';
import { SpecificationButton } from './../../../../../components/presentational/Common';

function shallowRenderWaterReplacement(props) {
    return shallow(<Water {...props} />);
}

describe('Components.Retrofit.Replacement', () => {
    describe('<Water />', () => {
        const props = {
            originalId: 'zuq71U',
            product: {
                id: '5155',
                title: 'NVK24A-3-RE',
                product_image: 'product_image.jpg',
                nominal_voltage: 'AC 24 V',
                control_type: 'Open-close, 3-point'
            },
            accessoriesAmount: 0,
            handlerToBuffer: sinon.spy(),
            backUrl: encodeURIComponent('/retrofit/replacements/water/298068')
        };
        const extendedProps = _.defaultsDeep(
            {
                product: {
                    torque: '20 Nm',
                    actuating_force: '1000 N',
                    running_time: '90 s',
                    actuating_time: '35 s / 20 mm',
                    fail_safe_function: 'With electrical emergency control function 0...100%',
                    datasheet_file: 'water_datasheet_file.xls'
                },
                accessoriesAmount: 12,
                notes: ['first replacement note', 'second replacement note']
            },
            props
        );
        describe('description', () => {
            describe('image', () => {
                it('should render product image', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('Image')).to.have.length(1);
                });

                it('should render product image with correct src', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('Image').prop('fileName')).to.be.equal(props.product.product_image);
                });

                it('should render product image with correct alt', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('Image').prop('alt')).to.be.equal(props.product.title);
                });
            });

            it('should render company name', () => {
                const wrapper = shallowRenderWaterReplacement(props);
                expect(wrapper.find('.product-replacement__company').text()).to.be.equal('Belimo');
            });

            it('should render product title', () => {
                const wrapper = shallowRenderWaterReplacement(props);
                expect(wrapper.find('.product-replacement__title').text()).to.be.equal(`${props.product.title}`);
            });

            describe('nominal_voltage', () => {
                it('should render product nominal_voltage property label', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.contains(
                        <Translate content="label.property.nominal_voltage"/>
                    )).to.equal(true);
                });

                it('should render product nominal_voltage property value', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.contains(`${props.product.nominal_voltage}`)).to.be.equal(true);
                });
            });

            describe('torque', () => {
                it('should not render product torque property', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('.product-replacement__torque')).to.have.length(0);
                });

                it('should render product torque property label', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__torque').contains(
                        <Translate content="label.property.torque"/>
                    )).to.equal(true);
                });

                it('should render product torque property', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__torque').contains(
                        `${extendedProps.product.torque}`
                    )).to.be.equal(true);
                });
            });

            describe('actuating_force', () => {
                it('should not render product actuating_force property', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('.product-replacement__actuating_force')).to.have.length(0);
                });

                it('should render product actuating_force property label', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__actuating_force').contains(
                        <Translate content="label.property.actuating_force"/>
                    )).to.equal(true);
                });

                it('should render product actuating_force property', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__actuating_force').contains(
                        `${extendedProps.product.actuating_force}`
                    )).to.be.equal(true);
                });
            });

            describe('control_type', () => {
                it('should render product control_type property label', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.contains(
                        <Translate content="label.property.control_type"/>
                    )).to.equal(true);
                });

                it('should render product control_type property value', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.contains(`${props.product.control_type}`)).to.be.equal(true);
                });
            });

            describe('running_time', () => {
                it('should not render product running_time property', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('.product-replacement__running_time')).to.have.length(0);
                });

                it('should render product running_time property label', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__running_time').contains(
                        <Translate content="label.property.running_time"/>
                    )).to.equal(true);
                });

                it('should render product running_time property', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__running_time').contains(
                        `${extendedProps.product.running_time}`
                    )).to.be.equal(true);
                });
            });

            describe('actuating_time', () => {
                it('should not render product actuating_time property', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('.product-replacement__actuating_time')).to.have.length(0);
                });

                it('should render product actuating_time property label', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__actuating_time').contains(
                        <Translate content="label.property.actuating_time"/>
                    )).to.equal(true);
                });

                it('should render product actuating_time property', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__actuating_time').contains(
                        `${extendedProps.product.actuating_time}`
                    )).to.be.equal(true);
                });
            });

            describe('fail_safe_function', () => {
                it('should not render product fail_safe_function property', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('.product-replacement__fail_safe_function')).to.have.length(0);
                });

                it('should render product fail_safe_function property label', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__fail_safe_function').contains(
                        <Translate content="label.property.fail_safe_function"/>
                    )).to.equal(true);
                });

                it('should render product safety function property', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__fail_safe_function').contains(
                        `${extendedProps.product.fail_safe_function}`
                    )).to.be.equal(true);
                });
            });

            describe('note', () => {
                it('should not render note if note is null', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('.product-replacement__note')).to.have.length(0);
                });

                it('should render note', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__note').contains(
                        `${extendedProps.notes[0]}`
                    )).to.be.equal(true);
                    expect(wrapper.find('.product-replacement__note').contains(
                        `${extendedProps.notes[1]}`
                    )).to.be.equal(true);
                });
            });
        });

        describe('action fields', () => {
            describe('datasheet file', () => {
                it('should not render datasheet file link if product has no datasheet file', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find(SpecificationButton)).to.have.length(0);
                });

                it('should render datasheet file link', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find(SpecificationButton)).to.have.length(1);
                });

                it('should render datasheet file link with correct path', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(
                        wrapper
                            .find(SpecificationButton)
                            .prop('fileName')
                    ).to.be.equal(extendedProps.product.datasheet_file);
                });
            });

            describe('add to project link', () => {
                it('should render add to project link', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('.product-replacement__add-to-project-link')).to.have.length(1);
                });

                it('should render add to project link with correct path', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(
                        wrapper
                            .find('.product-replacement__add-to-project-link')
                            .prop('to')
                    ).to.be.equal(`/retrofit/projects/${props.backUrl}`);
                });

                it('should render add to project link with correct text', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(
                        wrapper
                            .find('.product-replacement__add-to-project-link')
                            .contains(
                                <Translate content="action.label.add.project" />
                            )
                    ).to.equal(true);
                });

                it('should call add to project handler', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    wrapper.find('.product-replacement__add-to-project-link').simulate('click');
                    expect(props.handlerToBuffer.calledOnce).to.be.equal(true);
                });
            });

            describe('accessories', () => {
                it('should not render accessories link if product has no accessories', () => {
                    const wrapper = shallowRenderWaterReplacement(props);
                    expect(wrapper.find('.product-replacement__accessories-link')).to.have.length(0);
                });

                it('should render accessories link', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__accessories-link')).to.have.length(1);
                });

                it('should render accessories link with correct path', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(
                        wrapper
                            .find('.product-replacement__accessories-link')
                            .prop('to')
                    ).to.be.equal(
                        `/retrofit/accessories/water/${extendedProps.originalId}/${extendedProps.product.id}/${extendedProps.backUrl}`
                    );
                });

                it('should render accessories link with correct text', () => {
                    const wrapper = shallowRenderWaterReplacement(extendedProps);
                    expect(
                        wrapper
                            .find('.product-replacement__accessories-link')
                            .contains(
                                <Translate content="action.label.accessories" />
                            )
                    ).to.equal(true);
                });
            });
        });
    });
});
