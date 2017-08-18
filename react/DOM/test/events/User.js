import { expect } from 'chai';
import { default as UserEvents } from '../../events/User';

describe('Events.User', () => {
    describe('creators', () => {
        describe('identification', () => {
            it('should create an action with user id as payload', () => {
                const identifier = 'some_hash';
                const expectedAction = {
                    type: UserEvents.types.IDENTIFICATION,
                    payload: { identifier }
                };
                expect(UserEvents.creators.identification(identifier)).to.deep.equal(expectedAction);
            });
        });

        it('locale', () => {
            const locale = 'en';
            const expectedAction = {
                type: UserEvents.types.LOCALE,
                payload: { locale }
            };
            expect(UserEvents.creators.locale(locale)).to.deep.equal(expectedAction);
        });

        it('supportContacts', () => {
            const supportContacts = {

            };
            const expectedAction = {
                type: UserEvents.types.SUPPORT_CONTACTS,
                payload: { supportContacts }
            };
            expect(UserEvents.creators.supportContacts(supportContacts)).to.deep.equal(expectedAction);
        });
    });
});
