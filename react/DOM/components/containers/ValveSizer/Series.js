// libraries
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
// components
import { default as NoData } from '../../presentational/NoData';
import { Series as SeriesPresentation } from '../../presentational/ValveSizer/index';
// selectors
import { ValveSizer as ValveSizerSelectors } from '../../../selectors/index';

/**
 * Series container
 */
class Series extends Component {

    static get propTypes() {
        return {
            params: PropTypes.shape({
                back: PropTypes.string
            }),
            seriesList: PropTypes.array.isRequired,
            modelsFactory: PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        // Models
        const seriesModel = this.props.modelsFactory['ValveSizer.Series'];
        const routingModel = this.props.modelsFactory.Routing;
        // Saving models for reuse
        this.setState({
            seriesModel,
            routingModel
        });
        // getting data for component
        seriesModel.init(this.props.params).then(() => {
            this.setState({ isLoading: false });
        });
    }

    render() {
        const { seriesList } = this.props;

        return (
            <div>
                <div className="page__subheader">
                    <div className="ui container">
                        <div className="ui centered vertically padded grid">
                            <div
                                className={'twelve wide computer fourteen wide ' +
                             'tablet sixteen wide mobile column aligned center'}
                            >
                                <Link to="/valve-sizer" className="ui right icon button page__back">
                                    <i className="left arrow icon"></i>
                                </Link>
                                <Link to="/valve-sizer/" className="page__headerLogo subpages">
                                    <img
                                        src="/images/valvesizer_logo.png"
                                        width="285"
                                        className="page__headerLogoImg"
                                        role="presentation"
                                    />
                                </Link>
                                <div className="page__notab">
                                    <Link
                                        to={'/valve-sizer/flow-pressure/' + encodeURIComponent('/valve-sizer/series')}
                                        className="ui icon button right floated"
                                    >
                                        <i className="icon edit"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui container">
                    {(!this.state.isLoading && (!_.isArray(seriesList) || _.size(seriesList) === 0)) &&
                        <NoData fallbackLink="/valve-sizer" />
                    }
                    {(!this.state.isLoading && _.isArray(seriesList) && _.size(seriesList) > 0) &&
                        <SeriesPresentation.List seriesList={seriesList} />
                    }
                </div>
            </div>
        );
    }
}

export default connect(ValveSizerSelectors.Series())(Series);
