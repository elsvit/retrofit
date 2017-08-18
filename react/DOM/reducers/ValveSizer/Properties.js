// libraries
import _ from 'lodash';
// events
import { ValveSizer as ValveSizerEvents } from '../../events/index';

const defaultState = {
    application: {
        values: [],
        options: [
            {
                name: 'pressure_independent',
                label: 'Druckunabhängig',
                enabled: true
            },
            {
                name: 'pressure_dependent',
                label: 'Druckabhängig',
                enabled: true
            }
        ]
    },
    ventilator: {
        values: [],
        options: [
            {
                name: 'control_valve',
                label: 'Regelventil',
                enabled: true
            },
            {
                name: 'shut_off_and_diverter_valve',
                label: 'Absperr- und Umschaltventil',
                enabled: true
            }
        ]
    },
    valve_connection: {
        values: [],
        options: [
            {
                name: 'internal_thread',
                label: 'Innengewinde',
                enabled: true
            },
            {
                name: 'external_thread',
                label: 'Aussengewinde',
                enabled: true
            },
            {
                name: 'flange',
                label: 'Flansch',
                enabled: true
            }
        ]
    },
    connections: {
        values: [],
        options: [
            {
                name: '2',
                label: '2',
                enabled: true
            },
            {
                name: '3',
                label: '3',
                enabled: true
            },
            {
                name: '6',
                label: '6',
                enabled: true
            }
        ]
    },
    pn_selections: {
        values: [],
        options: [
            {
                name: '6',
                label: '6',
                enabled: true
            },
            {
                name: '10',
                label: '10',
                enabled: true
            },
            {
                name: '16',
                label: '16',
                enabled: true
            },
            {
                name: '25',
                label: '25',
                enabled: true
            },
            {
                name: '40',
                label: '40',
                enabled: true
            }
        ]
    }
};

export default (state = defaultState, event = {}) => {
    let newState = _.cloneDeep(state);

    switch (event.type) {

        case ValveSizerEvents.Properties.types.VALUES:
            {
                newState[event.payload.section].values = event.payload.values;
            }
            break;

        case ValveSizerEvents.Properties.types.RESET:
            {
                newState = defaultState;
            }
            break;

        case ValveSizerEvents.Properties.types.OPTIONS:
            {
                _.forEach(event.payload.map, (property, key) => {
                    newState[key].options = property.options;
                });
            }
            break;

        case ValveSizerEvents.Properties.types.UPDATE_FILTER:
            {
                _.forEach(event.payload.filter, (property, propertyName) => {
                    newState[propertyName] = {
                        options: property.options,
                        values: property.values
                    };
                });
            }
            break;

        case ValveSizerEvents.Properties.types.RESET_FILTER:
            {
                newState = defaultState;
            }
            break;

        default:
            break;
    }

    return newState;
};
