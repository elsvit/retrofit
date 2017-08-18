import { combineReducers } from 'redux';

// Place for your reducers
import { default as Original } from './Original';
import { default as Product } from './Product';

export default combineReducers({
    Original,
    Product
});
