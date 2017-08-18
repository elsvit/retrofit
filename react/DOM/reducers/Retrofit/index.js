import { combineReducers } from 'redux';

// Reducers for reuse
export { default as AbstractParameters } from './AbstractParameters';

// Reducers for combining
import { default as Accessories } from './Accessories';
import { default as Comparison } from './Comparison/index';
import { default as Modes } from './Modes';
import { default as Originals } from './Originals';
import { default as Products } from './Products';
import { default as Projects } from './Projects';
import { default as Text } from './Text';

export default combineReducers({
    Accessories,
    Comparison,
    Modes,
    Originals,
    Products,
    Projects,
    Text
});
