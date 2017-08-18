
import data from '../models/Data/targetMarkets';

export const DEFAULT_REGION = 'Europe';
export const DEFAULT_LANGUAGE = 'English';

export const createManager = (config, defaults = {region: DEFAULT_REGION, language: DEFAULT_LANGUAGE}) => ({
    regions: () => Object.keys(config),
    languages: region => Object.keys(config[region]),
    code: (region, language) => config[region][language].target,
    locale: (region, language) => config[region][language].uiLocale,
    DEFAULT_REGION: defaults.region,
    DEFAULT_LANGUAGE: defaults.language
});

export default createManager(data);
