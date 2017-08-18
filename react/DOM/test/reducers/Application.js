// libraries
import { expect } from 'chai';
// reducers
import { default as ApplicationReducer } from './../../reducers/Application';
// events
import { default as events } from './../../events/Application';

describe('Reducers.Application', () => {
    const defaultState = {
        isLoading: false,
        isComponentLoading: false,
        isError: false,
        error: {
            header: '',
            body: ''
        },
    };

    it('should return the initial state', () => {
        expect(
            ApplicationReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle LOAD_STARTED', () => {
        expect(
            ApplicationReducer(undefined, events.creators.loadStarted())
        ).to.deep.equal({
            isLoading: true,
            isComponentLoading: false,
            isError: false,
            error: {
                header: '',
                body: ''
            },
        });
    });

    it('should handle LOAD_FINISHED', () => {
        expect(
            ApplicationReducer(undefined, events.creators.loadFinished())
        ).to.deep.equal({
            isLoading: false,
            isComponentLoading: false,
            isError: false,
            error: {
                header: '',
                body: ''
            },
        });
    });

    it('should handle LOAD_COMPONENT_STARTED', () => {
        expect(
            ApplicationReducer(undefined, events.creators.loadComponentStarted())
        ).to.deep.equal({
            isLoading: false,
            isComponentLoading: true,
            isError: false,
            error: {
                header: '',
                body: ''
            },
        });
    });

    it('should handle LOAD_COMPONENT_FINISHED', () => {
        expect(
            ApplicationReducer(undefined, events.creators.loadComponentFinished())
        ).to.deep.equal({
            isLoading: false,
            isComponentLoading: false,
            isError: false,
            error: {
                header: '',
                body: ''
            },
        });
    });

    it('should handle ERROR_HAPPENED', () => {
        const
            header = 'header',
            body = 'body',
            exceptionValue = 'exception';
        expect(
            ApplicationReducer(undefined, events.creators.errorHappened(header, body, exceptionValue))
        ).to.deep.equal({
            isLoading: false,
            isComponentLoading: false,
            isError: true,
            error: {
                header: 'header',
                body: 'body',
                exceptionValue: 'exception'
            },
        });
    });

    it('should handle ERROR_DELIVERED', () => {
        expect(
            ApplicationReducer(undefined, events.creators.errorDelivered())
        ).to.deep.equal({
            isLoading: false,
            isComponentLoading: false,
            isError: false,
            error: {
                header: '',
                body: ''
            },
        });
    });
});
