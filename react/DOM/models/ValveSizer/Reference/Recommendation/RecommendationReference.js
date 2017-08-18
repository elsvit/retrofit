// libraries
import { default as log } from 'loglevel';
import _ from 'lodash';
import { FlowReference } from './../index';
// constants
import * as constants from './RecommendationConstants';
// exceptions
import * as exceptions from './RecommendationReferenceExceptions';
import ValveClipPositionReference from '../ValveClipPositionReference';

let RecommendationReference = (function () {
    let ruleSet = 0;
    let parameters = {
        kv: null,
        vMax: null,
        flowUnit: 'm3_h',
        valveConnection: null
    };

    return {
        setRuleSet: setRuleSet,
        getRuleSet: getRuleSet,
        setParameters: setParameters,
        getParameters: getParameters,
        apply: apply
    };

    /**
     * @param {Number} value
     * @returns {Object}
     */
    function setRuleSet (value) {
        ruleSet = value;
        log.debug('MatchingListHandler - setRuleSet:', ruleSet);
        return this;
    }

    /**
     * @returns {Number}
     */
    function getRuleSet () {
        return ruleSet;
    }

    /**
     * @param {Object} values
     * @returns {Object}
     */
    function setParameters (values) {
        for (let parameter in values) {
            if (parameters.hasOwnProperty(parameter)) {
                parameters[parameter] = values[parameter];
            }
        }
        log.debug('MatchingListHandler - setParameters:', parameters);
        return this;
    }

    /**
     * @returns {Object}
     */
    function getParameters () {
        return parameters;
    }

    /**
     * Main filter method.
     * @param {Array} items
     * @returns {Array}
     */
    function apply (items) {
        log.debug('MatchingListHandler - apply');
        let resultItems = {};
        switch (ruleSet) {
            case 1:
                resultItems = _applyRuleSetOne(items);
                break;

            case 2:
                resultItems = _applyRuleSetTwo(items);
                break;

            case 3:
                resultItems = _applyRuleSetThree(items);
                break;

            case 4:
                resultItems = _applyRuleSetFour(items);
                break;

            default:
                resultItems = items;
                break;
        }
        return resultItems;
    }

    /**
     * @param {Array} items
     * @returns {Array}
     * @private
     */
    function _applyRuleSetOne(items) {
        let kv = parameters.kv;
        if (!kv) {
            return items;
        }

        log.debug('MatchingListHandler - _applyRuleSetOne to items', items);

        let kvsList = _findKvsFittingItems(items, kv);

        let resultItems = kvsList.items;

        // Decide which item to preselect
        for (let item of resultItems) {
            if (kvsList.default && item.kvs == kvsList.default.kvs && item.dn == kvsList.default.dn) {
                item.recommendedStatus = constants.RECOMMENDATION_STATUS_ABSOLUTELY;
            }
        }

        log.debug('MatchingListHandler - _applyRuleSetOne result:', resultItems);

        return resultItems;
    }

    /**
     * @param {Array} items
     * @returns {Array}
     * @private
     */
    function _applyRuleSetTwo(items) {
        let kv = parameters.kv;
        kv = FlowReference.convert(kv, parameters.flowUnit);
        let valveConnection = parameters.valveConnection;
        if (!kv || !valveConnection) {
            return items;
        }

        items = items.filter(item => {
            const clipPosition = ValveClipPositionReference.getByTitleAndKv(item, kv);
            const kvs = clipPosition ? clipPosition.kv : FlowReference.convert(item.kvs, parameters.flowUnit);
            return kvs >= kv / 1.7 && kvs <= kv * 1.7
        });

        log.debug('MatchingListHandler - _applyRuleSetTwo to items', items);
        let lowAndHighList = _findLowAndHighKvs(items, kv);

        if (!lowAndHighList.low && !lowAndHighList.high) {
            return items;
        }

        let kvsLow = 0;
        if (!lowAndHighList.low) {
            kvsLow = lowAndHighList.high.kvs;
        } else {
            kvsLow = lowAndHighList.low.kvs;
        }

        let kvsHigh = 0;
        if (!lowAndHighList.high) {
            kvsHigh = lowAndHighList.low.kvs;
        } else {
            kvsHigh = lowAndHighList.high.kvs;
        }

        let kvsMean = _calculateKvsMean(kvsLow, kvsHigh, valveConnection);

        log.debug('MatchingListHandler - calculate kvsMean:', kvsMean);

        if (lowAndHighList.high) {
            lowAndHighList.high.recommendedStatus = (kv > kvsMean)
                ? constants.RECOMMENDATION_STATUS_ABSOLUTELY : constants.RECOMMENDATION_STATUS_CONDITIONALLY;
        }

        if (lowAndHighList.low) {
            lowAndHighList.low.recommendedStatus = (kv <= kvsMean)
                ? constants.RECOMMENDATION_STATUS_ABSOLUTELY : constants.RECOMMENDATION_STATUS_CONDITIONALLY;
        }

        let resultItems = [];
        if (lowAndHighList.low) {
            resultItems.push(lowAndHighList.low);
        }
        if (lowAndHighList.inBetween.length > 0) {
            resultItems = resultItems.concat(lowAndHighList.inBetween);
        }

        if (lowAndHighList.high) {
            resultItems.push(lowAndHighList.high);
        }

        log.debug('MatchingListHandler - _applyRuleSetTwo result:', resultItems);

        return resultItems;
    }

    /**
     * @param {Array} items
     * @returns {Array}
     * @private
     */
    function _applyRuleSetThree(items) {

        let vMax = parameters.vMax;
        let flowUnit = parameters.flowUnit;
        if (!vMax || items.length === 0) {
            return items;
        }
        log.debug('MatchingListHandler - _applyRuleSetThree', items);

        // check if Vmax has valid value
        let minVnom = Math.min.apply(Math, items.map(function(valve){return valve.kvs;})) * 0.3;
        let maxVnom = Math.max.apply(Math, items.map(function(valve){return valve.kvs;}));

        log.debug('MatchingListHandler - _applyRuleSetThree. Min Vnom:', minVnom, 'Max Vnom:', maxVnom, 'Vmax:', vMax);


        let functioningVnomMin = null;
        function replaceVnomMin(currentValue, newValue) {
            if (null === currentValue) {
                return newValue;
            }
            if (currentValue < newValue) {
                return currentValue;
            }
            return newValue;
        }

        let functioningVnomMax = null;
        function replaceVnomMax(currentValue, newValue) {
            if (null === currentValue) {
                return newValue;
            }

            if (currentValue > newValue) {
                return currentValue;
            }
            return newValue;
        }

        // filter items by special rule
        log.debug('MatchingListHandler - _applyRuleSetThree. Filter items');
        let resultItems = [];
        for (let item of items) {
            let vNom = item.kvs;
            let dn = _.toInteger(item.dn);
            if (dn == 15) {
                if (vMax >= (vNom * 0.3) && vMax <= vNom) {
                    item.recommendedStatus = constants.RECOMMENDATION_STATUS_ABSOLUTELY;
                    resultItems.push(item);
                } else {
                    functioningVnomMin = replaceVnomMin(functioningVnomMin, vNom * 0.3);
                    functioningVnomMax = replaceVnomMax(functioningVnomMax, vNom);
                }
            }
            if (dn >= 20 && dn <= 50) {
                if (vMax >= (vNom * 0.3) && vMax < (vNom * 0.5)) {
                    item.recommendedStatus = constants.RECOMMENDATION_STATUS_CONDITIONALLY;
                    resultItems.push(item);
                } else {
                    functioningVnomMin = replaceVnomMin(functioningVnomMin, vNom * 0.3);
                    functioningVnomMax = replaceVnomMax(functioningVnomMax, vNom * 0.5);
                }


                if (vMax >= (vNom * 0.5) && vMax <= vNom) {
                    item.recommendedStatus = constants.RECOMMENDATION_STATUS_ABSOLUTELY;
                    resultItems.push(item);
                } else {
                    functioningVnomMin = replaceVnomMin(functioningVnomMin, vNom * 0.5);
                    functioningVnomMax = replaceVnomMax(functioningVnomMax, vNom);
                }
            }
            if (dn >= 65 && dn <= 150) {
                if (vMax >= (vNom * 0.45) && vMax < (vNom * 0.6)) {
                    item.recommendedStatus = constants.RECOMMENDATION_STATUS_CONDITIONALLY;
                    resultItems.push(item);
                } else {
                    functioningVnomMin = replaceVnomMin(functioningVnomMin, vNom * 0.45);
                    functioningVnomMax = replaceVnomMax(functioningVnomMax, vNom * 0.6);
                }

                if (vMax >= (vNom * 0.6) && vMax <= vNom) {
                    item.recommendedStatus = constants.RECOMMENDATION_STATUS_ABSOLUTELY;
                    resultItems.push(item);
                } else {
                    functioningVnomMin = replaceVnomMin(functioningVnomMin, vNom * 0.6);
                    functioningVnomMax = replaceVnomMax(functioningVnomMax, vNom);
                }
            }
        }

        // Just to be sure we don't produce null values
        if (null === functioningVnomMin) {
            functioningVnomMin = minVnom;
        }

        if (null === functioningVnomMax) {
            functioningVnomMax = maxVnom;
        }

        if (resultItems.length === 0) {
            throw exceptions.NotValidVMaxForRulesetException(
                _.round(functioningVnomMin, functioningVnomMin < 10 ? 3 : 0),
                _.round(functioningVnomMax, functioningVnomMax < 10 ? 3 : 0)
            );
        }

        return resultItems;
    }

    /**
     * @param {Array} items
     * @returns {Array}
     * @private
     */
    function _applyRuleSetFour(items) {
        let vMax = parameters.vMax;
        let flowUnit = parameters.flowUnit;
        if (!vMax) {
            return items;
        }

        const minV = ValveClipPositionReference.getMinOfVmax();
        const maxV = ValveClipPositionReference.getMaxOfVmax();

        vMax = FlowReference.convert(vMax, flowUnit, 'l_h');
        log.debug('MatchingListHandler - _applyRuleSetFour. Vmax:', vMax, 'flowUnit:', flowUnit, 'Items: ', items);
        if (vMax < minV || vMax > maxV) {
            throw exceptions.NotValidVMaxForRulesetException(
                _.round(FlowReference.convert(minV, 'l_h', flowUnit), 3),
                _.round(FlowReference.convert(maxV, 'l_h', flowUnit), 3)
            );
        }

        // filter items by special rule
        log.debug('MatchingListHandler - _applyRuleSetFour. Filter items');
        let resultItems = [];
        for (let item of items) {
            if (vMax <= item.vNom && vMax >= item.vPosMax1) {
                item.recommendedStatus = (vMax > item.vPosMax2 && item.vPosMax3 > item.vPosMax2)
                    ? constants.RECOMMENDATION_STATUS_ABSOLUTELY
                    : constants.RECOMMENDATION_STATUS_CONDITIONALLY;
                resultItems.push(item);
            }
        }
        log.debug('MatchingListHandler - _applyRuleSetFour. Filtered items', resultItems);

        if (resultItems.length === 0) {
            throw exceptions.NotValidVMaxForRulesetException(
                _.round(FlowReference.convert(minV, 'l_h', flowUnit), 3),
                _.round(FlowReference.convert(maxV, 'l_h', flowUnit), 3)
            );
        }

        return resultItems;
    }

    /**
     * Alternative search for fittings (1.75 factor applied)
     *
     * @param items
     * @param kv
     * @returns {{default: null, items: Array}}
     * @private
     */
    function _findKvsFittingItems(items, kv) {
        let kvLow = kv / 1.7;
        let kvHigh = kv * 1.7;

        let collectedItems = [];
        let defaultItem = null;

        // Iterate through all items and collect fitting
        for (let item of items) {
            if (item.kvs >= kvLow && item.kvs <= kvHigh) {
                collectedItems.push(item);

                let itemDistance = Math.abs(item.kvs - kv);

                // Select the default item by checking for kv distance
                if (defaultItem == null || itemDistance < (Math.abs(defaultItem.kvs - kv)) ) {
                    defaultItem = item;
                }
            }
        }

        let recommendedItems = {
            default: defaultItem,
            items: collectedItems
        };

        return recommendedItems;
    }

    /**
     * Find neighbours by kv value in matching items list.
     * @param {Array} items
     * @param {Number} kv
     * @returns {{low: {Object}, high: {Object}, inBetween: Array}}
     * @private
     */
    function _findLowAndHighKvs(items, kv) {
        let prevNeighbourItem = null;
        let nextNeighbourItem = null;
        let inBetweenItems = [];

        for (let item of items) {
            if (item.kvs <= kv) {
                // Set reference to first item or move to the next higher kvs value
                if (!prevNeighbourItem ) {
                    prevNeighbourItem = item;
                    inBetweenItems = [];
                } else if (item.kvs > prevNeighbourItem.kvs) {
                    prevNeighbourItem = item;
                    inBetweenItems = [];
                }

                // Collect items with the same kvs value
                if ( item.kvs === prevNeighbourItem.kvs && item.dn != prevNeighbourItem.dn) {
                    inBetweenItems.push(item);
                }
            }
            if (item.kvs > kv) {
                if (!nextNeighbourItem) {
                    nextNeighbourItem = item;
                } else if (item.kvs < nextNeighbourItem.kvs) {
                    nextNeighbourItem = item;
                } else if (!prevNeighbourItem && nextNeighbourItem) {
                    prevNeighbourItem = nextNeighbourItem;
                    nextNeighbourItem = item;
                }
            }
        }

        let lowAndHighKvs = {
            low: prevNeighbourItem,
            high: nextNeighbourItem,
            inBetween: inBetweenItems
        };

        log.debug('MatchingListHandler - _findLowAndHighKvs:', lowAndHighKvs);
        return lowAndHighKvs;
    }

    /**
     * Calculate kvs mean depending on valve connection (series "pipe_connector_count" property from DB).
     * @param {Number} kvsLow
     * @param {Number} kvsHigh
     * @param {Number} valveConnection
     * @returns {number}
     */
    function _calculateKvsMean(kvsLow, kvsHigh, valveConnection) {
        let kvsMean = 0;
        let kvsMeanBase = (kvsLow + kvsHigh) / 2;
        switch (valveConnection) {
            case 2:
                kvsMean = kvsMeanBase * 1.02;
                break;
            case 3:
                kvsMean = kvsMeanBase * 0.98;
                break;
            default:
                break;
        }
        return kvsMean;
    }
});

export default RecommendationReference();
