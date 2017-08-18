import { expect, assert } from 'chai';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import Counterpart from 'counterpart';
import { User as UserActions, Cache as CacheActions } from '../../events/index';
import Cache from '../../actions/Cache';
import * as actions from '../../actions/Settings';
import rootReducer from '../../reducers/index.dom';
import { storeCreator } from '../../store/index';
import * as Selectors from '../../selectors/Settings';
import TargetMarket from '../../utils/targetMarket';

describe('Actions.Settings', () => {

    it('should create action to store target market', () => {
        const region = 'region';
        const language = 'language';
        expect(actions.storeTargetMarket(region, language)).to.deep.equal({
            type: actions.SETTINGS_STORE_TARGET_MARKET,
            payload: {region, language}
        });
    });

    describe('target market switching thunk', () => {
        let initialRegion, initialLanguage;
        const store = storeCreator([thunk], [], rootReducer, {});
        const callback = sinon.spy();
        const newRegion = 'Europe';
        const newLang = 'Deutsch';

        before(() => {
            const target = Selectors.getTargetMarket(store.getState());
            initialRegion = target.region;
            initialLanguage = target.language;
            const locale = TargetMarket.locale(initialRegion, initialLanguage);
            Counterpart.setLocale(locale);
            store.dispatch(CacheActions.creators.set({somekey: 'somevalue'}));
            store.dispatch(UserActions.creators.locale(locale));

            store.dispatch(actions.setTargetMarket(newRegion, newLang, callback));
        });

        it('test has correct preconditions', () => {
            assert.equal(initialRegion, 'Europe', 'precondition: region');
            assert.equal(initialLanguage, 'English', 'precondition: language');
        });

        it('does everything needed to switch language', () => {
            const newLocale = TargetMarket.locale(newRegion, newLang);
            assert.equal(store.getState().User.locale, newLocale, 'locale was set correctly in User model');
            assert.equal(Counterpart.getLocale(), newLocale, 'locale was set correctly in Counterpart');

            const newMarket = Selectors.getTargetMarket(store.getState());
            assert.equal(newMarket.language, newLang, 'language was set correctly');

            assert.isFalse(store.dispatch(Cache.has('somekey')), 'cache was purged');

            assert.isTrue(callback.calledOnce, 'reset callback was called');
        });
    });
});
