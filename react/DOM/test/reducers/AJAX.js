// libraries
import { expect } from 'chai';
// reducers
import { default as AjaxReducer } from './../../reducers/AJAX';
// events
import { default as Ev } from './../../events/AJAX';

describe('Reducers.AJAX', () => {
    const defaultState = {
        isLoading: false,
        isError: false,
        method: '',
        url: '',
        request: {
            headers: {},
            body: {}
        },
        response: {
            headers: {},
            body: {}
        },
    };

    it('should return the initial state', () => {
        expect(
            AjaxReducer(undefined, {})
        ).to.deep.equal(defaultState);
    });

    it('should handle REQUEST', () => {
        expect(
            AjaxReducer(undefined, Ev.creators.request(1, 'GET', 'google.com'))
        ).to.deep.equal({
            isLoading: true,
            isError: false,
            method: 'GET',
            url: 'google.com',
            request: {
                headers: {},
                body: undefined
            },
            response: {
                headers: {},
                body: {}
            }
        });
    });

    it('should handle RESPONSE', () => {
        expect(
            AjaxReducer(undefined, Ev.creators.response(1, 'headers', 'body'))
        ).to.deep.equal({
            isLoading: false,
            isError: false,
            method: '',
            url: '',
            request: {
                headers: {},
                body: {}
            },
            response: {
                headers: 'headers',
                body: 'body'
            }
        });
    });

    it('should handle ERROR', () => {
        expect(
            AjaxReducer(undefined, Ev.creators.error(1, 'headers', 'body'))
        ).to.deep.equal({
            isLoading: false,
            isError: true,
            method: '',
            url: '',
            request: {
                headers: {},
                body: {}
            },
            response: {
                headers: 'headers',
                body: 'body'
            }
        });
    });
});
