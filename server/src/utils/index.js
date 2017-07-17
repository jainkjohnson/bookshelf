/**
 * Get object's own property if exists, otherwise
 * returns property from secondary object
 * @param {String} propName - Object prop name
 * @param {Object} obj1 - Primary object
 * @param {Object} obj2 - Secondary object
 */
function getObjOwnProp(propName, obj1, obj2) {
  return obj1.hasOwnProperty(propName)
    ? obj1[propName]
    : obj2[propName]
}

module.exports = {
  getObjOwnProp
}
