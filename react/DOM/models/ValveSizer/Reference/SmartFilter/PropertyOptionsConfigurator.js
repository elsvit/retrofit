import _ from 'lodash';

let PropertyOptionsConfigurator = function () {};

PropertyOptionsConfigurator.prototype = {
    map: {},
    tree: {},

    constructor: PropertyOptionsConfigurator,

    /**
     * @param {json} map
     * @param {json} tree
     * @returns {Function} No result after dispatching
     */
    init: function (map, tree) {
        this.map = map;
        this.tree = tree;
    },

    convertPropertyOptionValuesToTreeNodes: function (property, values) {
        let nodes = [];

        for (let value of values) {
            nodes = _.concat(nodes, this.map[property][value]);
        }

        return nodes;
    },

    findNodeByName: function (nodeName) {
        return (this.tree[nodeName]) ? this.tree[nodeName] : null;
    },

    findPath: function (nodeName) {
        let parents = this.findAllParents(nodeName);
        let children = this.findAllChildren(nodeName);
        return _.union(parents, [nodeName], children);
    },

    findParent: function (nodeName) {
        let parent = null;
        let node = this.findNodeByName(nodeName);

        if (node && node.parent) {
            parent = node.parent;
        }

        return parent;
    },

    findAllParents: function (nodeName) {
        let allParents = [];

        let parent = this.findParent(nodeName);
        if (parent) {
            allParents.push(parent);
            allParents = _.union(allParents, this.findAllParents(parent));
        }

        return allParents;
    },

    findChildren: function (nodeName) {
        let children = [];
        let node = this.findNodeByName(nodeName);

        if (node && node.children.length > 0) {
            children = _.union(children, node.children);
        }

        return children;
    },

    findAllChildren: function (nodeName) {
        let allChildren = [];

        let children = this.findChildren(nodeName);
        if (children.length > 0) {
            allChildren = _.concat(allChildren, children);
            for (let child of children) {
                allChildren = _.union(allChildren, this.findAllChildren(child));
            }
        }

        return allChildren;
    },

    pathsNodes: function (property, values) {
        let currentNodes = this.convertPropertyOptionValuesToTreeNodes(property, values);

        // get path nodes by normalized tree
        let paths = [];
        for (let currentNode of currentNodes) {
            let path = this.findPath(currentNode);
            paths = _.union(paths, path);
        }

        return paths;
    },

    /**
     * @param {Object} propertiesWithValues - collection of { propertyName: values[] }
     * @param {Object} allProperties - collection of { propertyName: { values: [], options: [{ name: "name", label: "label", enabled: boolean }] } }
     * @returns {Object} - collection of { propertyName: { options: [{ name: "name", label: "label", enabled: boolean }] } }
     * @throws {Object} - { name: "PropertyOptionsMapperException", message: message, "propertyName": value }
     */
    getPropertyOptionsMapByValues: function (propertiesWithValues, allProperties) {
        // get path nodes by values
        let totalPathNodes = [];
        for (const propertyName in propertiesWithValues) {
            const values = propertiesWithValues[propertyName];
            const paths = this.pathsNodes(propertyName, values);
            totalPathNodes = (totalPathNodes.length === 0) ? _.union(totalPathNodes, paths) : _.intersection(totalPathNodes, paths);
        }

        // convert path nodes to property options map
        let optionsMap = {};
        for (const propertyName in allProperties) {
            let options = [];
            let hasEnabledOptions = false;
            for (const option of (allProperties[propertyName]).options) {
                let optionNodes = (this.map[propertyName][option.name]) ? this.map[propertyName][option.name] : [];
                option.enabled = (_.intersection(optionNodes, totalPathNodes)).length > 0;
                options.push(option);

                hasEnabledOptions = hasEnabledOptions || option.enabled;
            }
            optionsMap[propertyName] = { options: options };

            if (!hasEnabledOptions) {
                if (propertiesWithValues[propertyName]) {
                    delete propertiesWithValues[propertyName];
                }
                return this.getPropertyOptionsMapByValues(propertiesWithValues, allProperties);
            }
        }

        return optionsMap;
    }
};

export default new PropertyOptionsConfigurator();
