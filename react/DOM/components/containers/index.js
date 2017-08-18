// libraries
import log from 'loglevel';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import Counterpart from 'counterpart';
// components - containers
import Application from './Application';
import Home from './Home';
import Retrofit from './Retrofit';
import ValveSizer from './ValveSizer';
import * as ProjectContainers from './Projects';
import * as SettingsSelectors from '../../selectors/Settings';

import User from './User';
// components - presentational
import { NotFound } from '../presentational/index';

class Index extends Component {

    static get propTypes() {
        return {
            history: PropTypes.object.isRequired,
            DevTools: PropTypes.func,
            modelsFactory: PropTypes.object.isRequired,
            locale: PropTypes.string.isRequired
        };
    }

    componentWillMount() {
        log.debug('IndexContainer.componentWillMount()');
        // model with locales
        const userModel = this.props.modelsFactory.User;
        console.log(userModel.localesIDs);
        // possible counterpart locales
        _.forEach(userModel.localesIDs, (value) => {
            /* eslint-disable global-require */
            let translationsRetroFit = require('json!./../../translations/' + value + '.retrofit.json');
            let translationsValveSizer = require('json!./../../translations/' + value + '.valvesizer.json');
            let translationsCommon = require('json!./../../translations/' + value + '.common.json');
            /* eslint-enable global-require */

            Counterpart.registerTranslations(value, translationsCommon);
            Counterpart.registerTranslations(value, translationsRetroFit);
            Counterpart.registerTranslations(value, translationsValveSizer);
        });

        // current counterpart locale
        Counterpart.setLocale(this.props.locale);
    }

    render() {
        const { history, DevTools } = this.props;
        return (
            <div>
                <Router
                    onUpdate={() => window.scrollTo(0, 0)}
                    history={history}
                    createElement={(C, props) => <C modelsFactory={this.props.modelsFactory} {...props} />}
                >
                    <Route path="/" component={Application}>
                        <IndexRoute component={Home} />
                        <Route path="user/locale/:locale" component={User} />
                        {Retrofit.routing(this.props)}
                        {ValveSizer.routing(this.props)}
                        <Route
                            path=":applicationName/projects(/:backUrl)"
                            component={ProjectContainers.List}
                        />
                        <Route
                            path=":applicationName/project/details/:project(/:backUrl)"
                            component={ProjectContainers.Details}
                        />
                        <Route
                            path=":applicationName/project/new(/:backUrl)"
                            component={ProjectContainers.Edit}
                        />
                        <Route
                            path=":applicationName/project/edit/:project(/:backUrl)"
                            component={ProjectContainers.Edit}
                        />
                        <Route
                            path=":applicationName/project/share/:projectName/:productsIds/:quantities"
                            component={ProjectContainers.Share}
                        />
                        <Route path="*" name="not-found" component={NotFound} />
                    </Route>
                </Router>
                <DevTools />
            </div>
        );
    }
}

export default connect(
    state => ({
        locale: SettingsSelectors.getUiLocale(state)
    })
)(Index);
