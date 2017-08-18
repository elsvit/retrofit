import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import DNSelectionSlider
    from '../../../../../../components/presentational/ValveSizer/Products/Recommendation/DNSelectionSlider';
import DNSelectionItem
    from '../../../../../../components/presentational/ValveSizer/Products/Recommendation/DNSelectionItem';
import Translate from 'react-translate-component';

function shallowRenderDNSelectionSlider(props) {
    return shallow(<DNSelectionSlider {...props} />);
}

describe('Components.ValveSizer.Products.Recommendation.DNSelectionSlider', () => {
    describe('<DNSelectionSlider />', () => {

        const kvsLabelTests = [
            {
                props: {
                    matchingItems: [],
                    activeMatchingItem: {},
                    error: null,
                    flowUnit: 'l/s',
                    pressureDefinition: '',
                    onChangeActiveMatchingHandler: sinon.spy()
                },
                label: 'kvs [l/s]:'
            },
            {
                props: {
                    matchingItems: [],
                    activeMatchingItem: {},
                    error: null,
                    flowUnit: 'l/min',
                    pressureDefinition: 'pressure_independent',
                    onChangeActiveMatchingHandler: sinon.spy()
                },
                label: 'Vnom [l/min]:'
            },
            {
                props: {
                    matchingItems: [],
                    activeMatchingItem: {},
                    error: null,
                    flowUnit: 'l/s',
                    pressureDefinition: 'pressure_dependent',
                    onChangeActiveMatchingHandler: sinon.spy()
                },
                label: 'kvs [l/s]:'
            },
            {
                props: {
                    matchingItems: [],
                    activeMatchingItem: {},
                    error: null,
                    flowUnit: '',
                    pressureDefinition: 'pressure_dependent',
                    onChangeActiveMatchingHandler: sinon.spy()
                },
                label: 'kvs []:'
            }
        ];

        it('should render not found message if dn selection list is empty', () => {
            const props = {
                matchingItems: [],
                activeMatchingItem: {},
                error: null,
                flowUnit: '',
                pressureDefinition: '',
                onChangeActiveMatchingHandler: sinon.spy()
            };
            const wrapper = shallowRenderDNSelectionSlider(props);
            expect(wrapper.find('.dn-selection-list').contains(
                <Translate content={"valve-sizer.error.actuators_filter.dn_selections_not_found"} />
            )).to.equal(true);
        });

        it('should render error message if there is an error', () => {
            const props = {
                matchingItems: [],
                activeMatchingItem: {},
                error: {
                    name: 'validation',
                    message: 'choose_valid_vmax',
                    minValue: 1,
                    maxValue: 10
                },
                flowUnit: '',
                pressureDefinition: '',
                onChangeActiveMatchingHandler: sinon.spy()
            };
            const wrapper = shallowRenderDNSelectionSlider(props);
            expect(wrapper.find('.dn-selection-list').contains(
                <Translate {...props.error} content={'valve-sizer.error.actuators_filter.' + props.error.message} />
            )).to.equal(true);
        });

        it('should render slider if dn selection list is not empty', () => {
            const props = {
                matchingItems: [
                    {
                        recommendedStatus: '',
                        dn: '15',
                        kvs: 10
                    },
                    {
                        recommendedStatus: '',
                        dn: '20',
                        kvs: 15
                    }
                ],
                activeMatchingItem: {},
                error: null,
                flowUnit: '',
                pressureDefinition: '',
                onChangeActiveMatchingHandler: sinon.spy()
            };
            const wrapper = shallowRenderDNSelectionSlider(props);
            expect(wrapper.find(DNSelectionItem)).to.have.length(2);
        });
    });
});
