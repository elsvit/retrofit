import { default as Thunks } from './Thunks';
import { routerActions } from 'react-router-redux';

class Routing extends Thunks {
    /**
     * @param {String} path
     */
    pushPath(path) {
        this.storeDispatch((dispatch) => {
            dispatch(routerActions.push(path));
        });
    }
}

export default Routing;
