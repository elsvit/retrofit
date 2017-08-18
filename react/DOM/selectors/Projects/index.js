import { createSelector } from '../../store/index';

/**
 * Reselect over Projects of current deviceMode
 */
export default (applicationName) => {
    return createSelector(
        [
            state => state.Projects[applicationName].list,
            state => state.Projects[applicationName].productsBuffer
        ],
        (ProjectsState, ProjectsProductsBufferState) => ({
            projects: ProjectsState,
            productsBuffer: ProjectsProductsBufferState
        })
    );
};
