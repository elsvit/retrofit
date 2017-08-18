import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

// Place for your reducers
import { default as Retrofit } from './Retrofit/index';
import { default as ValveSizer } from './ValveSizer/index';
import { default as AJAX } from './AJAX';
import { default as Application } from './Application';
import { default as Cache } from './Cache';
import { default as User } from './User';
import Projects from './Projects';
import ProjectProducts from './ProjectProducts';
import { default as Version } from './Version';
import Settings from './Settings';

export default combineReducers({
    routing,
    Application,
    AJAX,
    Cache,
    User,
    Retrofit,
    ValveSizer,
    Projects,
    ProjectProducts,
    form: formReducer,
    Version,
    Settings
});
