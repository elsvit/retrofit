import _ from 'lodash';

/**
 * Thunks for operating over raw data to get results needed for external API
 */
export default class {
    /**
     * Create initial set of records from stored data
     * @param {String} setName
     * @returns {Array}
     */
    createFilterableRecords(setName) {

        let records = [];

        switch (setName) {

            case 'air':
                records = require('./air_and_actuator.json');
                break;

            case 'water':
                records = require('./water_and_actuator.json');
                break;

        }

        return records;
    }

    /**
     * External API. Take records and apply filters in passed order over them
     * @param {String} setName
     * @param {String} parameters
     * @returns {Array}
     */
    getFilteredRecords(setName, parameters) {
        let records = this.createFilterableRecords(setName);
        records = _.filter(records, function(record) {
            for (let name in parameters) {
                // (['val1', 'val2'], 'val2') => true
                if (!_.includes(parameters[name], record[name])) {
                    return false;
                }
            }
            return true;
        });
        return records;
    }

    /**
     * External API. Get some data about filtered records
     * @param {String} setName
     * @param {Object} parameters
     * @returns {Object}
     */
    getFilteredRecordsMetadata(setName, parameters) {
        let metadata = {
            uniqueValues: {},
            amount: 0
        };

        let records = this.getFilteredRecords(setName, parameters);
        let fields = [];
        if (records[0]) {
            fields = Object.keys(records[0]);
        }

        for (let field of fields) {
            if (field.startsWith(setName)) {
                metadata.uniqueValues[field] = _.uniq(_.pluck(records, field))
            }
        }

        metadata.amount = records.length;

        return metadata;
    }
}
