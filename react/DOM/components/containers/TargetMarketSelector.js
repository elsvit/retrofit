import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Translate from 'react-translate-component';
import * as Actions from '../../actions/Settings';
import * as Selectors from '../../selectors/Settings';
import TargetMarket from '../../utils/targetMarket';

export const TargetMarketSelectorComponent = ({ selection, actions, modelsFactory, targetMarketConf }) => {
    const { region, language } = selection;
    const regionOptions = targetMarketConf.regions().map((item, idx) => <option value={item} key={idx}>{item}</option>);
    const languageOptions =
        targetMarketConf.languages(region).map((item, idx) => <option value={item} key={idx}>{item}</option>);

    const resetModels = () => {
        // Product filtering is done using language-dependent strings,
        // so the filter must be reset when the language changes.
        const model = modelsFactory['Retrofit.OriginalsModels.Parameters'];
        ['air', 'water'].forEach(m => { model.modesModel.deviceMode = m; model.reset(); });
    };

    const handleChange = (newRegion, newLanguage) => {
        const allLanguages = targetMarketConf.languages(newRegion);
        const lang = allLanguages.indexOf(newLanguage) < 0 ? allLanguages[0] : newLanguage;
        actions.setTargetMarket(newRegion, lang, resetModels);
    };

    return (
        <form className="ui form">
            <div className="field">
                <label><Translate content="label.settings.locale" /></label>
                <div className="ui padded segment">
                    <div className="two fields">
                        <div className="field">
                            <select
                                className="ui dropdown"
                                value={region}
                                onChange={ev => handleChange(ev.target.value, language)}
                            >{regionOptions}</select>
                        </div>
                        <div className="field">
                            <select
                                className="ui dropdown"
                                value={language}
                                onChange={ev => handleChange(region, ev.target.value)}
                            >{languageOptions}</select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

TargetMarketSelectorComponent.propTypes = {
    targetMarketConf: PropTypes.object.isRequired,
    selection: PropTypes.shape({
        region: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired
    }).isRequired,
    modelsFactory: PropTypes.object.isRequired,
    actions: PropTypes.shape({
        setTargetMarket: PropTypes.func.isRequired
    }).isRequired
};

export default connect(
    state => ({
        targetMarketConf: TargetMarket,
        selection: Selectors.getTargetMarket(state)
    }),
    dispatch => ({
        actions: bindActionCreators(Actions, dispatch)
    })
)(TargetMarketSelectorComponent);
