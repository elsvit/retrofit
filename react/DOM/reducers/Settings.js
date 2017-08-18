import { handleActions } from 'redux-actions';
import * as actions from '../actions/Settings';
import TargetMarket from '../utils/targetMarket';

export default handleActions({
    [actions.SETTINGS_STORE_TARGET_MARKET]: (state, action) => ({
        ...state,
        targetMarket: {
            region: action.payload.region,
            language: action.payload.language
        }
    })
}, {
    targetMarket: {
        region: TargetMarket.DEFAULT_REGION,
        language: TargetMarket.DEFAULT_LANGUAGE
    }
});
