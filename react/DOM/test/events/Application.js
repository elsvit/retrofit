import { expect } from 'chai';
import { default as ApplicationEvents } from '../../events/Application';

describe('ApplicationEvents', () => {
    describe('creators', () => {
        describe('loadStarted', () => {
            it('should create an action', () => {
                expect(ApplicationEvents.creators.loadStarted()).to.deep.equal({
                    type: ApplicationEvents.types.LOAD_STARTED
                });
            });
        });

        describe('loadFinished', () => {
            it('should create an action', () => {
                expect(ApplicationEvents.creators.loadFinished()).to.deep.equal({
                    type: ApplicationEvents.types.LOAD_FINISHED
                });
            });
        });

        describe('loadComponentStarted', () => {
            it('should create an action', () => {
                expect(ApplicationEvents.creators.loadComponentStarted()).to.deep.equal({
                    type: ApplicationEvents.types.LOAD_COMPONENT_STARTED
                });
            });
        });

        describe('loadComponentFinished', () => {
            it('should create an action', () => {
                expect(ApplicationEvents.creators.loadComponentFinished()).to.deep.equal({
                    type: ApplicationEvents.types.LOAD_COMPONENT_FINISHED
                });
            });
        });

        describe('errorHappened', () => {
            it('should create an action with error details as payload', () => {
                const header = 'Error happened!';
                const body = 'You should try your request later';
                const exceptionValue = 'ajax GET from /url failed';
                const expectedAction = {
                    type: ApplicationEvents.types.ERROR_HAPPENED,
                    error: true,
                    payload: { header, body, exceptionValue }
                };
                expect(
                    ApplicationEvents.creators.errorHappened(header, body, exceptionValue)
                ).to.deep.equal(expectedAction);
            });
        });
        describe('errorDelivered', () => {
            it('should create an action about error delivery', () => {
                const expectedAction = {
                    type: ApplicationEvents.types.ERROR_DELIVERED,
                    error: false,
                    payload: {}
                };
                expect(
                    ApplicationEvents.creators.errorDelivered()
                ).to.deep.equal(expectedAction);
            });
        });
    });
});
