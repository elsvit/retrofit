import { combineReducers } from 'redux';

// Place for your reducers
import { default as Combinations } from './Combinations/index';
import { default as Properties } from './Properties';
import { default as FlowPressure } from './FlowPressure';
import { default as FlowCalculation } from './FlowCalculation';
import { default as Settings } from './Settings';
import { default as Series } from './Series';
import { default as Products } from './Products/index';
import { default as Projects } from './Projects';


export default combineReducers({
    Combinations,
    Properties,
    FlowPressure,
    FlowCalculation,
    Settings,
    Series,
    Products,
    Projects
});
