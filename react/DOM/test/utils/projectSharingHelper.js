import { expect } from 'chai';
import { getUniqueName } from '../../utils/projectSharingHelper';

describe('Utils.projectSharingHelper', () => {

    describe('getUniqueName', () => {

        const uniqueNameTests = [
            {
                name: 'project name',
                existedNames: [],
                expectedName: 'project name'
            },
            {
                name: 'project name',
                existedNames: ['project name'],
                expectedName: 'project name (1)'
            },
            {
                name: 'project name',
                existedNames: ['project name', 'project name (1)'],
                expectedName: 'project name (2)'
            }
        ];

        uniqueNameTests.forEach((test) => {
            it(`should return ${test.expectedName} if original name is "${test.name}" and existedNames are "${test.existedNames}"`, () => {
                expect(getUniqueName(test.name, test.existedNames)).to.be.equal(test.expectedName);
            });
        });

    });

});
