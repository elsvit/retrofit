// models
import { AbstractParameters } from '../index';
// actions
import { Data as DataActions } from '../../../actions/index';

/**
 * Class.
 * Business-logic & State reading/writing for "Originals" filtering in Retrofit
 */
class Parameters extends AbstractParameters {
    /**
     * @param {Function} dispatch
     * @param {Object} modesModel
     * @param {String} stateNamespace
     */
    constructor(dispatch, modesModel, stateNamespace = 'Retrofit.Originals.Parameters') {
        super(
            dispatch,
            modesModel,
            // Thunk creator. Resulting thunk should know how to load metadata for this object
            (innerModesModel, parameters) => innerDispatch => innerDispatch(
                DataActions.metadata(
                    'retrofit.' + innerModesModel.deviceMode + '.original',
                    parameters
                )
            ),
            stateNamespace
        );
    }
}

export default Parameters;
