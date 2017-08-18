import { expect } from 'chai';
import { SimpleAppStateMerger as merger } from '../../utils/index';

describe('Utils.SimpleAppStateMerger', () => {
    describe('with empty state node overwriting list', () => {
        it('should not merge newState into oldState', () => {
            const oldState = {x: 0, y: 0};
            const newState = {y: 42};

            expect(merger(oldState, newState)).to.deep.equal({x: 0, y: 42});
        });

        it('should not convert arrays to objects', () => {
            const oldState = {};
            const newState = {arr: [1, 2]};

            expect(merger(oldState, newState)).to.deep.equal({arr: [1, 2]});
        });

        it('should not overwrite changed arrays', () => {
            const oldState = {arr: [1, 2]};
            const newState = {arr: [3, 4]};

            expect(merger(oldState, newState)).to.deep.equal({arr: [3, 4]});
        });
    });

    describe('with certain state node overwriting list', () => {
        it('should merge newState into oldState with overwriting only certain state node', () => {
            const oldState = {x: 0, y: 0};
            const newState = {x: 10, y: 42};
            const overwriteNodes = ['y'];

            expect(merger(oldState, newState, overwriteNodes)).to.deep.equal({x: 0, y: 42});
        });

        it('should merge node from new state if the node is not in old state and the node is in node list exceptions', () => {
            const oldState = {arr1: [1, 2]};
            const newState = {arr2: [3, 4]};
            const overwriteNodes = ['arr2'];

            expect(merger(oldState, newState, overwriteNodes)).to.deep.equal({arr1: [1, 2], arr2: [3, 4]});
        });

        it('should not overwrite changed array if it is in state node list exceptions', () => {
            const oldState = {arr1: [1, 2], arr2: [1, 2]};
            const newState = {arr2: [3, 4]};
            const overwriteNodes = ['arr2'];

            expect(merger(oldState, newState, overwriteNodes)).to.deep.equal({arr1: [1, 2], arr2: [3, 4]});
        });
    });
});
