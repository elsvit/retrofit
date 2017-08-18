import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import { default as Translate } from 'react-translate-component';
import _ from 'lodash';

const ConfirmationDialog = ({ modalOptions, MessageNode, onConfirmHandler }) => {
    const { isOpen, onAfterOpen, onRequestClose, closeTimeoutMS, style } = modalOptions;
    const onConfirmHandlerFn = (event) => {
        onConfirmHandler();
        onRequestClose();
    };
    const defaultStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            '-webkit-transform': 'translate(-50%, -50%)',
            '-ms-transform': 'translate(-50%, -50%)',
            textAlign: 'center'
        }
    };
    const styles = !_.isEmpty(style) ? _.defaultsDeep(style, defaultStyles) : defaultStyles;
    return (
        <Modal
            closeTimeoutMS={closeTimeoutMS}
            isOpen={isOpen}
            onAfterOpen={onAfterOpen}
            onRequestClose={onRequestClose}
            style={styles}
        >
            <h3>{MessageNode}</h3>
            <div onClick={onRequestClose} className="confirmation-cancel-button ui cancel button">
                <i className="remove icon"></i>
                <Translate content={"action.label.no"} />
            </div>
            <div onClick={onConfirmHandlerFn} className="confirmation-accept-button ui grey ok button">
                <i className="checkmark icon"></i>
                <Translate content={"action.label.yes"} />
            </div>
        </Modal>
    );
};

ConfirmationDialog.propTypes = {
    modalOptions: PropTypes.shape({
        isOpen: PropTypes.bool.isRequired,
        onAfterOpen: PropTypes.func,
        onRequestClose: PropTypes.func,
        closeTimeoutMS: PropTypes.number,
        style: PropTypes.object
    }).isRequired,
    MessageNode: PropTypes.node.isRequired,
    onConfirmHandler: PropTypes.func.isRequired
};

export default ConfirmationDialog;
