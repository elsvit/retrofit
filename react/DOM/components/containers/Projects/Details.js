// libraries
import log from 'loglevel';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// components
import { Project as ProjectPresentation } from '../../presentational/Retrofit/index';
// selectors
import { Map as MapSelector } from '../../../selectors/index';
import LogoImage from '../../presentational/Common/LogoImage';
import { projectDeleteProduct, projectChangeProductQuantity } from '../../../actions/Projects';
import { baseUrl } from '../../../utils';

const BASE_URL = baseUrl();
const MAIL_OPTIONS = {
    retrofit: {
        sendProducts: {
            subjectTemplate: 'Belimo RetroFIT Products (Project: ${projectName})'
        },
        shareProject: {
            subjectTemplate: 'Belimo RetroFIT Project ${projectName}',
            urlTemplate:
                BASE_URL + '/retrofit/project/share/${projectName}/${productIds}/${quantities}'
        }
    },
    'valve-sizer': {
        sendProducts: {
            subjectTemplate: 'Belimo ValveSizer Products (Project: ${projectName})'
        },
        shareProject: {
            subjectTemplate: 'Belimo ValveSizer Project ${projectName}',
            urlTemplate:
            BASE_URL + '/valve-sizer/project/share/${projectName}/${productIds}/${quantities}'
        }
    }
};

/**
 * Screen for detailed information about existing "Project"
 */
class Details extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                project: PropTypes.string.isRequired,
                backUrl: PropTypes.string,
                applicationName: PropTypes.string.isRequired
            }).isRequired,
            projects: PropTypes.array.isRequired,
            mailOptions: PropTypes.object.isRequired,
            deleteProduct: PropTypes.func.isRequired,
            changeProductQuantity: PropTypes.func.isRequired
        };
    }

    get backUrl() {
        const { applicationName, backUrl } = this.props.params;
        return (backUrl !== undefined && backUrl.length > 0)
            ? `/${applicationName}/projects/${encodeURIComponent(backUrl)}`
            : `/${applicationName}/projects`;
    }

    project(id, projects) {
        let project = null;
        if (id !== undefined && projects.length > 0) {
            project = projects.find((value) => (id === value.id));
        }
        return project;
    }

    render() {
        const { projects, params, mailOptions } = this.props;
        const { applicationName } = this.props.params;
        const project = this.project(params.project, projects);
        if (!project) {
            return false;
        }
        const projectItemDetachHandlerCreator =
            (projectItemId) => (SE) => this.props.deleteProduct(project.id, projectItemId);
        const projectItemQuantityHandlerCreator =
            (projectItemId) => (quantity) => this.props.changeProductQuantity(project.id, projectItemId, quantity);

        let projectItems = (project.items || []);
        log.debug('Project.Details.render(); projectItems: ', projectItems);
        // attaching products and making result safe for rendering (filter)
        projectItems = _.sortBy(
            _.filter(
                _.map(projectItems, (projectItem) => {
                    projectItem.detachHandler = projectItemDetachHandlerCreator(projectItem.id);
                    projectItem.quantityHandler = projectItemQuantityHandlerCreator(projectItem.id);
                    return projectItem;
                }),
                (projectItem) => (_.isObject(projectItem.product))
            ),
            (item) => (item.product.name)
        );

        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div className="row">
                                <div
                                    className={'eight wide computer fourteen wide tablet ' +
                                        'sixteen wide mobile column aligned center'}
                                >
                                    <Link to={this.backUrl} className="ui icon button page__back">
                                        <i className="left arrow icon"></i>
                                    </Link>
                                    <Link to={`/${applicationName}`} className="page__headerLogo subpages">
                                        <LogoImage applicationName={applicationName} />
                                    </Link>
                                    <div>
                                        &nbsp;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page__container">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div className="row">
                                <div
                                    className={'eight wide computer fourteen wide ' +
                                     'tablet sixteen wide mobile column aligned left'}
                                >
                                    <ProjectPresentation.Details
                                        projectData={project}
                                        projectItems={projectItems}
                                        mailOptions={mailOptions}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { applicationName } = ownProps.params;
    const props = MapSelector({
        projects: `Projects.${applicationName}.list`
    })(state);
    return {
        ...props,
        mailOptions: MAIL_OPTIONS[applicationName]
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { applicationName } = ownProps.params;
    return {
        deleteProduct: (id, itemId) => {
            dispatch(projectDeleteProduct({
                applicationName,
                id,
                itemId
            }));
        },
        changeProductQuantity: (id, itemId, quantity) => {
            if (quantity === 0) {
                dispatch(projectDeleteProduct({
                    applicationName,
                    id,
                    itemId
                }));
            } else {
                dispatch(projectChangeProductQuantity({
                    applicationName,
                    id,
                    itemId,
                    quantity
                }));
            }
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Details);
