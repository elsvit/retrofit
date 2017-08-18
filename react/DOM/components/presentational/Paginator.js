/**
 * # See https://github.com/AZaviruha/pager
 * # Stateless Paginator component
 *
 * ## Usage
 * ```
 * <Paginator
 *        current={7}
 *        total={20}
 *        visible={3}
 *        onPageChanged={this.handlePageChanged}
 *        onPageSizeChanged={this.onPageSizeChanged}
 *        titles={{
 *            firstPage:     "First",
 *            previousPage:  "Prev",
 *            previousBlock: "...",
 *            nextBlock:     "...",
 *            nextPage:      "Next",
 *            lastPage:      "Last"
 *        }} />
 * ```
 *
 * ## How it looks like
 * ```
 * First | Prev | ... | 6 | 7 | 8 | ... | Next | Last
 * ```
 *
 */
import React, { Component, PropTypes } from 'react';

const Page = ({ isActive, onClick, children }) => {
    let active = isActive ? ' active' : '';
    return (
        <button onClick={onClick} className={'ui' + active + ' icon button'}>
            {children}
        </button>

    );
};

Page.propTypes = {
    isActive: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    children: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
        React.PropTypes.object
    ]).isRequired
};

class Paginator extends Component {

    /* ========================= CONSTANTS ============================ */

    static get propTypes() {
        return {
            total: React.PropTypes.number.isRequired,
            visible: React.PropTypes.number.isRequired,
            current: React.PropTypes.number.isRequired,
            titles: React.PropTypes.object,
            onPageChanged: React.PropTypes.func,
            onPageSizeChanged: React.PropTypes.func
        };
    }

    static get TITLES() {
        return {
            firstPage: 'First',
            previousPage: 'Previous',
            previousBlock: '...',
            nextBlock: '...',
            nextPage: 'Next',
            lastPage: 'Last'
        };
    }

    constructor(props) {
        super(props);
        this.handlePreviousPage = this.handlePreviousPage.bind(this);
        this.handlePreviousBlock = this.handlePreviousBlock.bind(this);
        this.handleNextBlock = this.handleNextBlock.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);
    }

    /* ========================= HELPERS ============================== */

    // how many pages in total
    total() {
        return this.props.total;
    }

    // value of current page
    currentPage() {
        return this.props.current;
    }

    // first page
    firstPage() {
        return 1;
    }

    // last page
    lastPage() {
        return this.total();
    }

    // how many pages before current page available
    pagesBefore() {
        return this.currentPage() - 1;
    }

    // how many pages after current page available
    pagesAfter() {
        return this.total() - this.currentPage();
    }

    // what is the number of previous page
    previousPage() {
        return (this.pagesBefore() > 0) ? (this.currentPage() - 1) : this.currentPage();
    }

    // what is the number of next page
    nextPage() {
        return (this.pagesAfter() > 0) ? (this.currentPage() + 1) : this.currentPage();
    }

    // how many pages should be in block
    blockSize() {
        return (this.props.visible < 1) ? 1 : this.props.visible;
    }

    // what pages should be displayed in current block
    currentBlock() {
        let block = [];
        let minimumAmountOfPagesByEachSide = Math.ceil((this.blockSize() - 1) / 2);

        if (minimumAmountOfPagesByEachSide === 0) {
            block.push(this.currentPage());
            return block;
        }

        for (
            let added = 0, page = this.pagesBefore();
            page > 0 && added < minimumAmountOfPagesByEachSide;
            page--, added++
        ) {
            block.unshift(page);
        }

        for (
            let added = 0, page = this.currentPage();
            page <= this.lastPage() && added < minimumAmountOfPagesByEachSide + 1;
            page++, added++
        ) {
            block.push(page);
        }

        return block;
    }

    // what is the minimum page number in current block
    startOfBlock() {
        return this.currentBlock().shift();
    }

    // what is the maximum page number in current block
    endOfBlock() {
        return this.currentBlock().pop();
    }

    // get value of title
    titles(key) {
        let propsTitles = this.props.titles || {};
        return propsTitles[key] || Paginator.TITLES[key];
    }

    /* ========================= HANDLERS ============================= */

    // what to do when changing page
    handlePageChanged(pageNumber) {
        let handler = this.props.onPageChanged;
        if (handler) handler(pageNumber);
    }

    // what to do when clicking on first page link
    handleFirstPage() {
        if (this.firstPage() === this.currentPage()) return;
        this.handlePageChanged(this.firstPage());
    }

    // what to do when clicking on previous page link
    handlePreviousPage() {
        if (this.previousPage() === this.currentPage()) return;
        this.handlePageChanged(this.previousPage());
    }

    // what to do when clicking on nex page link
    handleNextPage() {
        if (this.nextPage() === this.currentPage()) return;
        this.handlePageChanged(this.nextPage());
    }

    // what to do when clicking on last page link
    handleLastPage() {
        if (this.lastPage() === this.currentPage()) return;
        this.handlePageChanged(this.lastPage());
    }

    // what to do when clicking on previous block link
    handlePreviousBlock() {
        let shift = (this.pagesBefore() >= this.blockSize()) ? this.blockSize() : this.pagesBefore();
        if (shift === 0) return;
        this.handlePageChanged(this.currentPage() - shift);
    }

    // what to do when clicking on next block link
    handleNextBlock() {
        let shift = (this.pagesAfter() >= this.blockSize()) ? this.blockSize() : this.pagesAfter();
        if (shift === 0) return;
        this.handlePageChanged(this.currentPage() + shift);
    }

    /* ========================= RENDERS ==============================*/
    render() {
        let pages = [];

        // previous page
        if (this.startOfBlock() !== this.previousPage()) {
            pages.push(
                <Page key="btn-prev-page" onClick={this.handlePreviousPage}>
                    <i className="left arrow icon"></i>
                </Page>
            );
        }

        // previous block
        if (this.startOfBlock() > this.firstPage() + 1) {
            pages.push(
                <Page key="btn-prev-block" onClick={this.handlePreviousBlock}>
                    {this.titles('previousBlock')}
                </Page>
            );
        }

        // current block
        for (let number of this.currentBlock()) {
            let isActive = (this.currentPage() === number);
            pages.push(
                <Page
                    key={number}
                    isActive={isActive}
                    onClick={(SE) => { this.handlePageChanged(number); }}
                >
                    {number}
                </Page>
            );
        }

        // next block
        if (this.endOfBlock() < this.lastPage() - 1) {
            pages.push(
                <Page key="btn-next-block" onClick={this.handleNextBlock}>
                    {this.titles('nextBlock')}
                </Page>
            );
        }

        // next page
        if (this.endOfBlock() !== this.nextPage()) {
            pages.push(
                <Page key="btn-next-page" onClick={this.handleNextPage}>
                    <i className="right arrow icon"></i>
                </Page>
            );
        }


        return (
            <nav className="ui buttons">
                {pages}
            </nav>
        );
    }
}

export default Paginator;
