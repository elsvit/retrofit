import _ from 'lodash';
import { TRANSITION, UPDATE_LOCATION } from 'react-router-redux';
import { AJAX, Application, Cache } from '../events/index';

export default _.concat(
    [TRANSITION, UPDATE_LOCATION],
    _.values(AJAX.types),
    _.values(Application.types),
    _.values(Cache.types)
);
