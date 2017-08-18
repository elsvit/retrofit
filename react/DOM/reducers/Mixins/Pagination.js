// libraries
import _ from 'lodash';
// events
import { Mixins as MixinsEvents } from '../../events/index';

export default (namespace) => (state = {}, event = {}) => {
    // check if listening is for this part of state
    if (!_.has(event, 'payload.path') || !_.startsWith(event.payload.path, namespace)) {
        return state;
    }

    state = _.cloneDeep(state);

    let innerNamespace = _.replace(event.payload.path, new RegExp('^' + namespace), '');
    if (_.size(innerNamespace) > 0) {
        innerNamespace = _.replace(innerNamespace, new RegExp('^.'), '');
        innerNamespace += '.';
    }

    switch (event.type) {
        case MixinsEvents.Pagination.types.PAGINATION_PAGE:
            {
                let page = Math.abs(_.toSafeInteger(event.payload.page));
                if (page > 0) {
                    _.set(
                        state,
                        innerNamespace + 'paginationPage',
                        page
                    );
                }
            }
            break;

        case MixinsEvents.Pagination.types.PAGINATION_PER_PAGE:
            {
                let perPage = Math.abs(_.toSafeInteger(event.payload.perPage));
                if (perPage > 0) {
                    _.set(
                        state,
                        innerNamespace + 'paginationPerPage',
                        perPage
                    );
                }
            }
            break;

        default:
            break;
    }

    return state;
};
