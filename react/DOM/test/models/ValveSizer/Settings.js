// libraries
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
// models factory
import { default as SettingsModel } from './../../../models/ValveSizer/Settings';
// import { default as UserModel } from './../../../models/User';
// events
import { Settings as SettingsEvents } from './../../../events/ValveSizer/index';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Models.ValveSizer.Settings', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            ValveSizer: {
                Settings: {
                    flow_unit: '',
                    pressure_unit: ''
                }
            }
        });
    });

    it('set locale', () => {
        const locale = 'de_CH';
        let userModel = { setLocale: (l) => {} };
        let userSetLocaleSpy = sinon.spy(userModel, 'setLocale');
        userSetLocaleSpy.withArgs(locale);

        const settingsModel = new SettingsModel(store.dispatch, userModel);
        settingsModel.locale = locale;

        expect(userSetLocaleSpy.withArgs(locale).calledOnce);
    });

    it('set flow unit', () => {
        const userModel = sinon.stub();
        const settingsModel = new SettingsModel(store.dispatch, userModel);

        settingsModel.flowUnit = 'm3_h';

        const expectedEvents = [
            { type: SettingsEvents.types.FLOW_UNIT, payload: { value: 'm3_h' } },
        ];

        expect(store.getActions()).to.deep.equal(expectedEvents);
    });

    it('set pressure unit', () => {
        const userModel = sinon.stub();
        const settingsModel = new SettingsModel(store.dispatch, userModel);

        settingsModel.pressureUnit = 'bar';

        const expectedEvents = [
            { type: SettingsEvents.types.PRESSURE_UNIT, payload: { value: 'bar' } },
        ];

        expect(store.getActions()).to.deep.equal(expectedEvents);
    });
});
