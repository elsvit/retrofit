import { combineReducers } from 'redux';

// Place for your reducers
import { default as Combo } from './Combo';
import { default as Actuators } from './Actuators';
import { default as Recommendation } from './Recommendation';
import { default as Result } from './Result';

export default combineReducers({
    Combo,
    Actuators,
    Recommendation,
    Result
});
