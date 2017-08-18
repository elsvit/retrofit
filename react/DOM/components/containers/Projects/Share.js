import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { Map as MapSelector } from '../../../selectors/index';
import {
    ProjectName, decodeProjectSharingProductIds, decodeProjectSharingProductId, getUniqueName
} from '../../../utils/projectSharingHelper';
import { projectCreate } from '../../../actions/Projects';


class Share extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                projectName: PropTypes.string.isRequired,
                productsIds: PropTypes.string.isRequired,
                quantities: PropTypes.string.isRequired
            }),
            projects: PropTypes.array.isRequired,
            modelsFactory: PropTypes.object.isRequired,
            shareProject: PropTypes.func.isRequired
        };
    }

    componentWillMount() {
        const { params: { projectName, productsIds, quantities }, projects } = this.props;
        const encodedProductsIdsList = productsIds.split(',');
        const quantitiesList = quantities.split(',');

        const projectNames = projects.map(project => project.name);
        const newProjectName = getUniqueName(ProjectName.decode(projectName), projectNames);
        this.props.shareProject(newProjectName, encodedProductsIdsList, quantitiesList);
    }

    render() {
        return (<div></div>);
    }
}

const mapStateToProps = (state, ownProps) => {
    const { applicationName } = ownProps.params;
    return MapSelector({
        projects: `Projects.${applicationName}.list`
    })(state);
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { applicationName } = ownProps.params;
    return {
        shareProject: (projectName, encodedProductsIds, quantities) => {
            const routingModel = ownProps.modelsFactory.Routing;
            if (encodedProductsIds.length === 0) {
                routingModel.pushPath(`/${applicationName}/projects`);
                return;
            }

            dispatch((dispatch2, getState) => {
                const project = {
                    id: shortid.generate(),
                    name: projectName,
                    items: []
                };

                // decode products ids
                const productTypeToProductIdsMap = decodeProjectSharingProductIds(encodedProductsIds);
                const decodedProductsData = encodedProductsIds.map(
                    encodedProductId => decodeProjectSharingProductId(encodedProductId)
                );
                // promises for data of products fetching
                const fetchProductsPromises = Object.keys(productTypeToProductIdsMap).map(type => {
                    const productsIds = productTypeToProductIdsMap[type];
                    const projectProductsModel = ownProps.modelsFactory.ProjectProducts(type);
                    return projectProductsModel.fetchProducts(applicationName, productsIds, type);
                });

                const getProductsFromState = (typeToIdsMap, state) => {
                    let products = [];
                    Object.keys(typeToIdsMap).map(type => {
                        const productsData = MapSelector({
                            data: `ProjectProducts.${type}.mapEntities`
                        })(state);
                        const productsByType = Object.keys(productsData.data).map(
                            productId => productsData.data[productId].entityData
                        );
                        products = [
                            ...products,
                            ...productsByType
                        ];
                        return productsByType;
                    });
                    return products;
                };

                Promise.all(fetchProductsPromises).then(() => {
                    const products = getProductsFromState(productTypeToProductIdsMap, getState());

                    // populate items for project if it's necessary
                    if (products.length > 0) {
                        project.items = decodedProductsData.map((decodedProductData, index) => {
                            const foundQuantity = (Number(quantities[index]) || 1);
                            return {
                                id: shortid.generate(),
                                quantity: foundQuantity,
                                type: decodedProductData.type,
                                product: products.find(productData => (productData.id === decodedProductData.id))
                            };
                        });
                    }

                    dispatch2(projectCreate({
                        applicationName,
                        project
                    }));

                    routingModel.pushPath(`/${applicationName}/project/details/${project.id}`);
                });
            });
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Share);
