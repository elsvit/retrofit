import React, { PropTypes } from 'react';
import _ from 'lodash';
import Translate from 'react-translate-component';
import { DNSelectionItem } from './index';

const INITIAL_SLIDER_WIDTH = '1000%';

/**
 * How to display structure with DNSelectionSlider
 */
class DNSelectionSlider extends React.Component {

    constructor(props) {
        super(props);
        this.state = { sliderWidth: INITIAL_SLIDER_WIDTH };
        this.sliderWidth = 0;
    }

    /* eslint-disable react/no-did-mount-set-state */
    componentDidMount() {
        this.setState({ sliderWidth: this.sliderWidth + 'px' });
    }

    render() {
        const { matchingItems, activeMatchingItem, error,
            onChangeActiveMatchingHandler, pressureDefinition } = this.props;
        const flowLabel = (pressureDefinition === 'pressure_dependent') ? 'kvs' : 'vnom';

        let activeItemIndex = _.findIndex(matchingItems, activeMatchingItem);
        if (activeItemIndex < 0) {
            activeItemIndex = 0;
        }

        const addToSliderWidth = elem => {
            if (elem && this.state.sliderWidth === INITIAL_SLIDER_WIDTH) {
                this.sliderWidth += elem.clientWidth;
            }
        };

        const items = matchingItems.map((item, index) =>
            <DNSelectionItem
                key={index}
                item={item}
                isActive={(activeItemIndex === index)}
                onClickHandler={() => onChangeActiveMatchingHandler(index)}
                flowLabel={flowLabel}
                domRef={el => addToSliderWidth(el)}
            />
        );

        return (
            <div className="two column row dn-selector__tool">
                <div className="dn-selection-list sixteen wide column">
                    {(_.isEmpty(matchingItems)) ? (
                        <div>
                            {(error) ? (
                                <Translate {...error} content={'valve-sizer.error.actuators_filter.' + error.message} />
                            ) : (
                                <Translate content={"valve-sizer.error.actuators_filter.dn_selections_not_found"} />
                            )}
                        </div>
                    ) : (
                        <div className="slider-container">

                            <div className="rule-slider">
                                <form style={{ width: this.state.sliderWidth }}>
                                    {items}
                                </form>
                            </div>
                        </div>

                    )}
                </div>
            </div>
        );
    }
}

DNSelectionSlider.propTypes = {
    matchingItems: PropTypes.array.isRequired,
    activeMatchingItem: PropTypes.object.isRequired,
    error: PropTypes.object,
    onChangeActiveMatchingHandler: PropTypes.func.isRequired,
    pressureDefinition: PropTypes.string.isRequired
};

export default DNSelectionSlider;
