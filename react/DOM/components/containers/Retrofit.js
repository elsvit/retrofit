import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import * as RetrofitContainers from './Retrofit/index';
import Counterpart from 'counterpart';

/**
 * Application's direct child component + its own routing
 */
class Retrofit extends Component {

    static get propTypes() {
        return {
            children: PropTypes.object.isRequired
        };
    }

    static routing({ ModelsFactory }) {
        return (
            <Route path="retrofit" component={Retrofit}>
                <IndexRoute component={RetrofitContainers.Start} />
                <Route path="originals/parameters" component={RetrofitContainers.OriginalsContainers.Parameters} />
                <Route
                    path="originals/parameters/:deviceMode/:name"
                    component={RetrofitContainers.OriginalsContainers.Parameter}
                />
                <Route path="originals" component={RetrofitContainers.Originals} />
                <Route path="replacements/:deviceMode/:original" component={RetrofitContainers.Replacements} />
                <Route
                    path="comparison/:deviceMode/:original/:product(/:back_url)"
                    component={RetrofitContainers.Comparison}
                />
                <Route
                    path="accessories/:deviceMode/:original/:product(/:back_url)"
                    component={RetrofitContainers.Accessories}
                />
                <Route path="settings" component={RetrofitContainers.Settings} />
            </Route>
        );
    }

    componentDidMount() {
        Counterpart.onLocaleChange(this.onLocaleChange);
    }

    componentWillUnmount() {
        Counterpart.offLocaleChange(this.onLocaleChange);
    }

    onLocaleChange(locale) {
        // this.setState({ locale });
    }

    get initialState() {
        return {
            locale: Counterpart.getLocale()
        };
    }

    render() {
        return (
            <div className="page">
                <div className="page__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Retrofit;
