// libraries
import { default as log } from 'loglevel';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { default as Translate } from 'react-translate-component';
import _ from 'lodash';
import {
    projectDelete, projectAddProducts, projectChangeProductQuantity, projectClearProductsBuffer
} from '../../../actions/Projects';
// components
import { Project as ProjectPresentation } from '../../presentational/Retrofit/index';
// selectors
import ProjectSelectors from '../../../selectors/Projects';
import LogoImage from '../../presentational/Common/LogoImage';

/**
 * Screen for detailed information about existing "Project"
 */
class List extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                backUrl: PropTypes.string,
                applicationName: PropTypes.string.isRequired
            }),
            projects: PropTypes.array.isRequired,
            productsBuffer: PropTypes.array.isRequired,
            modelsFactory: PropTypes.object.isRequired,
            deleteProject: PropTypes.func.isRequired,
            addProducts: PropTypes.func.isRequired,
            changeProductQuantity: PropTypes.func.isRequired,
            clearProductsBuffer: PropTypes.func.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.routingModel = this.props.modelsFactory.Routing;
    }

    getDetailsUrl(id) {
        const { applicationName, backUrl } = this.props.params;
        return (backUrl !== undefined && backUrl.length > 0)
            ? `/${applicationName}/project/details/${id}/${encodeURIComponent(backUrl)}`
            : `/${applicationName}/project/details/${id}`;
    }

    getEditUrl(id) {
        const { applicationName, backUrl } = this.props.params;
        return (backUrl !== undefined && backUrl.length > 0)
            ? `/${applicationName}/project/edit/${id}/${encodeURIComponent(backUrl)}`
            : `/${applicationName}/project/edit/${id}`;
    }

    get backUrl() {
        const { applicationName, backUrl } = this.props.params;
        return (backUrl !== undefined && backUrl.length > 0) ? backUrl : `/${applicationName}`;
    }

    get newProjectUrl() {
        const { applicationName, backUrl } = this.props.params;
        return (backUrl !== undefined && backUrl.length > 0)
            ? `/${applicationName}/project/new/${encodeURIComponent(backUrl)}`
            : `/${applicationName}/project/new`;
    }

    render() {
        const { productsBuffer, projects } = this.props;
        const { applicationName } = this.props.params;
        let rows = [];

        log.debug('Project.List.render(); buffer: ', productsBuffer, ' projects: ', projects);
        const isAssignMode = !_.isEmpty(productsBuffer);
        const assignHandlerCreator = ({ id }) => SE => {
            this.props.addProducts(id, productsBuffer);
            this.routingModel.pushPath(this.getDetailsUrl(id));
        };
        const deleteHandlerCreator = ({ id }) => SE => this.props.deleteProject(id);

        const clearBufferAndBack = () => {
            this.props.clearProductsBuffer();
            this.routingModel.pushPath(this.backUrl);
        };

        const clearBufferAndHome = () => {
            this.props.clearProductsBuffer();
            this.routingModel.pushPath(`/${applicationName}`);
        };

        projects.forEach((project, index) => {
            rows.push(
                <ProjectPresentation.Row
                    key={index}
                    project={project}
                    isAssignMode={isAssignMode}
                    assignHandler={assignHandlerCreator(project)}
                    deleteHandler={deleteHandlerCreator(project)}
                    editUrl={this.getEditUrl(project.id)}
                    detailsUrl={this.getDetailsUrl(project.id)}
                />
            );
        });

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
                                    <div className="ui icon button page__back" onClick={clearBufferAndBack}>
                                        <i className="left arrow icon"></i>
                                    </div>

                                    <div className="page__headerLogo subpages" onClick={clearBufferAndHome}>
                                        <LogoImage applicationName={applicationName} />
                                    </div>

                                    <div className="page__notab"></div>
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
                                    className={'eight wide computer fourteen wide tablet ' +
                                     'sixteen wide mobile column aligned center'}
                                >
                                    <Translate content="label.headline.projects" />
                                </div>
                            </div>
                            <div className="row">
                                <div
                                    className={'eight wide computer fourteen wide tablet ' +
                                     'sixteen wide mobile column aligned left'}
                                >
                                    <div className="list-container">
                                        <div className="ui middle aligned divided list project">
                                            {rows.length > 0 ?
                                                rows : <Translate content="label.projects.no_projects" />
                                            }
                                        </div>
                                    </div>
                                    <br />

                                    <Link to={this.newProjectUrl} className="ui labeled primary icon button">
                                        <i className="left plus icon"></i>
                                        <Translate content="action.label.project.create" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ProjectSelectors(ownProps.params.applicationName)(state);

const mapDispatchToProps = (dispatch, ownProps) => {
    const { applicationName } = ownProps.params;
    return {
        deleteProject: (id) =>
            dispatch(projectDelete({
                applicationName,
                id
            })),
        addProducts: (id, items) => {
            dispatch(projectAddProducts({
                applicationName,
                id,
                items
            }));
            dispatch(projectClearProductsBuffer({
                applicationName
            }));
        },
        changeProductQuantity: (id, productId, quantity) =>
            dispatch(projectChangeProductQuantity({
                applicationName,
                id,
                productId,
                quantity
            })),
        clearProductsBuffer: () =>
            dispatch(projectClearProductsBuffer({
                applicationName
            }))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List);
