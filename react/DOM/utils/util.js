import translate from 'counterpart';

export const specString = (string, key) => string.match(/^@@/) ? translate(key + '.' + string) : string;
