import { createStore, compose, applyMiddleware } from 'redux';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import _ from 'lodash';

// How to create store
const storeCreator = (middleware, enhancers, rootReducer, initialState) =>
    compose(applyMiddleware(...middleware), ...enhancers)(createStore)(rootReducer, initialState);

export { storeCreator };

// Becase deaful comparison is ****
const createSelector = createSelectorCreator(
    defaultMemoize,
    _.isEqual
);

export { createSelector };
