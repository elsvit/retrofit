import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { Combinations as CombinationsPresentation } from './../../../../../components/presentational/ValveSizer/index';

function shallowRenderClipPosition(position) {
    return shallow(<CombinationsPresentation.ClipPosition position={position} />);
}

describe('Components.ValveSizer.Combinations', () => {
    describe('<ClipPosition />', () => {
        it('should render one image', () => {
            const position = '0';
            const wrapper = shallowRenderClipPosition(position);
            expect(wrapper.find('img')).to.have.length(1);
        });

        const pathToImages = '/images/clip_position/';
        const imageSrcTests = [
            {
                position: '0',
                src: `${pathToImages}noclip.png`
            },
            {
                position: '1',
                src: `${pathToImages}clip1.png`
            },
            {
                position: 'N',
                src: `${pathToImages}clipN.png`
            }
        ];
        imageSrcTests.forEach((test) => {
            it(`should render img with required src on clip position = ${test.position}`, () => {
                const wrapper = shallowRenderClipPosition(test.position);
                expect(wrapper.find('img').props().src).to.be.equal(test.src);
            });
        });
    });
});
