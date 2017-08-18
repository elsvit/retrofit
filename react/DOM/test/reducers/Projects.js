import { expect } from 'chai';
import * as actions from '../../actions/Projects';
import reducer from '../../reducers/Projects';

describe('Reducers.Projects', () => {

    const defaultState = {
        retrofit: {
            list: [],
            productsBuffer: []
        },
        'valve-sizer': {
            list: [],
            productsBuffer: []
        }
    };

    const stateWithProjects = {
        retrofit: {
            list: [
                {
                    id: 'ckIZz9',
                    name: 'Test retrofit project 1',
                    items: [
                        {
                            id: 'HcIzxi40',
                            quantity: 2,
                            product: {
                                id: 'KxuNz9',
                                title: 'Test product K',
                                product_image: 'path_to_product_K_image.jpg'
                            }
                        }
                    ]
                },
                {
                    id: 'Wxz7h1',
                    name: 'Test retrofit project 2',
                    items: []
                }
            ],
            productsBuffer: []
        },
        'valve-sizer': {
            list: [
                {
                    id: 'VkIZz9',
                    name: 'Test valvesizer project 1',
                    items: []
                }
            ],
            productsBuffer: []
        }
    };

    it('should return the initial state', () => {
        expect(
            reducer(undefined, { type: 'Test' })
        ).to.deep.equal(defaultState);
    });

    it('should create project', () => {
        const project = {
            id: 'some-string-id',
            name: 'Project name'
        };
        const action = {
            type: actions.PROJECT_CREATE,
            payload: {
                applicationName: 'retrofit',
                project
            }
        };
        expect(
            reducer(defaultState, action)
        ).to.deep.equal(Object.assign({}, defaultState, {
            retrofit: {
                list: [
                    {
                        id: project.id,
                        name: project.name,
                        items: []
                    }
                ],
                productsBuffer: defaultState.retrofit.productsBuffer
            },
            'valve-sizer': {
                list: defaultState['valve-sizer'].list,
                productsBuffer: defaultState['valve-sizer'].productsBuffer
            }
        }));
    });

    it('should delete project', () => {
        const action = {
            type: actions.PROJECT_DELETE,
            payload: {
                applicationName: 'retrofit',
                id: 'ckIZz9'
            }
        };
        expect(
            reducer(stateWithProjects, action)
        ).to.deep.equal({
            retrofit: {
                list: [
                    {
                        id: 'Wxz7h1',
                        name: 'Test retrofit project 2',
                        items: []
                    }
                ],
                productsBuffer: stateWithProjects.retrofit.productsBuffer
            },
            'valve-sizer': {
                list: stateWithProjects['valve-sizer'].list,
                productsBuffer: stateWithProjects['valve-sizer'].productsBuffer
            }
        });
    });

    it('should edit project', () => {
        const action = {
            type: actions.PROJECT_EDIT,
            payload: {
                applicationName: 'retrofit',
                project: {
                    id: 'Wxz7h1',
                    name: 'Test retrofit project 2 - updated',
                    items: []
                }
            }
        };
        expect(
            reducer(stateWithProjects, action)
        ).to.deep.equal({
            retrofit: {
                list: [
                    {
                        id: 'ckIZz9',
                        name: 'Test retrofit project 1',
                        items: [
                            {
                                id: 'HcIzxi40',
                                quantity: 2,
                                product: {
                                    id: 'KxuNz9',
                                    title: 'Test product K',
                                    product_image: 'path_to_product_K_image.jpg'
                                }
                            }
                        ]
                    },
                    {
                        id: 'Wxz7h1',
                        name: 'Test retrofit project 2 - updated',
                        items: []
                    }
                ],
                productsBuffer: stateWithProjects.retrofit.productsBuffer
            },
            'valve-sizer': {
                list: stateWithProjects['valve-sizer'].list,
                productsBuffer: stateWithProjects['valve-sizer'].productsBuffer
            }
        });
    });

    it('should add products to products buffer', () => {
        const action = {
            type: actions.PROJECT_ADD_PRODUCTS_TO_BUFFER,
            payload: {
                applicationName: 'retrofit',
                items: [
                    {
                        id: 'ucIzxi39',
                        quantity: 1,
                        product: {
                            id: 'LxuNz8',
                            title: 'Test product 1',
                            product_image: 'path_to_product_image.jpg'
                        }
                    }
                ]
            }
        };
        expect(
            reducer(defaultState, action)
        ).to.deep.equal({
            retrofit: {
                list: defaultState.retrofit.list,
                productsBuffer: [
                    {
                        id: 'ucIzxi39',
                        quantity: 1,
                        product: {
                            id: 'LxuNz8',
                            title: 'Test product 1',
                            product_image: 'path_to_product_image.jpg'
                        }
                    }
                ]
            },
            'valve-sizer': {
                list: defaultState['valve-sizer'].list,
                productsBuffer: defaultState['valve-sizer'].productsBuffer
            }
        });
    });

    it('should clear products buffer', () => {
        const stateWithBuffer = {
            retrofit: {
                list: [],
                productsBuffer: [
                    {
                        id: 'ucIzxi39',
                        quantity: 1,
                        product: {
                            id: 'LxuNz8',
                            title: 'Test product 1',
                            product_image: 'path_to_product_image.jpg'
                        }
                    }
                ]
            },
            'valve-sizer': {
                list: [],
                productsBuffer: []
            }
        };
        const action = {
            type: actions.PROJECT_CLEAR_PRODUCTS_BUFFER,
            payload: {
                applicationName: 'retrofit'
            }
        };
        expect(
            reducer(stateWithBuffer, action)
        ).to.deep.equal({
            retrofit: {
                list: stateWithBuffer.retrofit.list,
                productsBuffer: []
            },
            'valve-sizer': {
                list: stateWithBuffer['valve-sizer'].list,
                productsBuffer: stateWithBuffer['valve-sizer'].productsBuffer
            }
        });
    });

    it('should add products to project which has no items', () => {
        const stateForAddProducts = {
            retrofit: {
                list: [
                    {
                        id: 'ckIZz91',
                        name: 'Test retrofit project',
                        items: []
                    }
                ],
                productsBuffer: []
            },
            'valve-sizer': {
                list: [],
                productsBuffer: []
            }
        };
        const action = {
            type: actions.PROJECT_ADD_PRODUCTS,
            payload: {
                applicationName: 'retrofit',
                id: 'ckIZz91',
                items: [
                    {
                        id: 'HcIzxi39',
                        quantity: 1,
                        product: {
                            id: 'KxuNz8',
                            title: 'Test product N',
                            product_image: 'path_to_product_N_image.jpg'
                        }
                    }
                ]
            }
        };
        expect(
            reducer(stateForAddProducts, action)
        ).to.deep.equal({
            retrofit: {
                list: [
                    {
                        id: 'ckIZz91',
                        name: 'Test retrofit project',
                        items: [
                            {
                                id: 'HcIzxi39',
                                quantity: 1,
                                product: {
                                    id: 'KxuNz8',
                                    title: 'Test product N',
                                    product_image: 'path_to_product_N_image.jpg'
                                }
                            }
                        ]
                    }
                ],
                productsBuffer: stateForAddProducts.retrofit.productsBuffer
            },
            'valve-sizer': {
                list: stateForAddProducts['valve-sizer'].list,
                productsBuffer: stateForAddProducts['valve-sizer'].productsBuffer
            }
        });
    });

    it('should add products to project which has one the same item', () => {
        const stateForAddProducts = {
            retrofit: {
                list: [
                    {
                        id: 'ckIZz92',
                        name: 'Test retrofit project',
                        items: [
                            {
                                id: 'HcIzxi40',
                                quantity: 2,
                                product: {
                                    id: 'KxuNz9',
                                    title: 'Test product K',
                                    product_image: 'path_to_product_K_image.jpg'
                                }
                            }
                        ]
                    }
                ],
                productsBuffer: []
            },
            'valve-sizer': {
                list: [],
                productsBuffer: []
            }
        };
        const action = {
            type: actions.PROJECT_ADD_PRODUCTS,
            payload: {
                applicationName: 'retrofit',
                id: 'ckIZz92',
                items: [
                    {
                        id: 'HcIzxi40',
                        quantity: 1,
                        product: {
                            id: 'KxuNz9',
                            title: 'Test product K',
                            product_image: 'path_to_product_K_image.jpg'
                        }
                    }
                ]
            }
        };
        expect(
            reducer(stateForAddProducts, action)
        ).to.deep.equal({
            retrofit: {
                list: [
                    {
                        id: 'ckIZz92',
                        name: 'Test retrofit project',
                        items: [
                            {
                                id: 'HcIzxi40',
                                quantity: 3,
                                product: {
                                    id: 'KxuNz9',
                                    title: 'Test product K',
                                    product_image: 'path_to_product_K_image.jpg'
                                }
                            }
                        ]
                    }
                ],
                productsBuffer: stateForAddProducts.retrofit.productsBuffer
            },
            'valve-sizer': {
                list: stateForAddProducts['valve-sizer'].list,
                productsBuffer: stateForAddProducts['valve-sizer'].productsBuffer
            }
        });
    });

    it('should add products to project which has other items', () => {
        const stateForAddProducts = {
            retrofit: {
                list: [
                    {
                        id: 'ckIZz93',
                        name: 'Test retrofit project',
                        items: [
                            {
                                id: 'HcIzxi41',
                                quantity: 2,
                                product: {
                                    id: 'KxuNz10',
                                    title: 'Test product L',
                                    product_image: 'path_to_product_L_image.jpg'
                                }
                            }
                        ]
                    }
                ],
                productsBuffer: []
            },
            'valve-sizer': {
                list: [],
                productsBuffer: []
            }
        };
        const action = {
            type: actions.PROJECT_ADD_PRODUCTS,
            payload: {
                applicationName: 'retrofit',
                id: 'ckIZz93',
                items: [
                    {
                        id: 'HcIzxi42',
                        quantity: 1,
                        product: {
                            id: 'KxuNz11',
                            title: 'Test product P',
                            product_image: 'path_to_product_P_image.jpg'
                        }
                    }
                ]
            }
        };
        expect(
            reducer(stateForAddProducts, action)
        ).to.deep.equal({
            retrofit: {
                list: [
                    {
                        id: 'ckIZz93',
                        name: 'Test retrofit project',
                        items: [
                            {
                                id: 'HcIzxi41',
                                quantity: 2,
                                product: {
                                    id: 'KxuNz10',
                                    title: 'Test product L',
                                    product_image: 'path_to_product_L_image.jpg'
                                }
                            },
                            {
                                id: 'HcIzxi42',
                                quantity: 1,
                                product: {
                                    id: 'KxuNz11',
                                    title: 'Test product P',
                                    product_image: 'path_to_product_P_image.jpg'
                                }
                            }
                        ]
                    }
                ],
                productsBuffer: stateForAddProducts.retrofit.productsBuffer
            },
            'valve-sizer': {
                list: stateForAddProducts['valve-sizer'].list,
                productsBuffer: stateForAddProducts['valve-sizer'].productsBuffer
            }
        });
    });

    it('should delete product from project', () => {
        const action = {
            type: actions.PROJECT_DELETE_PRODUCT,
            payload: {
                applicationName: 'retrofit',
                id: 'ckIZz9',
                itemId: 'HcIzxi40'
            }
        };
        expect(
            reducer(stateWithProjects, action)
        ).to.deep.equal({
            retrofit: {
                list: [
                    {
                        id: 'ckIZz9',
                        name: 'Test retrofit project 1',
                        items: []
                    },
                    {
                        id: 'Wxz7h1',
                        name: 'Test retrofit project 2',
                        items: []
                    }
                ],
                productsBuffer: stateWithProjects.retrofit.productsBuffer
            },
            'valve-sizer': {
                list: stateWithProjects['valve-sizer'].list,
                productsBuffer: stateWithProjects['valve-sizer'].productsBuffer
            }
        });
    });

    it('should change product quantity in project', () => {
        const action = {
            type: actions.PROJECT_CHANGE_PRODUCT_QUANTITY,
            payload: {
                applicationName: 'retrofit',
                id: 'ckIZz9',
                itemId: 'HcIzxi40',
                quantity: 5
            }
        };
        expect(
            reducer(stateWithProjects, action)
        ).to.deep.equal({
            retrofit: {
                list: [
                    {
                        id: 'ckIZz9',
                        name: 'Test retrofit project 1',
                        items: [
                            {
                                id: 'HcIzxi40',
                                quantity: 5,
                                product: {
                                    id: 'KxuNz9',
                                    title: 'Test product K',
                                    product_image: 'path_to_product_K_image.jpg'
                                }
                            }
                        ]
                    },
                    {
                        id: 'Wxz7h1',
                        name: 'Test retrofit project 2',
                        items: []
                    }
                ],
                productsBuffer: stateWithProjects.retrofit.productsBuffer
            },
            'valve-sizer': {
                list: stateWithProjects['valve-sizer'].list,
                productsBuffer: stateWithProjects['valve-sizer'].productsBuffer
            }
        });
    });

});
