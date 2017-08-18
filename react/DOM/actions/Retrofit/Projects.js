import shortid from 'shortid';
import { Retrofit as RetrofitSelectors } from '../../selectors/index';
import { projectAddProductsToBuffer } from '../Projects';

export const addProductsToProjectBuffer = (accessoriesModel, deviceMode, originalId, product) => dispatch => {
    const items = [
        {
            id: shortid.generate(),
            quantity: 1,
            type: `${deviceMode}.product`,
            product
        }
    ];

    return dispatch((dispatch2, getState) =>
        accessoriesModel.init({
            deviceMode,
            original: originalId,
            product: product.id
        }).then(() => {
            const { accessories } = RetrofitSelectors.Accessories()(getState());
            accessories.forEach(a => items.push({
                id: shortid.generate(),
                quantity: 1,
                type: `${deviceMode}.accessory`,
                product: a
            }));
            dispatch2(projectAddProductsToBuffer({
                applicationName: 'retrofit',
                items
            }));
        })
    );
};
