import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { default as Translate } from 'react-translate-component';
import { ConfirmationDialog } from '../Modal/index';

class Row extends Component {
    static get propTypes() {
        return {
            project: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            }).isRequired,
            isAssignMode: PropTypes.bool,
            assignHandler: PropTypes.func.isRequired,
            deleteHandler: PropTypes.func.isRequired,
            editUrl: PropTypes.string.isRequired,
            detailsUrl: PropTypes.string.isRequired
        };
    }

    static get getDefaultProps() {
        return {
            isAssignMode: false
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        };
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    openDialog() {
        this.setState({ modalIsOpen: true });
    }

    closeDialog() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        const { project, isAssignMode, assignHandler, deleteHandler, editUrl, detailsUrl } = this.props;
        return (
            <div className="item project__item">
                {!isAssignMode &&
                    <div className="left floated content">
                        <span>
                            <Link to={detailsUrl} className="ui button left fluid">
                                {project.name}
                            </Link>
                        </span>
                    </div>
                }

                {isAssignMode &&
                    <span className="project__name">
                        {project.name}
                    </span>
                }

                <div className="right floated content">
                    {isAssignMode &&
                        <div className="project-assign-btn ui button" onClick={assignHandler}>
                            <Translate content={"action.label.select"} />
                        </div>
                    }
                    {!isAssignMode &&
                        <div>
                            <Link to={editUrl} className="project-edit-link ui icon button">
                                <i className="write icon"></i>
                            </Link>
                            <div onClick={this.openDialog} className="project-remove-btn ui icon button">
                                <i className="remove icon"></i>
                            </div>
                        </div>
                    }
                </div>
                <ConfirmationDialog
                    modalOptions={{
                        isOpen: this.state.modalIsOpen,
                        onRequestClose: this.closeDialog
                    }}
                    MessageNode={
                        <Translate
                            content={"label.projects.delete_confirmation"}
                            projectName={project.name}
                        />
                    }
                    onConfirmHandler={deleteHandler}
                />
            </div>
        );
    }
}

export default Row;
