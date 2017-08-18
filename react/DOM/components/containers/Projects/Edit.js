// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import shortid from 'shortid';
// selectors
import { Map as MapSelector } from '../../../selectors/index';
import { projectCreate, projectEdit } from '../../../actions/Projects';
import LogoImage from '../../presentational/Common/LogoImage';

/**
 * Screen for creating new "Project"
 */
class Edit extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                project: PropTypes.string,
                backUrl: PropTypes.string,
                applicationName: PropTypes.string.isRequired
            }).isRequired,
            projects: PropTypes.array.isRequired,
            modelsFactory: PropTypes.object.isRequired,
            createProject: PropTypes.func.isRequired,
            editProject: PropTypes.func.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.routingModel = this.props.modelsFactory.Routing;
        this.createHandler = this.createHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
    }

    componentDidMount() {
        this.initInputValue(this.project);
    }

    componentDidUpdate() {
        this.initInputValue(this.project);
    }

    initInputValue(entityData) {
        if (this._input && entityData) {
            this._input.value = entityData.name;
            this._input.focus();
        }
    }

    createHandler(SE) {
        SE.preventDefault();
        // @todo validate project name
        const name = this._input.value;
        this.props.createProject(name);
        this.routingModel.pushPath(this.backUrl); // @todo create routing helper for it
    }

    editHandler(SE) {
        SE.preventDefault();
        // @todo validate project name
        const name = this._input.value;
        let project = this.project;
        project.name = name;
        this.props.editProject(project);
        this.routingModel.pushPath(this.backUrl); // @todo create routing helper for it
    }

    get backUrl() {
        const { applicationName, backUrl } = this.props.params;
        return (backUrl !== undefined && backUrl.length > 0)
            ? `/${applicationName}/projects/${encodeURIComponent(backUrl)}`
            : `/${applicationName}/projects`;
    }

    get project() {
        const { params, projects } = this.props;
        let project = null;
        if (params.project !== undefined && projects.length > 0) {
            project = projects.find((value) => (params.project === value.id));
        }
        return project;
    }

    render() {
        const { applicationName } = this.props.params;
        const project = this.project;
        const isEdit = (project !== null);

        let confirmButtonLabel = 'action.label.create';
        let headlineLabel = 'label.headline.project.create';
        if (isEdit) {
            confirmButtonLabel = 'action.label.save';
            headlineLabel = 'label.headline.project.edit';
        }

        const saveHandler = isEdit ? this.editHandler : this.createHandler;

        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div
                                className={'eight wide computer nine wide tablet ' +
                                 'sixteen wide mobile column aligned center'}
                            >
                                <Link to={this.backUrl} className="ui icon button page__back">
                                    <i className="left arrow icon"></i>
                                </Link>
                                <Link to={`/${applicationName}`} className="page__headerLogo subpages">
                                    <LogoImage applicationName={applicationName} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui container">
                    <div className="ui centered vertically padded grid">
                        <div className="row">
                            <div
                                className={'eight wide computer nine wide tablet ' +
                                 'sixteen wide mobile column aligned center'}
                            >
                                <Translate content={headlineLabel} />
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className={'eight wide computer nine wide tablet ' +
                                 'sixteen wide mobile column aligned center'}
                            >
                                <form className="ui form" onSubmit={saveHandler}>
                                    <div className="field">
                                        <label>
                                            <Translate content="label.form.project.name" />
                                        </label>
                                        <input type="text" ref={(c) => { this._input = c; }} />
                                    </div>
                                    <Link to={this.backUrl} className="ui button">
                                        <Translate content="action.label.cancel" />
                                    </Link>
                                    <button className="ui primary button" type="submit">
                                        <Translate content={confirmButtonLabel} />
                                    </button>
                                </form>
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
    return MapSelector({
        projects: `Projects.${applicationName}.list`
    })(state);
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { applicationName } = ownProps.params;
    return {
        createProject: (name) => {
            const project = {
                id: shortid.generate(),
                name
            };
            dispatch(projectCreate({
                applicationName,
                project
            }));
        },
        editProject: (project) => {
            dispatch(projectEdit({
                applicationName,
                project
            }));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Edit);
