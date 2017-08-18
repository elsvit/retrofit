import { expect } from 'chai';
import sinon from 'sinon';
import jsdom from 'jsdom';
import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { Link } from 'react-router';
import { Details } from './../../../../../components/presentational/Common/Project/index';
import { printFn } from '../../../../../utils/index';
import { ProjectName } from '../../../../../utils/projectSharingHelper';

function shallowRenderDetails(props) {
    return shallow(<Details {...props} />);
}

describe('Components.Common.Project.Details', () => {
    describe('<Details />', () => {
        const props = {
            projectData: {
                id: 'ckoss9U',
                name: 'test project'
            },
            projectItems: [
                {
                    id: 'a7xi29',
                    quantity: 2,
                    product: {
                        id: '4867',
                        title: 'BEP-10F1E',
                        product_image: 'product_image.jpg'
                    },
                    quantityHandler: sinon.spy(),
                    detachHandler: sinon.spy()
                },
                {
                    id: 'a7xi30',
                    quantity: 1,
                    product: {
                        id: '4735',
                        title: 'H520B',
                        product_image: 'product_image.jpg'
                    },
                    quantityHandler: sinon.spy(),
                    detachHandler: sinon.spy()
                }
            ],
            mailOptions: {
                sendProducts: {
                    subjectTemplate: 'Belimo ValveSizer Products (Project: ${projectName})'
                },
                shareProject: {
                    subjectTemplate: 'Belimo ValveSizer Project ${projectName}',
                    urlTemplate: 'http://toolbox.belimo.xiag.ch/valve-sizer/project/create/${projectName}/${productIds}/${quantities}'
                }
            }
        };

        it('should render list title', () => {
            const wrapper = shallowRenderDetails(props);
            expect(wrapper.find('.list-title').text()).to.contains(props.projectData.name);
        });

        it('should render product rows', () => {
            const wrapper = shallowRenderDetails(props);
            expect(wrapper.find('.project-rows').children('ProductRow')).to.have.length(_.size(props.projectItems));
        });

        it('should render send products link', () => {
            const wrapper = shallowRenderDetails(props);
            expect(wrapper.find('.send-products-link')).to.have.length(1);
        });

        it('should render send products link with correct href attribute', () => {
            const wrapper = shallowRenderDetails(props);
            const body = (_.map(props.projectItems, (item) => (`${item.quantity} x ${item.product.title}`)))
                .join('\n\n');
            const subject = `Belimo ValveSizer Products (Project: ${props.projectData.name})`;
            expect(decodeURIComponent(wrapper.find('.send-products-link').prop('href'))).to.be.equal(
                decodeURIComponent(`mailto:?body=${body}&subject=${subject}`)
            );
        });

        it('should render share project link', () => {
           const wrapper = shallowRenderDetails(props);
           expect(wrapper.find('.share-project-link')).to.have.length(1);
        });

        it('should render share project link with correct href attribute', () => {
           const wrapper = shallowRenderDetails(props);
           const productIds = props.projectItems.map((item) => item.product.id).join(',');
           const productQuantities = props.projectItems.map((item) => item.quantity).join(',');
           const body = `http://toolbox.belimo.xiag.ch/valve-sizer/project/create/` +
               `${ProjectName.encode(props.projectData.name)}/${productIds}/${productQuantities}`;
           const subject = `Belimo ValveSizer Project ${props.projectData.name}`;
           expect(decodeURIComponent(wrapper.find('.share-project-link').prop('href'))).to.be.equal(
               `mailto:?body=${body}&subject=${subject}`
           );
        });

        it('should render print link', () => {
            const wrapper = shallowRenderDetails(props);
            expect(wrapper.find('.project-print-link')).to.have.length(1);
        });

        it('should render print link with onClick function', () => {
            const wrapper = shallowRenderDetails(props);
            expect(wrapper.find('.project-print-link').prop('onClick')).to.be.equal(printFn);
        });
    });
});
