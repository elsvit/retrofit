import { combineReducers } from 'redux';
import { routerReducer } from 'react-native-redux-router';

// Place for your reducers
import { default as Retrofit } from './Retrofit/index';
import { default as ValveSizer } from './ValveSizer/index';
import { default as AJAX } from './AJAX';
import { default as Application } from './Application';
import { default as Cache } from './Cache';
import { default as User } from './User';
import Settings from './Settings';

export default combineReducers({
    routerReducer,
    Application,
    AJAX,
    Cache,
    User,
    Retrofit,
    ValveSizer,
    Settings
});
