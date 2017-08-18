import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';

const Error = (props) => {
    const { header, body, exception, onDeliver } = props;
    const message = exception ?
        <Translate content={exception.message} with={exception} />
        : '';
    const isValidationError = !!exception && exception.name === 'validation';
    const classNames = 'ui message transition ' + (isValidationError ? 'warning' : 'negative');
    const bodyAndHeader = isValidationError ? '' :
        <div>
            <div className="header">
                {header}
            </div>
            {body}<br />
        </div>
    ;

    return (
        <div className={classNames}>
            <i className="close icon" onClick={onDeliver}></i>
            {bodyAndHeader}
            {message}
        </div>
    );
};

Error.propTypes = {
    header: PropTypes.string,
    body: PropTypes.string.isRequired,
    exception: PropTypes.object,
    onDeliver: PropTypes.func.isRequired
};

export default Error;
