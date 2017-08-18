// libraries
import log from 'loglevel';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { hashHistory, browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import thunk from 'redux-thunk';
import * as reduxLocalStorage from 'redux-storage';
import merger from 'redux-storage-merger-simple';
import { SimpleAppStateMerger } from './utils/index';

// redux root reducer
import rootReducer from './reducers/index.dom';
// helper for creating redux Store
import { storeCreator } from './store/index';
// redux-storage
import reduxLocalStorageEngine from './redux-storage/engine.dom';
import reduxLocalStorageBlackList from './redux-storage/blacklist';
// root React component
import IndexContainer from './components/containers/index';
// models Factory for IndexContainer
import ModelsFactory from './models/Factory';
// Redux React component for developer
import DevTools from './components/containers/DevTools';
import { Application as ApplicationEvents } from './events';


// log level
if (process.env.NODE_ENV === 'development') {
    log.setLevel('trace');
} else {
    log.setLevel('error');
}

// @todo use redux-storage-decorator-migrate for local storage migration
// redux-storage wrapper around rootReducer
const AppMerger = (oldState, newState) => {
    const overwriteStateNodes = ['User'];
    if ((oldState['Version'] === newState['Version']) || overwriteStateNodes.length === 0) {
        return merger(oldState, newState);
    }
    return SimpleAppStateMerger(oldState, newState, overwriteStateNodes);
};
const reduxLocalStorageReducerWrapper = reducer => reduxLocalStorage.reducer(reducer, AppMerger);

// History API
let history = browserHistory;
if (process.env.NODE_ENV === 'development') {
    history = hashHistory;
}

// DevTools
let devtools = () => <span></span>;
if (process.env.NODE_ENV === 'development' && !window.devToolsExtension) {
    devtools = DevTools;
}

// Enchancers for Store
let enhancers = [];
if (process.env.NODE_ENV === 'development') {
    enhancers = [
        ...enhancers,
        window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument()
    ];
}

// Middlewares for Store
const middleware = [
    thunk,
    routerMiddleware(history),
    reduxLocalStorage.createMiddleware(reduxLocalStorageEngine, reduxLocalStorageBlackList)
];

// Store
const store = storeCreator(middleware, enhancers, reduxLocalStorageReducerWrapper(rootReducer), {});

// If something is inside reduxLocalStorage - loading it into Store
reduxLocalStorage.createLoader(reduxLocalStorageEngine)(store);

syncHistoryWithStore(history, store);

history.listen(() => store.dispatch(ApplicationEvents.creators.errorDelivered()));

// HMR
if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers/index.dom', () => {
        const nextRootReducer = require('./reducers/index.dom');
        store.replaceReducer(reduxLocalStorageReducerWrapper(nextRootReducer));
    });
}

// Redux
const Redux = () => (
    <Provider store={store}>
        <IndexContainer history={history} DevTools={devtools} modelsFactory={new ModelsFactory(store.dispatch)} />
    </Provider>
);

// React
render(<Redux />, document.getElementById('Redux'));
