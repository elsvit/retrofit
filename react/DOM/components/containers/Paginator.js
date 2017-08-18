// libraries
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
// components
import { default as PaginatorPresentation } from '../presentational/Paginator';

/**
 * Consume paginatable model & render paginator
 */
class Paginator extends Component {

    static get propTypes() {
        return {
            model: PropTypes.object.isRequired,
            onPageChangeHandle: PropTypes.func.isRequired,
        };
    }

    render() {
        if (_.isEmpty(this.props.model)) {
            return false;
        }

        let paginator = '';

        const pagesAmount = this.props.model.paginationPages;
        const currentPage = this.props.model.paginationPage;

        if (pagesAmount > 1) {
            paginator = (
                <PaginatorPresentation
                    total={pagesAmount}
                    visible={5}
                    current={currentPage}
                    onPageChanged={this.props.onPageChangeHandle}
                />
            );
        }

        return (
            <div className="ui container">
                <div className="ui centered vertically padded grid">
                    <div className="row">
                        <div className="sixteen wide computer column aligned center">
                            {paginator}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Paginator;
