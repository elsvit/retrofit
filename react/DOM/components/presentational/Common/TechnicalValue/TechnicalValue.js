import _ from 'lodash';

const TechnicalValue = (function a() {
    /**
     * Helper function to get correctly rounded values for view
     *
     * @param value
     * @returns {*}
     */
    function getRoundedValue(value) {
        if (!value || value <= 0) {
            return '';
        }

        let resultValue = _.round(value, 3);

        if (value >= 10) {
            resultValue = _.round(value, 0);
        } else if (value >= 1 && value < 10) {
            resultValue = _.round(value, 1);
        }

        return resultValue;
    }

    return {
        getRoundedValue
    };
});

export default TechnicalValue();

