import _ from 'lodash';
import * as Util from './util';

export default value => {
    if (_.isNull(value)) {
        return translate('retrofit_parameter.no_value');
    }
    const string = Util.specString(value, 'retrofit_parameter');
    if (string != value) {
        return string;
    }
    return value.replace("|", ", ");
}
