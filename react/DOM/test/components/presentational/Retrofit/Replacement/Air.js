import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { default as Translate } from 'react-translate-component';
import { Air } from './../../../../../components/presentational/Retrofit/Replacement/index';
import { SpecificationButton } from './../../../../../components/presentational/Common';

function shallowRenderAirReplacement(props) {
    return shallow(<Air {...props} />);
}

describe('Components.Retrofit.Replacement', () => {
    describe('<Air />', () => {
        const props = {
            originalId: 'xkzi8Ja',
            product: {
                id: '5154',
                title: 'MXG461.40-20MV',
                safety_function: '@@no',
                integrated_switch: '@@no',
                product_image: 'product_image.jpg',
                nominal_voltage: 'AC/DC 24 V',
                torque: '20 Nm',
                running_time: '90 s',
                control_type: 'Open-close, 3-point'
            },
            accessoriesAmount: 0,
            handlerToBuffer: sinon.spy(),
            backUrl: encodeURIComponent('/retrofit/replacements/air/298073')
        };
        const extendedProps = _.defaultsDeep(
            {
                product: {
                    datasheet_file: 'air_datasheet_file.xls'
                },
                accessoriesAmount: 10,
                notes: ['first replacement note', 'second replacement note']
            },
            props
        );

        describe('description', () => {
            describe('image', () => {
                it('should render product image', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('Image')).to.have.length(1);
                });

                it('should render product image with correct src', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('Image').prop('fileName')).to.be.equal(props.product.product_image);
                });

                it('should render product image with correct alt', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('Image').prop('alt')).to.be.equal(props.product.title);
                });
            });

            it('should render company name', () => {
                const wrapper = shallowRenderAirReplacement(props);
                expect(wrapper.find('.product-replacement__company').text()).to.be.equal('Belimo');
            });

            it('should render product title', () => {
                const wrapper = shallowRenderAirReplacement(props);
                expect(wrapper.find('.product-replacement__title').text()).to.be.equal(`${props.product.title}`);
            });

            describe('nominal_voltage', () => {
                it('should render product nominal_voltage property label', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.contains(
                        <Translate content="label.property.nominal_voltage"/>
                    )).to.equal(true);
                });

                it('should render product nominal_voltage property value', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.contains(`${props.product.nominal_voltage}`)).to.be.equal(true);
                });
            });

            describe('torque', () => {
                it('should render product torque property label', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.contains(
                        <Translate content="label.property.torque"/>
                    )).to.equal(true);
                });

                it('should render product torque property value if torque property value is null', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.contains(`${props.product.torque}`)).to.be.equal(true);
                });
            });

            describe('safety_function', () => {
                it('should render product safety function property', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('.product-replacement__safety_function')).to.have.length(1);
                });

                it('should render product safety function property label', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('.product-replacement__safety_function').contains(
                        <Translate content="label.property.safety_function"/>
                    )).to.equal(true);
                });
            });

            describe('running_time', () => {
                it('should render product running_time property label', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.contains(
                        <Translate content="label.property.running_time"/>
                    )).to.equal(true);
                });

                it('should render product running_time property value', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.contains(`${props.product.running_time}`)).to.be.equal(true);
                });
            });

            describe('control_type', () => {
                it('should render product control_type property label', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.contains(
                        <Translate content="label.property.control_type"/>
                    )).to.equal(true);
                });

                it('should render product control_type property value', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.contains(`${props.product.control_type}`)).to.be.equal(true);
                });
            });

            describe('note', () => {
                it('should not render note if note is null', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('.product-replacement__note')).to.have.length(0);
                });

                it('should render note', () => {
                    const wrapper = shallowRenderAirReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__note').contains(
                        `${extendedProps.notes[0]}`
                    )).to.be.equal(true);
                    expect(wrapper.find('.product-replacement__note').contains(
                        `${extendedProps.notes[1]}`
                    )).to.be.equal(true);
                });
            });

            describe('integrated_switch', () => {
                it('should render product integrated switch property', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('.product-replacement__integrated_switch')).to.have.length(1);
                });

                it('should render product integrated switch property label', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('.product-replacement__integrated_switch').contains(
                        <Translate content="label.property.integrated_switch"/>
                    )).to.equal(true);
                });
            });
        });

        describe('action fields', () => {
            describe('compare', () => {
                it('should render compare link', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('.product-replacement__compare-link')).to.have.length(1);
                });

                it('should render compare link with correct path', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(
                        wrapper
                            .find('.product-replacement__compare-link')
                            .prop('to')
                    ).to.be.equal(`/retrofit/comparison/air/${props.originalId}/${props.product.id}/${props.backUrl}`);
                });

                it('should render compare link with correct text', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(
                        wrapper
                            .find('.product-replacement__compare-link')
                            .contains(
                                <Translate content="action.label.compare" />
                            )
                    ).to.equal(true);
                });
            });

            describe('datasheet file', () => {
                it('should not render datasheet file link if product has no datasheet file', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find(SpecificationButton)).to.have.length(0);
                });

                it('should render datasheet file link', () => {
                    const wrapper = shallowRenderAirReplacement(extendedProps);
                    expect(wrapper.find(SpecificationButton)).to.have.length(1);
                });

                it('should render datasheet file link with correct path', () => {
                    const wrapper = shallowRenderAirReplacement(extendedProps);
                    expect(
                        wrapper
                            .find(SpecificationButton)
                            .prop('fileName')
                    ).to.be.equal(extendedProps.product.datasheet_file);
                });
            });

            describe('add to project link', () => {
                it('should render add to project link', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('.product-replacement__add-to-project-link')).to.have.length(1);
                });

                it('should render add to project link with correct path', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(
                        wrapper
                            .find('.product-replacement__add-to-project-link')
                            .prop('to')
                    ).to.be.equal(`/retrofit/projects/${props.backUrl}`);
                });

                it('should render add to project link with correct text', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(
                        wrapper
                            .find('.product-replacement__add-to-project-link')
                            .contains(
                                <Translate content="action.label.add.project" />
                            )
                    ).to.equal(true);
                });

                it('should call add to project handler', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    wrapper.find('.product-replacement__add-to-project-link').simulate('click');
                    expect(props.handlerToBuffer.calledOnce).to.be.equal(true);
                });
            });

            describe('accessories', () => {
                it('should not render accessories link if product has no accessories', () => {
                    const wrapper = shallowRenderAirReplacement(props);
                    expect(wrapper.find('.product-replacement__accessories-link')).to.have.length(0);
                });

                it('should render accessories link', () => {
                    const wrapper = shallowRenderAirReplacement(extendedProps);
                    expect(wrapper.find('.product-replacement__accessories-link')).to.have.length(1);
                });

                it('should render accessories link with correct path', () => {
                    const wrapper = shallowRenderAirReplacement(extendedProps);
                    expect(
                        wrapper
                            .find('.product-replacement__accessories-link')
                            .prop('to')
                    ).to.be.equal(
                        `/retrofit/accessories/air/${extendedProps.originalId}/${extendedProps.product.id}/${extendedProps.backUrl}`
                    );
                });

                it('should render accessories link with correct text', () => {
                    const wrapper = shallowRenderAirReplacement(extendedProps);
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
