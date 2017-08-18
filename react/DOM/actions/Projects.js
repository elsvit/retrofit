import { createAction } from 'redux-actions';

export const PROJECT_CREATE = 'PROJECT_CREATE';
export const PROJECT_EDIT = 'PROJECT_EDIT';
export const PROJECT_DELETE = 'PROJECT_DELETE';
export const PROJECT_ADD_PRODUCTS_TO_BUFFER = 'PROJECT_ADD_PRODUCTS_TO_BUFFER';
export const PROJECT_CLEAR_PRODUCTS_BUFFER = 'PROJECT_CLEAR_PRODUCTS_BUFFER';
export const PROJECT_ADD_PRODUCTS = 'PROJECT_ADD_PRODUCTS';
export const PROJECT_DELETE_PRODUCT = 'PROJECT_DELETE_PRODUCT';
export const PROJECT_CHANGE_PRODUCT_QUANTITY = 'PROJECT_CHANGE_PRODUCT_QUANTITY';

export const projectCreate = createAction(PROJECT_CREATE);
export const projectEdit = createAction(PROJECT_EDIT);
export const projectDelete = createAction(PROJECT_DELETE);
export const projectAddProductsToBuffer = createAction(PROJECT_ADD_PRODUCTS_TO_BUFFER);
export const projectClearProductsBuffer = createAction(PROJECT_CLEAR_PRODUCTS_BUFFER);
export const projectAddProducts = createAction(PROJECT_ADD_PRODUCTS);
export const projectDeleteProduct = createAction(PROJECT_DELETE_PRODUCT);
export const projectChangeProductQuantity = createAction(PROJECT_CHANGE_PRODUCT_QUANTITY);
