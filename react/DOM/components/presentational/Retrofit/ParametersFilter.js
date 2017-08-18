import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Translate from 'react-translate-component';
import { Collapsed as CollapsedSelect, Expanded as ExpandedSelect } from '../Select/index';

class ParametersFilter extends Component {
    static get propTypes() {
        return {
            parameters: PropTypes.object.isRequired,
            onChangeParameterValueHandler: PropTypes.func.isRequired,
            embedMode: PropTypes.string
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            activeParameterName: ''
        };
    }

    openParameterSelect(name) {
        this.setState({ activeParameterName: name });
    }

    closeParameterSelect() {
        this.setState({ activeParameterName: '' });
    }

    renderParametersList() {
        const { parameters } = this.props;
        const selects = _.reduce(parameters, (result, parameter, name) => {
            if (parameter.options.length === 0) {
                return result;
            }

            const translateKeyLabel = 'label.property.' + name;
            let values = parameter.values || [];
            let isHint = false;
            if (parameter.options.length === 1 && parameter.values.length === 0) {
                values = [parameter.options[0]];
                isHint = true;
            }
            return [
                ...result,
                <a
                    className="item select__item"
                    tabIndex="0"
                    key={name}
                    onClick={(SE) => { this.openParameterSelect(name); }}
                >
                    <CollapsedSelect label={translateKeyLabel} values={values} isHint={isHint} />
                </a>
            ];
        }, []);

        return (
            <div className="ui fluid vertical menu js-filter-parameters-list">
                 {selects}
            </div>
        );
    }

    renderParameterSelect() {
        const { parameters, onChangeParameterValueHandler, embedMode } = this.props;
        const parameter = parameters[this.state.activeParameterName] || null;
        const handler = (name, value) => {
            onChangeParameterValueHandler(name, value);
            this.closeParameterSelect();
        };
        const backHandler = () => {
            this.closeParameterSelect();
        };

        return (
            <div className="js-filter-parameter-select">
                {parameter &&
                    <div>
                        <p className="container__label">
                            {!embedMode &&
                                <Translate
                                    parameterLabel={parameter.label}
                                    content="label.parameter.select.hint"
                                />
                            }
                        </p>
                        <ExpandedSelect
                            name={this.state.activeParameterName}
                            title={`SELECT ${parameter.label.toUpperCase()}`}
                            options={parameter.options}
                            values={parameter.values}
                            handler={handler}
                            backHandler={backHandler}
                        />
                    </div>
                }
                {!parameter &&
                    <div>Parameter not found</div>
                }
            </div>
        );
    }

    render() {
        const { embedMode } = this.props;

        return (
            <div className="ui container">
                <div className="ui centered vertically padded grid">
                    <div className="row">
                        <div
                            className={
                                "twelve wide computer fourteen wide tablet sixteen wide mobile column aligned center"
                            }
                        >
                            {!(this.state.activeParameterName.length > 0) &&
                                <div>
                                    {!embedMode &&
                                        <p>
                                            <Translate content="label.headline.water" />
                                        </p>
                                    }
                                    {this.renderParametersList()}
                                    {!embedMode &&
                                        <p className="help-text">
                                            <Translate content="label.filter.instructions.water" />
                                        </p>
                                    }
                                </div>
                            }
                            {(this.state.activeParameterName.length > 0) &&
                                <div>
                                    {this.renderParameterSelect()}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParametersFilter;
