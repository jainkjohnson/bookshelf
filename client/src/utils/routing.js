/**
 * Update base url with query parameters
 * eg: getUrlWithQueryParams(www.somewhere.com, { a: '1', b: 'xxx' })
 *     gives the string => 'www.somewhere.com?a=1&b=xxx'
 * @param {String} base
 * @param {Object} [queryData={}]
 * @returns {String} base url with queries
 */
export function getUrlWithQueryParams(base, queryData = {}) {
  const queries = Object.keys(queryData);

  return queries.reduce((acc, query, index) => {
    const qry = encodeURIComponent(query);
    const val = encodeURIComponent(queryData[query]);
    const url = `${acc}${qry}=${val}`;

    return index + 1 < queries.length ? `${url}&` : url;
  }, `${base}?`);
}

export function redirect(path = '') {
  const { origin, search } = window.location;

  window.location.assign(`${origin}${path}${search}`);
}
