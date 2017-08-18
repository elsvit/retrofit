import { combineReducers } from 'redux';

// Place for your reducers
import { default as Actuators } from './Actuators';
import { default as Valves } from './Valves';

export default combineReducers({
    Actuators,
    Valves
});
