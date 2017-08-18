import { expect } from 'chai';
import { default as AJAXEvents } from '../../events/AJAX';

describe('AJAXEvents', () => {
    describe('creators', () => {
        describe('request', () => {
            it('should create an action with request parameters as payload', () => {
                const id = 'some_hash';
                const method = 'POST';
                const url = '/data/myitem/10';
                const headers = {
                    Accept: 'application/json, text/plain, */*'
                };
                const body = '[{"frontend_id":{"id":"10","title":"new title for my item"}}]';
                const expectedAction = {
                    type: AJAXEvents.types.REQUEST,
                    error: false,
                    payload: { id, method, url, headers, body }
                };
                expect(
                    AJAXEvents.creators.request(id, method, url, headers, body)
                ).to.deep.equal(expectedAction);
            });
        });

        describe('response', () => {
            it('should create an action with response details as payload', () => {
                const id = 'some_hash';
                const headers = {
                    'Content-Type': 'application/json'
                };
                const body = '[{"frontend_id":"10"}]';
                const expectedAction = {
                    type: AJAXEvents.types.RESPONSE,
                    error: false,
                    payload: { id, headers, body }
                };
                expect(
                    AJAXEvents.creators.response(id, headers, body)
                ).to.deep.equal(expectedAction);
            });
        });

        describe('error', () => {
            it('should create an action with error details as payload', () => {
                const id = 'some_hash';
                const headers = {
                    'Content-Type': 'application/json'
                };
                const body = '[]';
                const expectedAction = {
                    type: AJAXEvents.types.ERROR,
                    error: true,
                    payload: { id, headers, body }
                };
                expect(
                    AJAXEvents.creators.error(id, headers, body)
                ).to.deep.equal(expectedAction);
            });
        });
    });
});
