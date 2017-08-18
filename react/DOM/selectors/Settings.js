
import TargetMarket from '../utils/targetMarket';

export const getTargetMarket = state => state.Settings.targetMarket;

export const getTargetMarketCode = state => {
    const target = getTargetMarket(state);
    return TargetMarket.code(target.region, target.language);
};

export const getUiLocale = state => {
    const target = getTargetMarket(state);
    return TargetMarket.locale(target.region, target.language);
};
