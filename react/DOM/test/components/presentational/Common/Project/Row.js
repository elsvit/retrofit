import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import { Link } from 'react-router';
import { Row } from './../../../../../components/presentational/Common/Project/index';

function shallowRenderRow(props) {
    return shallow(<Row {...props} />);
}

describe('Components.Common.Project.Row', () => {
    describe('<Row />', () => {
        const props = {
            project: {
                id: 'i9s2Zjs',
                name: 'test project'
            },
            isAssignMode: false,
            assignHandler: sinon.spy(),
            deleteHandler: sinon.spy(),
            editUrl: '/valve-sizer/project/edit/i9s2Zjs',
            detailsUrl: '/valve-sizer/project/details/i9s2Zjs'
        };
        const propsInAssignMode = _.defaultsDeep({ isAssignMode: true }, props);

        it('should render content with project name as link to details', () => {
            const wrapper = shallowRenderRow(props);
            expect(wrapper.containsMatchingElement(
                <Link to={props.detailsUrl}>
                    {props.project.name}
                </Link>
            )).to.be.equal(true);
        });

        it('should render project removing button', () => {
            const wrapper = shallowRenderRow(props);
            expect(wrapper.find('.project-remove-btn')).to.have.length(1);
        });

        it('should render project edit link', () => {
            const wrapper = shallowRenderRow(props);
            const link = wrapper.find('.project-edit-link');
            expect(link).to.have.length(1);
            expect(link.prop('to')).to.be.equal(props.editUrl);
        });

        it('should have confirmation dialog', () => {
            const wrapper = shallowRenderRow(props);
            expect(wrapper.find('ConfirmationDialog')).to.have.length(1);
            expect(wrapper.state('modalIsOpen')).to.equal(false);
        });

        it('should change state for confirmation dialog showing on click on remove button', () => {
            const wrapper = shallowRenderRow(props);
            wrapper.find('.project-remove-btn').simulate('click');
            expect(wrapper.state('modalIsOpen')).to.equal(true);
        });

        it('should render assign button if isAssignMode is turned on', () => {
            const wrapper = shallowRenderRow(propsInAssignMode);
            expect(wrapper.find('.project-assign-btn')).to.have.length(1);
        });

        it('should call assignHandler if isAssignMode is turned on and clicked on assign button', () => {
            const wrapper = shallowRenderRow(propsInAssignMode);
            wrapper.find('.project-assign-btn').simulate('click');
            expect(propsInAssignMode.assignHandler.calledOnce).to.be.equal(true);
        });
    });
});
