// libraries
import _ from 'lodash';
import log from 'loglevel';

const ValveClipPositionReference = (function () {
    const
        map = {
            'C215QPT?-B': [
                { vMax: 20, clipPosition: '1' },
                { vMax: 30, clipPosition: '2' },
                { vMax: 40, clipPosition: '3' },
                { vMax: 45, clipPosition: '3+' },
                { vMax: 50, clipPosition: '4-' },
                { vMax: 60, clipPosition: '4' },
                { vMax: 70, clipPosition: '4+' },
                { vMax: 80, clipPosition: '5-' },
                { vMax: 90, clipPosition: '5' },
                { vMax: 105, clipPosition: '5+' },
                { vMax: 120, clipPosition: '6-' },
                { vMax: 135, clipPosition: '6' },
                { vMax: 150, clipPosition: '6+' },
                { vMax: 165, clipPosition: 'N-' },
                { vMax: 180, clipPosition: 'N' },
                { vMax: 210, clipPosition: '0' },
            ],
            'C215QPT?-D': [
                { vMax: 50, clipPosition: '1' },
                { vMax: 70, clipPosition: '2' },
                { vMax: 100, clipPosition: '3' },
                { vMax: 110, clipPosition: '3+' },
                { vMax: 130, clipPosition: '4-' },
                { vMax: 150, clipPosition: '4' },
                { vMax: 170, clipPosition: '4+' },
                { vMax: 190, clipPosition: '5-' },
                { vMax: 210, clipPosition: '5' },
                { vMax: 240, clipPosition: '5+' },
                { vMax: 270, clipPosition: '6-' },
                { vMax: 300, clipPosition: '6' },
                { vMax: 330, clipPosition: '6+' },
                { vMax: 360, clipPosition: 'N-' },
                { vMax: 400, clipPosition: 'N' },
                { vMax: 420, clipPosition: '0' },
            ],
            'C220QPT?-F': [
                { vMax: 90, clipPosition: '1' },
                { vMax: 130, clipPosition: '2' },
                { vMax: 190, clipPosition: '3' },
                { vMax: 220, clipPosition: '3+' },
                { vMax: 250, clipPosition: '4-' },
                { vMax: 290, clipPosition: '4' },
                { vMax: 340, clipPosition: '4+' },
                { vMax: 390, clipPosition: '5-' },
                { vMax: 440, clipPosition: '5' },
                { vMax: 500, clipPosition: '5+' },
                { vMax: 570, clipPosition: '6-' },
                { vMax: 630, clipPosition: '6' },
                { vMax: 700, clipPosition: '6+' },
                { vMax: 760, clipPosition: 'N-' },
                { vMax: 820, clipPosition: 'N' },
                { vMax: 980, clipPosition: '0' },
            ],
            'C225QPT-G': [
                { vMax: 260, clipPosition: '1' },
                { vMax: 410, clipPosition: '2' },
                { vMax: 600, clipPosition: '3' },
                { vMax: 670, clipPosition: '3+' },
                { vMax: 750, clipPosition: '4-' },
                { vMax: 840, clipPosition: '4' },
                { vMax: 920, clipPosition: '4+' },
                { vMax: 1010, clipPosition: '5-' },
                { vMax: 1110, clipPosition: '5' },
                { vMax: 1210, clipPosition: '5+' },
                { vMax: 1310, clipPosition: '6-' },
                { vMax: 1420, clipPosition: '6' },
                { vMax: 1530, clipPosition: '6+' },
                { vMax: 1640, clipPosition: 'N-' },
                { vMax: 1750, clipPosition: 'N' },
                { vMax: 2100, clipPosition: '0' }
            ],
            'C215Q-J': [
                { vMax: 400, clipPosition: '1'},
                { vMax: 600, clipPosition: '2'},
                { vMax: 1000, clipPosition: '3'},
                { vMax: 1500, clipPosition: '4'},
                { vMax: 2000, clipPosition: '5'},
                { vMax: 2900, clipPosition: '6'},
                { vMax: 4000, clipPosition: 'N'}
            ],
            'C220Q-K': [
                { vMax: 500, clipPosition: '1'},
                { vMax: 800, clipPosition: '2'},
                { vMax: 1300, clipPosition: '3'},
                { vMax: 1900, clipPosition: '4'},
                { vMax: 2800, clipPosition: '5'},
                { vMax: 4000, clipPosition: '6'},
                { vMax: 5700, clipPosition: 'N'}
            ]
        };

    const
        mapKV = {
            'C215Q-J': [
                { kv: 0.4, clipPosition: '1'},
                { kv: 0.6, clipPosition: '2'},
                { kv: 1.0, clipPosition: '3'},
                { kv: 1.5, clipPosition: '4'},
                { kv: 2.0, clipPosition: '5'},
                { kv: 2.9, clipPosition: '6'},
                { kv: 4.0, clipPosition: 'N'},
                { kv: 4.8, clipPosition: '0'}
            ],
            'C220Q-K': [
                { kv: 0.5, clipPosition: '1'},
                { kv: 0.8, clipPosition: '2'},
                { kv: 1.3, clipPosition: '3'},
                { kv: 1.9, clipPosition: '4'},
                { kv: 2.8, clipPosition: '5'},
                { kv: 4.0, clipPosition: '6'},
                { kv: 5.7, clipPosition: 'N'},
                { kv: 8.0, clipPosition: '0'}
            ],
            'C215Q-F': [
                { kv: 0.09, clipPosition: '1' },
                { kv: 0.14, clipPosition: '2' },
                { kv: 0.2, clipPosition: '3' },
                { kv: 0.3, clipPosition: '4' },
                { kv: 0.48, clipPosition: '5' },
                { kv: 0.72, clipPosition: '6' },
                { kv: 1, clipPosition: 'N' },
                { kv: 1.2, clipPosition: '0' }
            ]
        };

    return {
        getByTitleAndKv,
        getByTitleAndMaxFlow,
        getMinOfVmax,
        getMaxOfVmax
    };

    /**
     * This is a special calculation for ruleset 2, but can be extended for other rulesets as well (if needed)
     * Special case here is the check for KV instead of vMax and the switching points are not
     * exactly in the middle of two values. Instead we use a 2% modification for leftBufferLength
     *
     * @param {Object} valve
     * @param {Number} kv
     * @returns {String}
     */
    function getByTitleAndKv(valve, kv) {
        let title = valve.title;
        let result = null;

        if (!title || title.length === 0 || !_.isNumber(kv) || kv <= 0) {
            return result;
        }

        for (const pattern in mapKV) {
            const regExp = new RegExp(pattern, 'i');
            const matches = title.match(regExp);
            if (matches && matches.length > 0 && mapKV.hasOwnProperty(pattern)) {
                const positionsMap = mapKV[pattern];
                const rightIndex =_.findIndex(positionsMap, (position) => {
                    return (kv <= position.kv);
                });
                if (rightIndex < 0) {
                    result = _.last(positionsMap); // means no clip position
                    break;
                }

                const rightPosition = positionsMap[rightIndex];
                const leftPosition = (rightIndex > 0) ? positionsMap[rightIndex - 1] : null;
                if (leftPosition && rightPosition) {
                    // round is needed for solving http://floating-point-gui.de/
                    const leftBufferLength = _.round( ((leftPosition.kv + rightPosition.kv) / 2) * 1.02, 10);
                    result = (kv < leftBufferLength) ? leftPosition : rightPosition;
                } else {
                    result = rightPosition;
                }
                break;
            }
        }
        return result;
    }

    /**
     * @param {Object} valve
     * @param {Number} maxFlow
     * @returns {String}
     */
    function getByTitleAndMaxFlow(valve, maxFlow) {
        let title = valve.title;

        let result = '';
        if (!title || title.length === 0 || !_.isNumber(maxFlow) || maxFlow <= 0) {
            return result;
        }

        for (const pattern in map) {
            const regExp = new RegExp(pattern, 'i');
            const matches = title.match(regExp);
            if (matches && matches.length > 0 && map.hasOwnProperty(pattern)) {
                const positionsMap = map[pattern];
                const rightIndex =_.findIndex(positionsMap, (position) => {
                    return (maxFlow <= position.vMax);
                });
                if (rightIndex < 0) {
                    result = _.last(positionsMap).clipPosition; // means no clip position
                    break;
                }

                let position = null;
                const rightPosition = positionsMap[rightIndex];
                const leftPosition = (rightIndex > 0) ? positionsMap[rightIndex - 1] : null;
                if (leftPosition && rightPosition) {
                    // round is needed for solving http://floating-point-gui.de/
                    const leftBufferLength = _.round((leftPosition.vMax + rightPosition.vMax) / 2, 10);
                    position = (maxFlow < leftBufferLength) ? leftPosition : rightPosition;
                } else {
                    position = rightPosition;
                }
                result = (position) ? position.clipPosition : '0';
                break;
            }
        }
        return result;
    }

    function getMinOfVmax()
    {
        let minValue = null;
        for (const key in map) {
            const value = _.min(_.map(map[key], item => item.vMax));
            if (minValue === null || value < minValue) {
                minValue = value;
            }
        }
        return minValue;
    }

    function getMaxOfVmax()
    {
        let maxValue = null;
        for (const key in map) {
            const value = _.max(_.map(map[key], item => item.vMax));
            if (maxValue === null || value > maxValue) {
                maxValue = value;
            }
        }
        return maxValue;
    }
});

export default ValveClipPositionReference();
