import React from 'react';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { createManager } from '../../../utils/targetMarket';
import { TargetMarketSelectorComponent } from '../../../components/containers/TargetMarketSelector';

const markets = {
    "Europe": {
        "English": {"target": "default", "uiLocale": "en_US"},
        "Deutsch": {"target": "de-ch", "uiLocale": "de_CH"}
    },
    'Canada': {
        "English": {"target": "ca-en", "uiLocale": "en_CA"},
        "Francais": {"target": "ca-fr", "uiLocale": "ca_FR"}
    }
};

const setup = (region, language) => {
    const actions = {
        setTargetMarket: sinon.spy()
    };
    const wrapper = shallow(<TargetMarketSelectorComponent
        targetMarketConf={createManager(markets)}
        selection={{region, language}}
        actions={actions}
        modelsFactory={{}}
    />);
    const onRegionChange = region => wrapper.find('select').at(0).prop('onChange')({target: {value: region}});
    return [wrapper, actions, onRegionChange];
};

describe('', () => {

    it('offers correct list of regions and languages', () => {
        const [wrapper] = setup('Canada', 'English');
        const regions = [];
        wrapper.find('select').at(0).find('option').forEach(o => regions.push(o.prop('value')));
        assert.sameMembers(regions, Object.keys(markets));
        const langs = [];
        wrapper.find('select').at(1).find('option').forEach(o => langs.push(o.prop('value')));
        assert.sameMembers(langs, Object.keys(markets['Canada']));
    });

    it('handels region change when new region has currently selected language', () => {
        const [, actions, onRegionChange] = setup('Europe', 'English');
        onRegionChange('Canada');
        const args = actions.setTargetMarket.getCall(0).args;
        assert.equal(args[0], 'Canada', 'region is correct');
        assert.equal(args[1], 'English', 'language is correct');
    });

    it('handels region change when new region does not have currently selected language', () => {
        const [, actions, onRegionChange] = setup('Europe', 'Deutsch');
        onRegionChange('Canada');
        const args = actions.setTargetMarket.getCall(0).args;
        assert.equal(args[0], 'Canada', 'region is correct');
        assert.include(Object.keys(markets['Canada']), args[1], 'language is correct');
    });
});
