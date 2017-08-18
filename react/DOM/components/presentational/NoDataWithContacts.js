import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';
import { ContactInfo } from './../presentational/Common/index';

const NoDataWithContacts = ({ contactsInfoOptions }) => (
    <div className="ui basic center aligned segment">
        <Translate content={"label.headline.no_results"} />
        <ContactInfo.SelectContactInfo {...contactsInfoOptions} />
    </div>
);

NoDataWithContacts.propTypes = {
    contactsInfoOptions: PropTypes.shape({
        countryContacts: PropTypes.array.isRequired,
        selectedCountryCode: PropTypes.string.isRequired,
        onChangeHandler: PropTypes.func.isRequired
    }).isRequired
};

export default NoDataWithContacts;
