import _ from 'lodash';

/**
 Check number is numertic.
 @param {number} number
 @return {boolean}
 */
function isNumeric(number) {
    return _.isFinite(_.toNumber(number));
}

export default isNumeric;
