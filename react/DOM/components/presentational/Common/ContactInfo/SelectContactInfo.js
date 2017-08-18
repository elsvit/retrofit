import React, { PropTypes } from 'react';
import { default as Translate } from 'react-translate-component';
import _ from 'lodash';

const SelectContactInfo = ({ countryContacts, selectedCountryCode, onChangeHandler }) => {
    const onChangeHandlerWrapper = (event) => {
        onChangeHandler(event.target.value);
    };
    const options = _.map(countryContacts, (contact) => (
        <option key={contact.code} value={contact.code}>{contact.country}</option>
    ));
    const selectedContact = (
        _.find(countryContacts, (contact) => (contact.code === selectedCountryCode))
        ||
        _.head(countryContacts)
    );
    return (
        <div>
            <div className="ui form">
                <div className="inline field">
                    <br />
                    <select onChange={onChangeHandlerWrapper} value={selectedCountryCode}>
                        {options}
                    </select>
                </div>
            </div>
            {selectedContact &&
                <div className="country-contact-info">
                    <br />
                    <label>
                        <b><Translate content={"label.headline.settings.phone"} />&nbsp;</b>
                    </label>
                    <br />

                    <span className="phone">{selectedContact.phone}</span>
                    <br /><br />
                    <label>
                        <b><Translate content={"label.headline.settings.email"} />&nbsp;</b>
                    </label>
                    <br />
                    <span className="email">
                        <a href={'mailto:' + selectedContact.email}>{selectedContact.email}</a>
                    </span>

                    {selectedContact.web &&
                        <span>
                            <br /><br />
                            <label>
                                <b>Web&nbsp;</b>
                            </label>
                            <br />
                            < a href={'http://' + selectedContact.web} title="Web" target="_blank">
                                {selectedContact.web}
                            </a>
                        </span>
                     }

                    {selectedContact.address &&
                        <span>
                            <br /><br />
                            <label>
                                <b><Translate content={"label.headline.settings.address"} />&nbsp;</b>
                            </label>
                            <br />
                            <span className="address" dangerouslySetInnerHTML={{ __html: selectedContact.address }} />
                        </span>
                     }
                </div>
            }
        </div>
    );
};

SelectContactInfo.propTypes = {
    countryContacts: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        address: PropTypes.string
    })).isRequired,
    selectedCountryCode: PropTypes.string.isRequired,
    onChangeHandler: PropTypes.func.isRequired
};

export default SelectContactInfo;
