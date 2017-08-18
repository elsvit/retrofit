import PropertyOptionsConfigurator from './PropertyOptionsConfigurator';

/**
 * @param propertiesData
 * Format:
 * {
 *      propertyName_1: {
 *          values: ['option_1.2'],
 *          options: [
 *              {
 *                  name: 'option_1.1',
 *                  enabled: boolean
 *              },
 *              {
 *                  name: 'option_1.2',
 *                  enabled: boolean
 *              }
 *          ]
 *      },
 *      ...
 * }
 * @return {{
 *              isPropertyValueSelected: (function(String, String)),
 *              selectPropertyValue: (function(String, String, Boolean=)),
 *              deSelectPropertyValue: (function(string, string)),
 *              togglePropertySelection: (function(String, String, Boolean=)),
 *              getPropertiesData: (function()), reset: (function())
 *          }}
 * @constructor
 */
const SmartPropertiesManager = (propertiesData) => {
    /**
     * @param {Object} propertiesData
     * @return {Array}
     * @private
     */
    const _populate = (propertiesData) => {
        return Object.keys(propertiesData).map((propertyName, index) => {
            const propertyData = propertiesData[propertyName];
            const options = (propertyData.options)
                ? propertyData.options.map((optionData, optionIndex) => {
                    const optionValues = propertyData.values;
                    const isSelected = (optionValues.indexOf(optionData.name) >= 0);
                    return new PropertyOption(optionData.name, optionData.enabled, isSelected);
                })
                : [];
            return new Property(propertyName, options);
        });
    };

    /**
     * @param propertyName
     * @return {Property}
     * @private
     */
    const _getPropertyByName = (propertyName) => {
        const filteredProperties = properties.filter((property) => {
            return (propertyName === property.getName());
        });
        return filteredProperties.shift();
    };

    /**
     * @param {Object} updatedPropertiesData
     * Format:
     * {
     *       propertyName_1: {
     *          values: ['option_1.2'],
     *          options: [
     *              {
     *                  name: 'option_1.1',
     *                  enabled: boolean
     *              },
     *              {
     *                  name: 'option_1.2',
     *                  enabled: boolean
     *              }
     *          ]
     *      },
     *      ...
     * }
     * @private
     */
    const _reconfigurePropertyOptions = (updatedPropertiesData) => {
        let propertiesWithValues = {};
        properties.filter((property) => {
            const propertyValues = property.getSelectedValues();
            if (propertyValues.length > 0) {
                propertiesWithValues[property.getName()] = propertyValues;
            }
        });

        if (Object.keys(propertiesWithValues).length === 0) {
            reset();
        } else {
            const updatedPropertyOptionsMap
                = optionsStateConfigurator.getPropertyOptionsMapByValues(propertiesWithValues, updatedPropertiesData);
            Object.keys(updatedPropertyOptionsMap).map((propertyName, index) => {
                const property = _getPropertyByName(propertyName);
                const optionsData = (updatedPropertyOptionsMap[propertyName].options)
                    ? updatedPropertyOptionsMap[propertyName].options
                    : [];
                optionsData.map((optionData, optionIndex) => {
                    const option = property.getOptionByName(optionData.name);
                    if (optionData.enabled === true) {
                        option.enable();
                    } else {
                        option.disable();
                        option.deselect();
                    }
                });
            });
        }
    };

    // @todo remove
    const _consoleProperties= (comment) => {
        console.log("===================================================================", comment);
        console.log('---1.properties');
        if (!properties) {
            console.log("properties don't exist");
            return;
        }
        properties.map((property, index) => {
            console.log('------2.property name', property.getName(), 'values:', property.getSelectedValues());
            property.getOptions().map((option, optionIndex) => {
                console.log('---------3.option', option.getName(), 'enabled:', option.isEnabled(), 'selected:', option.isSelected());
            });
        });
    };

    // convert properties data in properties objects
    let properties = _populate(propertiesData);

    // init configurator
    const _propertiesOptionsTreeMap = () => {
        return require('json!./options_to_tree_nodes_map.json');
    };

    const _tree = () => {
        return require('json!./tree.json');
    };

    const optionsStateConfigurator = PropertyOptionsConfigurator;
    optionsStateConfigurator.init(_propertiesOptionsTreeMap(), _tree());

    // public interface
    /**
     * @param {String} propertyName
     * @param {String} optionValue
     * @param {Boolean} force
     */
    const selectPropertyValue = (propertyName, optionValue, force = false) => {
        const selectingProperty = _getPropertyByName(propertyName);

        if (selectingProperty.canSelectValue(optionValue) === false && force === true) {
            // @todo refactor this
            const _handlePropertyForSelection = (property) => {
                const selectedValues = property.getSelectedValues();
                if (selectedValues.length > 0) {
                    property.reset();
                    _reconfigurePropertyOptions(getPropertiesData());
                }
            };

            _handlePropertyForSelection(selectingProperty);
            selectingProperty.selectValue(optionValue);

            properties.forEach((handlingProperty, index) => {
                if (handlingProperty.getName() !== propertyName
                    && (
                        (selectingProperty.canSelectValue(optionValue) === false)
                        || handlingProperty.hasDisabledSelectedValues() === true
                    )
                )
                {
                    handlingProperty.reset();
                    _reconfigurePropertyOptions(getPropertiesData());
                }
            });
        }

        selectingProperty.selectValue(optionValue);
        _reconfigurePropertyOptions(getPropertiesData());
    };

    /**
     * @param {string} propertyName
     * @param {string} optionValue
     */
    const deSelectPropertyValue = (propertyName, optionValue) => {
        properties = properties.map((property, index) => {
            if (propertyName === property.getName()) {
                property.resetValue(optionValue);
            }
            return property;
        });

        _reconfigurePropertyOptions(getPropertiesData());
    };

    /**
     * @param {String} propertyName
     * @param {String} optionValue
     * @returns {boolean}
     */
    const isPropertyValueSelected = (propertyName, optionValue) => {
        const property = _getPropertyByName(propertyName);
        return (property.getSelectedValues().indexOf(optionValue) >= 0);
    };

    /**
     * @param {String} propertyName
     * @param {String} optionValue
     * @param {Boolean} force
     */
    const togglePropertySelection = (propertyName, optionValue, force = false) => {
        if (isPropertyValueSelected(propertyName, optionValue)) {
            deSelectPropertyValue(propertyName, optionValue);
        } else {
            selectPropertyValue(propertyName, optionValue, force);
        }
    };

    /**
     * @returns {{}}
     * Format:
     * {
     *       propertyName_1: {
     *          values: ['option_1.2'],
     *          options: [
     *              {
     *                  name: 'option_1.1',
     *                  enabled: boolean
     *              },
     *              {
     *                  name: 'option_1.2',
     *                  enabled: boolean
     *              }
     *          ]
     *      },
     *      ...
     * }
     */
    const getPropertiesData = () => {
        let data = {};
        properties.map((property, index) => {
            let optionsData = [];
            const propertyOptions = property.getOptions();
            propertyOptions.map((option, optionIndex) => {
                optionsData.push({
                    'name': option.getName(),
                    'enabled': option.isEnabled()
                });
            });
            const propertyName = property.getName();
            const propertyValues = property.getSelectedValues();
            data[propertyName] = {
                'values': propertyValues,
                'options': optionsData
            };
            optionsData = [];
        });

        return data;
    };

    const reset = () => {
        properties = properties.map((property, index) => {
            property.reset();
            return property;
        });
    };

    return {
        isPropertyValueSelected: isPropertyValueSelected,
        selectPropertyValue: selectPropertyValue,
        deSelectPropertyValue: deSelectPropertyValue,
        togglePropertySelection: togglePropertySelection,
        getPropertiesData: getPropertiesData,
        reset: reset,
    };
};

/**
 * @param {String} name
 * @param {PropertyOption[]} options
 * @returns {{
 *              getName: (function()),
 *              getOptions: (function()),
 *              getOptionByName: (function(*)),
 *              getSelectedValues: (function()),
 *              canSelectValue: (function(*)),
 *              selectValue: (function(*)),
 *              resetValue: (function(*))
 *          }}
 * @constructor
 */
export const Property = (name, options) => {
    let _name = name;
    let _options = options;

    /**
     * @param {String} optionName
     * @returns {PropertyOption}
     */
    const getOptionByName = (optionName) => {
        return (_options.filter((option) => {
            return (optionName === option.getName());
        })).shift();
    };

    return {
        /**
         * @returns {String}
         */
        getName: () => {
            return _name;
        },
        /**
         * @returns {PropertyOption[]}
         */
        getOptions: () => {
            return _options;
        },
        getOptionByName: getOptionByName,
        /**
         * @returns {Array}
         */
        getSelectedValues: () => {
            return (_options.filter((option) => {
                return (option.isSelected() === true);
            })).map((option, index) => {
                return option.getName();
            });
        },
        /**
         * @param {String} value
         * @return {Boolean}
         */
        canSelectValue: (value) => {
            const option = getOptionByName(value);
            return (option.isEnabled());
        },
        /**
         * @return {Boolean}
         */
        hasDisabledSelectedValues: () => {
            return (_options.filter((option) => {
                return (option.isEnabled() === false && option.isSelected() === true);
            })).length > 0;
        },
        /**
         * @param {String} value
         */
        selectValue: (value) => {
            _options = _options.map((option, index) => {
                if (option.getName() === value && option.isEnabled() === true) {
                    option.select();
                }
                return option;
            });
        },
        /**
         * @param {String} value
         */
        resetValue: (value) => {
            _options = _options.map((option, index) => {
                if (option.getName() === value) {
                    option.deselect();
                }
                return option;
            });
        },
        reset: () => {
            _options = _options.map((option, index) => {
                option.deselect();
                option.enable();
                return option;
            });
        },
    };
};

/**
 * @param {String} name
 * @param {Boolean} enabled
 * @param {Boolean} selected
 * @returns {{
 *              getName: (function()),
 *              isEnabled: (function()),
 *              isSelected: (function()),
 *              enable: (function()),
 *              disable: (function()),
 *              select: (function()),
 *              deselect: (function())
 *          }}
 * @constructor
 */
export const PropertyOption = (name, enabled, selected) => {
    let _name = name;
    let _enabled = enabled;
    let _selected = selected;

    return {
        /**
         * @returns {String}
         */
        getName: () => {
            return _name;
        },
        /**
         * @returns {boolean}
         */
        isEnabled: () => {
            return _enabled;
        },
        /**
         * @returns {boolean}
         */
        isSelected: () => {
            return _selected;
        },
        enable: () => {
            _enabled = true;
        },
        disable: () => {
            _enabled = false;
        },
        select: () => {
            _selected = true;
        },
        deselect: () => {
            _selected = false;
        }
    };
};

export default SmartPropertiesManager;
