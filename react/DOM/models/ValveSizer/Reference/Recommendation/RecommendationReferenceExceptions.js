const VALIDATION = 'validation';

export function NotValidVMaxForRulesetException (minValue, maxValue) {
    return {
        name: VALIDATION,
        message: 'valve-sizer.error.actuators_filter.choose_valid_vmax',
        minValue,
        maxValue
    };
}
