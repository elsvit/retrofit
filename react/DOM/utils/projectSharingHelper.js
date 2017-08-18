const Base64 = require('js-base64').Base64;

export const ProjectName = {
    encode: name => Base64.encode(name).replace(/\+/g, '[').replace(/\//g, ']').replace(/=/g, '_'),
    decode: encoded => Base64.decode(encoded.replace(/\[/g, '+').replace(/]/g, '/').replace(/_/g, '='))
};

const projectItemTypeToProductIdPrefixMap = {
    'air.product': 'rar', // retrofit air replacement
    'water.product': 'rwr', // retrofit water replacement
    'air.accessory': 'raa', // retrofit air accessory
    'water.accessory': 'rwa', // retrofit water accessory
    'valve': 'vv', // valve-sizer valve
    'actuator': 'va' // valve-sizer actuator
};

/**
 * @param {array} projectItems
 * @return {array}
 */
export const encodeProjectSharingProductIds = projectItems => {
    return projectItems.map(projectItem => {
        const prefix = (projectItemTypeToProductIdPrefixMap[projectItem.type] || '');
        return (prefix.length > 0) ? `${prefix}-${projectItem.product.id}` : projectItem.product.id;
    });
};

/**
 * @param {array} encodedProductIds
 * @return {object}
 */
export const decodeProjectSharingProductIds = encodedProductIds => {
    const decodedProductIds = {};
    encodedProductIds.map(encodedProductId => {
        const decodedData = decodeProjectSharingProductId(encodedProductId);
        if (decodedData !== undefined) {
            if (decodedProductIds[decodedData.type] === undefined) {
                decodedProductIds[decodedData.type] = [];
            }
            decodedProductIds[decodedData.type].push(decodedData.id);
        }
    });
    return decodedProductIds;
};

/**
 * @param {string} encodedProductId
 * @return {object}
 */
export const decodeProjectSharingProductId = encodedProductId => {
    const matches = encodedProductId.match(/^([a-zA-Z]+)-(\d+)$/i);
    if (!matches || matches[1] === undefined || matches[2] === undefined) {
        return 0;
    }

    const encodedType = matches[1];
    const decodedProductId = matches[2];
    const decodedType = decodeProductType(encodedType);

    if (decodedType.length > 0 && decodedProductId.length > 0) {
        return {
            type: decodedType,
            id: decodedProductId
        };
    }

    return undefined;
};

/**
 * @param {string} encodedProductType
 * @return {string}
 */
const decodeProductType = encodedProductType => {
    const decodedProductType = Object.keys(projectItemTypeToProductIdPrefixMap).find((productType) => {
        return (projectItemTypeToProductIdPrefixMap[productType] === encodedProductType);
    });
    return (decodedProductType !== undefined) ? decodedProductType : '';
};

/**
 * @param {string} name
 * @param {array} existedNames
 * @return {string}
 */
export const getUniqueName = (name, existedNames) => {
    const checkNameExistence = (name, existedNames) => {
        const foundNames = existedNames.filter(n => (n === name));
        return (foundNames.length > 0);
    };

    const generateNewNameIfNeeded = (name, existedNames, version = 0) => {
        if (checkNameExistence(name, existedNames) === false) {
            return name;
        }

        const replacePattern = "( \\(" + version + "\\))$";
        const originalName = name.replace(new RegExp(replacePattern), '');
        const newName = `${originalName} (${(version + 1)})`;

        return generateNewNameIfNeeded(newName, existedNames, version + 1);
    };

    const currentName = name.trim();

    return generateNewNameIfNeeded(currentName, existedNames);
};
