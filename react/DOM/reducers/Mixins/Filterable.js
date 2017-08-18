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
        case MixinsEvents.Filterable.types.FILTERABLE_PARAMETERS:
            {
                _.set(
                    state,
                    innerNamespace + 'filterableParameters',
                    event.payload.parameters
                );
            }
            break;

        case MixinsEvents.Filterable.types.FILTERABLE_AMOUNT:
            {
                let amount = Math.abs(_.toSafeInteger(event.payload.amount));
                if (amount >= 0) {
                    _.set(
                        state,
                        innerNamespace + 'filterableAmount',
                        amount
                    );
                }
            }
            break;

        default:
            break;
    }

    return state;
};
