import React, { PropTypes } from 'react';

const LogoImage = props => {
    const logoImage = props.applicationName === 'retrofit' ? 'retro_logo.png?v0.1' : 'valvesizer_logo.png';
    return (<img
        src={`/images/${logoImage}`}
        width="285"
        className="page__headerLogoImg"
        role="presentation"
    />);
};

LogoImage.propTypes = {
    applicationName: PropTypes.string.isRequired
};
export default LogoImage;

