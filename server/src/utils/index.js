/**
 * Get object's own property value if exists;
 * Otherwise returns undefined.
 * @param {String} propName - Object prop name
 * @param {Object} primObj - Primary object
 * @param {Object} secObj - Secondary object
 * @return {Any}
 */
function getObjOwnProp(
  propName = '',
  primObj = {},
  secObj = {}
) {
  return primObj.hasOwnProperty(propName)
    ? primObj[propName]
    : secObj[propName];
}

/**
 * Get object's won property values if they exists;
 * @param {Object[]} propNames
 * @param {Object} primObj
 * @param {Object} secObj
 */
function getObjOwnProps(
  propNames = [],
  primObj = {},
  secObj = {}
) {
  return propNames.reduce(
    (acc, propName) => {
      const propValue = getObjOwnProp(propName, primObj, secObj);

      if (propValue !== undefined) {
        acc[propName] = propValue;
      }

      return acc;
    },
    {}
  );
}

/**
 * Check if value is plain object
 * @param {*} value
 * @returns {Boolean}
 */
function isObject(value) {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

module.exports = {
  getObjOwnProp,
  getObjOwnProps,
  isObject
};
