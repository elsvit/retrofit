import { createAction } from 'redux-actions';
import Counterpart from 'counterpart';
import TargetMarket from '../utils/targetMarket';
import { User as UserActions, Cache as CacheActions } from '../events/index';

export const SETTINGS_STORE_TARGET_MARKET = 'SETTINGS_STORE_TARGET_MARKET';
export const storeTargetMarket =
    createAction(SETTINGS_STORE_TARGET_MARKET, (region, language) => ({ region, language }));

export const setTargetMarket = (region, language, callback) => dispatch => {
    const locale = TargetMarket.locale(region, language);
    Counterpart.setLocale(locale);
    dispatch(storeTargetMarket(region, language));
    dispatch(UserActions.creators.locale(locale));

    // Perform any additional actions
    callback();
    // Force reloading of all data from server
    dispatch(CacheActions.creators.purge());
};
