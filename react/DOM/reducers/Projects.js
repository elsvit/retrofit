import { handleActions } from 'redux-actions';

import {
    PROJECT_CREATE, PROJECT_EDIT, PROJECT_DELETE, PROJECT_ADD_PRODUCTS_TO_BUFFER, PROJECT_CLEAR_PRODUCTS_BUFFER,
    PROJECT_ADD_PRODUCTS, PROJECT_DELETE_PRODUCT, PROJECT_CHANGE_PRODUCT_QUANTITY
} from '../actions/Projects';

const initialState = {
    retrofit: {
        list: [],
        productsBuffer: []
    },
    'valve-sizer': {
        list: [],
        productsBuffer: []
    }
};

export default handleActions(
    {
        [PROJECT_CREATE]: (state, action) => {
            const applicationName = action.payload.applicationName;
            let projectsByAppName = {};
            projectsByAppName[applicationName] = {
                list: [
                    ...state[applicationName].list,
                    {
                        id: action.payload.project.id,
                        name: action.payload.project.name,
                        items: (action.payload.project.items || [])
                    }
                ],
                productsBuffer: state[applicationName].productsBuffer
            };
            return Object.assign({}, state, projectsByAppName);
        },

        [PROJECT_EDIT]: (state, action) => {
            const applicationName = action.payload.applicationName;
            const projectIndex = state[applicationName].list.findIndex((project) =>
                (project.id === action.payload.project.id)
            );

            if (projectIndex === -1) {
                return state;
            }

            const updatedProject = Object.assign({}, state[applicationName].list[projectIndex], {
                name: action.payload.project.name
            });

            let projectsByAppName = {};
            projectsByAppName[applicationName] = {
                list: [
                    ...state[applicationName].list.slice(0, projectIndex),
                    updatedProject,
                    ...state[applicationName].list.slice(projectIndex + 1)
                ],
                productsBuffer: state[applicationName].productsBuffer
            };

            return Object.assign({}, state, projectsByAppName);
        },

        [PROJECT_DELETE]: (state, action) => {
            const applicationName = action.payload.applicationName;
            const projectIndex = state[applicationName].list.findIndex((project) => (project.id === action.payload.id));

            if (projectIndex === -1) {
                return state;
            }

            let projectsByAppName = {};

            if (state[applicationName].list.length === 1) {
                projectsByAppName[applicationName] = {
                    list: [],
                    productsBuffer: state[applicationName].productsBuffer
                };
            } else {
                projectsByAppName[applicationName] = {
                    list: [
                        ...state[applicationName].list.slice(0, projectIndex),
                        ...state[applicationName].list.slice(projectIndex + 1)
                    ],
                    productsBuffer: state[applicationName].productsBuffer
                };
            }

            return Object.assign({}, state, projectsByAppName);
        },

        [PROJECT_ADD_PRODUCTS_TO_BUFFER]: (state, action) => {
            const applicationName = action.payload.applicationName;
            let bufferByAppName = {};
            bufferByAppName[applicationName] = {
                list: state[applicationName].list,
                productsBuffer: [
                    ...action.payload.items
                ]
            };
            return Object.assign({}, state, bufferByAppName);
        },

        [PROJECT_CLEAR_PRODUCTS_BUFFER]: (state, action) => {
            const applicationName = action.payload.applicationName;
            let bufferByAppName = {};
            bufferByAppName[applicationName] = {
                list: state[applicationName].list,
                productsBuffer: []
            };
            return Object.assign({}, state, bufferByAppName);
        },

        [PROJECT_ADD_PRODUCTS]: (state, action) => {
            const bufferItems = action.payload.items;
            if (!bufferItems || bufferItems.length === 0) {
                return state;
            }

            const applicationName = action.payload.applicationName;
            const projectIndex = state[applicationName].list.findIndex((project) => (project.id === action.payload.id));

            if (projectIndex === -1) {
                return state;
            }

            let projectsByAppName = {};
            const project = Object.assign({}, state[applicationName].list[projectIndex]);
            let projectItems = (project.items || []);
            if (projectItems.length === 0) {
                bufferItems.forEach((item) => {
                    projectItems = [
                        ...projectItems,
                        item
                    ];
                });
            } else {
                bufferItems.forEach((item) => {
                    const existingItemIndex = projectItems.findIndex((projectItem) => (
                        projectItem.type === item.type && projectItem.product.id === item.product.id
                    ));
                    if (existingItemIndex > -1) {
                        projectItems = projectItems.map((projectItem, index) => {
                            if (index === existingItemIndex) {
                                return Object.assign({}, projectItem, {
                                    quantity: projectItem.quantity + item.quantity
                                });
                            }
                            return projectItem;
                        });
                    } else {
                        projectItems = [
                            ...projectItems,
                            item
                        ];
                    }
                });
            }

            projectsByAppName[applicationName] = {
                list: [
                    ...state[applicationName].list.slice(0, projectIndex),
                    Object.assign({}, project, {
                        items: projectItems
                    }),
                    ...state[applicationName].list.slice(projectIndex + 1)
                ],
                productsBuffer: state[applicationName].productsBuffer
            };

            return Object.assign({}, state, projectsByAppName);
        },

        [PROJECT_DELETE_PRODUCT]: (state, action) => {
            const applicationName = action.payload.applicationName;
            const projectIndex = state[applicationName].list.findIndex((project) => (project.id === action.payload.id));

            if (projectIndex === -1) {
                return state;
            }

            let projectsByAppName = {};
            const project = Object.assign({}, state[applicationName].list[projectIndex]);
            let projectItems = (project.items || []);

            if (projectItems.length === 0) {
                return state;
            }

            const projectItemIndex = projectItems.findIndex((projectItem) => (
                projectItem.id === action.payload.itemId
            ));
            if (projectItemIndex === -1) {
                return state;
            }

            projectItems = [
                ...projectItems.slice(0, projectItemIndex),
                ...projectItems.slice(projectItemIndex + 1),
            ];

            projectsByAppName[applicationName] = {
                list: [
                    ...state[applicationName].list.slice(0, projectIndex),
                    Object.assign({}, project, {
                        items: projectItems
                    }),
                    ...state[applicationName].list.slice(projectIndex + 1)
                ],
                productsBuffer: state[applicationName].productsBuffer
            };

            return Object.assign({}, state, projectsByAppName);
        },

        [PROJECT_CHANGE_PRODUCT_QUANTITY]: (state, action) => {
            const applicationName = action.payload.applicationName;
            const projectIndex = state[applicationName].list.findIndex((project) => (project.id === action.payload.id));

            if (projectIndex === -1) {
                return state;
            }

            let projectsByAppName = {};
            const project = Object.assign({}, state[applicationName].list[projectIndex]);
            let projectItems = (project.items || []);

            if (projectItems.length === 0) {
                return state;
            }

            const projectItemIndex = projectItems.findIndex((projectItem) => (
                projectItem.id === action.payload.itemId
            ));
            if (projectItemIndex === -1) {
                return state;
            }

            projectItems = projectItems.map((projectItem, index) => {
                if (index === projectItemIndex) {
                    return Object.assign({}, projectItem, {
                        quantity: action.payload.quantity
                    });
                }
                return projectItem;
            });

            projectsByAppName[applicationName] = {
                list: [
                    ...state[applicationName].list.slice(0, projectIndex),
                    Object.assign({}, project, {
                        items: projectItems
                    }),
                    ...state[applicationName].list.slice(projectIndex + 1)
                ],
                productsBuffer: state[applicationName].productsBuffer
            };

            return Object.assign({}, state, projectsByAppName);
        }
    },
    initialState
);
