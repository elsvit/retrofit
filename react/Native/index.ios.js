import React, { Component, AppRegistry } from 'react-native'
import { Provider } from 'react-redux/native'

import storeCreator from './store'
import rootReducer from './reducers/index.native'

import thunk from 'redux-thunk'

import IndexContainer from './components/containers'

let store = storeCreator([thunk], [], rootReducer, {});

class Redux extends Component {
    render() {
        return (
            <Provider store={store}>
                {() => <IndexContainer />}
            </Provider>
        )
    }
}

AppRegistry.registerComponent(
    'Retrofit',
    () => Redux
);