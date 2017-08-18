import React, { PropTypes, Component } from 'react';
import { default as Translate } from 'react-translate-component';
import { ConfirmationDialog } from '../Modal/index';
import Image from '../../Image';

class ProductRow extends Component {
    static get propTypes() {
        return {
            projectData: PropTypes.shape({
                name: PropTypes.string.isRequired
            }).isRequired,
            projectItemData: PropTypes.shape({
                id: PropTypes.string.isRequired,
                quantity: PropTypes.number.isRequired,
                product: PropTypes.shape({
                    title: PropTypes.string.isRequired,
                    product_image: PropTypes.string.isRequired
                }).isRequired,
                quantityHandler: PropTypes.func.isRequired,
                detachHandler: PropTypes.func.isRequired
            }).isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        };
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.onChangeQuantityManually = this.onChangeQuantityManually.bind(this);
    }

    onChangeQuantityManually(event) {
        const newQuantity = event.target.value;
        const { projectItemData: { quantity, quantityHandler } } = this.props;
        if (newQuantity > 0 && newQuantity !== quantity) {
            quantityHandler(newQuantity);
        }
    }

    openDialog() {
        this.setState({ modalIsOpen: true });
    }

    closeDialog() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        const { projectData, projectItemData } = this.props;
        return (
            <div className="item product__item">
                <div className="right floated content">
                    <div className="ui right labeled input spinner">
                        <input
                            className="product-quantity"
                            placeholder={projectItemData.quantity}
                            type="text"
                            style={{
                                width: '40px',
                                marginRight: '3px',
                                padding: 0,
                                textAlign: 'center'
                            }}
                            onBlur={this.onChangeQuantityManually}
                        />
                        <div className="ui mini vertical buttons">
                            <button
                                className="product-quantity-increase-btn ui button"
                                onClick={(SE) => projectItemData.quantityHandler(projectItemData.quantity + 1)}
                            >
                                <i className="up chevron icon"></i>
                            </button>
                            <button
                                className="product-quantity-decrease-btn ui button"
                                onClick={(SE) => projectItemData.quantityHandler(projectItemData.quantity - 1)}
                            >
                                <i className="down chevron icon"></i>
                            </button>
                        </div>
                    </div>
                    <div className="product-remove-btn ui icon button" onClick={this.openDialog}>
                        <i className="remove icon"></i>
                    </div>
                </div>

                <div className="box-outer">
                    <div className="box-inner">
                        <Image fileName={projectItemData.product.product_image} />
                    </div>
                    <div className="product-title">
                        {projectItemData.product.title}
                    </div>
                </div>
                <ConfirmationDialog
                    modalOptions={{
                        isOpen: this.state.modalIsOpen,
                        onRequestClose: this.closeDialog
                    }}
                    MessageNode={
                        <Translate
                            content={"label.projects.delete_item_confirmation"}
                            productTitle={projectItemData.product.title}
                            projectName={projectData.name}
                        />
                    }
                    onConfirmHandler={projectItemData.detachHandler}
                />
            </div>
        );
    }
}

export default ProductRow;
